# Aula Virtual Fluideka - Documentación de Desarrollo

## Estado Actual del Proyecto

### Tecnologías
- **Framework:** Next.js 16.2.9 (Turbopack deshabilitado)
- **Base de datos:** MySQL (fluideka_lms)
- **Autenticación:** JWT con HttpOnly cookies
- **Passwords:** bcrypt hash
- **Lenguaje:** TypeScript
- **Estilos:** Inline styles (sin Tailwind)

### Usuarios de Prueba
```
Admin:
- Email: admin@fluideka.com
- Password: admin123
- Ruta: /admin

Instructor:
- Email: instructor@fluideka.com
- Password: instructor123
- Ruta: /instructor

Estudiante:
- Email: estudiante@test.com
- Password: estudiante123
- Ruta: /aula-virtual
```

## Funcionalidades Implementadas

### 1. Panel Admin (`/admin`)
**Ubicación:** `/src/app/admin/page.tsx`

**Funcionalidades:**
- Dashboard con estadísticas (total de usuarios, cursos, estudiantes)
- Gestión de usuarios (lista completa con roles)
- Gestión de cursos (lista con instructores asignados)
- Asignación de cursos a instructores mediante modal
- Filtrado por roles

**API relacionadas:**
- `/api/admin/stats` - Estadísticas
- `/api/admin/users` - Lista de usuarios
- `/api/admin/courses` - Lista de cursos
- `/api/admin/courses/[id]` - Actualizar curso (PATCH)

### 2. Panel Instructor (`/instructor`)
**Ubicación:** `/src/app/instructor/page.tsx`

**Funcionalidades:**
- Dashboard con cursos asignados al instructor
- Estadísticas de estudiantes por curso
- Acceso al editor de curso
- **Vista de calificaciones** (nuevo)

#### Editor de Curso (`/instructor/curso/[slug]`)
**Ubicación:** `/src/app/instructor/curso/[slug]/page.tsx`

**Funcionalidades completas:**
- Vista de módulos y lecciones
- **CRUD completo de módulos:**
  - Crear módulo (título, descripción, orden automático)
  - Editar módulo
  - Eliminar módulo

- **CRUD completo de lecciones:**
  - Crear lección con tipos: video, document, quiz, assignment
  - Editar lección
  - Eliminar lección
  - **Upload de archivos PDF al servidor**
  - O pegar URL manualmente
  - Configurar duración
  - Marcar como lección gratuita

#### Vista de Calificaciones (`/instructor/curso/[slug]/calificaciones`)
**Ubicación:** `/src/app/instructor/curso/[slug]/calificaciones/page.tsx`

**Funcionalidades completas:**
- **Vista por Estudiante:**
  - Tabla con todos los estudiantes inscritos
  - Quizzes completados por estudiante
  - Puntaje total y promedio general (%)
  - Indicadores de color según rendimiento (verde ≥70%, amarillo ≥50%, rojo <50%)
  - Modal con detalle completo del estudiante

- **Vista por Quiz:**
  - Lista de todas las respuestas de quizzes
  - Información del estudiante y lección
  - Puntaje individual con porcentaje
  - Fecha de realización
  - Acceso a ver respuestas detalladas

- **Modal de Detalle de Estudiante:**
  - Estadísticas generales (quizzes completados, puntaje total, promedio)
  - Historial completo de quizzes realizados
  - Fecha y hora de cada intento

**API relacionadas:**
- `/api/instructor/quiz-grades/[courseSlug]` - Obtener calificaciones del curso (GET)
- `/api/instructor/modules` - Crear módulo (POST)
- `/api/instructor/modules/[id]` - Editar/Eliminar módulo (PATCH/DELETE)
- `/api/instructor/lessons` - Crear lección (POST)
- `/api/instructor/lessons/[id]` - Editar/Eliminar lección (PATCH/DELETE)
- `/api/upload` - Subir archivos PDF (POST)

**Sistema de Upload de PDFs:**
- Archivos se guardan en `/public/documents/`
- Nombre con timestamp: `{timestamp}_{nombre_sanitizado}.pdf`
- Solo instructores y admins pueden subir
- Solo acepta archivos .pdf
- Retorna URL: `/documents/{archivo}.pdf`

### 3. Panel Estudiante (`/curso/[slug]`)
**Ubicación:** `/src/app/curso/[slug]/page.tsx`

**Funcionalidades:**
- **Header personalizado:**
  - Color: `#4a5568` (gris)
  - Lado izquierdo (350px): Título del curso, modalidad, duración, botón "Volver"
  - Lado derecho: Barra de navegación con botones

- **Navegación de lecciones:**
  - Botón "← Anterior" (deshabilitado en primera lección)
  - Botón "Próximo →" (deshabilitado en última lección)
  - Centrados respecto al área del visor (no a toda la ventana)
  - Contador "X / Total" en centro (eliminado en versión actual)

