'use client';

import React, { useState } from 'react';
import { CertificateTemplate, CERTIFICATE_TYPE_PRESETS } from '@/lib/certificate-template';

interface CertificateTemplateFormProps {
  value: CertificateTemplate;
  onChange: (value: CertificateTemplate) => void;
  disabled?: boolean;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const fieldWrapStyle: React.CSSProperties = { marginBottom: '16px' };

export default function CertificateTemplateForm({ value, onChange, disabled }: CertificateTemplateFormProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [selectedCertType, setSelectedCertType] = useState('');

  const set = <K extends keyof CertificateTemplate>(key: K, val: CertificateTemplate[K]) => {
    onChange({ ...value, [key]: val });
  };

  const uploadImage = async (
    file: File,
    field: 'logoUrl' | 'backgroundImageUrl',
    setUploading: (v: boolean) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (PNG o JPG)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Error al subir la imagen');
      const data = await response.json();
      set(field, data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div style={{ ...fieldWrapStyle, padding: '12px', background: '#f5f3ff', border: '2px solid #c4b5fd', borderRadius: '8px' }}>
        <label style={labelStyle}>Tipo de certificado</label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Elige un tipo para autocompletar el título y el texto según sea un curso o un webinar. Puedes seguir editando el texto libremente después.
        </p>
        <select
          value={selectedCertType}
          onChange={(e) => {
            const key = e.target.value;
            setSelectedCertType(key);
            const preset = CERTIFICATE_TYPE_PRESETS[key];
            if (preset) onChange({ ...value, ...preset.values });
          }}
          style={inputStyle}
        >
          <option value="" disabled>Aplicar plantilla de texto...</option>
          {Object.entries(CERTIFICATE_TYPE_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>{preset.label}</option>
          ))}
        </select>
      </div>

      <div style={{ ...fieldWrapStyle, padding: '12px', background: '#fff', border: '2px dashed #c4b5fd', borderRadius: '8px' }}>
        <label style={labelStyle}>Imagen de fondo del certificado (opcional)</label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Sube un diseño completo (con logo, título y firma ya incluidos) para usar como fondo del PDF. Horizontal, proporción 3:2 (por ejemplo 1536×1024), PNG o JPG.
        </p>
        {value.backgroundImageUrl && (
          <div style={{ marginBottom: '8px' }}>
            <img src={value.backgroundImageUrl} alt="Fondo" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
            <div>
              <button
                type="button"
                onClick={() => set('backgroundImageUrl', null)}
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                Quitar imagen de fondo
              </button>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, 'backgroundImageUrl', setUploadingBackground);
            e.target.value = '';
          }}
          disabled={uploadingBackground}
        />
        {uploadingBackground && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Subiendo...</p>}
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Logo del certificado (opcional, se ignora si ya subiste una imagen de fondo)</label>
        {value.logoUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src={value.logoUrl} alt="Logo" style={{ height: '40px', borderRadius: '4px' }} />
            <button
              type="button"
              onClick={() => set('logoUrl', null)}
              style={{
                fontSize: '12px',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              Quitar logo
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, 'logoUrl', setUploadingLogo);
            e.target.value = '';
          }}
          disabled={uploadingLogo}
        />
        {uploadingLogo && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Subiendo...</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Color principal</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="color"
              value={value.primaryColor}
              onChange={(e) => set('primaryColor', e.target.value)}
              style={{ width: '44px', height: '38px', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '2px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={value.primaryColor}
              onChange={(e) => set('primaryColor', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Color secundario</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="color"
              value={value.accentColor}
              onChange={(e) => set('accentColor', e.target.value)}
              style={{ width: '44px', height: '38px', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '2px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={value.accentColor}
              onChange={(e) => set('accentColor', e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Título principal</label>
        <input type="text" value={value.titleText} onChange={(e) => set('titleText', e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Subtítulo</label>
        <input type="text" value={value.subtitleText} onChange={(e) => set('subtitleText', e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Texto de introducción</label>
        <input type="text" value={value.introText} onChange={(e) => set('introText', e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Texto de finalización</label>
        <input type="text" value={value.completionText} onChange={(e) => set('completionText', e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Texto de pie de página</label>
        <input type="text" value={value.footerText} onChange={(e) => set('footerText', e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldWrapStyle}>
        <label style={labelStyle}>Nota al pie (cursiva, opcional)</label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          Aparece en letra cursiva, centrada, en la parte inferior del certificado. Útil para una aclaración legal o una frase corta.
        </p>
        <input
          type="text"
          value={value.footnoteText}
          onChange={(e) => set('footnoteText', e.target.value)}
          style={{ ...inputStyle, fontStyle: 'italic' }}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={value.showScore}
          onChange={(e) => set('showScore', e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        Mostrar la calificación final en el certificado
      </label>
    </div>
  );
}
