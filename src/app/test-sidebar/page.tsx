'use client';

import { useState } from 'react';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';

export default function TestSidebarPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const mockUser = {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'instructor'
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠', onClick: () => setActiveItem('dashboard') },
    { id: 'contenido', label: 'Contenido', icon: '📚', badge: 3, onClick: () => setActiveItem('contenido') },
    { id: 'lecciones', label: 'Lecciones', icon: '📝', onClick: () => setActiveItem('lecciones') },
    { id: 'quizzes', label: 'Quizzes', icon: '❓', onClick: () => setActiveItem('quizzes') },
    { id: 'tareas', label: 'Tareas', icon: '📋', onClick: () => setActiveItem('tareas') },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥', badge: 25, onClick: () => setActiveItem('estudiantes') },
    { id: 'calificaciones', label: 'Calificaciones', icon: '📊', onClick: () => setActiveItem('calificaciones') },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️', onClick: () => setActiveItem('configuracion') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0 !important;
          }
          .mobile-header {
            display: flex !important;
          }
        }

        @media (min-width: 1025px) {
          .main-content {
            margin-left: 280px !important;
          }
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>

      <UnifiedSidebar
        menuItems={menuItems}
        activeItem={activeItem}
        currentUser={mockUser}
        onLogout={() => alert('Logout')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        title="Introducción a Python"
        subtitle="Publicado"
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
        <h1 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>
          Test Sidebar
        </h1>
      </header>

      <main className="main-content" style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Test del Sidebar Unificado
            </h1>

            <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
              Esta es una página de prueba para validar el diseño del sidebar antes de integrarlo.
            </p>

            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Estado actual:
              </h2>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
                <li>Menú activo: <strong>{activeItem}</strong></li>
                <li>Usuario: <strong>{mockUser.nombre}</strong></li>
                <li>Rol: <strong>{mockUser.role}</strong></li>
                <li>Sidebar móvil: <strong>{mobileMenuOpen ? 'Abierto' : 'Cerrado'}</strong></li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
              <p style={{ margin: 0, color: '#92400e' }}>
                <strong>📱 Para probar responsive:</strong> Cambia el tamaño de la ventana. En desktop el sidebar es fijo. En móvil se oculta y aparece el botón hamburguesa.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Características:
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Logo arriba</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Logo de SmartChatix siempre visible
                  </p>
                </div>

                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Título de contexto</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Muestra curso actual u otro contexto
                  </p>
                </div>

                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Menú con iconos</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Navegación clara con emojis y badges
                  </p>
                </div>

                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Usuario abajo</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Avatar, nombre y menú desplegable
                  </p>
                </div>

                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Responsive</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Desktop fijo, móvil con hamburguesa
                  </p>
                </div>

                <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>✅</div>
                  <strong>Vista Legacy</strong>
                  <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0 0' }}>
                    Link opcional a versión anterior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
