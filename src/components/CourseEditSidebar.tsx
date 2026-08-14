'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseEditSidebarProps {
  courseTitle: string;
  courseStatus: 'published' | 'draft' | 'coming_soon';
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentUser: any;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function CourseEditSidebar({
  courseTitle,
  courseStatus,
  activeSection,
  onSectionChange,
  currentUser,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}: CourseEditSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠' },
    { id: 'contenido', label: 'Contenido', icon: '📚' },
    { id: 'lecciones', label: 'Lecciones', icon: '📝' },
    { id: 'quizzes', label: 'Quizzes', icon: '❓' },
    { id: 'tareas', label: 'Tareas', icon: '📋' },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥' },
    { id: 'calificaciones-estudiantes', label: 'Calificaciones por Estudiante', icon: '📊' },
    { id: 'calificaciones-quizzes', label: 'Calificaciones de Quizzes', icon: '📝' },
    { id: 'calificaciones-tareas', label: 'Calificaciones de Tareas', icon: '📋' },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️' },
  ];

  const statusColors = {
    published: { bg: '#d1fae5', text: '#065f46', label: 'Publicado' },
    draft: { bg: '#fef3c7', text: '#92400e', label: 'Borrador' },
    coming_soon: { bg: '#dbeafe', text: '#1e40af', label: 'Próximamente' }
  };

  const status = statusColors[courseStatus] || statusColors.draft;

  return (
    <>
      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
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

      {/* Sidebar */}
      <aside
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
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease'
        }}
        className="course-sidebar"
      >
        <style>{`
          @media (min-width: 1025px) {
            .course-sidebar {
              transform: translateX(0) !important;
            }
          }
        `}</style>

        {/* Logo y título del curso */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <Link href="/instructor" style={{ textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
            <Image
              src="/images/logo_smartchatix_horiz.png"
              alt="SmartChatix"
              width={140}
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Link>

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
              marginBottom: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {courseTitle}
            </div>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              background: status.bg,
              color: status.text
            }}>
              {status.label}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: activeSection === item.id ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderLeft: activeSection === item.id ? '3px solid #667eea' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: activeSection === item.id ? '600' : '400',
                color: activeSection === item.id ? '#667eea' : '#6b7280',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
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
              fontSize: '16px'
            }}>
              {currentUser?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                {currentUser?.nombre || 'Usuario'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Instructor</div>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>▼</span>
          </button>

          {userMenuOpen && (
            <div style={{
              marginTop: '0.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              padding: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <Link
                href="/instructor"
                style={{
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  fontSize: '14px',
                  color: '#374151',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                ← Volver al Panel Administrativo
              </Link>
              <button
                onClick={onLogout}
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
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