- **Sidebar (350px):**
  - Lista de módulos expandibles/colapsables
  - Lista de lecciones por módulo
  - Iconos: ▶️ para videos, 📄 para documentos
  - Indicador de lección seleccionada
  - **Botón "Cerrar Sesión"** en parte inferior (color rojo #ef4444)

- **Visor de contenido:**
  - Videos: iframe embebido de YouTube
  - **PDFs: Visor limpio con iframe**
    - Sin toolbar (`toolbar=0`)
    - Sin panel de navegación (`navpanes=0`)
    - Solo scroll habilitado (`scrollbar=1`)
    - Altura: 80vh
    - Sin header de "Documento PDF"
  - Título y descripción de lección abajo del contenido

**API relacionadas:**
- `/api/courses/[slug]` - Obtener curso con módulos y lecciones (GET)
  - **Importante:** Requiere `credentials: 'include'` en fetch del cliente

**Fix importante aplicado:**
```typescript
const response = await fetch(`/api/courses/${slug}`, {
  credentials: 'include'  // ← CRÍTICO para enviar cookies de auth
});
```

## Estilos y Diseño

### Colores Branding Fluideka
```css
Gradiente principal: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Gris header: #4a5568
Color hover/focus: #667eea
Background principal: #f9fafb
Negro contenido: #0a0a0a
```

### Modal de Lecciones (Estilo Actualizado)
**Características:**
- Padding contenedor: `24px` (reducido 30% desde 32px)
- Padding inputs: `8px 12px` (reducido 30% desde 12px)
- Espaciado vertical: `12px` entre campos (reducido desde 16px)
- MaxWidth modal: `480px` (reducido 20% desde 600px)
- **Importante:** `boxSizing: 'border-box'` en TODOS los inputs

**Estilos del contenedor:**
```javascript
background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
borderRadius: '16px'
boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
border: '1px solid rgba(102, 126, 234, 0.1)'
```

**Título con gradiente:**
```javascript
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
WebkitBackgroundClip: 'text'
WebkitTextFillColor: 'transparent'
```

**Inputs:**
```javascript
border: '2px solid #e5e7eb'
borderRadius: '8px'
fontSize: '14px'
boxSizing: 'border-box'  // ← CRÍTICO para evitar overflow
onFocus: borderColor = '#667eea'
onBlur: borderColor = '#e5e7eb'
```

**Botones:**
- Guardar: Gradiente púrpura con sombra `0 4px 12px rgba(102, 126, 234, 0.3)`
- Cancelar: Gris claro `#f3f4f6`
- Eliminar: Rojo transparente `rgba(239, 68, 68, 0.1)`
- Padding: `8px 16px` (reducido desde 10px 20px)
- Font size: `13px` (reducido desde 14px)
- Iconos: ✓, ⏳, 🗑️

## Configuración Importante

### next.config.js
**Headers para PDFs:**
```javascript
async headers() {
  return [
    {
      source: '/documents/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
      ]
    },
    {
      source: '/((?!documents).*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
      ]
    }
  ]
}
```
**Nota:** Los PDFs NO tienen `X-Frame-Options: DENY` para permitir visualización en iframe.

### CLAUDE.md
**Comandos principales:**
```bash
# Iniciar servidor
npm run dev

# Verificar servidor funcionando
curl -I http://localhost:3000

# Limpiar procesos
pkill -9 -f "next dev"
rm -rf .next
```

**Assets:**
- Logo: `/public/images/logo_fluideka.jpeg`
- Dimensiones en código: `width={120} height={40}`

## Arquitectura de Archivos

### Páginas Principales
```
/src/app/
├── admin/
│   └── page.tsx                    # Panel administrador
├── instructor/
│   ├── page.tsx                    # Dashboard instructor
│   └── curso/[slug]/
│       └── page.tsx                # Editor de curso
├── curso/[slug]/
│   └── page.tsx                    # Visor estudiante
└── aula-virtual/
    └── page.tsx                    # Dashboard estudiante
```

### APIs
```
/src/app/api/
├── admin/
│   ├── stats/route.ts
│   ├── users/route.ts
│   ├── courses/route.ts
│   └── courses/[id]/route.ts
├── instructor/
│   ├── modules/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── lessons/
│       ├── route.ts
│       └── [id]/route.ts
├── courses/[slug]/route.ts         # API para estudiantes
└── upload/route.ts                 # Upload de PDFs
```

### Archivos Estáticos
```
/public/
├── documents/                      # PDFs subidos
│   └── documento-prueba.pdf
└── images/
    └── logo_fluideka.jpeg
```

## Base de Datos

### Tablas Principales
```sql
users (id, email, password_hash, name, role, is_active)
courses (id, slug, title, description, instructor_id, price_vivo, price_grabado)
modules (id, course_id, title, description, order_index)
lessons (id, module_id, title, description, content_type, video_url, document_url, duration, is_free, order_index)
enrollments (id, user_id, course_id, modality, payment_status, enrolled_at)
```

### Tipos de Contenido
```
video      - Videos de YouTube (almacena ID)
document   - PDFs (almacena URL local)
quiz       - Cuestionarios (no implementado)
assignment - Tareas (no implementado)
```

## Pendientes/Mejoras Futuras

### Funcionalidades No Implementadas
1. **Quiz y Tareas:**
   - Tipos declarados en select pero sin implementación
   - Necesita diseño de estructura de preguntas/respuestas
   - Sistema de evaluación y calificaciones

2. **Progreso del Estudiante:**
   - Tracking de lecciones completadas
   - Barra de progreso por módulo/curso
   - Certificado al completar

3. **Configuración de Curso:**
   - Editar título, descripción en instructor panel
   - Cambiar precios
   - Activar/desactivar curso
   - Imagen de thumbnail

4. **Lista de Estudiantes:**
   - Vista completa para instructor
   - Progreso individual
   - Exportar datos

5. **Videos:**
   - Soporte para Vimeo, Drive
   - Subir videos al servidor
   - Player personalizado

### Mejoras de UX/UI
1. **Validaciones:**
   - Validación de formularios más robusta
   - Mensajes de error específicos
   - Confirmaciones antes de eliminar

2. **Responsive:**
   - Optimizar sidebar en móviles
   - Modal adaptativo
   - Navigation mobile-friendly

3. **Búsqueda/Filtros:**
   - Buscar lecciones en curso
   - Filtrar por tipo de contenido
   - Ordenar módulos/lecciones

4. **Notificaciones:**
   - Toast/Snackbar para acciones
   - Confirmación de guardado
   - Errores más amigables

### Optimizaciones Técnicas
1. **Performance:**
   - Lazy loading de módulos
   - Paginación en listas largas
   - Caché de datos frecuentes

2. **Seguridad:**
   - Rate limiting en APIs
   - Validación de permisos más granular
   - Sanitización de uploads

3. **Testing:**
   - Unit tests para componentes
   - Integration tests para APIs
   - E2E tests para flujos principales

## Bugs Conocidos
- Ninguno reportado actualmente

## Comandos de Desarrollo

```bash
# Servidor
npm run dev                         # Puerto 3000 (o 3001 si está ocupado)

# Limpiar y reiniciar
rm -rf .next && npm run dev        # Limpiar caché

# Matar procesos Next.js
pkill -9 -f "next dev"

# Verificar servidor
curl -I http://localhost:3000

# Base de datos
mysql -u root -p123456 fluideka_lms

# Ver logs del servidor
# Los logs aparecen automáticamente en terminal
```

## Notas Importantes

### Fix Críticos Aplicados
1. **Fetch con credenciales:**
   ```typescript
   // En /curso/[slug]/page.tsx
   fetch('/api/courses/${slug}', { credentials: 'include' })
   ```

2. **Params como Promise (Next.js 15+):**
   ```typescript
   // En todas las rutas dinámicas
   export async function GET(
     request: NextRequest,
     { params }: { params: Promise<{ slug: string }> }
   ) {
     const { slug } = await params;  // ← Await necesario
   }
   ```

3. **BoxSizing en inputs:**
   ```javascript
   // En todos los inputs del modal
   boxSizing: 'border-box'  // ← Previene overflow
   ```

4. **Headers para PDFs:**
   - Ruta `/documents/*` NO tiene `X-Frame-Options`
   - Permite embedding en iframe

### Convenciones de Código
- Inline styles (no CSS modules ni Tailwind)
- TypeScript strict
- Interfaces definidas para cada tipo de dato
- async/await para todas las promesas
- Estados con useState
- Efectos con useEffect

### Estructura de Estados Típica
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [data, setData] = useState<Type | null>(null);
const [saving, setSaving] = useState(false);
```

## Sistema de Quiz con IA (Generación Automática)

### Descripción General
Sistema de generación automática de preguntas de opción múltiple usando OpenAI API (`gpt-4o`), con explicaciones pedagógicas detalladas para todas las opciones.

**Archivo principal:** `/src/app/api/instructor/generate-quiz/route.ts`

### Características Implementadas

1. **Generación automática de preguntas:**
   - Preguntas de opción múltiple (A, B, C, D)
   - Una sola respuesta correcta
   - Explicaciones para TODAS las opciones (correctas e incorrectas)

2. **Instrucciones generales del instructor:**
   - Campo opcional para establecer reglas globales
   - Se aplican a todas las preguntas generadas
   - Ejemplo: "Incluye ejemplos completos de prompts con ROL, TAREA, CONTEXTO, FORMATO y RESTRICCIONES"

3. **Regeneración:**
   - **Regenerar todas:** Reemplaza todo el quiz (con modal de confirmación)
   - **Regenerar individual:** Mejora una pregunta con observaciones específicas

4. **Prevención de duplicados:**
   - Envía las preguntas existentes a la IA para evitar repeticiones

5. **Renderizado con Markdown:**
   - `ReactMarkdown` + `remarkGfm` en vistas de estudiante e instructor
   - Soporte para: saltos de línea, **negritas**, listas, mejor formato

### Configuración OpenAI

```javascript
model: 'gpt-4o'  // ⚠️ NO usar gpt-4o-mini
response_format: { type: "json_object" }
```

### Lecciones Aprendidas (IMPORTANTE)

#### Problema
La IA ignoraba completamente las instrucciones del instructor para generar explicaciones detalladas con ejemplos completos, a pesar de múltiples intentos con énfasis crecientes.

#### Solución Final

**1. Modelo adecuado:**
- ✅ `gpt-4o` - Sigue bien instrucciones complejas
- ❌ `gpt-4o-mini` - Ignora instrucciones a pesar de énfasis múltiples (🚨🚨🚨, ⛔⛔⛔, etc.)
- **Lección:** El costo extra de gpt-4o vale la pena para contenido educativo que requiere seguir instrucciones precisas

**2. Estructura del prompt:**
- Instrucciones del instructor al INICIO del prompt (máxima prioridad)
- Múltiples niveles de énfasis visuales: 🚨🚨🚨, ⛔⛔⛔, "OBLIGATORIO", "NO OPCIONAL"
- Ejemplos concretos de ❌ MAL vs ✅ BIEN
- Advertencias directas: "Si no cumples, tu respuesta será RECHAZADA"

**3. LA CLAVE: Formato JSON explícito**

❌ **NO funciona** (solo instrucciones descriptivas):
```
"Genera explicaciones detalladas con ejemplos completos de prompts"
```

✅ **SÍ funciona** (mostrar el formato exacto esperado):
```json
{
  "explanations": {
    "A": "Esta es la respuesta correcta porque [explicar qué falta].

Un prompt completo y correcto sería:

'[AQUÍ DEBES ESCRIBIR EL PROMPT COMPLETO CON TODOS LOS DETALLES:
Rol específico con años de experiencia,
Tarea detallada,
Contexto amplio con datos de la empresa/situación,
Formato específico de lo que debe entregar,
Restricciones claras de presupuesto/tiempo/lenguaje]'

Este ejemplo incluye:
- ROL: [describir el rol del ejemplo]
- TAREA: [describir la tarea del ejemplo]
- CONTEXTO: [describir el contexto del ejemplo]
- FORMATO: [describir el formato del ejemplo]
- RESTRICCIONES: [describir las restricciones del ejemplo]"
  }
}
```

#### Lección Clave

> **La IA necesita VER el formato exacto que esperas en el JSON de respuesta, no solo leer instrucciones descriptivas sobre cómo debe responder.**

Es como mostrarle a alguien una plantilla en blanco con placeholders vs. solo explicarle verbalmente cómo debe llenar un formulario.

**Analogía:**
- ❌ Decir: "Escribe una carta formal con saludo, cuerpo y despedida"
- ✅ Mostrar: "Estimado [NOMBRE],\n\n[AQUÍ EL MENSAJE]...\n\nAtentamente,\n[TU NOMBRE]"

### Flujo del Instructor

1. **Abrir modal de preguntas** en lección tipo "quiz"
2. **Ver preguntas generadas:**
   - Cada pregunta con sus 4 opciones
   - Explicaciones de TODAS las opciones visibles
   - Indicadores: ✓ (correcta) / ❌ (incorrecta)
3. **Instrucciones generales (opcional):**
   - Aplican a todas las preguntas del quiz
4. **Regenerar si es necesario:**
   - Individual: Con observaciones específicas
   - Todas: Con confirmación modal
5. **Guardar** cuando estén correctas

### Flujo del Estudiante

1. **Responder preguntas** (radio buttons)
2. **Enviar respuestas**
3. **Ver resultados:**
   - Calificación: X/Y correctas
   - Si correcta: Explicación del por qué
   - Si incorrecta:
     - Por qué tu respuesta es incorrecta
     - Cuál es la correcta y por qué
4. **Solo un intento** (se guarda en `quiz_responses`)

### Archivos Relacionados

```
/src/app/api/instructor/generate-quiz/route.ts  # API generación
/src/app/instructor/curso/[slug]/page.tsx       # Vista instructor (con explicaciones)
/src/app/curso/[slug]/page.tsx                   # Vista estudiante (con explicaciones)
```

### Base de Datos

```sql
-- Almacenamiento
lessons.quiz_data          # JSON con preguntas y explicaciones
lessons.quiz_questions_count  # Número de preguntas

