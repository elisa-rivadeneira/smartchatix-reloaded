'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProductBySlug } from '@/data/courses';
import Footer from '@/components/Footer';

export default function ComprarGrabadoPage() {
  const searchParams = useSearchParams();
  const cursoSlug = searchParams.get('curso');
  const curso = cursoSlug ? getProductBySlug(cursoSlug) : null;

  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

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
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem'
  };

  const typography = {
    h1: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .mobile-grid-1 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: colors.gray[50],
      minHeight: '100vh'
    }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.gray[200]}`,
        padding: `${spacing.sm} 0`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${spacing.md}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img
              src="/images/logo_samartchatix.png"
              alt="SmartChatix"
              style={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          <div style={{
            display: 'flex',
            gap: spacing.md,
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '0.9rem',
              color: colors.gray[600]
            }}>
              🔒 Proceso de pago seguro
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: `${spacing.xl} ${spacing.md}`
      }}>
        <div className="mobile-grid-1" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 400px',
          gap: spacing.xl
        }}>
          {/* FORMULARIO */}
          <div>
            <div style={{
              backgroundColor: colors.white,
              padding: spacing.xl,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: colors.primary,
                marginBottom: spacing.xs
              }}>
                Checkout
              </h2>
              <p style={{
                fontSize: '0.9rem',
                color: colors.gray[600],
                marginBottom: spacing.lg
              }}>
                Todos los campos son requeridos
              </p>

              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: colors.gray[700],
                marginBottom: spacing.md,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Información de facturación
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); alert('Pago procesado'); }}>
                <div style={{ marginBottom: spacing.md }}>
                  <label style={{
                    display: 'block',
                    marginBottom: spacing.xs,
                    fontWeight: '600',
                    color: colors.gray[700],
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elisa Rivadeneira"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{
                    display: 'block',
                    marginBottom: spacing.xs,
                    fontWeight: '600',
                    color: colors.gray[700],
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{
                    display: 'block',
                    marginBottom: spacing.xs,
                    fontWeight: '600',
                    color: colors.gray[700],
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Celular / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 999 999 999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: colors.gray[700],
                  marginBottom: spacing.md,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Métodos de pago
                </h3>

                {/* TABS DE PAGO */}
                <div style={{
                  display: 'flex',
                  gap: '1px',
                  marginBottom: spacing.md,
                  borderBottom: `2px solid ${colors.gray[200]}`
                }}>
                  {[
                    { id: 'card', name: '💳 Card' },
                    { id: 'yape', name: 'Yape' },
                    { id: 'plin', name: 'Plin' },
                    { id: 'paypal', name: 'PayPal' },
                    { id: 'western', name: 'Western Union' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        flex: 1,
                        padding: `${spacing.sm} ${spacing.xs}`,
                        border: 'none',
                        borderBottom: paymentMethod === method.id ? `3px solid ${colors.primary}` : '3px solid transparent',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontWeight: paymentMethod === method.id ? '700' : '500',
                        color: paymentMethod === method.id ? colors.primary : colors.gray[600],
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>

                {/* CONTENIDO SEGÚN TAB SELECCIONADO */}
                {paymentMethod === 'card' && (
                  <div style={{ marginBottom: spacing.lg }}>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{
                        display: 'block',
                        marginBottom: spacing.xs,
                        fontWeight: '600',
                        color: colors.gray[700],
                        fontSize: '0.9rem'
                      }}>
                        Número de tarjeta
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          placeholder="1234 1234 1234 1234"
                          maxLength={19}
                          style={{
                            width: '100%',
                            padding: spacing.sm,
                            paddingRight: '100px',
                            border: `1px solid ${colors.gray[300]}`,
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          gap: '4px'
                        }}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style={{ height: '20px' }} />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px' }} />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style={{ height: '20px' }} />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Diners_Club_Logo.svg" alt="Diners" style={{ height: '20px' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: spacing.md,
                      marginBottom: spacing.md
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: spacing.xs,
                          fontWeight: '600',
                          color: colors.gray[700],
                          fontSize: '0.9rem'
                        }}>
                          Fecha de vencimiento
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM / YY"
                          maxLength={7}
                          style={{
                            width: '100%',
                            padding: spacing.sm,
                            border: `1px solid ${colors.gray[300]}`,
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontFamily: 'monospace',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: spacing.xs,
                          fontWeight: '600',
                          color: colors.gray[700],
                          fontSize: '0.9rem'
                        }}>
                          Código de seguridad
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            required
                            placeholder="CVC"
                            maxLength={4}
                            style={{
                              width: '100%',
                              padding: spacing.sm,
                              paddingRight: '40px',
                              border: `1px solid ${colors.gray[300]}`,
                              borderRadius: '4px',
                              fontSize: '1rem',
                              fontFamily: 'monospace',
                              boxSizing: 'border-box'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.2rem'
                          }}>
                            🔒
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      marginBottom: spacing.md
                    }}>
                      <input type="checkbox" id="save-card" />
                      <label htmlFor="save-card" style={{
                        fontSize: '0.85rem',
                        color: colors.gray[700],
                        cursor: 'pointer'
                      }}>
                        Guardar esta tarjeta de forma segura para futuras compras.{' '}
                        <a href="#" style={{ color: colors.secondary }}>Más información.</a>
                      </label>
                    </div>
                  </div>
                )}

                {paymentMethod === 'yape' && (
                  <div style={{
                    backgroundColor: colors.gray[50],
                    padding: spacing.lg,
                    borderRadius: '8px',
                    marginBottom: spacing.lg,
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: spacing.md, color: colors.gray[700] }}>
                      Al continuar, recibirás instrucciones de pago por WhatsApp y email.
                    </p>
                    <img
                      src="/images/yape_icon.png"
                      alt="Yape"
                      style={{ width: '80px', margin: '0 auto' }}
                    />
                  </div>
                )}

                {paymentMethod === 'plin' && (
                  <div style={{
                    backgroundColor: colors.gray[50],
                    padding: spacing.lg,
                    borderRadius: '8px',
                    marginBottom: spacing.lg,
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: spacing.md, color: colors.gray[700] }}>
                      Al continuar, recibirás instrucciones de pago por WhatsApp y email.
                    </p>
                    <div style={{ fontSize: '3rem' }}>📱</div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div style={{
                    backgroundColor: colors.gray[50],
                    padding: spacing.lg,
                    borderRadius: '8px',
                    marginBottom: spacing.lg,
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: spacing.md, color: colors.gray[700] }}>
                      Serás redirigido a PayPal para completar el pago de forma segura.
                    </p>
                    <img
                      src="/images/paypal_icon.png"
                      alt="PayPal"
                      style={{ width: '80px', margin: '0 auto' }}
                    />
                  </div>
                )}

                {paymentMethod === 'western' && (
                  <div style={{
                    backgroundColor: colors.gray[50],
                    padding: spacing.lg,
                    borderRadius: '8px',
                    marginBottom: spacing.lg,
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: spacing.md, color: colors.gray[700] }}>
                      Al continuar, recibirás instrucciones de pago por WhatsApp y email.
                    </p>
                    <img
                      src="/images/wenster_union_icon.png"
                      alt="Western Union"
                      style={{ width: '120px', margin: '0 auto' }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: 'none',
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: spacing.md
                  }}
                >
                  {paymentMethod === 'card' ? 'Pagar Ahora' : 'Continuar'}
                </button>
              </form>
            </div>
          </div>

          {/* RESUMEN */}
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              padding: spacing.lg,
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,51,102,0.3)',
              position: 'sticky',
              top: spacing.md
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: spacing.md
              }}>
                <img
                  src="/images/logo_samartchatix.png"
                  alt="SmartChatix"
                  style={{
                    height: '30px',
                    width: 'auto'
                  }}
                />
              </div>

              <h3 style={{
                ...typography.h3,
                fontSize: '1.1rem',
                color: colors.white,
                marginBottom: spacing.sm
              }}>
                {curso?.title || 'Curso de Bombas Centrífugas'}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: spacing.md
              }}>
                by Coursera
              </p>

              {curso?.image && (
                <img
                  src={curso.image}
                  alt={curso.title}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: spacing.md
                  }}
                />
              )}

              <div style={{
                borderTop: `1px solid rgba(255,255,255,0.2)`,
                paddingTop: spacing.md,
                marginBottom: spacing.md
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: spacing.sm,
                  fontSize: '1.05rem'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>Course Certificate</span>
                  <span style={{ color: colors.white, fontWeight: '700' }}>
                    S/ {curso?.priceGrabado || 699} USD
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: colors.white,
                  paddingTop: spacing.sm,
                  borderTop: `1px solid rgba(255,255,255,0.2)`
                }}>
                  <span>Total:</span>
                  <span>S/ {curso?.priceGrabado || 699} USD</span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: spacing.md,
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: colors.white,
                lineHeight: '1.6',
                border: '1px solid rgba(255,255,255,0.2)',
                marginBottom: spacing.md
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                  marginBottom: spacing.xs
                }}>
                  <img
                    src="https://via.placeholder.com/60x60"
                    alt="Student"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                      "Los cursos que tomé en SmartChatix son directamente aplicables a mi trabajo. Me permiten aprender cosas que puedo usar en el trabajo de inmediato."
                    </p>
                    <p style={{ margin: `${spacing.xs} 0 0 0`, fontStyle: 'italic', fontSize: '0.85rem' }}>
                      — Kathleen B.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: spacing.lg,
                fontSize: '0.85rem',
                color: colors.white
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>🎓</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>140 Million+</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Learners</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>📚</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>10,000+</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
