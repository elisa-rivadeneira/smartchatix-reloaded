'use client';

import React from 'react';

interface WhatsAppFloatingButtonProps {
  // Mensaje que llega pre-escrito en WhatsApp. Si se omite, el chat abre vacío.
  message?: string;
}

export default function WhatsAppFloatingButton({ message }: WhatsAppFloatingButtonProps) {
  const href = message
    ? `https://wa.me/51967717179?text=${encodeURIComponent(message)}`
    : 'https://wa.me/51967717179';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
      }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="white"
        style={{ width: '32px', height: '32px' }}
      >
        <path d="M16 0C7.164 0 0 7.164 0 16c0 2.832.748 5.484 2.052 7.78L.7 30.136l6.548-1.708A15.876 15.876 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm9.304 22.948c-.388 1.096-1.932 2.004-3.156 2.268-.844.18-1.944.324-5.648-1.212-4.744-1.968-7.8-6.752-8.036-7.064-.232-.312-1.892-2.516-1.892-4.8s1.2-3.408 1.624-3.876c.424-.468.928-.588 1.24-.588.312 0 .624.004.896.016.288.012.672-.108 1.052.8.388.932 1.32 3.22 1.436 3.456.116.236.192.512.04.824-.152.312-.228.508-.456.784-.228.276-.48.616-.684.828-.228.236-.464.492-.2.964.264.468 1.176 1.94 2.524 3.144 1.736 1.548 3.2 2.032 3.656 2.256.456.228.72.192.984-.116.264-.308 1.132-1.32 1.432-1.772.3-.452.604-.376 1.016-.228.412.148 2.62 1.236 3.072 1.464.452.228.756.344.864.532.108.188.108 1.088-.28 2.184z" />
      </svg>
    </a>
  );
}
