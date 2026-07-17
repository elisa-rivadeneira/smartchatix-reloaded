'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function SmartChatixAcademyPage() {
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

        @keyframes gradientShift {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animated-gradient {
          display: inline-block;
          background: linear-gradient(90deg, #0066CC, #00D9FF, #FF00FF, #00D9FF, #0066CC);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s linear infinite;
        }

        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
        }
      `}</style>

      {/* Header Minimalista */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f0f0f0',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/">
            <img
              src="/images/logo_samartchatix.png"
              alt="SmartChatix"
              style={{ height: '40px', cursor: 'pointer' }}
            />
          </Link>

          <div className="mobile-hidden" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/cursos" style={{
              color: '#666',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}>
              Cursos
            </Link>
            <Link href="/login">
              <button style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                Crear mi Academia
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '8rem 3rem 6rem',
        backgroundImage: 'url(/images/aulavirtual_hero.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        textAlign: 'center'
      }} className="fade-in-up">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 18, 39, 0.62)',
          zIndex: 1
        }}></div>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 className="animated-gradient" style={{
            fontSize: '4.5rem',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            La plataforma para crear cursos con Inteligencia Artificial
          </h1>

          <p style={{
            fontSize: '1.4rem',
            color: '#f0f9ff',
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            Desde la idea hasta el certificado. SmartChatix Academy ayuda a docentes y estudiantes en cada paso del camino.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(135deg, #0066CC 0%, #00D9FF 100%)',
                color: '#fff',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(0, 102, 204, 0.4)'
              }}
            >
              Solicitar una demostración →
            </button>
          </div>

        </div>
      </section>

      {/* Diseña, Desarrolla, Publica */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              color: '#000',
              marginBottom: '1rem'
            }}>
              Diseña. Desarrolla. Publica.
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              La IA te acompaña en cada etapa para que crear cursos profesionales sea más rápido, fácil y eficiente.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem'
          }}>
            {/* Paso 1: Diseña */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.8rem'
              }}>
                1️⃣
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#000',
                marginBottom: '0.8rem'
              }}>
                Diseña
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                La IA te ayuda a transformar tu idea en una estructura pedagógica completa, detectando módulos y lecciones de contenido que tengas o mediante chat inteligente.
              </p>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <img
                  src="/images/paso1_disena.png"
                  alt="Diseña tu curso con IA"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Paso 2: Desarrolla */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0066CC 0%, #00D9FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.8rem'
              }}>
                2️⃣
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#000',
                marginBottom: '0.8rem'
              }}>
                Desarrolla
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                Genera contenido de calidad con ayuda de la IA. Crea lecciones, sube recursos, diseña evaluaciones inteligentes y genera preguntas automáticamente.
              </p>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <img
                  src="/images/paso2_desarrolla.png"
                  alt="Desarrolla contenido con IA"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Paso 3: Publica */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.8rem'
              }}>
                3️⃣
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#000',
                marginBottom: '0.8rem'
              }}>
                Publica
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                Publica tu curso en un solo paso y ponto a disposición de tus estudiantes. Gestiona el progreso, resultados y más desde un solo lugar.
              </p>
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}>
                <img
                  src="/images/paso3_publica.png"
                  alt="Publica y gestiona tu curso"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ff6b6b',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem'
            }}>
              El problema
            </p>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Crear cursos no debería<br/>
              ser tan complicado
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Los docentes pierden semanas estructurando contenido, creando evaluaciones y organizando recursos. El proceso es lento, desorganizado y repetitivo.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                emoji: '⏰',
                title: 'Tiempo perdido',
                desc: 'Horas creando evaluaciones manualmente'
              },
              {
                emoji: '📝',
                title: 'Desorganización',
                desc: 'Contenido disperso sin estructura clara'
              },
              {
                emoji: '🔄',
                title: 'Trabajo repetitivo',
                desc: 'Las mismas tareas una y otra vez'
              },
              {
                emoji: '😰',
                title: 'Falta de control',
                desc: 'No saber qué falta por completar'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.emoji}</div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#000'
                }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solución */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#10b981',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1rem'
            }}>
              La solución
            </p>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              La IA te acompaña<br/>
              en cada paso
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              SmartChatix Academy no solo almacena contenido. La Inteligencia Artificial participa activamente en todo el ciclo: creación, organización, enseñanza y certificación.
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '3rem',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem'
            }}>
              {[
                { icon: '💡', label: 'Diseño de estructura' },
                { icon: '✏️', label: 'Creación de contenido' },
                { icon: '📚', label: 'Organización pedagógica' },
                { icon: '✅', label: 'Generación de evaluaciones' },
                { icon: '📊', label: 'Seguimiento de progreso' },
                { icon: '🎓', label: 'Certificación automática' }
              ].map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.8rem'
                  }}>{item.icon}</div>
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: '#000'
                  }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona - Flujo Visual */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Del concepto al certificado
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Un recorrido completo guiado por IA
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {[
              { step: '1', title: 'Idea del curso', desc: 'El docente tiene una idea o contenido existente' },
              { step: '2', title: 'Asistente IA conversa', desc: 'La IA hace preguntas o analiza el contenido pegado' },
              { step: '3', title: 'Propuesta de estructura', desc: 'La IA genera módulos, lecciones y duración estimada' },
              { step: '4', title: 'El profesor decide', desc: 'Edita, reorganiza o acepta la propuesta' },
              { step: '5', title: 'Carga de contenido', desc: 'Videos, PDFs, recursos - con indicadores visuales' },
              { step: '6', title: 'Publicación', desc: 'El curso queda disponible para los estudiantes' },
              { step: '7', title: 'Aprendizaje activo', desc: 'Estudiantes avanzan lección por lección' },
              { step: '8', title: 'Evaluaciones', desc: 'Cuestionarios generados automáticamente por IA' },
              { step: '9', title: 'Certificado', desc: 'Emisión automática al completar requisitos' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                background: idx % 2 === 0 ? '#fafafa' : '#fff',
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  minWidth: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#000',
                    marginBottom: '0.3rem'
                  }}>{item.title}</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#666'
                  }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseña tu curso con IA */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Dos formas de empezar
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666'
            }}>
              Elige la que mejor se adapte a tu flujo de trabajo
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '2rem'
          }}>
            {/* Opción 1 */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2.5rem',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1.5rem'
              }}>📋</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#000',
                marginBottom: '1rem'
              }}>Pega tu contenido</h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                Ya generaste el curso en ChatGPT, Claude o Gemini. Simplemente pégalo aquí.
              </p>
              <div style={{
                background: '#fafafa',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#000', fontWeight: '600', marginBottom: '0.8rem' }}>
                  La IA detecta automáticamente:
                </p>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.2rem',
                  fontSize: '0.9rem',
                  color: '#666',
                  lineHeight: '1.8'
                }}>
                  <li>Módulos principales</li>
                  <li>Lecciones por módulo</li>
                  <li>Duración estimada</li>
                  <li>Organización pedagógica</li>
                </ul>
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: '#999',
                fontStyle: 'italic'
              }}>
                ✨ Perfecto si ya tienes el contenido listo
              </p>
            </div>

            {/* Opción 2 */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2.5rem',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1.5rem'
              }}>💬</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#000',
                marginBottom: '1rem'
              }}>Conversa con la IA</h3>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                Aún no tienes contenido. El Asistente Pedagógico te guiará mediante preguntas.
              </p>
              <div style={{
                background: '#fafafa',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#000', fontWeight: '600', marginBottom: '0.8rem' }}>
                  La IA te pregunta sobre:
                </p>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.2rem',
                  fontSize: '0.9rem',
                  color: '#666',
                  lineHeight: '1.8'
                }}>
                  <li>Tema del curso</li>
                  <li>Público objetivo</li>
                  <li>Duración estimada</li>
                  <li>Objetivos de aprendizaje</li>
                </ul>
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: '#999',
                fontStyle: 'italic'
              }}>
                ✨ Ideal para crear desde cero
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#000',
              fontWeight: '600'
            }}>
              En ambos casos: <span style={{ color: '#10b981' }}>tú decides si aceptar la propuesta</span>
            </p>
          </div>
        </div>
      </section>

      {/* Tú siempre tienes el control */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            lineHeight: '1.2',
            color: '#000',
            marginBottom: '1.5rem'
          }}>
            Tú siempre tienes el control
          </h2>
          <p style={{
            fontSize: '1.3rem',
            color: '#666',
            marginBottom: '3rem',
            lineHeight: '1.7'
          }}>
            La IA <strong style={{ color: '#000' }}>propone</strong>. El profesor <strong style={{ color: '#000' }}>decide</strong>.
          </p>

          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: '3rem 2rem',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              {[
                { icon: '✏️', text: 'Edita módulos' },
                { icon: '➕', text: 'Agrega lecciones' },
                { icon: '🗑️', text: 'Elimina contenido' },
                { icon: '🔄', text: 'Reorganiza el curso' },
                { icon: '✅', text: 'Acepta cuando estés listo' }
              ].map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{item.icon}</div>
                  <p style={{ fontSize: '1rem', fontWeight: '500', color: '#000' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{
            marginTop: '2.5rem',
            fontSize: '1.1rem',
            color: '#666',
            fontStyle: 'italic'
          }}>
            La IA elimina el trabajo repetitivo. Tú te enfocas en enseñar.
          </p>
        </div>
      </section>

      {/* Producción del contenido */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Completa tu curso<br/>
              sin perder el control
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              La plataforma muestra visualmente qué lecciones ya están completas y cuáles aún necesitan contenido.
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {/* Lección completa */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem',
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>✓</div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#000',
                    marginBottom: '0.2rem'
                  }}>Lección 1.1: Introducción</p>
                  <p style={{ fontSize: '0.85rem', color: '#10b981' }}>Video, PDF y evaluación agregados</p>
                </div>
              </div>

              {/* Lección incompleta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem',
                background: '#fef3c7',
                border: '2px dashed #fbbf24',
                borderRadius: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fbbf24',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>⚠</div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#000',
                    marginBottom: '0.2rem'
                  }}>Lección 1.2: Conceptos básicos</p>
                  <p style={{ fontSize: '0.85rem', color: '#d97706' }}>Falta agregar contenido</p>
                </div>
              </div>

              <p style={{
                marginTop: '1rem',
                fontSize: '0.95rem',
                color: '#666',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Nunca pierdes el rastro de qué falta por completar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia del estudiante */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Experiencia del estudiante
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Un recorrido claro desde la matrícula hasta el certificado
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { num: '1', title: 'Se matricula', desc: 'Acceso inmediato al curso' },
              { num: '2', title: 'Visualiza módulos', desc: 'Estructura clara y ordenada' },
              { num: '3', title: 'Avanza lección a lección', desc: 'Progreso paso a paso' },
              { num: '4', title: 'Responde cuestionarios', desc: 'Evaluación continua' },
              { num: '5', title: 'Completa requisitos', desc: 'Seguimiento automático' },
              { num: '6', title: 'Recibe certificado', desc: 'Emisión automática' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '2rem 1.5rem',
                background: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#000',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  margin: '0 auto 1.2rem'
                }}>{item.num}</div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#000',
                  marginBottom: '0.5rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificación automática */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '2rem'
          }}>🎓</div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            Certificación automática
          </h2>
          <p style={{
            fontSize: '1.3rem',
            color: '#ccc',
            marginBottom: '3rem',
            lineHeight: '1.7',
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            No más emisión manual de certificados. Cuando el estudiante cumple los requisitos definidos por el instructor, el sistema genera y entrega el certificado automáticamente.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              { icon: '⏱️', text: 'Ahorro de tiempo para el instructor' },
              { icon: '📊', text: 'Control total de requisitos' },
              { icon: '✅', text: 'Emisión instantánea' },
              { icon: '🏢', text: 'Ideal para empresas y academias' }
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{item.icon}</div>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#ccc'
                }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativa */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              LMS tradicional vs<br/>
              SmartChatix Academy
            </h2>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{
                    padding: '1.5rem',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#000',
                    borderBottom: '1px solid #e0e0e0'
                  }}>Característica</th>
                  <th style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#666',
                    borderBottom: '1px solid #e0e0e0'
                  }}>LMS Tradicional</th>
                 
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Diseño de estructura del curso', traditional: '❌', smartchatix: '✅ IA asistida' },
                  { feature: 'Generación de evaluaciones', traditional: '❌ Manual', smartchatix: '✅ Automático con IA' },
                  { feature: 'Organización pedagógica', traditional: '⚠️ Manual', smartchatix: '✅ Sugerida por IA' },
                  { feature: 'Indicadores visuales de progreso', traditional: '❌', smartchatix: '✅' },
                  { feature: 'Asistente conversacional', traditional: '❌', smartchatix: '✅ IA pedagógica' },
                  { feature: 'Certificación automática', traditional: '⚠️ Limitada', smartchatix: '✅ Completa' },
                  { feature: 'Detección de contenido pegado', traditional: '❌', smartchatix: '✅' }
                ].map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: idx < 6 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <td style={{
                      padding: '1.2rem 1.5rem',
                      fontSize: '0.95rem',
                      color: '#000',
                      fontWeight: '500'
                    }}>{row.feature}</td>
                    <td style={{
                      padding: '1.2rem 1.5rem',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      color: '#666'
                    }}>{row.traditional}</td>
                    <td style={{
                      padding: '1.2rem 1.5rem',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      color: '#10b981',
                      fontWeight: '600'
                    }}>{row.smartchatix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section style={{
        padding: '6rem 3rem',
        backgroundColor: '#fff'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#000',
              marginBottom: '1.5rem'
            }}>
              Diseñado para diferentes necesidades
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '👨‍🏫',
                title: 'Docentes',
                desc: 'Crea y vende tus cursos sin depender de plataformas que se quedan con tu audiencia'
              },
              {
                icon: '🏢',
                title: 'Empresas',
                desc: 'Capacita a tu equipo con cursos internos y certifica automáticamente'
              },
              {
                icon: '🎓',
                title: 'Academias',
                desc: 'Escala tu oferta educativa sin contratar más personal administrativo'
              },
              {
                icon: '🏛️',
                title: 'Universidades',
                desc: 'Digitaliza programas completos con acompañamiento IA en todo el proceso'
              },
              {
                icon: '💼',
                title: 'Consultores',
                desc: 'Monetiza tu conocimiento mediante cursos estructurados profesionalmente'
              },
              {
                icon: '📚',
                title: 'Capacitadores corporativos',
                desc: 'Reduce tiempo de preparación y enfócate en el contenido de valor'
              }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '2.5rem',
                background: '#fafafa',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem'
                }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '1rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
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
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            Crea tu primera<br/>
            academia hoy
          </h2>
          <p style={{
            fontSize: '1.4rem',
            color: '#ccc',
            marginBottom: '3rem',
            lineHeight: '1.7'
          }}>
            La IA te acompañará desde la idea hasta el certificado
          </p>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '18px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
            }}
          >
            Solicitar una demostración →
          </button>

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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '2.5rem',
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
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#000'
            }}>
              Crea tu academia
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '2rem'
            }}>
              Te contactaremos para activar tu plataforma
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input
                type="text"
                placeholder="Nombre completo"
                required
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                required
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                required
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              <select
                required
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '15px',
                  outline: 'none'
                }}
              >
                <option value="">Tipo de institución</option>
                <option>Academia</option>
                <option>Universidad</option>
                <option>Empresa</option>
                <option>Docente independiente</option>
              </select>

              <button
                type="submit"
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Solicitar activación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
