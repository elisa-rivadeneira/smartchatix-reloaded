import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { YoutubeTranscript } from 'youtube-transcript';
// Import directo al módulo interno: el index.js de pdf-parse ejecuta código
// de debug al cargar (lee un PDF de prueba) cuando lo bundlean Webpack/Turbopack,
// lo cual rompe el build. lib/pdf-parse.js no tiene ese problema.
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/watch')) {
    try {
      return new URL(url).searchParams.get('v') || '';
    } catch {
      return '';
    }
  }
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  if (url.includes('youtube.com/embed/')) {
    return url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  return url;
}

// Cachea el access_token en memoria del proceso: dura ~1h, no hace falta pedirlo en cada request.
let cachedYouTubeAccessToken: { token: string; expiresAt: number } | null = null;

async function getYouTubeAccessToken(): Promise<string | null> {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  if (cachedYouTubeAccessToken && cachedYouTubeAccessToken.expiresAt > Date.now()) {
    return cachedYouTubeAccessToken.token;
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!response.ok) {
    console.error('Error renovando access token de YouTube:', await response.text());
    return null;
  }
  const data = await response.json();
  if (!data.access_token) return null;

  cachedYouTubeAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

// Los .srt/.vtt traen números de secuencia, timestamps y tags de estilo; nos quedamos solo con el texto.
function extractPlainTextFromCaptionFile(raw: string): string {
  return raw
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'WEBVTT') return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (/\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->/.test(trimmed)) return false;
      return true;
    })
    .join(' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Vía oficial: solo funciona para videos del canal que autorizó YOUTUBE_OAUTH_REFRESH_TOKEN
// (ver youtube-oauth-setup.mjs). No depende de scraping, así que no se rompe cuando YouTube
// cambia su página ni se bloquea por región/IP.
async function getOfficialYouTubeTranscript(videoId: string): Promise<string | null> {
  const accessToken = await getYouTubeAccessToken();
  if (!accessToken) return null;

  const listResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  // 403 = el video no es de la cuenta autorizada, 404 = no existe. En ambos casos, fallback.
  if (!listResponse.ok) return null;
  const listData = await listResponse.json();
  const tracks: Array<{ id: string; snippet?: { language?: string } }> = listData.items || [];
  if (tracks.length === 0) return null;

  const track = tracks.find((t) => t.snippet?.language?.startsWith('es')) || tracks[0];

  const downloadResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/captions/${track.id}?tfmt=srt`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!downloadResponse.ok) return null;
  const raw = await downloadResponse.text();
  return extractPlainTextFromCaptionFile(raw) || null;
}

async function getVideoTranscriptContent(videoUrl: string): Promise<string> {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    throw new Error('URL de YouTube inválida');
  }

  try {
    const officialText = await getOfficialYouTubeTranscript(videoId);
    if (officialText) return officialText;
  } catch (err) {
    console.error('Error leyendo transcripción por la API oficial de YouTube, se intenta lectura automática:', err);
  }

  // Fallback: lectura automática no oficial (scraping), para videos que no son de nuestro canal.
  let segments;
  try {
    segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'es' });
  } catch {
    try {
      segments = await YoutubeTranscript.fetchTranscript(videoId);
    } catch {
      segments = undefined;
    }
  }
  const text = segments?.map((s) => s.text).join(' ').replace(/\s+/g, ' ').trim();
  if (!text) {
    throw new Error('No se pudo leer la transcripción de este video. Puede ser un bloqueo temporal de YouTube (intenta de nuevo en unos minutos) o que el video realmente no tenga subtítulos. Mientras tanto, prueba con la fuente "Lección" o "Material".');
  }
  return text;
}

async function getMaterialContent(documentsUrls: string[]): Promise<string> {
  const pdfUrls = (documentsUrls || []).filter((u) => /\.pdf($|\?)/i.test(u));
  if (pdfUrls.length === 0) {
    throw new Error('No se encontró ningún archivo PDF en el material de esta lección. Sube un .pdf para generar preguntas desde el material.');
  }

  const texts: string[] = [];
  for (const url of pdfUrls) {
    const fileResponse = await fetch(url);
    if (!fileResponse.ok) continue;
    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    try {
      const parsed = await pdfParse(buffer);
      if (parsed.text?.trim()) {
        texts.push(parsed.text.trim());
      }
    } catch (err) {
      console.error('Error parsing PDF:', url, err);
    }
  }

  const combined = texts.join('\n\n---\n\n').trim();
  if (!combined) {
    throw new Error('No se pudo extraer texto de los PDFs subidos. Asegúrate de que no sean documentos escaneados como imagen.');
  }
  return combined;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'instructor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { source, videoUrl, documentsUrls, questionsCount, existingQuestions, improveQuestion, generalInstructions } = body;
    let { content } = body;

    if (!questionsCount) {
      return NextResponse.json({ error: 'Número de preguntas requerido' }, { status: 400 });
    }

    if (source === 'video') {
      try {
        content = await getVideoTranscriptContent(videoUrl);
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Error al obtener la transcripción del video' }, { status: 400 });
      }
    } else if (source === 'material') {
      try {
        content = await getMaterialContent(documentsUrls);
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Error al leer el material PDF' }, { status: 400 });
      }
    }

    if (!content) {
      return NextResponse.json({ error: 'Contenido y número de preguntas requeridos' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    let userPrompt = '';

    if (improveQuestion) {
      const generalInstructionsText = generalInstructions
        ? `\n🚨🚨🚨 INSTRUCCIONES ABSOLUTAMENTE OBLIGATORIAS DEL INSTRUCTOR - NO OPCIONAL - CUMPLIMIENTO OBLIGATORIO 🚨🚨🚨:\n${generalInstructions}\n\n⛔⛔⛔ ADVERTENCIA CRÍTICA: Estas instrucciones NO son sugerencias. Son REQUISITOS ABSOLUTOS que DEBES cumplir EN CADA RESPUESTA. Si no las cumples, tu respuesta será RECHAZADA. ⛔⛔⛔\n\n📋 EJEMPLO OBLIGATORIO de cómo DEBES escribir las explicaciones de respuestas correctas cuando las instrucciones piden ejemplos completos:\n\n❌ MAL (NO hagas esto - explicación vaga):\n"Esta es la respuesta correcta porque el prompt tiene Rol y Tarea, pero le faltan Contexto, Formato y Restricciones."\n\n✅ BIEN (SÍ haz esto - explicación con ejemplo completo y detallado):\n"Esta es la respuesta correcta porque al prompt actual le faltan varios componentes esenciales. Un prompt completo y bien estructurado sería:\n\n'Actúa como un experto en marketing digital con 10 años de experiencia en campañas de redes sociales (ROL). Crea una campaña publicitaria completa para Facebook (TAREA). Somos una empresa de zapatos deportivos ubicada en Lima, Perú. Nuestro público objetivo son jóvenes profesionales de 25 a 35 años con ingresos medios-altos que valoran la calidad y el estilo. Actualmente vendemos 500 pares al mes y queremos aumentar un 30% (CONTEXTO). La campaña debe incluir: 5 posts con copy y descripción de imágenes, segmentación de audiencia detallada, presupuesto sugerido y KPIs a medir (FORMATO). No uses lenguaje muy técnico, debe ser comprensible para el equipo de ventas. Presupuesto máximo: $2000. Tiempo de campaña: 30 días (RESTRICCIONES).'\n\nNota cómo este ejemplo incluye TODOS los componentes:\n- ROL: experto en marketing digital con experiencia específica\n- TAREA: crear campaña publicitaria completa\n- CONTEXTO: tipo de empresa, ubicación, público objetivo, situación actual\n- FORMATO: qué debe contener la respuesta (posts, segmentación, presupuesto, KPIs)\n- RESTRICCIONES: limitaciones de lenguaje, presupuesto y tiempo"\n\n🎯 DEBES incluir ejemplos así de COMPLETOS y DETALLADOS en TODAS las explicaciones de respuestas correctas. NO es opcional.\n`
        : '';

      userPrompt = `A partir del siguiente contenido de una lección y una pregunta existente, MEJORA la pregunta considerando las observaciones del instructor.
${generalInstructionsText}
CONTENIDO DE LA LECCIÓN:
${content}

PREGUNTA ACTUAL:
${improveQuestion.currentQuestion.question}

OPCIONES ACTUALES:
${Object.entries(improveQuestion.currentQuestion.options).map(([key, value]) => `${key}) ${value}`).join('\n')}
RESPUESTA CORRECTA ACTUAL: ${improveQuestion.currentQuestion.correct}

OBSERVACIONES DEL INSTRUCTOR PARA ESTA PREGUNTA:
${improveQuestion.observations}

INSTRUCCIONES:
- MANTÉN el enfoque de la pregunta actual pero MEJÓRALA según las observaciones
- La pregunta debe tener 4 opciones (A, B, C, D)
- Solo UNA opción debe ser correcta
- Las opciones deben ser realistas y coherentes
- Considera la memoria de la pregunta anterior y las observaciones para mejorarla
- La pregunta puede tener el largo necesario para ser clara (3-4 líneas está bien)
- IMPORTANTE: Debes generar explicaciones para TODAS las opciones (correcta e incorrectas)
- Las explicaciones de opciones incorrectas deben ser MUY ESPECÍFICAS:
  * Indica EXACTAMENTE qué está mal en esa opción
  * Compara con la respuesta correcta
  * Explica qué concepto se malinterpretó
- Responde ÚNICAMENTE con un JSON válido, sin texto adicional

FORMATO DE RESPUESTA (JSON):
{
  "questions": [
    {
      "question": "texto de la pregunta mejorada (puede ser más larga para ser clara)",
      "options": {
        "A": "opción A",
        "B": "opción B",
        "C": "opción C",
        "D": "opción D"
      },
      "correct": "A",
      "explanations": {
        "A": "Esta es la respuesta correcta porque [explicar qué falta]. Un prompt completo y correcto sería:\n\n'[AQUÍ DEBES ESCRIBIR EL PROMPT COMPLETO CON TODOS LOS DETALLES: Rol específico con años de experiencia, Tarea detallada, Contexto amplio con datos de la empresa/situación, Formato específico de lo que debe entregar, Restricciones claras de presupuesto/tiempo/lenguaje]'\n\nEste ejemplo incluye:\n- ROL: [describir el rol del ejemplo]\n- TAREA: [describir la tarea del ejemplo]\n- CONTEXTO: [describir el contexto del ejemplo]\n- FORMATO: [describir el formato del ejemplo]\n- RESTRICCIONES: [describir las restricciones del ejemplo]",
        "B": "Esta opción es incorrecta porque menciona [elemento equivocado]. La correcta es [elemento correcto] porque [explicación].",
        "C": "Esta opción es incorrecta porque [razón]. Aunque [posible confusión], el contenido establece que [concepto correcto].",
        "D": "Esta opción es incorrecta porque [razón]. La diferencia clave es [comparación con la correcta]."
      }
    }
  ]
}`;
    } else {
      const existingQuestionsText = existingQuestions && existingQuestions.length > 0
        ? `\n\nPREGUNTAS EXISTENTES (NO generes preguntas similares a estas):\n${existingQuestions.map((q: any, i: number) => `${i + 1}. ${q.question}`).join('\n')}`
        : '';

      const generalInstructionsText = generalInstructions
        ? `\n🚨🚨🚨 INSTRUCCIONES ABSOLUTAMENTE OBLIGATORIAS DEL INSTRUCTOR - NO OPCIONAL - CUMPLIMIENTO OBLIGATORIO 🚨🚨🚨:\n${generalInstructions}\n\n⛔⛔⛔ ADVERTENCIA CRÍTICA: Estas instrucciones NO son sugerencias. Son REQUISITOS ABSOLUTOS que DEBES cumplir EN CADA RESPUESTA. Si no las cumples, tu respuesta será RECHAZADA. ⛔⛔⛔

📋 EJEMPLO OBLIGATORIO de cómo DEBES escribir las explicaciones de respuestas correctas cuando las instrucciones piden ejemplos completos:

❌ MAL (NO hagas esto - explicación vaga):
"Esta es la respuesta correcta porque el prompt tiene Rol y Tarea, pero le faltan Contexto, Formato y Restricciones."

✅ BIEN (SÍ haz esto - explicación con ejemplo completo y detallado):
"Esta es la respuesta correcta porque al prompt actual le faltan varios componentes esenciales. Un prompt completo y bien estructurado sería:\n\n'Actúa como un experto en marketing digital con 10 años de experiencia en campañas de redes sociales (ROL). Crea una campaña publicitaria completa para Facebook (TAREA). Somos una empresa de zapatos deportivos ubicada en Lima, Perú. Nuestro público objetivo son jóvenes profesionales de 25 a 35 años con ingresos medios-altos que valoran la calidad y el estilo. Actualmente vendemos 500 pares al mes y queremos aumentar un 30% (CONTEXTO). La campaña debe incluir: 5 posts con copy y descripción de imágenes, segmentación de audiencia detallada, presupuesto sugerido y KPIs a medir (FORMATO). No uses lenguaje muy técnico, debe ser comprensible para el equipo de ventas. Presupuesto máximo: $2000. Tiempo de campaña: 30 días (RESTRICCIONES).'\n\nNota cómo este ejemplo incluye TODOS los componentes:\n- ROL: experto en marketing digital con experiencia específica\n- TAREA: crear campaña publicitaria completa\n- CONTEXTO: tipo de empresa, ubicación, público objetivo, situación actual\n- FORMATO: qué debe contener la respuesta (posts, segmentación, presupuesto, KPIs)\n- RESTRICCIONES: limitaciones de lenguaje, presupuesto y tiempo"

🎯 DEBES incluir ejemplos así de COMPLETOS y DETALLADOS en TODAS las explicaciones de respuestas correctas. NO es opcional.\n`
        : '';

      userPrompt = `A partir del siguiente contenido de una lección, genera exactamente ${questionsCount} pregunta(s) de opción múltiple para evaluar la comprensión del estudiante.
${generalInstructionsText}
CONTENIDO DE LA LECCIÓN:
${content}${existingQuestionsText}

INSTRUCCIONES:
- Genera exactamente ${questionsCount} pregunta(s)
- Cada pregunta debe tener 4 opciones (A, B, C, D)
- Solo UNA opción debe ser correcta
- Las preguntas deben evaluar comprensión real, no memorización
- Las opciones deben ser realistas y coherentes con lo que escribiría un ser humano promedio
- La pregunta puede tener el largo necesario para ser clara y completa (3-4 líneas está bien si hace falta)
- IMPORTANTE: Si la pregunta menciona "componentes" o elementos múltiples, debe estar claro cuántos se piden
- Las preguntas deben ser autocontenidas y no referenciar documentos o contextos que no están incluidos en la pregunta misma
- Si mencionas un concepto técnico, asegúrate de que esté explicado en el contenido de la lección
- Las opciones incorrectas (distractores) deben ser errores comunes que los estudiantes cometerían
- CRÍTICO: Debes generar explicaciones pedagógicas para TODAS las opciones (correcta e incorrectas)
- Las explicaciones deben ayudar al estudiante a APRENDER, no solo a saber si acertó o no
- La explicación de la correcta debe explicar el "por qué" basándose en el contenido de la lección
- Las explicaciones de las incorrectas deben ser MUY ESPECÍFICAS:
  * Deben indicar EXACTAMENTE qué está mal en esa opción
  * Deben comparar con la respuesta correcta
  * Deben explicar qué concepto del contenido se malinterpretó
  * Ejemplo: "Esta opción es incorrecta porque menciona X, pero según el contenido de la lección, en realidad es Y. La confusión puede venir de Z."
${existingQuestions && existingQuestions.length > 0 ? '- NO generes preguntas similares a las existentes mostradas arriba' : ''}
- Responde ÚNICAMENTE con un JSON válido, sin texto adicional

FORMATO DE RESPUESTA (JSON):
{
  "questions": [
    {
      "question": "texto de la pregunta (puede ser más larga para ser clara)",
      "options": {
        "A": "opción A",
        "B": "opción B",
        "C": "opción C",
        "D": "opción D"
      },
      "correct": "A",
      "explanations": {
        "A": "Esta es la respuesta correcta porque [explicar qué falta]. Un prompt completo y correcto sería:\n\n'[AQUÍ DEBES ESCRIBIR EL PROMPT COMPLETO CON TODOS LOS DETALLES: Rol específico con años de experiencia, Tarea detallada, Contexto amplio con datos de la empresa/situación, Formato específico de lo que debe entregar, Restricciones claras de presupuesto/tiempo/lenguaje]'\n\nEste ejemplo incluye:\n- ROL: [describir el rol del ejemplo]\n- TAREA: [describir la tarea del ejemplo]\n- CONTEXTO: [describir el contexto del ejemplo]\n- FORMATO: [describir el formato del ejemplo]\n- RESTRICCIONES: [describir las restricciones del ejemplo]",
        "B": "Esta opción es incorrecta porque menciona [elemento equivocado]. La respuesta correcta incluye [elemento correcto] en lugar de [elemento equivocado], ya que según el contenido [explicación del concepto].",
        "C": "Esta opción es incorrecta porque [razón específica]. Aunque [posible confusión], la lección establece claramente que [concepto correcto].",
        "D": "Esta opción es incorrecta porque [razón específica]. La diferencia clave es que [comparación con la correcta]."
      }
    }
  ]
}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en educación online. Generas preguntas de opción múltiple claras, precisas y realistas para evaluar la comprensión de los estudiantes. Cuando mejoras una pregunta, mantienes su esencia pero la haces más clara y con opciones más coherentes.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error('Error de OpenAI:', await response.text());
      return NextResponse.json({ error: 'Error al generar preguntas' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let questionsData;
    try {
      questionsData = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Error parsing AI response:', aiResponse);
      return NextResponse.json({ error: 'Error al procesar respuesta de IA' }, { status: 500 });
    }

    return NextResponse.json(questionsData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
