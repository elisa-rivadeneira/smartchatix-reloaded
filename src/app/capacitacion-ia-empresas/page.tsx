'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Building2,
  Laptop,
  Users2,
  Zap,
  Box,
  ShieldCheck,
  Lightbulb,
  Hammer,
  Hourglass,
  Rocket,
  ExternalLink,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  UserCheck,
  Calculator,
  FolderCog,
  Sparkles,
  Target,
  Compass,
  HeartHandshake,
  Award,
  Cog,
  Repeat,
  Linkedin,
  Youtube,
  Instagram,
  Code2,
  MousePointer2,
  GitBranch,
  Database,
  BarChart3,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import styles from './capacitacion-ia-empresas.module.css';
import ApplicationGallery3D from './ApplicationGallery3D';

// ============================================================
// CONTENIDO — sin precios, sin testimonios inventados, sin
// estadísticas inventadas (ver instrucciones del cliente).
// ============================================================

const WHATSAPP_NUMBER = '51967717179';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola, quiero llevar AI Build Lab a mi empresa');
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'La experiencia', href: '#experiencia' },
  { label: 'Soluciones', href: '#soluciones' },
  { label: 'Para empresas', href: '#empresas' },
  { label: 'Preguntas', href: '#preguntas' },
];

const HERO_FEATURES = [
  { icon: Building2, label: 'In House o Remota' },
  { icon: Users2, label: 'Grupos flexibles' },
  { icon: Zap, label: '100% práctico' },
  { icon: Box, label: 'Aplicaciones funcionales' },
  { icon: ShieldCheck, label: 'Certificación' },
];

const FLOW_STEPS = [
  { Icon: Lightbulb, title: 'Idea', desc: 'Un problema real de tu trabajo.' },
  { Icon: Hammer, title: 'Construcción', desc: 'Desarrolla la solución con IA como copiloto.' },
  { Icon: Hourglass, title: 'Prueba', desc: 'Itera, mejora y haz que funcione.' },
  { Icon: Rocket, title: 'Publicación', desc: 'Comparte tu aplicación y comiénzala a usar.' },
];

const HERO_MOBILE_STEPS = [
  { Icon: Lightbulb, color: 'var(--blue)', title: 'Idea', desc: 'Define tu necesidad' },
  { Icon: Hammer, color: 'var(--violet)', title: 'Construye', desc: 'Diseña la solución' },
  { Icon: Hourglass, color: 'var(--fuchsia)', title: 'Prueba', desc: 'Haz que funcione' },
  { Icon: Rocket, color: 'var(--orange)', title: 'Publica', desc: 'Compártela' },
];

const PROCESS_STEPS = [
  { num: '01', color: 'var(--blue)', Icon: Lightbulb, title: 'Prompting estructurado', desc: 'C.R.E.A.R. + primera app estática generada con IA.' },
  { num: '02', color: 'var(--violet)', Icon: Code2, title: 'Estructura de una app', desc: 'Páginas, componentes, secciones — sin jerga técnica.' },
  { num: '03', color: 'var(--fuchsia)', Icon: MousePointer2, title: 'Interactividad', desc: 'Formularios, botones, validaciones simples.' },
  { num: '04', color: 'var(--orange)', Icon: GitBranch, title: 'Git, GitHub y deploy a Producción', desc: 'Repositorio, commit, conexión a Vercel y primer deploy en vivo, todo en una sesión más larga.' },
  { num: '05', color: 'var(--cyan)', Icon: Database, title: 'Depuración básica', desc: 'Protocolo de manejo de errores con casos reales.' },
  { num: '06', color: 'var(--blue)', Icon: Rocket, title: 'Proyecto final supervisado', desc: 'Cada participante construye y despliega su app de punta a punta.' },
];

const PROCESS_FEATURES = [
  { Icon: Zap, color: 'var(--blue)', bg: 'rgba(46, 111, 242, 0.12)', title: 'Aprendizaje práctico', desc: 'Aplicación inmediata en tu trabajo.' },
  { Icon: Users2, color: 'var(--violet)', bg: 'rgba(123, 47, 247, 0.12)', title: 'Acompañamiento experto', desc: 'De principio a fin.' },
  { Icon: BarChart3, color: 'var(--fuchsia)', bg: 'rgba(230, 25, 179, 0.12)', title: 'Resultados reales', desc: 'Aplicaciones que tu equipo puede usar.' },
];

