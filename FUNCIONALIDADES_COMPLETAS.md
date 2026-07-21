# **SmartChatix Academy - Descripción Completa de Funcionalidades**

## **🎯 Filosofía de la Plataforma**

**"La inteligencia artificial es un medio. La persona es el centro."**

SmartChatix Academy es una plataforma LMS (Learning Management System) potenciada con IA que facilita la creación, gestión y distribución de cursos en línea, poniendo énfasis en:
- **Transformación de personas**, no tecnología
- **Productividad y aprendizaje** como pilares
- **Experiencia humana** sobre automatización

---

## **👥 Roles y Perfiles de Usuario**

### **1. Administrador**
Control total del ecosistema:
- Gestión completa de usuarios (instructores, estudiantes)
- Supervisión de cursos y matrículas
- Panel de estadísticas y métricas
- Acceso a todas las funcionalidades

### **2. Instructor/Docente**
Creador de contenido educativo:
- Creación y edición de cursos desde cero
- Asistencia de IA para generar contenido
- Gestión de módulos y lecciones
- Calificación de tareas y quizzes
- Emisión de certificados

### **3. Estudiante**
Consumidor del aprendizaje:
- Acceso a cursos matriculados
- Visualización de lecciones (videos, markdown, documentos)
- Resolución de quizzes y tareas
- Descarga de archivos adjuntos
- Obtención de certificados automáticos

---

## **🎓 Sistema de Creación de Cursos (Instructor)**

### **A. Asistente IA para Estructura de Cursos**

#### **Opción 1: Pegar Contenido desde Aula Virtual Existente**
El instructor puede copiar el contenido de su aula virtual (Zoom, Google Classroom, etc.) y la IA:
- ✅ Extrae automáticamente los módulos
- ✅ Identifica las lecciones
- ✅ Detecta la estructura del curso
- ✅ Propone duración y orden

#### **Opción 2: Chat con IA**
Conversación natural con la IA para crear la estructura:
- "Quiero crear un curso sobre Inteligencia Artificial para abogados"
- La IA genera módulos, lecciones y contenido sugerido
- El instructor revisa y ajusta

**Resultado:** Estructura completa en minutos (vs. horas manualmente)

---

### **B. Configuración Completa del Curso**

#### **Información Básica**
- Título y slug (URL amigable)
- Descripción larga y corta
- Thumbnail (imagen de portada) → **Sube a Cloudflare R2**
- Modalidad: En vivo o grabado
- Duración total (calculada automáticamente)
- Precio

#### **Configuración Avanzada**

**Para Cursos Grabados:**
- ✅ Cantidad de módulos (auto-calculada)
- ✅ Duración total del contenido
- ✅ Acceso desde cualquier dispositivo
- ✅ Certificado al finalizar
- ✅ Soporte permanente

**Para Cursos en Vivo:**
- ✅ Fecha y hora de inicio
- ✅ Clases en vivo por Zoom
- ✅ Sesiones de Q&A
- ✅ Networking con otros alumnos
- ✅ Link del aula virtual

**Objetivos de Aprendizaje (Learning Outcomes):**
- Lista editable de lo que aprenderá el alumno
- Se muestra en la landing page del curso
- Máximo 12 objetivos

**Sistema de Certificación:**
- ✅ Habilitar/deshabilitar emisión de certificados
- ✅ Configurar porcentaje mínimo para aprobar (ej: 75%)
- ✅ Certificado generado automáticamente al completar

**Sistema de Pesos para Calificaciones:**
- Asignar importancia relativa a quizzes y tareas
- Ejemplo: Quizzes 60%, Tareas 40%

---

### **C. Gestión de Módulos**

Cada curso se divide en módulos temáticos:
- ✅ Crear, editar, eliminar módulos
- ✅ Reordenar con drag & drop
- ✅ Título y descripción por módulo
- ✅ Orden de índice automático

---

### **D. Creación de Lecciones (3 Tipos)**

#### **1. Lección (antes "Video")**
Contenido educativo principal:

**Opción A: Video de YouTube**
- URL de YouTube (autodetección)
- Se embebe con iframe responsive

**Opción B: Video subido**
- Archivo MP4, WEBM, etc.
- **Sube automáticamente a Cloudflare R2**
- Streaming desde CDN global

