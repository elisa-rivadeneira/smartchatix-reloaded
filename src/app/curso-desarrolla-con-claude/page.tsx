'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  MonitorPlay,
  Package,
  ListChecks,
  Target,
  Menu,
  X,
} from 'lucide-react';
import styles from './curso-desarrolla-con-claude.module.css';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const CURSO_SLUG = 'desarrolla-con-claude';

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Temario', href: '#temario' },
  { label: 'Qué incluye', href: '#incluye' },
];

const PARA_QUIEN = [
  'Sin experiencia técnica previa',
  'No importa tu rubro o industria',
  'Querés construir tu propia herramienta',
];

const INCLUYE = [
  { Icon: GraduationCap, title: 'Certificado de aprobación', desc: 'Al completar el proyecto final desplegado.' },
  { Icon: MonitorPlay, title: 'Acceso al aula virtual', desc: 'Todas las sesiones, en vivo.' },
  { Icon: Package, title: 'Grabaciones de respaldo', desc: 'Si no puedes entrar a una sesión, queda grabada para verla después.' },
];

const SESSION_COLORS = ['var(--blue)', 'var(--violet)', 'var(--fuchsia)', 'var(--orange)', 'var(--cyan)', 'var(--blue)'];

const CURRICULUM = [
  {
    num: '01',
    title: 'Prompting estructurado',
    duracion: '2 h',
    objetivo: 'Aprender a comunicarte con la IA de forma estructurada para obtener resultados consistentes.',
    contenido: 'Guía de tu idea (qué problema resuelve, para quién, qué es lo mínimo indispensable); cómo describirla para que la IA la entienda y la construya; primeros conceptos de qué es un sistema web y qué puede y no puede hacer la IA.',
    actividad: 'Generar la primera versión estática del sistema a partir de un prompt propio.',
    entregable: 'Primera versión estática funcionando localmente.',
  },
  {
    num: '02',
    title: 'Estructura de un sistema',
    duracion: '2 h',
    objetivo: 'Entender cómo está organizado tu sistema, en términos simples.',
    contenido: 'Páginas, componentes y secciones; cómo "leer" el código que genera la IA a alto nivel; cómo pedirle a la IA que modifique o agregue secciones.',
    actividad: 'Ampliar el sistema de la sesión 1 con nuevas secciones y páginas.',
    entregable: 'Sistema con estructura multi-sección.',
  },
  {
    num: '03',
    title: 'Interactividad',
    duracion: '2 h',
    objetivo: 'Que el sistema deje de ser estático y responda a las acciones del usuario.',
    contenido: 'Formularios y captura de datos; botones y eventos; validaciones simples (campos obligatorios, formatos básicos).',
    actividad: 'Agregar un formulario funcional con validación al sistema propio.',
    entregable: 'Sistema con al menos un flujo interactivo funcionando.',
  },
  {
    num: '04',
    title: 'Git, GitHub y deploy a producción',
    duracion: '3 h',
    objetivo: 'Publicar tu sistema en internet, con control de versiones.',
    contenido: 'Qué es un repositorio y qué es un commit; conexión del repositorio a Vercel; primer deploy en vivo.',
    actividad: 'Subir el proyecto a GitHub y desplegarlo en Vercel.',
    entregable: 'Sistema publicado con URL en producción.',
  },
  {
    num: '05',
    title: 'Depuración básica',
    duracion: '2 h',
    objetivo: 'Perder el miedo a los errores y saber cómo resolverlos con ayuda de la IA.',
    contenido: 'Protocolo de manejo de errores paso a paso; casos reales de errores comunes y cómo describírselos a la IA; cómo verificar que un fix realmente funcionó.',
    actividad: 'Resolver 2-3 errores intencionales o reales encontrados en tu propio sistema.',
    entregable: 'Sistema corregido y validado.',
  },
  {
    num: '06',
    title: 'Proyecto final supervisado',
    duracion: '2 h',
    objetivo: 'Consolidar todo lo aprendido en una entrega completa.',
    contenido: 'Tiempo guiado de construcción con acompañamiento por rondas; repaso de buenas prácticas de las sesiones anteriores; publicación final.',
    actividad: 'Cada participante construye y despliega su sistema de punta a punta.',
    entregable: 'Sistema propio, funcional, en producción — listo para usar en tu trabajo.',
  },
];