type DeptKey = 'ventas' | 'operaciones' | 'rrhh' | 'finanzas' | 'administracion' | 'otros';

const DEPARTMENTS: Record<DeptKey, {
  label: string;
  appName: string;
  Icon: any;
  sidebar: string[];
  features: { Icon: any; title: string; desc: string }[];
  mainTitle: string;
  fields: { label: string; placeholder: string }[];
  buttonText: string;
  previewCompany: string;
  previewRows: { label: string; qty: string; price: string }[];
  previewTotal: string;
}> = {
  ventas: {
    label: 'Ventas',
    appName: 'SmartVentas',
    Icon: FileText,
    sidebar: ['Inicio', 'Cotizaciones', 'Clientes', 'Reportes', 'Configuración'],
    features: [
      { Icon: FileText, title: 'Generador de cotizaciones', desc: 'Crea cotizaciones personalizadas en segundos.' },
      { Icon: Target, title: 'Análisis de clientes', desc: 'Analiza datos y encuentra nuevas oportunidades.' },
      { Icon: Sparkles, title: 'Asistente comercial', desc: 'Responde consultas y genera propuestas.' },
    ],
    mainTitle: 'Nueva cotización',
    fields: [
      { label: 'Cliente', placeholder: 'Selecciona un cliente…' },
      { label: 'Productos', placeholder: 'Busca o selecciona productos…' },
      { label: 'Mensaje personalizado', placeholder: 'Agrega un mensaje (opcional)…' },
    ],
    buttonText: 'Generar con IA',
    previewCompany: 'ACME',
    previewRows: [
      { label: 'Consultoría IA', qty: '1', price: '$1,300' },
      { label: 'Implementación', qty: '1', price: '$2,800' },
      { label: 'Soporte (3 meses)', qty: '1', price: '$500' },
    ],
    previewTotal: '$4,600',
  },
  operaciones: {
    label: 'Operaciones',
    appName: 'SmartOps',
    Icon: LayoutDashboard,
    sidebar: ['Inicio', 'Dashboard', 'Solicitudes', 'Procesos', 'Configuración'],
    features: [
      { Icon: LayoutDashboard, title: 'Dashboard operativo', desc: 'Visualiza el estado de tus procesos en tiempo real.' },
      { Icon: Cog, title: 'Gestión de solicitudes', desc: 'Centraliza y da seguimiento a cada solicitud.' },
      { Icon: Repeat, title: 'Control de procesos', desc: 'Detecta cuellos de botella antes de que sean un problema.' },
    ],
    mainTitle: 'Nueva solicitud',
    fields: [
      { label: 'Área solicitante', placeholder: 'Selecciona un área…' },
      { label: 'Tipo de solicitud', placeholder: 'Selecciona un tipo…' },
      { label: 'Prioridad', placeholder: 'Agrega una prioridad…' },
    ],
    buttonText: 'Procesar con IA',
    previewCompany: 'Planta 02',
    previewRows: [
      { label: 'Solicitudes abiertas', qty: '—', price: '12' },
      { label: 'En proceso', qty: '—', price: '5' },
      { label: 'Completadas (mes)', qty: '—', price: '48' },
    ],
    previewTotal: '87% a tiempo',
  },
  rrhh: {
    label: 'RRHH',
    appName: 'SmartTalent',
    Icon: UserCheck,
    sidebar: ['Inicio', 'Candidatos', 'Documentos', 'Colaboradores', 'Configuración'],
    features: [
      { Icon: UserCheck, title: 'Evaluador de CV', desc: 'Filtra y prioriza candidatos según el perfil que buscas.' },
      { Icon: FileText, title: 'Generador de documentos', desc: 'Crea contratos y comunicados en minutos.' },
      { Icon: HeartHandshake, title: 'Asistente interno', desc: 'Responde preguntas frecuentes del equipo.' },
    ],
    mainTitle: 'Evaluar candidato',
    fields: [
      { label: 'Puesto', placeholder: 'Selecciona un puesto…' },
      { label: 'CV del candidato', placeholder: 'Sube o pega el CV…' },
      { label: 'Criterios clave', placeholder: 'Agrega criterios (opcional)…' },
    ],
    buttonText: 'Evaluar con IA',
    previewCompany: 'Candidato',
    previewRows: [
      { label: 'Experiencia relevante', qty: '—', price: 'Alta' },
      { label: 'Match con el puesto', qty: '—', price: '92%' },
      { label: 'Disponibilidad', qty: '—', price: 'Inmediata' },
    ],
    previewTotal: 'Recomendado',
  },
  finanzas: {
    label: 'Finanzas',
    appName: 'SmartFinanzas',
    Icon: Calculator,
    sidebar: ['Inicio', 'Reportes', 'Calculadoras', 'Datos', 'Configuración'],
    features: [
      { Icon: Calculator, title: 'Analizador de datos', desc: 'Convierte hojas de cálculo en información clara.' },
      { Icon: FileText, title: 'Reportes', desc: 'Genera reportes financieros listos para presentar.' },
      { Icon: Target, title: 'Calculadoras', desc: 'Herramientas a medida para tus propios cálculos.' },
    ],
    mainTitle: 'Nuevo reporte',
    fields: [
      { label: 'Periodo', placeholder: 'Selecciona un periodo…' },
      { label: 'Fuente de datos', placeholder: 'Selecciona una fuente…' },
      { label: 'Notas', placeholder: 'Agrega notas (opcional)…' },
    ],
    buttonText: 'Generar con IA',
    previewCompany: 'Resumen',
    previewRows: [
      { label: 'Ingresos', qty: '—', price: '$18,400' },
      { label: 'Gastos', qty: '—', price: '$11,200' },
      { label: 'Margen', qty: '—', price: '39%' },
    ],
    previewTotal: '$7,200',
  },
  administracion: {
    label: 'Administración',
    appName: 'SmartAdmin',
    Icon: FolderCog,
    sidebar: ['Inicio', 'Documentos', 'Información', 'Asistentes', 'Configuración'],
    features: [
      { Icon: FolderCog, title: 'Automatización documental', desc: 'Organiza y clasifica documentos automáticamente.' },
      { Icon: LayoutDashboard, title: 'Gestión de información', desc: 'Centraliza datos dispersos en un solo lugar.' },
      { Icon: Sparkles, title: 'Asistentes internos', desc: 'Resuelve consultas administrativas al instante.' },
    ],
    mainTitle: 'Nuevo documento',
    fields: [
      { label: 'Tipo de documento', placeholder: 'Selecciona un tipo…' },
      { label: 'Área', placeholder: 'Selecciona un área…' },
      { label: 'Instrucciones', placeholder: 'Agrega instrucciones (opcional)…' },
    ],
    buttonText: 'Generar con IA',
    previewCompany: 'Archivo',
    previewRows: [
      { label: 'Documentos procesados', qty: '—', price: '134' },
      { label: 'Pendientes de revisión', qty: '—', price: '6' },
      { label: 'Tiempo ahorrado', qty: '—', price: '18h' },
    ],
    previewTotal: 'Al día',
  },
  otros: {
    label: 'Otros',
    appName: 'SmartFlow',
    Icon: Sparkles,
    sidebar: ['Inicio', 'Tu proceso', 'Configuración'],
    features: [
      { Icon: Compass, title: 'Soluciones adaptadas', desc: 'A las necesidades específicas de tu equipo.' },
      { Icon: Sparkles, title: 'Construido en la sesión', desc: 'Partimos de un problema real que tú nos cuentas.' },
      { Icon: Target, title: 'Con foco en tu proceso', desc: 'No una plantilla genérica, sino tu propio caso.' },
    ],
    mainTitle: 'Tu proceso',
    fields: [
      { label: 'Problema a resolver', placeholder: 'Cuéntanos el caso…' },
      { label: 'Área involucrada', placeholder: 'Selecciona un área…' },
      { label: 'Resultado esperado', placeholder: 'Agrega el objetivo…' },
    ],
    buttonText: 'Construir con IA',
    previewCompany: 'Tu equipo',
    previewRows: [
      { label: 'Definido en sesión', qty: '—', price: '—' },
      { label: 'Construido con IA', qty: '—', price: '—' },
      { label: 'Listo para publicar', qty: '—', price: '—' },
    ],
    previewTotal: 'A tu medida',
  },
};

