'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FileText,
  UserCheck,
  LayoutDashboard,
  Calculator,
  FolderCog,
  Sparkles,
  Search,
  FileSearch,
  ListChecks,
  Download,
} from 'lucide-react';
import styles from './ApplicationGallery3D.module.css';
import { APPLICATIONS, type ApplicationId } from './applications.data';

const N = APPLICATIONS.length;

type Depth = 'center' | 'mid' | 'far';

interface SlotConfig {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateY: number;
  blur: number;
  opacity: number;
  zIndex: number;
  depth: Depth;
}

// offset = posición relativa respecto al índice activo (0 = centro).
// `z` (translateZ real) es lo que decide profundidad/click dentro del
// contexto 3D (preserve-3d) — el z-index de CSS se ignora ahí, así que
// sin esto dos tarjetas "coplanares" pelean por el click según orden del DOM.
const SLOTS: Record<number, SlotConfig> = {
  0: { x: 0, y: 0, z: 40, scale: 1, rotateY: 0, blur: 0, opacity: 1, zIndex: 60, depth: 'center' },
  1: { x: 245, y: -8, z: -60, scale: 0.74, rotateY: -20, blur: 1, opacity: 0.82, zIndex: 40, depth: 'mid' },
  2: { x: 420, y: -85, z: -140, scale: 0.5, rotateY: -30, blur: 3, opacity: 0.4, zIndex: 20, depth: 'far' },
  3: { x: 15, y: 165, z: -160, scale: 0.46, rotateY: 3, blur: 3.5, opacity: 0.34, zIndex: 10, depth: 'far' },
  4: { x: -420, y: -85, z: -140, scale: 0.5, rotateY: 30, blur: 3, opacity: 0.4, zIndex: 20, depth: 'far' },
  5: { x: -245, y: -8, z: -60, scale: 0.74, rotateY: 20, blur: 1, opacity: 0.82, zIndex: 40, depth: 'mid' },
};

const DEPTH_PARALLAX: Record<Depth, number> = { center: 3, mid: 16, far: 7 };

const CARD_SIZE = { w: 300, h: 372 };

const AUTO_ROTATE_MS = 4800;
const RESUME_DELAY_MS = 6000;

function offsetOf(appIndex: number, activeIndex: number) {
  return (appIndex - activeIndex + N) % N;
}

