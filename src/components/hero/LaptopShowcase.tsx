'use client';

import { useState, type CSSProperties } from 'react';

// Recorte real de /public/images/hero-laptop-frame.webp: la pantalla ocupa esta
// región dentro de la imagen completa de la laptop (medido en % del ancho/alto
// de la imagen, no en píxeles) para que el contenido de la pantalla escale
// exactamente junto con la laptop en cualquier tamaño.
const SCREEN_AREA = {
  top: '10.2%',
  left: '15%',
  width: '69.5%',
  height: '58.5%',
};

const FLOW_LEFT = [
  { label: 'WhatsApp', sub: 'Mensajes de clientes', color: '#25D366' },
  { label: 'Documentos', sub: 'PDF, Excel, etc.', color: '#3B82F6' },
  { label: 'Correos', sub: 'Emails soporte', color: '#F59E0B' },
  { label: 'Odoo / ERP', sub: 'Datos del negocio', color: '#8B5CF6' },
];

const FLOW_RIGHT = [
  { label: 'Responde al cliente', sub: 'Mensaje enviado' },
  { label: 'Registra en Odoo', sub: 'Pedido creado' },
  { label: 'Genera documento', sub: 'Cotización en PDF' },
  { label: 'Notifica al equipo', sub: 'Tarea asignada' },
];

// Los videos NO viven en /public/videos (esa carpeta está en .gitignore para no
// inflar el build de producción) — se suben a Cloudflare R2, igual que el resto
// de videos del sitio (ver upload-videos-to-r2.js).
const VIDEO_SOURCES = [
  'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/smartchatix-flow.webm',
  'https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/smartchatix-flow.mp4',
];

export default function LaptopShowcase() {
  // El video vive en Cloudflare R2 (dominio distinto), así que un `fetch()` para
  // verificar que existe choca con CORS. En cambio, <video>/<source> sí pueden
  // cargar cross-origin sin problema para reproducir — solo usamos su propio
  // evento `error` como red de seguridad si R2 llegara a fallar.
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div style={wrapperStyle}>
      <img
        src="/images/hero-laptop-frame.webp"
        alt=""
        aria-hidden="true"
        style={laptopImgStyle}
      />

      <div style={{ ...screenStyle, ...SCREEN_AREA } as CSSProperties}>
        {!videoFailed && (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            style={videoStyle}
          >
            <source src={VIDEO_SOURCES[0]} type="video/webm" />
            <source src={VIDEO_SOURCES[1]} type="video/mp4" />
          </video>
        )}

        {videoFailed && <ScreenFlowDiagram />}
      </div>
    </div>
  );
}

