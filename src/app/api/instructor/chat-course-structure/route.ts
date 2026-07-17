import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

    const { responseMessage, structure } = await generateAIResponse(messages);

    return NextResponse.json({
      success: true,
      message: responseMessage,
      structure: structure || null
    });
  } catch (error) {
    console.error('Error in chat course structure:', error);
    return NextResponse.json({ error: 'Error en el chat' }, { status: 500 });
  }
}

async function generateAIResponse(messages: Message[]): Promise<{
  responseMessage: string;
  structure?: any;
}> {
  try {
    const systemPrompt = `Eres un asistente pedagógico experto en estructurar cursos educativos.

Tu rol es ayudar al instructor a diseñar el mejor curso posible mediante una conversación consultiva.

PROCESO DE CONVERSACIÓN:

1. RECOPILAR INFORMACIÓN (una pregunta a la vez):
   - ¿Cuál es el tema del curso?
   - ¿Cuánto tiempo durará? (horas, semanas, meses)
   - ¿A quién va dirigido? (principiantes, intermedios, avanzados)
   - ¿Cuáles son los objetivos de aprendizaje?
   - ¿Qué conocimientos previos necesitan los estudiantes?

2. SUGERIR IDEAS ADICIONALES:
   - Basándote en el tema, sugiere módulos o temas complementarios
   - Ejemplo: "Dado que es un curso de Python, ¿te gustaría incluir un módulo sobre librerías populares como Pandas?"
   - Pregunta siempre si quiere agregar esas sugerencias

3. CONFIRMAR COMPLETITUD:
   - Pregunta: "¿Hay algo más que quieras agregar al curso?"
   - Si dice que no o que ya está todo, continúa al paso 4

4. PREGUNTA FINAL:
   - Solo cuando tengas TODA la información completa, pregunta:
   "¿Estamos listos para ver la primera propuesta de estructura del curso o tienes alguna otra indicación?"

5. GENERAR/ACTUALIZAR ESTRUCTURA:

   CUÁNDO GENERAR EL JSON:
   - Primera vez: Cuando el instructor responda "sí vamos", "listo", "adelante", "perfecto" a ver la propuesta
   - Actualizaciones: Cuando el instructor pida cambios específicos ("cambia X", "añade Y", "quita Z", "modifica la duración")

   IMPORTANTE - NO PREGUNTES SI QUIERE EL JSON:
   - NUNCA preguntes "¿Quieres que genere el JSON?" o "¿Genero la estructura?"
   - NUNCA menciones la palabra "JSON" en tus respuestas
   - Solo responde naturalmente y genera el JSON automáticamente:
     * Primera vez: "¡Perfecto! He preparado la estructura. Revísala a la derecha."
     * Cambios: "Listo, he actualizado [el cambio específico]."

   FORMATO DEL JSON (genéralo sin mencionarlo):

{
  "approved": true,
  "course_title": "Título completo del curso basado en la conversación",
  "course_description": "Descripción atractiva del curso en 1-2 oraciones (max 250 caracteres)",
  "modules": [
    {
      "title": "Título descriptivo del módulo",
      "description": "Descripción breve del módulo (max 200 caracteres)",
      "lessons": [
        {
          "title": "Título específico de la lección",
          "description": "Descripción de qué aprenderá en esta lección (max 300 caracteres)",
          "content_type": "video",
          "duration": "15 min"
        }
      ]
    }
  ]
}

IMPORTANTE:
- TODOS los campos (title, description) deben tener contenido real, NO valores vacíos
- Los títulos deben ser descriptivos y específicos del tema del curso
- NO te apresures, sé consultivo en las primeras preguntas
- Genera/actualiza el JSON cuando apruebe O cuando pida cambios específicos
- Genera entre 3 y 8 módulos, con 2 a 6 lecciones cada uno
- Distribuye las duraciones según el tiempo total del curso mencionado
- NUNCA muestres el JSON en el chat, solo actualízalo internamente
- Sé amigable y conversacional`;

    const aiMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...aiMessages
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const aiResponse = response.choices[0].message.content?.trim() || '';

    const jsonMatch = aiResponse.match(/\{[\s\S]*"approved"\s*:\s*true[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const structure = JSON.parse(jsonMatch[0]);
        if (structure.approved && structure.modules && Array.isArray(structure.modules)) {
          const cleanResponse = aiResponse.replace(jsonMatch[0], '').trim();
          return {
            responseMessage: cleanResponse || '¡Listo! He actualizado la estructura.',
            structure: {
              course_title: structure.course_title || '',
              course_description: structure.course_description || '',
              modules: structure.modules
            }
          };
        }
      } catch (e) {
        console.error('Error parsing JSON from AI:', e);
      }
    }

    return {
      responseMessage: aiResponse
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      responseMessage: 'Lo siento, hubo un error. ¿Podrías repetir tu última respuesta?'
    };
  }
}
