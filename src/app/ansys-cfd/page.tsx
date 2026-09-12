'use client';

import React from 'react';
import Link from 'next/link';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import gsap from 'gsap';
import { useCurrency } from '@/hooks/useCurrency';
import * as fbPixel from '@/lib/fbPixel';
import LenisProvider from '@/components/ansys-cfd/LenisProvider';
import AuroraBackground from '@/components/ansys-cfd/AuroraBackground';
import styles from './ansys-cfd.module.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Slug real del curso en la base de datos — coincide con /cursos/introduccion-a-la-simulacion-con-ansys-cfd.
const CHECKOUT_SLUG = 'introduccion-a-la-simulacion-con-ansys-cfd';
const WHATSAPP_NUMBER = '51967717179';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola, tengo una duda sobre el curso de Introducción a la Simulación con ANSYS CFD');

const PRICE = {
  PEN: { current: 99, old: 198, symbol: 'S/' },
  USD: { current: 30, old: 60, symbol: 'US$' },
} as const;

const INSTRUCTOR = {
  name: 'Jesús Fernández Espinoza',
  title: 'Especialista en Simulación CFD, Turbomáquinas y Diseño Hidráulico',
  paragraph: 'Aprende con un especialista con experiencia real en la industria y en la aplicación práctica de ANSYS CFX en proyectos de turbomáquinas y sistemas de fluidos.',
  quote: 'Compartir conocimiento es impulsar el desarrollo de mejores soluciones para la industria.',
  credentials: [
    { Icon: CapIcon, text: 'Formación en Ingeniería de Mecánica de Fluidos — UNMSM' },
    { Icon: DocumentIcon, text: 'Maestría en Turbomáquinas — UNSA' },
    { Icon: GearIcon, text: 'Especialista en ANSYS CFX aplicado a la industria' },
    { Icon: GlobeIcon, text: 'Capacitación técnica internacional en México, Chile, Colombia y Rusia' },
  ],
};

const INSTRUCTOR_FEATURES = [
  { Icon: BookIcon, title: 'Experiencia en proyectos reales' },
  { Icon: CapIcon, title: 'Formación académica sólida' },
  { Icon: ChartIcon, title: 'Enfoque práctico y aplicado' },
  { Icon: GlobeIcon, title: 'Visión internacional de la industria' },
];

// Video real ya embebido en la página (youtube-nocookie/wyiK6JUs9oc) — sección
// 06/08, rediseñada con el mismo tono que la sección 05 (Instructor).
const CLASS_VIDEO = {
  youtubeId: 'wyiK6JUs9oc',
  title: 'Webinar de Introducción a la Simulación en CFD',
  duration: 'Clase completa · 1 h 15 min aprox.',
};

const CLASS_FEATURES = [
  { Icon: BookIcon, text: 'Explicaciones paso a paso' },
  { Icon: GearIcon, text: 'Demostraciones en vivo con ANSYS' },
  { Icon: DocumentIcon, text: 'Ejemplos y casos prácticos' },
  { Icon: LightbulbIcon, text: 'Conceptos claros y aplicados' },
];

// CTA final (08/08) — la conversión más importante de la página.
const CTA_BENEFITS = [
  { Icon: CapIcon, title: 'Conocimiento', desc: 'aplicable a tu carrera' },
  { Icon: DocumentIcon, title: 'Soporte durante', desc: 'el curso' },
  { Icon: UsersIcon, title: 'Únete a una comunidad', desc: 'de ingenieros' },
  { Icon: InfinityIcon, title: 'Acceso ilimitado', desc: 'para que avances a tu ritmo' },
];

const CTA_TRUST = [
  { Icon: ShieldCheckIcon, title: 'Pago seguro', desc: 'Tus datos están protegidos' },
  { Icon: BoltIcon, title: 'Acceso inmediato', desc: 'Comienza hoy mismo' },
  { Icon: MedalIcon, title: 'Certificado digital', desc: 'Al completar el curso' },
  { Icon: HeadsetIcon, title: 'Soporte por WhatsApp', desc: 'Resolvemos tus dudas' },
];

const FAQS = [
  {
    q: '¿Necesito experiencia previa en CFD o ANSYS?',
    a: 'No. El curso está diseñado para aprender el flujo completo de una simulación desde cero, paso a paso.',
  },
  {
    q: '¿Qué necesito para seguir el curso?',
    a: 'Con la versión estudiante de ANSYS CFX es suficiente para seguir todas las clases.',
  },
  {
    q: '¿Por cuánto tiempo tengo acceso al curso?',
    a: 'Tienes acceso a las grabaciones por 1 año desde tu inscripción, y puedes repetir las clases las veces que quieras dentro de ese período.',
  },
  {
    q: '¿El certificado tiene validez?',
    a: 'Sí, al completar el curso recibes un certificado digital verificable, con código único.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Puedes pagar con Yape o PayPal, de forma segura, y obtienes acceso inmediato.',
  },
  {
    q: '¿Qué pasa si tengo dudas durante el curso?',
    a: 'Puedes escribirnos por WhatsApp en cualquier momento y te ayudamos.',
  },
];

