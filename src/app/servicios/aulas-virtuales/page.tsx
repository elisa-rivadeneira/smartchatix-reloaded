'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function AulasVirtualesPage() {
  const [showModal, setShowModal] = React.useState(false);

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
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000,
        padding: '1rem 3rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/">
            <Image
              src="/images/logo_smartchatix_horiz.png"
              alt="SmartChatix"
              width={160}
              height={50}
              style={{ cursor: 'pointer' }}
            />
          </Link>

          <nav className="mobile-hidden" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Funciones
            </Link>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Para empresas
            </Link>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Para creadores
            </Link>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Casos de uso
            </Link>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Precios
            </Link>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Recursos
            </Link>
            <Link href="/login" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Iniciar sesión
            </Link>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }}
            >
              Solicitar demostración
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '6rem 3rem 4rem',
        background: '#0a0e27',
        backgroundImage: 'url(/images/background_hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }} className="fade-in-up">
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Column */}
          <div>
            <div style={{
              display: 'inline-block',
              background: 'transparent',
              padding: '0',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#94a3b8',
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
              Crea cursos increíbles<br/>con <span style={{
                background: 'linear-gradient(90deg, #6366f1 0%, #e91e63 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>IA en minutos</span>
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

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button
                onClick={() => setShowModal(true)}
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
                <span style={{ fontSize: '16px' }}>📖</span>
                Solicitar demostración
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

          {/* Right Column - Mockup */}
          <div style={{
            position: 'relative'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Simplified Mockup */}
              <div style={{
                background: '#1e293b',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  color: '#8b5cf6',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>✨</span>
                  Asistente de Diseño de Cursos IA
                </div>
                <div style={{
                  color: '#cbd5e1',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  Conversa con la IA para estructurar tu curso
                </div>
              </div>

              {/* Chat messages */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  background: '#6366f1',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  marginBottom: '0.8rem'
                }}>
                  ¿Cuánto tiempo de curso tienes planificado?
                </div>

                <div style={{
                  background: '#334155',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  marginLeft: '2rem'
                }}>
                  30 horas
                </div>
              </div>

              {/* Structure Preview */}
              <div style={{
                background: '#f0fdf4',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid #86efac'
              }}>
                <div style={{
                  color: '#059669',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  ✓ Estructura propuesta
                </div>
                <div style={{ fontSize: '12px', color: '#047857', lineHeight: '1.8' }}>
                  <div>📖 <strong>Módulo 1:</strong> Introducción a la IA</div>
                  <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    • Fundamentos (30 min)<br/>
                    • Aplicaciones prácticas (30 min)
                  </div>
                </div>
              </div>

              <button style={{
                width: '100%',
                background: '#8b5cf6',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                ✓ Crear curso con esta estructura
              </button>
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
            Más de 1,000 creadores y empresas ya confían en SmartChatix
          </p>
          {/* Aquí irían los logos */}
        </div>
      </section>

      {/* Así funciona SmartChatix */}
      <section style={{
        padding: '6rem 3rem',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#0a0e27',
              marginBottom: '1rem'
            }}>
              Así funciona <span style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>SmartChatix</span>
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Un flujo simple para crear experiencias de aprendizaje increíbles
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem'
          }}>
            {[
              {
                icon: '💡',
                title: '1. Diseña tu curso',
                desc: 'La IA te ayuda a estructurar módulos, lecciones y objetivos en minutos.'
              },
              {
                icon: '▶️',
                title: '2. Agrega contenido',
                desc: 'Sube videos, documentos, textos, audios y más.'
              },
              {
                icon: '📝',
                title: '3. Evalúa y asigna tareas',
                desc: 'Crea cuestionarios, tareas y rúbricas de evaluación.'
              },
              {
                icon: '👥',
                title: '4. Invita estudiantes',
                desc: 'Inscribe colaboradores o alumnos de tu curso.'
              },
              {
                icon: '📊',
                title: '5. Haz seguimiento',
                desc: 'Monitorea el progreso con reportes en tiempo real.'
              },
              {
                icon: '🎓',
                title: '6. Certifica',
                desc: 'Emite certificados automáticos al completar.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '2rem 1.5rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#0a0e27',
                  marginBottom: '0.75rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Una plataforma, dos formas de enseñar */}
      <section style={{
        padding: '6rem 3rem',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#0a0e27',
              marginBottom: '1rem'
            }}>
              Una plataforma, dos formas de enseñar
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem'
          }}>
            {/* Para Empresas */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '20px',
              padding: '3rem',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>

              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                🏢 PARA EMPRESAS
              </div>

              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                Capacita a tu equipo<br/>y mide resultados
              </h3>

              <p style={{
                fontSize: '1rem',
                color: '#dbeafe',
                marginBottom: '2rem',
                lineHeight: '1.7'
              }}>
                Centraliza la capacitación de tu organización, asigna el compromiso y desarrollo del talento de tu equipo.
              </p>

              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Cursos de inducción y entrenamiento',
                  'Cumplimiento normativo',
                  'Evaluaciones y reportes',
                  'Certificados corporativos',
                  'Roles y permisos personalizados'
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>✓</div>
                    <span style={{ fontSize: '0.9rem' }}>{item}</span>
                  </div>
                ))}
              </div>

              <button style={{
                background: '#fff',
                color: '#1d4ed8',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                Conoce la solución para empresas
              </button>
            </div>

            {/* Para Creadores */}
            <div style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              borderRadius: '20px',
              padding: '3rem',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>

              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                👨‍🏫 PARA CREADORES
              </div>

              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                Crea tu academia<br/>y vende cursos online
              </h3>

              <p style={{
                fontSize: '1rem',
                color: '#fce7f3',
                marginBottom: '2rem',
                lineHeight: '1.7'
              }}>
                Construye tu marca, publica tus cursos y haz crecer tu negocio de educación con contenido de técnica.
              </p>

              <div style={{ marginBottom: '2rem' }}>
                {[
                  'Tu propia academia online',
                  'Página de ventas integrada',
                  'Gestión de estudiantes',
                  'Certificados personalizados',
                  'Cobros y matrículas'
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: '#fbbf24',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>✓</div>
                    <span style={{ fontSize: '0.9rem' }}>{item}</span>
                  </div>
                ))}
              </div>

              <button style={{
                background: '#fff',
                color: '#8b5cf6',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                Conoce la solución para creadores
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Todo lo que necesitas */}
      <section style={{
        padding: '6rem 3rem',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#0a0e27',
              marginBottom: '1rem'
            }}>
              Todo lo que necesitas para enseñar sin límites
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🤖',
                title: 'Asistente IA',
                desc: 'Crea estructuras, contenidos, quizzes y más sin esfuerzo.'
              },
              {
                icon: '📹',
                title: 'Lecciones flexibles',
                desc: 'Videos, textos, markdown, PDFs, quizzes, y más.'
              },
              {
                icon: '❓',
                title: 'Quizzes inteligentes',
                desc: 'La IA programa respuestas apropiadas para cada tema.'
              },
              {
                icon: '✍️',
                title: 'Tareas y asignaciones',
                desc: 'Recibe entregas, califica y da feedback.'
              },
              {
                icon: '📜',
                title: 'Certificados automáticos',
                desc: 'Personalizados con tu logo y código de verificación.'
              },
              {
                icon: '📊',
                title: 'Reportes y analíticas',
                desc: 'Visualiza el progreso y desempeño en tiempo real.'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#f9fafb',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#0a0e27',
                  marginBottom: '0.75rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegir SmartChatix? */}
      <section style={{
        padding: '6rem 3rem',
        background: '#f9fafb'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#0a0e27',
            marginBottom: '3rem'
          }}>
            ¿Por qué elegir SmartChatix?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            {[
              { icon: '💎', title: 'Tú Cuentas, Tus Datos', desc: 'Mantienes control total en tu propia servidor e infraestructura.' },
              { icon: '⚡', title: 'IA que sí Acompaña', desc: 'IA IA te ayuda en todo el proceso, no es solo alcanza.' },
              { icon: '🎯', title: 'Implementación Rápida', desc: 'Agiliza los tiempos de configuración y actualización en cada paso del proceso.' },
              { icon: '🛡️', title: 'Seguridad y Privacidad', desc: 'Cumple con las políticas internas de tu empresa y normativas.' },
              { icon: '📈', title: 'Escalable', desc: 'Desde pequeños equipos hasta grandes organización.' },
              { icon: '🤝', title: 'Soporte Humano', desc: 'Entrenamiento contigo antes, durante y después de la implementación.' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid #e5e7eb',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#0a0e27',
                  marginBottom: '0.5rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        padding: '6rem 3rem',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            ¿Listo para transformar<br/>la forma en que enseñas<br/>o capacitas?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            marginBottom: '3rem',
            lineHeight: '1.7'
          }}>
            Solicita una demostración personalizada y descubre<br/>
            todo lo que SmartChatix puede hacer por ti.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                color: '#fff',
                border: 'none',
                padding: '18px 36px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
              }}
            >
              📅 Solicitar demostración
            </button>

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '18px 36px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              💬 Hablar con un especialista
            </button>
          </div>
        </div>
      </section>

      <Footer />

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