**Opción C: Contenido de texto enriquecido**
- Editor Markdown visual (MarkdownEditor)
- Soporte para:
  - Headers (H1, H2, H3)
  - Listas numeradas y con viñetas
  - Negritas, cursivas
  - Links
  - Imágenes inline
  - Tablas
  - Código
- Puede incluir imagen de portada → **Sube a R2**
- Video de YouTube opcional dentro del markdown
- **IA puede generar el contenido**: El instructor da el tema, la IA escribe todo el contenido markdown

**Metadatos de la lección:**
- Duración estimada
- Lección gratuita (vista previa sin login)
- Orden en el módulo

---

#### **2. Quiz**
Evaluación de conocimientos:

**Creación manual:**
- Preguntas de opción múltiple
- 4 opciones (A, B, C, D)
- Marcar respuesta correcta
- Configurar puntaje por pregunta

**Generación con IA:**
- El instructor proporciona:
  - Tema del quiz
  - Cantidad de preguntas
  - Contexto adicional (opcional)
- La IA genera:
  - Preguntas relevantes
  - 4 opciones cada una
  - Respuesta correcta marcada
- El instructor puede:
  - Editar preguntas
  - Cambiar opciones
  - Regenerar si no le gusta

**Funcionalidades:**
- Puntaje máximo configurable
- Retroalimentación inmediata al alumno
- Almacenamiento de respuestas y calificaciones

---

#### **3. Tarea (Assignment)**
Evaluación práctica con entrega de archivos:

**Configuración:**
- Instrucciones en formato markdown (con editor visual)
- Puntaje máximo
- **Adjuntar archivos de referencia** (nuevo):
  - Múltiples archivos sin límite
  - Cualquier tipo de archivo (PDF, Word, Excel, imágenes, etc.)
  - Ejemplo: "Analizar estos 4 documentos legales"
  - Archivos **suben a Cloudflare R2**
  - Se muestran como lista descargable para el alumno

**Entrega del estudiante:**
- Sube un archivo (cualquier formato)
- Archivo **sube a Cloudflare R2**
- Estado: Pendiente → Calificado

**Calificación por el instructor:**
- Vista de todas las entregas
- Descargar el archivo del alumno
- Asignar puntaje
- Feedback opcional

---

### **E. Vista Previa del Curso (Instructor)**

Antes de publicar, el instructor puede:
- ✅ Ver el curso exactamente como lo verá el estudiante
- ✅ Reproducir videos
- ✅ Leer contenido markdown
- ✅ Ver quizzes (sin responder)
- ✅ Revisar archivos adjuntos
- ✅ Verificar orden de lecciones

---

### **F. Gestión de Calificaciones**

Panel dedicado: `/instructor/curso/[slug]/calificaciones`

**Ver por alumno:**
- Nombre y email del estudiante
- Progreso general del curso
- Calificaciones de todos los quizzes
- Calificaciones de todas las tareas
- Promedio ponderado final

**Ver por lección:**
- Todas las entregas de una tarea específica
- Todas las respuestas de un quiz
- Estadísticas de desempeño

**Exportar:**
- Descargar reporte en CSV/Excel
- Listado completo de calificaciones

---

## **📚 Experiencia del Estudiante**

### **A. Matrícula y Acceso**

**Registro:**
- Email y contraseña
- Activación por email
- Login con JWT

**Inscripción a cursos:**
- Pago integrado con Culqi (gateway peruano)
- Modo demo disponible (sin pagar)
- Matrícula instantánea

---

### **B. Visualización del Curso**

**Estructura visual:**
- Módulos desplegables (accordion)
- Lecciones numeradas
- Iconos por tipo:
  - 📚 Lección
  - ❓ Quiz
  - 📋 Tarea
- Indicador de completado
- Duración por lección

**Reproducir lección:**
- Video con player embebido (YouTube o nativo)
- Contenido markdown con formato HTML estilizado
- Tablas responsivas con hover
- Soporte para imágenes y código

---

### **C. Resolución de Quizzes**

- Interfaz limpia con radio buttons
- Una pregunta a la vez o todas juntas
- Envío y calificación automática
- Retroalimentación inmediata:
  - ✅ Respuestas correctas (verde)
  - ❌ Respuestas incorrectas (rojo)
- Puntaje final mostrado
- Se guarda en el perfil del alumno

---

### **D. Entrega de Tareas**

**Flujo:**
1. Leer instrucciones (markdown)
2. **Descargar archivos adjuntos** (si los hay):
   - Lista visual con iconos 📄
   - Nombres sin timestamp
   - Click para descargar desde R2
