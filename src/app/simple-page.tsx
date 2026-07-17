'use client';

import React from 'react';

export default function SimplePage() {
  // Agregar estilos de animación directamente
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.1; }
        50% { transform: scale(1.1); opacity: 0.3; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.6' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #24292f 0%, #0969da 50%, #0366d6 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        borderRadius: '16px',
        marginBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(9, 105, 218, 0.15), 0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Elementos geométricos elegantes */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(9, 105, 218, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, rgba(26, 127, 55, 0.08), rgba(251, 133, 0, 0.08))',
          borderRadius: '20px',
          transform: 'rotate(45deg)',
          opacity: '0.6'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '4rem',
            margin: '0 0 24px 0',
            fontWeight: '700',
            color: '#ffffff',
            fontFamily: 'var(--font-poppins)',
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
SmartChatix
          </h1>
          <div style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #0969da, #1a7f37)',
            margin: '24px auto',
            borderRadius: '2px'
          }}></div>
          <p style={{
            fontSize: '1.4rem',
            margin: '0',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.5px'
          }}>
            Donde la Ingeniería se encuentra con la Innovación
          </p>
          <p style={{
            fontSize: '1rem',
            margin: '16px 0 0 0',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: '400',
            letterSpacing: '0.3px'
          }}>
            CFD • Simulación Industrial • Turbomáquinas • Bombas Centrífugas
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        marginBottom: '80px',
        padding: '100px 40px',
        background: 'linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(9, 105, 218, 0.1)',
        boxShadow: '0 8px 32px rgba(9, 105, 218, 0.08)'
      }}>
        {/* Elementos decorativos elegantes */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(9, 105, 218, 0.06) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(26, 127, 55, 0.06) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Etiqueta superior elegante */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0969da, #1a7f37)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(9, 105, 218, 0.2)',
            letterSpacing: '0.5px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            🚀 #1 EN LATINOAMÉRICA • +15,000 INGENIEROS FORMADOS
          </div>

        <h2 style={{
          fontSize: '3.5rem',
          color: '#24292f',
          marginBottom: '24px',
          fontWeight: '700',
          fontFamily: 'var(--font-poppins)',
          lineHeight: '1.2',
          letterSpacing: '0.5px'
        }}>
          Convierte tu pasión por la{' '}
          <span style={{
            background: 'linear-gradient(135deg, #0969da, #1a7f37)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            ingeniería
          </span>
          <br />
          en una carrera{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B35, #0047AB)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            extraordinaria
          </span>
        </h2>

        <p style={{
          fontSize: '1.3rem',
          color: '#656d76',
          marginBottom: '40px',
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          Únete a los <strong style={{ color: '#0969da' }}>ingenieros más exitosos de Latinoamérica</strong> que dominan
          CFD, bombas centrífugas, turbomáquinas y simulación industrial con
          <strong style={{ color: '#1a7f37' }}> proyectos reales de empresas Fortune 500</strong>.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: 'linear-gradient(135deg, #0969da 0%, #0366d6 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 32px',
            fontSize: '1.1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(9, 105, 218, 0.2)',
            transition: 'all 0.2s ease',
            textTransform: 'none',
            letterSpacing: '0.3px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(9, 105, 218, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #0366d6 0%, #0250bd 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 105, 218, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #0969da 0%, #0366d6 100%)';
          }}
          >
            🚀 Explorar Programas
          </button>

          <button style={{
            background: 'transparent',
            color: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '20px 40px',
            fontSize: '1.2rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '700',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35, #0047AB)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 107, 53, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05))';
            e.currentTarget.style.color = '#FF6B35';
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            📥 Guía Gratuita
          </button>
        </div>
        </div>
      </section>

      {/* Featured Program */}
      <section style={{ marginBottom: '60px', position: 'relative' }}>
        {/* Elementos decorativos vibrantes */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-100px',
          width: '400px',
          height: '400px',
          background: 'conic-gradient(from 45deg, #FF0080, #7928CA, #FF6B35, #10B981, #3B82F6, #FF0080)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'spin 30s linear infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, #EC4899 0%, #7C3AED 50%, #3B82F6 100%)',
          borderRadius: '50%',
          opacity: '0.15',
          filter: 'blur(60px)'
        }}></div>

        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative', zIndex: 2 }}>
          {/* Badge especial vibrante */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #FF0080, #FFFF00, #00FF80)',
            color: '#1A0033',
            padding: '12px 25px',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: '900',
            marginBottom: '25px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            boxShadow: '0 0 30px rgba(255,0,128,0.8), 0 0 60px rgba(255,255,0,0.4)',
            border: '2px solid #FFFFFF',
            textShadow: '0 0 5px rgba(255,255,255,0.8)'
          }}>
            ⭐ PROGRAMA ESTRELLA • MÁS VENDIDO
          </div>

          <h3 style={{
            fontSize: '3rem',
            color: '#24292f',
            marginBottom: '20px',
            fontFamily: 'var(--font-poppins)',
            fontWeight: '700',
            lineHeight: '1.2',
            letterSpacing: '0.5px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #0969da, #1a7f37)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SmartChatix
            </span>{' '}
            <span style={{
              color: '#24292f',
              fontWeight: '700'
            }}>
              PUMP ENGINEER
            </span>
            <br />
            <span style={{
              fontSize: '2rem',
              color: '#64748b',
              fontWeight: '400'
            }}>
              PROGRAM
            </span>
          </h3>

          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            El único programa en Latinoamérica que combina <strong style={{ color: '#0047AB' }}>teoría de élite</strong> con
            <strong style={{ color: '#FF6B35' }}> proyectos reales de la industria</strong>
          </p>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div>
              <h4 style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '15px' }}>
                Lo que aprenderás:
              </h4>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                {[
                  'Selección de bombas centrífugas',
                  'Curvas H-Q y análisis de rendimiento',
                  'Cálculo de NPSH y cavitación',
                  'Redes hidráulicas industriales',
                  'Simulación CFD con ANSYS CFX',
                  'Diseño de turbomáquinas',
                  'Casos prácticos de minería'
                ].map((item, index) => (
                  <li key={index} style={{
                    marginBottom: '8px',
                    padding: '5px 0',
                    borderLeft: '3px solid #3b82f6',
                    paddingLeft: '15px',
                    color: '#475569'
                  }}>
                    ✅ {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h4 style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '15px' }}>
                Detalles del Programa
              </h4>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                  <span style={{ color: '#64748b' }}>⏱️ Duración:</span>
                  <strong>165 horas</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                  <span style={{ color: '#64748b' }}>👥 Estudiantes:</span>
                  <strong>1,200+</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                  <span style={{ color: '#64748b' }}>⭐ Rating:</span>
                  <strong>4.9/5</strong>
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '15px 0', borderTop: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a8a' }}>$1,297</div>
                <div style={{ fontSize: '1rem', color: '#64748b', textDecoration: 'line-through' }}>$1,891</div>
                <div style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '600' }}>
                  Ahorras $594
                </div>
              </div>

              <button style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}>
                🚀 Inscribirme Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '10px' }}>
            15 Cursos Especializados
          </h3>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
            Desde fundamentos hasta técnicas avanzadas
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            {
              title: 'Selección y Operación de Bombas Centrífugas',
              category: 'Bombas y Turbomáquinas',
              level: 'Intermedio',
              duration: '40 horas',
              price: '$297',
              originalPrice: '$497',
              students: '1,250',
              rating: '4.8'
            },
            {
              title: 'Simulación CFD de Bombas con ANSYS CFX',
              category: 'CFD y Simulación',
              level: 'Avanzado',
              duration: '50 horas',
              price: '$497',
              originalPrice: '$697',
              students: '580',
              rating: '4.9'
            },
            {
              title: 'Diseño de Turbomáquinas con CFturbo',
              category: 'Bombas y Turbomáquinas',
              level: 'Avanzado',
              duration: '45 horas',
              price: '$597',
              originalPrice: '$797',
              students: '320',
              rating: '4.7'
            }
          ].map((course, index) => (
            <div key={index} style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{
                height: '120px',
                borderRadius: '8px',
                marginBottom: '15px',
                backgroundImage: `url(${
                  index === 0
                    ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    : index === 1
                    ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    : 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.8))',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  {index === 0 ? '⚙️' : index === 1 ? '🌊' : '🔧'}
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  background: course.level === 'Básico' ? '#dcfce7' : course.level === 'Intermedio' ? '#fef3c7' : '#fee2e2',
                  color: course.level === 'Básico' ? '#166534' : course.level === 'Intermedio' ? '#92400e' : '#991b1b',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {course.level}
                </span>
              </div>

              <h4 style={{
                fontSize: '1.2rem',
                color: '#1e3a8a',
                marginBottom: '10px',
                lineHeight: '1.3',
                height: '3em',
                overflow: 'hidden'
              }}>
                {course.title}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>
                <span>⏱️ {course.duration}</span>
                <span>👥 {course.students}</span>
                <span>⭐ {course.rating}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a' }}>
                    {course.price}
                  </span>
                  <span style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    textDecoration: 'line-through',
                    marginLeft: '10px'
                  }}>
                    {course.originalPrice}
                  </span>
                </div>

                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Ver Curso
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Magnet */}
      <section style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1591720022870-75b4d98be3b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        borderRadius: '15px',
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(254, 247, 238, 0.95), rgba(254, 215, 170, 0.95))',
          borderRadius: '15px'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '2.5rem', color: '#ea580c', marginBottom: '15px' }}>
          🎯 Descarga GRATIS
        </h3>
        <h4 style={{ fontSize: '2rem', color: '#1e3a8a', marginBottom: '20px' }}>
          "10 Errores Comunes al Seleccionar una Bomba Centrífuga"
        </h4>
        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Guía práctica de 25 páginas que te ayudará a evitar los errores más costosos
          en la selección de bombas centrífugas para aplicaciones industriales.
        </p>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '400px',
          margin: '0 auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Tu nombre completo"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                marginBottom: '15px',
                fontSize: '1rem'
              }}
            />
            <input
              type="email"
              placeholder="tu.correo@ejemplo.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                marginBottom: '15px',
                fontSize: '1rem'
              }}
            />
            <input
              type="tel"
              placeholder="+51 999 999 999"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '1rem'
              }}
            />
          </div>

          <button style={{
            background: 'linear-gradient(135deg, #ea580c, #dc2626)',
            color: 'white',
            border: 'none',
            padding: '15px 25px',
            fontSize: '1.1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
            boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
          }}>
            📥 Descargar Guía GRATIS
          </button>

          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '15px' }}>
            🔒 Información segura • 📧 Sin spam • ✅ Descarga inmediata
          </p>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1e293b',
        color: 'white',
        padding: '30px 20px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>SmartChatix</h4>
          <p style={{ opacity: '0.8', marginBottom: '20px' }}>
            La academia online líder en Latinoamérica especializada en ingeniería, CFD y simulación industrial.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div>
            <h5 style={{ marginBottom: '10px', color: '#3b82f6' }}>Contacto</h5>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>📧 info@smartchatix.com</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>📱 +51 999 999 999</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>📍 Lima, Perú</p>
          </div>

          <div>
            <h5 style={{ marginBottom: '10px', color: '#3b82f6' }}>Estadísticas</h5>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>👥 15,000+ Estudiantes</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>🏢 150+ Empresas</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>⭐ 95% Satisfacción</p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #475569',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '0.9rem', opacity: '0.7' }}>
            © 2025 SmartChatix. Todos los derechos reservados.
          </p>
          <div>
            <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', margin: '0 10px' }}>LinkedIn</a>
            <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', margin: '0 10px' }}>YouTube</a>
            <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', margin: '0 10px' }}>WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1000'
      }}>
        <button style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'white',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Contáctanos por WhatsApp"
        >
          💬
        </button>
      </div>
    </div>
  );
}