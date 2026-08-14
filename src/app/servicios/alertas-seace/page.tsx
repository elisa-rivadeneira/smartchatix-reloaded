'use client';

import React from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/layout/Header';
import { Bell, Zap, Target, Clock, Database, Bot } from 'lucide-react';

const SEACE_SEGMENTS = [
  '10 - Materiales vivos de origen animal y vegetal',
  '11 - Minerales, textiles y productos vegetales y animales no comestibles',
  '12 - Sustancias químicas',
  '13 - Resinas, breas, cauchos y compuestos de madera',
  '14 - Productos de papel',
  '15 - Combustibles, aditivos, materiales conexos y productos nucleares',
  '20 - Equipamiento y componentes de minería y perforación de pozos',
  '21 - Equipo y accesorios de agricultura, pesca, silvicultura y fauna',
  '22 - Equipo y suministros para la construcción',
  '23 - Estructuras y material de construcción y fabricación',
  '24 - Mobiliario, equipamiento y decoración',
  '25 - Vehículos comerciales y militares y accesorios',
  '26 - Vehículos de pasajeros y accesorios',
  '27 - Herramientas y maquinaria general',
  '30 - Maquinaria y accesorios para la fabricación y procesamiento industrial',
  '31 - Maquinaria para la manufactura y procesamiento de alimentos y bebidas',
  '32 - Equipos y suministros de embalaje y almacenamiento',
  '39 - Equipos y suministros eléctricos',
  '40 - Equipamiento de distribución y acondicionamiento',
  '41 - Equipo y suministros de laboratorio y medición',
  '42 - Equipos médicos, accesorios y suministros',
  '43 - Tecnologías de la Información',
  '44 - Equipos de oficina, accesorios y suministros',
  '45 - Equipos de impresión, fotográficos, audiovisuales y de telecomunicaciones',
  '46 - Equipos de defensa, orden público, seguridad, protección y vigilancia',
  '47 - Equipos y suministros de limpieza',
  '48 - Equipamiento para servicios y materiales',
  '49 - Equipamiento y suministros deportivos y recreacionales',
  '50 - Alimentos, bebidas y tabaco',
  '51 - Drogas y productos farmacéuticos',
  '52 - Productos de uso doméstico y personal',
  '53 - Prendas de vestir',
  '54 - Relojes, joyas y accesorios',
  '55 - Medios de comunicación impresos, publicados y transmitidos',
  '56 - Mobiliario',
  '60 - Instrumentos musicales, juegos, juguetes, artes y artesanías',
  '70 - Servicios de agricultura, pesca, silvicultura y fauna',
  '71 - Servicios de minería, petróleo y gas',
  '72 - Servicios de construcción y mantenimiento de edificios',
  '73 - Servicios industriales de producción y manufactura',
  '76 - Servicios de limpieza, eliminación de desechos y protección ambiental',
  '77 - Servicios ambientales',
  '78 - Servicios de transporte, almacenamiento y correo',
  '80 - Servicios de gestión, empresa profesionales y administrativos',
  '81 - Servicios de ingeniería, investigación y tecnología',
  '82 - Servicios editoriales, diseño, gráficos y bellas artes',
  '83 - Servicios públicos y relacionados',
  '84 - Servicios financieros y de seguros',
  '85 - Servicios de salud',
  '86 - Servicios de educación y formación',
  '90 - Servicios de restaurantes, hostelería y catering',
  '91 - Servicios personales y domésticos',
  '92 - Servicios de organización de eventos, entretenimiento y recreación',
  '93 - Servicios políticos y de asuntos públicos',
  '94 - Organizaciones y clubes'
];