3. Subir archivo de entrega
4. Confirmación de envío
5. Esperar calificación del instructor

**Estados:**
- ⏳ Pendiente de calificación
- ✅ Calificado (muestra puntaje)

---

### **E. Certificación Automática**

Si el curso tiene certificación habilitada:

**Requisitos:**
- Completar todas las lecciones con quizzes
- Obtener el porcentaje mínimo configurado (ej: 75%)

**Proceso:**
- El sistema calcula automáticamente el promedio
- Si cumple requisitos, genera certificado PDF
- Código único de verificación (8 caracteres)
- Diseño profesional con:
  - Logo de SmartChatix
  - Nombre del alumno
  - Nombre del curso
  - Fecha de emisión
  - Código QR para verificación
- Descarga instantánea

**Verificación pública:**
- URL: `/verificar/[codigo]`
- Cualquiera puede verificar autenticidad
- Muestra: Alumno, curso, fecha, validez

---

## **🤖 Inteligencia Artificial Integrada**

### **1. Generación de Estructura de Cursos**
- API: `/api/instructor/parse-course-structure`
- Toma texto libre y devuelve JSON estructurado
- Detecta módulos y lecciones automáticamente

### **2. Generación de Contenido de Lecciones**
- API: `/api/instructor/generate-lesson-content`
- Input: Tema + contexto del curso
- Output: Contenido markdown completo educativo

### **3. Generación de Quizzes**
- API: `/api/instructor/generate-quiz`
- Input: Tema + cantidad de preguntas
- Output: JSON con preguntas, opciones y respuestas correctas
- Regenerable si el instructor no está satisfecho

### **4. Chat para Estructura**
- API: `/api/instructor/chat-course-structure`
- Conversación iterativa con la IA
- Refina la estructura según feedback del instructor

**Modelo usado:** OpenAI GPT (configurable en `.env`)

---

## **💾 Almacenamiento de Archivos (Cloudflare R2)**

**Todo se sube a Cloudflare R2 CDN:**

### **Videos**
- Videos de lecciones (MP4, WEBM)
- Videos del hero de landing pages
- Streaming global sin límite de ancho de banda

### **Imágenes**
- Thumbnails de cursos (PNG, JPG, WEBP)
- Imágenes de portada de lecciones markdown
- Imágenes del diseño de la web

### **Documentos**
- **Archivos adjuntos en tareas** (PDFs, Word, Excel, etc.)
- Entregas de estudiantes (assignments)

**URLs públicas:**
- Base: `https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/`
- Estructura: `/uploads/[timestamp]_[filename]`

**Ventajas:**
- ✅ 10GB gratis permanentes
- ✅ Transferencia ilimitada (no se cobra bandwidth)
- ✅ CDN global (rápido desde cualquier lugar)
- ✅ No depende del servidor (persiste entre redeploys)
- ✅ Compatible con S3 API

---

## **🔐 Seguridad y Autenticación**

### **Sistema de Roles**
- JWT (JSON Web Tokens)
- 3 roles: `admin`, `instructor`, `student`
- Middleware de verificación en todas las APIs

### **Protección de Rutas**
- APIs protegidas por rol
- Verificación de permisos en cada endpoint
- Cookies HTTP-only para tokens

### **Activación de Cuenta**
- Email de confirmación al registrarse
- Token único de activación
- Previene spam y cuentas fake

---

## **💳 Sistema de Pagos**

### **Gateway: Culqi (Perú)**
- Tarjetas de crédito/débito
- Proceso seguro con tokenización
- Confirmación instantánea

### **Modo Demo**
- Variable: `PAYMENT_DEMO_MODE=true`
- Simula pagos sin cobrar
- Útil para testing

**Flujo:**
1. Usuario selecciona curso
2. Ingresa datos de tarjeta
3. Culqi procesa pago
4. Matrícula automática
5. Acceso inmediato al curso

---

## **📊 Panel de Administración**

URL: `/admin`

**Funcionalidades:**
- 📈 Dashboard con métricas:
  - Total de usuarios
  - Total de cursos
  - Ingresos generados
  - Matrículas activas
- 👥 Gestión de usuarios:
  - Listar todos los usuarios
  - Editar roles
  - Eliminar usuarios
- 📚 Gestión de cursos:
  - Ver todos los cursos
  - Editar cualquier curso
  - Ver matrículas por curso
- 💰 Reportes financieros

---