const BUSINESS_BENEFITS = [
  'Metodología enfocada en resultados',
  'Adaptado a tus objetivos y procesos',
  'Sin necesidad de experiencia previa',
  'Acompañamiento experto',
  'Certificación de participación',
];

const TAKEAWAYS = [
  {
    Icon: Compass,
    color: 'var(--blue)',
    bg: 'rgba(46, 111, 242, 0.12)',
    title: 'Una metodología para construir',
    desc: 'Aprenden a transformar una idea en una aplicación funcional utilizando IA.',
  },
  {
    Icon: Award,
    color: 'var(--violet)',
    bg: 'rgba(123, 47, 247, 0.12)',
    title: 'Una aplicación propia',
    desc: 'Cada participante trabaja en una solución relacionada con su actividad.',
  },
  {
    Icon: Sparkles,
    color: 'var(--fuchsia)',
    bg: 'rgba(230, 25, 179, 0.12)',
    title: 'Una nueva forma de trabajar',
    desc: 'Incorporan IA como copiloto para crear, probar y evolucionar sistemas.',
  },
  {
    Icon: Rocket,
    color: 'var(--orange)',
    bg: 'rgba(255, 122, 24, 0.12)',
    title: 'Capacidad para seguir creando',
    desc: 'El aprendizaje continúa después de la capacitación.',
  },
];

