'use client';

import { useState } from 'react';
import CourseEditLayout, { CourseEditTab } from '@/components/unified/CourseEditLayout';
import Image from 'next/image';

export default function TestCourseEditPage() {
  const [activeTab, setActiveTab] = useState<CourseEditTab>('informacion');
  const [formData, setFormData] = useState({
    title: 'Introducción a Python',
    description: 'Aprende desde cero los fundamentos de Python. Ideal para principiantes que desean ingresar al mundo de la programación.',
    language: 'Español',
    difficulty_level: 'Principiante',
    duration: '3h 45m',
    price: 19.90,
    discountPrice: 9.90,
    key_learnings: [
      'Fundamentos de Python',
      'Variables y tipos de datos',
      'Estructuras de control',
      'Funciones',
      'Trabajar con archivos'
    ]
  });

  const [newLearning, setNewLearning] = useState('');

  const mockCourse = {
    id: 1,
    title: 'Introducción a Python',
    slug: 'introduccion-a-python',
    thumbnail: null,
    publication_status: 'published'
  };

  const mockUser = {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'instructor'
  };

  const addLearning = () => {
    if (newLearning.trim()) {
      setFormData(prev => ({
        ...prev,
        key_learnings: [...prev.key_learnings, newLearning.trim()]
      }));
      setNewLearning('');
    }
  };

  const removeLearning = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_learnings: prev.key_learnings.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    alert('Guardando cambios...');
    console.log('Form data:', formData);
  };

  return (
    <CourseEditLayout
      course={mockCourse}
      currentUser={mockUser}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={() => alert('Logout')}
    >
      {activeTab === 'informacion' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
              Información Básica
            </h3>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Imagen del curso
            </label>
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: '#1e293b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                fontSize: '48px',
                opacity: 0.5
              }}>
                🐍
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#7c3aed',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📷 Cambiar imagen
            </button>
            <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
              PNG, JPG o WEBP. Máx. 2MB
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Título del curso *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
              Detalles del Curso
            </h3>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Idioma del curso
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                background: '#fff'
              }}
            >
              <option>Español</option>
              <option>English</option>
              <option>Português</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Nivel de dificultad
            </label>
            <select
              value={formData.difficulty_level}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                background: '#fff'
              }}
            >
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Duración total
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="3h 45m"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Vista previa del curso
            </label>
            <button style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#7c3aed',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              👁️ Vista previa
            </button>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Lo que dominarás (aprendizajes clave)
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.key_learnings.map((learning, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>⋮⋮</span>
                  <span style={{ flex: 1, fontSize: '14px', color: '#374151' }}>{learning}</span>
                  <button
                    onClick={() => removeLearning(index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#ef4444'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLearning()}
                  placeholder="Fundamentos de Python"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={addLearning}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#7c3aed',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Agregar habilidad
                </button>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
              Estado de publicación
            </h3>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <select
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                background: '#fff',
                fontWeight: '500'
              }}
            >
              <option value="unpublished">🔒 Sin publicar - No visible en la web</option>
              <option value="coming_soon">⏳ Próximamente - Visible sin precios</option>
              <option value="published" selected>✅ Publicado - Visible para los estudiantes</option>
            </select>
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '16px' }}>●</span>
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                Publicado - Visible para los estudiantes
              </span>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
              Precio (USD) - opcional
            </h3>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Precio
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Precio con descuento
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.discountPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: parseFloat(e.target.value) || 0 }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            gridColumn: '1 / -1',
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280'
              }}
            >
              👁️ Vista previa
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '0.75rem 2rem',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              💾 Guardar cambios
            </button>
          </div>
        </div>
      )}

      {activeTab !== 'informacion' && (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
          <p>Contenido de la pestaña <strong>{activeTab}</strong></p>
          <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>
            Esta sección se implementará con la funcionalidad existente
          </p>
        </div>
      )}
    </CourseEditLayout>
  );
}
