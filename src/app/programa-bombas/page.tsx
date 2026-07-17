'use client';

import React from 'react';
import Link from 'next/link';
import CertificacionBadge from '@/components/CertificacionBadge';
import Footer from '@/components/Footer';
import { getCourses } from '@/data/courses';

export default function ProgramaBombasPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const allCourses = getCourses();

  const colors = {
    primary: '#003366',
    secondary: '#0066CC',
    accent: '#FF6600',
    success: '#009900',
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
    xs: '0.4rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '2.5rem'
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.white,
      color: colors.gray[700],
      overflowX: 'hidden'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-hamburger {
            display: flex !important;
            position: fixed !important;
            top: 15px !important;
            right: 15px !important;
            z-index: 99999 !important;
            width: 45px !important;
            height: 45px !important;
          }
          .mobile-menu-overlay { display: block !important; }
          .mobile-back-btn {
            display: none !important;
          }
          .desktop-sticky { position: relative !important; }
          .mobile-header-container {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
          }
          .mobile-grid-1 {
            grid-template-columns: 1fr !important;
          }
          .mobile-icon-small {
            font-size: 1.2rem !important;
            margin-bottom: 0.2rem !important;
          }
          .mobile-text-tiny {
            font-size: 0.5rem !important;
          }
          .mobile-benefits-grid {
            gap: 0.3rem !important;
          }
          .mobile-doubts-title {
            font-size: 0.72rem !important;
          }
          .mobile-doubts-text {
            font-size: 0.6rem !important;
          }
          .mobile-doubts-btn {
            max-width: 150px !important;
          }
          .mobile-hide-badge {
            display: none !important;
          }
        }
      `}</style>
      <header className="desktop-sticky" style={{
        backgroundColor: colors.white,
        borderBottom: `2px solid ${colors.primary}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="mobile-header-container" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: `${spacing.sm} ${spacing.lg}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" className="mobile-back-btn" style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: colors.primary,
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver
          </Link>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/logo_samartchatix.png"
              alt="SmartChatix"
              style={{
                height: '65px',
                width: 'auto'
              }}
            />
          </Link>

          <div className="mobile-hidden" style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
            <Link href="/" style={{
              textDecoration: 'none',
              color: colors.gray[700],
              fontWeight: '600',
              fontSize: '0.8rem',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '6px',
              border: `2px solid transparent`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `2px solid ${colors.primary}`;
              e.currentTarget.style.backgroundColor = colors.gray[50];
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.gray[700];
            }}>
              Inicio
            </Link>
            <a href="#modulos" style={{
              textDecoration: 'none',
              color: colors.gray[700],
              fontWeight: '600',
              fontSize: '0.8rem',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '6px',
              border: `2px solid transparent`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `2px solid ${colors.primary}`;
              e.currentTarget.style.backgroundColor = colors.gray[50];
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.gray[700];
            }}>
              Contenido
            </a>
            <a href="#precios" style={{
              textDecoration: 'none',
              color: colors.gray[700],
              fontWeight: '600',
              fontSize: '0.8rem',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '6px',
              border: `2px solid transparent`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `2px solid ${colors.primary}`;
              e.currentTarget.style.backgroundColor = colors.gray[50];
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.gray[700];
            }}>
              Precios
            </a>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: colors.accent,
                color: colors.white,
                padding: `${spacing.xs} ${spacing.lg}`,
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.8rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              INSCRÍBETE AHORA
            </button>
          </div>
        </div>
      </header>

      <section style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%,rgb(0, 7, 14) 100%)`,
        color: colors.white,
        padding: `${spacing.xxl} ${spacing.lg}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/ondas_swirl.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.08,
          pointerEvents: 'none'
        }}></div>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.xl,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              backgroundColor: colors.accent,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              marginBottom: spacing.md
            }}>
              PROGRAMA PROFESIONAL
            </div>

            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: spacing.md,
              color: colors.white
            }}>
              Pump Engineer Program
            </h1>

            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: spacing.lg,
              color: 'rgba(255,255,255,0.95)'
            }}>
              Programa especializado en selección, análisis hidráulico, simulación CFD y diagnóstico de bombas centrífugas para minería e industria.
            </p>

            <div style={{
              display: 'flex',
              gap: spacing.md,
              marginBottom: spacing.lg,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>40h</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Duración total</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>9</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Módulos</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="m15 9 6-6"/>
                  <path d="m21 3-3 3"/>
                  <path d="M18 6l3-3"/>
                </svg>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Aplicado</div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: spacing.md,
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.2)',
              marginBottom: spacing.lg
            }}>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: spacing.sm
              }}>
                Certificación Profesional
              </h3>
              <p style={{
                fontSize: '0.8rem',
                lineHeight: '1.6',
                margin: 0,
                opacity: 0.95
              }}>
                Al finalizar obtendrás un <strong>Certificado Digital</strong> que avala tus competencias en selección de bombas, simulación CFD con ANSYS CFX, modelamiento con AFT Fathom y diagnóstico técnico
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-block',
                backgroundColor: colors.accent,
                color: colors.white,
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255,102,0,0.3)',
                marginBottom: spacing.sm
              }}
            >
              INSCRÍBETE AHORA →
            </button>

            <p style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Elige la modalidad en vivo o grabada y accede al aula virtual
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginLeft: '-5%'
          }}>
            <div className="mobile-hide-badge" style={{
              position: 'absolute',
              top: '-60px',
              right: '-5%',
              zIndex: 2
            }}>
              <CertificacionBadge />
            </div>
            <img
              src="/images/bomba_estudio3.jpeg"
              alt="Bomba centrífuga"
              style={{
                width: '100%',
                maxWidth: '576px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            />
          </div>
        </div>
      </section>

      <section style={{
        backgroundColor: colors.white,
        padding: `${spacing.xxl} ${spacing.lg}`,
        borderTop: `4px solid ${colors.accent}`
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: spacing.xl
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.sm
            }}>
              ¿Qué aprenderás en este programa?
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: colors.gray[600],
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Domina herramientas profesionales y técnicas especializadas para destacar en la industria
            </p>
          </div>

          <div className="mobile-grid-1" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.md,
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              'Simulación CFD de bombas centrífugas con ANSYS CFX',
              'Análisis hidráulico de redes con AFT Fathom',
              'Selección técnica de bombas para minería e industria',
              'Diseño preliminar de turbomáquinas con CFturbo',
              'Diagnóstico de fallas, cavitación y vibración en sistemas de bombeo',
              'Curvas características, NPSH y punto de operación del sistema'
            ].map((text, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: spacing.md,
                padding: spacing.lg,
                backgroundColor: colors.gray[50],
                borderRadius: '8px',
                border: `2px solid ${colors.gray[200]}`,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  minWidth: '28px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.white,
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  ✓
                </div>
                <p style={{
                  fontSize: '0.85rem',
                  color: colors.gray[700],
                  lineHeight: '1.6',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modulos" style={{
        backgroundColor: colors.white,
        padding: `${spacing.xxl} ${spacing.lg}`
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: spacing.xl
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.sm
            }}>
              Plan de Estudios
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: colors.gray[600]
            }}>
              9 módulos especializados (40 horas) con enfoque 100% práctico
            </p>
          </div>

          <div className="mobile-grid-1" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing.lg
          }}>
            {[
              {
                num: 1,
                horas: '4h',
                title: 'Fundamentos de bombas centrífugas y componentes',
                topics: ['Clasificación de bombas centrífugas', 'Componentes principales y secundarios', 'Principios de funcionamiento']
              },
              {
                num: 2,
                horas: '4h',
                title: 'Curvas H-Q, eficiencia, potencia y punto de operación',
                topics: ['Curvas características H-Q', 'Eficiencia y potencia de bombas', 'Punto de operación del sistema', 'Leyes de afinidad']
              },
              {
                num: 3,
                horas: '4h',
                title: 'Pérdidas, curva del sistema, NPSH y cavitación',
                topics: ['Pérdidas de carga en tuberías', 'Curva del sistema hidráulico', 'NPSH disponible y requerido', 'Fenómeno de cavitación']
              },
              {
                num: 4,
                horas: '4h',
                title: 'Selección para minería, industria, agua limpia y lodos',
                topics: ['Criterios de selección técnica', 'Bombas para minería', 'Bombas para industria', 'Manejo de lodos y pulpas']
              },
              {
                num: 5,
                horas: '4h',
                title: 'Redes hidráulicas industriales con AFT Fathom',
                topics: ['Fundamentos de AFT Fathom', 'Modelamiento de redes de tuberías', 'Análisis de sistemas de bombeo', 'Optimización hidráulica']
              },
              {
                num: 6,
                horas: '6h',
                title: 'Simulación CFD de bombas con ANSYS CFX',
                topics: ['Introducción a CFD aplicado a bombas', 'Mallado y configuración de dominio', 'Condiciones de frontera', 'Post-procesamiento y análisis']
              },
              {
                num: 7,
                horas: '4h',
                title: 'Diseño preliminar de turbomáquinas con CFturbo',
                topics: ['Fundamentos de diseño de turbomáquinas', 'Uso de CFturbo', 'Generación de geometría', 'Criterios de diseño preliminar']
              },
              {
                num: 8,
                horas: '4h',
                title: 'Diagnóstico de fallas hidráulicas, vibración y cavitación',
                topics: ['Identificación de problemas operativos', 'Análisis de vibración', 'Diagnóstico de cavitación', 'Propuestas de mejora']
              },
              {
                num: 9,
                horas: '6h',
                title: 'Proyecto final aplicado',
                topics: ['Selección de bomba para caso real', 'Análisis de red hidráulica', 'Simulación CFD básica', 'Elaboración de informe técnico']
              }
            ].map((modulo) => (
              <div key={modulo.num} style={{
                backgroundColor: colors.gray[50],
                padding: spacing.md,
                borderRadius: '8px',
                border: `2px solid ${colors.gray[200]}`,
                position: 'relative',
                paddingLeft: '70px'
              }}>
                <div style={{
                  position: 'absolute',
                  left: spacing.md,
                  top: spacing.md,
                  backgroundColor: colors.primary,
                  color: colors.white,
                  width: '50px',
                  height: '50px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {modulo.num}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: spacing.md
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: 0,
                    flex: 1
                  }}>
                    {modulo.title}
                  </h3>
                  <div style={{
                    backgroundColor: colors.accent,
                    color: colors.white,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    marginLeft: spacing.sm
                  }}>
                    {modulo.horas}
                  </div>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.85rem',
                  color: colors.gray[700],
                  lineHeight: '1.6'
                }}>
                  {modulo.topics.map((topic, i) => (
                    <li key={i} style={{ marginBottom: spacing.xs }}>
                      ✓ {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        backgroundColor: colors.primary,
        color: colors.white,
        padding: `${spacing.xl} ${spacing.lg}`
      }}>
        <div className="mobile-benefits-grid" style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing.lg,
          textAlign: 'center'
        }}>
          {[
            { icon: '📹', text: 'Clases en Vivo + Grabaciones' },
            { icon: '📚', text: 'Material Descargable' },
            { icon: '📊', text: 'Plantillas de Cálculo' },
            { icon: '🎓', text: 'Certificado Digital' }
          ].map((item, i) => (
            <div key={i}>
              <div className="mobile-icon-small" style={{ fontSize: '2.5rem', marginBottom: spacing.sm }}>{item.icon}</div>
              <div className="mobile-text-tiny" style={{ fontSize: '0.95rem', fontWeight: '600' }}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="precios" style={{
        backgroundColor: colors.gray[50],
        padding: `${spacing.xxl} ${spacing.lg}`
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: spacing.xl
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.sm
            }}>
              Inversión en tu Desarrollo Profesional
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: colors.gray[600]
            }}>
              Elige la modalidad que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="mobile-grid-1" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing.xl,
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: colors.white,
              padding: spacing.md,
              borderRadius: '12px',
              border: `4px solid ${colors.accent}`,
              position: 'relative',
              boxShadow: '0 8px 24px rgba(255,102,0,0.15)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: colors.accent,
                color: colors.white,
                padding: `${spacing.xs} ${spacing.lg}`,
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '700',
                letterSpacing: '1px'
              }}>
                ⭐ MÁS ELEGIDA
              </div>

              <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: spacing.sm,
                  marginTop: spacing.sm
                }}>
                  Modalidad EN VIVO
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: colors.gray[600],
                  lineHeight: '1.6'
                }}>
                  Participa en sesiones en tiempo real, resuelve dudas al instante y accede a grabaciones en el aula virtual
                </p>
              </div>

              <div style={{
                backgroundColor: colors.gray[50],
                padding: spacing.sm,
                borderRadius: '8px',
                marginBottom: spacing.sm
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: colors.accent,
                  textAlign: 'center',
                  marginBottom: spacing.xs
                }}>
                  S/ 999
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: colors.gray[500],
                  marginBottom: spacing.xs
                }}>
                  Precio promocional inicial
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: colors.gray[600]
                }}>
                  Precio regular: S/ 1,499
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: spacing.sm,
                fontSize: '0.85rem',
                lineHeight: '1.8'
              }}>
                <li>✓ 40 horas de clases en vivo</li>
                <li>✓ Grabaciones disponibles</li>
                <li>✓ Interacción con instructores</li>
                <li>✓ Material descargable</li>
                <li>✓ Certificado digital</li>
              </ul>

              <div style={{
                backgroundColor: '#E3F2FD',
                color: colors.primary,
                padding: spacing.sm,
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: spacing.sm,
                lineHeight: '1.6'
              }}>
                📅 Inicio: Martes 08 de Septiembre<br/>
                🕐 Horario: Martes y Jueves de 8:00 PM a 10:00 PM
              </div>

              <Link href="/inscripcion-vivo" style={{
                display: 'block',
                backgroundColor: colors.accent,
                color: colors.white,
                textAlign: 'center',
                padding: `${spacing.md} 0`,
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '700',
                textDecoration: 'none'
              }}>
                INSCRIBIRME AHORA →
              </Link>
            </div>

            <div style={{
              backgroundColor: colors.white,
              padding: spacing.md,
              borderRadius: '12px',
              border: `2px solid ${colors.gray[300]}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: spacing.sm,
                  marginTop: spacing.sm
                }}>
                  Modalidad GRABADA
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: colors.gray[600],
                  lineHeight: '1.6'
                }}>
                  Acceso inmediato al aula virtual, aprende a tu propio ritmo desde cualquier lugar
                </p>
              </div>

              <div style={{
                backgroundColor: colors.gray[50],
                padding: spacing.sm,
                borderRadius: '8px',
                marginBottom: spacing.sm
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: colors.primary,
                  textAlign: 'center',
                  marginBottom: spacing.xs
                }}>
                  S/ 699
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: colors.gray[500],
                  marginBottom: spacing.xs
                }}>
                  Precio promocional
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: colors.gray[600]
                }}>
                  Precio regular: S/ 899
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: spacing.sm,
                fontSize: '0.85rem',
                lineHeight: '1.8'
              }}>
                <li>✓ Acceso inmediato 24/7</li>
                <li>✓ Aprende a tu ritmo</li>
                <li>✓ 40 horas de contenido</li>
                <li>✓ Material descargable</li>
                <li>✓ Certificado digital</li>
              </ul>

              <div style={{
                backgroundColor: '#E3F2FD',
                color: colors.primary,
                padding: spacing.sm,
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: spacing.sm,
                lineHeight: '1.6',
                textAlign: 'center'
              }}>
                💡 Ideal si necesitas flexibilidad total y aprender a tu propio ritmo
              </div>

              <Link href="/inscripcion-vivo" style={{
                display: 'block',
                backgroundColor: colors.primary,
                color: colors.white,
                textAlign: 'center',
                padding: `${spacing.md} 0`,
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '700',
                textDecoration: 'none'
              }}>
                COMPRAR AHORA →
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section style={{
        backgroundColor: colors.gray[100],
        padding: `${spacing.md} ${spacing.md}`,
        width: '100%'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
         
          <h3 className="mobile-doubts-title" style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: colors.gray[700],
            marginBottom: spacing.xs
          }}>
           ¿Tienes dudas antes de inscribirte?
          </h3>
          <p className="mobile-doubts-text" style={{
            fontSize: '1rem',
            color: colors.gray[600],
            marginBottom: spacing.md
          }}>
            Habla con un asesor y elige la modalidad ideal para ti.
          </p>
          <a href="https://wa.me/51967717179" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/contactar_whatsapp.png"
              alt="Contactar por WhatsApp"
              className="mobile-doubts-btn"
              style={{
                maxWidth: '250px',
                height: 'auto',
                cursor: 'pointer'
              }}
            />
          </a>
        </div>
      </section>

      {/* Carrusel de Cursos Relacionados */}
      <section style={{
        backgroundColor: colors.white,
        padding: `${spacing.xxl} ${spacing.lg}`,
        borderTop: `1px solid ${colors.gray[200]}`
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.sm
            }}>
              Explora nuestros cursos especializados
            </h2>
            <p style={{ fontSize: '1.1rem', color: colors.gray[600] }}>
              Continúa tu formación con cursos individuales complementarios
            </p>
          </div>

          <div style={{
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              gap: spacing.lg,
              transition: 'transform 0.3s ease',
              transform: `translateX(-${scrollPosition}px)`
            }}>
              {allCourses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/cursos/${course.slug}`}
                  style={{
                    textDecoration: 'none',
                    minWidth: '320px',
                    maxWidth: '320px',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    backgroundColor: colors.white,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: `2px solid ${colors.gray[200]}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}>
                    {course.image && (
                      <div style={{
                        width: '100%',
                        height: '180px',
                        overflow: 'hidden',
                        backgroundColor: colors.gray[100]
                      }}>
                        <img
                          src={course.image}
                          alt={course.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ padding: spacing.md, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: colors.primary,
                        color: colors.white,
                        padding: `4px ${spacing.xs}`,
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        marginBottom: spacing.xs,
                        width: 'fit-content'
                      }}>
                        {course.category}
                      </div>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: colors.primary,
                        marginBottom: spacing.sm,
                        lineHeight: '1.3',
                        flex: 1
                      }}>
                        {course.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        fontSize: '0.85rem',
                        color: colors.gray[600],
                        marginBottom: spacing.sm
                      }}>
                        <span>⏱️ {course.hours}</span>
                        <span>📚 {course.modules.length} módulos</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: spacing.sm,
                        borderTop: `1px solid ${colors.gray[200]}`
                      }}>
                        <div>
                          <span style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: colors.accent
                          }}>
                            S/ {course.priceGrabado}
                          </span>
                        </div>
                        <div style={{
                          backgroundColor: colors.accent,
                          color: colors.white,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          Ver curso →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Botones de navegación */}
            {allCourses.length > 3 && (
              <>
                <button
                  onClick={() => setScrollPosition(Math.max(0, scrollPosition - 340))}
                  disabled={scrollPosition === 0}
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: colors.white,
                    color: colors.primary,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: scrollPosition === 0 ? 0.3 : 1,
                    zIndex: 10
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setScrollPosition(Math.min((allCourses.length - 3) * 340, scrollPosition + 340))}
                  disabled={scrollPosition >= (allCourses.length - 3) * 340}
                  style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: colors.white,
                    color: colors.primary,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: scrollPosition >= (allCourses.length - 3) * 340 ? 0.3 : 1,
                    zIndex: 10
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer style={{
        backgroundColor: colors.gray[700],
        color: colors.white,
        padding: `${spacing.lg} ${spacing.md}`,
        textAlign: 'center'
      }}>
        <div style={{
          padding: `${spacing.md} 0`,
          borderBottom: `1px solid rgba(255,255,255,0.1)`,
          marginBottom: spacing.md
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '1.6',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            SmartChatix Academy es una institución independiente. Las referencias a ANSYS, AFT Fathom, CFturbo y otros softwares son únicamente descriptivas y educativas. No somos entidad oficial, partner ni centro certificador de dichas marcas. Los certificados son emitidos exclusivamente por SmartChatix Academy.{' '}
            <Link href="/aviso-legal" style={{
              color: colors.accent,
              textDecoration: 'underline',
              fontWeight: '600'
            }}>
              Ver Aviso Legal completo
            </Link>
          </p>
        </div>
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.9)',
          fontWeight: '500'
        }}>
          © 2025 SmartChatix. Todos los derechos reservados.
        </p>
      </footer>

      {/* MODAL DE MODALIDADES */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: spacing.md
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: colors.white,
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: colors.gray[700],
                color: colors.white,
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ✕
            </button>

            <div style={{ padding: `${spacing.lg} ${spacing.xl}` }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: spacing.sm,
                textAlign: 'center'
              }}>
                Elige cómo quieres aprender
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: colors.gray[600],
                marginBottom: spacing.lg,
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                Selecciona la modalidad que mejor se adapta a tu disponibilidad
              </p>

              <div className="mobile-grid-1" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
                marginBottom: spacing.lg
              }}>
                {/* Modalidad En Vivo */}
                <div style={{
                  backgroundColor: colors.gray[50],
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: `2px solid ${colors.accent}`,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: colors.accent,
                    color: colors.white,
                    padding: `2px ${spacing.sm}`,
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    Recomendado
                  </div>

                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: 0,
                    marginTop: spacing.xs,
                    marginBottom: spacing.xs,
                    textAlign: 'center'
                  }}>
                    En Vivo + Grabaciones
                  </h3>

                  <div style={{
                    position: 'relative',
                    marginBottom: spacing.sm
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 102, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8" />
                        <path d="M12 17v4" />
                        <circle cx="9" cy="10" r="1" fill={colors.accent} />
                      </svg>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      paddingTop: '5px'
                    }}>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#DC2626',
                        textDecoration: 'line-through',
                        marginBottom: '4px'
                      }}>
                        S/ 1,499
                      </div>
                      <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: colors.success
                      }}>
                        S/ 999
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: spacing.sm, flex: 1 }}>
                    {[
                      'Clases en vivo con ingenieros especialistas',
                      'Acceso a todas las grabaciones',
                      'Aula virtual con material descargable',
                      'Plantillas, guías y herramientas',
                      'Resolución de dudas en tiempo real',
                      'Cupos limitados para acompañamiento en vivo'
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        marginBottom: '6px',
                        fontSize: '0.75rem',
                        color: colors.gray[700],
                        lineHeight: '1.3'
                      }}>
                        <span style={{ color: colors.accent, fontSize: '0.85rem', marginTop: '-1px' }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    backgroundColor: '#E3F2FD',
                    color: colors.primary,
                    padding: spacing.sm,
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    marginBottom: spacing.sm,
                    lineHeight: '1.4',
                    textAlign: 'center'
                  }}>
                    📅 Inicio: Martes 08 de Septiembre<br/>
                    🕐 Horario: Martes y Jueves de 8:00 PM a 10:00 PM
                  </div>

                  <Link href="/inscripcion-vivo" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.accent,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      width: '100%'
                    }}>
                      Reservar mi vacante
                    </button>
                  </Link>
                </div>

                {/* Modalidad Grabada */}
                <div style={{
                  backgroundColor: colors.gray[50],
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: `2px solid ${colors.gray[300]}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: colors.primary,
                    margin: 0,
                    marginTop: spacing.xs,
                    marginBottom: spacing.xs,
                    textAlign: 'center'
                  }}>
                    Curso Grabado
                  </h3>

                  <div style={{
                    position: 'relative',
                    marginBottom: spacing.sm
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 51, 102, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" />
                        <path d="M10 8l6 4-6 4V8z" fill={colors.primary} />
                      </svg>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      paddingTop: '5px'
                    }}>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#DC2626',
                        textDecoration: 'line-through',
                        marginBottom: '4px'
                      }}>
                        S/ 899
                      </div>
                      <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: colors.success
                      }}>
                        S/ 699
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: spacing.sm, flex: 1 }}>
                    {[
                      'Acceso inmediato al aula virtual',
                      'Videos organizados por módulos',
                      'Material descargable incluido',
                      'Aprende a tu ritmo desde cualquier lugar',
                      'Acceso 24/7 sin horarios'
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        marginBottom: '6px',
                        fontSize: '0.75rem',
                        color: colors.gray[700],
                        lineHeight: '1.3'
                      }}>
                        <span style={{ color: colors.primary, fontSize: '0.85rem', marginTop: '-1px' }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    backgroundColor: '#E3F2FD',
                    color: colors.primary,
                    padding: spacing.sm,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: spacing.sm,
                    lineHeight: '1.6',
                    textAlign: 'center',
                    height: '62px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    💡 Ideal si necesitas flexibilidad total y aprender a tu propio ritmo
                  </div>

                  <Link href="/comprar-grabado" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      width: '100%'
                    }}>
                      Comprar acceso grabado
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE HAMBURGER MENU BUTTON */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          backgroundColor: colors.accent,
          color: colors.white,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'all 0.3s ease'
        }}
        className="mobile-hamburger"
      >
        {showMobileMenu ? '✕' : '☰'}
      </button>

      {/* MOBILE MENU OVERLAY */}
      {showMobileMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9997,
            display: 'none'
          }}
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '300px',
              height: '100%',
              backgroundColor: colors.white,
              boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
              padding: spacing.lg,
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: spacing.lg, textAlign: 'center' }}>
              <img
                src="/images/logo_samartchatix.png"
                alt="SmartChatix"
                style={{
                  height: '60px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  border: `2px solid ${colors.accent}`,
                  textAlign: 'center'
                }}
              >
                ← Volver al Inicio
              </Link>

              <a
                href="#modulos"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
              >
                Contenido del Programa
              </a>

              <a
                href="#precios"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
              >
                Ver Precios
              </a>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowModal(true);
                }}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.white,
                  border: 'none',
                  padding: spacing.md,
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginTop: spacing.md
                }}
              >
                INSCRÍBETE AHORA
              </button>
            </nav>

            <div style={{
              marginTop: spacing.xl,
              paddingTop: spacing.lg,
              borderTop: `1px solid ${colors.gray[200]}`,
              fontSize: '0.85rem',
              color: colors.gray[600],
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: spacing.xs }}>📧 contacto@smartchatix.com</div>
              <div>📞 +51 967 717 179</div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
