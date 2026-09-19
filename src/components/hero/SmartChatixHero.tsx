'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Bot, Workflow, Code2, ArrowRight } from 'lucide-react';
import LaptopShowcase from './LaptopShowcase';

const BENEFITS = [
  { icon: Bot, label: 'Agentes IA' },
  { icon: Workflow, label: 'Automatización' },
  { icon: Code2, label: 'Software a medida' },
];

export default function SmartChatixHero() {
  return (
    <section style={sectionStyle}>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        .hero-copy {
          text-align: center;
        }
        .hero-ctas {
          justify-content: center;
        }
        .hero-benefits {
          justify-content: center;
        }
        .hero-laptop-col {
          max-width: 560px;
          margin: 0 auto;
          width: min(94vw, 560px);
        }
        @media (min-width: 1100px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 2rem;
          }
          .hero-copy {
            text-align: left;
          }
          .hero-ctas {
            justify-content: flex-start;
          }
          .hero-benefits {
            justify-content: flex-start;
          }
          .hero-laptop-col {
            max-width: none;
            width: 100%;
            margin: 0;
          }
        }
      `}</style>

      <div style={bgAbstractStyle} aria-hidden="true" />
      <div style={bgOverlayStyle} aria-hidden="true" />

      <div style={containerStyle}>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 style={headlineStyle}>
              Transformamos problemas en{' '}
              <span style={gradientTextStyle}>soluciones con IA.</span>
            </h1>

            <p style={subheadStyle}>
              Desarrollamos agentes de IA, chatbots, automatizaciones, ERP personalizados y software a medida para que tu negocio avance más rápido.
            </p>

            <div className="hero-ctas" style={ctaRowStyle}>
              <a
                href="https://wa.me/51967717179?text=Hola%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto%20de%20tecnolog%C3%ADa%20para%20mi%20negocio."
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button style={primaryCtaStyle}>
                  Quiero una solución <ArrowRight size={18} />
                </button>
              </a>
              <Link href="#otros-programas" style={{ textDecoration: 'none' }}>
                <button style={secondaryCtaStyle}>
                  Ver cursos <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            <div className="hero-benefits" style={benefitsRowStyle}>
              {BENEFITS.map(({ icon: Icon, label }) => (
                <span key={label} style={benefitItemStyle}>
                  <Icon size={16} color="#8B9BC7" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-laptop-col">
            <LaptopShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: '#050B1E',
  padding: 'clamp(3rem, 8vw, 6rem) 0',
};

const bgAbstractStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/hero-bg-abstract.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'right center',
  opacity: 0.9,
};

const bgOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(100deg, #050B1E 0%, #050B1E 30%, rgba(5,11,30,0.75) 55%, rgba(5,11,30,0.35) 75%, rgba(5,11,30,0.15) 100%)',
};

const containerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const headlineStyle: CSSProperties = {
  fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
  fontWeight: 700,
  lineHeight: 1.15,
  color: '#FFFFFF',
  margin: '0 0 1.25rem 0',
  letterSpacing: '-0.02em',
};

const gradientTextStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 55%, #EC4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const subheadStyle: CSSProperties = {
  fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
  lineHeight: 1.6,
  color: 'rgba(226, 232, 255, 0.75)',
  maxWidth: '540px',
  margin: '0 0 2rem 0',
};

const ctaRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '1.75rem',
};

const primaryCtaStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
  color: '#FFFFFF',
  border: 'none',
  padding: '0.95rem 1.75rem',
  borderRadius: '50px',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
};

const secondaryCtaStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'transparent',
  color: '#FFFFFF',
  border: '1px solid rgba(255,255,255,0.3)',
  padding: '0.95rem 1.75rem',
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
};

const benefitsRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
};

const benefitItemStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.9rem',
  color: 'rgba(226, 232, 255, 0.7)',
};
