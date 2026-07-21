'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';

export default function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const [showModal, setShowModal] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [slug, setSlug] = React.useState<string>('');
  const [curso, setCurso] = React.useState<any>(undefined);
  const [stickyPosition, setStickyPosition] = React.useState<'fixed' | 'absolute'>('fixed');
  const [stickyTop, setStickyTop] = React.useState(80);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [allCourses, setAllCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    params.then(async ({ slug }) => {
      setSlug(slug);
      try {
        const response = await fetch(`/api/public/courses/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCurso(data.course);
        } else {
          setCurso(null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setCurso(null);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  React.useEffect(() => {
    fetch('/api/public/courses')
      .then(res => res.json())
      .then(data => setAllCourses(data.courses || []))
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const carrusel = document.querySelector('.related-courses-carousel');
      const sticky = document.querySelector('.sticky-sidebar') as HTMLElement;

      if (!carrusel || !sticky) return;

      const carruselTop = carrusel.getBoundingClientRect().top;
      const stickyHeight = sticky.offsetHeight;
      const windowHeight = window.innerHeight;
      const stickyTopOffset = 80;

      if (carruselTop <= windowHeight) {
        const maxTop = (carrusel as HTMLElement).offsetTop - stickyHeight - 20;
        setStickyTop(maxTop);
        setStickyPosition('absolute');
      } else {
        setStickyPosition('fixed');
        setStickyTop(stickyTopOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [curso]);

  if (loading || curso === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Cargando...</div>
      </div>
    );
  }

  if (!curso) {
    notFound();
  }

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
      color: colors.gray[700]
    }}>
      <style>{`
        body {
          overflow-x: hidden;
        }
        .sticky-sidebar {
          right: max(calc((100vw - 1200px) / 2), 20px);
          width: 380px;
          z-index: 50;
        }
        @media (max-width: 1024px) {
          .sticky-sidebar {
            display: none;
          }
          .hero-section > div,
          section > div {
            margin-right: auto !important;
            max-width: 900px !important;
          }
        }
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
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .hero-image-container {
            order: -1 !important;
          }
          .hero-image {
            max-width: 280px !important;
            margin: 0 auto !important;
          }
          .hero-title {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
          }
          .section-title {
            font-size: 1.5rem !important;
          }
          .section-subtitle {
            font-size: 0.95rem !important;
          }
          .floating-card {
            position: relative !important;
            top: 0 !important;
            margin-top: 0 !important;
            order: -1 !important;
          }
          .hero-container {
            grid-template-columns: 1fr !important;
          }
          .hero-section {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 1.5rem !important;
            border-radius: 0 !important;
          }
          aside {
            position: relative !important;
          }
        }
      `}</style>

      {/* Header Simple */}
      <header style={{
        backgroundColor: colors.white,
        borderBottom: `2px solid ${colors.primary}`,
        padding: `${spacing.sm} ${spacing.lg}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/logo_samartchatix.png"
              alt="SmartChatix Academy"
              style={{ height: '65px', width: 'auto' }}
            />
          </Link>
          <Link href="/" className="mobile-hidden" style={{
            textDecoration: 'none',
            color: colors.primary,
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Menú Hamburguesa Móvil */}
      <button
        className="mobile-hamburger"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        style={{
          display: 'none',
          backgroundColor: colors.accent,
          color: colors.white,
          border: 'none',
          borderRadius: '6px',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        {showMobileMenu ? '✕' : '☰'}
      </button>

      {/* Overlay Menú Móvil */}
      {showMobileMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99998,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.lg,
            padding: spacing.xl,
            overflowY: 'auto'
          }}
          onClick={() => setShowMobileMenu(false)}
        >
          <Link href="/" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Inicio
          </Link>
          <Link href="/programas" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Programas
          </Link>
          <Link href="/cursos" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Cursos
          </Link>
          <Link href="/capacitacion" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Capacitación Empresarial
          </Link>
          <Link href="/mentorias" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Mentorías
          </Link>
          <Link href="/blog" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Blog
          </Link>
          <Link href="/contacto" style={{
            color: colors.white,
            fontSize: '1.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Contacto
          </Link>
        </div>
      )}

      {/* Módulo flotante sticky - Fixed position */}
      <aside className="sticky-sidebar" style={{
        position: stickyPosition,
        top: `${stickyTop}px`
      }}>
        <div className="floating-card" style={{
          background: 'linear-gradient(135deg, #003366 0%, #0066CC 100%)',
          padding: spacing.lg,
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          {/* Imagen del curso */}
          {curso.image && (
            <img
              src={curso.image}
              alt={curso.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: spacing.md,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            />
          )}

          {/* Precio */}
          <div style={{
            marginBottom: spacing.md,
            paddingBottom: spacing.md,
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,102,0,0.12)',
              padding: spacing.sm,
              borderRadius: '8px',
              marginBottom: spacing.sm,
              border: `2px solid ${colors.accent}`
            }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: colors.accent,
                color: colors.white,
                padding: `4px ${spacing.sm}`,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: spacing.xs
              }}>
                ACCESO GRABADO
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: spacing.xs,
                fontWeight: '600'
              }}>
                🔥 Precio de lanzamiento
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: spacing.sm
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: colors.white
                }}>
                  S/ {curso.priceGrabado}
                </span>
                <span style={{
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'line-through'
                }}>
                  S/ {curso.oldPriceGrabado}
                </span>
              </div>
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs
            }}>
              <span style={{ color: colors.accent }}>✓</span>
              <span>Acceso inmediato + certificado digital</span>
            </div>
          </div>

          {/* Incluye */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: spacing.md,
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: colors.white,
            lineHeight: '1.6'
          }}>
            <div style={{
              fontWeight: '700',
              marginBottom: spacing.sm,
              fontSize: '0.95rem'
            }}>
              Este curso incluye:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <div>✓ {curso.hours} de contenido</div>
              <div>✓ {curso.modules.length} módulos especializados</div>
              <div>✓ Acceso a grabaciones</div>
              <div>✓ Certificado digital</div>
              <div>✓ Soporte del instructor</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Hero Section del Curso - Full Width Background */}
      <section className="hero-section" style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        color: colors.white,
        padding: `${spacing.xl} 0`,
        width: '100%',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '750px',
          margin: '0 auto',
          marginRight: 'max(420px, calc((100vw - 1200px) / 2 + 400px))',
          padding: `0 ${spacing.lg}`
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
              {curso.category.toUpperCase()}
            </div>

            <h1 className="hero-title" style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: spacing.md
            }}>
              {curso.title}
            </h1>

            {/* Temas clave */}
            {curso.keyTopics && curso.keyTopics.length > 0 && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderLeft: `4px solid ${colors.accent}`,
                padding: spacing.md,
                borderRadius: '8px',
                marginBottom: spacing.lg
              }}>
                <h3 style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  opacity: 0.9
                }}>
                  ⚡ Lo que dominarás
                </h3>
                <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: spacing.xs
                }}>
                  {curso.keyTopics.map((topic: string, idx: number) => (
                    <li key={idx} style={{
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <span style={{ color: colors.accent, fontWeight: '700' }}>✓</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: spacing.md,
              marginBottom: spacing.lg,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{curso.hours}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Duración total</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{curso.modules.length}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Módulos</div>
                </div>
              </div>
            </div>

            {curso?.hasLiveMode ? (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.white,
                  border: 'none',
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255,102,0,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ELIGE TU ACCESO AL CURSO →
              </button>
            ) : (
              <Link href={`/comprar-grabado?curso=${slug}`} style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.white,
                    border: 'none',
                    padding: `${spacing.md} ${spacing.xl}`,
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255,102,0,0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  COMPRAR AHORA →
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Plan de Estudios */}
      <section style={{
        backgroundColor: colors.white,
        padding: `${spacing.xxl} ${spacing.lg}`
      }}>
        <div style={{
          maxWidth: '750px',
          margin: '0 auto',
          marginRight: 'max(420px, calc((100vw - 1200px) / 2 + 400px))'
        }}>
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 className="section-title" style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.sm
            }}>
              Plan de Estudios
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.2rem', color: colors.gray[600] }}>
              {curso.modules.length} módulos especializados | {curso.hours} grabadas | Enfoque práctico desde cero
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: spacing.lg
          }}>
            {curso.modules.map((modulo: any) => (
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
                  marginBottom: modulo.description ? spacing.sm : 0
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
                    {modulo.hours}
                  </div>
                </div>
                {modulo.description && (
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: colors.gray[600],
                    margin: 0
                  }}>
                    {modulo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Modalidades */}
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
                {curso.title}
              </h2>

              <p style={{
                fontSize: '0.8rem',
                color: colors.gray[600],
                marginBottom: spacing.lg,
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
               Aprende en vivo o a tu ritmo. Acceso al aula virtual y certificado incluido.
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
                    Más Completo
                  </div>

                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: colors.primary,
                    marginBottom: spacing.xs,
                    marginTop: spacing.xs,
                    textAlign: 'center'
                  }}>
                    En Vivo Guiado
                  </h3>

                  <div style={{ textAlign: 'center', marginBottom: spacing.xs }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: colors.accent,
                      marginBottom: '2px'
                    }}>
                      S/ {curso.priceVivo}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: colors.gray[400],
                      textDecoration: 'line-through'
                    }}>
                      S/ {curso.oldPriceVivo}
                    </div>
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: `0 0 ${spacing.sm} 0`,
                    fontSize: '0.75rem',
                    color: colors.gray[700],
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: spacing.xs }}>✓ Clases en vivo con instructor</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Acceso a grabaciones</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Resolución de dudas</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Soporte académico</li>
                  </ul>


                  <Link href={`/inscripcion-vivo?curso=${slug}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.accent,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.xs} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}>
                      Reservar mi Cupo
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
                    textAlign: 'center',
                    marginTop: spacing.xs
                  }}>
                    Acceso Grabado
                  </h3>

                  <div style={{ textAlign: 'center', marginBottom: spacing.xs }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: colors.primary,
                      marginBottom: '2px'
                    }}>
                      S/ {curso.priceGrabado}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: colors.gray[400],
                      textDecoration: 'line-through'
                    }}>
                      S/ {curso.oldPriceGrabado}
                    </div>
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: `0 0 ${spacing.sm} 0`,
                    fontSize: '0.75rem',
                    color: colors.gray[700],
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: spacing.xs }}>✓ Acceso inmediato al aula virtual</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Videos disponibles 24/7</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Aprende a tu ritmo</li>
                    <li style={{ marginBottom: spacing.xs }}>✓ Certificado digital incluido</li>
                  </ul>

                   <Link href={`/comprar-grabado?curso=${slug}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                      border: 'none',
                      padding: `${spacing.xs} ${spacing.md}`,
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}>
                      Comprar Ahora
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carrusel de Cursos Relacionados */}
      <section className="related-courses-carousel" style={{
        backgroundColor: colors.gray[50],
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
              Explora más cursos
            </h2>
            <p style={{ fontSize: '1.1rem', color: colors.gray[600] }}>
              Continúa tu aprendizaje con estos cursos relacionados
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
              {allCourses.filter(c => c.slug !== slug).map((course) => (
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

      <Footer />
    </div>
  );
}
