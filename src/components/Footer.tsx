'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer style={{
        background: 'linear-gradient(180deg, #000000 0%, #001a33 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle glow effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '5rem 3rem 3rem',
          position: 'relative'
        }}>
          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            {/* Brand Column */}
            <div style={{
              maxWidth: '380px'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Image
                  src="/images/smartchatix_logov3.png"
                  alt="SmartChatix"
                  width={528}
                  height={120}
                  quality={100}
                  style={{ height: 'auto', width: '264px' }}
                />
              </div>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                fontWeight: '400'
              }}>
                Una plataforma flexible para crear, gestionar y certificar experiencias de aprendizaje inteligentes.
              </p>

              {/* Social Icons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {[
                  { icon: Linkedin, href: 'https://www.linkedin.com/company/107201411/', label: 'LinkedIn' },
                  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61558066553571', label: 'Facebook' }
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Recursos Column */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                Recursos
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem'
              }}>
                {[
                  { label: 'Blog', href: '#' },
                  { label: 'Documentación', href: '#' },
                  { label: 'Centro de ayuda', href: '#' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      style={{
                        fontSize: '15px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontWeight: '400'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#8b5cf6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa Column */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                Empresa
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem'
              }}>
                {[
                  { label: 'Nosotros', href: '/nosotros' },
                  { label: 'Contacto', href: 'https://wa.me/51968374191?text=Hola,%20me%20gustaría%20conocer%20cómo%20SmartChatix%20puede%20ayudar%20a%20mi%20empresa.%20¿Podrían%20brindarme%20más%20información?', external: true },
                  { label: 'Privacidad', href: '/politica-privacidad' }
                ].map((item, idx) => (
                  <li key={idx}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '15px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                          fontWeight: '400'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#8b5cf6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        style={{
                          fontSize: '15px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                          fontWeight: '400'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#8b5cf6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                Contacto
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <a
                  href="mailto:admin@smartchatix.com"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s ease',
                    fontWeight: '400'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <Mail size={16} strokeWidth={2} />
                  admin@smartchatix.com
                </a>

                <a
                  href="https://wa.me/51967717179"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s ease',
                    fontWeight: '400'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 0C7.164 0 0 7.164 0 16c0 2.832.748 5.484 2.052 7.78L.7 30.136l6.548-1.708A15.876 15.876 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm9.304 22.948c-.388 1.096-1.932 2.004-3.156 2.268-.844.18-1.944.324-5.648-1.212-4.744-1.968-7.8-6.752-8.036-7.064-.232-.312-1.892-2.516-1.892-4.8s1.2-3.408 1.624-3.876c.424-.468.928-.588 1.24-.588.312 0 .624.004.896.016.288.012.672-.108 1.052.8.388.932 1.32 3.22 1.436 3.456.116.236.192.512.04.824-.152.312-.228.508-.456.784-.228.276-.48.616-.684.828-.228.236-.464.492-.2.964.264.468 1.176 1.94 2.524 3.144 1.736 1.548 3.2 2.032 3.656 2.256.456.228.72.192.984-.116.264-.308 1.132-1.32 1.432-1.772.3-.452.604-.376 1.016-.228.412.148 2.62 1.236 3.072 1.464.452.228.756.344.864.532.108.188.108 1.088-.28 2.184z" />
                  </svg>
                  +51 967 717 179
                </a>

                <div style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontWeight: '400'
                }}>
                  <MapPin size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                  Lima, Perú
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
            marginBottom: '2rem'
          }}></div>

          {/* Bottom Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            {/* Copyright */}
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '400'
            }}>
              © 2026 SmartChatix. Todos los derechos reservados.
            </div>

            {/* Legal Links */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'Términos', href: '/terminos-condiciones' },
                { label: 'Privacidad', href: '/politica-privacidad' },
                { label: 'Libro de reclamaciones', href: '/libro-de-reclamaciones' }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    fontWeight: '400'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Styles */}
        <style jsx>{`
          @media (max-width: 1024px) {
            footer > div > div:first-child {
              grid-template-columns: 1fr 1fr !important;
              gap: 3rem 2rem !important;
            }
            footer > div > div:first-child > div:first-child {
              grid-column: 1 / -1 !important;
              max-width: 100% !important;
            }
          }

          @media (max-width: 768px) {
            footer > div {
              padding: 4rem 2rem 2rem !important;
            }
            footer > div > div:first-child {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
            }
            footer > div > div:first-child > div:first-child {
              text-align: center !important;
              max-width: 100% !important;
            }
            footer > div > div:first-child > div:first-child > div:first-child {
              display: flex !important;
              justify-content: center !important;
            }
            footer > div > div:first-child > div:first-child > div:nth-child(2) {
              justify-content: center !important;
            }
            footer > div > div:first-child > div:not(:first-child) {
              text-align: center !important;
            }
            footer > div > div:first-child > div:not(:first-child) ul {
              align-items: center !important;
            }
            footer > div > div:first-child > div:last-child > div {
              align-items: center !important;
            }
            footer > div > div:nth-child(3) {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
            }
            footer > div > div:nth-child(3) > div:last-child {
              flex-direction: column !important;
              gap: 1rem !important;
              align-items: center !important;
            }
          }
        `}</style>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/51967717179"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="white"
          style={{ width: '32px', height: '32px' }}
        >
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.832.748 5.484 2.052 7.78L.7 30.136l6.548-1.708A15.876 15.876 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm9.304 22.948c-.388 1.096-1.932 2.004-3.156 2.268-.844.18-1.944.324-5.648-1.212-4.744-1.968-7.8-6.752-8.036-7.064-.232-.312-1.892-2.516-1.892-4.8s1.2-3.408 1.624-3.876c.424-.468.928-.588 1.24-.588.312 0 .624.004.896.016.288.012.672-.108 1.052.8.388.932 1.32 3.22 1.436 3.456.116.236.192.512.04.824-.152.312-.228.508-.456.784-.228.276-.48.616-.684.828-.228.236-.464.492-.2.964.264.468 1.176 1.94 2.524 3.144 1.736 1.548 3.2 2.032 3.656 2.256.456.228.72.192.984-.116.264-.308 1.132-1.32 1.432-1.772.3-.452.604-.376 1.016-.228.412.148 2.62 1.236 3.072 1.464.452.228.756.344.864.532.108.188.108 1.088-.28 2.184z" />
        </svg>
      </a>
    </>
  );
}
