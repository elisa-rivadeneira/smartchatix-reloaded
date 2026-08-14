'use client';

import { useState, useEffect } from 'react';

interface Settings {
  show_courses_carousel: boolean;
  show_currency_selector: boolean;
  exchange_rate: string;
}

export default function AdminSettingsSection() {
  const [settings, setSettings] = useState<Settings>({
    show_courses_carousel: true,
    show_currency_selector: true,
    exchange_rate: '3.80'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: 'show_courses_carousel' | 'show_currency_selector') => {
    setSaving(true);
    const newValue = !settings[key];

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: key, setting_value: newValue })
      });

      if (response.ok) {
        setSettings({ ...settings, [key]: newValue });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExchangeRate = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: 'exchange_rate', setting_value: settings.exchange_rate })
      });

      if (response.ok) {
        alert('✅ Tipo de cambio actualizado');
      }
    } catch (error) {
      console.error('Error updating exchange rate:', error);
      alert('❌ Error al actualizar tipo de cambio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#7c3aed',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          ⚙️ Configuración
        </h2>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
          ⚙️ Configuración del Sitio
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Carrusel de cursos */}
          <div style={{
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  Mostrar carrusel de cursos
                </h4>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  Muestra el carrusel "Explora más cursos" en la página principal
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={settings.show_courses_carousel}
                  onChange={() => handleToggle('show_courses_carousel')}
                  disabled={saving}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: settings.show_courses_carousel ? '#8b5cf6' : '#d1d5db',
                  transition: '0.3s',
                  borderRadius: '28px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '20px',
                    width: '20px',
                    left: settings.show_courses_carousel ? '28px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* Selector de moneda */}
          <div style={{
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  Selector de moneda (USD/PEN)
                </h4>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  Muestra botones en el header para cambiar entre dólares y soles manualmente
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={settings.show_currency_selector}
                  onChange={() => handleToggle('show_currency_selector')}
                  disabled={saving}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: settings.show_currency_selector ? '#8b5cf6' : '#d1d5db',
                  transition: '0.3s',
                  borderRadius: '28px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '20px',
                    width: '20px',
                    left: settings.show_currency_selector ? '28px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* Tipo de cambio */}
          <div style={{
            padding: '1.5rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Tipo de cambio USD → PEN
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="number"
                step="0.01"
                value={settings.exchange_rate}
                onChange={(e) => setSettings({ ...settings, exchange_rate: e.target.value })}
                disabled={saving}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  width: '120px'
                }}
              />
              <button
                onClick={handleSaveExchangeRate}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.5rem' }}>
              1 USD = {settings.exchange_rate} PEN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
