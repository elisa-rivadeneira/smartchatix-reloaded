# FLUIDEKA ACADEMY - Premium EdTech Website

Una plataforma web premium diseñada para **FLUIDEKA ACADEMY**, la academia online líder en Latinoamérica especializada en ingeniería, CFD y simulación industrial.

## 🚀 Características Principales

### ✨ Diseño y UX Premium
- **Diseño responsivo** optimizado para todos los dispositivos
- **Interfaz moderna** con glassmorphism y gradientes
- **Animaciones fluidas** con Framer Motion
- **Navegación intuitiva** con menús dropdowns inteligentes
- **Hero section** impactante con call-to-actions optimizados

### 📚 Gestión de Contenido Educativo
- **Catálogo de 15 cursos** especializados en ingeniería
- **4 rutas de aprendizaje** estructuradas por nivel
- **Programa destacado** FLUIDEKA PUMP ENGINEER PROGRAM
- **Sistema de filtros** por categoría, nivel y búsqueda
- **Información detallada** de cada curso con curriculum

### 🎯 Optimización de Conversión (CRO)
- **Lead magnet**: Guía gratuita "10 Errores Comunes al Seleccionar una Bomba Centrífuga"
- **Masterclass gratuita** con registro optimizado
- **Múltiples CTAs** estratégicamente ubicados
- **Formularios de captura** con validación avanzada
- **Prueba social** con testimonios y estadísticas

### 🏢 Servicios Empresariales
- **Capacitación empresarial** para equipos técnicos
- **Mentorías personalizadas** con expertos de la industria
- **Formularios especializados** para consultas corporativas
- **Casos de éxito** de empresas como Antamina, Bechtel, Repsol

### 🔧 Stack Tecnológico
- **Next.js 16** con App Router
- **React 19** con TypeScript
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animaciones
- **React Hook Form** + Zod para formularios
- **Lucide React** para iconografía

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal con SEO
│   └── page.tsx           # Homepage principal
├── components/
│   ├── ui/                # Componentes base reutilizables
│   │   └── Button.tsx     # Botón con variantes
│   ├── layout/            # Componentes de layout
│   │   ├── Header.tsx     # Navegación principal
│   │   └── Footer.tsx     # Footer con enlaces y social
│   ├── forms/             # Formularios especializados
│   │   └── LeadCaptureForm.tsx
│   └── sections/          # Secciones de la homepage
│       ├── Hero.tsx
│       ├── FeaturedProgram.tsx
│       ├── LearningPaths.tsx
│       ├── CourseCatalog.tsx
│       ├── LeadMagnetSection.tsx
│       ├── MasterclassSection.tsx
│       ├── SocialProof.tsx
│       ├── CorporateTraining.tsx
│       └── MentoringSection.tsx
├── lib/
│   ├── data.ts           # Base de datos de cursos y programas
│   └── utils.ts          # Utilidades y helpers
└── types/
    └── index.ts          # Definiciones de TypeScript
```

## 🚀 Getting Started

### Prerrequisitos
- Node.js 20+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repo]
cd web_fluideka_reloaded

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos
```

## 📊 Embudo de Conversión

### 1. **Atracción** (Tráfico)
- **Hero section** con propuesta de valor clara
- **SEO optimizado** para keywords de ingeniería
- **Social media** integrado (LinkedIn, YouTube, Instagram)

### 2. **Interés** (Lead Magnet)
- **Guía gratuita** de 25 páginas
- **Masterclass** con casos reales
- **Contenido educativo** de alta calidad

### 3. **Consideración** (Nurturing)
- **Email sequences** automáticos
- **Retargeting** con pixel de Facebook/Google
- **Testimonios** y prueba social

### 4. **Decisión** (Conversión)
- **Ofertas limitadas** con urgencia
- **Garantías** y policies claras
- **Múltiples métodos** de pago

### 5. **Retención** (Loyalty)
- **Comunidad privada** de estudiantes
- **Contenido exclusivo** continuo
- **Programa de referidos**

## 🎯 Estrategia de Marketing

### Canales de Adquisición
1. **Content Marketing**: Blog con SEO técnico
2. **Social Media**: LinkedIn (B2B), YouTube (educativo)
3. **Paid Advertising**: Google Ads, LinkedIn Ads
4. **Email Marketing**: Secuencias automatizadas
5. **Partnerships**: Universidades, asociaciones

### Segmentación de Audiencia
- **Estudiantes**: Universitarios de ingeniería
- **Profesionales**: Ingenieros junior/senior
- **Corporativo**: Gerentes de RRHH, jefes técnicos
- **Freelancers**: Consultores independientes

## 📈 Métricas de Conversión

### KPIs Principales
- **Conversion Rate**: Lead Magnet (objetivo: 15-25%)
- **Email Open Rate**: Secuencias (objetivo: 25-35%)
- **Course Enrollment**: Cursos pagos (objetivo: 3-8%)
- **Corporate Inquiries**: Empresas (objetivo: 5-10/mes)

---

**Desarrollado con ❤️ para impulsar la educación en ingeniería en Latinoamérica**

© 2025 FLUIDEKA ACADEMY. Todos los derechos reservados.