-- Respuestas estudiantes
quiz_responses (
  id,
  user_id,
  lesson_id,
  responses,  # JSON: {"0": "A", "1": "B", ...}
  score,      # Número de respuestas correctas
  submitted_at
)
```

### Estructura de Datos

```typescript
interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: 'A' | 'B' | 'C' | 'D';
  explanations: {
    A: string;  // Markdown
    B: string;  // Markdown
    C: string;  // Markdown
    D: string;  // Markdown
  };
}
```

### Costos OpenAI

**GPT-4o** (necesario para seguir instrucciones complejas):
- Input: ~$2.50 / 1M tokens
- Output: ~$10.00 / 1M tokens
- Generación típica (5 preguntas con explicaciones): ~3000 tokens
- Costo estimado por quiz: $0.03 - $0.05 USD

## Sistema de Certificados Automáticos

### Descripción General
Sistema completo de certificación automática que emite certificados PDF verificables cuando los estudiantes completan un curso con el porcentaje mínimo requerido.

**Archivos principales:**
- `/database/migrations/002_add_certificates.sql` - Migración de base de datos
- `/src/app/api/instructor/course/[slug]/config/route.ts` - API configuración curso
- `/src/app/api/student/course/[slug]/certificate-status/route.ts` - API verificar elegibilidad
- `/src/app/api/student/generate-certificate/route.ts` - API generar certificado PDF
- `/src/app/api/verify-certificate/[codigo]/route.ts` - API verificar certificado público
- `/src/app/verificar/[codigo]/page.tsx` - Página pública de verificación

### Características Implementadas

#### 1. Configuración por Curso (Instructor)
**Ubicación:** `/instructor/curso/[slug]` → Tab "Configuración"

**Controles:**
- ✅ Checkbox "Habilitar emisión de certificados"
  - Por defecto: deshabilitado
  - Solo emite certificados si está activado
- ✅ Input "Porcentaje mínimo para aprobar"
  - Por defecto: 75%
  - Rango: 0-100%
  - Porcentaje mínimo en promedio general de quizzes

**Validación:**
- Solo instructores asignados y admins pueden modificar
- Cambios se guardan automáticamente vía PATCH

#### 2. Elegibilidad de Certificado (Estudiante)
**Requisitos para obtener certificado:**
1. ✅ Curso tiene certificación habilitada
2. ✅ Curso tiene al menos una lección con quiz
3. ✅ Estudiante completó TODOS los quizzes
4. ✅ Promedio general ≥ porcentaje mínimo

**Cálculo del promedio:**
```
Promedio = (Suma de respuestas correctas / Suma total de preguntas) × 100
```

**Ejemplo:**
- Quiz 1: 8/10 correctas
- Quiz 2: 7/10 correctas
- Quiz 3: 9/10 correctas
- Promedio: (8+7+9)/(10+10+10) × 100 = 80%

#### 3. Generación de Certificado PDF

**Tecnologías:**
- `pdfkit` - Generación de PDF
- `qrcode` - Generación de código QR

**Plantilla del Certificado:**
- ✅ Diseño profesional en formato A4 horizontal
- ✅ Borde decorativo con gradiente
- ✅ Título "CERTIFICADO DE FINALIZACIÓN"
- ✅ Nombre del estudiante (grande y destacado)
- ✅ Nombre del curso completado
- ✅ Calificación final (%)
- ✅ Fecha de emisión
- ✅ Código QR para verificación
- ✅ Código de verificación alfanumérico (ej: ABCD-1234-EFGH)
- ✅ URL de verificación en footer

**Formato del código:**
- 12 caracteres alfanuméricos (sin 0, O, I, 1 para evitar confusión)
- Formato: XXXX-XXXX-XXXX
- Ejemplo: B3F7-K9M2-P4QR

**Almacenamiento:**
- PDF guardado en: `/public/certificates/{codigo}.pdf`
- Acceso público: `{dominio}/certificates/{codigo}.pdf`

#### 4. Verificación Pública

**Página:** `{dominio}/verificar/{codigo}`

**Estados posibles:**
1. ✅ **Certificado Válido** (verde)
   - Muestra todos los datos del certificado
   - Nombre del estudiante
   - Curso completado
   - Calificación final
   - Fecha de emisión
   - Código de verificación

2. ❌ **Certificado No Válido** (rojo)
   - Código no existe en base de datos
   - Mensaje de error claro

3. ⚠️ **Certificado Revocado** (amarillo)
   - Existe pero `is_valid = false`
   - Posible uso: si detectas fraude o error

**API pública:**
```
GET /api/verify-certificate/{codigo}
```
No requiere autenticación - cualquiera puede verificar

#### 5. UI del Estudiante

**Banner de Certificado:**
- Aparece automáticamente en `/curso/[slug]` cuando es elegible
- Dos estados:

**A. Certificado Disponible (púrpura):**
```
🎓 ¡Felicidades! Eres elegible para tu certificado
Calificación final: 87% - Descarga tu certificado ahora
[🎓 Descargar Certificado]
```

**B. Certificado Ya Emitido (verde):**
```
🎓 ¡Certificado Obtenido!
Calificación final: 87%
[📄 Ver Certificado]
```

**Flujo de descarga:**
1. Click en "Descargar Certificado"
2. Se genera PDF en el servidor
3. PDF se abre en nueva pestaña automáticamente
4. Certificado se guarda en DB
5. Banner cambia a estado "Ya Emitido"

### Base de Datos

**Tabla: certificates**
```sql
CREATE TABLE certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  final_score DECIMAL(5,2) NOT NULL,
  issue_date DATETIME NOT NULL,
  verification_code VARCHAR(50) UNIQUE NOT NULL,
  certificate_url VARCHAR(255),
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_course (student_id, course_id)
);
```

**Campos nuevos en courses:**
```sql
is_certification_enabled BOOLEAN DEFAULT false
passing_score INT DEFAULT 75
certificate_template TEXT
```

### Flujo Completo

```
1. INSTRUCTOR:
   ├─ Crea curso con lecciones y quizzes
   ├─ Va a "Configuración"
   ├─ Activa "Habilitar certificación"
   ├─ Establece "Porcentaje mínimo: 75%"
   └─ Curso listo para certificar

