'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProductBySlug } from '@/data/courses';
import Footer from '@/components/Footer';
import CulqiPaymentForm from '@/components/CulqiPaymentForm';
import PayPalButton from '@/components/PayPalButton';
import PayPalScriptProvider from '@/components/PayPalScriptProvider';
import { useCurrency } from '@/hooks/useCurrency';

function ComprarGrabadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cursoSlug = searchParams.get('curso');
  const { currency, symbol, formatPrice, convertPrice } = useCurrency();

  const [curso, setCurso] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [step, setStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');
  const [enrollment, setEnrollment] = React.useState<any>(null);
  const [showAlreadyEnrolledModal, setShowAlreadyEnrolledModal] = React.useState(false);
  const [alreadyEnrolledMessage, setAlreadyEnrolledMessage] = React.useState('');

  React.useEffect(() => {
    if (!cursoSlug) {
      setLoading(false);
      return;
    }

    fetch(`/api/public/courses/${cursoSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCurso(data.course);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching course:', err);
        setLoading(false);
      });
  }, [cursoSlug]);

  const getPrice = () => {
    if (!curso) return 0;
    if (currency === 'USD') {
      const usdPrice = curso.priceGrabadoUsd || convertPrice(curso.priceGrabado || 0);
      return typeof usdPrice === 'number' ? usdPrice : parseFloat(usdPrice) || 0;
    }
    const penPrice = curso.priceGrabado || 0;
    return typeof penPrice === 'number' ? penPrice : parseFloat(penPrice) || 0;
  };

  const getOldPrice = () => {
    if (!curso) return 0;
    if (currency === 'USD') {
      const usdPrice = curso.priceGrabadoUsdOld || convertPrice(curso.priceGrabadoOld || 0);
      return typeof usdPrice === 'number' ? usdPrice : parseFloat(usdPrice) || 0;
    }
    const penPrice = curso.priceGrabadoOld || 0;
    return typeof penPrice === 'number' ? penPrice : parseFloat(penPrice) || 0;
  };

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
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem'
  };

  const typography = {
    h1: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[50]
      }}>
        <div style={{ textAlign: 'center', color: colors.gray[600] }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.gray[50]
      }}>
        <div style={{ textAlign: 'center', color: colors.gray[600] }}>
          Curso no encontrado
        </div>
      </div>
    );
  }

  return (
    <>
      <PayPalScriptProvider />
      <style>{`
        @media (max-width: 768px) {
          .mobile-grid-1 {
            grid-template-columns: 1fr !important;
          }
          .mobile-fixed-bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
            z-index: 999;
          }
          .mobile-padding-bottom {
            padding-bottom: 250px;
          }
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
          .card-icon {
            height: 12px !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
          .payment-method-text {
            font-size: inherit !important;
          }
          .payment-method-icons {
            gap: 0.2rem !important;
          }
          .payment-check {
            width: 18px !important;
            height: 18px !important;
            min-width: 18px !important;
            min-height: 18px !important;
          }
          .payment-method-header {
            flex-wrap: wrap !important;
          }
          .email-confirmation-mobile {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .email-confirmation-mobile button {
            margin-top: 0.5rem !important;
            align-self: flex-start !important;
          }
          .payment-method-icons {
            width: 100% !important;
            justify-content: flex-end !important;
            padding-right: 0 !important;
            margin-top: 0.5rem !important;
          }
        }
        @media (min-width: 769px) {
          .card-icon {
            height: 18px !important;
            border-radius: 4px !important;
          }
          .payment-method-icons {
            gap: 0.5rem !important;
          }
          .payment-method-text {
            font-size: inherit !important;
          }
          .payment-method-icons {
            gap: inherit !important;
          }
          .payment-check {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
          }
          .mobile-fixed-bottom {
            position: relative;
            box-shadow: none;
            padding: 0;
            margin-top: 1rem;
          }
          .desktop-only {
            display: block !important;
          }
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    {paymentSuccess ? (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #003366 0%, #0066CC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md
      }}>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          padding: spacing.xxl,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>✅</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: colors.success,
            marginBottom: spacing.md
          }}>
            ¡Pago Exitoso!
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: colors.gray[600],
            lineHeight: '1.6',
            marginBottom: spacing.lg
          }}>
            Tu acceso al curso <strong>{curso?.title}</strong> ha sido confirmado.
          </p>
          <div style={{
            backgroundColor: colors.gray[50],
            padding: spacing.lg,
            borderRadius: '8px',
            marginBottom: spacing.xl,
            textAlign: 'left'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.md
            }}>
              📧 Revisa tu correo electrónico
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: colors.gray[600],
              lineHeight: '1.6',
              margin: 0
            }}>
              Hemos enviado un email a <strong>{email}</strong> con:
            </p>
            <ul style={{
              marginTop: spacing.sm,
              paddingLeft: spacing.lg,
              fontSize: '0.9rem',
              color: colors.gray[600],
              lineHeight: '1.8'
            }}>
              <li>Tus credenciales de acceso al aula virtual</li>
              <li>Confirmación de compra</li>
              <li>Detalles del curso</li>
            </ul>
            <p style={{
              marginTop: spacing.md,
              fontSize: '0.85rem',
              color: colors.gray[500],
              fontStyle: 'italic'
            }}>
              💡 Si no lo ves, revisa tu carpeta de spam
            </p>
          </div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: colors.accent,
              color: colors.white,
              border: 'none',
              padding: `${spacing.md} ${spacing.xxl}`,
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,102,0,0.3)',
              width: '100%',
              marginBottom: spacing.sm
            }}>
              Ir al Aula Virtual →
            </button>
          </Link>
          <Link href="/" style={{
            display: 'block',
            marginTop: spacing.md,
            color: colors.secondary,
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    ) : (
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
            gap: spacing.lg,
            alignItems: 'center'
          }}>
            {curso && (
              <Link
                href={curso.slug === 'pump-engineer-program' ? '/programa-bombas' : `/cursos/${curso.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  color: colors.secondary,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                ← Volver al curso
              </Link>
            )}
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
          <div className="mobile-padding-bottom">
            <div style={{
              backgroundColor: colors.white,
              padding: spacing.xl,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }} className="mobile-padding-bottom">
              {step === 1 && (
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: colors.gray[700],
                  marginBottom: spacing.lg
                }}>
                  Información de Pago
                </h2>
              )}

              {step === 2 && (
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: colors.gray[700],
                  marginBottom: spacing.lg
                }}>
                  Información de Pago
                </h2>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (step === 1) {
                  try {
                    const checkResponse = await fetch('/api/enrollment/check', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: email,
                        courseSlug: curso.slug
                      })
                    });

                    const checkData = await checkResponse.json();

                    if (checkData.alreadyEnrolled) {
                      setAlreadyEnrolledMessage(checkData.message);
                      setShowAlreadyEnrolledModal(true);
                      return;
                    }

                    setStep(2);
                  } catch (error) {
                    console.error('Error verificando inscripción:', error);
                    setStep(2);
                  }
                }
              }}>

              {/* PASO 1: SOLO EMAIL */}
              {step === 1 && (
                <>
                  <div style={{ marginBottom: spacing.xl }}>
                    <div style={{
                      border: `2px solid ${colors.gray[700]}`,
                      borderRadius: '8px',
                      padding: `${spacing.sm} ${spacing.md}`,
                      marginBottom: spacing.md,
                      backgroundColor: colors.white
                    }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: colors.gray[700],
                        margin: 0
                      }}>
                        1. Ingresa tu correo de acceso
                      </h3>
                    </div>

                    <p style={{
                      fontSize: '0.95rem',
                      color: colors.gray[600],
                      lineHeight: '1.4',
                      marginBottom: spacing.lg
                    }}>
                      Recibirás aquí la confirmación de compra y el acceso al aula virtual.<br />
                      Verifica que esté correctamente escrito.
                    </p>

                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{
                        display: 'block',
                        marginBottom: spacing.xs,
                        fontWeight: '600',
                        color: colors.gray[700],
                        fontSize: '0.9rem'
                      }}>
                        Correo
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          border: `2px solid ${colors.gray[300]}`,
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                        onBlur={(e) => e.currentTarget.style.borderColor = colors.gray[300]}
                      />
                      <p style={{
                        fontSize: '0.85rem',
                        color: colors.gray[500],
                        fontStyle: 'italic',
                        marginTop: spacing.xs,
                        marginBottom: 0
                      }}>
                        No se necesita contraseña
                      </p>
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.white,
                        border: 'none',
                        padding: `${spacing.md} ${spacing.xl}`,
                        borderRadius: '6px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(255,102,0,0.3)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,102,0,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,102,0,0.3)';
                      }}
                    >
                      Continuar
                    </button>
                  </div>

                  {/* Paso 2 - Bloqueado */}
                  <div style={{
                    marginBottom: spacing.xl
                  }}>
                    <div style={{
                      border: `2px solid ${colors.gray[400]}`,
                      borderRadius: '8px',
                      padding: `${spacing.sm} ${spacing.md}`,
                      marginBottom: spacing.md,
                      backgroundColor: colors.gray[50]
                    }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: colors.gray[700],
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs
                      }}>
                        <span>🔒</span>
                        <span>2. Método de pago y finalización</span>
                      </h3>
                    </div>
                  </div>

                  {/* Detalles del pedido */}
                  <div style={{
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: '8px',
                    padding: spacing.lg
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: colors.gray[700],
                      marginBottom: spacing.md
                    }}>
                      Resumen del pedido (1 curso)
                    </h3>
                    {curso && (
                      <div style={{
                        display: 'flex',
                        gap: spacing.md
                      }}>
                        {curso.image && (
                          <img
                            src={curso.image}
                            alt={curso.title}
                            style={{
                              width: '80px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: colors.gray[700],
                            marginBottom: spacing.xs
                          }}>
                            {curso.title}
                          </h4>
                          <p style={{
                            fontSize: '0.8rem',
                            color: colors.gray[500],
                            margin: 0
                          }}>
                            Modalidad: Curso Grabado
                          </p>
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: colors.gray[700]
                        }}>
                          {symbol} {getPrice().toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PASO 2: CONFIRMACIÓN DE EMAIL Y MÉTODOS DE PAGO */}
              {step === 2 && (
                <>
                {/* Mostrar email con opción de cambiar */}
                <div style={{
                  marginBottom: spacing.lg,
                  padding: spacing.md,
                  backgroundColor: colors.gray[50],
                  borderRadius: '8px',
                  border: `1px solid ${colors.gray[300]}`
                }}>
                  <div className="email-confirmation-mobile" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.7rem',
                        color: colors.gray[600],
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        fontWeight: '600'
                      }}>Tu correo electrónico</div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs
                      }}>
                        {email}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: colors.success,
                          color: colors.white,
                          fontSize: '0.7rem'
                        }}>✓</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.secondary,
                        border: `1px solid ${colors.secondary}`,
                        padding: `${spacing.xs} ${spacing.sm}`,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      Cambiar correo
                    </button>
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: colors.gray[700],
                  marginBottom: spacing.md
                }}>
                  Métodos de pago
                </h3>

                <div
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: spacing.md,
                    border: `2px solid ${paymentMethod === 'card' ? colors.primary : colors.gray[300]}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: spacing.sm,
                    backgroundColor: paymentMethod === 'card' ? `${colors.primary}05` : colors.white
                  }}
                >
                  <div className="payment-method-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: paymentMethod === 'card' ? spacing.md : 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <div className="payment-check" style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: `2px solid ${paymentMethod === 'card' ? colors.primary : colors.gray[400]}`,
                        backgroundColor: paymentMethod === 'card' ? colors.primary : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.white,
                        fontSize: '0.7rem',
                        flexShrink: 0
                      }}>
                        {paymentMethod === 'card' && '✓'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <span className="payment-method-text" style={{ fontWeight: '600', color: colors.gray[700] }}>💳  Tarjeta de Crédito o Débito</span>
                      </div>
                    </div>
                    <div className="payment-method-icons" style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
                      <img src="/images/visa_color.svg" alt="Visa" className="card-icon" style={{ width: 'auto' }} />
                      <img src="/images/mastercard_color.svg" alt="Mastercard" className="card-icon" style={{ width: 'auto' }} />
                      <img src="/images/amex_color.svg" alt="American Express" className="card-icon" style={{ width: 'auto' }} />
                      <img src="/images/diners_color.svg" alt="Diners Club" className="card-icon" style={{ width: 'auto' }} />
                    </div>
                  </div>
                </div>
                </>
              )}

              </form>

              {step === 2 && paymentMethod === 'card' && curso && (
                <div style={{
                  padding: spacing.lg,
                  border: `2px solid ${colors.gray[200]}`,
                  borderRadius: '12px',
                  backgroundColor: colors.white,
                  marginTop: spacing.md
                }}>
                  {paymentError && (
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                      border: '2px solid #EF5350',
                      borderRadius: '12px',
                      marginBottom: '1.5rem',
                      boxShadow: '0 4px 12px rgba(239, 83, 80, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>❌</div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            color: '#C62828',
                            margin: '0 0 8px 0',
                            fontSize: '1.1rem',
                            fontWeight: '700'
                          }}>
                            Error al procesar el pago
                          </h4>
                          <p style={{
                            color: '#D32F2F',
                            margin: 0,
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                          }}>
                            {paymentError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                      {!paymentSuccess ? (
                        <CulqiPaymentForm
                          amount={getPrice()}
                          courseSlug={curso.slug}
                          courseTitle={curso.title}
                          modality="grabado"
                          email={email}
                          fullName={fullName}
                          phone={phone}
                          currency={currency}
                          onSuccess={(data) => {
                            setPaymentSuccess(true);
                            setEnrollment(data.enrollment);
                          }}
                          onError={(error) => {
                            setPaymentError(error);
                            setTimeout(() => setPaymentError(''), 5000);
                          }}
                        />
                      ) : (
                        <div style={{
                          padding: '3rem 2rem',
                          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                          borderRadius: '16px',
                          textAlign: 'center',
                          boxShadow: '0 8px 24px rgba(46, 125, 50, 0.15)'
                        }}>
                          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s ease' }}>🎉</div>
                          <h2 style={{
                            color: '#1B5E20',
                            marginBottom: '0.5rem',
                            fontSize: '2rem',
                            fontWeight: '700'
                          }}>
                            ¡Felicitaciones!
                          </h2>
                          <h3 style={{ color: '#2E7D32', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                            Te has inscrito exitosamente al curso
                          </h3>

                          <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '2px solid #4CAF50',
                            textAlign: 'left'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '1rem',
                              paddingBottom: '1rem',
                              borderBottom: '1px solid #E0E0E0'
                            }}>
                              <div style={{ fontSize: '2rem' }}>📧</div>
                              <div>
                                <h4 style={{ margin: 0, color: '#1B5E20', fontSize: '1.1rem' }}>
                                  Credenciales enviadas
                                </h4>
                                <p style={{ margin: '4px 0 0 0', color: '#558B2F', fontSize: '0.9rem' }}>
                                  {enrollment?.email || email}
                                </p>
                              </div>
                            </div>

                            <p style={{
                              color: '#424242',
                              fontSize: '0.95rem',
                              lineHeight: '1.6',
                              margin: 0
                            }}>
                              {enrollment?.isNewUser ? (
                                <>
                                  📨 Hemos enviado tus <strong>credenciales de acceso</strong> al correo electrónico:
                                  <br/>
                                  <strong style={{ color: '#2E7D32' }}>{enrollment?.email || email}</strong>
                                  <br/><br/>
                                  ✅ Revisa tu bandeja de entrada (y carpeta de spam) para acceder al aula virtual.
                                </>
                              ) : (
                                <>
                                  ✅ Ya tenías una cuenta con nosotros. Puedes acceder al curso con tus credenciales habituales.
                                </>
                              )}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => router.push('/login')}
                              style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                transition: 'transform 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              🎓 Ir al Aula Virtual
                            </button>
                            <button
                              onClick={() => router.push('/')}
                              style={{
                                padding: '1rem 2rem',
                                background: 'white',
                                color: '#2E7D32',
                                border: '2px solid #4CAF50',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F1F8E9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                              }}
                            >
                              🏠 Volver al Inicio
                            </button>
                          </div>
                        </div>
                      )}
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                {step === 2 && (
                  <>
                {/* PAYPAL */}
                <div
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    padding: spacing.md,
                    border: `2px solid ${paymentMethod === 'paypal' ? colors.primary : colors.gray[300]}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: spacing.sm,
                    backgroundColor: paymentMethod === 'paypal' ? `${colors.primary}05` : colors.white
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: paymentMethod === 'paypal' ? spacing.md : 0
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${paymentMethod === 'paypal' ? colors.primary : colors.gray[400]}`,
                      backgroundColor: paymentMethod === 'paypal' ? colors.primary : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.white,
                      fontSize: '0.7rem',
                      flexShrink: 0
                    }}>
                      {paymentMethod === 'paypal' && '✓'}
                    </div>
                    <img src="/images/paypal_icon.png" alt="PayPal" style={{ height: '30px', width: 'auto' }} />
                    <span style={{ fontWeight: '600', color: colors.gray[700] }}>PayPal</span>
                  </div>

                  {paymentMethod === 'paypal' && (
                    <div style={{
                      marginTop: spacing.md,
                      padding: spacing.md,
                      border: `2px solid ${colors.gray[200]}`,
                      borderRadius: '8px',
                      backgroundColor: colors.gray[50]
                    }}>
                      <PayPalButton
                        amount={
                          curso.priceGrabadoUsd && parseFloat(curso.priceGrabadoUsd) > 0
                            ? parseFloat(curso.priceGrabadoUsd)
                            : Math.round(((curso.priceGrabado || 0) / 3.80) * 100) / 100
                        }
                        courseSlug={curso.slug}
                        courseTitle={curso.title}
                        modality="grabado"
                        email={email}
                        currency="USD"
                        onSuccess={(data) => {
                          setPaymentSuccess(true);
                          setEnrollment(data.enrollment);
                        }}
                        onError={(error) => {
                          setPaymentError(error);
                          setTimeout(() => setPaymentError(''), 5000);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* YAPE */}
                <div
                  onClick={() => setPaymentMethod('yape')}
                  style={{
                    padding: spacing.md,
                    border: `2px solid ${paymentMethod === 'yape' ? colors.primary : colors.gray[300]}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: spacing.sm,
                    backgroundColor: paymentMethod === 'yape' ? `${colors.primary}05` : colors.white
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: paymentMethod === 'yape' ? spacing.md : 0
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${paymentMethod === 'yape' ? colors.primary : colors.gray[400]}`,
                      backgroundColor: paymentMethod === 'yape' ? colors.primary : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.white,
                      fontSize: '0.7rem',
                      flexShrink: 0
                    }}>
                      {paymentMethod === 'yape' && '✓'}
                    </div>
                    <img src="/images/yape_icon.png" alt="Yape" style={{ height: '30px', width: 'auto' }} />
                    <span style={{ fontWeight: '600', color: colors.gray[700] }}>Yape / Plin</span>
                  </div>

                  {paymentMethod === 'yape' && (
                    <div style={{
                      marginTop: spacing.md,
                      textAlign: 'center',
                      backgroundColor: colors.gray[50],
                      padding: spacing.lg,
                      borderRadius: '8px'
                    }}>
                      <p style={{ marginBottom: spacing.md, color: colors.gray[700], fontWeight: '600' }}>
                        Escanea el QR o yapea al número:
                      </p>
                      <img
                        src="/images/yape.jpeg"
                        alt="QR Yape"
                        style={{
                          maxWidth: '200px',
                          width: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          marginBottom: spacing.md,
                          border: `2px solid ${colors.gray[300]}`
                        }}
                      />
                      <div style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                        padding: spacing.sm,
                        borderRadius: '8px',
                        marginBottom: spacing.sm
                      }}>
                        <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>📱 Número:</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '700', letterSpacing: '0.05em' }}>
                          +51 983 269 818
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: '#6B1F7B',
                        color: colors.white,
                        padding: spacing.sm,
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        marginBottom: spacing.md
                      }}>
                        💡 Monto: {symbol} {getPrice().toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push('/pago-yape')}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #6B1F7B 0%, #8B2F9B 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(107, 31, 123, 0.3)'
                        }}
                      >
                        Ya Yapeé - Confirmar Pago
                      </button>
                    </div>
                  )}
                </div>

                </>
              )}

              </form>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="hide-on-mobile">
            <div style={{
              background: 'linear-gradient(135deg, #003366 0%, #0066CC 100%)',
              padding: spacing.lg,
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)',
              position: 'sticky',
              top: spacing.md
            }}>
              {/* Nombre del curso */}
              {curso?.title && (
                <h3 style={{
                  color: colors.white,
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: spacing.md,
                  lineHeight: '1.3'
                }}>
                  {curso.title}
                </h3>
              )}

              {/* Imagen del curso */}
              {curso?.image && (
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
                      {symbol} {getPrice().toFixed(2)}
                    </span>
                    {getOldPrice() > 0 && (
                      <span style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'line-through'
                      }}>
                        {symbol} {getOldPrice().toFixed(2)}
                      </span>
                    )}
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
                  <div>✓ {curso?.hours || '40 horas'} de contenido</div>
                  <div>✓ {curso?.modules?.length || 8} módulos especializados</div>
                  <div>✓ Acceso a grabaciones</div>
                  <div>✓ Certificado digital</div>
                  <div>✓ Soporte académico</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hide-on-mobile">
        <Footer />
      </div>
    </div>
    )}

    {showAlreadyEnrolledModal && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: spacing.md
        }}
        onClick={() => setShowAlreadyEnrolledModal(false)}
      >
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: colors.gray[700],
            marginBottom: '1rem'
          }}>
            Ya estás inscrito en este curso
          </h2>
          <p style={{
            fontSize: '1rem',
            color: colors.gray[600],
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            {alreadyEnrolledMessage}
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: colors.gray[600],
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            📧 Revisa tu correo electrónico (incluyendo la carpeta de spam) para ver la confirmación de tu inscripción.
          </p>
          <button
            onClick={() => setShowAlreadyEnrolledModal(false)}
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              border: 'none',
              padding: `${spacing.md} ${spacing.xl}`,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 51, 102, 0.3)'
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default function ComprarGrabadoPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #003366 0%, #0066CC 100%)'
      }}>
        <div style={{
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Cargando...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    }>
      <ComprarGrabadoContent />
    </Suspense>
  );
}