export default function ApplicationGallery3D() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [factor, setFactor] = React.useState(1);
  const [compact, setCompact] = React.useState<'full' | 'tablet' | 'mobile'>('full');
  const [parallax, setParallax] = React.useState({ x: 0, y: 0 });
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const stageRef = React.useRef<HTMLDivElement>(null);
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w <= 640) {
        setFactor(0.62);
        setCompact('mobile');
      } else if (w <= 900) {
        setFactor(0.72);
        setCompact('tablet');
      } else {
        setFactor(1);
        setCompact('full');
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  React.useEffect(() => {
    if (reducedMotion || isPaused) return undefined;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % N);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [isPaused, reducedMotion]);

  const pauseAndScheduleResume = React.useCallback(() => {
    setIsPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_MS);
  }, []);

  React.useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const selectIndex = (i: number) => {
    setActiveIndex(((i % N) + N) % N);
    pauseAndScheduleResume();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px, y: py });
    setTilt({ x: py * -6, y: px * 6 });
    pauseAndScheduleResume();
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectIndex(activeIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      selectIndex(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const visibleOffsets =
    compact === 'mobile' ? [0, 1, 5] : compact === 'tablet' ? [0, 1, 5, 3] : [0, 1, 2, 3, 4, 5];

  return (
    <div className={styles.panel}>
      <div className={styles.noise} aria-hidden="true" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={styles.particle}
          aria-hidden="true"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: `${p.delay}s` }}
        />
      ))}

      <div className={styles.header}>
        <div className={styles.label}>Aplicaciones reales · Posibilidades ilimitadas</div>
        <h3 className={styles.title}>
          ¿Qué podría <span className={styles.titleAccent}>construir tu equipo?</span>
        </h3>
        <p className={styles.subtext}>
          Desde herramientas comerciales hasta asistentes internos, dashboards y automatizaciones. La IA permite
          convertir necesidades reales en aplicaciones funcionales.
        </p>
      </div>

      <div className={styles.categories} role="tablist" aria-label="Departamentos">
        {APPLICATIONS.map((app, i) => (
          <button
            key={app.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            className={`${styles.categoryPill} ${i === activeIndex ? styles.categoryPillActive : ''}`}
            onClick={() => selectIndex(i)}
          >
            {app.department}
          </button>
        ))}
      </div>

      <div className={styles.stageOuter}>
        <div
          ref={stageRef}
          className={styles.stage}
          tabIndex={0}
          role="group"
          aria-label="Galería 3D de aplicaciones — usa las flechas para navegar"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`${styles.stageFade} ${styles.stageFadeLeft}`} aria-hidden="true" />
          <div className={`${styles.stageFade} ${styles.stageFadeRight}`} aria-hidden="true" />
          <motion.div
            className={styles.sceneInner}
            animate={reducedMotion ? undefined : { rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          >
            {APPLICATIONS.map((app, appIndex) => {
              const offset = offsetOf(appIndex, activeIndex);
              if (!visibleOffsets.includes(offset)) return null;
              const cfg = SLOTS[offset];
              const depthPar = DEPTH_PARALLAX[cfg.depth];
              const extraX = reducedMotion ? 0 : parallax.x * depthPar;
              const extraY = reducedMotion ? 0 : parallax.y * depthPar * 0.6;
              const isCenter = offset === 0;
              return (
                <motion.button
                  type="button"
                  key={app.id}
                  className={`${styles.card} ${isCenter ? styles.cardCenter : ''}`}
                  style={{
                    width: CARD_SIZE.w * factor,
                    height: CARD_SIZE.h * factor,
                    marginLeft: -(CARD_SIZE.w * factor) / 2,
                    marginTop: -(CARD_SIZE.h * factor) / 2,
                    zIndex: cfg.zIndex,
                  }}
                  animate={{
                    x: cfg.x * factor + extraX,
                    y: cfg.y * factor + extraY,
                    z: cfg.z,
                    scale: cfg.scale,
                    rotateY: cfg.rotateY,
                    opacity: cfg.opacity,
                    filter: `blur(${cfg.blur}px)`,
                  }}
                  transition={{ duration: reducedMotion ? 0.01 : 0.75, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => !isCenter && selectIndex(appIndex)}
                  aria-current={isCenter}
                  aria-label={`Ver ${app.name} — ${app.department}`}
                >
                  <AppScreen id={app.id} name={app.name} active={isCenter} />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className={styles.ground} aria-hidden="true" />
      <p className={styles.caption}>Estas son solo algunas posibilidades.</p>
    </div>
  );
}

const PARTICLES = [
  { top: '10%', left: '8%', size: 3, delay: 0 },
  { top: '18%', left: '85%', size: 2, delay: 1.2 },
  { top: '75%', left: '12%', size: 2, delay: 2.1 },
  { top: '85%', left: '80%', size: 3, delay: 0.6 },
  { top: '40%', left: '4%', size: 2, delay: 1.8 },
  { top: '30%', left: '94%', size: 2, delay: 0.9 },
];

function AppScreen({ id, name, active }: { id: ApplicationId; name: string; active: boolean }) {
  return (
    <div className={styles.screen}>
      <div className={styles.screenBar}>
        <span className={styles.screenDot} />
        <span className={styles.screenBarTitle}>{name}</span>
        {active && (
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} /> LIVE
          </span>
        )}
      </div>
      <div className={styles.screenBody}>
        {SCREEN_BY_ID[id]}
      </div>
    </div>
  );
}

const ScreenVentas = (
  <>
    <div className={styles.screenSidebar}>
      {['Inicio', 'Cotizaciones', 'Clientes', 'Productos', 'Reportes'].map((item, i) => (
        <div key={item} className={`${styles.screenSidebarItem} ${i === 1 ? styles.screenSidebarItemActive : ''}`}>
          <FileText size={11} /> {item}
        </div>
      ))}
    </div>
    <div className={styles.screenMain}>
      <div className={styles.screenLabel}>Nueva cotización</div>
      <div>
        <div className={styles.screenLabel}>Cliente</div>
        <div className={styles.screenFieldBox} />
      </div>
      <div>
        <div className={styles.screenLabel}>Producto</div>
        <div className={styles.screenFieldBox} />
      </div>
      <div className={styles.screenRow}><span>Cantidad</span><span>3</span></div>
      <div className={styles.screenRow}><span>Precio</span><span>$1,300</span></div>
      <div className={styles.screenTotal}><span>Total</span><span>$3,900</span></div>
      <span className={styles.screenBtn}>
        <Sparkles size={11} /> Generar cotización con IA
      </span>
    </div>
  </>
);

const ScreenPeople = (
  <>
    <div className={styles.screenSidebar}>
      {['Inicio', 'Candidatos', 'Vacantes', 'Reportes'].map((item, i) => (
        <div key={item} className={`${styles.screenSidebarItem} ${i === 1 ? styles.screenSidebarItemActive : ''}`}>
          <UserCheck size={11} /> {item}
        </div>
      ))}
    </div>
    <div className={styles.screenMain}>
      <div className={styles.screenLabel}>Evaluación de CV</div>
      <div className={styles.candidateCard}>
        <div className={styles.candidateTop}><span>María López</span><span>85% de ajuste</span></div>
        <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: '85%' }} /></div>
      </div>
      <div className={styles.candidateCard}>
        <div className={styles.candidateTop}><span>Carlos Méndez</span><span>78% de ajuste</span></div>
        <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: '78%' }} /></div>
      </div>
      <div className={styles.screenRow}><span>Experiencia</span><span className={`${styles.badge} ${styles.badgeOk}`}>Alta</span></div>
      <div className={styles.screenRow}><span>Habilidades</span><span className={`${styles.badge} ${styles.badgeInfo}`}>Match</span></div>
    </div>
  </>
);