export default function AlertasSEACEPage() {
  const [showPilotModal, setShowPilotModal] = React.useState(false);
  const [pilotFormData, setPilotFormData] = React.useState({
    nombre: '',
    empresa: '',
    cargo: '',
    email: '',
    whatsapp: '',
    segmentos: [] as string[]
  });
  const [sendingPilot, setSendingPilot] = React.useState(false);
  const [searchSegment, setSearchSegment] = React.useState('');

  const handlePilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pilotFormData.segmentos.length === 0) {
      alert('⚠️ Selecciona al menos un segmento de interés');
      return;
    }

    setSendingPilot(true);

    try {
      const response = await fetch('/api/email/send-pilot-seace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pilotFormData)
      });

      if (response.ok) {
        alert('✅ ¡Solicitud enviada! Te contactaremos en menos de 24 horas.');
        setShowPilotModal(false);
        setPilotFormData({ nombre: '', empresa: '', cargo: '', email: '', whatsapp: '', segmentos: [] });
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

  const toggleSegment = (segment: string) => {
    setPilotFormData(prev => ({
      ...prev,
      segmentos: prev.segmentos.includes(segment)
        ? prev.segmentos.filter(s => s !== segment)
        : [...prev.segmentos, segment]
    }));
  };

  const filteredSegments = SEACE_SEGMENTS.filter(s =>
    s.toLowerCase().includes(searchSegment.toLowerCase())
  );

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

      <Header
        onPilotClick={() => setShowPilotModal(true)}
        pilotButtonColor="yellow"
        hideLoginButton={true}
      />

      {/* HERO SECTION */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 2rem',
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4rem'
        }}>
          <div style={{ maxWidth: '700px', flex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(247, 201, 72, 0.15)',
              border: '1px solid rgba(247, 201, 72, 0.3)',
              borderRadius: '50px',
              padding: '0.5rem 1.25rem',
              marginBottom: '2rem'
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#f7c948',
                letterSpacing: '0.5px'
              }}>
                🤖 AGENTE IA SEACE
              </span>
            </div>

            <h1 className="fade-in-up" style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              Nunca más pierdas una<br />
              <span style={{ color: '#f7c948' }}>licitación importante</span>
            </h1>

            <p className="fade-in-up" style={{
              fontSize: '1.25rem',
              lineHeight: '1.8',
              marginBottom: '3rem',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Tu asistente inteligente monitorea 24/7 las convocatorias de SEACE en más de 90 segmentos,
              te alerta por WhatsApp y responde tus preguntas en tiempo real.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowPilotModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f7c948 0%, #e6b830 100%)',
                  color: '#1e3a5f',
                  padding: '1rem 2.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(247, 201, 72, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(247, 201, 72, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(247, 201, 72, 0.3)';
                }}
              >
                🚀 Participar en el piloto
              </button>
            </div>
          </div>

          <div className="mobile-hidden" style={{
            position: 'relative',
            flex: '0 0 auto',
            width: '400px',
            height: '600px'
          }}>
            <Image
              src={`/images/celular_whats.png?v=${Date.now()}`}
              alt="WhatsApp SEACE"
              width={400}
              height={600}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))'
              }}
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section style={{
        padding: '6rem 2rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '4rem',
            color: '#1e3a5f'
          }}>
            ¿Por qué usar nuestro Agente IA?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: <Bell size={32} />,
                title: 'Alertas instantáneas',
                description: 'Recibe notificaciones en WhatsApp apenas se publique una convocatoria en tus segmentos.'
              },
              {
                icon: <Database size={32} />,
                title: '90+ segmentos monitoreados',
                description: 'Desde tecnología hasta construcción, cubrimos todas las categorías de SEACE.'
              },
              {
                icon: <Bot size={32} />,
                title: 'IA conversacional',
                description: 'Pregunta por WhatsApp sobre cualquier licitación y obtén respuestas instantáneas.'
              },
              {
                icon: <Target size={32} />,
                title: 'Scoring inteligente',
                description: 'Cada convocatoria viene con un puntaje de relevancia basado en tus preferencias.'
              },
              {
                icon: <Clock size={32} />,
                title: 'Ahorra 15-20 horas/semana',
                description: 'Deja de revisar manualmente SEACE todos los días. El agente lo hace por ti.'
              },
              {
                icon: <Zap size={32} />,
                title: 'Ventaja competitiva',
                description: 'Entérate antes que tu competencia y prepara mejores propuestas.'
              }
            ].map((benefit, i) => (
              <div key={i} style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  color: '#f7c948',
                  marginBottom: '1rem'
                }}>
                  {benefit.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#1e3a5f'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#6b7280'
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8a 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            color: '#ffffff'
          }}>
            Únete al programa piloto
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '3rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Selecciona tus segmentos de interés y empieza a recibir alertas inteligentes en menos de 24 horas.
          </p>
          <button
            onClick={() => setShowPilotModal(true)}
            style={{
              background: 'linear-gradient(135deg, #f7c948 0%, #e6b830 100%)',
              color: '#1e3a5f',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(247, 201, 72, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            🚀 Comenzar ahora
          </button>
        </div>
      </section>

      <Footer />

      {/* MODAL PILOTO */}
      {showPilotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }} onClick={() => setShowPilotModal(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPilotModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '0.25rem',
              color: '#1e3a5f'
            }}>
              🚀 Únete al Piloto SEACE
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1.25rem'
            }}>
              Completa tus datos y selecciona los segmentos que te interesan
            </p>

            <form onSubmit={handlePilotSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={pilotFormData.nombre}
                  onChange={(e) => setPilotFormData({ ...pilotFormData, nombre: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={pilotFormData.empresa}
                  onChange={(e) => setPilotFormData({ ...pilotFormData, empresa: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ej: Constructora XYZ S.A.C."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Cargo (opcional)
                </label>
                <input
                  type="text"
                  value={pilotFormData.cargo}
                  onChange={(e) => setPilotFormData({ ...pilotFormData, cargo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ej: Gerente de Licitaciones"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={pilotFormData.email}
                  onChange={(e) => setPilotFormData({ ...pilotFormData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ej: juan@empresa.com"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Número WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={pilotFormData.whatsapp}
                  onChange={(e) => setPilotFormData({ ...pilotFormData, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ej: +51 999 999 999"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '0.35rem',
                  color: '#374151'
                }}>
                  Segmentos a monitorear * ({pilotFormData.segmentos.length} seleccionados)
                </label>

                <input
                  type="text"
                  value={searchSegment}
                  onChange={(e) => setSearchSegment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem'
                  }}
                  placeholder="🔍 Buscar segmento..."
                />

                <div style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  {filteredSegments.map((segment) => (
                    <label key={segment} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.4rem',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s',
                      marginBottom: '0.15rem',
                      backgroundColor: pilotFormData.segmentos.includes(segment) ? '#eff6ff' : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        checked={pilotFormData.segmentos.includes(segment)}
                        onChange={() => toggleSegment(segment)}
                        style={{
                          marginRight: '0.6rem',
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#374151',
                        fontWeight: pilotFormData.segmentos.includes(segment) ? '600' : '400'
                      }}>
                        {segment}
                      </span>
                    </label>
                  ))}
                  {filteredSegments.length === 0 && (
                    <p style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      padding: '2rem'
                    }}>
                      No se encontraron segmentos
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingPilot}
                style={{
                  width: '100%',
                  background: sendingPilot ? '#9ca3af' : 'linear-gradient(135deg, #f7c948 0%, #e6b830 100%)',
                  color: '#1e3a5f',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: sendingPilot ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem'
                }}
              >
                {sendingPilot ? 'Enviando...' : '✅ Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
