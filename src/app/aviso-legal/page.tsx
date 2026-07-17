'use client';

import React from 'react';
import Link from 'next/link';

export default function AvisoLegalPage() {
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
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
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
            Aviso Legal
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
            <p style={{ marginBottom: spacing.md }}>
              SmartChatix Academy es una entidad de formación independiente. Los nombres ANSYS, Ansys CFX, Ansys Fluent, Ansys Mechanical, Ansys Rocky, AFT Fathom, CFturbo, SolidWorks, SpaceClaim, Discovery y otros productos o herramientas mencionadas en esta página se utilizan únicamente con fines descriptivos, educativos y referenciales para identificar softwares, metodologías o tecnologías estudiadas durante los cursos.
            </p>

            <p style={{ marginBottom: spacing.md }}>
              SmartChatix Academy no es representante, distribuidor, partner oficial, centro autorizado de entrenamiento ni entidad certificadora de dichas marcas, salvo que se indique expresamente lo contrario mediante autorización formal.
            </p>

            <p style={{ marginBottom: spacing.md }}>
              Los certificados emitidos por SmartChatix Academy corresponden exclusivamente a la participación o aprobación de nuestros cursos y programas internos. Dichos certificados no constituyen certificaciones oficiales emitidas por ANSYS, Applied Flow Technology, CFturbo GmbH, Dassault Systèmes ni por ningún otro fabricante o titular de software.
            </p>

            <p style={{ marginBottom: spacing.md }}>
              Todas las marcas, nombres comerciales, logotipos, productos y servicios mencionados pertenecen a sus respectivos propietarios. Su mención no implica patrocinio, afiliación, respaldo, autorización ni relación comercial directa con SmartChatix Academy.
            </p>

            <p style={{ marginBottom: 0 }}>
              El uso de cualquier software durante clases, demostraciones o ejercicios estará sujeto a las condiciones de licencia correspondientes de cada fabricante.
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
              <strong>Última actualización:</strong> Junio 2026
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

      {/* FOOTER */}
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
