'use client';

import React, { useState, useEffect, useCallback } from 'react';

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

  const handlePayment = useCallback(async () => {
    const Culqi = window.Culqi;

    if (Culqi.token) {
      const token = Culqi.token.id;
      setProcessing(true);

      try {
        console.log('💳 Procesando pago con token:', token);
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
          if (chargeData.alreadyEnrolled) {
            throw new Error(chargeData.message || 'Ya estás inscrito en este curso');
          }
          throw new Error(chargeData.error || chargeData.details || 'Error al procesar el pago');
        }

        console.log('✅ Pago exitoso, cerrando modal de Culqi');

        if (window.Culqi && typeof window.Culqi.close === 'function') {
          window.Culqi.close();
        }

        setProcessing(false);
        console.log('✅ Llamando onSuccess con datos:', chargeData);
        onSuccess(chargeData);
      } catch (error: any) {
        console.error('❌ Error en pago:', error);

        if (window.Culqi && typeof window.Culqi.close === 'function') {
          window.Culqi.close();
        }

        setProcessing(false);

        let errorMessage = 'No se pudo procesar el pago. ';

        if (error.message.includes('inscrito')) {
          errorMessage = error.message;
        } else if (error.message.includes('fraud') || error.message.includes('fraude') || error.message.includes('sospecha')) {
          errorMessage = 'La transacción fue rechazada por motivos de seguridad. Por favor, contacta a tu banco o intenta con otra tarjeta.';
        } else if (error.message.includes('fondos') || error.message.includes('insufficient')) {
          errorMessage += 'Fondos insuficientes en la tarjeta. Por favor, intenta con otra tarjeta.';
        } else if (error.message.includes('rechazada') || error.message.includes('declined')) {
          errorMessage += 'La tarjeta fue rechazada por el banco. Por favor, contacta a tu banco o intenta con otra tarjeta.';
        } else if (error.message.includes('expirada') || error.message.includes('expired')) {
          errorMessage += 'La tarjeta ha expirado. Por favor, verifica la fecha de vencimiento.';
        } else if (error.message.includes('CVV') || error.message.includes('cvv')) {
          errorMessage += 'El código CVV es incorrecto. Por favor, verifica el código de seguridad.';
        } else if (error.message.includes('tarjeta') || error.message.includes('card')) {
          errorMessage += 'Hubo un problema con los datos de la tarjeta. Por favor, verifica la información e intenta nuevamente.';
        } else if (error.message.includes('network') || error.message.includes('conexión')) {
          errorMessage += 'Problema de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
        } else {
          errorMessage += error.message || 'Por favor, verifica los datos de tu tarjeta e intenta nuevamente. Si el problema persiste, contacta a soporte.';
        }

        onError(errorMessage);
      }
    } else if (Culqi.error) {
      console.error('❌ Error de Culqi detectado:', Culqi.error);

      if (window.Culqi && typeof window.Culqi.close === 'function') {
        window.Culqi.close();
      }

      setProcessing(false);

      let errorMessage = 'No se pudo procesar el pago. ';
      const culqiError = Culqi.error.user_message || Culqi.error.merchant_message || '';
      const errorCode = Culqi.error.code || '';

      if (errorCode.includes('fraud') || culqiError.toLowerCase().includes('fraud') || culqiError.toLowerCase().includes('fraude')) {
        errorMessage = 'La transacción fue rechazada por motivos de seguridad. Por favor, contacta a tu banco o intenta con otra tarjeta.';
      } else if (culqiError.toLowerCase().includes('cvv')) {
        errorMessage = 'El código CVV es incorrecto. Por favor, verifica el código de seguridad de tu tarjeta.';
      } else if (culqiError.toLowerCase().includes('expirada') || culqiError.toLowerCase().includes('expired')) {
        errorMessage = 'La tarjeta ha expirado. Por favor, verifica la fecha de vencimiento.';
      } else if (culqiError.toLowerCase().includes('número') || culqiError.toLowerCase().includes('number')) {
        errorMessage = 'El número de tarjeta es inválido. Por favor, verifica el número e intenta nuevamente.';
      } else if (culqiError.toLowerCase().includes('declined') || culqiError.toLowerCase().includes('rechazada')) {
        errorMessage = 'La tarjeta fue rechazada por el banco. Por favor, contacta a tu banco o intenta con otra tarjeta.';
      } else if (culqiError) {
        errorMessage = culqiError;
      } else {
        errorMessage += 'Por favor, verifica los datos de tu tarjeta e intenta nuevamente.';
      }

      onError(errorMessage);
    }
  }, [amount, courseSlug, courseTitle, modality, email, fullName, phone, onSuccess, onError]);

  useEffect(() => {
    const checkCulqi = setInterval(() => {
      if (typeof window !== 'undefined' && window.Culqi) {
        const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

        window.Culqi.publicKey = publicKey;
        window.culqi = handlePayment;

        setCulqiLoaded(true);
        clearInterval(checkCulqi);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkCulqi);
    }, 5000);

    return () => clearInterval(checkCulqi);
  }, [handlePayment]);

  const openCulqiCheckout = () => {
    if (!culqiLoaded || !window.Culqi) {
      onError('Culqi no está disponible. Por favor recarga la página.');
      return;
    }

    try {
      window.Culqi.settings({
        title: 'SmartChatix',
        currency: 'PEN',
        amount: Math.round(Number(amount) * 100),
        description: `${courseTitle} - ${modality}`
      });

      window.Culqi.options({
        lang: 'auto',
        installments: false,
        paymentmethods: {
          tarjeta: true,
          yape: false,
          billetera: false,
          bancaMovil: false,
          agente: false,
          cuotealo: false
        },
        style: {
          bannerColor: '#FF6600',
          buttonBackground: '#FF6600',
          menuColor: '#FF6600',
          linksColor: '#FF6600',
          buttonText: 'Pagar ahora',
          buttonTextColor: '#FFFFFF',
          priceColor: '#FF6600'
        }
      });

      window.Culqi.open();
    } catch (error: any) {
      console.error('Error opening Culqi:', error);
      onError('Error al abrir el formulario de pago');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#202124',
          marginBottom: '0.5rem'
        }}>
          {courseTitle}
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: '#5F6368',
          marginBottom: '1rem'
        }}>
          Modalidad: {modality}
        </p>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#FF6600',
          marginBottom: '0.5rem'
        }}>
          S/ {Number(amount).toFixed(2)}
        </div>
      </div>

      <button
        onClick={openCulqiCheckout}
        disabled={!culqiLoaded || processing}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '1.25rem 2rem',
          background: (!culqiLoaded || processing) ? '#9AA0A6' : 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: (!culqiLoaded || processing) ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 16px rgba(255, 102, 0, 0.4)',
          transition: 'all 0.3s ease',
          marginBottom: '1.5rem'
        }}
        onMouseEnter={(e) => {
          if (culqiLoaded && !processing) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 102, 0, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 102, 0, 0.4)';
        }}
      >
        {!culqiLoaded ? '⏳ Cargando...' : (processing ? '⏳ Procesando...' : '🔒 Pagar con Tarjeta')}
      </button>

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
          <span><strong>Pago 100% seguro</strong></span>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem' }}>
          Procesado por Culqi - Certificado PCI DSS
        </p>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#5F6368',
        maxWidth: '400px',
        margin: '1rem auto 0'
      }}>
        Al hacer clic en "Pagar", aceptas los términos y condiciones del curso.
      </div>
    </div>
  );
}
