'use client';

import React from 'react';

export default function DesignSystemPage() {
  // DESIGN SYSTEM - Pilares del diseño aplicados

  // 1. COLOR PALETTE - MÁS CONTRASTE y significado
  const colors = {
    primary: '#1D4ED8',      // Azul más intenso para mayor contraste
    secondary: '#047857',    // Verde más profundo
    accent: '#B91C1C',       // Rojo más intenso
    dark: '#0F172A',         // Azul muy oscuro para máximo contraste
    neutral: {
      900: '#0F172A',        // Negro azulado para títulos
      800: '#1E293B',        // Gris muy oscuro
      700: '#334155',        // Texto secundario más contrastado
      500: '#64748B',        // Texto descriptivo
      300: '#CBD5E1',        // Bordes
      100: '#F1F5F9',        // Fondos sutiles
      50: '#F8FAFC'          // Fondo principal
    }
  };

  // 2. TYPOGRAPHY SCALE - Jerarquía clara
  const typography = {
    h1: { fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em' },
    h2: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.01em' },
    h3: { fontSize: '1.875rem', fontWeight: '600', lineHeight: '1.3' },
    h4: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.7' },
    small: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.5' }
  };

  // 3. SPACING SCALE - Consistencia visual
  const spacing = {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    xxl: '4rem',     // 64px
    xxxl: '6rem'     // 96px
  };

  // 4. COMPONENT STYLES - Repetición y consistencia
  const components = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.md}`
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${colors.neutral[300]}`
    },
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: 'white',
        padding: `${spacing.sm} ${spacing.lg}`,
        borderRadius: '8px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary,
        padding: `${spacing.sm} ${spacing.lg}`,
        borderRadius: '8px',
        fontWeight: '600',
        border: `2px solid ${colors.primary}`,
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
      }
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: colors.neutral[50],
      color: colors.neutral[900],
      lineHeight: '1.6'
    }}>

      {/* 1. JERARQUÍA VISUAL - Header con contraste fuerte */}
      <header style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.neutral[800]} 100%)`,
        color: 'white',
        padding: `${spacing.xxxl} 0`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Imagen de fondo profesional - CFD simulation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.15',
          zIndex: 1
        }}></div>

        {/* Overlay gradient para mejor legibilidad */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.dark}E6 0%, ${colors.neutral[800]}CC 100%)`,
          zIndex: 2
        }}></div>

        <div style={{...components.container, position: 'relative', zIndex: 3}}>
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            {/* Badge de credibilidad */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: colors.secondary,
              color: 'white',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '25px',
              fontSize: typography.small.fontSize,
              fontWeight: '700',
              marginBottom: spacing.lg,
              boxShadow: '0 4px 12px rgba(4, 120, 87, 0.4)'
            }}>
              🏆 CERTIFICADO INTERNACIONALMENTE • ISO 9001
            </div>

            {/* Título principal - MÁXIMO CONTRASTE */}
            <h1 style={{
              ...typography.h1,
              fontSize: '4.5rem',
              color: 'white',
              marginBottom: spacing.md,
              fontFamily: 'Poppins, system-ui, sans-serif',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              fontWeight: '900'
            }}>
              SmartChatix
            </h1>

            {/* Subtítulo con contraste mejorado */}
            <p style={{
              ...typography.body,
              fontSize: '1.375rem',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: spacing.lg,
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              La academia líder en ingeniería CFD, bombas centrífugas y simulación industrial
            </p>

            {/* Línea divisoria con brillo */}
            <div style={{
              width: '120px',
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              margin: '0 auto',
              borderRadius: '2px',
              boxShadow: `0 0 20px ${colors.primary}66`
            }}></div>
          </div>
        </div>
      </header>

      {/* 2. PROXIMIDAD Y ALINEACIÓN - Sección hero */}
      <section style={{
        padding: `${spacing.xxxl} 0`,
        backgroundColor: colors.neutral[50]
      }}>
        <div style={components.container}>
          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Badge agrupado con título (proximidad) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: colors.secondary,
              color: 'white',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '20px',
              fontSize: typography.small.fontSize,
              fontWeight: '600',
              marginBottom: spacing.lg
            }}>
              ⭐ #1 en Latinoamérica • +15,000 ingenieros formados
            </div>

            {/* Título principal con jerarquía clara */}
            <h2 style={{
              ...typography.h2,
              color: colors.neutral[900],
              marginBottom: spacing.lg,
              fontFamily: 'Poppins, system-ui, sans-serif'
            }}>
              Convierte tu pasión por la{' '}
              <span style={{ color: colors.primary }}>ingeniería</span> en una{' '}
              <span style={{ color: colors.secondary }}>carrera extraordinaria</span>
            </h2>

            {/* Texto descriptivo - jerarquía terciaria */}
            <p style={{
              ...typography.body,
              color: colors.neutral[700],
              marginBottom: spacing.xl
            }}>
              Únete a los <strong style={{ color: colors.primary }}>ingenieros más exitosos de Latinoamérica</strong> que dominan
              CFD, bombas centrífugas, turbomáquinas y simulación industrial con
              <strong style={{ color: colors.secondary }}> proyectos reales de empresas Fortune 500</strong>.
            </p>

            {/* CTAs con contraste y espaciado */}
            <div style={{
              display: 'flex',
              gap: spacing.md,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                style={components.button.primary}
                onMouseOver={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = '#1D4ED8';
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.3)';
                }}
                onMouseOut={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = colors.primary;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                🚀 Explorar Programas
              </button>

              <button
                style={components.button.secondary}
                onMouseOver={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = colors.primary;
                  target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = colors.primary;
                }}
              >
                📋 Ver Plan de Estudios
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REPETICIÓN Y CONTRASTE - Sección programa destacado */}
      <section style={{
        padding: `${spacing.xxxl} 0`,
        backgroundColor: 'white'
      }}>
        <div style={components.container}>
          {/* Encabezado de sección */}
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: colors.accent,
              color: 'white',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '20px',
              fontSize: typography.small.fontSize,
              fontWeight: '700',
              marginBottom: spacing.lg
            }}>
              🔥 PROGRAMA ESTRELLA • MÁS VENDIDO
            </div>

            <h3 style={{
              ...typography.h2,
              color: colors.neutral[900],
              marginBottom: spacing.md,
              fontFamily: 'Poppins, system-ui, sans-serif'
            }}>
              <span style={{ color: colors.primary }}>SmartChatix</span>{' '}
              <span style={{ color: colors.neutral[900] }}>PUMP ENGINEER</span>
              <br />
              <span style={{
                ...typography.h4,
                color: colors.neutral[700],
                fontWeight: '400'
              }}>
                PROGRAM
              </span>
            </h3>

            <p style={{
              ...typography.body,
              color: colors.neutral[700],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              El único programa en Latinoamérica que combina{' '}
              <strong style={{ color: colors.primary }}>teoría de élite</strong> con{' '}
              <strong style={{ color: colors.secondary }}>proyectos reales de la industria</strong>
            </p>
          </div>

          {/* Grid con imágenes profesionales y mayor contraste */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: spacing.xl
          }}>
            {/* Tarjeta visual - Imagen de bomba centrífuga */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              {/* Imagen profesional de bomba */}
              <div style={{
                height: '200px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1566936382448-bb7e9e5abc16?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  backgroundColor: colors.accent,
                  color: 'white',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  🔥 MÁS VENDIDO
                </div>
              </div>

              <div style={{ padding: spacing.xl }}>
                <h4 style={{
                  ...typography.h4,
                  color: colors.neutral[900],
                  marginBottom: spacing.md
                }}>
                  Bombas Centrífugas
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: colors.neutral[700]
                }}>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.secondary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    Selección y dimensionamiento
                  </li>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.secondary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    Curvas características H-Q
                  </li>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.secondary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    Análisis de cavitación NPSH
                  </li>
                </ul>
              </div>
            </div>

            {/* Tarjeta visual - Simulación CFD */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              {/* Imagen profesional de CFD */}
              <div style={{
                height: '200px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  backgroundColor: colors.primary,
                  color: 'white',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  🎯 ESPECIALIZACIÓN
                </div>
              </div>

              <div style={{ padding: spacing.xl }}>
                <h4 style={{
                  ...typography.h4,
                  color: colors.neutral[900],
                  marginBottom: spacing.md
                }}>
                  Simulación CFD
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: colors.neutral[700]
                }}>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.primary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    ANSYS CFX & Fluent
                  </li>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.primary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    Turbomáquinas avanzadas
                  </li>
                  <li style={{ marginBottom: spacing.sm, display: 'flex', alignItems: 'center' }}>
                    <span style={{color: colors.primary, marginRight: spacing.xs, fontSize: '1.2rem'}}>✅</span>
                    Proyectos industriales reales
                  </li>
                </ul>
              </div>
            </div>

            {/* Tarjeta de estadísticas con mayor contraste */}
            <div style={{
              ...components.card,
              padding: spacing.xl,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.neutral[800]} 100%)`,
              color: 'white',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: spacing.sm
              }}>
                🏆
              </div>
              <h4 style={{
                ...typography.h4,
                color: 'white',
                marginBottom: spacing.md
              }}>
                Programa Premium
              </h4>
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: spacing.sm
              }}>
                165h
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                marginBottom: spacing.lg,
                fontSize: '1.1rem'
              }}>
                de contenido especializado
              </p>
              <button style={{
                ...components.button.primary,
                width: '100%',
                backgroundColor: colors.secondary,
                fontSize: '1.1rem',
                padding: `${spacing.md} ${spacing.lg}`,
                fontWeight: '700'
              }}>
                🚀 Inscribirme Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO COMPLETO DE CURSOS */}
      <section style={{
        padding: `${spacing.xxxl} 0`,
        backgroundColor: colors.neutral[100]
      }}>
        <div style={components.container}>
          {/* Encabezado */}
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: colors.primary,
              color: 'white',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '25px',
              fontSize: typography.small.fontSize,
              fontWeight: '700',
              marginBottom: spacing.lg
            }}>
              📚 CATÁLOGO COMPLETO • 15 ESPECIALIZACIONES
            </div>

            <h3 style={{
              ...typography.h2,
              color: colors.neutral[900],
              marginBottom: spacing.md,
              fontFamily: 'Poppins, system-ui, sans-serif'
            }}>
              Todos Nuestros Programas de Ingeniería
            </h3>

            <p style={{
              ...typography.body,
              color: colors.neutral[700],
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Desde fundamentos hasta especialización avanzada en CFD, bombas, turbomáquinas y simulación industrial
            </p>
          </div>

          {/* Grid de todos los cursos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg
          }}>

            {/* Curso 1: Pump Engineer Program */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white',
              border: `3px solid ${colors.accent}`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: colors.accent,
                color: 'white',
                padding: `${spacing.xs} ${spacing.sm}`,
                borderRadius: '0 0 0 15px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                🏆 PREMIUM
              </div>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1566936382448-bb7e9e5abc16?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  SmartChatix Pump Engineer Program
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Programa completo en bombas centrífugas, selección, simulación CFD y turbomáquinas
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.accent}}>165 horas</span>
                  <button style={{...components.button.primary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 2: CFD con ANSYS */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  CFD con ANSYS Fluent y CFX
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Simulación de fluidos computacional para turbomáquinas y aplicaciones industriales
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>95 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 3: Bombas Centrífugas */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Bombas Centrífugas Industriales
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Selección, operación y mantenimiento de sistemas de bombeo industrial
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>80 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 4: Redes Hidráulicas */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Redes Hidráulicas con AFT Fathom
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Diseño y análisis de sistemas de tuberías y redes de distribución
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>60 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 5: Turbomáquinas */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Diseño de Turbomáquinas
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Principios de diseño aerodinámico y termodinámico de turbinas y compresores
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>75 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 6: Python para Ingenieros */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Python para Ingenieros
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Programación aplicada a cálculos de ingeniería y automatización de procesos
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>50 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 7: MATLAB Avanzado */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  MATLAB Avanzado para CFD
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Modelado matemático y simulación numérica con MATLAB y Simulink
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>65 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 8: Mecánica de Fluidos */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Mecánica de Fluidos Avanzada
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Fundamentos teóricos y aplicaciones prácticas en ingeniería de fluidos
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>70 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 9: HVAC Systems */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2076")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Sistemas HVAC y Climatización
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Diseño de sistemas de calefacción, ventilación y aire acondicionado
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>55 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 10: Energías Renovables */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  CFD en Energías Renovables
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Simulación de turbinas eólicas y sistemas de energía sostenible
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>45 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 11: Transferencia de Calor */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2125")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Transferencia de Calor y Masa
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Fenómenos de transporte térmico en equipos industriales
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>60 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 12: Minería y CFD */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  CFD Aplicado a Minería
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Ventilación de minas y transporte de material particulado
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>85 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 13: Motores de Combustión */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2032")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  CFD en Motores de Combustión
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Simulación de combustión y flujos internos en motores
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>90 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 14: OpenFOAM */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2125")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  CFD con OpenFOAM
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Simulación de código abierto para aplicaciones avanzadas de CFD
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>75 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Curso 15: Automatización Industrial */}
            <div style={{
              ...components.card,
              overflow: 'hidden',
              background: 'white'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2073")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ padding: spacing.lg }}>
                <h4 style={{...typography.h4, color: colors.neutral[900], marginBottom: spacing.sm, fontSize: '1.25rem'}}>
                  Automatización Industrial
                </h4>
                <p style={{color: colors.neutral[700], fontSize: '0.9rem', marginBottom: spacing.md}}>
                  Control de procesos y sistemas automatizados en la industria
                </p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '700', color: colors.primary}}>40 horas</span>
                  <button style={{...components.button.secondary, fontSize: '0.875rem', padding: `${spacing.xs} ${spacing.md}`}}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* CTA Section */}
          <div style={{
            textAlign: 'center',
            marginTop: spacing.xxxl,
            padding: spacing.xl,
            backgroundColor: colors.dark,
            borderRadius: '20px',
            color: 'white'
          }}>
            <h4 style={{
              ...typography.h3,
              color: 'white',
              marginBottom: spacing.md
            }}>
              ¿No sabes cuál elegir?
            </h4>
            <p style={{
              ...typography.body,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: spacing.lg,
              maxWidth: '600px',
              margin: `0 auto ${spacing.lg} auto`
            }}>
              Nuestros asesores académicos te ayudan a elegir el programa perfecto según tu experiencia y objetivos profesionales
            </p>
            <button style={{
              ...components.button.primary,
              backgroundColor: colors.secondary,
              fontSize: '1.125rem',
              padding: `${spacing.md} ${spacing.xl}`,
              fontWeight: '700'
            }}>
              📞 Asesoría Gratuita
            </button>
          </div>
        </div>
      </section>

      {/* 4. ESPACIO EN BLANCO - Footer limpio */}
      <footer style={{
        backgroundColor: colors.neutral[900],
        color: colors.neutral[300],
        padding: `${spacing.xxl} 0`,
        textAlign: 'center'
      }}>
        <div style={components.container}>
          <h4 style={{
            ...typography.h4,
            color: 'white',
            marginBottom: spacing.md
          }}>
            SmartChatix
          </h4>
          <p style={{
            ...typography.small,
            color: colors.neutral[500]
          }}>
            © 2025 SmartChatix. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}