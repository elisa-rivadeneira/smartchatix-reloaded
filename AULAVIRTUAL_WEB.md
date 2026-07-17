# Landing Page - SmartChatix Academy (Aulas Virtuales)

**Archivo:** `/src/app/servicios/aulas-virtuales/page.tsx`

---

## Hero Section - Diseño Premium con Gradiente Animado

### Configuración del Hero Background

**Section principal con imagen de fondo:**
```javascript
<section style={{
  padding: '8rem 3rem 6rem',
  backgroundImage: 'url(/images/aulavirtual_hero.jpeg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  textAlign: 'center'
}} className="fade-in-up">
```

**Overlay oscuro semitransparente:**
```javascript
<div style={{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 18, 39, 0.62)',  // Azul oscuro con 62% opacidad
  zIndex: 1
}}></div>
```

**Contenedor del contenido (por encima del overlay):**
```javascript
<div style={{
  maxWidth: '1400px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 2  // Por encima del overlay oscuro
}}>
```

### Título con Gradiente Animado

**Animación CSS (en tag `<style>`):**
```css
@keyframes gradientShift {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}

.animated-gradient {
  display: inline-block;
  background: linear-gradient(90deg, #0066CC, #00D9FF, #FF00FF, #00D9FF, #0066CC);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s linear infinite;
}
```

**Título H1 con clase animated-gradient:**
```javascript
<h1 className="animated-gradient" style={{
  fontSize: '4.5rem',
  fontWeight: '700',
  lineHeight: '1.2',
  marginBottom: '1.5rem',
  letterSpacing: '-0.02em'
}}>
  La plataforma para crear cursos con Inteligencia Artificial
</h1>
```

**Colores del gradiente (SmartChatix):**
- Azul corporativo: `#0066CC`
- Cian brillante: `#00D9FF`
- Fucsia: `#FF00FF`

**Efecto visual:**
- El gradiente se mueve horizontalmente de izquierda a derecha
- Loop infinito de 5 segundos
- Crea efecto de "brillo" sobre el texto

### Texto Descriptivo

**Párrafo con sombra para contraste:**
```javascript
<p style={{
  fontSize: '1.4rem',
  color: '#f0f9ff',  // Azul muy claro
  marginBottom: '3rem',
  lineHeight: '1.6',
  maxWidth: '700px',
  margin: '0 auto 3rem',
  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
}}>
  Desde la idea hasta el certificado. SmartChatix Academy ayuda a docentes y estudiantes en cada paso del camino.
</p>
```

### Botón CTA (Call-to-Action)

**Botón con gradiente azul a cian:**
```javascript
<button
  onClick={() => setShowModal(true)}
  style={{
    background: 'linear-gradient(135deg, #0066CC 0%, #00D9FF 100%)',
    color: '#fff',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 20px rgba(0, 102, 204, 0.4)'
  }}
>
  Solicitar una demostración →
</button>
```

**Acción del botón:**
- Abre modal de contacto (`setShowModal(true)`)
- Mismo botón se usa en CTA final (sección negra al final de la página)

---

## Características Técnicas del Diseño

### 1. Estructura de Capas (Z-index)

```
Layer 0: Background image (aulavirtual_hero.jpeg)
   ↓
Layer 1: Overlay oscuro (rgba(0, 18, 39, 0.62))
   ↓
Layer 2: Contenido (texto + botón)
```

### 2. Espaciado y Dimensiones

- **MaxWidth:** 1400px (diseño amplio para pantallas grandes)
- **Padding vertical:** 8rem arriba, 6rem abajo
- **Padding horizontal:** 3rem (aumentado desde 2rem para más amplitud)
- **Content:** Centrado con `margin: 0 auto`

### 3. Colores Utilizados

**Gradiente del título:**
- `#0066CC` - Azul SmartChatix
- `#00D9FF` - Cian brillante
- `#FF00FF` - Fucsia

**Texto y fondos:**
- `#f0f9ff` - Azul muy claro (párrafo descriptivo)
- `rgba(0, 18, 39, 0.62)` - Overlay oscuro con 62% opacidad

**Botón CTA:**
- Gradiente: `#0066CC` → `#00D9FF`
- Sombra: `rgba(0, 102, 204, 0.4)`

