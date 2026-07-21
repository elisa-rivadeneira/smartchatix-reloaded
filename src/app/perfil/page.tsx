'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
}

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setCurrentUser(data.user);
      setName(data.user.name || '');
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Perfil actualizado correctamente');
        setCurrentUser(prev => prev ? { ...prev, name } : null);
      } else {
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error al cambiar la contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        height: '72px',
        background: '#1c1d1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo_smartchatix_horiz.png"
            alt="SmartChatix"
            width={180}
            height={52}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              background: userMenuOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '220px',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '4px'
                }}>
                  {currentUser?.name || 'Usuario'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {currentUser?.email}
                </div>
              </div>
              <Link
                href="/aula-virtual"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>📚</span>
                Mis Cursos
              </Link>
              <Link
                href="/"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>🔍</span>
                Catálogo
              </Link>
              {(currentUser?.role === 'admin' || currentUser?.role === 'instructor') && (
                <>
                  {currentUser?.role === 'instructor' && (
                    <Link
                      href="/instructor"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ fontSize: '16px' }}>👨‍🏫</span>
                      Panel Instructor
                    </Link>
                  )}
                  {currentUser?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <span style={{ fontSize: '16px' }}>⚙️</span>
                      Panel Admin
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={async () => {
                  setUserMenuOpen(false);
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'white',
                  border: 'none',
                  textAlign: 'left',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>🚪</span>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/aula-virtual' },
          { label: 'Mi Perfil' }
        ]}
        grayBackground={true}
      />

      <main style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '32px'
        }}>
          Mi Perfil
        </h1>

        {message && (
          <div style={{
            padding: '16px',
            background: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#065f46',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✓ {message}
          </div>
        )}

        {error && (
          <div style={{
            padding: '16px',
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#991b1b',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✕ {error}
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '24px'
          }}>
            Información Personal
          </h2>

          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  background: '#f9fafb',
                  color: '#6b7280',
                  cursor: 'not-allowed'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '6px'
              }}>
                El email no se puede cambiar
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: saving ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                color: 'white',
                boxShadow: saving ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '24px'
          }}>
            Cambiar Contraseña
          </h2>

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Tu contraseña actual"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              style={{
                padding: '12px 24px',
                background: changingPassword ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: changingPassword ? 'not-allowed' : 'pointer',
                color: 'white',
                boxShadow: changingPassword ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
