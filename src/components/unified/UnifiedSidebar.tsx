'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  badge?: number | null;
  onClick?: () => void;
}

interface UnifiedSidebarProps {
  menuItems: MenuItem[];
  activeItem?: string;
  currentUser: any;
  onLogout: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  showLegacyLink?: boolean;
}

export default function UnifiedSidebar({
  menuItems,
  activeItem,
  currentUser,
  onLogout,
  mobileMenuOpen = false,
  setMobileMenuOpen,
  title,
  subtitle,
  showLegacyLink = false
}: UnifiedSidebarProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .unified-sidebar {
            transform: translateX(${mobileMenuOpen ? '0' : '-100%'}) !important;
          }
        }

        @media (min-width: 1025px) {
          .unified-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen?.(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
        />
      )}

      <aside
        className="unified-sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          transition: 'transform 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: title ? '1rem' : 0 }}>
            <Image
              src="/images/logo_smartchatix_horiz.png"
              alt="SmartChatix"
              width={140}
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {title && (
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: subtitle ? '0.5rem' : 0
              }}>
                {title}
              </div>
              {subtitle && (
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280'
                }}>
                  {subtitle}
                </div>
              )}
            </div>
          )}
        </div>

        <nav style={{
          flex: 1,
          padding: '1rem 0',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0
        }}>

          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            const content = (
              <>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span style={{
                    padding: '2px 8px',
                    background: '#7c3aed',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {item.badge}
                  </span>
                )}
              </>
            );

            const commonStyles = {
              width: '100%',
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: isActive ? '#f3f4f6' : 'transparent',
              border: 'none',
              borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#7c3aed' : '#6b7280',
              textAlign: 'left' as const,
              textDecoration: 'none'
            };

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={commonStyles}
                  onClick={() => {
                    setMobileMenuOpen?.(false);
                    item.onClick?.();
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen?.(false);
                  item.onClick?.();
                }}
                style={commonStyles}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {content}
              </button>
            );
          })}

          {showLegacyLink && (
            <Link
              href="/dashboard"
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(251, 191, 36, 0.1)',
                border: 'none',
                borderLeft: '3px solid #f59e0b',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500',
                color: '#d97706',
                textAlign: 'left',
                textDecoration: 'none',
                marginTop: '1rem'
              }}
              onClick={() => setMobileMenuOpen?.(false)}
            >
              <span style={{ fontSize: '18px' }}>🔄</span>
              <span>Vista Legacy</span>
            </Link>
          )}
        </nav>

        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: '1rem'
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: '100%',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {currentUser?.nombre?.charAt(0)?.toUpperCase() || currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.nombre || currentUser?.name || 'Usuario'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {currentUser?.role === 'admin' ? 'Administrador' : currentUser?.role === 'instructor' ? 'Instructor' : 'Estudiante'}
                </div>
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>▼</span>
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
              }}>
                {currentUser?.role === 'admin' && (
                  <Link
                    href="/admin"
                    style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#374151',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => {
                      setUserMenuOpen(false);
                      setMobileMenuOpen?.(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    🔧 Panel Admin
                  </Link>
                )}
                {(currentUser?.role === 'instructor' || currentUser?.role === 'admin') && (
                  <Link
                    href="/dashboard"
                    style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#374151',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => {
                      setUserMenuOpen(false);
                      setMobileMenuOpen?.(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    👨‍🏫 Panel Instructor
                  </Link>
                )}
                <Link
                  href="/aula-virtual"
                  style={{
                    display: 'block',
                    padding: '0.5rem 0.75rem',
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    setMobileMenuOpen?.(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  📚 Mis Cursos
                </Link>
                <Link
                  href="/perfil"
                  style={{
                    display: 'block',
                    padding: '0.5rem 0.75rem',
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => {
                    setUserMenuOpen(false);
                    setMobileMenuOpen?.(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  ⚙️ Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setMobileMenuOpen?.(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '14px',
                    color: '#ef4444',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
