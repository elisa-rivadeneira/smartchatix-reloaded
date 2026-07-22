'use client';

import ClaimForm from '@/components/ClaimForm';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LibroReclamacionesPage() {
  const colors = {
    primary: '#003366',
    secondary: '#0066CC',
    accent: '#FF6600',
    white: '#FFFFFF',
    gray: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#9AA0A6',
      500: '#5F6368',
      600: '#3C4043',
      700: '#202124'
    }
  };

  const spacing = {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  };

  const infoBoxStyle = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '40px',
    textAlign: 'left' as const
  };

  const importantBoxStyle = {
    backgroundColor: '#faf5ff',
    border: '1px solid #e9d5ff',
    padding: '16px 20px',
    borderRadius: '8px',
    marginTop: '16px',
    marginBottom: '16px'
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.white,
      color: colors.gray[700]
    }}>
      {/* HEADER ESTILO INSTITUCIONAL */}
      <header style={{
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: colors.primary,
          color: colors.white,
          padding: `${spacing.xs} 0`,
          fontSize: '0.8rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `0 ${spacing.md}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              📧 contacto@smartchatix.com | 📞 +51 967 717 179
            </div>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <span>🌐 ES</span>
              <span>|</span>
              <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Ingresar</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing.sm} ${spacing.md}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            textDecoration: 'none'
          }}>
            <img
              src="/images/logo_samartchatix.png"
              alt="SMARTCHATIX"
              style={{
                height: '65px',
                width: 'auto',
                cursor: 'pointer'
              }}
            />
          </Link>

        </div>
      </header>

      {/* CONTENT */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
        padding: '48px 16px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{
              fontSize: '40px',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Libro de Reclamaciones
            </h1>

            <div style={infoBoxStyle}>
              <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '16px', fontSize: '15px' }}>
                Conforme al <strong>Código de Protección y Defensa del Consumidor</strong> (Ley N° 29571),
                SmartChatix pone a su disposición este Libro de Reclamaciones Virtual.
              </p>

              <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '16px', fontSize: '15px' }}>
                Usted puede registrar un <strong>reclamo</strong> (disconformidad relacionada con el producto o servicio)
                o una <strong>queja</strong> (disconformidad relacionada con la atención recibida).
              </p>

              <div style={importantBoxStyle}>
                <p style={{ fontSize: '14px', color: '#6b21a8', lineHeight: '1.6' }}>
                  <strong>📋 Importante:</strong> La presentación del reclamo no impide acudir a otras vías de solución
                  de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
                </p>
              </div>

              <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '15px' }}>
                Recibirá una copia de su registro por correo electrónico y atenderemos su solicitud
                en un plazo máximo de <strong>30 días calendario</strong>.
              </p>
            </div>
          </div>

          <ClaimForm />

          <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            <p>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
            <p style={{ marginTop: '8px' }}>Conforme a la Ley N° 29571 - Código de Protección y Defensa del Consumidor</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
