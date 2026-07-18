'use client';

import React from 'react';
import Link from 'next/link';
import { getCourses } from '@/data/courses';
import Footer from '@/components/Footer';
import { useCurrency } from '@/hooks/useCurrency';
import SmartChatixBusiness from '@/components/sections/SmartChatixBusiness';

export default function SmartChatixPrincipalPage() {
  const courses = getCourses();
  const { symbol, convertPrice, loading } = useCurrency();

  const [showModal, setShowModal] = React.useState(false);
  const [showServiciosMenu, setShowServiciosMenu] = React.useState(false);
  const [showCursosMenu, setShowCursosMenu] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [videoOpacity1, setVideoOpacity1] = React.useState(1);
  const [videoOpacity2, setVideoOpacity2] = React.useState(0);
  const video1Ref = React.useRef<HTMLVideoElement>(null);
  const video2Ref = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Particles animation effect
  React.useEffect(() => {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      fadeSpeed: number;
    }> = [];

    const colors = ['#00D9FF', '#0099FF', '#00FFAA', '#00CCFF', '#66E0FF'];

    // Posiciones aproximadas de los puntos de conexión en la imagen (porcentajes)
    const connectionPoints = [
      { x: 0.5, y: 0.5 },   // Centro (IA)
      { x: 0.25, y: 0.2 },  // Top left
      { x: 0.75, y: 0.2 },  // Top right
      { x: 0.2, y: 0.5 },   // Left
      { x: 0.8, y: 0.5 },   // Right
      { x: 0.3, y: 0.75 },  // Bottom left
      { x: 0.7, y: 0.75 },  // Bottom right
    ];

    const createParticle = () => {
      const centerPoint = connectionPoints[0];
      const targetPoint = connectionPoints[Math.floor(Math.random() * (connectionPoints.length - 1)) + 1];

      const startX = centerPoint.x * canvas.width;
      const startY = centerPoint.y * canvas.height;
      const endX = targetPoint.x * canvas.width;
      const endY = targetPoint.y * canvas.height;

      const angle = Math.atan2(endY - startY, endX - startX);
      const speed = 0.5 + Math.random() * 1;

      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.8,
        fadeSpeed: 0.005 + Math.random() * 0.01
      };
    };

    // Crear partículas iniciales
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Agregar nuevas partículas ocasionalmente
      if (Math.random() < 0.1 && particles.length < 80) {
        particles.push(createParticle());
      }

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.alpha -= particle.fadeSpeed;

        if (particle.alpha <= 0 ||
            particle.x < 0 || particle.x > canvas.width ||
            particle.y < 0 || particle.y > canvas.height) {
          particles.splice(index, 1);
          return;
        }

        // Dibujar partícula con glow effect
        ctx.save();
        ctx.globalAlpha = particle.alpha;

        // Glow externo
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    const handleTimeUpdate1 = () => {
      if (video1.duration - video1.currentTime < 0.5) {
        setVideoOpacity1(0);
        setVideoOpacity2(1);
        video2.currentTime = 0;
        video2.play();
      }
    };

    const handleTimeUpdate2 = () => {
      if (video2.duration - video2.currentTime < 0.5) {
        setVideoOpacity2(0);
        setVideoOpacity1(1);
        video1.currentTime = 0;
        video1.play();
      }
    };

    video1.addEventListener('timeupdate', handleTimeUpdate1);
    video2.addEventListener('timeupdate', handleTimeUpdate2);

    return () => {
      video1.removeEventListener('timeupdate', handleTimeUpdate1);
      video2.removeEventListener('timeupdate', handleTimeUpdate2);
    };
  }, []);

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
          .mobile-w-full { width: 70% !important; max-width: 70% !important; margin: 0 auto !important; display: block !important; font-size: 1.05rem !important; padding: 0.65rem 1.25rem !important; }
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

      {/* HEADER ESTILO INSTITUCIONAL */}
      <header className="desktop-sticky" style={{
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Top Bar */}
        <div className="mobile-hidden" style={{
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
            <div>
              📧 contacto@smartchatix.com | 📞 +51 967 717 179
            </div>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <span>🌐 ES</span>
              <span>|</span>
              <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Ingresar</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mobile-flex-col mobile-gap-md" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${spacing.sm} ${spacing.md}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
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

          {/* Navigation Menu */}
          <nav className="mobile-hidden" style={{
            display: 'flex',
            gap: spacing.xs,
            alignItems: 'center'
          }}>
            {['Inicio', 'Servicios', 'Cursos', 'Nosotros', 'Contacto'].map((item, index) => {
              if (item === 'Servicios') {
                return (
                  <div
                    key={index}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowServiciosMenu(true)}
                    onMouseLeave={() => setShowServiciosMenu(false)}
                  >
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: colors.gray[600],
                        fontWeight: '500',
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: '6px',
                        border: '2px solid transparent',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = `2px solid ${colors.primary}`;
                        e.currentTarget.style.backgroundColor = colors.gray[50];
                        e.currentTarget.style.color = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '2px solid transparent';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.gray[600];
                      }}
                    >
                      {item} ▾
                    </a>

                    {showServiciosMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        paddingTop: '0.5rem',
                        zIndex: 1000
                      }}>
                        <div style={{
                          backgroundColor: colors.white,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          minWidth: '280px',
                          padding: spacing.sm
                        }}>
                          <Link
                            href="/servicios/aulas-virtuales"
                            style={{
                              display: 'block',
                              padding: spacing.sm,
                              textDecoration: 'none',
                              color: colors.gray[700],
                              borderRadius: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.gray[50];
                              e.currentTarget.style.color = colors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = colors.gray[700];
                            }}
                          >
                            <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🎓 Aulas Virtuales con IA
                            </div>
                            <div style={{ fontSize: '0.75rem', color: colors.gray[500] }}>
                              Plataforma e-learning para colegios
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item === 'Cursos') {
                return (
                  <div
                    key={index}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowCursosMenu(true)}
                    onMouseLeave={() => setShowCursosMenu(false)}
                  >
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: colors.gray[600],
                        fontWeight: '500',
                        padding: `${spacing.xs} ${spacing.md}`,
                        borderRadius: '6px',
                        border: '2px solid transparent',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = `2px solid ${colors.primary}`;
                        e.currentTarget.style.backgroundColor = colors.gray[50];
                        e.currentTarget.style.color = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = '2px solid transparent';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.gray[600];
                      }}
                    >
                      {item} ▾
                    </a>

                    {showCursosMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        paddingTop: '0.5rem',
                        zIndex: 1000
                      }}>
                        <div style={{
                          backgroundColor: colors.white,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          minWidth: '320px',
                          maxHeight: '400px',
                          overflowY: 'auto',
                          padding: spacing.sm
                        }}>
                          {courses.map((course, idx) => (
                            <Link
                              key={idx}
                              href={`/cursos/${course.slug}`}
                              style={{
                                display: 'block',
                                padding: spacing.sm,
                                textDecoration: 'none',
                                color: colors.gray[700],
                                borderRadius: '6px',
                                transition: 'all 0.2s ease',
                                borderBottom: idx < courses.length - 1 ? `1px solid ${colors.gray[200]}` : 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.gray[50];
                                e.currentTarget.style.color = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.gray[700];
                              }}
                            >
                              <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '0.9rem' }}>
                                {course.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: colors.gray[500] }}>
                                {course.hours} • {loading ? 'S/ ' + course.priceGrabado : symbol + ' ' + convertPrice(course.priceGrabado)}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href="#"
                  style={{
                    textDecoration: 'none',
                    color: colors.gray[600],
                    fontWeight: '500',
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: '6px',
                    border: '2px solid transparent',
                    borderBottom: index === 0 ? `2px solid ${colors.accent}` : 'none',
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
                    e.currentTarget.style.color = colors.gray[600];
                    if (index === 0) {
                      e.currentTarget.style.borderBottom = `2px solid ${colors.accent}`;
                    }
                  }}
                >
                  {item}
                </a>
              );
            })}

            <button style={{
              backgroundColor: colors.accent,
              color: colors.white,
              border: 'none',
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              Inscríbete Hoy
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION ESTILO INSTITUCIONAL CON SLIDER */}
      <section className="mobile-p-md mobile-min-h-auto" style={{
        color: colors.white,
        padding: `${spacing.xxl} 0`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '600px'
      }}>
        {/* Slides Container */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          {/* Slide 1: Hero Video Background with Crossfade */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <video
              ref={video1Ref}
              autoPlay
              muted
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                opacity: videoOpacity1,
                transition: 'opacity 0.8s ease-in-out'
              }}
            >
              <source src="https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/people_animated.mp4" type="video/mp4" />
            </video>
            <video
              ref={video2Ref}
              muted
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                opacity: videoOpacity2,
                transition: 'opacity 0.8s ease-in-out'
              }}
            >
              <source src="https://pub-39582e519f204b8799b03d63e07c0b67.r2.dev/videos/people_animated.mp4" type="video/mp4" />
            </video>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.75) 0%, rgba(0, 0, 0, 0.8) 100%)',
              zIndex: 1
            }}></div>
          </div>

        </div>

        <div className="mobile-p-sm" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${spacing.md}`,
          paddingTop: '8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          textAlign: 'center'
        }}>
          {/* Content - Slide 1 */}
          <div style={{
            animation: 'fadeIn 1s ease-in-out',
            maxWidth: '900px'
          }}>
              <h1 className="mobile-text-2xl mobile-hero-title" style={{
                ...typography.h1,
                fontSize: '2.5rem',
                marginBottom: spacing.md,
                color: colors.white,
                fontWeight: '500',
                lineHeight: '1.1'
              }}>
                La IA  <span style={{color: colors.accent}}>no reemplazará tu trabajo</span>
              

              <br />
                Multiplicará tu capacidad<span style={{color: colors.accent}}></span>
              </h1>

              <p className="mobile-text-base" style={{
                ...typography.body,
                fontSize: '1.3rem',
                marginBottom: spacing.xl,
                color: 'rgba(255,255,255,0.95)',
                lineHeight: '1.7'
              }}>
                Habilidades que <span style={{fontWeight: '600'}}>transforman</span> tu trabajo.
              </p>

            {/* CTA */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing.md
            }}>
              <a href="#otros-programas" style={{ textDecoration: 'none' }}>
                <button className="mobile-w-full mobile-text-base hypnotic-button" style={{
                  background: 'linear-gradient(135deg, #FF6600 0%, #FF8533 100%)',
                  backgroundSize: '200% 200%',
                  color: colors.white,
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  padding: `${spacing.md} ${spacing.xl}`,
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 20px rgba(255, 102, 0, 0.5), 0 4px 15px rgba(255, 255, 255, 0.3)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                  position: 'relative',
                  overflow: 'hidden',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.7), 0 6px 20px rgba(255, 255, 255, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.5), 0 4px 15px rgba(255, 255, 255, 0.3)';
                }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>Explorar Cursos  →</span>
                </button>
              </a>
            </div>
          </div>

        </div>


        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

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
          {/* Header */}
          <div className="mobile-hidden" style={{
            textAlign: 'center',
            marginBottom: spacing.xxl
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: colors.primary,
              color: colors.white,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: spacing.md,
              textTransform: 'uppercase'
            }}>
              OFERTA ACADÉMICA
            </div>

            <h2 className="mobile-hero-title" style={{
              ...typography.h2,
              color: colors.primary,
              marginBottom: spacing.md
            }}>
              Las habilidades que definirán tu futuro profesional

            </h2>
            <h3 className="mobile-hero-title" style={{
              fontSize: '1.3rem',
              fontWeight: '500',
              color: colors.gray[600],
              lineHeight: '1.4',
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: spacing.lg
            }}>
            Cada programa está diseñado para ayudarte <span style={{ color: colors.accent, fontWeight: '700' }}>a recuperar tiempo,</span> trabajar con más confianza y generar más valor en tu día a día.
                        </h3>


          </div>

          {/* Featured Program - Estilo Institucional */}
          <div className="mobile-featured-program" style={{
            backgroundColor: colors.white,
            overflow: 'hidden',
            marginBottom: spacing.xl,
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="mobile-grid-1" style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Image */}
              <div className="mobile-p-sm mobile-featured-program-img" style={{
                padding: 0,
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden',
                borderRadius: '16px 16px 0 0',
                position: 'relative'
              }}>
                <img
                  src="/images/tuempleado_ia3.png"
                  alt="Aprende IA"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <canvas
                  id="particles-canvas"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* Content */}
              <div className="mobile-p-md" style={{
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  backgroundColor: colors.accent,
                  color: colors.white,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: '4px',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  marginBottom: spacing.xs,
                  alignSelf: 'center',
                  width: 'fit-content'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>🏆</span>
                  PROGRAMA RECOMENDADO
                </div>

                <h3 className="mobile-text-xl" style={{
                  ...typography.h3,
                  fontSize: '1.8rem',
                  color: colors.primary,
                  marginBottom: spacing.md,
                  fontWeight: '700'
                }}>
                  Aprende a dirigir la IA como si fuera tu mejor empleado
                </h3>

                <p style={{
                  ...typography.body,
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  color: colors.gray[600],
                  marginBottom: spacing.md
                }}>
                 Aprende una metodología práctica para trabajar junto a la inteligencia artificial, automatizar tareas repetitivas y dedicar más tiempo a lo que realmente genera valor.
                </p>

                

                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: colors.primary,
                  marginBottom: spacing.sm
                }}>
                  Lo que conseguirás
                </h4>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: `0 0 ${spacing.lg} 0`,
                  color: colors.gray[700],
                  fontSize: '1rem',
                  lineHeight: '1.8'
                }}>
                  <li style={{marginBottom: '0.5rem'}}>✔ Ahorrar varias horas cada semana en tareas repetitivas.</li>
                  <li style={{marginBottom: '0.5rem'}}>✔ Obtener mejores resultados con menos esfuerzo.</li>
                  <li style={{marginBottom: '0.5rem'}}>✔ Crear documentos, informes y presentaciones en minutos.</li>
                  <li style={{marginBottom: '0.5rem'}}>✔ Trabajar con más confianza en un entorno donde la IA ya forma parte del día a día.</li>
                </ul>

                <div className="mobile-button-container" style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'center' }}>
                  <Link href="/cursos/aprende-dirigir-ia" style={{ textDecoration: 'none' }}>
                    <button
                      className="mobile-nowrap-button"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.white,
                        border: 'none',
                        padding: `${spacing.md} ${spacing.xl}`,
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '1.05rem',
                        boxShadow: '0 4px 12px rgba(255,102,0,0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,102,0,0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,102,0,0.3)';
                      }}>
                      🟠 Quiero empezar
                    </button>
                  </Link>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: colors.gray[500],
                    fontStyle: 'italic'
                  }}>
                    Empieza a aplicar estas habilidades desde tu primera semana.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
            {courses.map((course, index) => (
              <Link key={index} href={`/cursos/${course.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="mobile-card-compact" style={{
                  backgroundColor: colors.white,
                  borderRadius: '8px',
                  padding: spacing.lg,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: `1px solid ${colors.gray[200]}`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  cursor: 'pointer'
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
                    <span style={{
                      fontWeight: '700',
                      fontSize: '1.2rem',
                      color: colors.accent
                    }}>
                      {loading ? 'S/ ' + course.priceGrabado : symbol + ' ' + convertPrice(course.priceGrabado)}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: colors.gray[400],
                      textDecoration: 'line-through'
                    }}>
                      {loading ? 'S/ ' + course.oldPriceGrabado : symbol + ' ' + convertPrice(course.oldPriceGrabado)}
                    </span>
                  </div>
                </div>

              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE HAMBURGER MENU BUTTON */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="mobile-hamburger"
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          width: '45px',
          height: '45px',
          borderRadius: '8px',
          backgroundColor: colors.accent,
          color: colors.white,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 999999,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'all 0.3s ease'
        }}
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
                alt="SMARTCHATIX"
                style={{
                  height: '60px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              <a
                href="#"
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
                onClick={() => setShowMobileMenu(false)}
              >
                Inicio
              </a>

              <Link
                href="/programas"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Programas
              </Link>

              <Link
                href="/cursos"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Cursos
              </Link>

              <Link
                href="/capacitacion"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Capacitación Empresarial
              </Link>

              <Link
                href="/mentorias"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Mentorías
              </Link>

              <Link
                href="/blog"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Blog
              </Link>

              <Link
                href="/contacto"
                style={{
                  textDecoration: 'none',
                  color: colors.gray[700],
                  fontWeight: '500',
                  padding: spacing.md,
                  borderRadius: '6px',
                  backgroundColor: colors.gray[50],
                  textAlign: 'center'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                Contacto
              </Link>

              <Link
                href="/masterclass"
                style={{
                  textDecoration: 'none'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                <button
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.white,
                    border: 'none',
                    padding: spacing.md,
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginTop: spacing.md,
                    width: '100%'
                  }}
                >
                  Masterclass Gratuita
                </button>
              </Link>
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