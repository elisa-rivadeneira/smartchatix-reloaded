'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalButtonProps {
  amount: number;
  courseSlug: string;
  courseTitle: string;
  modality: string;
  email: string;
  currency?: 'USD' | 'PEN';
  onSuccess: (data?: any) => void;
  onError: (error: string) => void;
}

export default function PayPalButton({
  amount,
  courseSlug,
  courseTitle,
  modality,
  email,
  currency = 'USD',
  onSuccess,
  onError
}: PayPalButtonProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingMessage, setLoadingMessage] = React.useState('Inicializando PayPal...');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = React.useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('❌ PayPal container ref not available');
      return;
    }

    if (rendered) {
      console.log('⚠️ Botones ya renderizados, evitando duplicados');
      return;
    }

    console.log('🔵 Iniciando carga de PayPal...');
    console.log('📊 Datos:', { amount, courseSlug, email, currency });

    let attempts = 0;
    const maxAttempts = 100;

    const checkPayPal = setInterval(() => {
      attempts++;

      if (attempts % 10 === 0) {
        setLoadingMessage(`Cargando PayPal... (${attempts / 10}s)`);
        console.log(`🔍 Intento ${attempts}/${maxAttempts} - window.paypal:`, !!window.paypal);
      }

      if (window.paypal && containerRef.current) {
        console.log('✅ PayPal SDK disponible');
        setLoadingMessage('Configurando botones...');
        clearInterval(checkPayPal);

        try {
          console.log('🔧 Creando botones de PayPal...');

          const buttons = window.paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 45
            },

            createOrder: async function(data: any, actions: any) {
              try {
                console.log('💰 Creando orden de PayPal vía servidor...', { amount, currency });

                const response = await fetch('/api/payment/paypal/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    amount: amount,
                    currency: currency,
                    description: `${courseTitle} - ${modality}`
                  })
                });

                const result = await response.json();

                if (!response.ok) {
                  console.error('❌ Error creando orden:', result);
                  throw new Error(result.error || 'Error al crear orden de PayPal');
                }

                console.log('✅ Orden creada con ID:', result.orderId);
                return result.orderId;
              } catch (error) {
                console.error('❌ Error al crear orden:', error);
                throw error;
              }
            },

            onApprove: async function(data: any, actions: any) {
              console.log('✅ Pago aprobado, capturando orden...');
              const order = await actions.order.capture();
              console.log('📦 Orden capturada:', order.id);

              try {
                const response = await fetch('/api/payment/paypal/capture', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: order.id,
                    courseSlug: courseSlug,
                    courseTitle: courseTitle,
                    modality: modality,
                    email: email,
                    amount: amount,
                    currency: currency,
                    paypalOrderData: order
                  })
                });

                const result = await response.json();
                console.log('📊 Resultado del servidor:', result);
                console.log('📊 Response status:', response.status);
                console.log('📊 Response OK:', response.ok);

                if (!response.ok) {
                  console.error('❌ El servidor retornó un error:', result);
                  if (result.alreadyEnrolled) {
                    throw new Error(result.message || 'Ya estás inscrito en este curso');
                  }
                  throw new Error(result.error || 'Error al procesar el pago');
                }

                console.log('✅ Pago procesado exitosamente');
                console.log('✅ Llamando a onSuccess con:', result);
                onSuccess(result);
              } catch (error: any) {
                console.error('❌ Error procesando pago:', error);
                onError(error.message || 'Error al procesar el pago con PayPal');
              }
            },

            onCancel: function(data: any) {
              console.log('⚠️ Usuario canceló el pago');
              onError('Pago cancelado. Si tu tarjeta fue rechazada, intenta con otra tarjeta o método de pago.');
            },

            onError: function(err: any) {
              console.error('❌ PayPal Error:', err);
              onError('Hubo un problema con PayPal. Verifica los datos de tu tarjeta o intenta con otro método de pago.');
            }
          });

          if (buttons.isEligible()) {
            console.log('✅ Botones elegibles, renderizando...');
            buttons.render(containerRef.current).then(() => {
              console.log('✅ Botones de PayPal renderizados exitosamente');
              setIsLoading(false);
              setRendered(true);
            }).catch((error: any) => {
              console.error('❌ Error al renderizar botones:', error);
              setIsLoading(false);
              onError('Error al mostrar los botones de PayPal');
            });
          } else {
            console.error('❌ Botones no elegibles');
            setIsLoading(false);
            onError('PayPal no está disponible para esta transacción');
          }
        } catch (error) {
          console.error('❌ Error al crear botones de PayPal:', error);
          setIsLoading(false);
          onError('Error al cargar los botones de PayPal');
        }
      }

      if (attempts >= maxAttempts) {
        console.error('❌ Timeout: PayPal no se cargó después de', maxAttempts / 10, 'segundos');
        clearInterval(checkPayPal);
        setIsLoading(false);
        onError('PayPal no se pudo cargar. Por favor recarga la página e intenta nuevamente.');
      }
    }, 100);

    return () => {
      clearInterval(checkPayPal);
    };
  }, [amount, courseSlug, courseTitle, modality, email, currency, onSuccess, onError, rendered]);

  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#202124',
          marginBottom: '0.5rem'
        }}>
          {courseTitle}
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: '#5F6368',
          marginBottom: '0.5rem'
        }}>
          Modalidad: {modality === 'vivo' ? 'En Vivo' : 'Grabado'}
        </p>
        <div style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#0070BA',
          marginBottom: '1rem'
        }}>
          {currency === 'USD' ? 'US$' : 'S/'} {(typeof amount === 'number' ? amount : parseFloat(amount) || 0).toFixed(2)}
        </div>
      </div>

      {isLoading && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#5F6368'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E8EAED',
            borderTopColor: '#0070BA',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{loadingMessage}</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#9AA0A6' }}>
            Si esto tarda mucho, recarga la página
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          minHeight: isLoading ? '0' : '200px',
          display: isLoading ? 'none' : 'block'
        }}
      ></div>

      {!isLoading && (
        <>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#E8F5E9',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#2E7D32',
            maxWidth: '400px',
            margin: '1.5rem auto 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <span>🔒</span>
              <span><strong>Pago 100% seguro con PayPal</strong></span>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem' }}>
              Protección del comprador incluida
            </p>
          </div>

          <div style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: '#5F6368',
            maxWidth: '400px',
            margin: '1rem auto 0'
          }}>
            Al completar el pago, aceptas los términos y condiciones del curso.
          </div>
        </>
      )}
    </div>
  );
}
