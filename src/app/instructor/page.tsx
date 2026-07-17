'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CourseStructureAssistant from '@/components/instructor/CourseStructureAssistant';
import Breadcrumb from '@/components/Breadcrumb';

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  price_vivo: number;
  price_grabado: number;
  is_active: boolean;
  modules_count: number;
  lessons_count: number;
  students_count: number;
  thumbnail?: string | null;
}

interface Student {
  id: number;
  name: string;
  email: string;
  course_title: string;
  modality: string;
  enrolled_at: string;
  progress: number;
}

export default function InstructorPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('mis-cursos');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAssistant, setShowAssistant] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'instructor' && data.user.role !== 'admin') {
        router.push('/aula-virtual');
        return;
      }
      setCurrentUser(data.user);
      loadData();
    } catch (error) {
      router.push('/login');
    }
  };

  const loadData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch('/api/instructor/courses'),
        fetch('/api/instructor/students')
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleStructureCreated = async (structure: any) => {
    try {
      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: structure.title,
          description: structure.description,
          price_vivo: 0,
          price_grabado: 0,
          modules: structure.modules
        })
      });

      if (!response.ok) {
        alert('Error al crear el curso');
        return;
      }

      const data = await response.json();
      alert('Curso creado exitosamente');
      router.push(`/instructor/curso/${data.course.slug}`);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear el curso');
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
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        height: '72px',
        background: '#1c1d1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Link href="/instructor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo_smartchatix_horiz.png"
            alt="SmartChatix"
            width={180}
            height={52}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              background: userMenuOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              if (!userMenuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '220px',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a202c',
                  marginBottom: '4px'
                }}>
                  {currentUser?.name || 'Usuario'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {currentUser?.email}
                </div>
              </div>
              <Link
                href="/aula-virtual"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>📚</span>
                Mis Cursos
              </Link>
              <Link
                href="/"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>🔍</span>
                Catálogo
              </Link>
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontSize: '16px' }}>⚙️</span>
                  Panel Admin
                </Link>
              )}
              <Link
                href="/instructor"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>👨‍🏫</span>
                Panel Instructor
              </Link>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'white',
                  border: 'none',
                  textAlign: 'left',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '16px' }}>🚪</span>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Panel Instructor' }
        ]}
        grayBackground={true}
      >
        <div style={{ display: 'flex', gap: '32px' }}>
          {['mis-cursos', 'estudiantes', 'crear-curso'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '9px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #667eea' : '2px solid transparent',
                color: activeTab === tab ? '#667eea' : '#6b7280',
                fontSize: '15px',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'mis-cursos' ? 'Mis Cursos' : tab === 'estudiantes' ? 'Estudiantes' : 'Crear Curso'}
            </button>
          ))}
        </div>
      </Breadcrumb>

      <main style={{
        background: '#f9fafb',
        minHeight: 'calc(100vh - 140px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px 24px 32px 24px'
        }}>
        {activeTab === 'mis-cursos' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1a202c',
                  margin: '0 0 8px 0'
                }}>
                  Mis cursos
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Gestiona tus cursos y su contenido.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('crear-curso')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
              >
                <span style={{ fontSize: '18px' }}>+</span>
                Crear Curso
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              alignItems: 'center'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 40px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '18px'
                }}>
                  🔍
                </span>
              </div>
              <select style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}>
                <option>Más recientes</option>
                <option>Más antiguos</option>
                <option>Más estudiantes</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {courses.map(course => (
                <div
                  key={course.id}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={160}
                      height={100}
                      style={{
                        borderRadius: '4px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '160px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '28px' }}>📚</span>
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                      margin: '0 0 6px 0'
                    }}>
                      {course.title}
                    </h3>
                    {course.description && (
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {course.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      <span>{course.lessons_count} lecciones</span>
                      <span>•</span>
                      <span>{course.modules_count > 0 ? `${Math.floor(course.modules_count)}h ${Math.round((course.modules_count % 1) * 60)}m` : '0h 0m'}</span>
                      <span>•</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: course.is_active ? '#d1fae5' : '#fee2e2',
                        color: course.is_active ? '#065f46' : '#991b1b'
                      }}>
                        {course.is_active ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/instructor/curso/${course.slug}`}
                    style={{
                      padding: '8px 20px',
                      background: 'transparent',
                      color: '#667eea',
                      border: '1px solid #667eea',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#667eea';
                    }}
                  >
                    Editar curso
                  </Link>

                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '8px',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      fontSize: '20px'
                    }}
                  >
                    ⋮
                  </button>
                </div>
              ))}
              {courses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>No tienes cursos creados aún</p>
                  <button
                    onClick={() => setActiveTab('crear-curso')}
                    style={{
                      marginTop: '16px',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Crear tu primer curso
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'estudiantes' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c',
                margin: 0
              }}>
                Mis Estudiantes
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Nombre', 'Email', 'Curso', 'Modalidad', 'Progreso', 'Fecha Inscripción'].map(header => (
                      <th key={header} style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={`${student.id}-${student.course_title}`} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c', fontWeight: '500' }}>
                        {student.name || 'Sin nombre'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {student.email}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        {student.course_title}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: student.modality === 'vivo' ? '#fef3c7' : '#dbeafe',
                          color: student.modality === 'vivo' ? '#92400e' : '#1e40af'
                        }}>
                          {student.modality === 'vivo' ? 'En Vivo' : 'Grabado'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            flex: 1,
                            height: '8px',
                            background: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${student.progress}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #667eea, #764ba2)',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', minWidth: '40px' }}>
                            {student.progress}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {new Date(student.enrolled_at).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                        No tienes estudiantes inscritos aún
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'crear-curso' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '32px'
          }}>
            <CourseStructureAssistant onStructureCreated={handleStructureCreated} />
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
