'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
  thumbnail?: string;
  markdown_image?: string;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  modality: 'vivo' | 'grabado';
  payment_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  enrolled_at: string;
  expires_at: string | null;
  student_name: string;
  student_email: string;
  course_title: string;
  course_slug: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeStudents: 0
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'instructor' | 'admin',
    is_active: true,
    password: ''
  });
  const [userEnrollments, setUserEnrollments] = useState<number[]>([]);
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState<number | null>(null);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'instructor' | 'admin',
    is_active: true
  });
  const [settings, setSettings] = useState({
    show_courses_carousel: true,
    show_currency_selector: true,
    exchange_rate: '3.80'
  });

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
      const [usersRes, coursesRes, statsRes, enrollmentsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/enrollments'),
        fetch('/api/admin/settings')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || stats);
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData.enrollments || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings || settings);
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

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      password: ''
    });

    const userCourses = enrollments
      .filter(e => e.user_id === user.id)
      .map(e => e.course_id);
    setUserEnrollments(userCourses);

    setEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        setEditModalOpen(false);
        setEditingUser(null);
        loadData();
        alert('✅ Usuario actualizado correctamente');
      } else {
        alert('❌ Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('❌ Error al actualizar usuario');
    }
  };

  const handleAddEnrollment = async () => {
    if (!editingUser || !selectedCourseToAdd) return;

    try {
      const response = await fetch('/api/admin/enrollments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: editingUser.id,
          course_id: selectedCourseToAdd,
          modality: 'grabado',
          payment_amount: 0,
          payment_status: 'completed'
        })
      });

      if (response.ok) {
        setUserEnrollments([...userEnrollments, selectedCourseToAdd]);
        setSelectedCourseToAdd(null);
        loadData();
        alert('✅ Inscripción agregada correctamente');
      } else {
        alert('❌ Error al agregar inscripción');
      }
    } catch (error) {
      console.error('Error adding enrollment:', error);
      alert('❌ Error al agregar inscripción');
    }
  };

  const handleRemoveEnrollment = async (courseId: number) => {
    if (!editingUser) return;

    if (!confirm('¿Estás seguro de eliminar esta inscripción?')) return;

    try {
      const response = await fetch('/api/admin/enrollments/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: editingUser.id,
          course_id: courseId
        })
      });

      if (response.ok) {
        setUserEnrollments(userEnrollments.filter(id => id !== courseId));
        loadData();
        alert('✅ Inscripción eliminada correctamente');
      } else {
        alert('❌ Error al eliminar inscripción');
      }
    } catch (error) {
      console.error('Error removing enrollment:', error);
      alert('❌ Error al eliminar inscripción');
    }
  };

  const handleCreateUser = async () => {
    if (!newUserFormData.name || !newUserFormData.email || !newUserFormData.password) {
      alert('⚠️ Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserFormData)
      });

      if (response.ok) {
        setNewUserModalOpen(false);
        setNewUserFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
          is_active: true
        });
        loadData();
        alert('✅ Usuario creado correctamente');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Error al crear usuario'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('❌ Error al crear usuario');
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
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
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
    { id: 'users', icon: '👥', label: 'Usuarios', badge: users.length },
    { id: 'courses', icon: '📚', label: 'Cursos', badge: courses.length },
    { id: 'enrollments', icon: '✅', label: 'Inscripciones', badge: stats.totalEnrollments },
    { id: 'instructors', icon: '👨‍🏫', label: 'Instructores', badge: null },
    { id: 'reports', icon: '📈', label: 'Reportes', badge: null },
    { id: 'settings', icon: '⚙️', label: 'Configuración', badge: null }
  ];

  const recentActivity = [
    { type: 'enrollment', user: 'María García', course: 'Introducción a Python', time: '2 min', icon: '✅', color: '#10b981' },
    { type: 'completion', user: 'Juan Pérez', course: 'React Avanzado', time: '15 min', icon: '🎓', color: '#3b82f6' },
    { type: 'new_user', user: 'Ana Rodríguez', course: 'Registro nuevo', time: '1 hora', icon: '👤', color: '#8b5cf6' },
    { type: 'enrollment', user: 'Carlos López', course: 'Data Science', time: '2 horas', icon: '✅', color: '#10b981' }
  ];

  const topCourses = courses.slice(0, 5).map((course, idx) => ({
    title: course.title,
    students: Math.floor(Math.random() * 150) + 50,
    completion: Math.floor(Math.random() * 40) + 60
  }));

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .mobile-overlay {
            display: ${mobileMenuOpen ? 'block' : 'none'};
          }
          .mobile-sidebar {
            transform: translateX(${mobileMenuOpen ? '0' : '-100%'});
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      <div
        className="mobile-overlay"
        onClick={() => setMobileMenuOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'none'
        }}
      />

      {/* Sidebar */}
      <aside
        className="mobile-sidebar"
        style={{
          width: sidebarCollapsed ? '80px' : '280px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <style>{`
          @media (min-width: 769px) {
            .mobile-sidebar {
              position: relative !important;
            }
          }
        `}</style>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '1.5rem 0' : '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!sidebarCollapsed ? (
            <Link href="/">
              <Image
                src="/images/logo_smartchatix_horiz.png"
                alt="SmartChatix"
                width={200}
                height={34}
                style={{ cursor: 'pointer' }}
              />
            </Link>
          ) : (
            <Link href="/">
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'pointer'
              }}>
                S
              </div>
            </Link>
          )}
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                padding: sidebarCollapsed ? '1rem 0.5rem' : '0.875rem 1rem',
                marginBottom: '0.25rem',
                background: activeTab === item.id ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === item.id ? '#111827' : '#6b7280',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.badge !== null && (
                <span style={{
                  background: activeTab === item.id ? '#8b5cf6' : '#e5e7eb',
                  color: activeTab === item.id ? '#fff' : '#6b7280',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {currentUser?.name || 'Admin'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Administrador</div>
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '1rem',
              right: '1rem',
              marginBottom: '0.5rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => router.push('/perfil')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>👤</span> Mi perfil
              </button>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px solid #e5e7eb',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        background: '#f9fafb',
        marginLeft: 0,
      }}>
        <style>{`
          @media (min-width: 769px) {
            main {
              margin-left: ${sidebarCollapsed ? '80px' : '280px'} !important;
            }
          }
        `}</style>

        {/* Header */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Botón Hamburguesa (Mobile) */}
            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                fontSize: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <style>{`
                @media (min-width: 769px) {
                  .mobile-hamburger {
                    display: none !important;
                  }
                }
              `}</style>
              ☰
            </button>

            {/* Botón Collapse Desktop */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="desktop-collapse-btn"
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                fontSize: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <style>{`
                @media (min-width: 769px) {
                  .desktop-collapse-btn {
                    display: flex !important;
                  }
                }
              `}</style>
              {sidebarCollapsed ? '→' : '←'}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.25rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {activeTab === 'dashboard' ? 'Dashboard' :
                 activeTab === 'users' ? 'Usuarios' :
                 activeTab === 'courses' ? 'Cursos' :
                 activeTab === 'enrollments' ? 'Inscripciones' :
                 activeTab === 'instructors' ? 'Instructores' :
                 activeTab === 'reports' ? 'Reportes' :
                 'Configuración'}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                display: 'none'
              }}>
                <style>{`
                  @media (min-width: 640px) {
                    p {
                      display: block !important;
                    }
                  }
                `}</style>
                Bienvenido de nuevo, {currentUser?.name}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            {/* Notificaciones */}
            <button style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              🔔
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid #fff'
              }}></span>
            </button>

            {/* Botón Exportar - Solo desktop */}
            <button className="export-btn" style={{
              padding: '0.625rem 1rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              <style>{`
                @media (min-width: 640px) {
                  .export-btn {
                    display: flex !important;
                  }
                }
              `}</style>
              <span>📥</span> <span className="export-text">Exportar</span>
            </button>

            {/* Botón Principal - Responsive */}
            <button
              onClick={() => {
                if (activeTab === 'users') {
                  setNewUserFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'student',
                    is_active: true
                  });
                  setNewUserModalOpen(true);
                }
              }}
              style={{
                padding: '0.625rem 1rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>➕</span>
              <span className="btn-text" style={{ display: 'none' }}>
                <style>{`
                  @media (min-width: 640px) {
                    .btn-text {
                      display: inline !important;
                    }
                  }
                `}</style>
                {activeTab === 'users' ? 'Nuevo Usuario' : 'Nuevo Curso'}
              </span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .dashboard-content {
                  padding: 2rem !important;
                }
              }
            `}</style>
            {/* KPI Cards */}
            <div className="kpi-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <style>{`
                @media (min-width: 768px) {
                  .kpi-grid {
                    grid-template-columns: repeat(4, 1fr) !important;
                  }
                }
                @media (min-width: 640px) {
                  .kpi-grid {
                    gap: 1.5rem !important;
                    margin-bottom: 2rem !important;
                  }
                }
              `}</style>
              {[
                {
                  title: 'Total Usuarios',
                  value: stats.totalUsers,
                  change: '+12.5%',
                  trend: 'up',
                  icon: '👥',
                  color: '#8b5cf6'
                },
                {
                  title: 'Cursos Activos',
                  value: stats.totalCourses,
                  change: '+8.2%',
                  trend: 'up',
                  icon: '📚',
                  color: '#3b82f6'
                },
                {
                  title: 'Inscripciones',
                  value: stats.totalEnrollments,
                  change: '+23.1%',
                  trend: 'up',
                  icon: '✅',
                  color: '#10b981'
                },
                {
                  title: 'Tasa Finalización',
                  value: '68%',
                  change: '+5.4%',
                  trend: 'up',
                  icon: '🎯',
                  color: '#f59e0b'
                }
              ].map((kpi, idx) => (
                <div key={idx} className="kpi-card" style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <style>{`
                    @media (min-width: 640px) {
                      .kpi-card {
                        padding: 1.5rem !important;
                      }
                    }
                  `}</style>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div className="kpi-icon" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${kpi.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      <style>{`
                        @media (min-width: 640px) {
                          .kpi-icon {
                            width: 48px !important;
                            height: 48px !important;
                            font-size: 24px !important;
                          }
                        }
                      `}</style>
                      {kpi.icon}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      background: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      height: 'fit-content'
                    }}>
                      <style>{`
                        @media (min-width: 640px) {
                          .kpi-badge {
                            font-size: 12px !important;
                            padding: 0.25rem 0.625rem !important;
                          }
                        }
                      `}</style>
                      {kpi.change}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '0.5rem' }}>
                    <style>{`
                      @media (min-width: 640px) {
                        .kpi-title {
                          font-size: 14px !important;
                        }
                      }
                    `}</style>
                    {kpi.title}
                  </div>
                  <div className="kpi-value" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                    <style>{`
                      @media (min-width: 640px) {
                        .kpi-value {
                          font-size: 2rem !important;
                        }
                      }
                    `}</style>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    <style>{`
                      @media (min-width: 640px) {
                        .kpi-subtitle {
                          font-size: 13px !important;
                        }
                      }
                    `}</style>
                    vs mes anterior
                  </div>
                </div>
              ))}
            </div>

            <div className="charts-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              <style>{`
                @media (min-width: 1024px) {
                  .charts-grid {
                    grid-template-columns: 2fr 1fr !important;
                    gap: 1.5rem !important;
                  }
                }
              `}</style>
              {/* Chart */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                <style>{`
                  @media (min-width: 640px) {
                    .chart-container {
                      padding: 1.5rem !important;
                    }
                  }
                `}</style>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                    Progreso de Aprendizaje
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Inscripciones en los últimos 6 meses</p>
                </div>

                {/* Line Chart */}
                <div style={{ position: 'relative', height: '338px', padding: '1rem 0.5rem' }}>
                  {/* Legend */}
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '1rem',
                    justifyContent: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#3b82f6'
                      }}></div>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>📈 Estudiantes inscritos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#8b5cf6'
                      }}></div>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>📊 Cursos completados</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0' }}>
                    {/* Eje Y izquierdo (Estudiantes) */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '0.5rem', paddingBottom: '1.5rem', paddingRight: '0.25rem' }}>
                      {[200, 150, 100, 50, 0].map((val, idx) => (
                        <div key={idx} style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '500', textAlign: 'right', width: '30px' }}>
                          {val}
                        </div>
                      ))}
                    </div>

                    {/* SVG Chart */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <svg width="100%" height="200" viewBox="0 0 700 180" preserveAspectRatio="none" style={{ display: 'block' }}>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 40}
                        x2="700"
                        y2={i * 40}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}

                    {/* Area bajo línea azul (Estudiantes) - Quincenal Ene-Jul */}
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.15 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.02 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,120 L 50,110 L 100,115 L 150,100 L 200,95 L 250,105 L 300,90 L 350,85 L 400,95 L 450,80 L 500,75 L 550,85 L 600,70 L 650,75 L 700,60 L 700,160 L 0,160 Z"
                      fill="url(#blueGradient)"
                    />

                    {/* Línea Azul (Estudiantes inscritos) */}
                    <path
                      d="M 0,120 L 50,110 L 100,115 L 150,100 L 200,95 L 250,105 L 300,90 L 350,85 L 400,95 L 450,80 L 500,75 L 550,85 L 600,70 L 650,75 L 700,60"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Puntos línea azul - Quincenal (2 por mes, 7 meses = 15 puntos) */}
                    {[
                      { x: 0, y: 120 },    // Ene 1
                      { x: 50, y: 110 },   // Ene 15 - sube
                      { x: 100, y: 115 },  // Feb 1 - baja leve
                      { x: 150, y: 100 },  // Feb 15 - sube fuerte
                      { x: 200, y: 95 },   // Mar 1 - sube
                      { x: 250, y: 105 },  // Mar 15 - baja
                      { x: 300, y: 90 },   // Abr 1 - sube fuerte
                      { x: 350, y: 85 },   // Abr 15 - sube
                      { x: 400, y: 95 },   // May 1 - baja
                      { x: 450, y: 80 },   // May 15 - sube fuerte
                      { x: 500, y: 75 },   // Jun 1 - sube
                      { x: 550, y: 85 },   // Jun 15 - baja
                      { x: 600, y: 70 },   // Jul 1 - sube fuerte
                      { x: 650, y: 75 },   // Jul 15 - baja leve
                      { x: 700, y: 60 }    // Jul 31 - sube fuerte (tendencia positiva)
                    ].map((point, idx) => (
                      <g key={`blue-${idx}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="2"
                          fill="#fff"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    ))}

                    {/* Area bajo línea morada (Cursos completados) */}
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.15 }} />
                        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.02 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,135 L 50,140 L 100,130 L 150,135 L 200,125 L 250,130 L 300,120 L 350,125 L 400,115 L 450,120 L 500,110 L 550,108 L 600,105 L 650,100 L 700,95 L 700,160 L 0,160 Z"
                      fill="url(#purpleGradient)"
                    />

                    {/* Línea Morada (Cursos completados) */}
                    <path
                      d="M 0,135 L 50,140 L 100,130 L 150,135 L 200,125 L 250,130 L 300,120 L 350,125 L 400,115 L 450,120 L 500,110 L 550,108 L 600,105 L 650,100 L 700,95"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Puntos línea morada - Quincenal */}
                    {[
                      { x: 0, y: 135 },    // Ene 1
                      { x: 50, y: 140 },   // Ene 15 - baja
                      { x: 100, y: 130 },  // Feb 1 - sube
                      { x: 150, y: 135 },  // Feb 15 - baja
                      { x: 200, y: 125 },  // Mar 1 - sube
                      { x: 250, y: 130 },  // Mar 15 - baja
                      { x: 300, y: 120 },  // Abr 1 - sube
                      { x: 350, y: 125 },  // Abr 15 - baja
                      { x: 400, y: 115 },  // May 1 - sube
                      { x: 450, y: 120 },  // May 15 - baja
                      { x: 500, y: 110 },  // Jun 1 - sube
                      { x: 550, y: 108 },  // Jun 15 - sube leve
                      { x: 600, y: 105 },  // Jul 1 - sube
                      { x: 650, y: 100 },  // Jul 15 - sube
                      { x: 700, y: 95 }    // Jul 31 - sube (tendencia positiva más suave)
                    ].map((point, idx) => (
                      <g key={`purple-${idx}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="2"
                          fill="#fff"
                          stroke="#8b5cf6"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    ))}
                      </svg>

                      {/* Labels de meses - Alineados al centro de cada mes */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        marginTop: '0.5rem'
                      }}>
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'].map((month, idx) => (
                          <div key={idx} style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            textAlign: 'center'
                          }}>
                            {month}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eje Y derecho (Cursos completados) */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '0.5rem', paddingBottom: '1.5rem' }}>
                      {[100, 75, 50, 25, 0].map((val, idx) => (
                        <div key={idx} style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: '500', textAlign: 'left', width: '30px' }}>
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                  Actividad Reciente
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `${activity.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        {activity.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.125rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {activity.user}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {activity.course}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '0.25rem' }}>
                          Hace {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                Cursos Más Populares
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topCourses.map((course, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: '#f9fafb'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'][idx]} 0%, ${['#d946ef', '#1d4ed8', '#059669', '#d97706', '#c026d3'][idx]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        {course.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {course.students} estudiantes
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', marginBottom: '0.25rem' }}>
                        {course.completion}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>Finalización</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .users-content {
                  padding: 2rem !important;
                }
              }
              @media (max-width: 768px) {
                .users-table {
                  display: none !important;
                }
              }
              @media (min-width: 769px) {
                .users-cards {
                  display: none !important;
                }
              }
            `}</style>

            {/* Barra de búsqueda y filtros */}
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
                  placeholder="Buscar usuarios..."
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
                fontSize: '18px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                ⚙️
              </button>
            </div>

            {/* Contador de usuarios */}
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              {(() => {
                const filteredUsers = users.filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.role.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return `${filteredUsers.length} usuario${filteredUsers.length !== 1 ? 's' : ''} encontrado${filteredUsers.length !== 1 ? 's' : ''}`;
              })()}
            </div>

            {/* Vista de tarjetas (Mobile) */}
            <div className="users-cards" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleEditUser(user)}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: user.role === 'admin' ? '#fef3c7' : user.role === 'instructor' ? '#dbeafe' : '#dcfce7',
                      color: user.role === 'admin' ? '#92400e' : user.role === 'instructor' ? '#1e40af' : '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginBottom: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.email}
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.role === 'admin' ? '#fef3c7' : user.role === 'instructor' ? '#dbeafe' : '#dcfce7',
                          color: user.role === 'admin' ? '#92400e' : user.role === 'instructor' ? '#1e40af' : '#166534'
                        }}>
                          {user.role === 'admin' ? 'Administrador' : user.role === 'instructor' ? 'Instructor' : 'Estudiante'}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.is_active ? '#dcfce7' : '#fee2e2',
                          color: user.is_active ? '#166534' : '#991b1b'
                        }}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Fecha */}
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        📅 {new Date(user.created_at).toLocaleDateString('es-PE')}
                      </div>
                    </div>

                    {/* Botón menú y flecha */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
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
                      <div style={{
                        color: '#9ca3af',
                        fontSize: '18px'
                      }}>
                        ›
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mensaje sin resultados */}
              {users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    No se encontraron usuarios
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}
            </div>

            {/* Vista de tabla (Desktop) */}
            <div className="users-table" style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Nombre</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Rol</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Fecha Registro</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(user =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.role.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>#{user.id}</td>
                        <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{user.name}</td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>{user.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: user.role === 'admin' ? '#fef3c7' : user.role === 'instructor' ? '#dbeafe' : '#dcfce7',
                            color: user.role === 'admin' ? '#92400e' : user.role === 'instructor' ? '#1e40af' : '#166534'
                          }}>
                            {user.role === 'admin' ? 'Administrador' : user.role === 'instructor' ? 'Instructor' : 'Estudiante'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: user.is_active ? '#dcfce7' : '#fee2e2',
                            color: user.is_active ? '#166534' : '#991b1b'
                          }}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>
                          {new Date(user.created_at).toLocaleDateString('es-PE')}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => handleEditUser(user)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#3b82f6',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            ✏️ Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mensaje sin resultados - Desktop */}
              {users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    No se encontraron usuarios
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .courses-content {
                  padding: 2rem !important;
                }
              }
            `}</style>

            {/* Barra de búsqueda y filtros */}
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

            {/* Tarjetas de estadísticas */}
            <div className="kpi-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <style>{`
                @media (min-width: 768px) {
                  .courses-kpi-grid {
                    grid-template-columns: repeat(4, 1fr) !important;
                  }
                }
              `}</style>
              {[
                {
                  title: 'Total Cursos',
                  value: courses.length,
                  change: '+8.2%',
                  icon: '📚',
                  color: '#8b5cf6'
                },
                {
                  title: 'Cursos Activos',
                  value: courses.filter(c => c.is_active).length,
                  change: '+12.5%',
                  icon: '✅',
                  color: '#10b981'
                },
                {
                  title: 'En Borrador',
                  value: courses.filter(c => !c.is_active).length,
                  change: '+5.4%',
                  icon: '🕐',
                  color: '#f59e0b'
                },
                {
                  title: 'Total Estudiantes',
                  value: enrollments.length,
                  change: '+18.7%',
                  icon: '👥',
                  color: '#3b82f6'
                }
              ].map((kpi, idx) => (
                <div key={idx} className="kpi-card" style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div className="kpi-icon" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${kpi.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      {kpi.icon}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      background: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      height: 'fit-content'
                    }}>
                      {kpi.change}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {kpi.title}
                  </div>
                  <div className="kpi-value" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Header de lista */}
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

            {/* Vista de tarjetas (Mobile y Desktop) */}
            <div className="courses-cards" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {courses.map((course) => {
                const studentsCount = enrollments.filter(e => e.course_id === course.id).length;
                const completionPercentage = Math.floor(Math.random() * 100);

                return (
                  <div
                    key={course.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
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
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {/* Imagen del curso */}
                      <div style={{
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

                      {/* Info del curso */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#111827',
                              margin: '0 0 0.25rem 0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {course.title}
                            </h4>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: course.is_active ? '#dcfce7' : '#fef3c7',
                              color: course.is_active ? '#166534' : '#92400e'
                            }}>
                              {course.is_active ? 'Activo' : 'Borrador'}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '20px',
                              color: '#9ca3af',
                              padding: '0.25rem',
                              flexShrink: 0,
                              marginLeft: '0.5rem'
                            }}
                          >
                            ⋮
                          </button>
                        </div>

                        {/* Estadísticas */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: '0.75rem',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            📄 {Math.floor(Math.random() * 30) + 10} lecciones
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ⏱️ {Math.floor(Math.random() * 5) + 1}h {Math.floor(Math.random() * 60)}m
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            👥 {studentsCount} estudiantes
                          </div>
                        </div>

                        {/* Barra de progreso */}
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
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Instructors Tab */}
        {activeTab === 'instructors' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .instructors-content {
                  padding: 2rem !important;
                }
              }
            `}</style>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Nombre</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Cursos Asignados</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'instructor').map((instructor) => {
                      const coursesCount = courses.filter(c => c.instructor_id === instructor.id).length;
                      return (
                        <tr key={instructor.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>#{instructor.id}</td>
                          <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{instructor.name}</td>
                          <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>{instructor.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: '#dbeafe',
                              color: '#1e40af'
                            }}>
                              {coursesCount} {coursesCount === 1 ? 'curso' : 'cursos'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: instructor.is_active ? '#dcfce7' : '#fee2e2',
                              color: instructor.is_active ? '#166534' : '#991b1b'
                            }}>
                              {instructor.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>
                            {new Date(instructor.created_at).toLocaleDateString('es-PE')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .enrollments-content {
                  padding: 2rem !important;
                }
              }
              @media (max-width: 768px) {
                .enrollments-table {
                  display: none !important;
                }
              }
              @media (min-width: 769px) {
                .enrollments-cards {
                  display: none !important;
                }
              }
            `}</style>

            {/* Barra de búsqueda */}
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
                  placeholder="Buscar inscripciones..."
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
            </div>

            {/* Contador */}
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              {enrollments.length} inscripción{enrollments.length !== 1 ? 'es' : ''} encontrada{enrollments.length !== 1 ? 's' : ''}
            </div>

            {/* Vista de tarjetas (Mobile) */}
            <div className="enrollments-cards" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1rem',
                    transition: 'all 0.2s'
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
                  {/* Header: Estudiante y monto */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {enrollment.student_name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {enrollment.student_email}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#111827',
                      marginLeft: '1rem',
                      flexShrink: 0
                    }}>
                      S/ {enrollment.payment_amount}
                    </div>
                  </div>

                  {/* Curso */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    📚 {enrollment.course_title}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: enrollment.modality === 'vivo' ? '#fef3c7' : '#dbeafe',
                      color: enrollment.modality === 'vivo' ? '#92400e' : '#1e40af'
                    }}>
                      {enrollment.modality === 'vivo' ? '🎥 En Vivo' : '📹 Grabado'}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: enrollment.payment_status === 'completed' ? '#dcfce7' : enrollment.payment_status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: enrollment.payment_status === 'completed' ? '#166534' : enrollment.payment_status === 'pending' ? '#92400e' : '#991b1b'
                    }}>
                      {enrollment.payment_status === 'completed' ? '✅ Pagado' : enrollment.payment_status === 'pending' ? '⏳ Pendiente' : '❌ Fallido'}
                    </span>
                  </div>

                  {/* Fecha */}
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    📅 {new Date(enrollment.enrolled_at).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}

              {/* Mensaje sin inscripciones */}
              {enrollments.length === 0 && (
                <div style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    No hay inscripciones
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    Las inscripciones aparecerán aquí
                  </p>
                </div>
              )}
            </div>

            {/* Vista de tabla (Desktop) */}
            <div className="enrollments-table" style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Estudiante</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Curso</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Modalidad</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Monto</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Estado Pago</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Fecha Inscripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>#{enrollment.id}</td>
                        <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                          {enrollment.student_name}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>
                          {enrollment.student_email}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>
                          {enrollment.course_title}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: enrollment.modality === 'vivo' ? '#fef3c7' : '#dbeafe',
                            color: enrollment.modality === 'vivo' ? '#92400e' : '#1e40af'
                          }}>
                            {enrollment.modality === 'vivo' ? 'En Vivo' : 'Grabado'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                          S/ {enrollment.payment_amount}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: enrollment.payment_status === 'completed' ? '#dcfce7' : enrollment.payment_status === 'pending' ? '#fef3c7' : '#fee2e2',
                            color: enrollment.payment_status === 'completed' ? '#166534' : enrollment.payment_status === 'pending' ? '#92400e' : '#991b1b'
                          }}>
                            {enrollment.payment_status === 'completed' ? 'Pagado' : enrollment.payment_status === 'pending' ? 'Pendiente' : 'Fallido'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>
                          {new Date(enrollment.enrolled_at).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {enrollments.length === 0 && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <p style={{ fontSize: '14px' }}>No hay inscripciones registradas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ padding: '1rem' }}>
            <style>{`
              @media (min-width: 640px) {
                .settings-content {
                  padding: 2rem !important;
                }
              }
            `}</style>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
                ⚙️ Configuración del Sitio
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  padding: '1.5rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        Mostrar carrusel de cursos
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Muestra el carrusel "Explora más cursos" en la página principal
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                      <input
                        type="checkbox"
                        checked={settings.show_courses_carousel}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings({ ...settings, show_courses_carousel: newValue });
                          await fetch('/api/admin/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ setting_key: 'show_courses_carousel', setting_value: newValue })
                          });
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: settings.show_courses_carousel ? '#8b5cf6' : '#d1d5db',
                        borderRadius: '28px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '20px',
                          width: '20px',
                          left: settings.show_courses_carousel ? '28px' : '4px',
                          bottom: '4px',
                          background: '#fff',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                        Selector de moneda (USD/PEN)
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        Muestra botones en el header para cambiar entre dólares y soles manualmente
                      </p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                      <input
                        type="checkbox"
                        checked={settings.show_currency_selector}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setSettings({ ...settings, show_currency_selector: newValue });
                          await fetch('/api/admin/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ setting_key: 'show_currency_selector', setting_value: newValue })
                          });
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: settings.show_currency_selector ? '#8b5cf6' : '#d1d5db',
                        borderRadius: '28px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '20px',
                          width: '20px',
                          left: settings.show_currency_selector ? '28px' : '4px',
                          bottom: '4px',
                          background: '#fff',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }}></span>
                      </span>
                    </label>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    Tipo de cambio USD → PEN
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.exchange_rate}
                      onChange={(e) => setSettings({ ...settings, exchange_rate: e.target.value })}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        width: '120px'
                      }}
                    />
                    <button
                      onClick={async () => {
                        await fetch('/api/admin/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ setting_key: 'exchange_rate', setting_value: settings.exchange_rate })
                        });
                        alert('✅ Tipo de cambio actualizado');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '0.5rem' }}>
                    1 USD = {settings.exchange_rate} PEN
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs - Placeholder */}
        {!['dashboard', 'users', 'courses', 'instructors', 'enrollments', 'settings'].includes(activeTab) && (
          <div style={{
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                En construcción
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Esta sección estará disponible próximamente
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Edición de Usuario */}
      {editModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setEditModalOpen(false)}
        >
          <div
            className="modal-inner"
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @media (min-width: 640px) {
                .modal-inner {
                  padding: 1.5rem !important;
                }
              }
            `}</style>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              <style>{`
                @media (min-width: 640px) {
                  .modal-title {
                    font-size: 1.5rem !important;
                    margin-bottom: 1.5rem !important;
                  }
                }
              `}</style>
              ✏️ Editar Usuario
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
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
                  Rol
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value as 'student' | 'instructor' | 'admin' }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
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
                  Nueva Contraseña (opcional)
                </label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Dejar vacío para mantener contraseña actual"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '0.5rem',
                  marginBottom: 0
                }}>
                  Solo completa este campo si deseas cambiar la contraseña del usuario
                </p>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  <input
                    type="checkbox"
                    checked={editFormData.is_active}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  📚 Cursos Inscritos
                </h3>

                {userEnrollments.length > 0 ? (
                  <div style={{ marginBottom: '1rem' }}>
                    {userEnrollments.map(courseId => {
                      const course = courses.find(c => c.id === courseId);
                      return (
                        <div key={courseId} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: '#f9fafb',
                          borderRadius: '6px',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                            {course?.title || 'Curso desconocido'}
                          </span>
                          <button
                            onClick={() => handleRemoveEnrollment(courseId)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Eliminar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1rem' }}>
                    No hay inscripciones
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <select
                    value={selectedCourseToAdd || ''}
                    onChange={(e) => setSelectedCourseToAdd(parseInt(e.target.value) || null)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Seleccionar curso...</option>
                    {courses
                      .filter(c => !userEnrollments.includes(c.id))
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))
                    }
                  </select>
                  <button
                    onClick={handleAddEnrollment}
                    disabled={!selectedCourseToAdd}
                    style={{
                      padding: '0.75rem 1rem',
                      background: selectedCourseToAdd ? '#10b981' : '#9ca3af',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: selectedCourseToAdd ? 'pointer' : 'not-allowed',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ➕ Agregar
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setEditModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#fff',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateUser}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾 Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Usuario */}
      {newUserModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setNewUserModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @media (min-width: 640px) {
                .modal-content {
                  padding: 2rem !important;
                }
              }
              @media (max-width: 480px) {
                .modal-inner {
                  padding: 1rem !important;
                }
              }
            `}</style>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              ➕ Nuevo Usuario
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Nombre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoComplete="off"
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
                  Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, email: e.target.value }))}
                  autoComplete="off"
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
                  Contraseña <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="password"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, password: e.target.value }))}
                  autoComplete="new-password"
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
                  Rol
                </label>
                <select
                  value={newUserFormData.role}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, role: e.target.value as 'student' | 'instructor' | 'admin' }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  <input
                    type="checkbox"
                    checked={newUserFormData.is_active}
                    onChange={(e) => setNewUserFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setNewUserModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#fff',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateUser}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ➕ Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
