'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroNew() {
  return (
    <>
      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fefefe 0%, #f8f9fb 100%);
          padding: 4rem 2rem;
          overflow: hidden;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero-logo-container {
          margin-bottom: 1rem;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #1a1a2e;
          margin: 0;
        }

        .hero-gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #ec4899 50%, #f97316 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          line-height: 1.6;
          color: #64748b;
          font-weight: 400;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(37, 99, 235, 0.35);
        }

        .btn-secondary {
          background: white;
          color: #1a1a2e;
          border: 2px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .btn-secondary:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-visual {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .hero-card {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 20px 60px rgba(0, 0, 0, 0.08),
            0 40px 80px rgba(0, 0, 0, 0.06);
          position: relative;
          z-index: 2;
        }

        .hero-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 1.5rem;
        }

        .hero-pillars {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .hero-pillar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hero-pillar-icon {
          font-size: 2rem;
        }

        .hero-pillar-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .hero-pillar-desc {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.5;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          z-index: 1;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #2563eb, #ec4899);
          top: -100px;
          right: -100px;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #ec4899, #f97316);
          bottom: -50px;
          left: -50px;
        }

        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-left {
            align-items: center;
          }

          .hero-title {
            font-size: 3rem;
          }

          .hero-subtitle {
            max-width: 100%;
          }

          .hero-cta-group {
            justify-content: center;
          }

          .hero-right {
            order: -1;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .hero-card {
            padding: 2rem;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-logo-container">
              <Image
                src="/images/logo_samartchatix.png"
                alt="SmartChatix"
                width={300}
                height={120}
                priority
              />
            </div>

            <h1 className="hero-title">
              Trabaja mejor con{' '}
              <span className="hero-gradient-text">inteligencia</span>
            </h1>

            <p className="hero-subtitle">
              Aprende a usar la IA para recuperar horas de tu día, tomar mejores decisiones y evolucionar profesionalmente.
            </p>

            <div className="hero-cta-group">
              <a href="#cursos" className="btn btn-primary">
                Descubre tu ruta de aprendizaje →
              </a>
              <a href="#quien-eres" className="btn btn-secondary">
                ¿Quién eres?
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual">
              <div className="hero-card">
                <h3 className="hero-card-title">Tu transformación profesional</h3>

                <div className="hero-pillars">
                  <div className="hero-pillar">
                    <div className="hero-pillar-icon">💬</div>
                    <div className="hero-pillar-title">Aprende</div>
                    <div className="hero-pillar-desc">Habilidades prácticas que aplicas hoy</div>
                  </div>

                  <div className="hero-pillar">
                    <div className="hero-pillar-icon">❤️</div>
                    <div className="hero-pillar-title">Conecta</div>
                    <div className="hero-pillar-desc">Con una comunidad que evoluciona</div>
                  </div>

                  <div className="hero-pillar">
                    <div className="hero-pillar-icon">✨</div>
                    <div className="hero-pillar-title">Transforma</div>
                    <div className="hero-pillar-desc">Tu forma de trabajar cada día</div>
                  </div>

                  <div className="hero-pillar">
                    <div className="hero-pillar-icon">∞</div>
                    <div className="hero-pillar-title">Evoluciona</div>
                    <div className="hero-pillar-desc">Continuamente con cada curso</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
