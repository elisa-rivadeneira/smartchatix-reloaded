'use client';

import type { CSSProperties } from 'react';
import {
  Bot,
  MessageCircle,
  Settings,
  Code2,
  Lightbulb,
  FileText,
  CheckCircle2,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

const colors = {
  primary: '#003366',
  secondary: '#0066CC',
  purple: '#7C3AED',
  accent: '#FF6600',
  white: '#FFFFFF',
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    500: '#5F6368',
    600: '#3C4043',
    700: '#202124',
  },
};

function OdooIcon({ size = 24, color = '#8B5CF6' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 12 3 7m9 5 9-5m-9 5v10" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const SOLUTIONS = [
  {
    icon: Bot,
    iconBg: '#EFF6FF',
    iconColor: colors.secondary,
    title: 'Agentes de IA',
    description: 'Asistentes inteligentes que entienden, analizan y ejecutan tareas en tus sistemas.',
  },
  {
    icon: MessageCircle,
    iconBg: '#ECFDF5',
    iconColor: '#16A34A',
    title: 'Chatbots con IA',
    description: 'Automatiza la atención, ventas y soporte en WhatsApp y otros canales.',
  },
  {
    icon: Settings,
    iconBg: '#EFF6FF',
    iconColor: colors.secondary,
    title: 'Automatización de procesos',
    description: 'Conectamos tus herramientas y eliminamos tareas repetitivas.',
  },
  {
    icon: OdooIcon,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    title: 'Odoo / ERP Personalizado',
    description: 'Módulos a medida, integraciones y reportes para que tu ERP se adapte a tu negocio.',
  },
  {
    icon: Code2,
    iconBg: colors.gray[100],
    iconColor: colors.gray[700],
    title: 'Software a medida',
    description: 'Desarrollamos sistemas, plataformas y herramientas adaptados a tus necesidades.',
  },
];

const PROCESS_STEPS = [
  { icon: Lightbulb, bg: '#FEF3C7', color: '#D97706', title: 'Analizamos tu necesidad' },
  { icon: FileText, bg: '#F5F3FF', color: '#8B5CF6', title: 'Diseñamos la solución' },
  { icon: Code2, bg: '#F5F3FF', color: '#8B5CF6', title: 'Desarrollamos e implementamos' },
  { icon: CheckCircle2, bg: '#ECFDF5', color: '#16A34A', title: 'Probamos y optimizamos' },
  { icon: BarChart3, bg: '#EFF6FF', color: colors.secondary, title: 'Te acompañamos en su evolución' },
];

const gradientText: CSSProperties = {
  background: `linear-gradient(90deg, ${colors.secondary}, ${colors.purple})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function TechSolutions() {
  return (
    <section style={{ padding: '5rem 0', backgroundColor: colors.white }}>
      <style>{`
        .tech-solutions-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        .tech-process-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0.5rem;
        }
        .tech-process-arrow {
          display: flex;
          align-items: center;
          padding-top: 28px;
          color: ${colors.gray[200]};
        }
        @media (max-width: 1024px) {
          .tech-solutions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .tech-solutions-grid {
            grid-template-columns: 1fr;
          }
          .tech-process-row {
            flex-direction: column;
            align-items: center;
          }
          .tech-process-arrow {
            transform: rotate(90deg);
            padding: 0.25rem 0;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: colors.gray[500],
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Soluciones
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: colors.primary, lineHeight: 1.25, margin: 0 }}>
            Tecnología que resuelve<br />
            <span style={gradientText}>problemas reales</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: colors.gray[500],
            maxWidth: '620px',
            margin: '1rem auto 0',
            lineHeight: 1.6,
          }}>
            Desarrollamos, automatizamos e integramos soluciones con IA para que tu negocio sea más eficiente, productivo y escalable.
          </p>
        </div>

        {/* Solution cards */}
        <div className="tech-solutions-grid" style={{ marginBottom: '5rem' }}>
          {SOLUTIONS.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: '12px',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: solution.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={24} color={solution.iconColor} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: colors.primary, margin: '0 0 0.5rem 0' }}>
                  {solution.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: colors.gray[500], lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Process */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: colors.gray[500],
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Nuestro proceso
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: colors.primary, margin: 0 }}>
            De tu idea a una <span style={gradientText}>solución</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: colors.gray[500],
            maxWidth: '560px',
            margin: '1rem auto 0',
            lineHeight: 1.6,
          }}>
            Te acompañamos en cada etapa para convertir tus ideas en tecnología que genera valor.
          </p>
        </div>

        <div className="tech-process-row" style={{ marginBottom: '3rem' }}>
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: step.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    <Icon size={24} color={step.color} />
                  </div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: colors.gray[700], textAlign: 'center', margin: 0, lineHeight: 1.4 }}>
                    {index + 1}. {step.title}
                  </p>
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="tech-process-arrow">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href="https://wa.me/51967717179?text=Hola%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto%20de%20tecnolog%C3%ADa%20para%20mi%20negocio."
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button style={{
              background: colors.secondary,
              color: colors.white,
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 102, 204, 0.3)',
            }}>
              Cuéntanos tu proyecto
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
