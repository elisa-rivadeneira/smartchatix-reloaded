'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  price_vivo: number;
  price_grabado: number;
  is_certification_enabled?: boolean;
  passing_score?: number;
  publication_status?: 'published' | 'coming_soon' | 'unpublished';
}

interface CourseConfigPageProps {
  slug: string;
  backUrl: string;
  backLabel: string;
}

export default function CourseConfigPage({ slug, backUrl, backLabel }: CourseConfigPageProps) {
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_vivo: 0,
    price_grabado: 0,
  });

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/instructor/course/${slug}`);
      if (!response.ok) {
        router.push(backUrl);
        return;
      }
      const data = await response.json();
      setCourse(data.course);
      setFormData({
        title: data.course.title || '',
        description: data.course.description || '',
        price_vivo: data.course.price_vivo || 0,
        price_grabado: data.course.price_grabado || 0,
      });
    } catch (error) {
      console.error('Error loading course:', error);
      router.push(backUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/instructor/course/${slug}/config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('✅ Información actualizada correctamente');
        loadCourse();
      } else {
        alert('❌ Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Link href={backUrl} style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ← {backLabel}
            </Link>
            <span style={{ color: '#d1d5db' }}>|</span>
            <Link href={`/instructor/curso/${slug}`} style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Ver Contenido del Curso
            </Link>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>
            ⚙️ Configuración del Curso
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            {course?.title}
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Información General
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Título del curso
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
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Precio modalidad vivo (S/)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_vivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_vivo: parseFloat(e.target.value) || 0 }))}
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
                  Precio modalidad grabado (S/)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_grabado}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_grabado: parseFloat(e.target.value) || 0 }))}
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
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎓 Sistema de Certificación
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={course?.is_certification_enabled || false}
                onChange={async (e) => {
                  const enabled = e.target.checked;
                  setSaving(true);
                  try {
                    const response = await fetch(`/api/instructor/course/${slug}/config`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ is_certification_enabled: enabled })
                    });
                    if (response.ok) {
                      setCourse(prev => prev ? { ...prev, is_certification_enabled: enabled } : null);
                    }
                  } catch (error) {
                    console.error('Error:', error);
                  } finally {
                    setSaving(false);
                  }
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span>Habilitar emisión de certificados para este curso</span>
            </label>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '0.5rem',
              marginLeft: '1.75rem'
            }}>
              Los estudiantes recibirán un certificado automáticamente al completar todas las lecciones con quizzes y alcanzar el porcentaje mínimo.
            </p>
          </div>

          {course?.is_certification_enabled && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #e5e7eb' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Porcentaje mínimo para aprobar (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={course?.passing_score || 75}
                onChange={async (e) => {
                  const score = parseInt(e.target.value) || 75;
                  setSaving(true);
                  try {
                    const response = await fetch(`/api/instructor/course/${slug}/config`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ passing_score: score })
                    });
                    if (response.ok) {
                      setCourse(prev => prev ? { ...prev, passing_score: score } : null);
                    }
                  } catch (error) {
                    console.error('Error:', error);
                  } finally {
                    setSaving(false);
                  }
                }}
                style={{
                  width: '120px',
                  padding: '0.5rem 0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '0.5rem'
              }}>
                Los estudiantes deben obtener al menos este porcentaje en el promedio general de todos los quizzes para recibir el certificado.
              </p>
            </div>
          )}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🌐 Estado de Publicación
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Estado del curso en la web
            </label>
            <select
              value={course?.publication_status || 'unpublished'}
              onChange={async (e) => {
                const status = e.target.value as 'published' | 'coming_soon' | 'unpublished';
                setSaving(true);
                try {
                  const response = await fetch(`/api/instructor/course/${slug}/config`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publication_status: status })
                  });
                  if (response.ok) {
                    setCourse(prev => prev ? { ...prev, publication_status: status } : null);
                  }
                } catch (error) {
                  console.error('Error:', error);
                } finally {
                  setSaving(false);
                }
              }}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="unpublished">🔒 Sin publicar - No visible en la web</option>
              <option value="coming_soon">⏳ Próximamente - Visible sin precios ni inscripción</option>
              <option value="published">✅ Publicado - Completamente visible con precios</option>
            </select>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              {course?.publication_status === 'published' && '✅ El curso está completamente visible con precios y enlaces de inscripción.'}
              {course?.publication_status === 'coming_soon' && '⏳ El curso es visible pero sin precios ni enlaces de inscripción.'}
              {(course?.publication_status === 'unpublished' || !course?.publication_status) && '🔒 El curso no es visible en la web pública. Solo admins e instructores pueden verlo.'}
            </p>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleSaveBasicInfo}
            disabled={saving}
            style={{
              padding: '0.75rem 2rem',
              background: saving ? '#9ca3af' : 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {saving ? 'Guardando...' : '💾 Guardar Todos los Cambios'}
          </button>
        </div>
      </main>
    </div>
  );
}
