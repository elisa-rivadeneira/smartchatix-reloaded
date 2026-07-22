'use client';

import React from 'react';
import Link from 'next/link';

export default function PoliticaCambiosReembolsosPage() {
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

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.gray[50],
      minHeight: '100vh'
    }}>
      <header style={{
        backgroundColor: colors.white,
        borderBottom: `2px solid ${colors.primary}`,
        padding: `${spacing.sm} 0`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: `0 ${spacing.md}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/logo_samartchatix.png"
              alt="SmartChatix"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          <Link href="/" style={{
            textDecoration: 'none',
            color: colors.gray[600],
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: `${spacing.xl} ${spacing.md}`
      }}>
        <div style={{
          backgroundColor: colors.white,
          padding: `${spacing.xl}`,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: colors.primary,
            marginBottom: spacing.sm,
            textAlign: 'center'
          }}>
            Política de Cambios y Reembolsos
          </h1>

          <div style={{
            width: '80px',
            height: '4px',
            backgroundColor: colors.accent,
            margin: `0 auto ${spacing.lg}`
          }}></div>

          <div style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            color: colors.gray[700]
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Cursos digitales
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Los cursos comercializados por SmartChatix corresponden a contenidos digitales de acceso inmediato.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              Una vez habilitado el acceso al curso, no procede la devolución del importe pagado, salvo que exista un error atribuible a SmartChatix o una obligación legal aplicable.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Suscripciones
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Las suscripciones permiten el acceso a los servicios durante el período contratado.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              El usuario puede cancelar su suscripción en cualquier momento.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              La cancelación evita futuros cobros, pero no genera devolución del período ya pagado.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Consultorías e implementaciones
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Si el servicio aún no ha iniciado, el usuario podrá solicitar la anulación y la devolución correspondiente, previa evaluación.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              Si la prestación del servicio ya comenzó, el importe podrá no ser reembolsable total o parcialmente, dependiendo del avance ejecutado.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Cobros incorrectos
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              Si el usuario identifica:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>un cobro duplicado;</li>
              <li>un importe incorrecto;</li>
              <li>un error atribuible al sistema de pago;</li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              podrá solicitar la revisión escribiendo a:
            </p>
            <p style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              <a href="mailto:erivadeneiraq@gmail.com" style={{ color: colors.secondary }}>erivadeneiraq@gmail.com</a>
            </p>
            <p style={{ marginBottom: spacing.md }}>
              Luego de verificar el caso, SmartChatix gestionará el reembolso correspondiente cuando proceda.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Tiempo de procesamiento
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Los reembolsos aprobados se procesarán utilizando el mismo medio de pago empleado en la compra, dentro de los plazos establecidos por la entidad financiera correspondiente.
            </p>
          </div>

          <div style={{
            marginTop: spacing.xl,
            padding: spacing.md,
            backgroundColor: colors.gray[50],
            borderRadius: '8px',
            borderLeft: `4px solid ${colors.primary}`
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: colors.gray[600],
              lineHeight: '1.6'
            }}>
              Para cualquier consulta o solicitud relacionada con cambios o reembolsos, contáctanos en <a href="mailto:erivadeneiraq@gmail.com" style={{ color: colors.secondary }}>erivadeneiraq@gmail.com</a>
            </p>
          </div>

          <div style={{
            marginTop: spacing.lg,
            textAlign: 'center'
          }}>
            <Link href="/" style={{
              display: 'inline-block',
              backgroundColor: colors.primary,
              color: colors.white,
              padding: `${spacing.sm} ${spacing.lg}`,
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <footer style={{
        backgroundColor: colors.gray[700],
        color: colors.white,
        padding: `${spacing.lg} ${spacing.md}`,
        textAlign: 'center',
        marginTop: spacing.xl
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.7)'
        }}>
          © 2025 SmartChatix. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