### 4. Tipografía

- **H1:** 4.5rem, 700 weight, letter-spacing -0.02em
- **Párrafo:** 1.4rem, line-height 1.6
- **Botón:** 17px, 600 weight

---

## Assets Requeridos

```
/public/images/
└── aulavirtual_hero.jpeg  ← Imagen de fondo del hero
```

**Características de la imagen:**
- Formato: JPEG
- Uso: Background del Hero Section
- Se oscurece con overlay para mejor legibilidad del texto

---

## IMPORTANTE: Preservar en Futuras Ediciones

### ✅ Conservar SIEMPRE:

1. **Background con imagen + overlay oscuro**
   - Imagen: `/images/aulavirtual_hero.jpeg`
   - Overlay: `rgba(0, 18, 39, 0.62)`
   - No cambiar opacidad (0.62 es el balance perfecto)

2. **Gradiente animado en título**
   - Colores SmartChatix: azul → cian → fucsia
   - Animación de 5 segundos (funciona perfectamente)
   - `display: inline-block` es necesario para que funcione

3. **Estructura de z-index**
   - Overlay z-1, contenido z-2
   - Crítico para que el texto se vea por encima

4. **Botón CTA con gradiente**
   - Gradiente azul a cian (identidad SmartChatix)
   - Sombra azul con opacidad 0.4

5. **Texto en colores claros con sombra**
   - `#f0f9ff` para párrafo
   - `textShadow: '0 1px 3px rgba(0,0,0,0.3)'` para contraste

### ❌ NO cambiar:

1. **Animación del gradiente** - Ya funciona correctamente
2. **Opacidad del overlay (0.62)** - Balance perfecto entre oscurecer y ver imagen
3. **MaxWidth de 1400px** - Diseño amplio necesario para landing premium
4. **background-size: 300% 100%** - Necesario para que el gradiente se mueva
5. **animation: gradientShift 5s linear infinite** - Velocidad y tipo de animación óptimos

### 🔄 Se puede modificar (sin romper diseño):

- Texto del título H1 (mantener gradiente)
- Texto del párrafo descriptivo
- Texto del botón CTA
- Acciones del botón (onClick)
- La imagen de fondo (`aulavirtual_hero.jpeg`) si se reemplaza por otra

---

## Otras Secciones de la Página

### Secciones Implementadas (orden):

1. ✅ **Hero** (documentado arriba)
2. ✅ **El Problema** - 4 pain points con emojis
3. ✅ **La Solución** - 6 touchpoints de IA
4. ✅ **Cómo Funciona** - 9 pasos del concepto al certificado
5. ✅ **Dos Formas de Empezar** - Pegar contenido vs Chat IA
6. ✅ **Control del Profesor** - "IA propone, profesor decide"
7. ✅ **Producción de Contenido** - Indicadores visuales (verde/amarillo)
8. ✅ **Experiencia del Estudiante** - 6 pasos
9. ✅ **Certificación Automática** - Sección negra con beneficios
10. ✅ **Comparación** - Tabla LMS Tradicional vs SmartChatix
11. ✅ **Casos de Uso** - 6 personas (docentes, empresas, academias, etc.)
12. ✅ **CTA Final** - Sección negra con mismo botón "Solicitar demostración"

### Colores y Diseño General:

- **Fondo alternado:** Blanco (#fff) / Gris claro (#fafafa)
- **Sección negra:** Certificación y CTA final (#000)
- **Accent color:** Verde #10b981 (para checkmarks y positivos)
- **Advertencia:** Amarillo #fbbf24 (para "sin contenido")
- **MaxWidth general:** 1400px (todas las secciones)

---

## Modal de Contacto

**Trigger:** Click en botón "Solicitar una demostración →"

**Estado:** `const [showModal, setShowModal] = useState(false);`

**Contenido del modal:**
- Formulario de contacto
- Campos: Nombre, Email, Empresa, Mensaje
- Botón "Enviar Solicitud"

(Implementación del formulario y envío pendiente según necesidades del cliente)

---

**Última actualización:** 2026-07-13
**Versión:** 1.0
**Página:** `/servicios/aulas-virtuales`
**Desarrollado para:** SmartChatix Academy
