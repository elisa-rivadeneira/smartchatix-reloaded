'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency, Currency } from '@/hooks/useCurrency';

interface HeaderProps {
  showCursos?: boolean;
  showServicios?: boolean;
  courses?: any[];
  onPilotClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showCursos = false,
  showServicios = true,
  courses = [],
  onPilotClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { currency, setCurrency } = useCurrency();
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  useEffect(() => {
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.show_currency_selector !== undefined) {
          const newValue = data.settings.show_currency_selector === true || data.settings.show_currency_selector === 'true';
          const previousValue = showCurrencySelector;

          setShowCurrencySelector(newValue);

          if (previousValue === true && newValue === false) {
            console.log('🔄 Selector de moneda desactivado - Limpiando preferencia manual');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('preferred_currency');
            }
            window.location.reload();
          }
        }
      })
      .catch(err => console.error('Error fetching currency selector setting:', err));
  }, [showCurrencySelector]);

  const navigationItems = [
    {
      name: 'Inicio',
      href: '/',
      show: true
    },
    {
      name: 'Servicios',
      href: '/servicios',
      show: showServicios,
      children: [
        { name: 'Aulas Virtuales con IA', href: '/servicios/aulas-virtuales' },
      ],
    },
    {
      name: 'Cursos',
      href: '/#otros-programas',
      show: showCursos
    },
    {
      name: 'Nosotros',
      href: '/nosotros',
      show: true
    },
    {
      name: 'Contacto',
      href: 'https://wa.me/51968374191?text=Hola,%20me%20gustaría%20conocer%20cómo%20SmartChatix%20puede%20ayudar%20a%20mi%20empresa.%20¿Podrían%20brindarme%20más%20información?',
      external: true,
      show: true
    },
  ];

  const navigation = navigationItems.filter(item => item.show);

  return (
    <header style={{
      position: 'relative',
      zIndex: 1000
    }}>
      {/* Main Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem'
          }}>
            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <Link href="/" style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', textDecoration: 'none' }}>
                <Image
                  src="/images/smartchatix_logov3.png"
                  alt="SmartChatix"
                  width={480}
                  height={120}
                  quality={100}
                  style={{ height: '2.43rem', width: 'auto', objectFit: 'contain' }}
                  priority
                />
                <div style={{
                  fontSize: '9px',
                  fontWeight: '600',
                  letterSpacing: '0.15em',
                  color: '#64748b',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                  marginTop: '-0.25rem'
                }}>
                  Interactúa <span style={{ margin: '0 0.35rem', color: '#8b5cf6' }}>•</span> Automatiza <span style={{ margin: '0 0.35rem', color: '#8b5cf6' }}>•</span> Evoluciona
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div style={{ display: 'none' }} className="desktop-nav">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {navigation.map((item: any) => (
                  <div key={item.name} style={{ position: 'relative' }}>
                    {item.type === 'cursos' ? (
                      <div style={{ position: 'relative' }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: '12px' }}>▼</span>
                        </button>

                        {openDropdown === item.name && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '100%',
                              paddingTop: '0.5rem',
                              width: '20rem',
                              background: 'transparent',
                              zIndex: 50
                            }}
                            onMouseEnter={() => setOpenDropdown(item.name)}
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            <div
                              style={{
                                background: '#fff',
                                borderRadius: '0.5rem',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 0',
                                maxHeight: '400px',
                                overflowY: 'auto'
                              }}
                            >
                              {courses.filter((course: any) => course.publication_status === 'published').map((course: any) => (
                                <Link
                                  key={course.slug}
                                  href={`/cursos/${course.slug}`}
                                  style={{
                                    display: 'block',
                                    padding: '0.5rem 1rem',
                                    fontSize: '14px',
                                    color: '#374151',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                    {course.title}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {course.hours}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : item.children ? (
                      <div style={{ position: 'relative' }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: '12px' }}>▼</span>
                        </button>

                        {openDropdown === item.name && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '100%',
                              paddingTop: '0.5rem',
                              width: '16rem',
                              background: 'transparent',
                              zIndex: 50
                            }}
                            onMouseEnter={() => setOpenDropdown(item.name)}
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            <div
                              style={{
                                background: '#fff',
                                borderRadius: '0.5rem',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 0'
                              }}
                            >
                              {item.children.map((child: any) => (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  style={{
                                    display: 'block',
                                    padding: '0.5rem 1rem',
                                    fontSize: '14px',
                                    color: '#374151',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'color 0.2s'
                        }}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'color 0.2s'
                        }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Selector + Ingresar Button */}
            <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="desktop-nav">
              {showCurrencySelector && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrency('USD')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: currency === 'USD' ? '600' : '500',
                    background: currency === 'USD' ? '#3b82f6' : 'transparent',
                    color: currency === 'USD' ? '#fff' : '#64748b',
                    border: '1px solid',
                    borderColor: currency === 'USD' ? '#3b82f6' : '#e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currency !== 'USD') {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currency !== 'USD') {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('PEN')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: currency === 'PEN' ? '600' : '500',
                    background: currency === 'PEN' ? '#3b82f6' : 'transparent',
                    color: currency === 'PEN' ? '#fff' : '#64748b',
                    border: '1px solid',
                    borderColor: currency === 'PEN' ? '#3b82f6' : '#e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currency !== 'PEN') {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currency !== 'PEN') {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  PEN
                </button>
              </div>
              )}
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                  marginRight: onPilotClick ? '0.75rem' : '0',
                  height: '36px',
                  lineHeight: '1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Ingresar
              </Link>
              {onPilotClick && (
                <button
                  onClick={onPilotClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    height: '36px',
                    lineHeight: '1'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🚀</span>
                  Participar en el piloto
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-btn">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hamburger-button"
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '8px',
                  backgroundColor: '#FF6600',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {isOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          {isOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: 99998,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                padding: 0,
                margin: 0,
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease'
              }}
              className="mobile-menu-overlay"
              onClick={() => setIsOpen(false)}
            >
              {showCurrencySelector && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrency('USD');
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: currency === 'USD' ? '600' : '500',
                    background: currency === 'USD' ? '#3b82f6' : 'transparent',
                    color: '#fff',
                    border: '1px solid',
                    borderColor: currency === 'USD' ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  USD
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrency('PEN');
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: currency === 'PEN' ? '600' : '500',
                    background: currency === 'PEN' ? '#3b82f6' : 'transparent',
                    color: '#fff',
                    border: '1px solid',
                    borderColor: currency === 'PEN' ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  PEN
                </button>
              </div>
              )}

              <Link href="/login" onClick={() => setIsOpen(false)} style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '600', textDecoration: 'none' }}>Ingresar</Link>

              {navigation.map((item: any) => {
                if (item.type === 'cursos') {
                  return (
                    <div key={item.name} style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === item.name ? null : item.name);
                        }}
                        style={{
                          color: '#fff',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          marginBottom: openDropdown === item.name ? '0.5rem' : 0
                        }}
                      >
                        {item.name} <span style={{ fontSize: '1rem', display: 'inline-block', transition: 'transform 0.3s ease', transform: openDropdown === item.name ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                      </button>
                      {openDropdown === item.name && (
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                          {courses.filter((course: any) => course.publication_status === 'published').map((course: any) => (
                            <Link
                              key={course.slug}
                              href={`/cursos/${course.slug}`}
                              onClick={() => setIsOpen(false)}
                              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', fontWeight: '500', textDecoration: 'none' }}
                            >
                              {course.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else if (item.children) {
                  return (
                    <div key={item.name} style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === item.name ? null : item.name);
                        }}
                        style={{
                          color: '#fff',
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          marginBottom: openDropdown === item.name ? '0.5rem' : 0
                        }}
                      >
                        {item.name} <span style={{ fontSize: '1rem', display: 'inline-block', transition: 'transform 0.3s ease', transform: openDropdown === item.name ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                      </button>
                      {openDropdown === item.name && (
                        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                          {item.children.map((child: any) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', fontWeight: '500', textDecoration: 'none' }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else if (item.external) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '600', textDecoration: 'none' }}
                    >
                      {item.name}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        setIsOpen(false);
                        if (item.href.startsWith('/#')) {
                          e.preventDefault();
                          const id = item.href.substring(2);
                          setTimeout(() => {
                            const element = document.getElementById(id);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }
                      }}
                      style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '600', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  );
                }
              })}
            </div>
          )}
        </nav>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .mobile-menu-overlay {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu-overlay {
            display: flex !important;
          }
        }

        @media (max-width: 768px) {
          header div[style*="flexDirection: 'column'"] > div:last-child {
            font-size: 7px !important;
            letter-spacing: 0.1em !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
