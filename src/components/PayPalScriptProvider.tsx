'use client';

import { useEffect } from 'react';

export default function PayPalScriptProvider() {
  useEffect(() => {
    console.log('🔍 process.env:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.error('❌ NEXT_PUBLIC_PAYPAL_CLIENT_ID no está configurado');
      console.error('❌ Variables disponibles:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')));
      return;
    }

    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      console.log('✅ Script de PayPal ya está cargado');
      return;
    }

    console.log('🔵 Cargando SDK de PayPal con Client ID:', clientId.substring(0, 20) + '...');

    // Usar Sandbox para desarrollo
    const isSandbox = clientId.includes('Abysyyi'); // Detectar si es sandbox
    const baseUrl = isSandbox
      ? 'https://www.sandbox.paypal.com/sdk/js'
      : 'https://www.paypal.com/sdk/js';

    const script = document.createElement('script');
    script.src = `${baseUrl}?client-id=${clientId}&currency=USD&locale=es_PE`;
    script.async = true;

    console.log('📡 URL del SDK:', script.src);

    script.onload = () => {
      console.log('✅ SDK de PayPal cargado exitosamente');
    };

    script.onerror = () => {
      console.error('❌ Error cargando SDK de PayPal');
    };

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}
