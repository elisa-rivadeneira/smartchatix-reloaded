'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';
import { getDashboardMenuItems, getDefaultTab } from '@/lib/dashboardMenus';
import Image from 'next/image';
import InstructorCoursesSection from '@/components/dashboard/InstructorCoursesSection';
import AdminDashboardSection from '@/components/dashboard/AdminDashboardSection';
import AdminUsersSection from '@/components/dashboard/AdminUsersSection';
import StudentCoursesSection from '@/components/dashboard/StudentCoursesSection';
import AdminCoursesSection from '@/components/dashboard/AdminCoursesSection';
import AdminEnrollmentsSection from '@/components/dashboard/AdminEnrollmentsSection';
import AdminInstructorsSection from '@/components/dashboard/AdminInstructorsSection';
import AdminSettingsSection from '@/components/dashboard/AdminSettingsSection';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setActiveTab(getDefaultTab(data.user.role));
      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
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
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) return null;

  const badges = {
    usuarios: 6,
    cursos: 9,
    inscripciones: 2
  };

  const menuItems = getDashboardMenuItems(currentUser.role, activeTab, setActiveTab, badges);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 0.75rem !important; padding-top: 80px !important; }
          .content-wrapper { padding: 1rem !important; border-radius: 0 !important; border: none !important; }
        }

        @media (min-width: 1025px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-header { display: none !important; }
          .main-content { margin-left: 280px !important; padding-top: 0 !important; }
        }
      `}</style>

      <UnifiedSidebar
        menuItems={menuItems}
        activeItem={activeTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        title={currentUser.role === 'admin' ? 'Panel Administrador' : currentUser.role === 'instructor' ? 'Panel Instructor' : 'Mis Cursos'}
        subtitle={currentUser.nombre || currentUser.name || 'Usuario'}
        showLegacyLink={true}
      />

      <header
        className="mobile-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          zIndex: 997,
          display: 'none',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={{
            padding: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          ☰
        </button>

        <Image
          src="/images/logo_smartchatix_horiz.png"
          alt="SmartChatix"
          width={100}
          height={30}
          style={{ objectFit: 'contain' }}
        />

        <div style={{ flex: 1 }} />
      </header>

      <main className="main-content" style={{ padding: '2rem', minHeight: '100vh', height: '100vh', overflow: 'auto' }}>
        <div style={{ height: '100%' }}>
          <div className="content-wrapper" style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            height: '100%'
          }}>
            {activeTab === 'dashboard' && (
              <>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                  Dashboard
                </h1>
                <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                  Bienvenido, {currentUser.nombre || currentUser.name}
                </p>
                <AdminDashboardSection />
              </>
            )}

            {activeTab === 'usuarios' && (
              <AdminUsersSection />
            )}

            {activeTab === 'cursos' && (
              <AdminCoursesSection />
            )}

            {activeTab === 'pagos' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  💳 Pagos
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Gestión de pagos y transacciones.
                </p>
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{ margin: 0, color: '#92400e' }}>
                    🚧 <strong>Contenido en migración:</strong> Esta sección se está integrando desde /admin
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'inscripciones' && (
              <AdminEnrollmentsSection />
            )}

            {activeTab === 'instructores' && (
              <AdminInstructorsSection />
            )}

            {activeTab === 'reportes' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  📈 Reportes
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Reportes y estadísticas del sistema.
                </p>
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{ margin: 0, color: '#92400e' }}>
                    🚧 <strong>Contenido en migración:</strong> Esta sección se está integrando desde /admin
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'mis-cursos' && (
              <StudentCoursesSection />
            )}

            {activeTab === 'cursos-instructor' && (
              <InstructorCoursesSection />
            )}

            {activeTab === 'estudiantes' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  👥 Estudiantes
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Lista de todos tus estudiantes.
                </p>
              </div>
            )}

            {activeTab === 'crear-curso' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                  ➕ Crear Curso
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Asistente para crear un nuevo curso.
                </p>
              </div>
            )}


            {activeTab === 'configuracion' && (
              <AdminSettingsSection />
            )}

            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#075985', margin: '0 0 0.75rem 0' }}>
                ℹ️ Información del Usuario
              </h3>
              <div style={{ fontSize: '14px', color: '#0c4a6e' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Nombre:</strong> {currentUser.nombre || currentUser.name}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {currentUser.email}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Rol:</strong> {currentUser.role}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Tab activo:</strong> {activeTab}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
