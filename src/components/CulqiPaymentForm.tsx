'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

interface CulqiPaymentFormProps {
  amount: number;
  courseSlug: string;
  courseTitle: string;
  modality: string;
  email: string;
  fullName: string;
  phone: string;
  onSuccess: (data?: any) => void;
  onError: (error: string) => void;
}

export default function CulqiPaymentForm({
  amount,
  courseSlug,
  courseTitle,
  modality,
  email,
  fullName,
  phone,
  onSuccess,
  onError
}: CulqiPaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [culqiLoaded, setCulqiLoaded] = useState(false);

  useEffect(() => {
    const checkCulqi = setInterval(() => {
      if (typeof window !== 'undefined' && window.Culqi) {
        const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

        console.log('Setting Culqi public key:', publicKey);

        window.Culqi.publicKey = publicKey;
        window.Culqi.init();
        window.Culqi.settings({
          currency: 'PEN',
          amount: amount * 100
        });

        console.log('Culqi initialized:', window.Culqi.publicKey);

        console.log('Culqi loaded, setting culqiLoaded to true');
        setCulqiLoaded(true);

        window.culqi = async function() {
          const Culqi = window.Culqi;

          if (Culqi.token && Culqi.token.object === 'token') {
            const token = Culqi.token.id;

            try {
              const chargeResponse = await fetch('/api/payment/charge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  token: token,
                  amount: amount,
                  email: email,
                  description: `${courseTitle} - ${modality}`,
                  metadata: {
                    course_slug: courseSlug,
                    course_title: courseTitle,
                    modality: modality,
                    student_name: fullName,
                    student_email: email,
                    student_phone: phone
                  }
                })
              });

              const chargeData = await chargeResponse.json();

              if (!chargeResponse.ok) {
                throw new Error(chargeData.error || 'Error al procesar el pago');
              }

              setProcessing(false);
              onSuccess(chargeData);
            } catch (error: any) {
              setProcessing(false);
              onError(error.message || 'Error al procesar el pago');
            }
          } else if (Culqi.error) {
            setProcessing(false);
            onError(Culqi.error.user_message || Culqi.error.merchant_message || 'Error al procesar la tarjeta');
          }
        };

        clearInterval(checkCulqi);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkCulqi);
    }, 5000);

    return () => clearInterval(checkCulqi);
  }, [amount, courseSlug, courseTitle, modality, email, fullName, phone, onSuccess, onError]);

  const handleDemoPayment = async () => {
    console.log('🎭 DEMO MODE: Simulating payment...');
    setProcessing(true);

    try {
      const demoResponse = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'demo_token_' + Date.now(),
          amount: amount,
          email: email,
          description: `${courseTitle} - ${modality}`,
          metadata: {
            course_slug: courseSlug,
            course_title: courseTitle,
            modality: modality,
            student_name: fullName,
            student_email: email,
            student_phone: phone,
            demo_mode: true
          }
        })
      });

      const demoData = await demoResponse.json();

      if (!demoResponse.ok) {
        throw new Error(demoData.error || 'Error en pago demo');
      }

      setProcessing(false);
      onSuccess(demoData);
      return true;
    } catch (error: any) {
      setProcessing(false);
      onError(error.message || 'Error en pago demo');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!culqiLoaded || !window.Culqi) {
      onError('Culqi no está cargado. Por favor, recarga la página.');
      return;
    }

    const cardNumber = (document.getElementById('card[number]') as HTMLInputElement)?.value.replace(/\s/g, '');
    const cvv = (document.getElementById('card[cvv]') as HTMLInputElement)?.value;
    const expMonth = (document.getElementById('card[exp_month]') as HTMLInputElement)?.value;
    const expYear = (document.getElementById('card[exp_year]') as HTMLInputElement)?.value;

    if (!cardNumber || !cvv || !expMonth || !expYear) {
      onError('Por favor completa todos los campos de la tarjeta');
      return;
    }

    setProcessing(true);

    try {
      const tokenResponse = await fetch('/api/payment/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_number: cardNumber,
          cvv: cvv,
          expiration_month: expMonth,
          expiration_year: expYear,
          email: email
        })
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.success) {
        throw new Error(tokenData.error || 'Error al procesar la tarjeta');
      }

      const chargeResponse = await fetch('/api/payment/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenData.token,
          amount: amount,
          email: email,
          description: `${courseTitle} - ${modality}`,
          metadata: {
            course_slug: courseSlug,
            course_title: courseTitle,
            modality: modality,
            student_name: fullName,
            student_email: email,
            student_phone: phone
          }
        })
      });

      const chargeData = await chargeResponse.json();

      if (!chargeResponse.ok) {
        throw new Error(chargeData.error || 'Error al procesar el pago');
      }

      setProcessing(false);
      onSuccess(chargeData);
    } catch (error: any) {
      setProcessing(false);
      onError(error.message || 'Error al procesar el pago');
    }
  };

  return (
    <div>
      <form id="culqi-form" onSubmit={handleSubmit}>
        <input type="hidden" id="card[email]" name="card[email]" defaultValue={email} />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.25rem',
            fontWeight: '600',
            color: '#202124',
            fontSize: '0.72rem'
          }}>
            Número de tarjeta
          </label>
          <input
            type="text"
            id="card[number]"
            name="card[number]"
            placeholder="4111 1111 1111 1111"
            maxLength={16}
            required
            disabled={processing}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #DADCE0',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontWeight: '600',
              color: '#202124',
              fontSize: '0.72rem'
            }}>
              Fecha de vencimiento
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                id="card[exp_month]"
                name="card[exp_month]"
                placeholder="MM"
                maxLength={2}
                required
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #DADCE0',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ color: '#5F6368' }}>/</span>
              <input
                type="text"
                id="card[exp_year]"
                name="card[exp_year]"
                placeholder="YY"
                maxLength={2}
                required
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #DADCE0',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontWeight: '600',
              color: '#202124',
              fontSize: '0.72rem'
            }}>
              Código de seguridad
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="card[cvv]"
                name="card[cvv]"
                placeholder="CVV"
                maxLength={4}
                required
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  paddingRight: '40px',
                  border: '1px solid #DADCE0',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
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

        <button
          type="submit"
          disabled={processing}
          style={{
            width: '100%',
            padding: '1rem',
            background: processing ? '#9AA0A6' : 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: processing ? 'not-allowed' : 'pointer',
            marginTop: '1rem',
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)'
          }}
        >
          {processing ? 'Procesando pago...' : `Pagar Ahora - S/ ${amount.toFixed(2)}`}
        </button>

        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: '#FFF3E0',
          border: '1px solid #FFB74D',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#E65100',
          textAlign: 'center'
        }}>
          <strong>Modo Prueba:</strong> No se realizará ningún cargo real
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#E8F5E9',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#2E7D32',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🔒</span>
          <span>Pago seguro y encriptado</span>
        </div>
      </form>
    </div>
  );
}
