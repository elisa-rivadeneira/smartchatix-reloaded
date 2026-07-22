import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const colors = {
    primary: '#003366',
    secondary: '#0066CC',
    accent: '#FF6600',
    white: '#FFFFFF'
  };

  const spacing = {
    xs: '0.35rem',
    sm: '0.7rem',
    md: '1.05rem',
    lg: '1.4rem',
    xl: '2.1rem'
  };

  return (
    <footer style={{
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: colors.white
    }}>
      <style>{`
        @media (max-width: 768px) {
          .whatsapp-button {
            right: 10px !important;
            width: 40px !important;
            height: 40px !important;
          }
          .whatsapp-button svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}</style>
      {/* Sección superior - SmartChatix */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.xl} ${spacing.md}`,
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: spacing.xs
        }}>
          SmartChatix
        </h3>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.9rem'
        }}>
          Formando profesionales de excelencia para la industria
        </p>
      </div>

      {/* Sección intermedia - Grid de información */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.lg} ${spacing.md}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing.lg
      }}>
        {/* ACERCA DE */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ACERCA DE
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ marginBottom: spacing.xs }}>
              <Link href="#" style={{
                color: colors.white,
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Nosotros
              </Link>
            </li>
            <li style={{ marginBottom: spacing.xs }}>
              <Link href="#" style={{
                color: colors.white,
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Soporte
              </Link>
            </li>
          </ul>
        </div>

        {/* INFORMACIÓN */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            INFORMACIÓN
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ marginBottom: spacing.xs }}>
              <Link href="#" style={{
                color: colors.white,
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Blog
              </Link>
            </li>
            <li style={{ marginBottom: spacing.xs }}>
              <Link href="#" style={{
                color: colors.white,
                textDecoration: 'none',
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Cursos y Programas
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTÁCTANOS */}
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            CONTÁCTANOS
          </h3>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            <p style={{ margin: `0 0 ${spacing.xs} 0` }}>+51 967 717 179</p>
            <p style={{ margin: 0 }}>contacto@smartchatix.com</p>
          </div>
        </div>

        {/* SUSCRIPCIÓN */}
        <div>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: spacing.sm,
            opacity: 0.95
          }}>
            Suscríbete para recibir las últimas ofertas y promociones
          </h3>
          <form style={{
            display: 'flex',
            gap: spacing.xs
          }}>
            <input
              type="email"
              placeholder="@ Correo"
              style={{
                flex: 1,
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: '4px',
                border: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: colors.accent,
                color: colors.white,
                border: 'none',
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>

      {/* Sección inferior - Libro de Reclamaciones y Copyright */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `0 ${spacing.md}`,
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          textAlign: 'center'
        }}>
          <Link href="#" style={{
            color: colors.white,
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xs,
            opacity: 0.9
          }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            Libro de Reclamaciones
          </Link>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: spacing.md,
          paddingBottom: spacing.md,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center'
        }}>
          © 2025 SmartChatix. Todos los derechos reservados. |
          Tel: +51 967 717 179 |{' '}
          <Link href="/aviso-legal" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'underline'
          }}>
            Aviso Legal
          </Link>{' '}|{' '}
          <Link href="/terminos-condiciones" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'underline'
          }}>
            Términos y Condiciones
          </Link>{' '}|{' '}
          <Link href="/politica-privacidad" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'underline'
          }}>
            Política de Privacidad
          </Link>
        </div>
      </div>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/51967717179"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: colors.white,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          style={{ width: '30px', height: '30px' }}
        >
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.832.748 5.484 2.052 7.78L.7 30.136l6.548-1.708A15.876 15.876 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm9.304 22.948c-.388 1.096-1.932 2.004-3.156 2.268-.844.18-1.944.324-5.648-1.212-4.744-1.968-7.8-6.752-8.036-7.064-.232-.312-1.892-2.516-1.892-4.8s1.2-3.408 1.624-3.876c.424-.468.928-.588 1.24-.588.312 0 .624.004.896.016.288.012.672-.108 1.052.8.388.932 1.32 3.22 1.436 3.456.116.236.192.512.04.824-.152.312-.228.508-.456.784-.228.276-.48.616-.684.828-.228.236-.464.492-.2.964.264.468 1.176 1.94 2.524 3.144 1.736 1.548 3.2 2.032 3.656 2.256.456.228.72.192.984-.116.264-.308 1.132-1.32 1.432-1.772.3-.452.604-.376 1.016-.228.412.148 2.62 1.236 3.072 1.464.452.228.756.344.864.532.108.188.108 1.088-.28 2.184z" />
        </svg>
      </a>
    </footer>
  );
}
