'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  showCursos?: boolean;
  showServicios?: boolean;
  courses?: any[];
}

const Header: React.FC<HeaderProps> = ({
  showCursos = false,
  showServicios = true,
  courses = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
      href: '#',
      show: showCursos,
      type: 'cursos'
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
      {/* Top Bar */}
      <div style={{
        background: '#003366',
        padding: '0.5rem 0',
        fontSize: '13px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="mailto:admin@smartchatix.com" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fff',
                textDecoration: 'none'
              }}>
                <span>✉️</span>
                <span>admin@smartchatix.com</span>
              </a>
              <a href="tel:+51967717179" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fff',
                textDecoration: 'none'
              }}>
                <span>📞</span>
                <span>+51 967 717 179</span>
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>🌐 ES</span>
              <span>|</span>
              <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </div>

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

            {/* CTA Button */}
            <div style={{ display: 'none' }} className="desktop-nav">
              <a
                href="https://wa.me/51968374191?text=Hola,%20me%20gustaría%20conocer%20cómo%20SmartChatix%20puede%20ayudar%20a%20mi%20empresa.%20¿Podrían%20brindarme%20más%20información?"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button
                  style={{
                    background: '#FF6600',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF7722';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FF6600';
                  }}
                >
                  Conversemos
                </button>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="mobile-menu-btn">
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  color: '#374151',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '24px' }}>{isOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="mobile-nav" style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navigation.map((item: any) => (
                  <div key={item.name}>
                    {item.type === 'cursos' ? (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: '12px' }}>{openDropdown === item.name ? '▲' : '▼'}</span>
                        </button>
                        {openDropdown === item.name && (
                          <div style={{ paddingLeft: '1rem' }}>
                            {courses.filter((course: any) => course.publication_status === 'published').map((course: any) => (
                              <Link
                                key={course.slug}
                                href={`/cursos/${course.slug}`}
                                style={{
                                  display: 'block',
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  textDecoration: 'none'
                                }}
                                onClick={() => setIsOpen(false)}
                              >
                                {course.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : item.children ? (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#374151',
                            background: 'transparent',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{item.name}</span>
                          <span style={{ fontSize: '12px' }}>{openDropdown === item.name ? '▲' : '▼'}</span>
                        </button>
                        {openDropdown === item.name && (
                          <div style={{ paddingLeft: '1rem' }}>
                            {item.children.map((child: any) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                style={{
                                  display: 'block',
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  textDecoration: 'none'
                                }}
                                onClick={() => setIsOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.75rem',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#374151',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.75rem',
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#374151',
                          textDecoration: 'none'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile CTA */}
                <div style={{ paddingTop: '1rem' }}>
                  <Link href="/register" style={{ display: 'block' }}>
                    <button
                      style={{
                        background: '#FF6600',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      Solicitar demostración
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      <style jsx>{`
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