2. ESTUDIANTE:
   ├─ Completa todas las lecciones con quizzes
   ├─ Sistema calcula promedio automáticamente
   ├─ Si promedio ≥ 75% y certificación habilitada:
   │  └─ Banner aparece: "¡Eres elegible!"
   ├─ Click en "Descargar Certificado"
   ├─ PDF se genera automáticamente
   ├─ Se abre en nueva pestaña
   └─ Certificado guardado (no se puede regenerar)

3. VERIFICACIÓN PÚBLICA:
   ├─ Cualquiera escanea QR del certificado
   ├─ O visita: dominio.com/verificar/CODIGO
   ├─ Sistema verifica en base de datos
   └─ Muestra: ✅ Válido / ❌ Inválido / ⚠️ Revocado
```

### Casos de Uso

**Caso 1: Academia de programación**
- Curso: "Desarrollo Web Full Stack"
- Lecciones: 40 (20 con quizzes)
- Passing score: 80%
- Estudiante: Juan Pérez
- Completa todo con 85% promedio
- Obtiene certificado verificable
- Empresa puede verificar en dominio/verificar/CODIGO

**Caso 2: Instituto técnico**
- Curso: "Instalaciones Eléctricas"
- Lecciones: 15 (10 con quizzes)
- Passing score: 70%
- Estudiante: María López
- Completa todo con 65% promedio
- NO obtiene certificado (no alcanzó mínimo)
- Banner muestra: "Tu promedio es 65%, necesitas 70%"

### Seguridad

**Prevención de fraude:**
- ✅ Un certificado por estudiante por curso (UNIQUE constraint)
- ✅ No se puede regenerar (solo si admin revoca y vuelve a habilitar)
- ✅ Código único e irrepetible
- ✅ QR apunta a verificación pública
- ✅ Verificación muestra datos exactos de la base de datos

**Validaciones:**
- Solo estudiantes autenticados pueden generar
- Solo si cumplen todos los requisitos
- Instructor debe habilitar certificación primero

### Dependencias Nuevas

```json
{
  "pdfkit": "^0.15.0",
  "qrcode": "^1.5.4",
  "@types/pdfkit": "^0.13.5",
  "@types/qrcode": "^1.5.5"
}
```

### Próximas Mejoras

**No implementado aún:**
1. Plantillas personalizables por academia
2. Logo personalizado en certificado
3. Múltiples idiomas
4. Certificados con vencimiento
5. Envío automático por email
6. Dashboard de certificados emitidos (admin)
7. Export masivo de certificados (admin)

---

## Sistema de Asistente IA para Creación de Cursos

### Descripción General
Sistema completo de creación automática de estructura de cursos usando IA (OpenAI GPT-4o-mini), con dos modos: pegado de contenido estructurado y chat interactivo.

**Archivos principales:**
- `/src/components/instructor/CourseStructureAssistant.tsx` - Componente principal del asistente
- `/src/app/api/instructor/parse-course-structure/route.ts` - API para parsear contenido pegado
- `/src/app/api/instructor/chat-course-structure/route.ts` - API para chat interactivo
- `/src/app/api/instructor/courses/route.ts` - API para crear curso con módulos/lecciones (POST)
- `/src/app/instructor/page.tsx` - Panel instructor con integración del asistente

### Características Implementadas

#### 1. Ubicación en la Interfaz
**Dónde:** `/instructor` → Tab "Crear Curso" (reemplaza el placeholder "Funcionalidad en desarrollo")

**Pantalla inicial:**
- Dos botones grandes para elegir modo:
  - 📋 **Pegar Contenido**
  - 💬 **Chat Interactivo**

#### 2. Modo "Pegar Contenido"

**Flujo completo:**
1. **Inputs del profesor:**
   - Campo "Título del curso" (obligatorio)
   - Campo "Duración total estimada" (opcional, ej: "4 semanas", "20 horas")
   - Textarea para pegar contenido del curso

2. **IA procesa el contenido:**
   - Detecta módulos y lecciones del contenido pegado
   - Extrae títulos reales del contenido
   - Genera descripciones basadas en el contexto
   - **Genera descripción del curso automáticamente**
   - Distribuye tiempos entre lecciones según duración total

3. **Vista previa:**
   - Cuadro verde con resumen:
     - "✓ Estructura detectada: X módulos con Y lecciones"
     - "Duración total: Z minutos"
     - Descripción del curso generada (en cursiva)
   - Lista expandible de módulos con:
     - Título del módulo
     - Descripción del módulo
     - Lecciones con duración individual

4. **Creación:**
   - Click "Crear Curso con esta Estructura"
   - No pide descripción manual (la IA ya la generó)
   - Crea curso completo en DB
   - Redirige automáticamente al editor del curso

**Formatos soportados:**
- Contenido de ChatGPT, Claude, Gemini, NotebookLM
- Markdown (# ##, - viñetas)
- Texto de Word/PDF pegado directamente
- Cualquier estructura con títulos reconocibles

**Modelo IA:** `gpt-4o-mini`

**Prompt al modelo:**
```
Analiza el siguiente contenido educativo y extrae la estructura del curso.

