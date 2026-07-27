'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Diseña tu curso',
    description: 'Planifica el contenido con el apoyo de la IA.',
    icon: '/icons/step-chat.svg',
  },
  {
    number: '02',
    title: 'Agrega contenido',
    description: 'Sube recursos, crea lecciones y actividades interactivas.',
    icon: '/icons/step-content.svg',
  },
  {
    number: '03',
    title: 'Capacita y evalúa',
    description: 'Publica tu curso y evalúa el aprendizaje fácilmente.',
    icon: '/icons/step-users.svg',
  },
  {
    number: '04',
    title: 'Certifica y mide',
    description: 'Emite certificados y obtén reportes para tomar mejores decisiones.',
    icon: '/icons/step-certificate.svg',
  },
];

export default function StepsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '6rem 3rem 6rem',
        background: '#fafafa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '6rem',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: '#8b5cf6',
              marginBottom: '1.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease-out',
            }}
          >
            ASÍ DE SIMPLE
          </div>
          <h2
            style={{
              fontSize: '64px',
              fontWeight: '300',
              lineHeight: '1.2',
              color: '#0a0e27',
              marginBottom: '1.5rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease-out 0.1s',
            }}
          >
            Así de simple es enseñar con{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '600',
              }}
            >
              SmartChatix
            </span>
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease-out 0.2s',
            }}
          >
            En 4 pasos, tu experiencia de aprendizaje está lista para transformar.
          </p>
        </div>

        {/* Desktop Flow */}
        <div
          className="desktop-flow"
          style={{
            display: 'none',
            position: 'relative',
            marginBottom: '8rem',
          }}
        >
          {/* SVG Line */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '200px',
              zIndex: 0,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.8s ease-out 0.3s',
            }}
          >
            <svg
              width="100%"
              height="200"
              viewBox="0 0 1200 200"
              fill="none"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '200px' }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.6 }} />
                  <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: '#d946ef', stopOpacity: 0.4 }} />
                </linearGradient>
              </defs>
              <path
                ref={svgRef}
                d="M 50 100 Q 200 60, 350 100 Q 500 140, 650 100 Q 800 60, 950 100 Q 1050 120, 1150 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: isVisible ? 'none' : '2000',
                  strokeDashoffset: isVisible ? 0 : 2000,
                  transition: 'stroke-dashoffset 1.5s ease-out 0.5s',
                }}
              />
            </svg>
          </div>

          {/* Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '3rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.5s ease-out ${0.7 + index * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    marginBottom: '2rem',
                    filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.15))',
                  }}
                >
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={80}
                    height={80}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Number */}
                <div
                  style={{
                    fontSize: '60px',
                    fontWeight: '200',
                    background: `linear-gradient(135deg, ${
                      index === 0
                        ? '#6366f1, #8b5cf6'
                        : index === 1
                        ? '#d946ef, #f97316'
                        : index === 2
                        ? '#3b82f6, #8b5cf6'
                        : '#8b5cf6, #d946ef'
                    })`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1rem',
                    lineHeight: '1',
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '30px',
                    fontWeight: '600',
                    color: '#0a0e27',
                    marginBottom: '0.75rem',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '18px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    maxWidth: '280px',
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Flow */}
        <div
          className="mobile-flow"
          style={{
            display: 'none',
            position: 'relative',
          }}
        >
          {/* Vertical Line */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              top: '80px',
              width: '2px',
              height: 'calc(100% - 160px)',
              background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
              opacity: 0.4,
              zIndex: 0,
            }}
          ></div>

          {/* Steps */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {steps.map((step, index) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: index < steps.length - 1 ? '4rem' : 0,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.5s ease-out ${0.7 + index * 0.15}s`,
                }}
              >
                {/* Icon */}
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.15))',
                    }}
                  >
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={80}
                      height={80}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: '200',
                      background: `linear-gradient(135deg, ${
                        index === 0
                          ? '#6366f1, #8b5cf6'
                          : index === 1
                          ? '#d946ef, #f97316'
                          : index === 2
                          ? '#3b82f6, #8b5cf6'
                          : '#8b5cf6, #d946ef'
                      })`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5rem',
                      lineHeight: '1',
                    }}
                  >
                    {step.number}
                  </div>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#0a0e27',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#64748b',
                      lineHeight: '1.6',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-flow {
            display: block !important;
          }
          .mobile-flow {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .desktop-flow {
            display: none !important;
          }
          .mobile-flow {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