function ScreenFlowDiagram() {
  return (
    <div style={screenContentStyle}>
      <style>{`
        @keyframes flowDash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.55); }
          50% { box-shadow: 0 0 0 8px rgba(139, 92, 246, 0); }
        }
        .flow-line {
          stroke-dasharray: 4 6;
          animation: flowDash 1.4s linear infinite;
        }
      `}</style>

      <div style={screenTopBarStyle}>
        <span style={{ fontWeight: 700, fontSize: '3cqw', letterSpacing: '-0.02em' }}>
          smart<span style={{ color: '#3B82F6' }}>chatix</span>
        </span>
        <span style={liveBadgeStyle}>
          <span style={liveDotStyle} />
          En vivo
        </span>
      </div>

      <div style={flowGridStyle}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {FLOW_LEFT.map((_, i) => {
            const y = 12 + i * 25;
            return (
              <path
                key={`l-${i}`}
                className="flow-line"
                d={`M 26,${y} C 40,${y} 42,50 50,50`}
                stroke="#3B82F6"
                strokeWidth="0.6"
                fill="none"
                opacity={0.55}
              />
            );
          })}
          {FLOW_RIGHT.map((_, i) => {
            const y = 12 + i * 25;
            return (
              <path
                key={`r-${i}`}
                className="flow-line"
                d={`M 50,50 C 58,50 60,${y} 74,${y}`}
                stroke="#8B5CF6"
                strokeWidth="0.6"
                fill="none"
                opacity={0.55}
              />
            );
          })}
        </svg>

        <div style={flowColStyle('left')}>
          {FLOW_LEFT.map((item) => (
            <FlowChip key={item.label} {...item} />
          ))}
        </div>

        <div style={aiNodeWrapStyle}>
          <div style={aiNodeStyle}>AI</div>
        </div>

        <div style={flowColStyle('right')}>
          {FLOW_RIGHT.map((item) => (
            <FlowChip key={item.label} {...item} align="right" />
          ))}
        </div>
      </div>

      <div style={statusBarStyle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
          <span style={statusCheckStyle}>✓</span>
          <span>
            <div style={{ fontWeight: 700, fontSize: '2.6cqw' }}>¡Proceso completado!</div>
            <div style={{ opacity: 0.65, fontSize: '2cqw' }}>De ideas a resultados, en menos tiempo.</div>
          </span>
        </span>
        <span style={{ textAlign: 'right' as const }}>
          <div style={{ fontWeight: 700, fontSize: '3.2cqw', color: '#34D399' }}>80%</div>
          <div style={{ opacity: 0.65, fontSize: '2cqw' }}>menos tareas</div>
        </span>
      </div>
    </div>
  );
}

function FlowChip({
  label,
  sub,
  color,
  align = 'left',
}: {
  label: string;
  sub: string;
  color?: string;
  align?: 'left' | 'right';
}) {
  return (
    <div style={{ ...chipStyle, flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
      {color && <span style={{ ...chipDotStyle, background: color }} />}
      <span style={{ textAlign: align }}>
        <div style={{ fontWeight: 700, fontSize: '2.3cqw', lineHeight: 1.25 }}>{label}</div>
        <div style={{ opacity: 0.6, fontSize: '1.8cqw', lineHeight: 1.25 }}>{sub}</div>
      </span>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
};

const laptopImgStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 'auto',
  filter: 'drop-shadow(0 2.8vw 2.2vw rgba(0, 0, 0, 0.75)) drop-shadow(0 0.8vw 0.6vw rgba(0, 0, 0, 0.6))',
};

const screenStyle: CSSProperties = {
  position: 'absolute',
  overflow: 'hidden',
  borderRadius: '1.5% 1.5% 0 0',
  background: '#05070F',
  containerType: 'inline-size',
} as CSSProperties;

const videoStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const screenContentStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '3cqw 3.5cqw',
  color: '#F1F5F9',
  fontFamily: 'Arial, sans-serif',
};

const screenTopBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const liveBadgeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8cqw',
  fontSize: '1.9cqw',
  opacity: 0.75,
};

const liveDotStyle: CSSProperties = {
  width: '1.2cqw',
  height: '1.2cqw',
  minWidth: '4px',
  minHeight: '4px',
  borderRadius: '50%',
  background: '#34D399',
};

const flowGridStyle: CSSProperties = {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '1.5cqw 0',
};

function flowColStyle(align: 'left' | 'right'): CSSProperties {
  return {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4cqw',
    width: '34%',
    alignItems: align === 'right' ? 'flex-end' : 'flex-start',
  };
}

const chipStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1cqw',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '1cqw',
  padding: '1cqw 1.2cqw',
};

const chipDotStyle: CSSProperties = {
  width: '1.8cqw',
  height: '1.8cqw',
  minWidth: '6px',
  minHeight: '6px',
  borderRadius: '50%',
  flexShrink: 0,
};

const aiNodeWrapStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  flexShrink: 0,
};

const aiNodeStyle: CSSProperties = {
  width: '13cqw',
  height: '13cqw',
  minWidth: '30px',
  minHeight: '30px',
  borderRadius: '22%',
  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '2.6cqw',
  animation: 'aiPulse 2.2s ease-in-out infinite',
};

const statusBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '1.2cqw',
  padding: '1.5cqw 2cqw',
};

const statusCheckStyle: CSSProperties = {
  width: '3.2cqw',
  height: '3.2cqw',
  minWidth: '14px',
  minHeight: '14px',
  borderRadius: '50%',
  background: '#34D399',
  color: '#05070F',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.8cqw',
  flexShrink: 0,
};
