'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Certificate {
  student_name: string;
  course_title: string;
  final_score: number;
  issue_date: string;
  is_valid: boolean;
  verification_code: string;
}

export default function VerificarCertificadoPage({ params }: { params: Promise<{ codigo: string }> }) {
  const resolvedParams = use(params);
  const codigo = resolvedParams.codigo;

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verificar = async () => {
      try {
        const response = await fetch(`/api/verify-certificate/${codigo}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Certificado no encontrado');
          return;
        }

        setCertificate(data.certificate);
      } catch (err) {
        setError('Error al verificar certificado');
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, [codigo]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ fontSize: '18px' }}>Verificando certificado...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            ❌
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '16px'
          }}>
            Certificado No Válido
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            {error || 'El código de verificación no corresponde a ningún certificado válido.'}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '24px'
          }}>
            Código buscado: <strong>{codigo}</strong>
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate.is_valid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#d97706',
            marginBottom: '16px'
          }}>
            Certificado Revocado
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Este certificado ha sido revocado y ya no es válido.
          </p>
        </div>
      </div>
    );
  }

  const issueDate = new Date(certificate.issue_date);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px'
          }}>
            ✓
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#059669',
            marginBottom: '8px'
          }}>
            Certificado Válido
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Este certificado es auténtico y verificable
          </p>
        </div>

        <div style={{
          background: '#f9fafb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Estudiante
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a202c'
            }}>
              {certificate.student_name}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Curso
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151'
            }}>
              {certificate.course_title}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Calificación
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#10b981'
              }}>
                {certificate.final_score.toFixed(2)}%
              </p>
            </div>

            <div>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Fecha de emisión
              </p>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                {issueDate.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#1e40af',
            marginBottom: '4px',
            fontWeight: '600'
          }}>
            CÓDIGO DE VERIFICACIÓN
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e3a8a',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            {certificate.verification_code}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
