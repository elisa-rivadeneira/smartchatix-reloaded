```markdown
---
documento: "10B"
nombre: "UI Design System"
version: "1.0"
estado: "Aprobado"
proyecto: "SmartChatix Visual OS"
ultima_actualizacion: "2026-07-02"
depende_de:
  - Documento 10 - Design DNA
  - Documento 10A - Cinematic Design Language
objetivo: >
  Definir el sistema técnico de interfaz de SmartChatix para garantizar
  consistencia visual, accesibilidad, mantenibilidad y escalabilidad
  en todos los productos digitales.
---

# Documento 10B — UI Design System

# Introducción

Este documento define todas las reglas técnicas del sistema visual de SmartChatix.

No describe estilos.

Describe un sistema.

Todo componente deberá construirse siguiendo estas reglas.

Nunca crear componentes fuera del Design System.

---

# Filosofía

Un buen diseño no se nota.

Una buena interfaz desaparece.

El usuario debe concentrarse en aprender.

No en entender la interfaz.

---

# Framework

Frontend

- React
- Vite
- Tailwind CSS

Arquitectura

Atomic Design

Componentes reutilizables.

Nunca estilos duplicados.

---

# Sistema de Grid

Grid principal

12 columnas

Container máximo

1280px

Padding lateral Desktop

80px

Padding Tablet

48px

Padding Mobile

24px

Nunca utilizar contenido pegado a los bordes.

---

# Sistema de Espaciado

Utilizar una escala de 8 puntos.

8

16

24

32

40

48

64

80

96

128

160

Nunca utilizar valores arbitrarios.

---

# Separación entre secciones

Desktop

160px

Tablet

120px

Mobile

96px

Cada sección debe respirar.

---

# Tipografía

Fuente principal

Inter

Fuente alternativa

Manrope

Nunca mezclar familias tipográficas.

---

# Escala Tipográfica

Hero

72px

Peso

800

Line Height

90%

---

H1

56px

700

---

H2

48px

700

---

H3

36px

600

---

H4

28px

600

---

Body XL

22px

---

Body

18px

---

Body Small

16px

---

Caption

14px

---

# Longitud máxima

Nunca superar

80 caracteres por línea.

El texto debe ser cómodo de leer.

---

# Colores

Primario

Azul SmartChatix

Secundario

Fucsia SmartChatix

Neutros

Blanco

Grises

Negro profundo

Los degradados solo se utilizan como acentos.

Nunca como fondo dominante.

---

# Bordes

Radio XS

8px

Small

12px

Medium

20px

Large

28px

Extra Large

40px

Evitar esquinas completamente cuadradas.

---

# Botones

Altura

56px

Padding horizontal

28px

Radio

16px

Peso

600

Nunca utilizar más de dos botones principales por pantalla.

---

## Botón Primario

Fondo sólido.

Hover

Ligero aumento de brillo.

Nunca efectos exagerados.

---

## Botón Secundario

Outline.

Muy limpio.

---

## Botón Ghost

Sin fondo.

Solo para acciones secundarias.

---

# Cards

Padding interno

40px

Radio

24px

Borde

Muy sutil

Shadow

Muy ligera

Las cards nunca deben competir con el contenido.

---

# Formularios

Altura Input

56px

Radio

16px

Placeholder elegante.

Mucho espacio interno.

Estados

Normal

Hover

Focus

Error

Success

Todos claramente definidos.

---

# Navbar

Altura

88px

Sticky

Sí

Con desenfoque muy ligero.

Nunca ocupar demasiado espacio.

Logo izquierda.

CTA derecha.

---

# Footer

Muy limpio.

Mucho espacio.

No saturar con enlaces.

---

# Iconografía

Biblioteca

Lucide

Stroke

1.75

Nunca iconos rellenos.

Nunca iconografía futurista.

---

# Imágenes

Siempre alta calidad.

Relación

16:9

Evitar bancos de imágenes genéricos.

Mostrar personas reales.

---

# Videos

Autoplay

Solo si no distraen.

Siempre sin sonido.

No utilizar videos únicamente por decoración.

---

# Animaciones

Duración

250ms

500ms

800ms

Nunca superiores a un segundo.

---

Curva

ease-out

Nunca bounce.

Nunca elastic.

---

# Scroll

Suave.

Natural.

Sin efectos extravagantes.

---

# Sombras

Muy discretas.

No utilizar sombras oscuras.

La profundidad se consigue mediante espacio.

No mediante sombras.

---

# Accesibilidad

Contraste AA mínimo.

Focus visible.

Navegación mediante teclado.

Textos legibles.

Botones accesibles.

No depender únicamente del color.

---

# Responsive

Desktop First.

Tablet.

Mobile.

Todos los componentes deben diseñarse para los tres tamaños.

Nunca ocultar contenido importante en móviles.

---

# Performance

Lazy Loading.

Optimización de imágenes.

Carga progresiva.

Componentes livianos.

Priorizar velocidad sobre efectos.

---

# Componentes Base

Navbar

Hero

Section

Container

Button

Card

Input

Textarea

Select

Badge

Alert

Modal

Accordion

Tabs

Testimonial

Timeline

FAQ

CTA

Footer

Todos reutilizables.

---

# Componentes SmartChatix

Learning Path

Course Card

Service Card

Transformation Card

Case Study

Before / After

Metrics Block

Quote Block

Resource Card

Author Block

Article Hero

Community Block

Course Timeline

Progress Block

Todos deberán respetar el mismo lenguaje visual.

---

# Lo que nunca haremos

❌ Componentes diferentes para el mismo propósito.

❌ Colores inventados.

❌ Espaciados inconsistentes.

❌ Botones con tamaños distintos.

❌ Cards con radios distintos.

❌ Tipografías mezcladas.

❌ Sombras exageradas.

❌ Interfaces que parezcan plantillas.

---

# Principio Estratégico

Todo componente de SmartChatix debe cumplir tres requisitos.

Ser claro.

Ser reutilizable.

Ser invisible.

La mejor interfaz es aquella que permite que la atención permanezca en las personas, el conocimiento y la transformación.

Nunca en la propia interfaz.

```

