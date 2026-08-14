'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedSidebar, { MenuItem } from '@/components/unified/UnifiedSidebar';

interface AssignmentSubmission {
  id: number;
  user_id: number;
  lesson_id: number;
  student_name: string;
  student_email: string;
  lesson_title: string;
  module_title: string;
  file_url: string;
  file_name: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  total_points: number;
}

interface GradesData {
  course: {
    id: number;
    title: string;
    quiz_weight: number;
    assignment_weight: number;
    publication_status: 'published' | 'draft' | 'coming_soon';
  };
  assignmentSubmissions: AssignmentSubmission[];
}

export default function CalificacionesTareasPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradingAssignment, setGradingAssignment] = useState<AssignmentSubmission | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(0);
  const [feedbackValue, setFeedbackValue] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

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

  const handleGradeAssignment = async () => {
    if (!gradingAssignment) return;

    try {
      const res = await fetch(`/api/instructor/assignment-submissions/${gradingAssignment.lesson_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: gradingAssignment.id,
          grade: gradeValue,
          feedback: feedbackValue
        }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Error al calificar tarea');

      setSuccessMessage('✓ Tarea calificada exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      setGradingAssignment(null);
      setGradeValue(0);
      setFeedbackValue('');
      fetchGrades();
    } catch (error) {
      console.error(error);
      alert('Error al calificar la tarea');
    }
  };

  const openGradingModal = (assignment: AssignmentSubmission) => {
    setGradingAssignment(assignment);
    setGradeValue(assignment.grade || 0);
    setFeedbackValue(assignment.feedback || '');
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
        activeItem="calificaciones-tareas"
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

        {successMessage && (
          <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            zIndex: 9999,
            fontWeight: '600'
          }}>
            {successMessage}
          </div>
        )}

        <main style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: '#1f2937', fontWeight: '600' }}>
                Entregas de Tareas
              </h2>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Estudiante
                      </th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Tarea
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Archivo
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Calificación
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Fecha Entrega
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.assignmentSubmissions && data.assignmentSubmissions.map(assignment => {
                      const isGraded = assignment.grade !== null;
                      const gradeColor = isGraded && assignment.grade !== null
                        ? ((assignment.grade / assignment.total_points) * 100 >= 70 ? '#10b981' : ((assignment.grade / assignment.total_points) * 100 >= 50 ? '#f59e0b' : '#ef4444'))
                        : '#6b7280';

                      return (
                        <tr key={assignment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{assignment.student_name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{assignment.student_email}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1f2937' }}>{assignment.lesson_title}</div>
                              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{assignment.module_title}</div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <a
                              href={assignment.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#667eea',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              📎 {assignment.file_name}
                            </a>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            {isGraded ? (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                backgroundColor: `${gradeColor}20`,
                                color: gradeColor,
                                fontWeight: '600',
                                fontSize: '0.875rem'
                              }}>
                                {assignment.grade} / {assignment.total_points}
                              </span>
                            ) : (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                                fontWeight: '600',
                                fontSize: '0.875rem'
                              }}>
                                Sin calificar
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(assignment.submitted_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <button
                              onClick={() => openGradingModal(assignment)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: isGraded ? '#f59e0b' : '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'background 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = isGraded ? '#d97706' : '#5a67d8';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = isGraded ? '#f59e0b' : '#667eea';
                              }}
                            >
                              {isGraded ? 'Editar Nota' : 'Calificar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {(!data.assignmentSubmissions || data.assignmentSubmissions.length === 0) && (
                  <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No hay entregas de tareas todavía.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {gradingAssignment && (
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
          onClick={() => setGradingAssignment(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Calificar Tarea
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                <strong>Estudiante:</strong> {gradingAssignment.student_name}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                <strong>Tarea:</strong> {gradingAssignment.lesson_title}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                <strong>Archivo:</strong>{' '}
                <a
                  href={gradingAssignment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#667eea', textDecoration: 'underline' }}
                >
                  {gradingAssignment.file_name}
                </a>
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Calificación (sobre {gradingAssignment.total_points} puntos)
              </label>
              <input
                type="number"
                min="0"
                max={gradingAssignment.total_points}
                value={gradeValue}
                onChange={(e) => setGradeValue(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Retroalimentación (opcional)
              </label>
              <textarea
                value={feedbackValue}
                onChange={(e) => setFeedbackValue(e.target.value)}
                placeholder="Escribe comentarios para el estudiante..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setGradingAssignment(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                Cancelar
              </button>
              <button
                onClick={handleGradeAssignment}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a67d8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
              >
                Guardar Calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
