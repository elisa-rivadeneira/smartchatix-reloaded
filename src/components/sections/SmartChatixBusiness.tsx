'use client';

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

export default function SmartChatixBusiness() {
  return (
    <>
      <section style={{
        backgroundColor: '#071D38',
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="business-container" style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingTop: '60px',
          paddingBottom: '60px',
          position: 'relative',
          backgroundImage: 'url(/images/smartchatix_empresas2.png)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Degradado azul sobre la imagen */}
          <div className="business-gradient" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #071D38 0%, #071D38 10%, rgba(7, 29, 56, 0.95) 20%, rgba(7, 29, 56, 0.85) 30%, rgba(7, 29, 56, 0.7) 40%, rgba(7, 29, 56, 0.5) 50%, rgba(7, 29, 56, 0.3) 60%, rgba(7, 29, 56, 0.1) 70%, rgba(7, 29, 56, 0) 80%)',
            pointerEvents: 'none',
            zIndex: 1
          }}></div>
          <div className="business-content" style={{
            maxWidth: '650px',
            position: 'relative',
            zIndex: 2
          }}>
              {/* Badge */}
              <div style={{
                display: 'inline-block',
                backgroundColor: '#8B5CF6',
                color: colors.white,
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '24px'
              }}>
                PARA EMPRESAS
              </div>

              {/* Título */}
              <h2 style={{
                fontSize: '41px',
                fontWeight: '800',
                lineHeight: '1.05',
                letterSpacing: '-1px',
                color: colors.white,
                marginBottom: '20px',
                maxWidth: '560px'
              }}>
                ¿También quieres transformar tu <span style={{ color: colors.accent }}>empresa</span>?
              </h2>

              {/* Imagen móvil - solo visible en móvil */}
              <div className="business-mobile-image" style={{
                display: 'none',
                marginBottom: '24px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img
                  src="/images/smartchatix_empresas2.png"
                  alt="SmartChatix Business"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>

              {/* Subtítulo */}
              <p style={{
                fontSize: '21px',
                fontWeight: '600',
                lineHeight: '1.4',
                color: colors.white,
                marginBottom: '16px',
                maxWidth: '620px'
              }}>
                Capacitar a tu equipo es solo el <span style={{
                  color: '#60A5FA',
                  fontWeight: '700'
                }}>primer paso</span>.
              </p>

              {/* Descripción */}
              <p style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '36px',
                maxWidth: '620px'
              }}>
                En SmartChatix Business diseñamos soluciones de inteligencia artificial para empresas que desean reducir tiempos, automatizar procesos y aumentar su productividad.
              </p>

              {/* Servicios Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px 32px',
                marginBottom: '36px'
              }}>
                {/* Servicio 1 */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px'
                  }}>
                    ⚡
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: colors.white,
                      marginBottom: '4px'
                    }}>
                      Automatización de procesos
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Elimina tareas repetitivas y recupera tiempo valioso.
                    </p>
                  </div>
                </div>

                {/* Servicio 2 */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px'
                  }}>
                    🔗
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: colors.white,
                      marginBottom: '4px'
                    }}>
                      Integraciones con ERP y CRM
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Conecta tus sistemas para trabajar de forma integrada.
                    </p>
                  </div>
                </div>

                {/* Servicio 3 */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px'
                  }}>
                    🤖
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: colors.white,
                      marginBottom: '4px'
                    }}>
                      Empleados digitales con IA
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Asistentes inteligentes que trabajan 24/7.
                    </p>
                  </div>
                </div>

                {/* Servicio 4 */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px'
                  }}>
                    💻
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: colors.white,
                      marginBottom: '4px'
                    }}>
                      Desarrollo de software a medida
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Soluciones personalizadas para tu industria.
                    </p>
                  </div>
                </div>

                {/* Servicio 5 - span completo */}
                <div style={{ display: 'flex', gap: '16px', gridColumn: '1 / -1' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#06B6D4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px'
                  }}>
                    📊
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: colors.white,
                      marginBottom: '4px'
                    }}>
                      Dashboards e inteligencia de negocios
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Toma decisiones basadas en datos en tiempo real.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                {/* Botón Principal */}
                <button style={{
                  padding: '16px 32px',
                  backgroundColor: colors.accent,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '28px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(255, 102, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 102, 0, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 102, 0, 0.4)';
                }}>
                  Conoce SmartChatix Business
                  <span style={{ fontSize: '18px' }}>→</span>
                </button>

                {/* Agenda reunión */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(96, 165, 250, 0.15)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    📅
                  </div>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: colors.white,
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      Agenda una reunión gratuita
                    </p>
                    <p style={{
                      fontSize: '12px',
                      lineHeight: '1.3',
                      color: 'rgba(255, 255, 255, 0.65)',
                      margin: 0
                    }}>
                      y descubre cómo podemos ayudarte.
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Media Queries */}
        <style>{`
          @media (max-width: 1024px) {
            .business-container {
              background-size: cover !important;
              background-position: center !important;
            }

            .business-content {
              text-align: center;
              max-width: 100% !important;
            }

            .business-content h2,
            .business-content p {
              margin-left: auto;
              margin-right: auto;
            }

            .business-content > div[style*="display: inline-block"] {
              display: inline-block !important;
            }

            .business-content button {
              margin-left: auto;
              margin-right: auto;
              display: block;
            }

            .business-content > div:last-of-type {
              margin-left: auto;
              margin-right: auto;
            }
          }

          @media (max-width: 900px) {
            .business-content > div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }

            .business-content > div[style*="grid-template-columns"] > div[style*="grid-column"] {
              grid-column: 1 !important;
            }
          }

          @media (max-width: 768px) {
            .business-container {
              padding-left: 24px !important;
              padding-right: 24px !important;
              padding-top: 40px !important;
              padding-bottom: 40px !important;
              background-image: none !important;
            }

            .business-gradient {
              display: none !important;
            }

            .business-mobile-image {
              display: block !important;
            }

            .business-content h2 {
              font-size: 1.4rem !important;
              line-height: 1.3 !important;
              letter-spacing: -0.5px !important;
              margin-bottom: 16px !important;
            }

            .business-content p:first-of-type {
              font-size: 1.05rem !important;
              line-height: 1.6 !important;
              margin-bottom: 12px !important;
            }

            .business-content p:nth-of-type(2) {
              font-size: 1rem !important;
              line-height: 1.6 !important;
              margin-bottom: 24px !important;
            }

            .business-content > div[style*="display: inline-block"] {
              font-size: 0.7rem !important;
              padding: 0.3rem 0.7rem !important;
              margin-bottom: 16px !important;
            }

            .business-content > div[style*="grid-template-columns"] {
              text-align: center !important;
            }

            .business-content > div[style*="grid-template-columns"] h3 {
              font-size: 0.95rem !important;
            }

            .business-content > div[style*="grid-template-columns"] p {
              font-size: 0.85rem !important;
            }

            .business-content > div[style*="grid-template-columns"] > div[style*="display: flex"] > div:first-child {
              display: none !important;
            }

            .business-content > div[style*="grid-template-columns"] > div[style*="display: flex"] {
              gap: 8px !important;
              flex-direction: column !important;
              align-items: center !important;
            }

            .business-content > div[style*="grid-template-columns"] > div[style*="display: flex"] > div:last-child::before {
              content: '✓ ' !important;
              color: #10B981 !important;
              font-weight: 700 !important;
              font-size: 1rem !important;
            }

            .business-content > div[style*="grid-template-columns"] > div[style*="display: flex"] h3::before {
              content: '✓ ' !important;
              color: #10B981 !important;
              font-weight: 700 !important;
              margin-right: 6px !important;
            }

            .business-content > div:last-child {
              flex-direction: column !important;
              align-items: center !important;
              gap: 16px !important;
            }

            .business-content button {
              width: 100% !important;
              justify-content: center !important;
              padding: 14px 24px !important;
              font-size: 0.95rem !important;
              margin: 0 auto !important;
            }

            .business-content > div:last-child > div {
              width: 100% !important;
              text-align: center !important;
              justify-content: center !important;
            }

            .business-content > div:last-child > div > div:first-child {
              display: none !important;
            }

            .business-content > div:last-child > div > div:last-child {
              text-align: center !important;
            }

            .business-content > div:last-child > div > div:last-child p:first-child {
              line-height: 1.2 !important;
              margin-bottom: 2px !important;
            }

            .business-content > div:last-child > div > div:last-child p:last-child {
              line-height: 1.2 !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