Título del curso: [título ingresado]
Duración total del curso: [duración ingresada]

Identifica:
- Los módulos principales
- Las lecciones dentro de cada módulo
- Descripción de cada módulo y lección
- Descripción general del curso (1-2 oraciones, max 250 caracteres)
- Duración de cada lección (distribuida según duración total)

Contenido:
[contenido pegado]

JSON esperado:
{
  "course_description": "Descripción atractiva del curso",
  "modules": [
    {
      "title": "Título del módulo",
      "description": "Descripción del módulo (max 200 chars)",
      "lessons": [
        {
          "title": "Título de la lección",
          "description": "Descripción de la lección (max 300 chars)",
          "content_type": "video",
          "duration": "XX min"
        }
      ]
    }
  ]
}

Reglas:
- Extrae entre 3 y 8 módulos
- Cada módulo debe tener entre 2 y 6 lecciones
- Usa títulos exactos del contenido
- Descripciones basadas en contenido real, no genéricas
- Si duración total indicada: distribuir tiempo para que sume aproximadamente eso
```

#### 3. Modo "Chat Interactivo"

**Flujo conversacional:**

1. **IA pregunta por tema:**
   ```
   ¡Hola! Soy tu asistente para crear la estructura de tu curso.
   Para comenzar, ¿cuál es el tema principal del curso que quieres crear?
   ```

2. **IA pregunta por duración:**
   ```
   ¡Excelente tema! Ahora cuéntame, ¿cuánto tiempo aproximado tienes
   planificado para este curso? (ej: "2 semanas", "1 mes", "20 horas")
   ```

3. **IA pregunta por nivel:**
   ```
   Entendido. ¿A qué nivel está dirigido este curso?
   (principiante, intermedio, avanzado)
   ```

4. **IA genera estructura:**
   ```
   ¡Perfecto! He generado una estructura inicial para tu curso.
   Incluye X módulos con Y lecciones.

   [Muestra estructura en formato JSON]

   Puedes revisar la estructura abajo y si te parece bien,
   hacer clic en "Crear Curso" para comenzar.
   ```

5. **Vista previa y creación:**
   - Cuadro verde con botón "Crear Curso"
   - Pide título y descripción del curso
   - Crea estructura completa

**Modelo IA:** `gpt-4o-mini`

**Características del chat:**
- Conversación natural y amigable
- Detecta contexto de mensajes previos
- Genera estructura personalizada según respuestas
- Calcula número de módulos/lecciones según duración

#### 4. Distribución Automática de Tiempos

**Lógica implementada:**

Si el profesor indica duración total:
- "4 semanas" → 4 módulos, 3 lecciones cada uno, tiempos distribuidos
- "20 horas" → módulos/lecciones para sumar ~20 horas
- "2 meses" → estructura más extensa

La IA calcula duración de cada lección para que la suma total sea aproximadamente igual a la duración indicada.

**Ejemplo:**
- Duración total: 30 horas
- Estructura detectada: 5 módulos, 20 lecciones total
- IA asigna: ~90 minutos por lección (30h × 60min / 20 lecciones)

#### 5. Creación del Curso en Base de Datos

**API:** `POST /api/instructor/courses`

**Proceso:**
1. Crea registro en tabla `courses`
2. Para cada módulo:
   - Crea registro en tabla `modules` con `order_index`
   - Para cada lección del módulo:
     - Crea registro en tabla `lessons` con `order_index`
3. Retorna `{ course: { id, slug, title } }`
4. Frontend redirige a `/instructor/curso/[slug]`

**Datos creados:**
```sql
-- Curso
INSERT INTO courses (title, slug, description, instructor_id, is_active)

