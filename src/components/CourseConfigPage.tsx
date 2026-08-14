'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  language?: string;
  difficulty_level?: string;
  duration?: string;
  key_learnings?: string[];
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
  const [activeTab, setActiveTab] = useState<'informacion' | 'modulos' | 'calificaciones' | 'configuracion'>('informacion');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'Español',
    difficulty_level: 'Principiante',
    duration: '',
    price: 0,
    discountPrice: 0,
    key_learnings: [] as string[],
  });

  const [newLearning, setNewLearning] = useState('');

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
        language: data.course.language || 'Español',
        difficulty_level: data.course.difficulty_level || 'Principiante',
        duration: data.course.duration || '',
        price: data.course.price_vivo || 0,
        discountPrice: data.course.price_grabado || 0,
        key_learnings: data.course.key_learnings || [],
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
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          language: formData.language,
          difficulty_level: formData.difficulty_level,
          duration: formData.duration,
          price_vivo: formData.price,
          price_grabado: formData.discountPrice,
          key_learnings: formData.key_learnings,
        })
      });
      if (response.ok) {
        alert('✅ Cambios guardados correctamente');
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠' },
    { id: 'contenido', label: 'Contenido', icon: '📚' },
    { id: 'lecciones', label: 'Lecciones', icon: '📝' },
    { id: 'quizzes', label: 'Quizzes', icon: '❓' },
    { id: 'tareas', label: 'Tareas', icon: '📋' },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥' },
    { id: 'calificaciones', label: 'Calificaciones', icon: '📊' },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️' },
  ];

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
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando...</p>
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

        @media (max-width: 1024px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding-top: 80px !important;
          }
          .bottom-nav {
            display: flex !important;
          }
        }

        @media (min-width: 1025px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: none !important;
          }
          .main-content {
            margin-left: 280px !important;
          }
          .bottom-nav {
            display: none !important;
          }
        }

        .tab-button {
          position: relative;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #7c3aed;
        }
      `}</style>

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
        />
      )}

      <aside
        className="desktop-sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          flexDirection: 'column',
          zIndex: 999,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <Image
            src="/images/logo_smartchatix_horiz.png"
            alt="SmartChatix"
            width={140}
            height={40}
            style={{ objectFit: 'contain' }}
          />

          <div style={{
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {course?.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={40}
                height={40}
                style={{ borderRadius: '6px', objectFit: 'cover' }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {course?.title}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                background: '#d1fae5',
                color: '#065f46',
                marginTop: '4px'
              }}>
                Publicado
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1rem 0' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '400',
                color: '#6b7280',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{
          marginTop: 'auto',
          borderTop: '1px solid #e5e7eb',
          padding: '1rem'
        }}>
          <button
            onClick={() => router.push(backUrl)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}
          >
            ← {backLabel}
          </button>
        </div>
      </aside>

      <header
        className="mobile-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          zIndex: 997,
          display: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px'
            }}
          >
            ☰
          </button>

          <Image
            src="/images/logo_smartchatix_horiz.png"
            alt="SmartChatix"
            width={100}
            height={30}
            style={{ objectFit: 'contain' }}
          />

          <button
            style={{
              marginLeft: 'auto',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ⋮
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {course?.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={32}
                height={32}
                style={{ borderRadius: '6px', objectFit: 'cover' }}
              />
            )}
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {course?.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                Publicado
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>▼</span>
          </button>
        </div>
      </header>

      <main className="main-content" style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>
                Editar Curso
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Actualiza la información y configura tu curso
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '2rem',
              padding: '0 1.5rem',
              marginTop: '1.5rem',
              borderBottom: '2px solid #f3f4f6',
              overflowX: 'auto'
            }}>
              {[
                { id: 'informacion', label: 'Información', icon: '📝' },
                { id: 'modulos', label: 'Módulos', icon: '📚' },
                { id: 'calificaciones', label: 'Calificaciones', icon: '📊' },
                { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    padding: '1rem 0.5rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'informacion' && (
              <div style={{ padding: '2rem 1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      {course?.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={400}
                          height={225}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <div style={{
                          fontSize: '48px',
                          opacity: 0.5
                        }}>
                          🐍
                        </div>
                      )}
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
                      <option value="published">✅ Publicado - Visible para los estudiantes</option>
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
                </div>

                <div style={{
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
                    onClick={handleSaveBasicInfo}
                    disabled={saving}
                    style={{
                      padding: '0.75rem 2rem',
                      background: saving ? '#9ca3af' : '#7c3aed',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {saving ? 'Guardando...' : '💾 Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'informacion' && (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
                Esta sección está en desarrollo
              </div>
            )}
          </div>
        </div>
      </main>

      <nav
        className="bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
          padding: '0.75rem',
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 996
        }}
      >
        {[
          { icon: '🏠', label: 'Dashboard' },
          { icon: '📚', label: 'Contenido' },
          { icon: '👥', label: 'Estudiantes' },
          { icon: '📊', label: 'Calificaciones' },
          { icon: '⋯', label: 'Más' }
        ].map((item, index) => (
          <button
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#6b7280',
              fontSize: '11px'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