const CTA_TIMELINE = [
  { title: 'Idea', desc: 'Identifica oportunidades en tu trabajo.' },
  { title: 'Construcción', desc: 'Convierte tus ideas en herramientas.' },
  { title: 'Prueba', desc: 'Valida y ajusta en tu entorno real.' },
  { title: 'Publicación', desc: 'Ponla en uso y compártela.' },
  { title: 'Evolución', desc: 'Mejora continuamente.' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
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

export default function AiBuildLabPage() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeDept, setActiveDept] = React.useState<DeptKey>('ventas');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dept = DEPARTMENTS[activeDept];

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <Link href="#inicio" className={styles.navLogo}>
          <img src="/images/smartchatix-logo.png" alt="SmartChatix" />
        </Link>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`${styles.navLink} ${l.label === 'Inicio' ? styles.navLinkActive : ''}`}>
              {l.label}
            </a>
          ))}
        </div>
        <div className={styles.navActions}>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={styles.navCta}>
            Contáctanos <ArrowRight size={15} />
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
              <a
                key={l.href}
                href={l.href}
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
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
            <div className={styles.heroLabel}>AI BUILD LAB</div>
            <h1 className={styles.heroTitle}>
              Tu equipo no solo aprende IA.<br />
              <span className={styles.brandText}>Construye soluciones reales.</span>
            </h1>
            <p className={styles.heroText}>
              Una experiencia práctica donde tus colaboradores diseñan, construyen y publican aplicaciones que resuelven problemas reales de tu empresa.
            </p>
            <div className={styles.heroActions}>
              <Link href="#empresas" className={styles.btnPrimary}>
                Quiero llevar AI Build Lab a mi empresa <ArrowRight size={17} />
              </Link>

            </div>
            <div className={styles.heroFeatureRow}>
              {HERO_FEATURES.map((f, i) => (
                <div key={i} className={styles.heroFeatureItem}>
                  <f.icon size={17} />
                  <span>{f.label}</span>
                </div>
              ))}
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

            <div className={styles.heroMobileSteps}>
              {HERO_MOBILE_STEPS.map((s, i) => (
                <React.Fragment key={s.title}>
                  <div className={styles.heroMobileStep}>
                    <div className={styles.heroMobileStepIcon} style={{ color: s.color, borderColor: s.color }}>
                      <s.Icon size={16} />
                    </div>
                    <div className={styles.heroMobileStepTitle}>{s.title}</div>
                    <div className={styles.heroMobileStepDesc}>{s.desc}</div>
                  </div>
                  {i < HERO_MOBILE_STEPS.length - 1 && (
                    <ChevronRight size={14} className={styles.heroMobileStepArrow} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARADIGM — sección blanca */}
      <section id="experiencia" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <div className={styles.paradigmGrid}>
            <Reveal>
              <div className={styles.eyebrow}>Una nueva forma de capacitar</div>
              <h2 className={styles.paradigmTitle}>
                No solo aprendas IA. <br />
                Úsala <span className={styles.brandText}>para construir</span>
              </h2>
              <p className={styles.paradigmText}>
                La mayoría de capacitaciones terminan cuando acaba la presentación. En AI Build Lab, el aprendizaje comienza cuando cada participante abre su laptop y empieza a construir una solución real para su trabajo.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={styles.flowList}>
                {FLOW_STEPS.map((s, i) => (
                  <div key={i} className={styles.flowItem}>
                    <div className={styles.flowIconWrap} style={{ background: 'var(--brand-gradient)' }}>
                      <s.Icon size={19} />
                    </div>
                    <div>
                      <div className={styles.flowItemTitle}>{s.title}</div>
                      <div className={styles.flowItemDesc}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div style={{ marginTop: '3rem' }} className={styles.paradigmVisual}>
              <ApplicationGallery3D />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS — sección oscura */}
      <section className={`${styles.section} ${styles.sectionDark} ${styles.processSection}`}>
        <div className={styles.processBg} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.processGrid}>
            <Reveal>
              <div className={styles.eyebrow}>El proceso</div>
              <h2 className={styles.processTitle}>
                De una idea<br />a una <span className={styles.brandText}>aplicación real.</span>
              </h2>
              <p className={styles.processText}>
                En 6 sesiones, tu equipo convierte problemas reales en soluciones funcionales utilizando IA como copiloto.
              </p>

              <div className={styles.processTimeline}>
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.num} className={styles.processTimelineItem}>
                    <div className={styles.processTimelineMarker}>
                      <div className={styles.processNum} style={{ background: step.color }}>{step.num}</div>
                      {i < PROCESS_STEPS.length - 1 && <span className={styles.processTimelineLine} aria-hidden="true" />}
                    </div>
                    <div className={styles.processIconBadge} style={{ color: step.color }}>
                      <step.Icon size={20} />
                    </div>
                    <div>
                      <div className={styles.processStepTitle}>{step.title}</div>
                      <div className={styles.processStepDesc}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={styles.processVisual}>
                <div className={styles.processSideNote}>
                  <span className={styles.processSideNoteBar} aria-hidden="true" />
                  <span>Ideas que se convierten en herramientas que generan impacto.</span>
                </div>
                <div className={styles.processCardImageWrap}>
                  <Image
                    src="/images/ai-build-lab-process-card.png"
                    alt="Construyendo tu idea con IA — panel de una app generándose paso a paso"
                    width={1536}
                    height={1024}
                    className={styles.processCardImage}
                    priority={false}
                  />
                </div>
                <div className={styles.processFeatureRow}>
                  {PROCESS_FEATURES.map((f, i) => (
                    <div key={i} className={styles.processFeatureItem}>
                      <div className={styles.processFeatureIcon} style={{ color: f.color, background: f.bg }}>
                        <f.Icon size={20} />
                      </div>
                      <div className={styles.processFeatureTitle}>{f.title}</div>
                      <div className={styles.processFeatureDesc}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS — sección blanca */}
      <section id="soluciones" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <div className={styles.deptHeader}>
            <div className={styles.eyebrow}>Aplicaciones por departamento</div>
            <h2 className={styles.deptTitle}>Soluciones para cada departamento.</h2>
            <p className={styles.deptText}>Cada equipo puede construir herramientas adaptadas a sus propios procesos y necesidades.</p>
          </div>

          <div className={styles.deptTabs}>
            {(Object.keys(DEPARTMENTS) as DeptKey[]).map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => setActiveDept(key)}
                className={`${styles.deptTab} ${activeDept === key ? styles.deptTabActive : ''}`}
              >
                {DEPARTMENTS[key].label}
              </button>
            ))}
          </div>

          <div className={styles.deptContentGrid}>
            <div className={styles.deptFeatureList}>
              {dept.features.map((f, i) => (
                <div key={i} className={styles.deptFeatureItem}>
                  <div className={styles.deptFeatureIcon}><f.Icon size={19} /></div>
                  <div>
                    <div className={styles.deptFeatureTitle}>{f.title}</div>
                    <div className={styles.deptFeatureDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <AppMockup dept={dept} />
          </div>
        </div>
      </section>

      {/* BUSINESS — sección oscura */}
      <section id="empresas" className={`${styles.section} ${styles.sectionDark2}`}>
        <div className={styles.inner}>
          <div className={styles.businessGrid}>
            <Reveal>
              <div className={styles.eyebrow}>Para empresas</div>
              <h2 className={styles.businessTitle}>
                Más que capacitación,<br />es una <span className={styles.brandText}>experiencia de transformación.</span>
              </h2>
              <p className={styles.businessText}>
                AI Build Lab está diseñado para organizaciones que quieren que sus colaboradores pasen de simplemente utilizar herramientas de IA a crear soluciones con ellas.
              </p>
              <div className={styles.businessList}>
                {BUSINESS_BENEFITS.map((b, i) => (
                  <div key={i} className={styles.businessListItem}>
                    <CheckCircle2 size={18} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={styles.modalityRow}>
                <div className={styles.modalityCard}>
                  <div className={styles.modalityIcon}><Building2 size={20} /></div>
                  <h4>In House</h4>
                  <p>Llevamos la experiencia a las instalaciones de tu empresa.</p>
                </div>
                <div className={styles.modalityCard}>
                  <div className={styles.modalityIcon}><Laptop size={20} /></div>
                  <h4>Remota</h4>
                  <p>Tu equipo participa desde cualquier lugar.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TAKEAWAYS — sección blanca */}
      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.inner}>
          <Reveal className={styles.takeawaysHeader}>
            <div className={styles.eyebrow}>Lo que se llevan de la experiencia</div>
            <h2 className={styles.takeawaysTitle}>Equipos que construyen.</h2>
          </Reveal>

          <motion.div
            className={styles.takeawaysGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {TAKEAWAYS.map((t, i) => (
              <motion.div key={i} className={styles.takeawayCard} variants={fadeUp}>
                <div className={styles.takeawayIcon} style={{ background: t.bg, color: t.color }}>
                  <t.Icon size={24} />
                </div>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="preguntas" className={styles.finalCta}>
        <div className={styles.finalCtaBg} aria-hidden="true" />
        <div className={styles.finalCtaOverlay} aria-hidden="true" />

        <div className={styles.finalCtaTopBar}>
          <span className={styles.finalCtaLabel}>AI BUILD LAB</span>
          <span className={styles.finalCtaTagline}>Ideas reales. Herramientas reales. Impacto real.</span>
        </div>

        <Reveal className={styles.finalCtaContent}>
          <h2 className={styles.finalCtaTitle}>
            Haz que tu equipo<br />
            <span className={styles.brandText}>evolucione</span> su forma<br />
            de trabajar con IA.
          </h2>
          <p className={styles.finalCtaText}>
            AI Build Lab enseña a tus colaboradores a transformar procesos, información y tareas de su propio trabajo en herramientas que les hagan trabajar mejor, más rápido y con mayor eficiencia.
          </p>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
            Lleva AI Build Lab a tu empresa <ArrowRight size={17} />
          </a>
        </Reveal>

        <div className={styles.finalCtaTimeline}>
          {CTA_TIMELINE.map((step) => (
            <div key={step.title} className={styles.finalCtaTimelineItem}>
              <div className={styles.finalCtaTimelineTitle}>{step.title}</div>
              <div className={styles.finalCtaTimelineDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}><img src="/images/smartchatix-logo.png" alt="SmartChatix" /></div>
          <div className={styles.footerNav}>
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className={styles.footerSocials}>
            <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</span>
          <div className={styles.footerTagline}>Inteligencia artificial aplicada a lo que realmente importa.</div>
          <div className={styles.footerBottomLinks}>
            <a href="/terminos-condiciones">Términos</a>
            <a href="/politica-privacidad">Privacidad</a>
            <a href="#empresas">Escríbenos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AppMockup({ dept }: { dept: (typeof DEPARTMENTS)[DeptKey] }) {
  return (
    <motion.div
      key={dept.appName}
      className={styles.appMockup}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.appSidebar}>
        <div className={styles.appSidebarBrand}><span className={styles.appSidebarDot} />{dept.appName}</div>
        {dept.sidebar.map((item, i) => (
          <div key={item} className={`${styles.appSidebarItem} ${i === 1 ? styles.appSidebarItemActive : ''}`}>
            <dept.Icon size={13} /> {item}
          </div>
        ))}
      </div>
      <div className={styles.appMain}>
        <h4>{dept.mainTitle}</h4>
        {dept.fields.map((f) => (
          <div key={f.label} className={styles.laptopField}>
            <label>{f.label}</label>
            <div className={styles.laptopFieldBox} />
          </div>
        ))}
        <button type="button" className={styles.laptopMockBtn}><Sparkles size={12} style={{ marginRight: 6 }} />{dept.buttonText}</button>
      </div>
      <div className={styles.appPreview}>
        <h4><ExternalLink size={13} /> Vista previa</h4>
        <div style={{ fontSize: '0.72rem', color: '#7bb0ff', fontWeight: 700, marginBottom: 6 }}>{dept.previewCompany}</div>
        <table className={styles.previewTable}>
          <tbody>
            {dept.previewRows.map((r) => (
              <tr key={r.label}><td>{r.label}</td><td>{r.price}</td></tr>
            ))}
          </tbody>
        </table>
        <div className={styles.previewTotal}><span>Total</span><span>{dept.previewTotal}</span></div>
      </div>
    </motion.div>
  );
}
