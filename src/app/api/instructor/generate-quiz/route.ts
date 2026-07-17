import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

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

    const { content, questionsCount, existingQuestions, improveQuestion, generalInstructions } = await request.json();

    if (!content || !questionsCount) {
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
