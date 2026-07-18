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

    const { courseTitle, moduleName, lessonTitle, lessonDescription, previousLessons } = await request.json();

    if (!courseTitle || !moduleName || !lessonTitle) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: courseTitle, moduleName, lessonTitle' },
        { status: 400 }
      );
    }

    const prompt = `Eres un instructor experto en la creación de contenido educativo profesional.

**Curso:** ${courseTitle}
**Módulo:** ${moduleName}
**Lección:** ${lessonTitle}
${lessonDescription ? `**Descripción:** ${lessonDescription}` : ''}

${previousLessons && previousLessons.length > 0 ? `
**CONTEXTO IMPORTANTE - Lecciones previas del módulo:**

El estudiante ya ha completado las siguientes lecciones en este módulo:

${previousLessons.map((lesson: string, idx: number) => `${idx + 1}. ${lesson}`).join('\n')}

**IMPORTANTE:**
- NO repitas conceptos básicos que ya se explicaron en lecciones anteriores
- Asume que el estudiante ya conoce lo cubierto en las lecciones previas
- Puedes hacer referencias breves a lecciones anteriores si es necesario (ej: "Como vimos en la lección anterior...")
- Enfócate en avanzar con nuevo contenido, no en repasar lo ya visto
- Si necesitas mencionar un concepto previo, hazlo de forma muy breve y continúa con lo nuevo
` : ''}

Tu objetivo es crear una lección completa, clara y pedagógica para estudiantes que están aprendiendo este tema.

La lección debe tener una extensión aproximada entre 1000 y 1500 palabras. Nunca generes menos de 1000 palabras.

La estructura debe contener las siguientes secciones:

<h2>Introducción</h2>

- Explica el contexto del tema.
- Indica qué aprenderá el estudiante.
- Explica por qué este conocimiento es importante.
- Menciona aplicaciones reales.

<h2>Conceptos principales</h2>

- Desarrolla los conceptos de forma progresiva.
- Explica cada concepto antes de utilizarlo.
- Utiliza ejemplos sencillos para facilitar la comprensión.
- Relaciona los conceptos entre sí cuando sea pertinente.

<h2>Ejemplos prácticos</h2>

Incluye al menos tres ejemplos completos.

Cada ejemplo debe explicar:

- El contexto.
- El problema.
- La solución paso a paso.
- El resultado obtenido.
- La enseñanza que deja el ejemplo.

<h2>Mejores prácticas</h2>

Incluye recomendaciones profesionales como:

- Buenas prácticas.
- Errores comunes.
- Consejos para obtener mejores resultados.
- Recomendaciones de uso.

<h2>Puntos clave</h2>

Resume los aprendizajes más importantes mediante una lista de puntos concretos.

Escribe como si estuvieras impartiendo una clase presencial.

Dirígete ocasionalmente al estudiante utilizando expresiones como:

"Imagina que..."
"Piensa por un momento..."
"Probablemente te haya ocurrido..."
"Veamos un ejemplo."
"Ahora analicemos qué sucede."
"Lo importante aquí es entender que..."

Mantén un tono cercano, profesional y motivador.

<h2>Recursos adicionales</h2>

Recomienda herramientas, documentación oficial, tutoriales o recursos útiles para seguir aprendiendo.
Siempre que sea posible, introduce pequeñas historias o escenarios reales de empresas o profesionales que enfrenten el problema explicado.
No deben parecer casos de estudio extensos; basta con uno o dos párrafos que ayuden a contextualizar el aprendizaje.

No escribas como un manual técnico.
Escribe como un instructor experto que lleva años enseñando este tema y quiere mantener la atención del estudiante durante toda la lección.
La prioridad no es únicamente transmitir información, sino conseguir que el estudiante disfrute la lectura, comprenda los conceptos y termine con ganas de seguir aprendiendo.
Combina explicaciones, ejemplos, analogías, preguntas, consejos y pequeñas historias reales para hacer el contenido dinámico y agradable de leer.

REQUISITOS:

- Escribe en español neutro.
- Utiliza un lenguaje claro, profesional y fácil de entender.
- Explica los conceptos con profundidad pero sin repetir ideas.
- Mantén un flujo natural entre secciones.
- Utiliza ejemplos realistas y aplicables.
- Prioriza la calidad del contenido sobre la cantidad.
- No agregues texto de relleno.

FORMATO:

Devuelve únicamente HTML válido utilizando las siguientes etiquetas cuando sean necesarias:

<h2>
<h3>
<p>
<ul>
<ol>
<li>
<strong>
<em>

No utilices Markdown.

No incluyas <!DOCTYPE>, <html>, <head> ni <body>.

DISEÑO VISUAL DE LA LECCIÓN

La lección debe ser visualmente agradable y fácil de escanear.

No generes bloques enormes de texto.

Utiliza una combinación variada de elementos HTML para mantener el interés del estudiante.

A lo largo de la lección intercala naturalmente los siguientes componentes:

• Párrafos cortos (2-4 líneas máximo).

• Listas con viñetas.

• Listas numeradas.

• Cuadros informativos.

• Consejos destacados.

• Advertencias.

• Resúmenes.

• Citas relevantes.

• Tablas comparativas cuando aporten valor.

• Bloques de ejemplo.

• Preguntas de reflexión.

• Recuadros con datos interesantes.

• Pasos numerados.

• Separadores visuales.

Utiliza estas clases CSS para que el frontend pueda darles estilo:

<div class="lesson-tip">
Consejo importante.
</div>

<div class="lesson-warning">
Error común o advertencia.
</div>

<div class="lesson-note">
Información complementaria.
</div>

<div class="lesson-example">
Ejemplo práctico.
</div>

<div class="lesson-summary">
Resumen de la sección.
</div>

<div class="lesson-curiosity">
Dato curioso relacionado.
</div>

<div class="lesson-question">
Pregunta para reflexionar.
</div>

<div class="lesson-best-practice">
Buena práctica profesional.
</div>

<div class="lesson-highlight">
Idea clave que el estudiante debe recordar.
</div>

Utiliza también cuando sea apropiado:

<blockquote>

<hr>

<table>

<thead>

<tbody>

<strong>

<em>

<mark>

No abuses de un mismo componente.

Alterna los distintos estilos durante toda la lección para que el contenido sea dinámico y agradable de leer.


`;

    console.log('🤖 Generando contenido con OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.5',
      store: false,
      messages: [
        {
          role: 'system',
          content: 'Eres un instructor experto. Sigue exactamente las instrucciones del usuario y responde únicamente con HTML válido, sin Markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 9000
    });

    const choice = completion.choices[0];

    console.log({
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
      totalTokens: completion.usage?.total_tokens,
      finishReason: choice.finish_reason
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(completion, null, 2));
    }

    const generatedContent = choice.message.content;

    if (!generatedContent?.trim()) {
      return NextResponse.json(
        {
          error: 'La IA no devolvió contenido.',
          finishReason: choice.finish_reason
        },
        { status: 500 }
      );
    }

    console.log('✅ Contenido generado exitosamente');

    return NextResponse.json({
      success: true,
      content: generatedContent,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error: any) {
    console.error('❌ Error generando contenido:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar contenido con IA' },
      { status: 500 }
    );
  }
}
