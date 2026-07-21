'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentSidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ user, isOpen, onClose }: StudentSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
        />
      )}

      <aside style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-280px',
        width: '280px',
        height: '100vh',
        background: '#2d3748',
        color: 'white',
        transition: 'left 0.3s ease-in-out',
        zIndex: 999,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 8px 0'
            }}>
              SmartChatix Academy
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#a0aec0',
              margin: 0
            }}>
              {user?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(251, 191, 36, 0.2)',
                border: 'none',
                borderLeft: '4px solid #f59e0b',
                color: '#fbbf24',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <span>Panel Admin</span>
            </Link>
          )}

          {isInstructor && (
            <Link
              href="/instructor"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: 'none',
                borderLeft: '4px solid #8b5cf6',
                color: '#a78bfa',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>👨‍🏫</span>
              <span>Panel Instructor</span>
            </Link>
          )}

          <Link
            href="/perfil"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderLeft: '4px solid transparent',
              color: '#a0aec0',
              fontSize: '15px',
              fontWeight: '400',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>👤</span>
            <span>Mi Perfil</span>
          </Link>

          <Link
            href="/aula-virtual"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderLeft: '4px solid transparent',
              color: '#a0aec0',
              fontSize: '15px',
              fontWeight: '400',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>📚</span>
            <span>Mis Cursos</span>
          </Link>

          <Link
            href="/"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderLeft: '4px solid transparent',
              color: '#a0aec0',
              fontSize: '15px',
              fontWeight: '400',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>🔍</span>
            <span>Catálogo</span>
          </Link>
        </nav>

        <div style={{
          padding: '20px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