## **🎨 Landing Pages**

### **Página Principal** (`/`)
- Hero con gradiente animado
- Sección de cursos destacados
- Call-to-action
- Footer con redes sociales

### **Servicios - Aulas Virtuales** (`/servicios/aulas-virtuales`)
Documentado en `AULAVIRTUAL_WEB.md`:
- **Hero con gradiente animado** en el título
- Background con imagen + overlay oscuro
- 9 secciones explicando el servicio
- Comparación con LMS tradicionales
- Modal de contacto integrado
- CTA final con botón destacado

### **Página de Curso Público** (`/cursos/[slug]`)
- Descripción del curso
- Módulos y lecciones (vista previa)
- Precio y botón de compra
- Objetivos de aprendizaje
- Instructor

---

## **🔧 Infraestructura Técnica**

### **Stack Tecnológico**
- **Frontend:** Next.js 16 (React 19, Turbopack)
- **Backend:** Next.js API Routes (serverless)
- **Base de datos:** MySQL/MariaDB
- **CDN:** Cloudflare R2
- **Autenticación:** JWT
- **Pagos:** Culqi
- **IA:** OpenAI GPT
- **Hosting:** Easypanel (VPS)
- **Deploy:** GitHub → Easypanel (automático)

### **Base de Datos**
Tablas principales:
- `users` - Usuarios del sistema
- `courses` - Cursos
- `modules` - Módulos de cursos
- `lessons` - Lecciones (con `documents_urls` JSON)
- `enrollments` - Matrículas
- `quiz_responses` - Respuestas de quizzes
- `assignment_submissions` - Entregas de tareas
- `certificates` - Certificados emitidos

### **Migraciones**
- `db/schema.sql` - Esquema completo
- `db/migrations/` - Migraciones incrementales
- Última: `add-multiple-documents.sql` (archivos múltiples en tareas)

---

## **📱 Responsive Design**

- ✅ Mobile-first
- ✅ Tabletas
- ✅ Desktop
- ✅ Tipografía escalable
- ✅ Imágenes adaptativas

---

## **🚀 Características Únicas de SmartChatix**

### **1. IA como Asistente, No como Reemplazo**
- La IA **propone**, el profesor **decide**
- Generación de contenido editable
- Control total del instructor

### **2. Desde la Idea hasta el Certificado**
- Flujo completo end-to-end
- Desde estructura hasta certificación automática
- Sin necesidad de herramientas externas

### **3. Archivos Adjuntos Ilimitados en Tareas**
- Cualquier tipo de archivo
- Sin restricciones de cantidad
- CDN global para descargas rápidas

### **4. Editor Markdown Visual**
- No requiere conocer sintaxis markdown
- Preview en tiempo real
- Copy-paste desde ChatGPT, Notion, etc.

### **5. Certificación con Código QR**
- Verificación pública de autenticidad
- Diseño profesional
- Descarga inmediata

### **6. Pesos Configurables para Calificaciones**
- Flexibilidad total en evaluación
- Diferentes ponderaciones por curso

---

## **📈 Métricas y Analytics**

### **Para Instructores:**
- Progreso de cada alumno
- Calificaciones detalladas
- Estadísticas de entregas

### **Para Administradores:**
- Total de usuarios
- Ingresos generados
- Cursos más populares
- Tasa de completado

---

## **🌐 Internacionalización**

- Interfaz en español
- Fechas en formato latino
- Gateway de pago peruano (Culqi)
- Adaptable a otros países

---

## **💡 Ventajas Competitivas**

| Característica | LMS Tradicional | SmartChatix |
|---|---|---|
| Crear estructura | Manual (horas) | IA asistida (minutos) |
| Generar contenido | Todo manual | IA genera, tú editas |
| Archivos en tareas | 1 archivo | Ilimitados |
| Certificados | Manual o plantilla fija | Automático con verificación QR |
| Storage | Servidor limitado | CDN global ilimitado |
| IA integrada | No | Sí (OpenAI) |

---

## **🔮 Roadmap Futuro**

- [ ] Dominio custom para R2: `media.smartchatix.com`
- [ ] Notificaciones por email
- [ ] Gamificación (badges, leaderboards)
- [ ] Foros de discusión
- [ ] Livestreaming integrado
- [ ] App móvil nativa
- [ ] Más idiomas

---

**Versión:** 2.0
**Última actualización:** 2026-07-21
**Deploy:** https://smartchatix.com
