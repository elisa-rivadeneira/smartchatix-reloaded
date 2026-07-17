'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserMenu from './UserMenu';

interface AppHeaderProps {
  user?: any;
  showBackButton?: boolean;
  backUrl?: string;
  backLabel?: string;
  title?: string;
}

export default function AppHeader({
  user,
  showBackButton = false,
  backUrl = '/aula-virtual',
  backLabel = 'Volver',
  title
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/images/logo_smartchatix_horiz.png"
            alt="SmartChatix"
            width={168}
            height={48}
            style={{
              objectFit: 'contain'
            }}
          />
        </Link>

        {showBackButton && (
          <>
            <div style={{
              width: '1px',
              height: '30px',
              background: '#e5e7eb'
            }} />
            <button
              onClick={() => router.push(backUrl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span>←</span>
              <span>{backLabel}</span>
            </button>
          </>
        )}

        {title && (
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}
