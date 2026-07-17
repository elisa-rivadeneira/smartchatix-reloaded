'use client';

import { useState, useEffect } from 'react';

export type Currency = 'PEN' | 'USD';

export interface CurrencyData {
  currency: Currency;
  symbol: string;
  loading: boolean;
  convertPrice: (priceInPEN: number) => number;
  formatPrice: (priceInPEN: number) => string;
}

export function useCurrency(): CurrencyData {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [symbol, setSymbol] = useState('US$');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);

    async function detectCountry() {
      try {
        const testCountry = typeof window !== 'undefined' ? localStorage.getItem('test_country') : null;

        let countryCode = 'US';

        if (testCountry) {
          countryCode = testCountry;
          console.log('🧪 Modo test - País simulado:', testCountry);
        } else {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal,
            cache: 'force-cache'
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }

          const data = await response.json();
          countryCode = data.country_code;
          console.log('🌍 País detectado:', data.country_name, '(' + countryCode + ')');
        }

        if (countryCode === 'PE') {
          setCurrency('PEN');
          setSymbol('S/');
          console.log('💰 Mostrando precios en Soles (S/)');
        } else {
          setCurrency('USD');
          setSymbol('US$');
          console.log('💰 Mostrando precios en Dólares (US$)');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        setCurrency('USD');
        setSymbol('US$');
      }
    }

    detectCountry();
  }, []);

  const convertPrice = (priceInPEN: number): number => {
    if (currency === 'USD') {
      return Math.round(priceInPEN / 3.8);
    }
    return priceInPEN;
  };

  const formatPrice = (priceInPEN: number): string => {
    const price = convertPrice(priceInPEN);
    return `${symbol} ${price}`;
  };

  return {
    currency,
    symbol,
    convertPrice,
    formatPrice,
    loading
  };
}
