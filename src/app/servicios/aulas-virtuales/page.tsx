'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/layout/Header';
import StepsSection from '@/components/StepsSection';
import { Sparkles, BookOpen, Users, ChartColumnIncreasing, BadgeCheck, Workflow } from 'lucide-react';

export default function AulasVirtualesPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [showPilotModal, setShowPilotModal] = React.useState(false);
  const [pilotFormData, setPilotFormData] = React.useState({
    nombre: '',
    entidad: '',
    cargo: '',
    email: ''
  });
  const [sendingPilot, setSendingPilot] = React.useState(false);

  const handlePilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingPilot(true);

    try {
      const response = await fetch('/api/email/send-pilot-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pilotFormData)
      });

      if (response.ok) {
        alert('✅ ¡Solicitud enviada! Te contactaremos en menos de 24 horas.');
        setShowPilotModal(false);
        setPilotFormData({ nombre: '', entidad: '', cargo: '', email: '' });
      } else {
        alert('❌ Error al enviar la solicitud. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al enviar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setSendingPilot(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#1a1a1a'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }

          /* HERO MOBILE REDESIGN V2 */
          .hero-section {
            padding: 3rem 1.5rem 2rem !important;
            min-height: auto !important;
          }

          .laptop-container-desktop {
            display: none !important;
          }

          .hero-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }

          .hero-content {
            max-width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          /* Badge */
          .hero-content > div:first-child {
            margin-bottom: 1.25rem !important;
          }

          .hero-content > div:first-child span {
            font-size: 0.438rem !important;
            letter-spacing: 0.05em !important;
          }

          /* Título */
          .hero-content h1 {
            font-size: 26.4px !important;
            line-height: 1.15 !important;
            margin-bottom: 1rem !important;
            max-width: 100% !important;
            letter-spacing: -0.02em !important;
          }

          .hero-content h1 br {
            display: none;
          }

          /* Descripción */
          .hero-content > p {
            font-size: 1rem !important;
            margin-bottom: 1.75rem !important;
            max-width: 100% !important;
            line-height: 1.5 !important;
            color: rgba(203, 213, 225, 0.9) !important;
          }

          .hero-content > p br {
            display: none;
          }

          /* Contenedor de botones */
          .hero-content > div:nth-child(4) {
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.875rem !important;
            margin-bottom: 2rem !important;
          }

          .hero-content > div:nth-child(4) button {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.875rem 1.5rem !important;
            font-size: 0.9375rem !important;
          }

          /* Laptop móvil */
          .laptop-mobile-container {
            display: block !important;
            width: 75% !important;
            max-width: 320px !important;
            margin: 0 auto 0 !important;
            padding: 0 !important;
          }

          .laptop-mobile-container img {
            border-radius: 8px !important;
            filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.35)) !important;
          }

          /* Ocultar beneficios en móvil - el div después del laptop */
          .hero-content > div:last-child {
            display: none !important;
          }

          /* ORGANIZATIONS SECTION - MOBILE REDESIGN */
          .organizations-section {
            padding: 4rem 1.5rem !important;
          }

          .organizations-header {
            margin-bottom: 3rem !important;
            text-align: left !important;
          }

          .organizations-header h2 {
            font-size: 32px !important;
            margin-bottom: 0 !important;
            text-align: left !important;
          }

          .organizations-subtitle {
            display: none !important;
          }

          .organizations-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            margin-bottom: 0 !important;
          }

          .organizations-grid > div {
            border: none !important;
            border-radius: 0 !important;
            padding: 2rem 0 !important;
            background: transparent !important;
            border-bottom: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            transform: none !important;
          }

          .organizations-grid > div:last-child {
            border-bottom: none !important;
          }

          .organizations-grid > div > div:first-child {
            flex-direction: row !important;
            align-items: flex-start !important;
            margin-bottom: 0 !important;
          }

          .organizations-grid > div > div:first-child > div:first-child {
            width: 48px !important;
            height: 48px !important;
          }

          .organizations-grid > div > div:first-child > div:first-child img {
            width: 24px !important;
            height: 24px !important;
          }

          .organizations-grid > div > div:first-child > div:last-child h3 {
            font-size: 18px !important;
            margin-bottom: 0.5rem !important;
          }

          .organizations-grid > div > div:first-child > div:last-child p {
            font-size: 15px !important;
            line-height: 1.6 !important;
            color: #64748b !important;
          }

          .organizations-grid > div > ul {
            display: none !important;
          }

          /* PLATFORM FEATURES SECTION - MOBILE */
          .platform-features-header h2 {
            font-size: 24px !important;
          }
        }
      `}</style>

      <Header onPilotClick={() => setShowPilotModal(true)} />

      {/* Hero Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        background: '#0a0e27',
        backgroundImage: 'url(/images/background_hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh'
      }} className="fade-in-up hero-section">
        {/* Laptop Image - Background Layer */}
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60%',
          maxWidth: '960px',
          zIndex: 1,
          pointerEvents: 'none'
        }} className="laptop-container-desktop">
          {/* Glow morado detrás */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: -1
          }}></div>

          {/* Luz azul borde izquierdo */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.2) 0%, transparent 60%)',
            filter: 'blur(40px)',
            zIndex: -1
          }}></div>

          <Image
            src="/images/laptop.png"
            alt="SmartChatix Platform"
            width={1400}
            height={1050}
            priority
            style={{
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(0 50px 120px rgba(0, 0, 0, 0.5)) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))'
            }}
          />

          {/* Sombra suave debajo */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '10%',
            width: '80%',
            height: '20%',
            background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }}></div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }} className="hero-container">
          {/* Left Column - Content */}
          <div style={{ maxWidth: '600px' }} className="hero-content">
            <div style={{
              display: 'inline-block',
              background: 'transparent',
              padding: '0',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>PLATAFORMA PARA CAPACITACIÓN Y EDUCACIÓN</span>
            </div>

            <h1 style={{
              fontSize: '4rem',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '1.5rem',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              Crea mejores cursos <br/>con <span style={{
                background: 'linear-gradient(90deg, #6366f1 0%, #e91e63 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Tu asistente IA</span>
            </h1>

            <p style={{
              fontSize: '1.0625rem',
              color: '#cbd5e1',
              marginBottom: '2.5rem',
              lineHeight: '1.7',
              maxWidth: '520px'
            }}>
              Convierte tus ideas en cursos completos.<br/>
              Nuestra IA diseña, estructura y genera contenidos listos para<br/>
              enseñar.
            </p>

            {/* Laptop Image - MOBILE ONLY - Aparece después de descripción */}
            <div style={{ display: 'none' }} className="laptop-mobile-container">
              <Image
                src="/images/laptop.png"
                alt="SmartChatix Platform"
                width={1400}
                height={1050}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4))'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button
                onClick={() => setShowPilotModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
                }}
              >
                <span style={{ fontSize: '16px' }}>🚀</span>
                Participar en el piloto
              </button>

              <button
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1.5px solid currentColor',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>▶</span>
                Ver la plataforma
              </button>
            </div>

            {/* Features Pills */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '💎', text: 'IA que entiende\ntu contenido' },
                { icon: '👥', text: 'Ahorra horas\nde trabajo' },
                { icon: '📊', text: 'Cursos listos para\nenseñar y vender' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>{item.icon}</div>
                  <span style={{
                    fontSize: '13px',
                    color: '#cbd5e1',
                    fontWeight: '500',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-line',
                    paddingTop: '2px'
                  }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logos */}
        <div style={{
          maxWidth: '1400px',
          margin: '4rem auto 0',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            marginBottom: '2rem',
            fontWeight: '500'
          }}>
            Diseñada para la nueva generación de capacitación impulsada por IA.
          </p>
          {/* Aquí irían los logos */}
        </div>
      </section>

      {/* Steps Section */}
      <StepsSection />

      {/* Se adapta a tu organización */}
      <section style={{
        padding: '0rem 3rem 6rem',
        background: '#fafafa'
      }} className="organizations-section">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }} className="organizations-container">
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '6rem'
          }} className="organizations-header">
            <h2 style={{
              fontSize: '48px',
              fontWeight: '400',
              color: '#0a0e27',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Se adapta a{' '}
              <span style={{
                color: '#b209e7',
                fontWeight: '500'
              }}>
                tu organización
              </span>
            </h2>
            <p style={{
              fontSize: '17px',
              color: '#64748b',
              lineHeight: '1.8',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '400'
            }} className="organizations-subtitle">
              No todas las organizaciones enseñan de la misma manera.<br/>
              SmartChatix Academy se adapta a tus necesidades y procesos.
            </p>
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem',
            marginBottom: '5rem'
          }} className="organizations-grid">
            {[
              {
                iconSrc: '/icons/org-empresas.svg',
                iconBg: '#3b7fee',
                title: 'Empresas',
                titleColor: '#3b7fee',
                description: 'Capacita a tus colaboradores, comparte conocimiento y mide resultados de aprendizaje.',
                bullets: [
                  'Formación interna y onboarding',
                  'Reportes y seguimiento en tiempo real',
                  'Certificados y cumplimiento'
                ],
                link: '#'
              },
              {
                iconSrc: '/icons/org-academias.svg',
                iconBg: '#d209bc',
                title: 'Academias y consultoras',
                titleColor: '#d209bc',
                description: 'Publica, vende y administra cursos online bajo tu propia marca.',
                bullets: [
                  'Ciento de compras y pagos en línea',
                  'Gestión completa de estudiantes',
                  'Marketing y promociones integradas'
                ],
                link: '#'
              },
              {
                iconSrc: '/icons/org-instituciones.svg',
                iconBg: '#f87107',
                title: 'Instituciones educativas',
                titleColor: '#f87107',
                description: 'Gestiona programas académicos y comunidades de aprendizaje.',
                bullets: [
                  'Múltiples roles y permisos',
                  'Rutas de aprendizaje y programas',
                  'Integraciones con tus sistemas'
                ],
                link: '#'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  background: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header: Icon + Title + Description */}
                <div style={{
                  display: 'flex',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                  alignItems: 'flex-start'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Image
                      src={card.iconSrc}
                      alt={card.title}
                      width={32}
                      height={32}
                      style={{ width: '32px', height: '32px' }}
                    />
                  </div>

                  {/* Title + Description */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: card.titleColor,
                      marginBottom: '0.75rem',
                      letterSpacing: '-0.01em',
                      marginTop: 0
                    }}>
                      {card.title}
                    </h3>

                    <p style={{
                      fontSize: '16px',
                      color: '#64748b',
                      lineHeight: '1.7',
                      marginBottom: 0,
                      fontWeight: '400'
                    }}>
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bullets */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0'
                }}>
                  {card.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      fontSize: '16px',
                      color: '#475569',
                      lineHeight: '1.6'
                    }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: '#fff',
                        flexShrink: 0,
                        marginTop: '2px',
                        fontWeight: '600'
                      }}>✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '4rem'
          }}>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: 0
            }}>
              <span style={{
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>⚙️</span>
              ¿Tienes un proceso específico? Lo adaptamos para ti.
              <a
                href="#"
                style={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  fontWeight: '500',
                  marginLeft: '0.25rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d946ef';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8b5cf6';
                }}
              >
                Hablemos →
              </a>
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 1024px) {
            section > div > div:nth-child(2) {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            section > div > div:nth-child(2) > div:last-child {
              grid-column: 1 / -1;
              max-width: 50%;
              margin: 0 auto;
            }
          }

          @media (max-width: 768px) {
            section > div > div:nth-child(2) {
              grid-template-columns: 1fr !important;
              gap: 3rem !important;
            }
            section > div > div:nth-child(2) > div:last-child {
              max-width: 100%;
            }
          }
        `}</style>
      </section>


      {/* Todo lo que necesitas, en una sola plataforma */}
      <section style={{
        padding: '3.5rem 3rem 6rem',
        background: '#fafafa'
      }} className="platform-features-section">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '6rem'
          }} className="platform-features-header">
            <h2 style={{
              fontSize: '48px',
              fontWeight: '400',
              color: '#0a0e27',
              marginBottom: '0',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Una plataforma que centraliza todo el proceso de aprendizaje
            </h2>
          </div>

          {/* Features Grid - 6 columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '3.5rem'
          }}>
            {[
              {
                icon: Sparkles,
                title: 'Asistente IA',
                desc: 'Crea cursos, lecciones, quizzes y materiales en segundos.'
              },
              {
                icon: BookOpen,
                title: 'Gestión de cursos',
                desc: 'Organiza módulos, lecciones y recursos de forma simple y poderosa.'
              },
              {
                icon: Users,
                title: 'Gestión de estudiantes',
                desc: 'Matriculas, grupos, roles y comunicación en un solo lugar.'
              },
              {
                icon: ChartColumnIncreasing,
                title: 'Reportes y analíticas',
                desc: 'Visualiza el progreso y toma decisiones basadas en datos reales.'
              },
              {
                icon: BadgeCheck,
                title: 'Certificados',
                desc: 'Automáticos, personalizados y con verificación de autenticidad.'
              },
              {
                icon: Workflow,
                title: 'Integraciones',
                desc: 'Conecta con tus herramientas favoritas y sistemas existentes.'
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    textAlign: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
                    if (iconContainer) {
                      iconContainer.style.transform = 'translateY(-2px)';
                      iconContainer.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
                    if (iconContainer) {
                      iconContainer.style.transform = 'translateY(0)';
                      iconContainer.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.08)';
                    }
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className="icon-container"
                    style={{
                      width: '72px',
                      height: '72px',
                      margin: '0 auto 2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(217, 70, 239, 0.08) 100%)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <IconComponent
                      size={40}
                      strokeWidth={2}
                      style={{
                        color: '#8b5cf6'
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0a0e27',
                    marginBottom: '0.875rem',
                    lineHeight: '1.3'
                  }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 1280px) {
            section > div > div:nth-child(2) {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }

          @media (max-width: 768px) {
            section > div > div:nth-child(2) {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 2rem !important;
            }
          }

          @media (max-width: 480px) {
            section > div > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* CTA Final */}
      <section style={{
        padding: '4rem 3rem',
        background: '#0a0e27',
        backgroundImage: 'url(/images/background_hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4rem'
        }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '600',
              lineHeight: '1.3',
              color: '#ffffff',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em'
            }}>
              ¿Listo para transformar<br/>la forma en que enseñas?
            </h2>
            <p style={{
              fontSize: '17px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              margin: 0
            }}>
              Solicita una demostración personalizada y descubre<br/>
              todo lo que SmartChatix Academy puede hacer por ti.
            </p>
          </div>

          {/* Divisor sutil */}
          <div style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
            flexShrink: 0
          }}></div>

          {/* Button Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.75rem'
          }}>
            <button
              onClick={() => setShowPilotModal(true)}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                color: '#fff',
                border: 'none',
                padding: '18px 38px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 0 0 rgba(139, 92, 246, 0), 0 8px 24px rgba(139, 92, 246, 0.35)',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 32px 8px rgba(139, 92, 246, 0.25), 0 12px 32px rgba(139, 92, 246, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(139, 92, 246, 0), 0 8px 24px rgba(139, 92, 246, 0.35)';
              }}
            >
              Participar en el piloto
            </button>

            {/* Microcopy de confianza */}
            <span style={{
              fontSize: '13px',
              color: 'rgba(203, 213, 225, 0.7)',
              fontWeight: '400',
              letterSpacing: '0.01em'
            }}>
              ✓ Respuesta en menos de 24 horas
            </span>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            section > div {
              flex-direction: column !important;
              text-align: center !important;
              gap: 2.5rem !important;
            }
            section > div > div:first-child {
              text-align: center !important;
            }
            section > div > div:nth-child(2) {
              display: none !important;
            }
            section > div > div:last-child {
              align-items: center !important;
              width: 100%;
            }
            section > div > div:last-child button {
              width: 90% !important;
            }
            section h2 br {
              display: none;
            }
            section p br {
              display: none;
            }
          }
        `}</style>
      </section>

      <Footer />

      {/* Modal Piloto */}
      {showPilotModal && (
        <div
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
            padding: '1rem'
          }}
          onClick={() => setShowPilotModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '3rem',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPilotModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                lineHeight: '1'
              }}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '48px' }}>🚀</span>
            </div>

            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#0a0e27',
              textAlign: 'center'
            }}>
              Participar en el piloto
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Estamos seleccionando las primeras organizaciones para probar SmartChatix Academy. Déjanos tus datos y te contactamos.
            </p>

            <form onSubmit={handlePilotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input
                type="text"
                placeholder="Nombre completo *"
                required
                value={pilotFormData.nombre}
                onChange={(e) => setPilotFormData({ ...pilotFormData, nombre: e.target.value })}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="text"
                placeholder="Organización *"
                required
                value={pilotFormData.entidad}
                onChange={(e) => setPilotFormData({ ...pilotFormData, entidad: e.target.value })}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="text"
                placeholder="Cargo"
                value={pilotFormData.cargo}
                onChange={(e) => setPilotFormData({ ...pilotFormData, cargo: e.target.value })}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="email"
                placeholder="Correo electrónico *"
                required
                value={pilotFormData.email}
                onChange={(e) => setPilotFormData({ ...pilotFormData, email: e.target.value })}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />

              <button
                type="submit"
                disabled={sendingPilot}
                style={{
                  background: sendingPilot ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: sendingPilot ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                {sendingPilot ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Contacto */}
      {showModal && (
        <div
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
            padding: '1rem'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '3rem',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                lineHeight: '1'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#0a0e27'
            }}>
              Solicita tu demostración
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              marginBottom: '2rem'
            }}>
              Te contactaremos en menos de 24 horas
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input
                type="text"
                placeholder="Nombre completo *"
                required
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="email"
                placeholder="Email corporativo *"
                required
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="tel"
                placeholder="Teléfono *"
                required
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="text"
                placeholder="Empresa u organización"
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <select
                required
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#64748b'
                }}
              >
                <option value="">¿Qué te interesa? *</option>
                <option>Capacitación empresarial</option>
                <option>Crear mi academia online</option>
                <option>Vender cursos</option>
                <option>Otro</option>
              </select>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Solicitar demostración
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
