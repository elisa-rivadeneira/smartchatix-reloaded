import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const { content, duration, title } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Contenido inválido' }, { status: 400 });
    }

    const structure = await parseWithAI(content, duration || '', title || '');

    return NextResponse.json({ success: true, structure });
  } catch (error) {
    console.error('Error parsing course structure:', error);
    return NextResponse.json({ error: 'Error al procesar estructura' }, { status: 500 });
  }
}

async function parseWithAI(content: string, duration: string, courseTitle: string) {
  try {
    const durationContext = duration
      ? `\n\nDuración total del curso: ${duration}\nDistribuye el tiempo proporcionalmente entre módulos y lecciones. Calcula duraciones realistas para cada lección basándote en la duración total.`
      : '\nAsigna duraciones estimadas a cada lección (entre 10 y 30 minutos).';

    const titleContext = courseTitle
      ? `\n\nTítulo del curso: ${courseTitle}`
      : '';

    const prompt = `Analiza el siguiente contenido educativo y extrae la estructura del curso en formato JSON.${titleContext}

Identifica:
- Los módulos principales (temas grandes, secciones principales)
- Las lecciones dentro de cada módulo (subtemas, tópicos específicos)
- Descripción de cada módulo y lección basada en el contenido
- Descripción general del curso (1-2 oraciones que resuman de qué trata el curso)
- Duración de cada lección${durationContext}

Contenido:
${content}

Responde ÚNICAMENTE con un JSON válido en este formato exacto (sin texto adicional):
{
  "course_description": "Descripción general del curso basada en el contenido (max 250 caracteres)",
  "modules": [
    {
      "title": "Título del módulo extraído del contenido",
      "description": "Descripción breve del módulo basada en el contenido (max 200 caracteres)",
      "lessons": [
        {
          "title": "Título de la lección extraído del contenido",
          "description": "Descripción de la lección basada en el contenido (max 300 caracteres)",
          "content_type": "video",
          "duration": "XX min"
        }
      ]
    }
  ]
}

Reglas:
- Extrae entre 3 y 8 módulos según el contenido
- Cada módulo debe tener entre 2 y 6 lecciones
- Usa los títulos exactos que encuentres en el contenido
- Si no hay estructura clara, organiza el contenido de forma lógica
- Las descripciones deben resumir el contenido real, no ser genéricas
- La descripción del curso debe ser atractiva y explicar claramente qué aprenderá el estudiante
- IMPORTANTE: Calcula la duración de cada lección de forma que la suma total de todas las lecciones sea aproximadamente igual a la duración total del curso indicada`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en estructurar contenido educativo. Siempre respondes únicamente con JSON válido, sin texto adicional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const aiResponse = response.choices[0].message.content?.trim() || '';

    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró JSON válido en la respuesta');
    }

    const structure = JSON.parse(jsonMatch[0]);

    if (!structure.modules || !Array.isArray(structure.modules)) {
      throw new Error('Estructura inválida');
    }

    return structure;
  } catch (error) {
    console.error('Error parsing with AI:', error);
    return generateFallbackStructure(content);
  }
}

function generateFallbackStructure(content: string) {
  const words = content.split(/\s+/).length;
  const estimatedModules = Math.max(3, Math.min(8, Math.floor(words / 300)));
  const lessonsPerModule = Math.max(2, Math.min(5, Math.floor(words / (estimatedModules * 100))));

  const modules = [];
  for (let i = 1; i <= estimatedModules; i++) {
    const module: any = {
      title: `Módulo ${i}`,
      description: 'Contenido del módulo',
      lessons: []
    };

    for (let j = 1; j <= lessonsPerModule; j++) {
      module.lessons.push({
        title: `Lección ${i}.${j}`,
        description: 'Contenido de la lección',
        content_type: 'video',
        duration: '15 min'
      });
    }

    modules.push(module);
  }

  return { modules };
}

