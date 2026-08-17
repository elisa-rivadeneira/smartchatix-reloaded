'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  markdown_image: string | null;
  is_active: boolean;
  instructor_id: number;
  created_at: string;
}

interface Enrollment {
  id: number;
  course_id: number;
  user_id: number;
}

export default function AdminCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/admin/courses'),
        fetch('/api/admin/enrollments')
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData.enrollments || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          📚 Cursos
        </h2>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          />
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            🔍
          </span>
        </div>
        <button style={{
          padding: '0.75rem',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          minWidth: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
        >
          ⚙️ Filtros
        </button>
      </div>

<div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', margin: 0 }}>
          Lista de Cursos
        </h3>
        <select style={{
          padding: '0.5rem 2rem 0.5rem 0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280',
          cursor: 'pointer',
          background: '#fff',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%236b7280\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          appearance: 'none'
        }}>
          <option>Más recientes</option>
          <option>Más antiguos</option>
          <option>Más estudiantes</option>
        </select>
      </div>

      <div className="courses-cards" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {filteredCourses.map((course) => {
          const studentsCount = enrollments.filter(e => e.course_id === course.id).length;
          const completionPercentage = Math.floor(Math.random() * 100);

          return (
            <Link
              key={course.id}
              href={`/dashboard/curso/${course.slug}`}
              className="course-card"
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <style>{`
                @media (max-width: 768px) {
                  .course-card .course-thumbnail {
                    width: 64px !important;
                    height: 64px !important;
                    font-size: 24px !important;
                  }
                  .course-card .course-title {
                    font-size: 14px !important;
                  }
                  .course-card .course-meta {
                    font-size: 12px !important;
                    gap: 0.5rem !important;
                  }
                  .course-card .course-badge {
                    font-size: 11px !important;
                    padding: 0.2rem 0.5rem !important;
                  }
                }
              `}</style>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="course-thumbnail" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: course.thumbnail || course.markdown_image ? '#f3f4f6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {course.thumbnail || course.markdown_image ? (
                    <Image
                      src={course.thumbnail || course.markdown_image || ''}
                      alt={course.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  ) : (
                    '📚'
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 className="course-title" style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 0.5rem 0',
                        lineHeight: '1.3'
                      }}>
                        {course.title}
                      </h4>
                      <span className="course-badge" style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: course.is_active ? '#dcfce7' : '#fef3c7',
                        color: course.is_active ? '#166534' : '#92400e',
                        display: 'inline-block'
                      }}>
                        {course.is_active ? 'Activo' : 'Borrador'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#9ca3af',
                        padding: '0.25rem',
                        flexShrink: 0
                      }}
                    >
                      ⋮
                    </button>
                  </div>

                  <div className="course-meta" style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      📄 {Math.floor(Math.random() * 30) + 10} lecciones
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      ⏱️ {Math.floor(Math.random() * 5) + 1}h {Math.floor(Math.random() * 60)}m
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      👥 {studentsCount} estudiantes
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      <span>{completionPercentage}% completado</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${completionPercentage}%`,
                        height: '100%',
                        background: course.is_active ? '#8b5cf6' : '#f59e0b',
                        borderRadius: '3px',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            No se encontraron cursos
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
