# Guía para Claude Code - Fluideka Academy

**⚠️ IMPORTANTE: Lee este archivo COMPLETO al inicio de cada sesión**

# CLAUDE.md
## Proyecto

SmartChatix

## Objetivo

Rediseñar completamente la web.

## 🔴 REGLA DE COMUNICACIÓN

**SIEMPRE después de cada modificación de código:**

1. **Confirmar qué se hizo** - Explicar brevemente los cambios realizados
2. **Mostrar el resultado** - Decir qué archivos se modificaron y qué líneas
3. **Dar señales de vida** - Indicar que el cambio está completo y listo

**Ejemplo:**
```
✅ Cambios aplicados en src/app/admin/page.tsx:
- Línea 532: Título cambiado de "Dashboard" a "Bienvenido, Administrador"
- Líneas 759-777: Eliminados badges de porcentaje
- Líneas 799-808: Eliminado texto "vs mes anterior"

Listo para probar. Haz Ctrl+Shift+R en el navegador.
```

**NUNCA dejar al usuario sin respuesta después de ejecutar cambios.**

## Nunca hacer

- No utilizar lenguaje técnico.
- No vender IA.
- No vender herramientas.
- No hablar de automatización como protagonista.

## Siempre hacer

- Hablar de personas.
- Hablar de transformación.
- Hablar de productividad.
- Hablar de aprendizaje.
- Hablar de evolución.

## Filosofía

La inteligencia artificial es un medio.

La persona es el centro.

## Objetivo de cada página

Responder una pregunta del usuario.

No mostrar todas las funcionalidades.

## Diseño

Minimalista.

Elegante.

Mucho espacio en blanco.

Tipografía moderna.

Mucho aire.

No utilizar iconografía tecnológica excesiva.

Evitar robots, cerebros digitales, circuitos, hologramas, etc.

Mostrar personas reales trabajando.

## Prioridad

La emoción antes que la tecnología.

## CTA

Trabaja mejor para vivir mejor.

## Servidor de Desarrollo

### ⚡ Comando Principal (SIEMPRE USAR ESTE)
```bash
./dev.sh
```

Este script:
- Mata TODOS los procesos Node/Next.js zombies
- Libera los puertos 3000-3010
- Verifica que el puerto 3000 esté disponible
- Inicia el servidor SIEMPRE en puerto 3000

### Limpiar cache + reiniciar
```bash
./dev.sh clean
```

Este comando limpia:
- `.next/` (cache de Next.js)
- `node_modules/.cache/`
- `.turbo/` (si existe)
- Todos los procesos
- Y luego inicia limpio en puerto 3000

### ⚠️ NO USAR MÁS estos comandos:
```bash
# ❌ EVITAR
npm run dev

# ❌ EVITAR
pkill -9 -f "next dev"

# ✅ USAR SIEMPRE
./dev.sh
```

### Verificar que el servidor funciona

```bash
curl -I http://localhost:3000 2>&1 | grep HTTP
```
Debe retornar: `HTTP/1.1 200 OK`

### URLs del proyecto

- **Local**: http://localhost:3000
- **Red**: http://192.168.18.49:3000
- **Login**: http://localhost:3000/login
- **Admin**: http://localhost:3000/admin
- **Instructor**: http://localhost:3000/instructor

### Metodología de desarrollo

**Cuando hagas cambios en el código:**

1. **NO reiniciar el servidor** - Next.js hace hot reload automático
2. **Para forzar recompilación**: `touch archivo.tsx`
3. **Solo si hay problemas**: `./dev.sh clean`

**El usuario debe hacer hard refresh en el navegador:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- O abrir DevTools (F12) → Network → Marcar "Disable cache"

## Assets

- **Logo:** `/public/images/logo_fluideka.jpeg`
  - Usado en el Header con Next.js Image component
  - Dimensiones en código: width={120} height={40}

## Header - Menús Segmentados por Audiencia

**Estrategia:** El proyecto tiene 2 audiencias diferentes:
- **B2B (Servicios)**: Colegios/instituciones → Aulas Virtuales
- **B2C (Cursos)**: Profesionales → Cursos de IA

**Componente unificado:** `/src/components/layout/Header.tsx`

### Configuración por tipo de página

#### 1. Páginas de CURSOS (B2C)
```tsx
import Header from '@/components/layout/Header';

<Header showCursos={true} showServicios={false} courses={courses} />
```
**Menú muestra:** Inicio, Cursos (dropdown), Nosotros, Contacto

**Ejemplos:**
- `/src/app/page.tsx` (index)
- `/src/app/cursos/[slug]/page.tsx`

#### 2. Páginas de SERVICIOS (B2B)
```tsx
import Header from '@/components/layout/Header';

<Header showCursos={false} showServicios={true} />
// O simplemente:
<Header />  // Por defecto muestra Servicios
```
**Menú muestra:** Inicio, Servicios (dropdown), Nosotros, Contacto

**Ejemplos:**
- `/src/app/servicios/aulas-virtuales/page.tsx`

#### 3. Páginas mixtas (si es necesario)
```tsx
<Header showCursos={true} showServicios={true} courses={courses} />
```

### Props disponibles

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showCursos` | boolean | `false` | Muestra menú dropdown de Cursos |
| `showServicios` | boolean | `true` | Muestra menú dropdown de Servicios |
| `courses` | array | `[]` | Lista de cursos para el dropdown (requerido si showCursos=true) |

### Obtener lista de cursos

```tsx
const [courses, setCourses] = React.useState<any[]>([]);

React.useEffect(() => {
  fetch('/api/public/courses')
    .then(res => res.json())
    .then(data => setCourses(data.courses || []))
    .catch(err => console.error('Error fetching courses:', err));
}, []);
```

### ⚠️ Importante

- **NO crear headers embebidos** - Siempre usar el componente Header
- **Segmentar audiencias** - No mostrar Cursos en páginas B2B y viceversa
- **Un solo archivo** - Todos los cambios en `/src/components/layout/Header.tsx`

## Comandos útiles

- Lint: `npm run lint` (si está configurado)
- Build: `npm run build`
- Typecheck: Verificar en package.json si existe

## ⚠️ CRÍTICO: Antes de hacer Git Push

**SIEMPRE ejecutar ANTES de commit:**

```bash
npm run build
```

Este comando:
- Compila TypeScript con validación completa (strict mode)
- Detecta errores que development mode ignora
- Valida que el código funcione en producción
- Previene errores en el deploy

**Si el build falla:**
1. Leer el error de TypeScript
2. Corregir el código
3. Volver a ejecutar `npm run build`
4. Solo cuando pase exitosamente ✓, hacer commit y push

**NUNCA hacer push sin verificar el build de producción.**

