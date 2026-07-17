'use client';

import React from 'react';
import Link from 'next/link';

export default function PagoYapePage() {
  const [voucher, setVoucher] = React.useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [price, setPrice] = React.useState('999');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const priceParam = params.get('price');
    if (priceParam) {
      setPrice(priceParam);
    }
  }, []);

  const colors = {
    primary: '#003366',
    secondary: '#0066CC',
    accent: '#FF6600',
    success: '#009900',
    yape: '#6B1F7B',
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
    h1: { fontSize: '1.8rem', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '1.2rem', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '0.95rem', fontWeight: '400', lineHeight: '1.6' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
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
              🔒 Pago seguro
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: `${spacing.lg} ${spacing.md}`
      }}>
        {!submitted ? (
          <div style={{
            backgroundColor: colors.white,
            padding: spacing.xl,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: spacing.xl
            }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: colors.yape,
                color: colors.white,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: '30px',
                marginBottom: spacing.sm
              }}>
                <h1 style={{
                  ...typography.h1,
                  fontSize: '1.5rem',
                  margin: 0
                }}>
                  📱 Pago con Yape / Plin
                </h1>
              </div>

              <p style={{
                ...typography.body,
                color: colors.gray[600],
                fontSize: '0.95rem',
                marginBottom: spacing.md
              }}>
                Puedes pagar escaneando el QR o yapeando directamente al número
              </p>
            </div>

            {/* QR CODE SECTION */}
            <div style={{
              backgroundColor: colors.gray[50],
              padding: spacing.lg,
              borderRadius: '12px',
              marginBottom: spacing.lg,
              textAlign: 'center',
              border: `2px solid ${colors.yape}`
            }}>
              <img
                src="/images/yape.jpeg"
                alt="QR Yape"
                style={{
                  maxWidth: '260px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  marginBottom: spacing.sm
                }}
              />

              <div style={{
                backgroundColor: colors.white,
                padding: spacing.md,
                borderRadius: '8px',
                marginBottom: spacing.sm
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: colors.success,
                  marginBottom: spacing.xs
                }}>
                  S/ {price}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: colors.gray[600]
                }}>
                  Monto a pagar
                </div>
              </div>

              <div style={{
                backgroundColor: colors.primary,
                color: colors.white,
                padding: spacing.sm,
                borderRadius: '8px',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                marginBottom: spacing.sm
              }}>
                <strong style={{ fontSize: '0.95rem' }}>📱 O yapea directamente al número:</strong><br />
                <span style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.05em' }}>+51 983 269 818</span>
              </div>

              <div style={{
                backgroundColor: colors.yape,
                color: colors.white,
                padding: spacing.sm,
                borderRadius: '8px',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}>
                💡 <strong>Importante:</strong> Asegúrate de yapear exactamente S/ {price}
              </div>
            </div>

            {/* UPLOAD VOUCHER */}
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: colors.white,
                padding: spacing.md,
                borderRadius: '8px',
                border: `2px dashed ${colors.gray[300]}`,
                marginBottom: spacing.md
              }}>
                <h3 style={{
                  ...typography.h3,
                  fontSize: '1rem',
                  color: colors.primary,
                  marginBottom: spacing.sm
                }}>
                  📤 Sube tu comprobante
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  required
                  id="voucher-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setVoucher(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setVoucherPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setVoucherPreview(null);
                    }
                  }}
                  style={{
                    display: 'none'
                  }}
                />
                <label
                  htmlFor="voucher-upload"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${colors.yape}`,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: spacing.sm,
                    boxSizing: 'border-box',
                    backgroundColor: colors.white,
                    textAlign: 'center',
                    fontWeight: '600',
                    color: colors.yape
                  }}
                >
                  📷 Subir Comprobante de Pago
                </label>

                {voucher && voucherPreview && (
                  <div style={{
                    marginTop: spacing.md,
                    padding: spacing.md,
                    backgroundColor: colors.gray[50],
                    borderRadius: '8px',
                    border: `2px solid ${colors.gray[300]}`
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: colors.gray[700],
                      marginBottom: spacing.sm,
                      fontWeight: '600'
                    }}>
                      ✓ Archivo seleccionado: {voucher.name}
                    </div>
                    <img
                      src={voucherPreview}
                      alt="Vista previa del comprobante"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        borderRadius: '8px',
                        border: `2px solid ${colors.gray[300]}`,
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: spacing.md
              }}>
                <Link href="/inscripcion-vivo" style={{ flex: 1, textDecoration: 'none' }}>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: colors.gray[600],
                      border: `2px solid ${colors.gray[300]}`,
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    ← Cambiar método de pago
                  </button>
                </Link>

                <button
                  type="submit"
                  style={{
                    flex: 2,
                    backgroundColor: colors.yape,
                    color: colors.white,
                    border: 'none',
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Enviar comprobante
                </button>
              </div>
            </form>

            {/* AYUDA */}
            <div style={{
              marginTop: spacing.lg,
              textAlign: 'center',
              padding: spacing.md,
              backgroundColor: colors.primary,
              borderRadius: '8px',
              color: colors.white
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                lineHeight: '1.5',
                marginBottom: spacing.md
              }}>
                📱 ¿Problemas con el pago? Escríbenos por WhatsApp
              </p>
              <a
                href="https://wa.me/51967717179"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25D366',
                  color: colors.white,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                💬 Chatear con Asistente Académica
              </a>
            </div>
          </div>
        ) : (
          // CONFIRMACIÓN
          <div style={{
            backgroundColor: colors.white,
            padding: spacing.lg,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: spacing.sm
            }}>
              ✅
            </div>

            <h2 style={{
              ...typography.h2,
              color: colors.success,
              marginBottom: spacing.sm
            }}>
              ¡Comprobante Recibido!
            </h2>

            <p style={{
              ...typography.body,
              color: colors.gray[600],
              fontSize: '0.95rem',
              marginBottom: spacing.lg
            }}>
              Hemos recibido tu comprobante de pago. Lo verificaremos y te enviaremos el acceso al programa en las próximas <strong>24 horas</strong>.
            </p>

            <div style={{
              backgroundColor: colors.gray[50],
              padding: spacing.md,
              borderRadius: '8px',
              marginBottom: spacing.md,
              textAlign: 'left'
            }}>
              <h3 style={{
                ...typography.h3,
                fontSize: '1rem',
                color: colors.primary,
                marginBottom: spacing.sm
              }}>
                Próximos pasos:
              </h3>
              <ol style={{
                paddingLeft: spacing.md,
                color: colors.gray[700],
                lineHeight: '1.6',
                margin: 0,
                fontSize: '0.9rem'
              }}>
                <li>Revisa tu email (también spam/promociones)</li>
                <li>Recibirás confirmación de pago en 24 horas</li>
                <li>Te enviaremos las credenciales de acceso</li>
                <li>Podrás acceder al aula virtual inmediatamente</li>
              </ol>
            </div>

            <div style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: spacing.md,
              borderRadius: '8px',
              marginBottom: spacing.md,
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                lineHeight: '1.5',
                marginBottom: spacing.md
              }}>
                📱 ¿Necesitas ayuda? Contáctanos por WhatsApp
              </p>
              <a
                href="https://wa.me/51967717179"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25D366',
                  color: colors.white,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem'
                }}
              >
                💬 Chatear con Asistente Académica
              </a>
            </div>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: colors.accent,
                color: colors.white,
                border: 'none',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Volver al inicio
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
