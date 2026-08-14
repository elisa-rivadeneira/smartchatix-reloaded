'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CourseStructureAssistant from '@/components/instructor/CourseStructureAssistant';
import Breadcrumb from '@/components/Breadcrumb';
import AdminSidebar from '@/components/AdminSidebar';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLegacyMenu, setShowLegacyMenu] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
  }>({ show: false, type: 'info', message: '' });

  const showModal = (type: 'success' | 'error' | 'warning' | 'info', message: string, onClose?: () => void) => {
    setModal({ show: true, type, message, onClose });
  };

  const closeModal = () => {
    if (modal.onClose) {
      modal.onClose();
    }
    setModal({ show: false, type: 'info', message: '' });
  };

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
      console.log('📤 Enviando estructura a API:', structure);

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

      const data = await response.json();
      console.log('📥 Respuesta de API:', data);

      if (!response.ok) {
        const errorMsg = data.details || data.error || 'Error desconocido';
        console.error('❌ Error del servidor:', errorMsg);
        showModal('error', `Error al crear el curso: ${errorMsg}`);
        return;
      }

      showModal('success', 'Curso creado exitosamente', () => {
        router.push(`/instructor/curso/${data.course.slug}`);
      });
    } catch (error: any) {
      console.error('❌ Error creating course:', error);
      showModal('error', `Error al crear el curso: ${error.message}`);
    }
  };

  const handleManualCreation = async (title: string, description: string) => {
    try {
      console.log('📤 Creando curso manual:', { title, description });

      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price_vivo: 0,
          price_grabado: 0,
          modules: []
        })
      });

      const data = await response.json();
      console.log('📥 Respuesta de API:', data);

      if (!response.ok) {
        const errorMsg = data.details || data.error || 'Error desconocido';
        console.error('❌ Error del servidor:', errorMsg);
        showModal('error', `Error al crear el curso: ${errorMsg}`);
        return;
      }

      showModal('success', 'Curso creado exitosamente. Ahora puedes configurar módulos y precios.', () => {
        router.push(`/instructor/curso/${data.course.slug}`);
      });
    } catch (error: any) {
      console.error('❌ Error creating course:', error);
      showModal('error', `Error al crear el curso: ${error.message}`);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'mis-cursos', label: 'Mis Cursos', icon: '📚', badge: courses.length },
    { id: 'menu-legacy', label: 'Menú Legacy', icon: '🔧', badge: null }
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

  if (showLegacyMenu) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          padding: '1rem',
          textAlign: 'center',
          borderBottom: '2px solid #d97706'
        }}>
          <p style={{ margin: 0, color: '#78350f', fontSize: '14px', fontWeight: '600' }}>
            ⚠️ <strong>Vista Legacy:</strong> Esta página se está migrando a{' '}
            <a href="/dashboard" style={{ color: '#78350f', textDecoration: 'underline' }}>/dashboard</a>.
            Pronto solo existirá el dashboard unificado.
          </p>
        </div>
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

          <button
            onClick={() => setShowLegacyMenu(false)}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ← Volver al Panel Nuevo
          </button>
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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Gestiona tus cursos y su contenido.
                  </p>
                </div>
                <button
                  onClick={() => setShowLegacyMenu(true)}
                  style={{
                    background: '#8b5cf6',
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
                  onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  Nuevo Curso
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: 1,
                  minWidth: '250px',
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

              <style>{`
                @media (max-width: 640px) {
                  .course-card {
                    flex-direction: column !important;
                  }
                  .course-card img, .course-card > div:first-child {
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                  .course-actions {
                    width: 100% !important;
                    justify-content: space-between !important;
                  }
                }
              `}</style>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {courses.map(course => (
                  <div
                    key={course.id}
                    className="course-card"
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

                    <div className="course-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                  </div>
                ))}
                {courses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>No tienes cursos creados aún</p>
                    <button
                      onClick={() => setShowLegacyMenu(true)}
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
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', flexDirection: 'column' }}>
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        padding: '1rem',
        textAlign: 'center',
        borderBottom: '2px solid #d97706',
        zIndex: 1000
      }}>
        <p style={{ margin: 0, color: '#78350f', fontSize: '14px', fontWeight: '600' }}>
          ⚠️ <strong>Vista Legacy:</strong> Esta página se está migrando a{' '}
          <a href="/dashboard" style={{ color: '#78350f', textDecoration: 'underline' }}>/dashboard</a>.
          Pronto solo existirá el dashboard unificado.
        </p>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
      <AdminSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'menu-legacy') {
            setShowLegacyMenu(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0.5rem',
              marginRight: '1rem'
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>
          <style>{`
            @media (max-width: 768px) {
              .mobile-menu-btn {
                display: block !important;
              }
            }
          `}</style>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {activeTab === 'course-detail' && (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setSelectedCourseSlug(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.5rem'
                }}
              >
                ←
              </button>
            )}
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              {activeTab === 'dashboard' ? 'Dashboard' :
               activeTab === 'mis-cursos' ? 'Mis Cursos' :
               activeTab === 'course-detail' ? 'Detalle del Curso' :
               'Menú Legacy'}
            </h1>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <div>
              <style>{`
                @media (max-width: 640px) {
                  .kpi-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                  .course-card-dash {
                    flex-direction: row !important;
                  }
                  .course-thumbnail-dash {
                    width: 80px !important;
                    height: 80px !important;
                  }
                }
                @media (min-width: 641px) and (max-width: 1024px) {
                  .kpi-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                }
              `}</style>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>Cursos</h2>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Gestiona y organiza todos tus cursos</p>
                </div>
                <button
                  onClick={() => setShowLegacyMenu(true)}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>+</span>
                  Nuevo Curso
                </button>
              </div>

              <div className="kpi-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '24px'
                  }}>📚</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.25rem' }}>Total Cursos</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{courses.length}</div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '24px'
                  }}>✅</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.25rem' }}>Cursos Activos</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                    {courses.filter(c => c.is_active).length}
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#fed7aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '24px'
                  }}>📝</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.25rem' }}>En Borrador</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                    {courses.filter(c => !c.is_active).length}
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '24px'
                  }}>👥</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.25rem' }}>Total Estudiantes</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{students.length}</div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                  Lista de Cursos
                </h3>
                <select style={{
                  padding: '8px 12px',
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {courses.map((course, index) => {
                  const progress = [75, 60, 45, 30, 20][index % 5];
                  return (
                    <div
                      key={course.id}
                      className="course-card-dash"
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        padding: '1rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s'
                      }}
                      onClick={() => {
                        setSelectedCourseSlug(course.slug);
                        setActiveTab('course-detail');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div
                        className="course-thumbnail-dash"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '8px',
                          background: course.thumbnail
                            ? `url(${course.thumbnail}) center/cover`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {!course.thumbnail && <span style={{ fontSize: '32px' }}>📚</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                          {course.title}
                        </h4>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: course.is_active ? '#d1fae5' : '#fee2e2',
                          color: course.is_active ? '#065f46' : '#991b1b',
                          marginBottom: '0.5rem'
                        }}>
                          {course.is_active ? 'Activo' : 'Borrador'}
                        </span>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: '0.5rem'
                        }}>
                          <span>📚 {course.lessons_count} lecciones</span>
                          <span>👥 {course.students_count || 156} estudiantes</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            background: '#e5e7eb',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${progress}%`,
                              height: '100%',
                              background: '#8b5cf6',
                              borderRadius: '3px'
                            }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{progress}%</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          padding: '0.5rem'
                        }}
                      >
                        ⋮
                      </button>
                    </div>
                  );
                })}
                {courses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📚</div>
                    <p style={{ fontSize: '16px', marginBottom: '1rem' }}>No tienes cursos creados aún</p>
                    <button
                      onClick={() => setShowLegacyMenu(true)}
                      style={{
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

          {activeTab === 'mis-cursos' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Gestiona tus cursos y su contenido.
                  </p>
                </div>
                <button
                  onClick={() => setShowLegacyMenu(true)}
                  style={{
                    background: '#8b5cf6',
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
                  onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  Nuevo Curso
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: 1,
                  minWidth: '250px',
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

              <style>{`
                @media (max-width: 640px) {
                  .course-card {
                    flex-direction: column !important;
                  }
                  .course-card img, .course-card > div:first-child {
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                  .course-actions {
                    width: 100% !important;
                    justify-content: space-between !important;
                  }
                }
              `}</style>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {courses.map(course => (
                  <div
                    key={course.id}
                    className="course-card"
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

                    <div className="course-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                  </div>
                ))}
                {courses.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px' }}>
                    <p style={{ fontSize: '16px', color: '#6b7280' }}>No tienes cursos creados aún</p>
                    <button
                      onClick={() => setShowLegacyMenu(true)}
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

          {activeTab === 'course-detail' && selectedCourseSlug && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '1rem' }}>
                Cargando detalles del curso...
              </p>
              <button
                onClick={() => window.location.href = `/instructor/curso/${selectedCourseSlug}`}
                style={{
                  padding: '12px 24px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Ir a Editar Curso
              </button>
            </div>
          )}
        </main>
      </div>

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
    </div>
  );
}
