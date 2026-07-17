'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  price_vivo: number;
  price_grabado: number;
  is_active: boolean;
  instructor_name: string;
  instructor_id: number | null;
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeStudents: 0
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    slug: '',
    description: '',
    price_vivo: 0,
    price_grabado: 0,
    instructor_id: null as number | null
  });
  const [enrolledStudents, setEnrolledStudents] = useState<number[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
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
      if (data.user.role !== 'admin') {
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
      const [usersRes, coursesRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/stats')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const allUsers = usersData.users || [];
        const studentsList = allUsers.filter((u: User) => u.role === 'student');
        console.log('Total users:', allUsers.length);
        console.log('Students found:', studentsList.length);
        console.log('Students:', studentsList);
        setUsers(allUsers);
        setInstructors(allUsers.filter((u: User) => u.role === 'instructor' || u.role === 'admin') || []);
        setStudents(studentsList);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || stats);
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

  const handleEditCourse = async (course: Course) => {
    setEditingCourse(course);
    setLoadingEnrollments(true);
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/enrollments`);
      if (response.ok) {
        const data = await response.json();
        setEnrolledStudents(data.enrollments?.map((e: any) => e.user_id) || []);
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!editingCourse) return;

    setSaving(true);
    try {
      const updateResponse = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructor_id: editingCourse.instructor_id
        })
      });

      if (!updateResponse.ok) {
        alert('Error al actualizar el curso');
        setSaving(false);
        return;
      }

      const enrollResponse = await fetch(`/api/admin/courses/${editingCourse.id}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_ids: enrolledStudents
        })
      });

      if (enrollResponse.ok) {
        await loadData();
        setEditingCourse(null);
        setEnrolledStudents([]);
      } else {
        alert('Error al actualizar estudiantes');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error al actualizar el curso');
    } finally {
      setSaving(false);
    }
  };

  const toggleStudentEnrollment = (studentId: number) => {
    setEnrolledStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.slug.trim()) {
      alert('Título y slug son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });

      if (response.ok) {
        await loadData();
        setShowNewCourseModal(false);
        setNewCourse({
          title: '',
          slug: '',
          description: '',
          price_vivo: 0,
          price_grabado: 0,
          instructor_id: null
        });
      } else {
        const data = await response.json();
        alert(data.message || 'Error al crear el curso');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear el curso');
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
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
              <button
                onClick={async () => {
                  setUserMenuOpen(false);
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/');
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
          { label: 'Panel Admin' }
        ]}
        grayBackground={true}
      >
        <div style={{ display: 'flex', gap: '32px' }}>
          {['dashboard', 'usuarios', 'cursos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 0',
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
              {tab === 'dashboard' ? 'Dashboard' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </Breadcrumb>

      <main style={{ padding: '32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {[
                { label: 'Total Usuarios', value: stats.totalUsers, icon: '👥', color: '#667eea' },
                { label: 'Cursos Activos', value: stats.totalCourses, icon: '📚', color: '#10b981' },
                { label: 'Inscripciones', value: stats.totalEnrollments, icon: '✓', color: '#f59e0b' },
                { label: 'Estudiantes Activos', value: stats.activeStudents, icon: '🎓', color: '#ef4444' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {stat.label}
                    </p>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${stat.color}20`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: 0
                  }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c',
                margin: 0
              }}>
                Gestión de Usuarios
              </h2>
              <button style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                + Nuevo Usuario
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Fecha Registro', 'Acciones'].map(header => (
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
                  {users.map(user => (
                    <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        {user.id}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c', fontWeight: '500' }}>
                        {user.name || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.role === 'admin' ? '#fef3c7' : user.role === 'instructor' ? '#dbeafe' : '#e0e7ff',
                          color: user.role === 'admin' ? '#92400e' : user.role === 'instructor' ? '#1e40af' : '#3730a3'
                        }}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Estudiante'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.is_active ? '#d1fae5' : '#fee2e2',
                          color: user.is_active ? '#065f46' : '#991b1b'
                        }}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          marginRight: '8px'
                        }}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a202c',
                margin: 0
              }}>
                Gestión de Cursos
              </h2>
              <button
                onClick={() => setShowNewCourseModal(true)}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Nuevo Curso
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['ID', 'Título', 'Slug', 'Instructor', 'Precio Vivo', 'Precio Grabado', 'Estado', 'Acciones'].map(header => (
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
                  {courses.map(course => (
                    <tr key={course.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        {course.id}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c', fontWeight: '500' }}>
                        {course.title}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {course.slug}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {course.instructor_name || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        ${course.price_vivo}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a202c' }}>
                        ${course.price_grabado}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: course.is_active ? '#d1fae5' : '#fee2e2',
                          color: course.is_active ? '#065f46' : '#991b1b'
                        }}>
                          {course.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={() => handleEditCourse(course)}
                          style={{
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editingCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '24px'
            }}>
              Editar Curso
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Título del Curso
              </label>
              <p style={{
                fontSize: '16px',
                color: '#1a202c',
                margin: 0,
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                {editingCourse.title}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Asignar Instructor
              </label>
              <select
                value={editingCourse.instructor_id || ''}
                onChange={(e) => setEditingCourse({
                  ...editingCourse,
                  instructor_id: e.target.value ? parseInt(e.target.value) : null
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1a202c',
                  background: 'white'
                }}
              >
                <option value="">Sin asignar</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name || instructor.email} ({instructor.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Usuarios Inscritos
              </label>
              {loadingEnrollments ? (
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Cargando...</p>
              ) : (
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}>
                  {users.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px' }}>
                      No hay usuarios disponibles
                    </p>
                  ) : (
                    users.map(user => (
                      <label
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          marginBottom: '4px',
                          background: enrolledStudents.includes(user.id) ? '#f0f9ff' : 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={enrolledStudents.includes(user.id)}
                          onChange={() => toggleStudentEnrollment(user.id)}
                          style={{
                            marginRight: '8px',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span style={{ fontSize: '14px', color: '#1a202c' }}>
                            {user.name || user.email}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: user.role === 'admin' ? '#fef3c7' : user.role === 'instructor' ? '#dbeafe' : '#e0e7ff',
                            color: user.role === 'admin' ? '#92400e' : user.role === 'instructor' ? '#1e40af' : '#3730a3'
                          }}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Estudiante'}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setEditingCourse(null)}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: '#374151',
                  opacity: saving ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCourse}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: saving ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewCourseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '24px'
            }}>
              Crear Nuevo Curso
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Título *
              </label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ej: Certificación IA 10X"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Slug *
              </label>
              <input
                type="text"
                value={newCourse.slug}
                onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ej: certificacion-ia-10x"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Descripción
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                placeholder="Describe el curso..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Precio Vivo ($)
                </label>
                <input
                  type="number"
                  value={newCourse.price_vivo}
                  onChange={(e) => setNewCourse({ ...newCourse, price_vivo: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Precio Grabado ($)
                </label>
                <input
                  type="number"
                  value={newCourse.price_grabado}
                  onChange={(e) => setNewCourse({ ...newCourse, price_grabado: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Asignar Instructor
              </label>
              <select
                value={newCourse.instructor_id || ''}
                onChange={(e) => setNewCourse({
                  ...newCourse,
                  instructor_id: e.target.value ? parseInt(e.target.value) : null
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1a202c',
                  background: 'white'
                }}
              >
                <option value="">Sin asignar</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name || instructor.email} ({instructor.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowNewCourseModal(false);
                  setNewCourse({
                    title: '',
                    slug: '',
                    description: '',
                    price_vivo: 0,
                    price_grabado: 0,
                    instructor_id: null
                  });
                }}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: '#374151',
                  opacity: saving ? 0.5 : 1
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: saving ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
              >
                {saving ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
