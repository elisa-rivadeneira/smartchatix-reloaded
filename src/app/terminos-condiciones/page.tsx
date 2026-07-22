'use client';

import React from 'react';
import Link from 'next/link';

export default function TerminosCondicionesPage() {
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
            Términos y Condiciones de Uso
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
            <p style={{ marginBottom: spacing.md, fontStyle: 'italic', color: colors.gray[600] }}>
              <strong>Última actualización:</strong> Julio de 2026
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              1. Titular del servicio
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix es una plataforma digital operada por:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li><strong>Titular:</strong> Elisa Rivadeneira Quiroz</li>
              <li><strong>RUC:</strong> 10405810404</li>
              <li><strong>Correo de contacto:</strong> <a href="mailto:erivadeneiraq@gmail.com" style={{ color: colors.secondary }}>erivadeneiraq@gmail.com</a></li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              Al acceder o utilizar SmartChatix, el usuario acepta íntegramente estos Términos y Condiciones.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              2. Descripción del servicio
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              SmartChatix ofrece servicios digitales que pueden incluir, entre otros:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Plataforma SaaS basada en Inteligencia Artificial.</li>
              <li>Cursos virtuales.</li>
              <li>Capacitaciones.</li>
              <li>Implementación de soluciones tecnológicas.</li>
              <li>Consultoría.</li>
              <li>Automatización de procesos.</li>
              <li>Otros productos y servicios digitales que puedan incorporarse en el futuro.</li>
            </ul>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              3. Registro de usuarios
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Para acceder a determinadas funcionalidades, el usuario podrá crear una cuenta proporcionando información veraz y actualizada.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              4. Planes y pagos
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              SmartChatix podrá ofrecer:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Suscripciones mensuales.</li>
              <li>Suscripciones anuales.</li>
              <li>Cursos digitales.</li>
              <li>Servicios profesionales.</li>
              <li>Otros productos digitales.</li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              Todos los precios se muestran en la moneda indicada durante el proceso de compra.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              5. Cancelación de suscripciones
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              El usuario puede cancelar su suscripción en cualquier momento.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              La cancelación impedirá futuras renovaciones, pero no genera devolución del período ya pagado, salvo los casos establecidos en la Política de Cambios y Reembolsos.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              6. Uso permitido
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              El usuario se compromete a utilizar la plataforma de manera responsable.
            </p>
            <p style={{ marginBottom: spacing.sm }}>
              Queda prohibido:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Compartir cuentas.</li>
              <li>Intentar vulnerar la seguridad del sistema.</li>
              <li>Copiar o distribuir contenidos sin autorización.</li>
              <li>Utilizar la plataforma con fines ilícitos.</li>
              <li>Realizar ingeniería inversa sobre el software.</li>
            </ul>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              7. Inteligencia Artificial
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix utiliza tecnologías de Inteligencia Artificial para asistir a los usuarios.
            </p>
            <p style={{ marginBottom: spacing.sm }}>
              Las respuestas generadas:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>tienen carácter informativo y educativo;</li>
              <li>pueden contener errores u omisiones;</li>
              <li>no constituyen asesoría legal, médica, financiera, tributaria ni profesional.</li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              El usuario es responsable de validar cualquier información antes de tomar decisiones importantes.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              8. Propiedad intelectual
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Todo el software, diseño, logotipos, nombre comercial, documentación, contenidos, imágenes y demás elementos de SmartChatix son propiedad de su titular o se utilizan conforme a las licencias correspondientes.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              No está permitida su reproducción, modificación o distribución sin autorización previa.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              9. Disponibilidad del servicio
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix procura mantener la plataforma disponible de forma continua. No obstante, podrán realizarse mantenimientos, actualizaciones o mejoras que impliquen interrupciones temporales del servicio.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              10. Limitación de responsabilidad
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix no garantiza que la plataforma esté libre de errores ni que satisfaga todas las necesidades particulares de cada usuario.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              En ningún caso será responsable por daños indirectos, pérdida de beneficios, pérdida de información o decisiones adoptadas exclusivamente sobre la base de respuestas generadas por Inteligencia Artificial.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              11. Modificaciones
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix podrá actualizar estos Términos y Condiciones cuando resulte necesario. Las modificaciones serán publicadas en esta misma página.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              12. Legislación aplicable
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Estos términos se rigen por las leyes de la República del Perú.
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
              <strong>Última actualización:</strong> Julio 2026
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
