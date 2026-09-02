'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const colors = {
  primary: '#003366',
  secondary: '#0066CC',
  accent: '#FF6600',
  success: '#009900',
  white: '#FFFFFF',
  gray: {
    50: '#F8F9FA',
    300: '#DADCE0',
    600: '#5F6368',
    700: '#202124',
  },
};

const spacing = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
};

function PagoWebinarConfirmadoContent() {
  const searchParams = useSearchParams();
  const webinar = searchParams.get('webinar') || '';

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !email.trim()) {
      setError('Por favor completa tu nombre completo y tu correo electrónico.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/email/send-webinar-certificate-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), webinar })
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'No se pudo enviar tu solicitud, intenta de nuevo.');
      }
    } catch {
      setError('No se pudo enviar tu solicitud, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        padding: spacing.xl,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: spacing.lg,
          paddingBottom: spacing.lg,
          borderBottom: `1px solid ${colors.gray[300]}`,
          flexWrap: 'wrap'
        }}>
          <Image
            src="/images/smartchatix_logov3.png"
            alt="SmartChatix"
            width={480}
            height={120}
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            priority
          />
          <div style={{ width: '1px', height: '28px', background: colors.gray[300] }} />
          <Image
            src="/images/logo_fluideka.jpeg"
            alt="Fluideka"
            width={120}
            height={40}
            style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }}
          />
        </div>

        {submitted ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              marginBottom: spacing.sm
            }}>
              <h1 style={{
                fontSize: '1.6rem',
                fontWeight: '600',
                color: colors.primary,
                margin: 0
              }}>
                ¡Listo!
              </h1>
              <div style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                background: `linear-gradient(135deg, #34d399 0%, #047857 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: colors.white
              }}>
                ✓
              </div>
            </div>
            <p style={{
              fontSize: '1.05rem',
              color: colors.gray[700],
              marginBottom: spacing.lg,
              lineHeight: '1.6'
            }}>
              Recibimos tus datos. Nuestro equipo validará tu pago y te enviará tu certificado digital a <strong>{email}</strong> en las próximas horas.
            </p>
            <Link href="/" style={{ color: colors.gray[600], fontSize: '0.9rem', textDecoration: 'none' }}>
              Volver al inicio
            </Link>
          </>
        ) : (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              marginBottom: spacing.sm
            }}>
              <h1 style={{
                fontSize: '1.6rem',
                fontWeight: '600',
                color: colors.primary,
                margin: 0
              }}>
                ¡Pago recibido!
              </h1>
              <div style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                background: `linear-gradient(135deg, #34d399 0%, #047857 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: colors.white
              }}>
                ✓
              </div>
            </div>
            <p style={{
              fontSize: '1.05rem',
              color: colors.gray[700],
              marginBottom: spacing.lg,
              lineHeight: '1.6'
            }}>
              Gracias por tu pago{webinar ? <> del webinar <strong>{webinar}</strong></> : ''}. Completa estos datos para que emitamos tu certificado.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: colors.gray[700], marginBottom: '6px' }}>
                Nombre completo (para el certificado)
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. María Fernanda Gómez Ríos"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '1rem',
                  border: `2px solid ${colors.gray[300]}`,
                  borderRadius: '8px',
                  marginBottom: spacing.sm,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />

              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: colors.gray[700], marginBottom: '6px' }}>
                Correo electrónico (donde recibirás el certificado)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '1rem',
                  border: `2px solid ${colors.gray[300]}`,
                  borderRadius: '8px',
                  marginBottom: spacing.md,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />

              {error && (
                <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: spacing.sm }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  backgroundColor: submitting ? '#9ca3af' : colors.accent,
                  color: colors.white,
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginBottom: spacing.sm
                }}
              >
                {submitting ? 'Enviando...' : 'Confirmar y solicitar certificado →'}
              </button>
            </form>

            <div>
              <Link href="/" style={{ color: colors.gray[600], fontSize: '0.9rem', textDecoration: 'none' }}>
                Volver al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PagoWebinarConfirmadoPage() {
  return (
    <Suspense fallback={null}>
      <PagoWebinarConfirmadoContent />
    </Suspense>
  );
}
