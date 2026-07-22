'use client';

import React from 'react';
import Link from 'next/link';

export default function PoliticaPrivacidadPage() {
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
            Política de Privacidad
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

            <p style={{ marginBottom: spacing.md }}>
              En SmartChatix respetamos la privacidad de nuestros usuarios y tratamos sus datos personales de manera responsable.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Información que recopilamos
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              Podemos recopilar:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Nombre.</li>
              <li>Correo electrónico.</li>
              <li>Información de facturación.</li>
              <li>Información de la cuenta.</li>
              <li>Conversaciones realizadas dentro de la plataforma.</li>
              <li>Archivos cargados voluntariamente por el usuario.</li>
              <li>Información técnica del dispositivo y navegación.</li>
            </ul>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Finalidad
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              Los datos podrán utilizarse para:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Crear y administrar cuentas.</li>
              <li>Procesar pagos.</li>
              <li>Brindar soporte técnico.</li>
              <li>Emitir comprobantes cuando corresponda.</li>
              <li>Mejorar nuestros servicios.</li>
              <li>Desarrollar nuevas funcionalidades.</li>
              <li>Enviar comunicaciones relacionadas con el servicio.</li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              No comercializamos los datos personales de nuestros usuarios.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Uso de Inteligencia Artificial
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Determinadas funcionalidades utilizan servicios de Inteligencia Artificial proporcionados por terceros especializados.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              Cuando el usuario utiliza dichas funciones, parte de la información podrá ser procesada por dichos proveedores exclusivamente para generar las respuestas solicitadas.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Seguridad
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Aplicamos medidas técnicas y organizativas razonables para proteger la información frente a accesos no autorizados, pérdida o alteración.
            </p>
            <p style={{ marginBottom: spacing.md }}>
              No obstante, ningún sistema conectado a Internet puede garantizar seguridad absoluta.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Conservación
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Los datos serán conservados mientras exista una relación comercial o durante el tiempo necesario para cumplir obligaciones legales.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Derechos del usuario
            </h2>
            <p style={{ marginBottom: spacing.sm }}>
              El usuario podrá solicitar:
            </p>
            <ul style={{ marginBottom: spacing.md, paddingLeft: '1.5rem' }}>
              <li>Acceso a sus datos.</li>
              <li>Rectificación.</li>
              <li>Actualización.</li>
              <li>Eliminación cuando corresponda.</li>
              <li>Atención de consultas relacionadas con el tratamiento de su información.</li>
            </ul>
            <p style={{ marginBottom: spacing.md }}>
              Las solicitudes podrán enviarse a:
            </p>
            <p style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              <a href="mailto:erivadeneiraq@gmail.com" style={{ color: colors.secondary }}>erivadeneiraq@gmail.com</a>
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Cookies
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix podrá utilizar cookies y tecnologías similares para mejorar la experiencia del usuario, mantener sesiones activas y obtener estadísticas de uso.
            </p>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.primary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm
            }}>
              Cambios
            </h2>
            <p style={{ marginBottom: spacing.md }}>
              Esta política podrá actualizarse en cualquier momento mediante publicación en esta página.
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
