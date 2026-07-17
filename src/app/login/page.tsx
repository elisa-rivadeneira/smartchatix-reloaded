'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'instructor') {
        router.push('/instructor');
      } else {
        router.push('/aula-virtual');
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.');
      setLoading(false);
    }
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
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '48px',
        maxWidth: '440px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <Link href="/">
            <Image
              src="/images/logo_smartchatix_horiz.png"
              alt="SmartChatix"
              width={280}
              height={60}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1a202c',
          textAlign: 'center'
        }}>
          Iniciar Sesión
        </h1>

        <p style={{
          color: '#718096',
          textAlign: 'center',
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          Bienvenido de vuelta
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d3748',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d3748',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fed7d7',
              color: '#c53030',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div style={{
            textAlign: 'center',
            color: '#718096',
            fontSize: '14px'
          }}>
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Regístrate aquí
            </Link>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <Link
              href="/"
              style={{
                color: '#718096',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              ← Volver al inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
