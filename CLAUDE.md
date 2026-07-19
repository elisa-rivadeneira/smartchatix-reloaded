# Guía para Claude Code - Fluideka Academy

**⚠️ IMPORTANTE: Lee este archivo COMPLETO al inicio de cada sesión**

# CLAUDE.md
## Proyecto

SmartChatix

## Objetivo

Rediseñar completamente la web.

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

