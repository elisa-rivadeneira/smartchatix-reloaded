'use client';

import { useState, useEffect } from 'react';

export type Currency = 'PEN' | 'USD';

export interface CurrencyData {
  currency: Currency;
  symbol: string;
  loading: boolean;
  exchangeRate: number;
  convertPrice: (priceInPEN: number) => number;
  formatPrice: (priceInPEN: number) => string;
  setCurrency: (currency: Currency) => void;
}

export function useCurrency(): CurrencyData {
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [symbol, setSymbol] = useState('US$');
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(3.80);

  const changeCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    setSymbol(newCurrency === 'USD' ? 'US$' : 'S/');
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_currency', newCurrency);
    }
    console.log('💰 Moneda cambiada a:', newCurrency);
  };

  useEffect(() => {
    async function init() {
      try {
        const [rateResponse] = await Promise.all([
          fetch('/api/public/settings/exchange-rate')
        ]);

        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          setExchangeRate(rateData.exchangeRate || 3.80);
          console.log('💱 Tipo de cambio:', rateData.exchangeRate);
        }

        const preferredCurrency = typeof window !== 'undefined' ? localStorage.getItem('preferred_currency') as Currency : null;

        if (preferredCurrency) {
          setCurrencyState(preferredCurrency);
          setSymbol(preferredCurrency === 'USD' ? 'US$' : 'S/');
          console.log('💰 Moneda guardada:', preferredCurrency);
          setLoading(false);
          return;
        }

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
          setCurrencyState('PEN');
          setSymbol('S/');
          console.log('💰 Mostrando precios en Soles (S/)');
        } else {
          setCurrencyState('USD');
          setSymbol('US$');
          console.log('💰 Mostrando precios en Dólares (US$)');
        }
      } catch (error) {
        console.error('Error initializing currency:', error);
        setCurrencyState('USD');
        setSymbol('US$');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const convertPrice = (priceInPEN: number): number => {
    if (currency === 'USD') {
      return Math.round((priceInPEN / exchangeRate) * 100) / 100;
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
    exchangeRate,
    convertPrice,
    formatPrice,
    setCurrency: changeCurrency,
    loading
  };
}
