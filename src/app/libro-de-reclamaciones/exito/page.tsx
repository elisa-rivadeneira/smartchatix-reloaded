'use client';

import Link from 'next/link';
import { getClaimByCode } from '@/app/actions/claim.actions';
import Footer from '@/components/Footer';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ClaimSuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClaim() {
      if (!code) {
        setError('Código no encontrado');
        setLoading(false);
        return;
      }

      const result = await getClaimByCode(code);
      if (!result.success || !result.data) {
        setError(`Reclamo no encontrado: ${code}`);
      } else {
        setClaim(result.data);
      }
      setLoading(false);
    }

    fetchClaim();
  }, [code]);

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

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: colors.white,
        color: colors.gray[700]
      }}>
        {/* HEADER */}
        <header style={{
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
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
              <div>📧 contacto@smartchatix.com | 📞 +51 967 717 179</div>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <span>🌐 ES</span>
                <span>|</span>
                <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Ingresar</Link>
              </div>
            </div>
          </div>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `${spacing.sm} ${spacing.md}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
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

        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
          padding: '48px 16px',
          textAlign: 'center'
        }}>
          Cargando...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: colors.white,
        color: colors.gray[700]
      }}>
        {/* HEADER */}
        <header style={{
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
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
              <div>📧 contacto@smartchatix.com | 📞 +51 967 717 179</div>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <span>🌐 ES</span>
                <span>|</span>
                <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Ingresar</Link>
              </div>
            </div>
          </div>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `${spacing.sm} ${spacing.md}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
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

        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
          padding: '48px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
            <Link href="/libro-de-reclamaciones" style={{ color: '#667eea', textDecoration: 'underline' }}>
              Volver al formulario
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.white,
      color: colors.gray[700]
    }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
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
            <div>📧 contacto@smartchatix.com | 📞 +51 967 717 179</div>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <span>🌐 ES</span>
              <span>|</span>
              <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Ingresar</Link>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing.sm} ${spacing.md}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '8px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              flexShrink: 0
            }}>
              <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              letterSpacing: '-0.01em',
              margin: 0
            }}>
              {claim.type} Registrado
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Hemos recibido su {claim.type.toLowerCase()} exitosamente
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '11px', fontWeight: '500', marginBottom: '6px', letterSpacing: '1px' }}>
              CÓDIGO DE {claim.type}
            </p>
            <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', letterSpacing: '1.5px' }}>
              {claim.claimCode}
            </p>
          </div>

          <div style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Fecha de registro
              </p>
              <p style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{formattedDate}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Consumidor
              </p>
              <p style={{ fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                {claim.firstName} {claim.lastName}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{claim.email}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bien contratado
              </p>
              <p style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                {claim.productType}: {claim.productName}
              </p>
              {claim.amount && (
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  Monto: S/ {Number(claim.amount).toFixed(2)}
                </p>
              )}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>
                ¿Qué sigue ahora?
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ fontSize: '13px', color: '#1e40af', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '8px', fontSize: '14px' }}>✓</span>
                  <span>Hemos enviado una copia a <strong>{claim.email}</strong></span>
                </li>
                <li style={{ fontSize: '13px', color: '#1e40af', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '8px', fontSize: '14px' }}>✓</span>
                  <span>Su {claim.type.toLowerCase()} será evaluado por nuestro equipo</span>
                </li>
                <li style={{ fontSize: '13px', color: '#1e40af', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '8px', fontSize: '14px' }}>✓</span>
                  <span>Recibirá respuesta en máximo <strong>30 días calendario</strong></span>
                </li>
                <li style={{ fontSize: '13px', color: '#1e40af', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: '8px', fontSize: '14px' }}>✓</span>
                  <span>Guarde este código: <strong>{claim.claimCode}</strong></span>
                </li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  padding: '12px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ClaimSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
      <ClaimSuccessContent />
    </Suspense>
  );
}