-- Por cada módulo
INSERT INTO modules (course_id, title, description, order_index)

-- Por cada lección
INSERT INTO lessons (
  module_id,
  title,
  description,
  content_type,  -- 'video' por defecto
  duration,
  order_index,
  is_free        -- 0 por defecto
)
```

### Indicadores Visuales de Lecciones Sin Contenido

**Problema resuelto:** Las lecciones recién creadas no tienen contenido (video_url, document_url, markdown_content vacíos), pero visualmente eran iguales a las lecciones completas.

**Solución implementada en `/instructor/curso/[slug]`:**

**Criterio para "sin contenido":**
Una lección NO tiene contenido si todos estos campos están vacíos:
- `video_url`
- `video_file`
- `document_url`
- `markdown_content`
- `video_markdown`

**Indicadores visuales:**

1. **Borde punteado amarillo:**
   ```javascript
   border: hasContent ? '1px solid #e5e7eb' : '2px dashed #fbbf24'
   ```

2. **Badge "Sin contenido":**
   ```
   ⚠️ Sin contenido
   ```
   - Background: `#fef3c7` (amarillo claro)
   - Color: `#d97706` (naranja)
   - Aparece junto al título de la lección

3. **Título en color naranja:**
   ```javascript
   color: hasContent ? '#1a202c' : '#d97706'
   ```

