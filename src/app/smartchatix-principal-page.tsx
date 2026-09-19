'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/layout/Header';
import { useCurrency } from '@/hooks/useCurrency';
import SmartChatixBusiness from '@/components/sections/SmartChatixBusiness';
import TechSolutions from '@/components/sections/TechSolutions';
import SmartChatixHero from '@/components/hero/SmartChatixHero';

export default function SmartChatixPrincipalPage() {
  const { symbol, convertPrice, loading, currency } = useCurrency();

  const [courses, setCourses] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => setCourses(data.courses || []))
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  const getCoursePrice = (course: any, isOldPrice: boolean = false) => {
    const isGrabado = course.hasRecordedMode && parseFloat(course.priceGrabado) > 0;

    if (currency === 'USD') {
      const usdPrice = isOldPrice
        ? (isGrabado ? course.priceGrabadoUsdOld : course.priceVivoUsdOld)
        : (isGrabado ? course.priceGrabadoUsd : course.priceVivoUsd);

      if (usdPrice && parseFloat(usdPrice) > 0) {
        return parseFloat(usdPrice);
      }
    }

    const penPrice = isOldPrice
      ? (isGrabado ? course.priceGrabadoOld : course.priceVivoOld)
      : (isGrabado ? course.priceGrabado : course.priceVivo);

    return convertPrice(parseFloat(penPrice) || 0);
  };

  // SmartChatix COLOR PALETTE
  const colors = {
    primary: '#003366',       // Azul SmartChatix principal
    secondary: '#0066CC',     // Azul más claro
    accent: '#FF6600',        // Naranja SmartChatix
    success: '#009900',       // Verde éxito
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

  // TYPOGRAPHY - Institucional
  const typography = {
    h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '2.25rem', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '1.75rem', fontWeight: '600', lineHeight: '1.4' },
    h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.5' },
    body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
    small: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.5' }
  };

  // SPACING
  const spacing = {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.white,
      color: colors.gray[700]
    }}>
      <Header showCursos={true} showServicios={true} courses={courses} />

      <style>{`
        @keyframes shine-sweep {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3), 0 4px 15px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.5), 0 4px 20px rgba(255, 255, 255, 0.4); }
        }

        .hypnotic-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .hypnotic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%);
          pointer-events: none;
          z-index: 1;
          animation: shine-sweep 3s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-flex-col { flex-direction: column !important; }
          .mobile-text-sm { font-size: 0.8rem !important; }
          .mobile-text-base { font-size: 0.95rem !important; }
          .mobile-text-lg { font-size: 1.1rem !important; }
          .mobile-text-xl { font-size: 1.4rem !important; }
          .mobile-text-2xl { font-size: 1.75rem !important; }
          .mobile-p-sm { padding: 0.5rem !important; }
          .mobile-p-md { padding: 1rem !important; }
          .mobile-gap-sm { gap: 0.5rem !important; }
          .mobile-gap-md { gap: 1rem !important; }
          .mobile-grid-1 { grid-template-columns: 1fr !important; }
          .mobile-w-full { width: 80% !important; max-width: 80% !important; margin: 0 auto !important; display: flex !important; justify-content: center !important; align-items: center !important; font-size: 0.72rem !important; padding: 0.75rem 1.5rem !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-h-auto { height: auto !important; }
          .mobile-min-h-auto { min-height: auto !important; }
          .desktop-sticky { position: relative !important; }
          .mobile-hamburger {
            display: flex !important;
            position: fixed !important;
            top: 15px !important;
            right: 10px !important;
            z-index: 99999 !important;
            width: 36px !important;
            height: 36px !important;
            font-size: 1.2rem !important;
          }
          .mobile-menu-overlay { display: block !important; }
          .mobile-stat-number { font-size: 1.3rem !important; }
          .mobile-stat-label { font-size: 0.7rem !important; }
          .mobile-hero-title { font-size: 1.4rem !important; line-height: 1.3 !important; }
          .mobile-arrow-small {
            width: 30px !important;
            height: 30px !important;
            opacity: 0.5 !important;
            font-size: 0.9rem !important;
          }
          .mobile-full-width {
            width: 100vw !important;
            margin-left: calc(-50vw + 50%) !important;
            border-radius: 0 !important;
          }
          .mobile-full-width.mobile-featured-program {
            width: 100% !important;
            margin-left: 0 !important;
          }
          .programas-container {
            padding: 0 !important;
          }
          .mobile-nowrap-button {
            white-space: nowrap !important;
            font-size: 0.85rem !important;
            padding: 0.8rem 1rem !important;
          }
          .mobile-button-container {
            align-items: center !important;
            width: 100% !important;
          }
          .mobile-card-compact {
            padding: 0.75rem !important;
          }
          .mobile-section-title { font-size: 1.4rem !important; line-height: 1.3 !important; }
          .mobile-subtitle { font-size: 1.1rem !important; line-height: 1.4 !important; }
          .mobile-badge { font-size: 0.7rem !important; padding: 0.3rem 0.7rem !important; }
          .mobile-p-sm img {
            max-width: 100% !important;
            margin-left: 0 !important;
            display: block;
            margin: 0 auto !important;
          }
          .mobile-modal-center {
            padding: 10px !important;
          }
          .mobile-modal-content {
            max-width: calc(100vw - 20px) !important;
            margin: 0 auto !important;
          }
          .mobile-modal-image {
            background-position: 25% 30% !important;
            background-size: 150% !important;
          }
          .mobile-modal-title {
            font-size: 1.3rem !important;
            margin-bottom: 0.5rem !important;
          }
          .mobile-modal-padding {
            padding: 1rem 1.5rem !important;
          }
          .mobile-modal-close {
            top: 55px !important;
            right: 13px !important;
          }
          .mobile-featured-program {
            background: linear-gradient(135deg, #003366 0%, #0066CC 100%) !important;
            padding: 1.5rem 1rem !important;
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.3) !important;
            margin-bottom: 2rem !important;
            border-radius: 0 !important;
          }
          .mobile-featured-program h3,
          .mobile-featured-program p,
          .mobile-featured-program ul,
          .mobile-featured-program li {
            color: white !important;
          }
          .mobile-featured-program-img {
            padding: 0 !important;
            margin: 1.5rem 0 0 0 !important;
            width: 100% !important;
            overflow: hidden !important;
          }
          .mobile-featured-program-img img {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            object-fit: cover !important;
            object-position: 20% 25% !important;
            height: 250px !important;
            display: block !important;
            transform: scale(1.7) !important;
          }
        }
      `}</style>

      <SmartChatixHero />

      <TechSolutions />

      {/* SECCIÓN DE PROGRAMAS ESTILO INSTITUCIONAL */}
      <section id="programas" className="programas-section" style={{
        padding: `${spacing.xxl} 0`,
        backgroundColor: colors.gray[50]
      }}>
        <div className="programas-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${spacing.md}`
        }}>
          {/* Mensaje comercial */}
          <div style={{
            backgroundColor: colors.gray[50],
            padding: spacing.lg,
            borderRadius: '8px',
            marginBottom: spacing.xl,
            border: `2px solid ${colors.gray[200]}`
          }}>
            <p style={{
              ...typography.body,
              color: colors.primary,
              fontWeight: '600',
              fontSize: '1.05rem',
              margin: 0,
              lineHeight: '1.6',
              textAlign: 'center'
            }}>
              💼 Desarrolla habilidades técnicas <strong style={{color: colors.accent}}>que te ayudarán a trabajar mejor,</strong> tomar mejores decisiones y destacar en la nueva era de la inteligencia artificial.
            
            </p>
          </div>

          {/* Other Programs Grid */}
          <div id="otros-programas" className="mobile-grid-1" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg
          }}>
            {courses
              .sort((a, b) => {
                // Publicados primero (los que NO son coming_soon ni unpublished)
                const aIsPublished = a.publication_status !== 'coming_soon' && a.publication_status !== 'unpublished';
                const bIsPublished = b.publication_status !== 'coming_soon' && b.publication_status !== 'unpublished';

                if (aIsPublished && !bIsPublished) return -1;
                if (!aIsPublished && bIsPublished) return 1;
                return 0;
              })
              .map((course, index) => (
              <div key={index} onClick={() => {
                if (course.publication_status !== 'coming_soon' && course.publication_status !== 'unpublished') {
                  window.location.href = course.landingPageType === 'custom' && course.customLandingUrl
                    ? course.customLandingUrl
                    : `/cursos/${course.slug}`;
                }
              }} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mobile-card-compact" style={{
                  backgroundColor: colors.white,
                  borderRadius: '8px',
                  padding: spacing.lg,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: `1px solid ${colors.gray[200]}`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  cursor: course.publication_status === 'coming_soon' || course.publication_status === 'unpublished' ? 'default' : 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}>
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: spacing.sm
                    }}
                  />
                )}
                <h4 style={{
                  ...typography.h4,
                  color: colors.primary,
                  marginBottom: spacing.sm
                }}>
                  {course.title}
                </h4>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md
                }}>
                  <span style={{
                    fontSize: '0.9rem',
                    color: colors.gray[600]
                  }}>
                    Duración: {course.hours}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {course.publication_status === 'coming_soon' ? (
                      <span style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        color: '#92400e',
                        backgroundColor: '#fef3c7',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        ⏳ Próximamente
                      </span>
                    ) : (parseFloat(course.priceGrabado) > 0 || parseFloat(course.priceVivo) > 0) ? (
                      <>
                        <span style={{
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          color: colors.accent
                        }}>
                          {loading
                            ? 'S/ ' + ((course.hasRecordedMode && parseFloat(course.priceGrabado) > 0) ? course.priceGrabado : course.priceVivo)
                            : symbol + ' ' + getCoursePrice(course, false)}
                        </span>
                        {((course.hasRecordedMode && parseFloat(course.priceGrabado) > 0) ? course.priceGrabadoOld : course.priceVivoOld) && (
                          <span style={{
                            fontSize: '0.9rem',
                            color: colors.gray[400],
                            textDecoration: 'line-through'
                          }}>
                            {loading
                              ? 'S/ ' + ((course.hasRecordedMode && parseFloat(course.priceGrabado) > 0) ? course.priceGrabadoOld : course.priceVivoOld)
                              : symbol + ' ' + getCoursePrice(course, true)}
                          </span>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

              </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* MODAL */}
      {showModal && (
        <div
          className="mobile-modal-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: spacing.md,
            overflowY: 'auto'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="mobile-modal-content"
            style={{
              backgroundColor: colors.white,
              borderRadius: '12px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              margin: '0 auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowModal(false)}
              className="mobile-modal-close"
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

            {/* Imagen del programa */}
            <div className="mobile-modal-image" style={{
              width: '100%',
              height: '180px',
              backgroundImage: 'url("/images/bomba_estudio3.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}></div>

            {/* Contenido */}
            <div className="mobile-modal-padding" style={{ padding: `${spacing.lg} ${spacing.xl}` }}>
              <h2 className="mobile-modal-title" style={{
                ...typography.h2,
                color: colors.primary,
                marginBottom: spacing.sm,
                fontSize: '1.6rem'
              }}>
                Pump Engineer Program
              </h2>

              {/* Descripción breve */}
              <p style={{
                ...typography.body,
                color: colors.gray[700],
                marginBottom: spacing.lg,
                lineHeight: '1.5',
                fontSize: '0.95rem'
              }}>
                Programa de 40 horas en selección, operación, análisis y simulación de bombas centrífugas para minería e industria con ANSYS CFX, AFT Fathom y CFturbo.
              </p>

              {/* Modalidades y Precios */}
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
                  position: 'relative'
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
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: colors.primary,
                    marginBottom: spacing.xs,
                    marginTop: spacing.xs,
                    textAlign: 'center'
                  }}>
                    En Vivo
                  </h3>

                  <div style={{
                    textAlign: 'center',
                    marginBottom: spacing.xs
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#DC2626',
                      textDecoration: 'line-through',
                      marginBottom: '4px'
                    }}>
                      {loading ? 'S/ 1,499' : symbol + ' ' + convertPrice(1499)}
                    </div>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: colors.success
                    }}>
                      {loading ? 'S/ 999' : symbol + ' ' + convertPrice(999)}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.75rem',
                    color: colors.gray[600],
                    textAlign: 'center',
                    marginBottom: spacing.sm,
                    lineHeight: '1.3'
                  }}>
                    Clases en vivo + acceso a grabaciones
                  </p>

                  <Link href="/inscripcion-vivo?curso=pump-engineer-program" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.accent,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}>
                      Inscríbete en vivo
                    </button>
                  </Link>
                </div>

                {/* Modalidad Grabada */}
                <div style={{
                  backgroundColor: colors.gray[50],
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: `2px solid ${colors.gray[300]}`
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: colors.primary,
                    marginBottom: spacing.xs,
                    marginTop: spacing.xs,
                    textAlign: 'center'
                  }}>
                    Grabada
                  </h3>

                  <div style={{
                    textAlign: 'center',
                    marginBottom: spacing.xs
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#DC2626',
                      textDecoration: 'line-through',
                      marginBottom: '4px'
                    }}>
                      {loading ? 'S/ 899' : symbol + ' ' + convertPrice(899)}
                    </div>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: colors.success
                    }}>
                      {loading ? 'S/ 699' : symbol + ' ' + convertPrice(699)}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.75rem',
                    color: colors.gray[600],
                    textAlign: 'center',
                    marginBottom: spacing.sm,
                    lineHeight: '1.3'
                  }}>
                    Acceso inmediato al aula virtual
                  </p>

                  <Link href="/comprar-grabado?curso=pump-engineer-program" style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}>
                      Comprar grabado
                    </button>
                  </Link>
                </div>
              </div>

              {/* Botón conoce más */}
              <Link
                href="/programa-bombas"
                style={{
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <button style={{
                  backgroundColor: 'transparent',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  width: '100%'
                }}>
                  Ver información completa del programa
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <SmartChatixBusiness />

      <Footer />
    </div>
  );
}