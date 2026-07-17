'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

interface CourseInstructorHeaderProps {
  courseTitle: string;
  slug: string;
  activeTab: 'contenido' | 'calificaciones' | 'configuracion' | 'estudiantes';
  showCustomHeader?: boolean;
  setActiveTab?: (tab: string) => void;
}

export default function CourseInstructorHeader({ courseTitle, slug, activeTab, showCustomHeader = false, setActiveTab }: CourseInstructorHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (showCustomHeader) {
      loadUser();
    }
  }, [showCustomHeader]);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  return (
    <>
      {showCustomHeader && (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/instructor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/images/logo_smartchatix_horiz.png"
                alt="SmartChatix"
                width={180}
                height={52}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <div style={{ height: '40px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
            <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
              {courseTitle}
            </h1>
          </div>

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
                overflow: 'hidden',
                zIndex: 1000
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
                    {user?.name || 'Usuario'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {user?.email}
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

                {user?.role === 'admin' && (
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
      )}

      <Breadcrumb
        title={courseTitle}
        items={[
          { label: 'Instructor', href: '/instructor' },
          { label: 'Mis Cursos', href: '/instructor' },
          { label: courseTitle, href: `/instructor/curso/${slug}` },
          { label: activeTab === 'contenido' ? 'Contenido del Curso' :
                   activeTab === 'calificaciones' ? 'Calificaciones' :
                   activeTab === 'configuracion' ? 'Configuración' : 'Estudiantes' }
        ]}
        grayBackground={true}
      >
        <div style={{ display: 'flex', gap: '32px' }}>
          {['contenido', 'calificaciones', 'configuracion', 'estudiantes'].map(tab => {
            const handleClick = () => {
              if (tab === 'calificaciones') {
                router.push(`/instructor/curso/${slug}/calificaciones`);
              } else {
                if (setActiveTab) {
                  setActiveTab(tab);
                } else {
                  router.push(`/instructor/curso/${slug}`);
                }
              }
            };

            return (
              <button
                key={tab}
                onClick={handleClick}
                style={{
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #667eea' : '2px solid transparent',
                  color: activeTab === tab ? '#667eea' : '#6b7280',
                  fontSize: '15px',
                  fontWeight: activeTab === tab ? '600' : '500',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'contenido' ? 'Contenido del Curso' :
                 tab === 'calificaciones' ? 'Calificaciones' :
                 tab === 'configuracion' ? 'Configuración' : 'Estudiantes'}
              </button>
            );
          })}
        </div>
      </Breadcrumb>
    </>
  );
}