**Resultado visual:**
- **Con contenido:** Borde gris sólido, título negro
- **Sin contenido:** Borde amarillo punteado, título naranja, badge "⚠️ Sin contenido"

Esto permite al instructor identificar rápidamente qué lecciones necesitan ser editadas después de crear la estructura automáticamente.

### Modal de Vista Previa Ampliado

**Mejoras aplicadas:**

**Tamaño:**
- Ancho: `95%` de la ventana (máximo `1400px`)
- Alto: `90vh` (altura fija del 90% de la ventana)
- Video: `600px` de altura (antes: `480px`)

**Orden del contenido:**
1. **Video/Documento** (contenido principal)
2. **Descripción** (cuadro azul con borde izquierdo)
3. **Video Markdown** (notas adicionales)
4. **Contenido Markdown** (solo para tipo markdown)

**Estructura:**
```javascript
width: '95%'
maxWidth: '1400px'
height: '90vh'
display: 'flex'
flexDirection: 'column'
```

Permite aprovechar mejor el espacio para previsualizar contenido educativo.

### Funcionalidades de Drag & Drop Entre Módulos

**Característica:** Mover lecciones entre diferentes módulos (antes solo dentro del mismo módulo)

**Implementación:**
1. **DndContext global único** que envuelve todos los módulos
2. **SortableContext con todas las lecciones** de todos los módulos
3. **DroppableModuleLessons** para cada área de módulo
4. **Detección de cambio de módulo** en `handleLessonDragEnd`

**Handler actualizado:**
```javascript
const handleLessonDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event;

  // Detectar módulo origen y destino
  const sourceModuleId = ...
  const targetModuleId = ...

  if (sourceModuleId !== targetModuleId) {
    // Cross-module move
    await fetch(`/api/instructor/lessons/${lessonId}`, {
      method: 'PATCH',
      body: JSON.stringify({ module_id: targetModuleId })
    });
  } else {
    // Same-module reorder
    // Actualizar order_index
  }
}
```

