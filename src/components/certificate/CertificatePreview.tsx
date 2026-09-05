'use client';

import React from 'react';
import { CertificateTemplate } from '@/lib/certificate-template';

interface CertificatePreviewProps {
  template: CertificateTemplate;
  studentName?: string;
  courseTitle?: string;
}

export default function CertificatePreview({
  template,
  studentName = 'Juan Pérez',
  courseTitle = 'Nombre del Curso',
}: CertificatePreviewProps) {
  const hasBackground = !!template.backgroundImageUrl;

  if (hasBackground) {
    // El fondo es un "diseño completo" (logo, título y firma ya incluidos).
    // Solo superponemos los datos variables, en las mismas posiciones
    // relativas que usa el generador de PDF real (base 1536x1024px).
    const introLabel = template.introText.replace(/:\s*$/, '').toUpperCase();
    const statValues = ['40 horas', 'Grabado', '8 módulos', new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })];
    // Mismo x que el borde izquierdo de cada etiqueta del fondo (DURACIÓN TOTAL, MODALIDAD, MÓDULOS, FECHA DE EMISIÓN)
    const statLeftPct = [18.88, 39.39, 57.62, 74.87];
    const ocre = '#b6710c';

    const centered = (topPct: number, leftPct: number, widthPct: number, fontCqw: number, weight: number, color: string): React.CSSProperties => ({
      position: 'absolute',
      top: `${topPct}%`,
      left: `${leftPct}%`,
      width: `${widthPct}%`,
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      fontSize: `${fontCqw}cqw`,
      fontWeight: weight,
      color,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });

    const leftAligned = (topPct: number, leftPct: number, widthPct: number, fontCqw: number, weight: number, color: string): React.CSSProperties => ({
      position: 'absolute',
      top: `${topPct}%`,
      left: `${leftPct}%`,
      width: `${widthPct}%`,
      transform: 'translate(0, -50%)',
      textAlign: 'left',
      fontSize: `${fontCqw}cqw`,
      fontWeight: weight,
      color,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1536 / 1024',
          borderRadius: '8px',
          overflow: 'hidden',
          background: `url(${template.backgroundImageUrl}) center / cover no-repeat`,
          containerType: 'inline-size',
        }}
      >
        <div style={centered(39.55, 50, 90, 1.5, 700, '#b6710c')}>{introLabel}</div>
        <div style={centered(45.12, 50, 90, 3.1, 700, '#021248')}>{studentName}</div>
        <div style={centered(50.0, 50, 90, 1.35, 400, '#6b7280')}>{template.completionText}</div>
        <div style={centered(54.2, 50, 70, 2.0, 700, '#021248')}>{courseTitle}</div>
        {statValues.map((val, i) => (
          <div key={i} style={leftAligned(66.60, statLeftPct[i], 18, 1.35, 700, ocre)}>
            {val}
          </div>
        ))}
        <div style={centered(84.77, 47.36, 24, 1.9, 700, '#021248')}>XXXX-XXXX-XXXX</div>
        {template.footnoteText && (
          <div style={{ ...centered(93.0, 50, 85, 1.3, 400, '#374151'), fontStyle: 'italic', whiteSpace: 'normal' }}>
            {template.footnoteText}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        border: `3px solid ${template.primaryColor}`,
        borderRadius: '8px',
        padding: '24px 20px',
        textAlign: 'center',
        background: '#ffffff',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', inset: '8px', border: '1px solid #d1d5db', borderRadius: '4px', pointerEvents: 'none' }} />

      {template.logoUrl && (
        <img src={template.logoUrl} alt="Logo" style={{ height: '36px', marginBottom: '12px' }} />
      )}

      <div style={{ fontSize: '28px', fontWeight: 700, color: template.primaryColor, letterSpacing: '1px' }}>
        {template.titleText}
      </div>
      <div style={{ fontSize: '12px', color: template.accentColor, marginTop: '4px', marginBottom: '16px' }}>
        {template.subtitleText}
      </div>

      <div style={{ fontSize: '10px', color: template.accentColor, marginBottom: '6px' }}>
        {template.introText}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#000', marginBottom: '12px' }}>
        {studentName}
      </div>

      <div style={{ fontSize: '10px', color: template.accentColor, marginBottom: '4px' }}>
        {template.completionText}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: template.primaryColor, marginBottom: '12px' }}>
        {courseTitle}
      </div>

      {template.showScore && (
        <div style={{ fontSize: '11px', color: '#000', marginBottom: '4px' }}>
          Calificación final: 18/20
        </div>
      )}

      <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '16px' }}>
        {template.footerText} smartchatix.com/verificar/XXXX-XXXX-XXXX
      </div>
    </div>
  );
}
