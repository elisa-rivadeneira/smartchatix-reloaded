'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CourseInstructorHeader from '@/components/CourseInstructorHeader';

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
  };
  quizGrades: QuizGrade[];
  studentStats: StudentStats[];
  assignmentSubmissions: AssignmentSubmission[];
}

export default function CalificacionesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'students' | 'quizzes' | 'assignments'>('students');
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);
  const [detailModal, setDetailModal] = useState<QuizGrade | null>(null);
  const [gradingAssignment, setGradingAssignment] = useState<AssignmentSubmission | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(0);
  const [feedbackValue, setFeedbackValue] = useState<string>('');
  const [quizWeight, setQuizWeight] = useState<number>(50);
  const [assignmentWeight, setAssignmentWeight] = useState<number>(50);
  const [editingWeights, setEditingWeights] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setModal({ show: true, type, message });
  };

  const closeModal = () => {
    setModal({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    fetchGrades();
  }, [slug]);

  const fetchGrades = async () => {
    try {
      const res = await fetch(`/api/instructor/quiz-grades/${slug}`);
      if (!res.ok) throw new Error('Error al cargar calificaciones');
      const gradesData = await res.json();
      setData(gradesData);

      const hasAssignments = gradesData.studentStats.some((s: any) => (s.assignment_max_points || 0) > 0);
      const hasQuizzes = gradesData.studentStats.some((s: any) => (s.quiz_max_points || 0) > 0);

      if (!hasAssignments && hasQuizzes) {
        setQuizWeight(100);
        setAssignmentWeight(0);
      } else if (!hasQuizzes && hasAssignments) {
        setQuizWeight(0);
        setAssignmentWeight(100);
      } else {
        setQuizWeight(gradesData.course.quiz_weight || 50);
        setAssignmentWeight(gradesData.course.assignment_weight || 50);
      }
    } catch (error) {
      console.error(error);
      showModal('error', 'Error al cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeights = async () => {
    if (quizWeight + assignmentWeight !== 100) {
      showModal('warning', 'La suma de los pesos debe ser 100%');
      return;
    }

    try {
      const res = await fetch(`/api/instructor/course-weights/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_weight: quizWeight,
          assignment_weight: assignmentWeight
        }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Error al guardar pesos');
      showModal('success', '✓ Pesos guardados exitosamente');
      setEditingWeights(false);
      fetchGrades();
    } catch (error) {
      console.error(error);
      showModal('error', 'Error al guardar los pesos');
    }
  };

  const getStudentQuizzes = (studentId: number) => {
    return data?.quizGrades.filter(g => g.user_id === studentId) || [];
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

      showModal('success', '✓ Tarea calificada exitosamente');
      setGradingAssignment(null);
      setGradeValue(0);
      setFeedbackValue('');
      fetchGrades();
    } catch (error) {
      console.error(error);
      showModal('error', 'Error al calificar la tarea');
    }
  };

  const openGradingModal = (assignment: AssignmentSubmission) => {
    setGradingAssignment(assignment);
    setGradeValue(assignment.grade || 0);
    setFeedbackValue(assignment.feedback || '');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando calificaciones...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Error al cargar datos</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <CourseInstructorHeader
        courseTitle={data?.course.title || 'Curso'}
        slug={slug}
        activeTab="calificaciones"
        showCustomHeader={true}
      />

      <main style={{
        background: '#f9fafb',
        minHeight: 'calc(100vh - 140px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>Pesos actuales:</span>
            <span style={{ fontWeight: '600', color: '#667eea' }}>📝 Quizzes {quizWeight}%</span>
            <span style={{ color: '#d1d5db' }}>•</span>
            <span style={{ fontWeight: '600', color: '#667eea' }}>📤 Tareas {assignmentWeight}%</span>
          </div>
          <button
            onClick={() => setEditingWeights(true)}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)';
            }}
            title="Configurar pesos de evaluación"
          >
            ⚙️
          </button>
        </div>

        {editingWeights && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setEditingWeights(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '90%',
                maxWidth: '500px',
                overflow: 'hidden'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                  ⚙️ Configuración de Pesos
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                  Ajusta el peso de cada tipo de evaluación
                </p>
              </div>

              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#667eea',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem'
                  }}>
                    📝 Quizzes
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={quizWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setQuizWeight(val);
                        setAssignmentWeight(100 - val);
                      }}
                      style={{
                        flex: 1,
                        height: '8px',
                        borderRadius: '4px',
                        outline: 'none',
                        background: `linear-gradient(to right, #667eea 0%, #667eea ${quizWeight}%, #e5e7eb ${quizWeight}%, #e5e7eb 100%)`
                      }}
                    />
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', minWidth: '60px' }}>
                      {quizWeight}%
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#667eea',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem'
                  }}>
                    📤 Tareas
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={assignmentWeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAssignmentWeight(val);
                        setQuizWeight(100 - val);
                      }}
                      style={{
                        flex: 1,
                        height: '8px',
                        borderRadius: '4px',
                        outline: 'none',
                        background: `linear-gradient(to right, #667eea 0%, #667eea ${assignmentWeight}%, #e5e7eb ${assignmentWeight}%, #e5e7eb 100%)`
                      }}
                    />
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', minWidth: '60px' }}>
                      {assignmentWeight}%
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: quizWeight + assignmentWeight === 100 ? '#ecfdf5' : '#fef3c7',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {quizWeight + assignmentWeight === 100 ? '✓' : '⚠️'}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: quizWeight + assignmentWeight === 100 ? '#065f46' : '#92400e'
                  }}>
                    {quizWeight + assignmentWeight === 100
                      ? 'Configuración válida'
                      : `Total: ${quizWeight + assignmentWeight}%`}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setQuizWeight(data?.course.quiz_weight || 50);
                      setAssignmentWeight(data?.course.assignment_weight || 50);
                      setEditingWeights(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      backgroundColor: 'white',
                      color: '#6b7280',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveWeights}
                    disabled={quizWeight + assignmentWeight !== 100}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      background: quizWeight + assignmentWeight === 100
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#d1d5db',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: quizWeight + assignmentWeight === 100 ? 'pointer' : 'not-allowed',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setView('students')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: view === 'students' ? '#667eea' : 'transparent',
                color: view === 'students' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '8px 0 0 0'
              }}
            >
              📊 Por Estudiante
            </button>
            <button
              onClick={() => setView('quizzes')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: view === 'quizzes' ? '#667eea' : 'transparent',
                color: view === 'quizzes' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📝 Quizzes
            </button>
            <button
              onClick={() => setView('assignments')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: view === 'assignments' ? '#667eea' : 'transparent',
                color: view === 'assignments' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '0 8px 0 0'
              }}
            >
              📤 Tareas
            </button>
          </div>

          {view === 'students' && (
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1f2937' }}>
                Rendimiento por Estudiante
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Estudiante
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Quizzes Completados
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Puntaje Quizzes
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Promedio Quizzes
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Promedio Tareas
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Nota Final (sobre 20)
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.studentStats.map(student => {
                    const percentage = Number(student.average_percentage) || 0;
                    const quizMaxPoints = student.quiz_max_points || 0;
                    const assignmentMaxPoints = student.assignment_max_points || 0;

                    const quizAverage = quizMaxPoints > 0 ? ((student.quiz_score / quizMaxPoints) * 20) : 0;
                    const assignmentAverage = assignmentMaxPoints > 0 ? ((student.assignment_score / assignmentMaxPoints) * 20) : 0;

                    let quizWeight = data.course.quiz_weight || 50;
                    let assignmentWeight = data.course.assignment_weight || 50;

                    if (assignmentMaxPoints === 0 && quizMaxPoints > 0) {
                      quizWeight = 100;
                      assignmentWeight = 0;
                    } else if (quizMaxPoints === 0 && assignmentMaxPoints > 0) {
                      quizWeight = 0;
                      assignmentWeight = 100;
                    }

                    console.log('DEBUG:', {
                      student: student.student_name,
                      quizScore: student.quiz_score,
                      quizMaxPoints,
                      assignmentMaxPoints,
                      quizAverage,
                      assignmentAverage,
                      quizWeight,
                      assignmentWeight
                    });

                    let notaSobre20;
                    if (quizWeight === 100 || assignmentMaxPoints === 0) {
                      notaSobre20 = quizAverage.toFixed(1);
                    } else if (assignmentWeight === 100 || quizMaxPoints === 0) {
                      notaSobre20 = assignmentAverage.toFixed(1);
                    } else {
                      notaSobre20 = ((quizAverage * quizWeight / 100) + (assignmentAverage * assignmentWeight / 100)).toFixed(1);
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
                          {student.quiz_score || 0} / {student.quiz_max_points || 0}
                        </td>
                        <td style={{ textAlign: 'center', padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            backgroundColor: `${color}20`,
                            color: color,
                            fontWeight: '600'
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
                              fontWeight: '600'
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
                              fontWeight: '500'
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
                <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No hay estudiantes inscritos en este curso todavía.
                </p>
              )}
            </div>
          )}

          {view === 'quizzes' && (
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1f2937' }}>
                Todas las Respuestas de Quizzes
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Estudiante
                    </th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Lección
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Puntaje
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Fecha
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
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
                            fontWeight: '600'
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
                              fontWeight: '500'
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
                <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No hay respuestas de quizzes todavía.
                </p>
              )}
            </div>
          )}

          {view === 'assignments' && (
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1f2937' }}>
                Entregas de Tareas
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Estudiante
                    </th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Tarea
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Archivo
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Calificación
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                      Fecha Entrega
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
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
                              fontSize: '0.875rem'
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
                              fontWeight: '600'
                            }}>
                              {assignment.grade} / {assignment.total_points}
                            </span>
                          ) : (
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              fontWeight: '600'
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
                              fontWeight: '500'
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
                <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No hay entregas de tareas todavía.
                </p>
              )}
            </div>
          )}
        </div>
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
              gridTemplateColumns: 'repeat(4, 1fr)',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
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
      </main>

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
                  cursor: 'pointer'
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
                  cursor: 'pointer'
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

      {modal.show && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              background: modal.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                         modal.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                         modal.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                         'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)'
            }}>
              {modal.type === 'success' ? '✓' : modal.type === 'error' ? '✕' : modal.type === 'warning' ? '⚠' : 'ℹ'}
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              style={{
                padding: '0.75rem 2rem',
                background: modal.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                           modal.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                           modal.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                           'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