const ScreenOps = (
  <>
    <div className={styles.screenSidebar}>
      {['Inicio', 'Solicitudes', 'Procesos', 'Equipo'].map((item, i) => (
        <div key={item} className={`${styles.screenSidebarItem} ${i === 1 ? styles.screenSidebarItemActive : ''}`}>
          <LayoutDashboard size={11} /> {item}
        </div>
      ))}
    </div>
    <div className={styles.screenMain}>
      <div className={styles.screenLabel}>Panel de operaciones</div>
      <div className={styles.screenRow}><span>Solicitud #204</span><span className={`${styles.badge} ${styles.badgeWarn}`}>En proceso</span></div>
      <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: '60%' }} /></div>
      <div className={styles.screenRow}><span>Solicitud #205</span><span className={`${styles.badge} ${styles.badgeOk}`}>Completado</span></div>
      <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: '100%' }} /></div>
      <div className={styles.screenRow}><span>Responsable</span><span>Equipo Ops</span></div>
      <div className={styles.screenRow}><span>Prioridad</span><span className={`${styles.badge} ${styles.badgeInfo}`}>Alta</span></div>
    </div>
  </>
);

const ScreenFinance = (
  <>
    <div className={styles.screenSidebar}>
      {['Inicio', 'Gastos', 'Presupuesto', 'Reportes'].map((item, i) => (
        <div key={item} className={`${styles.screenSidebarItem} ${i === 1 ? styles.screenSidebarItemActive : ''}`}>
          <Calculator size={11} /> {item}
        </div>
      ))}
    </div>
    <div className={styles.screenMain}>
      <div className={styles.screenLabel}>Análisis de gastos</div>
      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <div className={styles.statValue}>$18,400</div>
          <div className={styles.statLabel}>Gastos del mes</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statValue}>39%</div>
          <div className={styles.statLabel}>Variación</div>
        </div>
      </div>
      <div className={styles.screenLabel}>Categorías</div>
      <div className={styles.miniBars}>
        {[40, 65, 50, 90, 70, 55].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  </>
);

const ScreenDocs = (
  <>
    <div className={styles.screenSidebar}>
      {['Inicio', 'Documentos', 'Plantillas'].map((item, i) => (
        <div key={item} className={`${styles.screenSidebarItem} ${i === 1 ? styles.screenSidebarItemActive : ''}`}>
          <FolderCog size={11} /> {item}
        </div>
      ))}
    </div>
    <div className={styles.screenMain}>
      <div className={styles.screenLabel}>Gestión documental</div>
      <span className={styles.screenBtn} style={{ marginTop: 0 }}>
        <Sparkles size={11} /> Generar documento
      </span>
      <div className={styles.screenRow}><Search size={11} /><span style={{ flex: 1, marginLeft: 6 }}>Buscar</span></div>
      <div className={styles.screenLabel} style={{ marginTop: 4 }}>Archivos recientes</div>
      <div className={styles.docRow}><span className={styles.docIcon}><FileSearch size={10} /></span> Contrato_v2.pdf</div>
      <div className={styles.docRow}><span className={styles.docIcon}><ListChecks size={10} /></span> Resumen_reunión.docx</div>
      <div className={styles.docRow}><span className={styles.docIcon}><Download size={10} /></span> Reporte_Q3.xlsx</div>
    </div>
  </>
);

const ScreenAssistant = (
  <div className={styles.screenMain} style={{ width: '100%' }}>
    <div className={styles.screenLabel}>Asistente interno</div>
    <div className={styles.chatBubbleUser}>¿Qué procedimiento debo seguir para solicitar vacaciones?</div>
    <div className={styles.chatBubbleAi}>
      <span>Encontré 3 procedimientos relacionados<span className={styles.cursorBlink} /></span>
      <span className={styles.screenRow} style={{ border: 'none', padding: 0 }}>Documentos relacionados <span className={`${styles.badge} ${styles.badgeInfo}`}>3</span></span>
      <span className={styles.screenRow} style={{ border: 'none', padding: 0 }}>Fuentes internas <span className={`${styles.badge} ${styles.badgeOk}`}>RRHH</span></span>
    </div>
  </div>
);

const SCREEN_BY_ID: Record<ApplicationId, React.ReactNode> = {
  ventas: ScreenVentas,
  rrhh: ScreenPeople,
  operaciones: ScreenOps,
  finanzas: ScreenFinance,
  administracion: ScreenDocs,
  asistente: ScreenAssistant,
};
