# SmartChatix - Plataforma EdTech Completa

Plataforma web completa de academia online con **aula virtual integrada**, **sistema de pagos** y **gestión de cursos** para SmartChatix (Fluideka Academy).

## 🚀 Características Principales

### 🛒 Sistema de Comercio Electrónico
- **Carrito de compras** integrado con Culqi
- **Pasarela de pagos** con tarjetas de crédito/débito (Visa, Mastercard, Amex, Diners)
- **Checkout optimizado** en un solo paso
- **Confirmación automática** de pagos
- **Métodos de pago múltiples**: Tarjeta, PayPal, Yape

### 🎓 Aula Virtual Completa
- **Dashboard de estudiante** con progreso de cursos
- **Reproductor de video** integrado
- **Sistema de módulos y lecciones** con tracking de progreso
- **Quizzes interactivos** con calificación automática
- **Entrega de tareas** con sistema de archivos
- **Certificados digitales** generados automáticamente al completar cursos
- **Verificación de certificados** con código único

### 👨‍🏫 Panel de Instructor
- **Gestión de cursos** (crear, editar, eliminar)
- **Subida de contenido multimedia** (videos, documentos, imágenes)
- **Editor de lecciones** con Markdown y TipTap
- **Creación de quizzes** con múltiples tipos de preguntas
- **Calificaciones** de tareas y quizzes
- **Asistente IA** para estructurar cursos automáticamente
- **Reordenamiento drag-and-drop** de módulos y lecciones
- **Configuración de pesos** para evaluaciones

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con activación por email
- **Login/Logout** con JWT
- **Roles**: Admin, Instructor, Estudiante
- **Protección de rutas** según rol
- **Recuperación de contraseña**

### 💳 Integración de Pagos - Culqi
- **Tokenización segura** de tarjetas
- **Culqi.js v4** para formularios custom
- **Endpoint de cargo** en backend
- **Matrícula automática** después del pago exitoso
- **Entorno de pruebas** configurado

### 📊 Panel de Administrador
- **Dashboard con estadísticas** de cursos y usuarios
- **Gestión de usuarios** (crear, editar, eliminar)
- **Gestión de cursos** global
- **Vista de matrículas** por curso
- **Reportes y analíticas**

## 🔧 Stack Tecnológico

### Frontend
- **Next.js 15** con App Router
- **React 19** con TypeScript
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **TipTap** editor WYSIWYG
- **React Hook Form** + Zod para validación

### Backend
- **Next.js API Routes**
- **MySQL** base de datos relacional
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **Nodemailer** para emails

### Pagos
- **Culqi.js v4** SDK oficial
- **culqi-node** SDK para backend
- Tarjetas de prueba disponibles

### Deployment
- **EasyPanel** (hosting)
- **GitHub** (repositorio)
- **Nixpacks** (build)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticación
│   │   ├── payment/              # Pagos con Culqi
│   │   ├── instructor/           # Endpoints de instructor
│   │   ├── student/              # Endpoints de estudiante
│   │   └── admin/                # Endpoints de admin
│   ├── aula-virtual/            # Aula virtual del estudiante
│   ├── instructor/              # Panel del instructor
│   ├── admin/                   # Panel de administración
│   ├── comprar-grabado/         # Checkout de curso grabado
│   ├── inscripcion-vivo/        # Checkout de curso en vivo
│   ├── login/                   # Página de login
│   └── register/                # Página de registro
├── components/
│   ├── CulqiPaymentForm.tsx     # Formulario de pago con Culqi
│   ├── StudentSidebar.tsx       # Sidebar del aula virtual
│   ├── CourseInstructorHeader.tsx
│   ├── MarkdownEditor.tsx       # Editor de lecciones
│   └── ...
├── lib/
│   ├── db.ts                    # Conexión a MySQL
│   ├── auth.ts                  # Helpers de autenticación
│   ├── culqi.ts                 # Cliente de Culqi
│   └── utils.ts
└── data/
    └── courses.ts               # Catálogo de cursos
```

## 🚀 Getting Started

### Prerrequisitos
- Node.js 20+
- MySQL 8+
- Cuenta de Culqi (para pagos)

### Variables de Entorno

Crea un archivo `.env.local`:

```bash
# Base de datos
DATABASE_URL="mysql://usuario:password@host:3306/base_datos"

# Autenticación
JWT_SECRET="tu_secret_key_aqui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu_nextauth_secret"

# Email (opcional)
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="tu_password"

# OpenAI (opcional - para asistente IA)
OPENAI_API_KEY="sk-proj-..."

# Culqi
NEXT_PUBLIC_CULQI_PUBLIC_KEY="pk_test_..."
CULQI_SECRET_KEY="sk_test_..."
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/elisa-rivadeneira/smartchatix-reloaded.git
cd smartchatix-reloaded

# Instalar dependencias
npm install

# Crear base de datos
mysql -u root -p < db/schema.sql

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo en puerto 3000
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## 💳 Testing de Pagos (Culqi)

### Tarjetas de Prueba

**Visa exitosa:**
- Número: `4111 1111 1111 1111`
- CVV: `123`
- Fecha: `12/25`

**Mastercard exitosa:**
- Número: `5111 1111 1111 1118`
- CVV: `123`
- Fecha: `12/25`

Ver más en `CULQI_TESTING.md`

## 📝 Flujo de Usuario

### Estudiante
1. Navega catálogo de cursos
2. Selecciona curso (grabado o en vivo)
3. Completa checkout con datos personales
4. Paga con tarjeta vía Culqi
5. Recibe acceso automático al aula virtual
6. Estudia módulos y lecciones
7. Completa quizzes y tareas
8. Obtiene certificado digital

### Instructor
1. Accede al panel de instructor
2. Crea nuevo curso
3. Estructura módulos y lecciones
4. Sube contenido multimedia
5. Crea quizzes y tareas
6. Califica entregas de estudiantes
7. Monitorea progreso

### Administrador
1. Dashboard con métricas
2. Gestiona usuarios y roles
3. Revisa matrículas
4. Analiza reportes

## 🔒 Seguridad

- Variables de entorno protegidas (`.env*` en `.gitignore`)
- JWT con expiración configurada
- Contraseñas hasheadas con bcrypt
- Validación de inputs con Zod
- Protección CSRF en formularios
- Headers de seguridad configurados

## 📚 Documentación Adicional

- `CLAUDE.md` - Guía para desarrollo con Claude Code
- `CULQI_TESTING.md` - Testing de integración de Culqi
- `AULAVIRTUAL.md` - Documentación del aula virtual
- `DESARROLLO.md` - Guía de desarrollo

## 🚀 Deployment

### EasyPanel
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Nixpacks detecta automáticamente Next.js
4. Deploy automático en cada push

### Variables de Entorno en Producción
Configurar todas las variables listadas arriba en el panel de EasyPanel.

## 📊 Roadmap

- [x] Sistema de autenticación
- [x] Aula virtual completa
- [x] Panel de instructor
- [x] Integración de pagos con Culqi
- [x] Generación de certificados
- [ ] Notificaciones por email
- [ ] Chat en vivo
- [ ] App móvil con React Native
- [ ] Integración con Zoom para clases en vivo

---

**Desarrollado con ❤️ para transformar la educación online**

© 2025 SmartChatix. Todos los derechos reservados.
