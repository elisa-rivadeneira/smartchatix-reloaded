'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content_type: 'video' | 'document' | 'quiz' | 'assignment';
  video_url: string | null;
  document_url: string | null;
  duration: string;
  order_index: number;
  is_free: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  duration: string;
  modality: string;
  enrolled_at: string;
}

interface CourseData {
  course: Course;
  modules: Module[];
}

export default function CertificacionIA10XPage() {
  const router = useRouter();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({});

  const colors = {
    primary: '#003366',
    accent: '#FF6600',
    white: '#FFFFFF',
    gray: {
      100: '#F1F3F4',
      200: '#E8EAED',
      500: '#5F6368',
      600: '#4a5568',
      700: '#202124'
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const response = await fetch('/api/courses/certificacion-ia-10x', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar el curso');
      }

      const data: CourseData = await response.json();
      setCourseData(data);

      const allModulesExpanded: { [key: number]: boolean } = {};
      data.modules.forEach(module => {
        allModulesExpanded[module.id] = true;
      });
      setExpandedModules(allModulesExpanded);

      if (data.modules.length > 0 && data.modules[0].lessons.length > 0) {
        setSelectedLesson(data.modules[0].lessons[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const getAllLessons = (): Lesson[] => {
    if (!courseData) return [];
    return courseData.modules.flatMap(module => module.lessons);
  };

  const getCurrentLessonIndex = (): number => {
    if (!selectedLesson) return -1;
    const allLessons = getAllLessons();
    return allLessons.findIndex(lesson => lesson.id === selectedLesson.id);
  };

  const goToPreviousLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1]);
    }
  };

  const goToNextLesson = () => {
    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1]);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: colors.gray[700]
      }}>
        Cargando curso...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#ef4444' }}>{error}</div>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!courseData) return null;

  const currentIndex = getCurrentLessonIndex();
  const totalLessons = getAllLessons().length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: colors.gray[600],
        color: colors.white,
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '350px',
          padding: '0 1.5rem',
          borderRight: `1px solid ${colors.gray[500]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            {courseData.course.title}
          </h1>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {courseData.course.modality} • {courseData.course.duration}
          </div>
          <button
            onClick={() => router.push('/aula-virtual')}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${colors.white}`,
              color: colors.white,
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            ← Volver
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '1rem', padding: '0 2rem' }}>
          <button
            onClick={goToPreviousLesson}
            disabled={currentIndex === 0}
            style={{
              backgroundColor: currentIndex === 0 ? colors.gray[200] : colors.primary,
              color: currentIndex === 0 ? colors.gray[500] : colors.white,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Anterior
          </button>

          <button
            onClick={goToNextLesson}
            disabled={currentIndex === totalLessons - 1}
            style={{
              backgroundColor: currentIndex === totalLessons - 1 ? colors.gray[200] : colors.primary,
              color: currentIndex === totalLessons - 1 ? colors.gray[500] : colors.white,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: currentIndex === totalLessons - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Próximo →
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <aside style={{
          width: '350px',
          backgroundColor: colors.gray[100],
          borderRight: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
          }}>
            {courseData.modules.map(module => (
              <div key={module.id} style={{ marginBottom: '1rem' }}>
                <div
                  onClick={() => toggleModule(module.id)}
                  style={{
                    backgroundColor: colors.white,
                    padding: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    color: colors.gray[700],
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <span>{module.title}</span>
                  <span>{expandedModules[module.id] ? '▼' : '▶'}</span>
                </div>

                {expandedModules[module.id] && (
                  <div style={{ paddingLeft: '0.5rem' }}>
                    {module.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        style={{
                          backgroundColor: selectedLesson?.id === lesson.id ? colors.accent : colors.white,
                          color: selectedLesson?.id === lesson.id ? colors.white : colors.gray[700],
                          padding: '0.75rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>{lesson.content_type === 'video' ? '▶️' : '📄'}</span>
                        <span style={{ flex: 1 }}>{lesson.title}</span>
                        {lesson.is_free && (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: selectedLesson?.id === lesson.id ? 'rgba(255,255,255,0.2)' : colors.gray[200],
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            Gratis
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            padding: '1rem',
            borderTop: `1px solid ${colors.gray[200]}`
          }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                backgroundColor: '#ef4444',
                color: colors.white,
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: colors.white
        }}>
          {selectedLesson ? (
            <>
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                overflow: 'auto'
              }}>
                {selectedLesson.content_type === 'video' && selectedLesson.video_url && (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLesson.video_url}`}
                    style={{
                      width: '100%',
                      maxWidth: '1200px',
                      height: '80vh',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {selectedLesson.content_type === 'document' && selectedLesson.document_url && (
                  <iframe
                    src={`${selectedLesson.document_url}#toolbar=0&navpanes=0&scrollbar=1`}
                    style={{
                      width: '100%',
                      maxWidth: '1200px',
                      height: '80vh',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                )}

                {!selectedLesson.video_url && !selectedLesson.document_url && (
                  <div style={{ textAlign: 'center', color: colors.gray[500] }}>
                    <p style={{ fontSize: '1.25rem' }}>Contenido no disponible</p>
                    <p style={{ fontSize: '0.875rem' }}>Esta lección aún no tiene contenido asignado</p>
                  </div>
                )}
              </div>

              <div style={{
                padding: '2rem',
                backgroundColor: colors.gray[100],
                borderTop: `1px solid ${colors.gray[200]}`
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: colors.gray[700],
                  marginBottom: '0.5rem'
                }}>
                  {selectedLesson.title}
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: colors.gray[600],
                  lineHeight: '1.6'
                }}>
                  {selectedLesson.description}
                </p>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: colors.gray[500]
            }}>
              <p style={{ fontSize: '1.25rem' }}>Selecciona una lección para comenzar</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