// Fuente: API pública de producción para el curso real
// (introduccion-a-la-simulacion-con-ansys-cfd) — learning_outcomes.
// Sección "El desafío" — mismo tono que el FAQ real ("No necesitas experiencia
// previa") y la bio del instructor (acompañamiento durante el curso).
const CHALLENGE = {
  eyebrow: '02 / 08 · El desafío',
  titleLead: '¿Quieres aprender CFD, pero',
  titleAccent: 'no sabes por dónde empezar?',
  text: 'No necesitas dominar CFD para comenzar. Aprende paso a paso con ANSYS, desde cero y con un enfoque práctico, acompañado por un instructor que te guiará durante todo el proceso.',
  features: [
    { icon: 'learn' as const, title: 'Aprende desde cero', desc: 'Sin experiencia previa requerida.' },
    { icon: 'method' as const, title: 'Sigue un método claro', desc: 'Aprende qué hacer y por qué hacerlo.' },
    { icon: 'apply' as const, title: 'Aplica lo aprendido', desc: 'Habilidades útiles para proyectos reales de ingeniería.' },
  ],
};

function ChallengeIcon({ type }: { type: 'learn' | 'method' | 'apply' }) {
  if (type === 'learn') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 4 L22 9 L12 14 L2 9 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'method') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 20h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8.5 L16 12 L10 15.5 Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6.5V12l4 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 19h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function InfinityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <ellipse cx="8" cy="12" rx="4.2" ry="3.2" stroke="currentColor" strokeWidth="1.6" transform="rotate(-18 8 12)" />
      <ellipse cx="16" cy="12" rx="4.2" ry="3.2" stroke="currentColor" strokeWidth="1.6" transform="rotate(18 16 12)" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 4 L22 9 L12 14 L2 9 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h9A1.5 1.5 0 0 1 21 9v8.5A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 20h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="17" y="13" width="4" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.5c-1.5-1.2-3.5-1.8-6-1.8v13.6c2.5 0 4.5 0.6 6 1.8 1.5-1.2 3.5-1.8 6-1.8V4.7c-2.5 0-4.5 0.6-6 1.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.5v13.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return <ChallengeIcon type="method" />;
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9a2.5 2.5 0 1 0 0-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 14.3c2 .5 3.5 2.2 3.5 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12.3l2 2 4-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13.5 7.5 21l4.5-2.5L16.5 21 15 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// Fuente: misma API, module_titles + modules[].description del curso real.
// El checklist de cada módulo es el propio título/descripción real, partido
// en sus 3 componentes naturales — no es contenido nuevo.
const R2_BASE = 'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/assets/ansys-cfd';

const MODULES = [
  {
    num: 1, title: 'Fundamentos CFD, flujo de trabajo y errores comunes', hours: '2.0h',
    description: 'Explora los principios básicos de la dinámica de fluidos computacional y los errores comunes en simulaciones.',
    checklist: ['Fundamentos CFD', 'Flujo de trabajo', 'Errores comunes'],
    image: `${R2_BASE}/cfd_modulo01.png`,
  },
  {
    num: 2, title: 'Geometría, dominio computacional y mallado inicial', hours: '2.0h',
    description: 'Aprende a crear la geometría y definir el dominio computacional, así como a realizar el mallado inicial.',
    checklist: ['Preparación de geometría', 'Dominio computacional', 'Mallado inicial'],
    image: `${R2_BASE}/cfd_modulo02.png`,
  },
  {
    num: 3, title: 'Setup CFD: materiales, fronteras y modelos físicos', hours: '2.0h',
    description: 'Configuración de la simulación, incluyendo la asignación de materiales, condiciones de frontera y selección de modelos físicos.',
    checklist: ['Materiales y modelos físicos', 'Condiciones de frontera', 'Configuración de la solución'],
    image: `${R2_BASE}/cfd_modulo03.png`,
  },
  {
    num: 4, title: 'Solución, convergencia, postproceso y reporte básico', hours: '2.0h',
    description: 'Proceso de solución de la simulación, análisis de convergencia, postproceso de resultados y generación de reportes.',
    checklist: ['Criterios de convergencia', 'Análisis de resultados', 'Reportes profesionales'],
    image: `${R2_BASE}/cfd_modulo04.png`,
  },
];

const TESTIMONIALS = [
  {
    name: 'Said Franchesco Bravo Pastor',
    role: 'Ingeniero',
    rating: 5,
    text: 'Antes no sabía por dónde empezar, ahora ya puedo aplicarlo en mi trabajo del día a día.',
  },
  {
    name: 'Antony Josel Davila Paredes',
    role: 'Ingeniero',
    rating: 4,
    text: 'El instructor explica de forma súper clara, resolvió todas mis dudas al instante.',
  },
];

const BENEFITS = [
  { icon: '🎓', text: 'Certificado digital' },
  { icon: '📋', text: 'Materiales de estudio' },
  { icon: '💻', text: 'Acceso desde cualquier lugar' },
  { icon: '♾️', text: 'Repite las clases cuando quieras' },
];

/* Panel flotante sobre la foto en "Curso grabado" (sección 04) */
const RECORDED_PANEL = [
  { Icon: PlayCircleIcon, text: 'Clases en video bajo demanda' },
  { Icon: DocumentIcon, text: 'Material de apoyo descargable' },
  { Icon: LaptopIcon, text: 'Acceso desde cualquier dispositivo' },
  { Icon: InfinityIcon, text: 'Acceso ilimitado durante el curso' },
];

