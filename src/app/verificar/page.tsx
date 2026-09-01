'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function VerificarPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = codigo.trim();
    if (!trimmed) return;
    router.push(`/verificar/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <Image
            src="/images/smartchatix_logov3.png"
            alt="SmartChatix"
            width={480}
            height={120}
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            priority
          />
          <div style={{ width: '1px', height: '28px', background: '#e5e7eb' }} />
          <Image
            src="/images/logo_fluideka.jpeg"
            alt="Fluideka"
            width={120}
            height={40}
            style={{ height: '32px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }}
          />
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px'
        }}>
          Verifica un certificado
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '28px'
        }}>
          Ingresa el código de verificación que aparece en el certificado (o escanea el código QR).
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '1px',
              textAlign: 'center',
              textTransform: 'uppercase',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              marginBottom: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          />
          <button
            type="submit"
            disabled={!codigo.trim()}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              background: codigo.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#9ca3af',
              border: 'none',
              borderRadius: '10px',
              cursor: codigo.trim() ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => { if (codigo.trim()) e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Verificar certificado →
          </button>
        </form>
      </div>
    </div>
  );
}
