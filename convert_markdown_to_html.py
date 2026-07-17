#!/usr/bin/env python3
import mysql.connector
import markdown

# Conectar a la base de datos
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="fluideka_lms"
)

cursor = conn.cursor()

# IDs de las lecciones del curso aprende-dirigir-ia
lesson_ids = [88, 89, 90, 91, 95, 96, 97]

print("🔄 Convirtiendo Markdown a HTML para el curso 'aprende-dirigir-ia'...\n")

for lesson_id in lesson_ids:
    # Obtener el contenido actual
    cursor.execute("""
        SELECT id, title, video_markdown, markdown_content
        FROM lessons
        WHERE id = %s
    """, (lesson_id,))

    result = cursor.fetchone()
    if not result:
        print(f"❌ Lección {lesson_id} no encontrada")
        continue

    lesson_id, title, video_markdown, markdown_content = result

    print(f"📝 Procesando: {title} (ID: {lesson_id})")

    # Convertir video_markdown si existe
    if video_markdown:
        html_content = markdown.markdown(
            video_markdown,
            extensions=['extra', 'nl2br', 'sane_lists']
        )

        cursor.execute("""
            UPDATE lessons
            SET video_markdown = %s
            WHERE id = %s
        """, (html_content, lesson_id))

        print(f"   ✅ video_markdown convertido ({len(video_markdown)} → {len(html_content)} chars)")

    # Convertir markdown_content si existe
    if markdown_content:
        html_content = markdown.markdown(
            markdown_content,
            extensions=['extra', 'nl2br', 'sane_lists']
        )

        cursor.execute("""
            UPDATE lessons
            SET markdown_content = %s
            WHERE id = %s
        """, (html_content, lesson_id))

        print(f"   ✅ markdown_content convertido ({len(markdown_content)} → {len(html_content)} chars)")

    print()

# Confirmar cambios
conn.commit()

print("✨ ¡Conversión completada! Todas las lecciones ahora tienen HTML.\n")

# Verificar
cursor.execute("""
    SELECT COUNT(*) as total
    FROM lessons
    WHERE id IN (88, 89, 90, 91, 95, 96, 97)
    AND (video_markdown LIKE '<h1>%' OR video_markdown LIKE '<h2>%'
         OR markdown_content LIKE '<h1>%' OR markdown_content LIKE '<h2>%')
""")

converted = cursor.fetchone()[0]
print(f"📊 Verificación: {converted}/7 lecciones convertidas correctamente")

cursor.close()
conn.close()