/* Barra de features debajo de la foto en "Curso grabado" (sección 04) */
const RECORDED_FEATURES = [
  { Icon: CapIcon, title: 'Contenido completo', desc: 'Mismo temario del curso en vivo.' },
  { Icon: FolderIcon, title: 'Casos prácticos', desc: 'Ejemplos reales paso a paso.' },
  { Icon: ChartIcon, title: 'Aprendizaje flexible', desc: 'Estudia a tu ritmo, sin horarios.' },
  { Icon: HeadsetIcon, title: 'Soporte académico', desc: 'Resuelve tus dudas durante el curso.' },
];

/* Términos que un alumno verá a lo largo del curso — flotan alrededor del
 * rodete 3D, apareciendo y desapareciendo solos (ver FloatingCallouts). */
const SIM_TERMS = ['Mallado', 'Convergencia', 'Presión', 'Velocidad', 'Turbulencia', 'Dominio computacional', 'Postproceso', 'Condiciones de frontera'];

/* 6 posiciones simétricas (2 columnas x 3 filas) repartidas parejo alrededor del rodete. */
// Posiciones sobre el lado derecho del hero (donde queda la animación de
// flujo del video tras espejarlo) — el lado izquierdo lo ocupa el texto.
const CALLOUT_SLOTS: React.CSSProperties[] = [
  { top: '16%', right: '6%' },
  { top: '30%', right: '32%' },
  { top: '48%', right: '4%' },
  { top: '58%', right: '28%' },
  { bottom: '24%', right: '8%' },
  { bottom: '16%', right: '30%' },
];

type CalloutSlotState = { term: string; visible: boolean };

/**
 * Etiquetas flotantes con términos técnicos: cada una se desvanece adentro/afuera
 * sola, en un ciclo con timings aleatorios. Coordinadas en un solo componente para
 * que, en un momento dado, ningún término se repita entre las que están visibles.
 * Usa solo setTimeout con cleanup — nada de tamaños/porcentajes de layout.
 */
function FloatingCallouts() {
  const [slots, setSlots] = React.useState<CalloutSlotState[]>(() =>
    CALLOUT_SLOTS.map((_, i) => ({ term: SIM_TERMS[i % SIM_TERMS.length], visible: false }))
  );

  React.useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const runSlot = (index: number) => {
      if (cancelled) return;
      // La elección del término va DENTRO del updater: React siempre le pasa el
      // estado más reciente a `prev`, sin importar el batching de timers — así
      // se evita la condición de carrera de leer un ref que aún no se actualizó
      // (eso causaba que dos slots eligieran el mismo término a la vez).
      setSlots((prev) => {
        const usedElsewhere = new Set(
          prev.filter((s, i) => i !== index && s.visible).map((s) => s.term)
        );
        const options = SIM_TERMS.filter((t) => !usedElsewhere.has(t));
        const term = options[Math.floor(Math.random() * options.length)] ?? SIM_TERMS[index % SIM_TERMS.length];
        const next = [...prev];
        next[index] = { term, visible: true };
        return next;
      });

      const holdMs = 2400 + Math.random() * 2000;
      const hideTimeout = setTimeout(() => {
        if (cancelled) return;
        setSlots((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], visible: false };
          return next;
        });

        const gapMs = 1200 + Math.random() * 2000;
        const nextTimeout = setTimeout(() => runSlot(index), gapMs);
        timeouts.push(nextTimeout);
      }, holdMs);
      timeouts.push(hideTimeout);
    };

    CALLOUT_SLOTS.forEach((_, i) => {
      const startTimeout = setTimeout(() => runSlot(i), 300 + i * 450 + Math.random() * 400);
      timeouts.push(startTimeout);
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      {CALLOUT_SLOTS.map((slot, i) => {
        const isRight = slot.right !== undefined;
        return (
          <div
            key={i}
            className={`${styles.callout} ${slots[i].visible ? styles.calloutVisible : ''} ${isRight ? styles.calloutRight : ''} ${styles.mono}`}
            style={slot}
          >
            <span className={styles.calloutDot} />
            <span className={styles.calloutLine} />
            <span>{slots[i].term}</span>
          </div>
        );
      })}
    </>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {'★'.repeat(count)}
      <span className={styles.starsOff}>{'★'.repeat(5 - count)}</span>
    </div>
  );
}

function getPromoEnd(): Date {
  const now = new Date();
  const end = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7;
  end.setDate(now.getDate() + daysUntilSunday);
  end.setHours(23, 59, 59, 999);
  if (end.getTime() <= now.getTime()) {
    end.setDate(end.getDate() + 7);
  }
  return end;
}

