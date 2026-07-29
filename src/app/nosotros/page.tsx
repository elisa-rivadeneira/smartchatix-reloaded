'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function NosotrosPage() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      backgroundColor: '#ffffff',
      color: '#1a1a1a'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

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

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .hero-text {
          animation: fadeUp 0.8s ease-out;
        }

        .hero-metric {
          animation: fadeUp 0.8s ease-out;
        }

        .hero-metric:nth-child(1) { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .hero-metric:nth-child(2) { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .hero-metric:nth-child(3) { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }

        .floating-card {
          animation: float 3s ease-in-out infinite;
          backdrop-filter: blur(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .hero-image-container {
            margin-left: auto !important;
            margin-right: auto !important;
            width: 70% !important;
          }
        }

        @media (max-width: 768px) {
          .hero-image-container {
            width: 100% !important;
          }
          .floating-card:nth-child(n+3) {
            display: none !important;
          }
        }
      `}</style>

      <Header />

      {/* Hero Section */}
      <section style={{
        height: '650px',
        paddingTop: '0',
        paddingBottom: '0',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        background: '#070a23',
        backgroundImage: 'url(/images/background_hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Particles Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.4,
          pointerEvents: 'none'
        }}>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#8b5cf6',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particleFloat ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)'
            }}></div>
          ))}
        </div>

        {/* Radial Gradient Overlays */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow 4s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow 5s ease-in-out infinite',
          animationDelay: '1s',
          pointerEvents: 'none'
        }}></div>

        <div className="hero-grid" style={{
          maxWidth: '1480px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: '0',
          alignItems: 'start',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Content */}
          <div className="hero-text" style={{
            paddingRight: '4rem',
            paddingTop: '15%'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#8b5cf6',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              NOSOTROS
            </div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              lineHeight: '0.95',
              color: '#ffffff',
              marginBottom: '2rem',
              letterSpacing: '-0.03em'
            }}>
              No enseñamos tecnología.<br/>
              Enseñamos una<br/>
              <span style={{
                background: 'linear-gradient(135deg, #ff4fd8 0%, #7b61ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(255, 79, 216, 0.3)',
                filter: 'drop-shadow(0 0 20px rgba(123, 97, 255, 0.4))'
              }}>
                nueva forma de trabajar.
              </span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: '1.7',
              marginBottom: '2.5rem',
              maxWidth: '540px'
            }}>
              En SmartChatix ayudamos a profesionales, emprendedores<br/>
              y empresas a ahorrar tiempo, tomar mejores decisiones<br/>
              y generar más valor gracias a la inteligencia artificial.
            </p>

          </div>

          {/* Right Image - Integrated */}
          <div className="hero-image-container" style={{
            position: 'relative',
            height: '650px',
            marginLeft: '-100px',
            transform: 'translateZ(0)'
          }}>
            {/* Image with Gradients */}
            <div style={{
              position: 'relative',
              height: '100%',
              width: '100%'
            }}>
              <img
                src="/images/hero_nosotros.png"
                alt="SmartChatix Team"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '0',
                  filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
                  mixBlendMode: 'luminosity'
                }}
              />

              {/* Left Gradient Fade */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(7,10,35,0.95) 0%, rgba(7,10,35,0.65) 30%, rgba(7,10,35,0.15) 65%, rgba(7,10,35,0) 100%)',
                pointerEvents: 'none'
              }}></div>

              {/* Bottom Gradient Fade */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(7,10,35,0) 0%, rgba(7,10,35,0) 60%, rgba(7,10,35,0.4) 85%, rgba(7,10,35,0.7) 100%)',
                pointerEvents: 'none'
              }}></div>

              {/* Corner Vignette */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,10,35,0.6) 100%)',
                pointerEvents: 'none'
              }}></div>

              {/* Color Grading - Blue/Magenta */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.1) 100%)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none'
              }}></div>
            </div>

            {/* Floating Cards with Benefits */}
            {[
              { text: '✨', type: 'sparkle', position: { top: '12%', left: '10%' }, delay: '0s' },
              { text: 'Más tiempo para crear', type: 'text', position: { top: '50%', right: '15%' }, delay: '0.5s' },
              { text: 'IA aplicada al trabajo real', type: 'text', position: { bottom: '15%', left: '12%' }, delay: '1s' },
              { text: 'Menos tareas repetitivas', type: 'text', position: { bottom: '15%', right: '10%' }, delay: '0.3s' }
            ].map((benefit, idx) => (
              <div key={idx} className="floating-card" style={{
                position: 'absolute',
                ...benefit.position,
                padding: benefit.type === 'sparkle' ? '1.25rem' : '1rem 1.5rem',
                borderRadius: '14px',
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: benefit.type === 'sparkle'
                  ? '0 8px 32px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 8px 32px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                animationDelay: benefit.delay,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}>
                {benefit.type === 'sparkle' ? (
                  <div style={{
                    fontSize: '2rem',
                    color: '#fbbf24',
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
                    animation: 'glow 2s ease-in-out infinite'
                  }}>
                    {benefit.text}
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.3)',
                      border: '2px solid #8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{
                      fontSize: '15px',
                      color: '#ffffff',
                      fontWeight: '600',
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      whiteSpace: 'nowrap'
                    }}>
                      {benefit.text}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section style={{
        padding: '6rem 3rem',
        background: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#8b5cf6',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              NUESTRA HISTORIA
            </div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '400',
              color: '#0a0e27',
              lineHeight: '1.3',
              marginBottom: '1.5rem'
            }}>
              La evolución del trabajo<br/>
              <span style={{ color: '#8b5cf6', fontWeight: '500' }}>nos trajo hasta aquí.</span>
            </h2>

            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              lineHeight: '1.8',
              maxWidth: '800px'
            }}>
              Desde la primera herramienta hasta la inteligencia artificial,<br/>
              cada avance tecnológico ha transformado cómo trabajamos.<br/>
              Para la diferencia la hacen las personas que aprenden a<br/>
              aprovecharla para crear más valor.
            </p>

            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              lineHeight: '1.8',
              marginTop: '2rem',
              maxWidth: '800px'
            }}>
              SmartChatix nace para empoderar a las personas y organizaciones<br/>
              a evolucionar su forma de trabajar, poniendo la tecnología<br/>
              al servicio de lo que realmente importa: las personas.
            </p>
          </div>

          {/* Right Image */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src="/images/timeline_evolution.png"
              alt="Evolución del trabajo"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section style={{
        padding: '6rem 3rem',
        background: '#fafafa'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem'
        }}>
          {/* Misión */}
          <div style={{
            background: '#ffffff',
            padding: '3rem',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              fontSize: '2rem'
            }}>
              🎯
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#8b5cf6',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              MISIÓN
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#0a0e27',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              Ayudamos a personas y organizaciones<br/>
              a trabajar mejor gracias a la IA.
            </h3>

            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              lineHeight: '1.7'
            }}>
              Capacitamos, automatizamos y desarrollamos soluciones<br/>
              que permiten ahorrar tiempo, tomar mejores decisiones<br/>
              y generar más valor en el trabajo diario.
            </p>
          </div>

          {/* Visión */}
          <div style={{
            background: '#ffffff',
            padding: '3rem',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              fontSize: '2rem'
            }}>
              👁️
            </div>

            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#d946ef',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              VISIÓN
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#0a0e27',
              marginBottom: '1rem',
              lineHeight: '1.3'
            }}>
              Ser la plataforma de referencia en Latinoamérica<br/>
              para trabajar mejor con IA.
            </h3>

            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              lineHeight: '1.7'
            }}>
              Queremos que cuando alguien piense "quiero aprender a trabajar<br/>
              mejor con inteligencia artificial", piense automáticamente en nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* Principios */}
      <section style={{
        padding: '6rem 3rem',
        background: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '5rem'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#8b5cf6',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              NUESTROS PRINCIPIOS
            </div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '400',
              color: '#0a0e27',
              lineHeight: '1.3'
            }}>
              Así hacemos las cosas en <span style={{ color: '#8b5cf6', fontWeight: '500' }}>SmartChatix</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem',
            marginBottom: '5rem'
          }}>
            {[
              { icon: '👥', title: 'Las personas\nprimero', desc: 'La tecnología solo tiene\nsentido cuando mejora\nla vida de las personas.' },
              { icon: '✅', title: 'Enseñamos\nresultados', desc: 'No enseñamos herramientas.\nEnseñamos cómo trabajar\nmejor.' },
              { icon: '💡', title: 'Simplicidad', desc: 'Explicamos lo complejo\nde forma clara\ny práctica.' },
              { icon: '🚀', title: 'Aprendizaje\npráctico', desc: 'Todo lo que enseñamos\nse puede aplicar desde\nel primer día.' },
              { icon: '🎨', title: 'Innovación con\npropósito', desc: 'Creamos soluciones que\nresuelven problemas\nreales.' },
              { icon: '📈', title: 'Mejora\ncontinua', desc: 'Aprender nunca termina.\nLa evolución profesional\ntampoco.' }
            ].map((principle, idx) => (
              <div key={idx} style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem'
                }}>
                  {principle.icon}
                </div>

                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0a0e27',
                  marginBottom: '1rem',
                  lineHeight: '1.3',
                  whiteSpace: 'pre-line'
                }}>
                  {principle.title}
                </h3>

                <p style={{
                  fontSize: '0.9375rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}>
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofía Section */}
      <section style={{
        padding: '6rem 3rem',
        background: '#0a0e27',
        color: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            color: '#8b5cf6',
            marginBottom: '2rem',
            textTransform: 'uppercase'
          }}>
            IMAGINAMOS UN MUNDO DONDE...
          </div>

          <h2 style={{
            fontSize: '2.75rem',
            fontWeight: '300',
            lineHeight: '1.3',
            marginBottom: '3rem'
          }}>
            Trabajemos menos en lo rutinario<br/>
            y más en lo que <span style={{
              background: 'linear-gradient(90deg, #d946ef 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '500'
            }}>nos hace humanos.</span>
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
            marginTop: '4rem',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '🧠', label: 'Pensar' },
              { icon: '✨', label: 'Crear' },
              { icon: '💡', label: 'Innovar' },
              { icon: '🎓', label: 'Enseñar' },
              { icon: '🤝', label: 'Acompañar' },
              { icon: '😊', label: 'Vivir mejor' }
            ].map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '4rem',
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '4rem auto 0'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              La productividad tiene sentido cuando<br/>
              ayuda a vivir mejor. Por eso trabajamos,<br/>
              cada día para transformar la forma en que<br/>
              las personas trabajan.
            </p>
            <p style={{
              fontStyle: 'italic',
              fontSize: '1.25rem',
              color: '#8b5cf6',
              marginTop: '2rem'
            }}>
              El equipo de SmartChatix
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '1rem 3rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '500',
            marginBottom: '1.5rem',
            lineHeight: '1.3'
          }}>
           El futuro del trabajo no empieza mañana.<br/>
           Empieza hoy con SmartChatix.
          </h2>

          <a
            href="https://wa.me/51968374191?text=Hola,%20me%20gustaría%20conocer%20cómo%20SmartChatix%20puede%20ayudar%20a%20mi%20empresa.%20¿Podrían%20brindarme%20más%20información?"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#ffffff',
              color: '#8b5cf6',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            }}
          >
            Conversemos
          </a>
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