interface CursoData {
  title?: string;
  priceVivo: number | string | null;
  priceVivoOld: number | string | null;
  live_start_date: string | null;
  live_schedule: string | null;
  duration: string | null;
  hasLiveMode?: boolean;
  hasRecordedMode?: boolean;
  whatsappMessage?: string | null;
}

const FALLBACK = {
  title: 'Desarrolla con Claude',
  price: 250,
  priceOld: 400,
  fecha: '28 de septiembre',
  horario: 'Lunes, miércoles y viernes de 8:00 pm a 10:00 pm',
  duracion: '12 horas en 2 semanas',
};

// Countdown "últimos 3 días" en bucle: cuenta hasta 0 y vuelve a arrancar en 3 días,
// sin fecha de fin real — la oferta siempre se ve como si estuviera por terminar.
// CYCLE_ANCHOR fija en qué momento arranca cada ciclo (ajústala si quieres que el
// contador esté "recién reiniciado" en una fecha/hora puntual, ej. al lanzar la publicidad).
const PROMO_CYCLE_HOURS = 72;
const CYCLE_ANCHOR = new Date('2026-09-14T00:00:00-05:00').getTime();

function useRollingCountdown(cycleHours: number, anchor: number) {
  const cycleMs = cycleHours * 60 * 60 * 1000;
  const [remaining, setRemaining] = React.useState({ d: 0, h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    const tick = () => {
      const elapsed = ((Date.now() - anchor) % cycleMs + cycleMs) % cycleMs;
      const diff = cycleMs - elapsed;
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
  }, [cycleMs, anchor]);

  return remaining;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CursoDesarrollaConClaudePage() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [curso, setCurso] = React.useState<CursoData | null>(null);
  const countdown = useRollingCountdown(PROMO_CYCLE_HOURS, CYCLE_ANCHOR);
  const pad = (n: number) => n.toString().padStart(2, '0');

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Al volver con el botón "atrás" del navegador, Chrome a veces restaura la página
  // desde bfcache sin re-ejecutar bien el scroll listener / las animaciones de scroll /
  // el video — deja la página con el navbar y las secciones en un estado roto.
  // Forzar un reload en ese caso soluciona todo de raíz.
  React.useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  React.useEffect(() => {
    fetch(`/api/public/courses/${CURSO_SLUG}`)
      .then((res) => res.json())
      .then((data) => setCurso(data.course || null))
      .catch(() => setCurso(null));
  }, []);

  const price = curso?.priceVivo ? Math.round(parseFloat(String(curso.priceVivo))) : FALLBACK.price;
  const priceOld = curso?.priceVivoOld ? Math.round(parseFloat(String(curso.priceVivoOld))) : FALLBACK.priceOld;
  const fecha = curso?.live_start_date
    ? new Date(curso.live_start_date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })
    : FALLBACK.fecha;
  const horario = curso?.live_schedule || FALLBACK.horario;
  const duracion = curso?.duration || FALLBACK.duracion;

  const checkoutHref = `/inscripcion-vivo?curso=${CURSO_SLUG}`;

  const courseTitle = curso?.title || FALLBACK.title;
  // Estrategia: la modalidad se lee del curso real (hasLiveMode/hasRecordedMode) en vez de
  // asumirla fija, así el mensaje de WhatsApp queda correcto aunque cambie la configuración
  // del curso sin tocar el código de esta landing. Si el curso ofrece ambas modalidades a la
  // vez, se omite la etiqueta para no asumir cuál le interesa a la persona.
  const modalidadTag = curso?.hasLiveMode && !curso?.hasRecordedMode
    ? ' (en vivo)'
    : curso?.hasRecordedMode && !curso?.hasLiveMode
    ? ' (grabado)'
    : '';
  const whatsappMessage = curso?.whatsappMessage
    ? curso.whatsappMessage.replace(/\{curso\}/g, courseTitle)
    : `Hola, estoy interesado en el curso "${courseTitle}"${modalidadTag}`;

  const finalFacts = [
    { title: 'Inicio', desc: fecha },
    { title: 'Horario', desc: horario },
    { title: 'Duración', desc: duracion },
    { title: 'Evaluación', desc: 'Práctica y continua, sin exámenes teóricos' },
  ];

  return (
    <div className={styles.page}>
      {/* BARRA DE URGENCIA */}
      <div className={styles.urgencyBar}>
        <span className={styles.urgencyBadge}>Ahorra S/ {priceOld - price} · Oferta por tiempo limitado</span>
        <span>
          <span className={styles.urgencyOld}>S/ {priceOld}</span>
          {' '}<strong>S/ {price}</strong>
          {' · vuelve a S/ '}{priceOld}{' en '}
          <span className={styles.urgencyCountdown}>
            {countdown.d > 0 && `${countdown.d}d `}
            {pad(countdown.h)}h {pad(countdown.m)}m {pad(countdown.s)}s
          </span>
        </span>
        <a href={checkoutHref} className={styles.urgencyBtn}>Inscribirme ahora</a>
      </div>

      {/* NAVBAR */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <Link href="#inicio" className={styles.navLogo}>
          <img src="/images/smartchatix-logo.png" alt="SmartChatix" />
        </Link>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
          ))}
        </div>
        <div className={styles.navActions}>
          <a href={checkoutHref} className={styles.navCta}>
            Inscribirme <ArrowRight size={15} />
          </a>
          <button
            type="button"
            className={styles.navBurger}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="inicio" className={styles.hero}>
        <div className={styles.heroGrain} aria-hidden="true" />
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroLabel}>TALLER EN VIVO · 6 SESIONES</div>
            <h1 className={styles.heroTitle}>
              Construye el software que necesitas.<br />
              <span className={styles.brandText}>Con Claude, desde cero.</span>
            </h1>
            <p className={styles.heroText}>
              Aprende a desarrollar tu propia herramienta utilizando Claude como copiloto. Desde la idea hasta una aplicación funcional que tú mismo podrás utilizar, modificar y seguir mejorando.
            </p>
            <div className={styles.heroActions}>
              <a href={checkoutHref} className={styles.btnPrimary}>
                Quiero crear mi propia herramienta <ArrowRight size={17} />
              </a>
            </div>
            <div className={styles.heroFeatureRow}>
              <div className={styles.heroFeatureItem}><Calendar size={17} /><span>Inicia el {fecha}</span></div>
              <div className={styles.heroFeatureItem}><Clock size={17} /><span>{horario}</span></div>
              <div className={styles.heroFeatureItem}><ShieldCheck size={17} /><span>Certificado incluido</span></div>
              <div className={styles.heroFeatureItem}><Target size={17} /><span>Clases 100% prácticas</span></div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroPhoto}>
              <video
                className={styles.heroPhotoImg}
                src="https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/ai-build-lab-hero.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUIÉN + QUÉ INCLUYE */}
      <section id="incluye" className={`${styles.section} ${styles.sectionDark2}`}>
        <div className={styles.inner}>
          <div className={styles.businessGrid}>
            <Reveal>
              <div className={styles.eyebrow}>Para quién es</div>
              <h2 className={styles.businessTitle}>
                Para cualquier persona<br />que quiera <span className={styles.brandText}>construir con IA.</span>
              </h2>
              <p className={styles.businessText}>
                No hace falta saber programar ni tener experiencia técnica. Si quieres entender de verdad qué se puede hacer hoy con IA para tu propio trabajo, este taller es para ti.
              </p>
              <div className={styles.businessList}>
                {PARA_QUIEN.map((item, i) => (
                  <div key={i} className={styles.businessListItem}><CheckCircle2 size={18} /><span>{item}</span></div>
                ))}
              </div>
              <div className={styles.requisitoNote}>
                <Target size={16} />
                <span>
                  <strong>100% práctico:</strong> no te sientas a escuchar — tú mismo construyes tu propia
                  aplicación, sesión a sesión, aunque nunca hayas programado. En dos semanas sales con tu
                  app completamente desarrollada.
                  <br /><br />
                  <strong>Requisito:</strong> cuenta Claude Pro.
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className={styles.includeCol}>
              {INCLUYE.map((item, i) => (
                <div key={i} className={styles.includeCard}>
                  <div className={styles.includeIcon}><item.Icon size={20} /></div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* TEMARIO */}
      <section id="temario" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <Reveal className={styles.temarioHeader}>
            <div className={styles.eyebrow}>Temario</div>
            <h2 className={styles.temarioTitle}>Seis sesiones, un sistema propio en producción.</h2>
            <p className={styles.temarioText}>
              Cada sesión suma sobre la anterior: al final tienes tu propio sistema publicado, resolviendo una necesidad real de tu trabajo.
            </p>
          </Reveal>

          <motion.div
            className={styles.curriculum}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {CURRICULUM.map((s, i) => (
              <motion.div key={s.num} className={styles.sessionCard} variants={fadeUp}>
                <div className={styles.sessionNumWrap}>
                  <div className={styles.sessionNum} style={{ background: SESSION_COLORS[i] }}>{s.num}</div>
                </div>
                <div>
                  <div className={styles.sessionHead}>
                    <h4 className={styles.sessionTitle}>{s.title}</h4>
                    <span className={styles.sessionDuration}>{s.duracion}</span>
                  </div>
                  <p className={styles.sessionObjetivo}>{s.objetivo}</p>
                  <div className={styles.sessionDetails}>
                    <div className={styles.sessionDetailItem}>
                      <ListChecks size={15} color={SESSION_COLORS[i]} />
                      <span><span className={styles.sessionDetailLabel}>Contenido:</span>{s.contenido}</span>
                    </div>
                    <div className={styles.sessionDetailItem}>
                      <Target size={15} color={SESSION_COLORS[i]} />
                      <span><span className={styles.sessionDetailLabel}>Actividad:</span>{s.actividad}</span>
                    </div>
                    <div className={styles.sessionDetailItem}>
                      <Package size={15} color={SESSION_COLORS[i]} />
                      <span><span className={styles.sessionDetailLabel}>Entregable:</span>{s.entregable}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CIERRE */}
      <section className={`${styles.section} ${styles.sectionDark2}`}>
        <div className={styles.inner}>
          <div className={styles.closingGrid}>
            <Reveal>
              <div className={styles.eyebrow}>Evaluación y cierre</div>
              <h2 className={styles.closingTitle}>
                Sales con tu propio <span className={styles.brandText}>sistema en producción.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={styles.closingText}>
                La evaluación es práctica y continua — se valida tu avance sesión a sesión, sin exámenes teóricos.
                Al terminar, sales con tu sistema propio funcionando en producción, resolviendo una necesidad real de tu trabajo,
                y con la cuenta propia para seguir mejorándolo.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaBg} aria-hidden="true" />
        <div className={styles.finalCtaOverlay} aria-hidden="true" />

        <div className={styles.finalCtaTopBar}>
          <span className={styles.finalCtaLabel}>DESARROLLA CON CLAUDE</span>
          <span className={styles.finalCtaTagline}>Una idea real. Una app real. Publicada por ti.</span>
        </div>

        <Reveal className={styles.finalCtaContent}>
          <h2 className={styles.finalCtaTitle}>
            El {fecha} empiezas<br />
            a construir con <span className={styles.brandText}>IA</span>.
          </h2>
          <p className={styles.finalCtaText}>
            Cupos limitados para el taller en vivo · {duracion}.
          </p>

          <div className={styles.offerCard}>
            <span className={styles.offerTag}>Ahorra S/ {priceOld - price}</span>
            <div className={styles.offerPriceRow}>
              <span className={styles.offerPriceOld}>S/ {priceOld}</span>
              <span className={styles.offerPriceNew}>S/ {price}</span>
            </div>
            <span className={styles.offerNote}>
              Oferta por tiempo limitado — vuelve a S/ {priceOld} en{' '}
              <span className={styles.urgencyCountdown}>
                {countdown.d > 0 && `${countdown.d}d `}
                {pad(countdown.h)}h {pad(countdown.m)}m {pad(countdown.s)}s
              </span>
            </span>
            <a href={checkoutHref} className={styles.btnPrimary}>
              Quiero mi lugar <ArrowRight size={17} />
            </a>
          </div>
        </Reveal>

        <div className={styles.finalCtaFacts}>
          {finalFacts.map((f) => (
            <div key={f.title} className={styles.finalCtaFactItem}>
              <div className={styles.finalCtaFactTitle}>{f.title}</div>
              <div className={styles.finalCtaFactDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}><img src="/images/smartchatix-logo.png" alt="SmartChatix" /></div>
          <div className={styles.footerCopy}>© {new Date().getFullYear()} SmartChatix · smartchatix.com</div>
        </div>
      </footer>

      <WhatsAppFloatingButton message={whatsappMessage} />
    </div>
  );
}
