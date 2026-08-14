'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedSidebar, { MenuItem } from '@/components/unified/UnifiedSidebar';

interface QuizGrade {
  id: number;
  user_id: number;
  lesson_id: number;
  student_name: string;
  student_email: string;
  lesson_title: string;
  module_title: string;
  score: number;
  total_questions: number;
  responses: any;
  completed_at: string;
}

interface GradesData {
  course: {
    id: number;
    title: string;
    quiz_weight: number;
    assignment_weight: number;
    publication_status: 'published' | 'draft' | 'coming_soon';
  };
  quizGrades: QuizGrade[];
}

export default function CalificacionesQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<QuizGrade | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [slug]);

  const fetchGrades = async () => {
    try {
      const res = await fetch(`/api/instructor/quiz-grades/${slug}`);
      if (!res.ok) throw new Error('Error al cargar calificaciones');
      const gradesData = await res.json();
      setData(gradesData);
    } catch (error) {
      console.error(error);
      alert('Error al cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠', href: `/instructor/curso/${slug}` },
    { id: 'contenido', label: 'Contenido', icon: '📚', href: `/instructor/curso/${slug}` },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥', href: `/instructor/curso/${slug}` },
    { id: 'calificaciones-estudiantes', label: 'Calificaciones', icon: '📊', href: `/instructor/curso/${slug}/calificaciones-estudiantes` },
    { id: 'calificaciones-quizzes', label: 'Quizzes', icon: '📝', href: `/instructor/curso/${slug}/calificaciones-quizzes` },
    { id: 'calificaciones-tareas', label: 'Tareas', icon: '📋', href: `/instructor/curso/${slug}/calificaciones-tareas` },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️', href: `/instructor/curso/${slug}` },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Error al cargar datos</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UnifiedSidebar
        menuItems={menuItems}
        activeItem="calificaciones-quizzes"
        currentUser={currentUser}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        title={data.course.title}
        subtitle={data.course.publication_status === 'published' ? '✓ Publicado' : '📝 Borrador'}
      />

      <div style={{
        marginLeft: '0',
        minHeight: '100vh',
        background: '#f9fafb',
        transition: 'margin-left 0.3s ease'
      }}
      className="main-content">
        <style>{`
          @media (min-width: 1025px) {
            .main-content {
              margin-left: 280px !important;
            }
          }
          @media (max-width: 1024px) {
            .mobile-menu-btn {
              display: flex !important;
            }
          }
          @media (min-width: 1025px) {
            .mobile-menu-btn {
              display: none !important;
            }
          }
        `}</style>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-menu-btn"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1000,
            padding: '0.75rem',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>

        <main style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: '#1f2937', fontWeight: '600' }}>
                Todas las Respuestas de Quizzes
              </h2>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Estudiante
                      </th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Lección
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Puntaje
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Fecha
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.quizGrades.map(grade => {
                      const percentage = (grade.score / grade.total_questions) * 100;
                      const color = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';

                      return (
                        <tr key={grade.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{grade.student_name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{grade.student_email}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1f2937' }}>{grade.lesson_title}</div>
                              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{grade.module_title}</div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: `${color}20`,
                              color: color,
                              fontWeight: '600',
                              fontSize: '0.875rem'
                            }}>
                              {grade.score} / {grade.total_questions} ({percentage.toFixed(0)}%)
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(grade.completed_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <button
                              onClick={() => setDetailModal(grade)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a67d8'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                            >
                              Ver Respuestas
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {data.quizGrades.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No hay respuestas de quizzes todavía.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {detailModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setDetailModal(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailModal(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              ✕
            </button>

            <h2 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>
              {detailModal.lesson_title}
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Módulo: {detailModal.module_title}
            </p>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Estudiante: <strong>{detailModal.student_name}</strong> ({detailModal.student_email})
            </p>

            <div style={{
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Puntaje</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                  {detailModal.score} / {detailModal.total_questions}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Porcentaje</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea' }}>
                  {((detailModal.score / detailModal.total_questions) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', color: '#1f2937' }}>
              Respuestas del Estudiante
            </h3>

            {detailModal.responses && typeof detailModal.responses === 'object' && Object.keys(detailModal.responses).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(detailModal.responses).map(([questionId, answer]: [string, any]) => {
                  const isCorrect = answer?.is_correct || false;
                  return (
                    <div
                      key={questionId}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                        borderRadius: '8px',
                        background: isCorrect ? '#ecfdf5' : '#fef2f2'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                          Pregunta {questionId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                        <strong>Respuesta seleccionada:</strong> {answer?.selected_option || 'Sin respuesta'}
                      </div>
                      {!isCorrect && answer?.correct_answer && (
                        <div style={{ fontSize: '0.875rem', color: '#059669' }}>
                          <strong>Respuesta correcta:</strong> {answer.correct_answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                No hay detalles de respuestas disponibles.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
