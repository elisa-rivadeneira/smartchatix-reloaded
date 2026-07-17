import React from 'react';

export default function CertificacionBadge() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        width: '35px',
        height: '35px',
        position: 'relative'
      }}>
        <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M12 2 L4 6 L4 11 C4 16 7 20 12 22 C17 20 20 16 20 11 L20 6 Z"
            fill="#FF6600"
            stroke="#FF6600"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12 L11 14.5 L16 9"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '8.8px',
          fontWeight: '700',
          color: '#FF6600',
          lineHeight: '1.3',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          CERTIFICACIÓN
        </div>
        <div style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '8.8px',
          fontWeight: '700',
          color: '#FF6600',
          lineHeight: '1.3',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          DIGITAL
        </div>
        <div style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '8.8px',
          fontWeight: '700',
          color: '#FF6600',
          lineHeight: '1.3',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          INCLUIDA
        </div>
      </div>
    </div>
  );
}