function useCountdown() {
  const [remaining, setRemaining] = React.useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    const target = getPromoEnd();
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setRemaining({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return remaining;
}

export default function AnsysCfdLandingPage() {
  const { currency } = useCurrency();
  const countdown = useCountdown();

  const pageRef = React.useRef<HTMLDivElement>(null);
  const challengeImgRef = React.useRef<HTMLImageElement>(null);
  const challengeGlowRef = React.useRef<HTMLDivElement>(null);

  const price = PRICE[currency];
  const priceCurrent = `${price.symbol} ${price.current}`;
  const priceOld = `${price.symbol} ${price.old}`;
  const discountPct = Math.round((1 - price.current / price.old) * 100);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    fbPixel.viewContent('Introducción a la Simulación con ANSYS CFD', 'Cursos', PRICE.PEN.current, 'PEN');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animaciones de scroll (GSAP + ScrollTrigger). Cada bloque revela una sola
  // vez al entrar y solo se oculta de nuevo si el usuario sube más allá del
  // punto de entrada — nunca mientras la sección sigue centrada en pantalla
  // (con "play reverse play reverse" el contenido se ocultaba a mitad de
  // scroll en secciones altas, porque el final del trigger se alcanzaba
  // mientras la sección aún llenaba el viewport).
  // Se desactiva por completo con prefers-reduced-motion.
  React.useEffect(() => {
    if (!pageRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const ease = 'power3.out';
      const inOut = { start: 'top 82%', end: 'bottom 20%', toggleActions: 'play none none reverse' } as const;

      // Hero: entrada única al cargar (no scroll-triggered).
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .from('.hero-reveal', { opacity: 0, y: 24, duration: 0.8, ease, stagger: 0.1 })
        .from('.hero-price-card', { opacity: 0, scale: 0.94, duration: 0.6, ease: 'power2.out' }, '-=0.35');

      // Hero: se desvanece y aleja levemente al salir de pantalla (scrub).
      gsap.to('.hero-inner', {
        opacity: 0.25, scale: 0.94, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });

      // Encabezados de sección: entrada + salida, con leve "emerge con escala".
      gsap.utils.toArray<HTMLElement>('.section-head-reveal').forEach((head) => {
        gsap.from(head, { opacity: 0, y: 28, scale: 0.97, duration: 0.75, ease, scrollTrigger: { trigger: head, ...inOut } });
      });

      gsap.from('.benefit-item', {
        opacity: 0, y: 20, scale: 0.96, duration: 0.6, ease, stagger: 0.1,
        scrollTrigger: { trigger: '.benefits-grid', ...inOut },
      });

      // Sección 02 "El desafío": el contenido izquierdo entra suave, el
      // visual CFD entra con desplazamiento + scale-in, y tiene un parallax
      // sutil ligado al scroll. El seguimiento del mouse va en elementos
      // internos aparte (ver handleChallengeMouseMove) para no competir por
      // las mismas propiedades de transform.
      gsap.from('.challenge-intro-reveal', {
        opacity: 0, y: 24, duration: 0.8, ease, stagger: 0.15,
        scrollTrigger: { trigger: '.challenge-section', ...inOut },
      });
      gsap.from('.challenge-benefit-item', {
        opacity: 0, y: 16, duration: 0.55, ease, stagger: 0.1,
        scrollTrigger: { trigger: '.challenge-section', start: 'top 70%', end: 'bottom 20%', toggleActions: 'play none none reverse' },
      });
      gsap.from('.challenge-visual-reveal', {
        opacity: 0, scale: 0.92, x: 40, duration: 1, ease,
        scrollTrigger: { trigger: '.challenge-visual-reveal', ...inOut },
      });
      gsap.to('.challenge-visual-reveal', {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.challenge-section', start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // Sección "Curso grabado": el panel flotante entra con scale-in y sus
      // 4 ítems aparecen en cascada.
      gsap.from('.recorded-panel-reveal', {
        opacity: 0, scale: 0.94, y: 20, duration: 0.9, ease,
        scrollTrigger: { trigger: '.recorded-section', ...inOut },
      });
      gsap.from('.recorded-panel-item', {
        opacity: 0, x: 20, duration: 0.5, ease, stagger: 0.1,
        scrollTrigger: { trigger: '.recorded-section', start: 'top 70%', end: 'bottom 20%', toggleActions: 'play none none reverse' },
      });

      gsap.from('.module-row', {
        opacity: 0, y: 24, scale: 0.97, duration: 0.6, ease, stagger: 0.1,
        scrollTrigger: { trigger: '.modules-list', ...inOut },
      });

      gsap.from('.instructor-photo', {
        opacity: 0, scale: 0.85, duration: 0.7, ease,
        scrollTrigger: { trigger: '.instructor-photo', ...inOut },
      });
      gsap.from('.instructor-text', {
        opacity: 0, x: -30, duration: 0.7, ease,
        scrollTrigger: { trigger: '.instructor-text', ...inOut },
      });
      gsap.from('.instructor-card-reveal', {
        opacity: 0, y: 16, scale: 0.95, duration: 0.6, ease, stagger: 0.15,
        scrollTrigger: { trigger: '.instructor-photo', ...inOut },
      });

      gsap.from('.video-reveal', {
        opacity: 0, scale: 0.95, duration: 0.7, ease,
        scrollTrigger: { trigger: '.video-reveal', ...inOut },
      });

      gsap.from('.testimonial-card', {
        opacity: 0, y: 24, rotate: -3, duration: 0.6, ease, stagger: 0.15,
        scrollTrigger: { trigger: '.testimonial-grid', ...inOut },
      });

      gsap.fromTo(
        '.cert-image-reveal',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease, scrollTrigger: { trigger: '.cert-image-reveal', ...inOut } }
      );

      gsap.from('.faq-item', {
        opacity: 0, y: 16, duration: 0.5, ease, stagger: 0.08,
        scrollTrigger: { trigger: '.faq-list', ...inOut },
      });

      gsap.to('.cta-bg-parallax', {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: '.cta-bg-parallax', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);


  // Reacción sutil al mouse del visual CFD de la sección "El desafío" — en un
  // elemento separado del que anima la entrada por scroll, para que las dos
  // animaciones (entrada por ScrollTrigger vs. seguimiento continuo del mouse)
  // no compitan por las mismas propiedades de transform en el mismo elemento.
  const handleChallengeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (challengeImgRef.current) {
      gsap.to(challengeImgRef.current, { x: px * 24, y: py * 16, rotate: px * 3, duration: 0.7, ease: 'power2.out' });
    }
    if (challengeGlowRef.current) {
      gsap.to(challengeGlowRef.current, { x: px * 30, y: py * 22, duration: 0.9, ease: 'power2.out' });
    }
  };
  const handleChallengeMouseLeave = () => {
    if (challengeImgRef.current) {
      gsap.to(challengeImgRef.current, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: 'power2.out' });
    }
    if (challengeGlowRef.current) {
      gsap.to(challengeGlowRef.current, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
    }
  };

  // Tarjetas de módulo (sección 03): leve parallax del render al mover el
  // mouse, y un scale + lift al hacer hover — todo vía currentTarget/query,
  // sin refs por tarjeta. Nada de esto toca las propiedades que anima el
  // entrance por scroll (.module-row ya usa opacity/scale/y una sola vez).
  const handlePlanCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const img = card.querySelector<HTMLElement>('.plan-card-img');
    if (img) gsap.to(img, { x: px * 14, y: py * 10, duration: 0.5, ease: 'power2.out' });
  };
  const handlePlanCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: -6, duration: 0.35, ease: 'power2.out' });
    const img = e.currentTarget.querySelector<HTMLElement>('.plan-card-img');
    if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
  };
  const handlePlanCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.4, ease: 'power2.out' });
    const img = e.currentTarget.querySelector<HTMLElement>('.plan-card-img');
    if (img) gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  };

  const trackCTA = () => fbPixel.lead(PRICE.PEN.current, 'PEN');
  const trackWhatsApp = () => fbPixel.event('Contact');

  const buyHref = `/comprar-grabado?curso=${CHECKOUT_SLUG}`;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <LenisProvider>
      <div ref={pageRef} className={`${styles.page} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <style>{`
          /* overflow-x: hidden en body forzaría overflow-y: auto implícito (regla CSS de pares),
             lo que rompe position: sticky en el header. clip no dispara ese emparejamiento. */
          body { overflow-x: clip; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <AuroraBackground />

        {/* BARRA DE URGENCIA */}
        <div className={styles.urgencyBar}>
          <span className={styles.mono}>
            <strong>{priceCurrent}</strong> <span style={{ opacity: 0.6, textDecoration: 'line-through' }}>{priceOld}</span>
            {' · vuelve al precio normal en '}
            <span className={styles.urgencyCountdown}>
              {countdown.d > 0 && `${countdown.d}d `}
              {pad(countdown.h)}h {pad(countdown.m)}m {pad(countdown.s)}s
            </span>
          </span>
          <Link href={buyHref} onClick={trackCTA} className={styles.urgencyBtn}>
            Comprar ahora
          </Link>
        </div>


        {/* HERO */}
        <section className={`${styles.hero} hero-section`}>
          <img
            className={styles.heroImageBg}
            src="/images/ansys-cfd-hero-venturi.jpeg"
            alt=""
            aria-hidden="true"
          />
          <div className={styles.heroVideoOverlay} aria-hidden="true" />
          <FloatingCallouts />
          <div className={`${styles.heroInner} hero-inner`}>
            <div className={`${styles.heroTextBlock} hero-text-block`}>
              <div className={`${styles.eyebrow} hero-reveal`}>Curso grabado · CFD</div>

              <h1 className={`${styles.heroTitle} hero-reveal`}>
                Introducción a la simulación <span className={styles.accent}>con ANSYS CFD</span>
              </h1>

              <p className={`${styles.heroText} hero-reveal`}>
                Este curso ofrece una introducción práctica a la simulación utilizando ANSYS CFD, cubriendo desde los fundamentos hasta el postproceso de resultados.
              </p>

              <div className={`${styles.specPanel} hero-reveal`}>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>8h</span>
                  <span className={styles.specLabel}>Duración</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>04</span>
                  <span className={styles.specLabel}>Módulos</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>100%</span>
                  <span className={styles.specLabel}>Práctico</span>
                </div>
              </div>

              <div className={`${styles.heroPriceCard} hero-price-card`}>
                <div>
                  <span className={styles.priceNow}>{priceCurrent}</span>
                  <span className={styles.priceOld}>{priceOld}</span>
                </div>
                <Link href={buyHref} onClick={trackCTA} className={styles.btnPrimary}>
                  Acceder ahora
                </Link>
              </div>
              <div className={`${styles.heroFinePrint} hero-reveal`}>
                Pago seguro · Acceso inmediato · Certificado digital
              </div>
            </div>

            {/* BENEFICIOS — dentro del hero, para emocionar en la primera pantalla */}
            <div className={`${styles.heroBenefitsRow} ${styles.benefitsGrid} benefits-grid`}>
              {BENEFITS.map((b, i) => (
                <div key={i} className={`${styles.glassCard} ${styles.benefitCard} benefit-item`}>
                  <div className={styles.benefitIcon}>{b.icon}</div>
                  <div className={styles.benefitText}>{b.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EL DESAFÍO — escena a pantalla completa, autocontenida (ver CSS: no usa .section) */}
        <section className={`${styles.challengeSection} challenge-section`}>
          <div className={styles.challengeBgBase} aria-hidden="true" />
          <div className={styles.challengeBgGrid} aria-hidden="true" />
          <svg className={styles.challengeBgLines} viewBox="0 0 1360 800" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -50 180 C 300 120, 550 280, 1410 200" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M -50 460 C 350 380, 600 560, 1410 460" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
            <path d="M -50 680 C 320 640, 650 740, 1410 660" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>

          <div className={styles.challengeContainer}>
            <div className={`${styles.challengeIntro} challenge-intro-reveal`}>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>{CHALLENGE.eyebrow}</div>
              <h2 className={styles.challengeHeadline}>
                {CHALLENGE.titleLead}{' '}
                <span className={styles.challengeLine2}>{CHALLENGE.titleAccent}</span>
              </h2>
            </div>

            <p className={`${styles.challengeParagraph} challenge-intro-reveal`}>{CHALLENGE.text}</p>

            <div
              className={`${styles.challengeVisualWrap} challenge-visual-reveal`}
              onMouseMove={handleChallengeMouseMove}
              onMouseLeave={handleChallengeMouseLeave}
            >
              <div ref={challengeGlowRef} className={styles.challengeGlow} aria-hidden="true" />
              <img
                ref={challengeImgRef}
                src="https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/assets/ansys-cfd/aprende-cfd-steps.png"
                alt="Flujo de trabajo CFD: geometría, mallado, simulación y resultados"
                className={styles.challengeImg}
              />
            </div>

            <div className={styles.challengeBenefits}>
              {CHALLENGE.features.map((f, i) => (
                <div key={i} className={`${styles.challengeBenefitItem} challenge-benefit-item`}>
                  <div className={styles.challengeIconWrap}><ChallengeIcon type={f.icon} /></div>
                  <div className={styles.challengeBenefitTitle}>{f.title}</div>
                  <div className={styles.challengeBenefitDesc}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLAN DE ESTUDIOS — galería técnica: los 4 renders CFD como protagonistas */}
        <section className={`${styles.plansSection} plans-section`}>
          <div className={styles.plansBgGrid} aria-hidden="true" />
          <svg className={styles.plansBgLines} viewBox="0 0 1500 900" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -50 200 C 350 140, 600 300, 1550 220" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M -50 700 C 380 640, 650 780, 1550 680" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
          </svg>

          <div className={styles.plansContainer}>
            <div className={`${styles.plansHeader} section-head-reveal`}>
              <div>
                <div className={styles.eyebrow}>03 / 08 · Plan de estudios</div>
                <h2 className={styles.plansTitle}>4 módulos, un aprendizaje completo</h2>
              </div>
              <p className={styles.plansSubtitle}>
                Desde los fundamentos hasta el análisis de resultados, cada módulo te guía paso a paso.
              </p>
            </div>

            <div className={`${styles.plansGrid} modules-list`}>
              {MODULES.map((m) => (
                <div
                  key={m.num}
                  className={`${styles.planCard} module-row`}
                  onMouseEnter={handlePlanCardEnter}
                  onMouseMove={handlePlanCardMove}
                  onMouseLeave={handlePlanCardLeave}
                >
                  <span className={styles.planCardNum}>{String(m.num).padStart(2, '0')}</span>
                  <h3 className={styles.planCardTitle}>{m.title}</h3>

                  <div className={styles.planCardVisual}>
                    <div className={styles.planCardGlow} aria-hidden="true" />
                    <img src={m.image} alt={m.title} className={`${styles.planCardImg} plan-card-img`} loading="lazy" />
                  </div>

                  <ul className={styles.planCardChecklist}>
                    {m.checklist.map((item, i) => (
                      <li key={i}><span className={styles.credCheck}>✓</span>{item}</li>
                    ))}
                  </ul>
                  <span className={styles.planCardDuration}>{m.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURSO GRABADO — foto real de fondo + panel de beneficios (mismos BENEFITS del hero) */}
        <section className={`${styles.recordedSection} recorded-section`}>
          <div className={styles.recordedOverlay} aria-hidden="true" />
          <div className={styles.recordedContainer}>
            <div className={`${styles.recordedText} section-head-reveal`}>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>04 / 08 · Curso grabado</div>
              <h2 className={styles.recordedTitle}>
                Aprende a tu ritmo,<br />
                <span className={styles.challengeLine2}>con el mismo contenido de calidad</span>
              </h2>
              <p className={styles.recordedParagraph}>
                Accede al curso grabado y aprende cuando y donde quieras. Todo el contenido está disponible de forma organizada, con explicaciones claras y casos prácticos.
              </p>

              <div className={styles.recordedStats}>
                <div className={styles.featureItem}>
                  <div className={styles.challengeIconWrap}><PlayCircleIcon /></div>
                  <div>
                    <div className={styles.challengeBenefitTitle}>Acceso inmediato</div>
                    <div className={styles.challengeBenefitDesc}>Comienza hoy mismo tras tu inscripción.</div>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.challengeIconWrap}><ClockIcon /></div>
                  <div>
                    <div className={styles.challengeBenefitTitle}>Duración total: 8 horas</div>
                    <div className={styles.challengeBenefitDesc}>{MODULES.length} módulos en video.</div>
                  </div>
                </div>
              </div>

              <Link href={buyHref} onClick={trackCTA} className={styles.btnPrimary}>
                Comprar curso grabado
              </Link>
            </div>

            <div className={`${styles.recordedPanel} recorded-panel-reveal`}>
              {RECORDED_PANEL.map((b, i) => (
                <div key={i} className={`${styles.recordedPanelItem} recorded-panel-item`}>
                  <div className={styles.recordedPanelIcon}><b.Icon /></div>
                  <div className={styles.recordedPanelText}>{b.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.featuresBar}>
            {RECORDED_FEATURES.map((f, i) => (
              <div key={i} className={styles.featureBarItem}>
                <div className={styles.featureBarIcon}><f.Icon /></div>
                <div>
                  <div className={styles.featureBarTitle}>{f.title}</div>
                  <div className={styles.featureBarDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INSTRUCTOR — mismo lenguaje visual que "Curso grabado" (04): foto real
            de fondo + contenido a pantalla completa, con foto recortada del
            instructor y dos tarjetas flotantes (identidad + cita) */}
        <section className={`${styles.instructorSection} instructor-visual-section`}>
          <div className={styles.instructorOverlay} aria-hidden="true" />
          <div className={styles.instructorContainer}>
            <div className={`${styles.instructorTextCol} instructor-text`}>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>05 / 08 · Instructor</div>
              <h2 className={styles.instructorHeading}>
                Conoce a tu instructor,<br />
                <span className={styles.challengeLine2}>un experto en simulación CFD</span>
              </h2>
              <p className={styles.instructorLead}>{INSTRUCTOR.paragraph}</p>

              <ul className={styles.instructorCredList}>
                {INSTRUCTOR.credentials.map((c, i) => (
                  <li key={i} className={styles.instructorCredItem}>
                    <span className={styles.instructorCredIcon}><c.Icon /></span>
                    <span className={styles.instructorCredText}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.instructorVisual}>
              <img
                src="/images/ansys-cfd-instructor-cutout.png"
                alt={INSTRUCTOR.name}
                className={`${styles.instructorPhotoImg} instructor-photo`}
              />

              <div className={`${styles.instructorNameCard} instructor-card-reveal`}>
                <span className={styles.instructorNameAvatar}><PersonIcon /></span>
                <span className={styles.instructorNameText}>
                  <strong>{INSTRUCTOR.name}</strong>
                  <span>{INSTRUCTOR.title}</span>
                </span>
              </div>

              <div className={`${styles.instructorQuoteCard} instructor-card-reveal`}>
                <div className={styles.instructorQuoteMark}>&ldquo;</div>
                <p className={styles.instructorQuoteText}>{INSTRUCTOR.quote}</p>
              </div>
            </div>
          </div>

          <div className={styles.featuresBar}>
            {INSTRUCTOR_FEATURES.map((f, i) => (
              <div key={i} className={styles.featureBarItemSingle}>
                <span className={styles.featureBarIconSmall}><f.Icon /></span>
                <span className={styles.featureBarTextSmall}>{f.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CLASE GRATUITA — webinar real embebido (youtube-nocookie/wyiK6JUs9oc) */}
        <section className={`${styles.classSection} class-visual-section`}>
          <div className={styles.classContainer}>
            <div className={`${styles.sectionHead} section-head-reveal`}>
              <div className={styles.eyebrow}>06 / 08 · Clase gratuita</div>
              <h2 className={styles.classHeading}>
                Mira cómo se aprende<br />
                <span className={styles.challengeLine2}>CFD en la práctica</span>
              </h2>
              <p className={styles.sectionText}>
                Disfruta el webinar completo de Introducción a la Simulación en CFD, impartido por nuestro instructor, y conoce nuestro enfoque de enseñanza.
              </p>
            </div>

            <div className={`${styles.glassCard} ${styles.videoPanel} video-reveal`} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className={styles.videoFrame}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${CLASS_VIDEO.youtubeId}`}
                  title={CLASS_VIDEO.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className={styles.classMetaRow}>
              <div className={styles.classMetaItem}>
                <span className={styles.classMetaIcon}><PlayCircleIcon /></span>
                <span>
                  <span className={styles.classMetaTitle}>{CLASS_VIDEO.title}</span>
                  <span className={styles.classMetaDesc}>{CLASS_VIDEO.duration}</span>
                </span>
              </div>
              <div className={styles.classMetaItem}>
                <span className={styles.classMetaIcon}><PersonIcon /></span>
                <span>
                  <span className={styles.classMetaLabel}>Impartido por</span>
                  <span className={styles.classMetaTitle}>{INSTRUCTOR.name}</span>
                </span>
              </div>
            </div>

            <div className={styles.classFeaturesRow}>
              {CLASS_FEATURES.map((f, i) => (
                <div key={i} className={styles.classFeatureItem}>
                  <span className={styles.classFeatureIcon}><f.Icon /></span>
                  <span className={styles.classFeatureText}>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.classCtaBlock}>
              <h3 className={styles.classCtaTitle}>¿Te gustó la clase?</h3>
              <p className={styles.classCtaText}>
                En el curso completo aprenderás todo el proceso de simulación CFD paso a paso, desde la geometría y el mallado hasta la solución, convergencia y postproceso.
              </p>
              <Link href={buyHref} onClick={trackCTA} className={styles.btnPrimary}>
                Quiero aprender CFD →
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className={`${styles.section} ${styles.testimonialsSection}`}>
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHead} section-head-reveal`}>
              <div className={`${styles.eyebrow} ${styles.eyebrowBlue}`}>07 / 08 · Lo que dicen nuestros alumnos</div>
              <h2 className={styles.sectionTitle}>
                Ingenieros que <span className={styles.challengeLine2}>ya aplican lo aprendido</span>
              </h2>
              <p className={styles.sectionText}>Conoce la experiencia de quienes ya llevaron el curso y ahora aplican CFD en sus proyectos.</p>
            </div>
            <div className={`${styles.testimonialGrid} testimonial-grid`}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`${styles.testimonialCard} testimonial-card`}>
                  <div className={styles.testimonialQuoteMark}>&ldquo;</div>
                  <p className={styles.testimonialText}>{t.text}</p>
                  <div className={styles.testimonialDivider} />
                  <div className={styles.testimonialFooter}>
                    <div>
                      <div className={styles.testimonialName}>{t.name}</div>
                      <div className={styles.testimonialRole}>{t.role}</div>
                    </div>
                    <Stars count={t.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICADO — panel claro, respiro de luz en medio del recorrido oscuro */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <div className={styles.certGrid}>
              <div className="section-head-reveal">
                <div className={styles.certIcon}>🎓</div>
                <h2 className={styles.sectionTitle} style={{ color: 'var(--ink-dark)' }}>
                  Al finalizar, recibe tu certificado digital
                </h2>
                <p className={styles.sectionText}>
                  Valida tus conocimientos con un certificado digital verificable, con código único.
                </p>
              </div>
              <div className={styles.certPanel}>
                <img
                  src="/images/certificado-aprobacion.jpeg"
                  alt="Certificado de Aprobación"
                  className={`${styles.certImage} cert-image-reveal`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <section className={`${styles.section} ${styles.sectionDeep}`}>
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHead} section-head-reveal`}>
              <div className={styles.eyebrow}>Preguntas frecuentes</div>
              <h2 className={styles.sectionTitle}>¿Tienes dudas?</h2>
            </div>
            <div className={`${styles.faqList} faq-list`} style={{ maxWidth: '700px', margin: '0 auto' }}>
              {FAQS.map((item, i) => (
                <div key={i} className={`${styles.glassCard} ${styles.faqItem} faq-item`}>
                  <div className={styles.faqQ}>{item.q}</div>
                  <div className={styles.faqA}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL (08/08) — el momento más intenso de toda la página, la conversión */}
        <section className={styles.ctaSection}>
          <div className={`${styles.ctaBgParallax} cta-bg-parallax`} aria-hidden="true" />
          <div className={styles.ctaContainer}>
            <div className={`${styles.ctaTextCol} section-head-reveal`}>
              <div className={styles.eyebrow}>08 / 08 · Da el primer paso</div>
              <h2 className={styles.ctaHeading}>
                ¡Inscríbete <span className={styles.ctaHeadingAccent}>ahora!</span>
              </h2>
              <p className={styles.ctaLead}>
                Aprende desde cero a simular flujos en ANSYS CFX y desarrolla habilidades aplicables a proyectos reales.
              </p>

              <div className={styles.ctaPriceCard}>
                <div className={styles.ctaPriceLabel}>Precio especial de lanzamiento</div>
                <div className={styles.ctaPriceMainRow}>
                  <div className={styles.ctaPriceRow}>
                    <span className={styles.ctaPriceNow}>{priceCurrent}</span>
                    <span className={styles.ctaPriceOld}>{priceOld}</span>
                  </div>
                  <div className={styles.ctaDiscountBadge}>
                    <span className={styles.ctaDiscountTag}>🏷 {discountPct}% de descuento</span>
                    <span className={styles.ctaDiscountNote}>Por tiempo limitado</span>
                  </div>
                </div>
              </div>

              <Link href={buyHref} onClick={trackCTA} className={styles.btnCta}>
                Acceder ahora →
              </Link>
              <div className={styles.ctaFinePrint}>🔒 Pago seguro y encriptado</div>
            </div>
          </div>

          <div className={`${styles.ctaBenefitsCol} instructor-card-reveal`}>
            {CTA_BENEFITS.map((b, i) => (
              <div key={i} className={styles.classMetaItem}>
                <span className={styles.classMetaIcon}><b.Icon /></span>
                <span>
                  <span className={styles.classMetaTitle}>{b.title}</span>
                  <span className={styles.classMetaDesc}>{b.desc}</span>
                </span>
              </div>
            ))}
          </div>

          <div className={styles.ctaTrustBar}>
            {CTA_TRUST.map((t, i) => (
              <div key={i} className={styles.classMetaItem}>
                <span className={styles.classMetaIcon}><t.Icon /></span>
                <span>
                  <span className={styles.classMetaTitle}>{t.title}</span>
                  <span className={styles.classMetaDesc}>{t.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Barra WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsApp}
          className={styles.waBar}
        >
          ¿Tienes dudas? Escríbenos por WhatsApp
        </a>

        {/* Botón flotante de WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsApp}
          aria-label="Escríbenos por WhatsApp"
          className={styles.waFloat}
        >
          💬
        </a>
      </div>
    </LenisProvider>
  );
}
