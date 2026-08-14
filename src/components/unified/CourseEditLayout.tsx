'use client';

import { useState, ReactNode } from 'react';
import UnifiedSidebar from './UnifiedSidebar';
import Image from 'next/image';

export type CourseEditTab = 'informacion' | 'modulos' | 'calificaciones' | 'configuracion';

interface CourseEditLayoutProps {
  course: {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    publication_status?: string;
  };
  currentUser: any;
  activeTab: CourseEditTab;
  onTabChange: (tab: CourseEditTab) => void;
  onLogout: () => void;
  children: ReactNode;
}

export default function CourseEditLayout({
  course,
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  children
}: CourseEditLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠', href: `/instructor/curso/${course.slug}` },
    { id: 'contenido', label: 'Contenido', icon: '📚', href: `/instructor/curso/${course.slug}` },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥', href: '#' },
    { id: 'calificaciones', label: 'Calificaciones', icon: '📊', href: `/instructor/curso/${course.slug}/calificaciones` },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️', href: '#' },
  ];

  const tabs = [
    { id: 'informacion' as CourseEditTab, label: 'Información', icon: '📝' },
    { id: 'modulos' as CourseEditTab, label: 'Módulos', icon: '📚' },
    { id: 'calificaciones' as CourseEditTab, label: 'Calificaciones', icon: '📊' },
    { id: 'configuracion' as CourseEditTab, label: 'Configuración', icon: '⚙️' },
  ];

  const bottomNavItems = [
    { icon: '🏠', label: 'Dashboard' },
    { icon: '📚', label: 'Contenido' },
    { icon: '👥', label: 'Estudiantes' },
    { icon: '📊', label: 'Calificaciones' },
    { icon: '⋯', label: 'Más' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <style>{`
        @media (max-width: 1024px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: 140px !important;
          }
          .bottom-nav {
            display: flex !important;
          }
          .tabs-container {
            padding: 0 1rem !important;
          }
        }

        @media (min-width: 1025px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: none !important;
          }
          .main-content {
            margin-left: 280px !important;
            padding-top: 0 !important;
          }
          .bottom-nav {
            display: none !important;
          }
        }

        .tab-button {
          position: relative;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #7c3aed;
        }
      `}</style>

      <UnifiedSidebar
        menuItems={sidebarItems}
        currentUser={currentUser}
        onLogout={onLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        title={course.title}
        subtitle={course.publication_status === 'published' ? 'Publicado' : 'Borrador'}
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
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
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

          <button
            style={{
              marginLeft: 'auto',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ⋮
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {course.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={32}
                height={32}
                style={{ borderRadius: '6px', objectFit: 'cover' }}
              />
            )}
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {course.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                {course.publication_status === 'published' ? 'Publicado' : 'Borrador'}
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>▼</span>
          </button>
        </div>
      </header>

      <main className="main-content" style={{ padding: '2rem 1rem', minHeight: '100vh' }}>
        <div style={{ height: '100%' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            height: '100%'
          }}>
            <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>
                Editar Curso
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Actualiza la información y configura tu curso
              </p>
            </div>

            <div
              className="tabs-container"
              style={{
                display: 'flex',
                gap: '2rem',
                padding: '0 1.5rem',
                marginTop: '1.5rem',
                borderBottom: '2px solid #f3f4f6',
                overflowX: 'auto'
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    padding: '1rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '2rem 1.5rem' }}>
              {children}
            </div>
          </div>
        </div>
      </main>

      <nav
        className="bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
          padding: '0.75rem',
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 996
        }}
      >
        {bottomNavItems.map((item, index) => (
          <button
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#6b7280',
              fontSize: '11px'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
