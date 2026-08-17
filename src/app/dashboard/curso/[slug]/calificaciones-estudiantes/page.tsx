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

interface StudentStats {
  student_id: number;
  student_name: string;
  student_email: string;
  quizzes_completed: number;
  total_score: number;
  total_questions: number;
  total_lessons: number;
  max_possible_points: number;
  average_percentage: number;
  quiz_max_points: number;
  assignment_max_points: number;
  quiz_score: number;
  assignment_score: number;
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
  studentStats: StudentStats[];
}

export default function CalificacionesEstudiantesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);
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

  const getStudentQuizzes = (studentId: number) => {
    return data?.quizGrades.filter(g => g.user_id === studentId) || [];
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard del curso', icon: '🏠', href: `/dashboard/curso/${slug}` },
    { id: 'contenido', label: 'Contenido', icon: '📚', href: `/dashboard/curso/${slug}` },
    { id: 'estudiantes', label: 'Estudiantes', icon: '👥', href: `/dashboard/curso/${slug}` },
    { id: 'calificaciones-estudiantes', label: 'Calificaciones', icon: '📊', href: `/dashboard/curso/${slug}/calificaciones-estudiantes` },
    { id: 'calificaciones-quizzes', label: 'Quizzes', icon: '📝', href: `/dashboard/curso/${slug}/calificaciones-quizzes` },
    { id: 'calificaciones-tareas', label: 'Tareas', icon: '📋', href: `/dashboard/curso/${slug}/calificaciones-tareas` },
    { id: 'configuracion', label: 'Configuración del curso', icon: '⚙️', href: `/dashboard/curso/${slug}` },
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

  const quizWeight = data.course.quiz_weight || 50;
  const assignmentWeight = data.course.assignment_weight || 50;

  return (
    <>
      <UnifiedSidebar
        menuItems={menuItems}
        activeItem="calificaciones-estudiantes"
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <span>Pesos actuales:</span>
            <span style={{ fontWeight: '600', color: '#667eea' }}>📝 Quizzes {quizWeight}%</span>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ fontWeight: '600', color: '#667eea' }}>📤 Tareas {assignmentWeight}%</span>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: '#1f2937', fontWeight: '600' }}>
                Rendimiento por Estudiante
              </h2>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Estudiante
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Quizzes Completados
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Puntaje Quizzes
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Promedio Quizzes
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Promedio Tareas
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Nota Final (sobre 20)
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentStats.map(student => {
                      const quizMaxPoints = student.quiz_max_points || 0;
                      const assignmentMaxPoints = student.assignment_max_points || 0;

                      const quizAverage = quizMaxPoints > 0 ? ((student.quiz_score / quizMaxPoints) * 20) : 0;
                      const assignmentAverage = assignmentMaxPoints > 0 ? ((student.assignment_score / assignmentMaxPoints) * 20) : 0;

                      let effectiveQuizWeight = quizWeight;
                      let effectiveAssignmentWeight = assignmentWeight;

                      if (assignmentMaxPoints === 0 && quizMaxPoints > 0) {
                        effectiveQuizWeight = 100;
                        effectiveAssignmentWeight = 0;
                      } else if (quizMaxPoints === 0 && assignmentMaxPoints > 0) {
                        effectiveQuizWeight = 0;
                        effectiveAssignmentWeight = 100;
                      }

                      let notaSobre20;
                      if (effectiveQuizWeight === 100 || assignmentMaxPoints === 0) {
                        notaSobre20 = quizAverage.toFixed(1);
                      } else if (effectiveAssignmentWeight === 100 || quizMaxPoints === 0) {
                        notaSobre20 = assignmentAverage.toFixed(1);
                      } else {
                        notaSobre20 = ((quizAverage * effectiveQuizWeight / 100) + (assignmentAverage * effectiveAssignmentWeight / 100)).toFixed(1);
                      }

                      const finalPercentage = parseFloat(notaSobre20) / 20 * 100;
                      const color = finalPercentage >= 70 ? '#10b981' : finalPercentage >= 50 ? '#f59e0b' : '#ef4444';

                      return (
                        <tr key={student.student_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{student.student_name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{student.student_email}</div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem', color: '#1f2937' }}>
                            {student.quizzes_completed || 0}
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem', color: '#1f2937' }}>
                            {student.quiz_score || 0} / {quizMaxPoints}
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
                              {quizAverage.toFixed(1)}/20
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            {assignmentMaxPoints > 0 ? (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                backgroundColor: '#667eea20',
                                color: '#667eea',
                                fontWeight: '600',
                                fontSize: '0.875rem'
                              }}>
                                {assignmentAverage.toFixed(1)}/20
                              </span>
                            ) : (
                              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>—</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: `${color}20`,
                              color: color,
                              fontWeight: '700',
                              fontSize: '1rem'
                            }}>
                              {notaSobre20}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '1rem' }}>
                            <button
                              onClick={() => setSelectedStudent(student)}
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
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {data.studentStats.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No hay estudiantes inscritos en este curso todavía.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedStudent && (
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
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '2rem',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
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
              {selectedStudent.student_name}
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {selectedStudent.student_email}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                  {selectedStudent.quizzes_completed || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Quizzes Completados</div>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                  {selectedStudent.total_score || 0}/{selectedStudent.max_possible_points || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Puntaje Total</div>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                  {((selectedStudent.average_percentage as number) || 0).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Promedio</div>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                  {(selectedStudent.max_possible_points > 0
                    ? ((selectedStudent.total_score / selectedStudent.max_possible_points) * 20).toFixed(1)
                    : '0.0')}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Nota (sobre 20)</div>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', color: '#1f2937' }}>
              Historial de Quizzes
            </h3>

            {getStudentQuizzes(selectedStudent.student_id).map(quiz => {
              const percentage = (quiz.score / quiz.total_questions) * 100;
              const color = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';

              return (
                <div
                  key={quiz.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{quiz.lesson_title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{quiz.module_title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        backgroundColor: `${color}20`,
                        color: color,
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {quiz.score}/{quiz.total_questions}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(quiz.completed_at).toLocaleString('es-ES')}
                  </div>
                </div>
              );
            })}

            {getStudentQuizzes(selectedStudent.student_id).length === 0 && (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Este estudiante no ha completado ningún quiz todavía.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