**API actualizada:**
- Endpoint: `PATCH /api/instructor/lessons/[id]`
- Ahora acepta `module_id` en el body
- UPDATE dinámico que solo actualiza campos enviados

**Vista previa durante drag:**
- `DragOverlay` muestra la lección siendo arrastrada (semi-transparente)
- Borde azul punteado en módulo destino cuando se hace hover
- Mensaje: "📋 Soltar aquí para mover la lección a este módulo"

### Dependencias OpenAI

**Nueva dependencia:**
```json
{
  "openai": "^6.46.0"
}
```

**Configuración:**
```javascript
// .env.local
OPENAI_API_KEY=sk-proj-...

// En rutas API
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

**Modelos usados:**
- `gpt-4o-mini` - Para generación de estructura de cursos
- `gpt-4o` - Para generación de quizzes (mejor seguimiento de instrucciones)

### Flujo Completo de Creación de Curso con IA

```
1. INSTRUCTOR VA A "CREAR CURSO"
   ├─ Elige modo: Pegar Contenido o Chat
   │
   ├─ MODO PEGAR:
   │  ├─ Ingresa título: "Introducción a Python"
   │  ├─ Ingresa duración: "30 horas"
   │  ├─ Pega estructura desde ChatGPT/Claude/Word
   │  ├─ IA procesa contenido
   │  ├─ IA genera:
   │  │  ├─ Descripción del curso
   │  │  ├─ 5 módulos con títulos reales
   │  │  ├─ 20 lecciones con descripciones
   │  │  └─ Tiempos distribuidos (~90min c/u)
   │  ├─ Vista previa completa
   │  ├─ Click "Crear Curso"
   │  └─ Redirige a /instructor/curso/introduccion-a-python
   │
   └─ MODO CHAT:
      ├─ IA: "¿Cuál es el tema del curso?"
      ├─ Instructor: "Marketing Digital"
      ├─ IA: "¿Cuánto tiempo disponible?"
      ├─ Instructor: "4 semanas"
      ├─ IA: "¿Qué nivel?"
      ├─ Instructor: "Principiante"
      ├─ IA genera estructura
      ├─ Vista previa
      ├─ Click "Crear Curso"
      └─ Redirige al editor

2. EDITOR DE CURSO
   ├─ Muestra todos los módulos y lecciones creadas
   ├─ Lecciones con borde amarillo punteado (sin contenido)
   ├─ Badge "⚠️ Sin contenido" visible
   ├─ Instructor edita cada lección:
   │  ├─ Agrega video YouTube
   │  ├─ O sube PDF
   │  ├─ O escribe Markdown
   │  └─ Borde cambia a gris sólido (con contenido)
   ├─ Puede mover lecciones entre módulos (drag & drop)
   ├─ Puede agregar más lecciones manualmente
   └─ Curso listo para publicar
```

### Costos Estimados

**Generación de estructura (gpt-4o-mini):**
- Input: ~$0.15 / 1M tokens
- Output: ~$0.60 / 1M tokens
- Contenido típico: 1000-2000 tokens
- Costo por curso: $0.001 - $0.003 USD (casi gratis)

**Chat interactivo (gpt-4o-mini):**
- 4-6 mensajes promedio
- ~500 tokens por interacción
- Costo total: $0.0005 - $0.001 USD

### Casos de Uso

**Caso 1: Academia de idiomas**
- Profesor tiene curso estructurado en Word
- Copia y pega todo el contenido
- Indica "60 horas" de duración
- IA detecta 8 módulos con 40 lecciones
- Distribuye ~90min por lección
- Genera descripciones en español
- Profesor solo edita contenidos de cada lección

**Caso 2: Instructor individual**
- No tiene estructura previa
- Usa chat interactivo
- Indica: "Excel Avanzado", "3 semanas", "Intermedio"
- IA sugiere 3 módulos con 12 lecciones
- Profesor acepta estructura
- Edita y personaliza después

**Caso 3: Migración desde otra plataforma**
- Profesor exporta estructura de Udemy/Teachable
- Pega JSON/texto estructurado
- IA reconoce módulos y lecciones
- Crea todo en Fluideka automáticamente
- Solo falta subir videos/PDFs

### Archivos Modificados/Creados

**Nuevos:**
- `/src/components/instructor/CourseStructureAssistant.tsx`
- `/src/app/api/instructor/parse-course-structure/route.ts`
- `/src/app/api/instructor/chat-course-structure/route.ts`

**Modificados:**
- `/src/app/instructor/page.tsx` - Integración del asistente
- `/src/app/api/instructor/courses/route.ts` - POST para crear con módulos/lecciones
- `/src/app/api/instructor/lessons/[id]/route.ts` - PATCH dinámico + module_id
- `/src/app/instructor/curso/[slug]/page.tsx` - Drag&drop, indicadores visuales, modal ampliado

### Próximas Mejoras

**No implementado aún:**
1. Importar desde archivo .docx/.pdf directamente
2. Detectar imágenes/diagramas en contenido pegado
3. Sugerir duraciones basadas en tipo de contenido
4. Generar contenido de lecciones con IA (no solo estructura)
5. Plantillas de curso por categoría
6. Validación de estructura antes de crear
7. Editar estructura en vista previa antes de crear

---

**Última actualización:** 2026-07-13
**Versión:** 1.3
**Desarrollado para:** Fluideka Academy / SmartChatix
