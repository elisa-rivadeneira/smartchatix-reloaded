'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="user-menu-container" style={{ position: 'relative' }}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          padding: '8px 16px',
          background: menuOpen ? '#1a202c' : '#2d3748',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1a202c';
        }}
        onMouseOut={(e) => {
          if (!menuOpen) {
            e.currentTarget.style.background = '#2d3748';
          }
        }}
      >
        👤 {user?.name || 'Usuario'} {menuOpen ? '▲' : '▼'}
      </button>
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          minWidth: '200px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <Link
            href="/perfil"
            onClick={() => setMenuOpen(false)}
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
            <span style={{ fontSize: '16px' }}>👤</span>
            Mi Perfil
          </Link>
          <Link
            href="/aula-virtual"
            onClick={() => setMenuOpen(false)}
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
            Mis Cursoss
          </Link>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
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
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
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
          {user?.role === 'instructor' && (
            <Link
              href="/instructor"
              onClick={() => setMenuOpen(false)}
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
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
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
  );
}
