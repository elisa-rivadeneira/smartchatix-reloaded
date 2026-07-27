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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: 100
      }}>
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
                width={180}
                height={54}
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
              onClick={() => setActiveTab(item.id)}
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
      <main style={{ flex: 1, overflow: 'auto', background: '#f9fafb' }}>
        {/* Header */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                transition: 'all 0.2s'
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
              {sidebarCollapsed ? '→' : '←'}
            </button>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                {activeTab === 'dashboard' ? 'Dashboard' :
                 activeTab === 'users' ? 'Usuarios' :
                 activeTab === 'courses' ? 'Cursos' :
                 activeTab === 'enrollments' ? 'Inscripciones' :
                 activeTab === 'instructors' ? 'Instructores' :
                 activeTab === 'reports' ? 'Reportes' :
                 'Configuración'}
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Bienvenido de nuevo, {currentUser?.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={{
              padding: '0.625rem 1.25rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📥</span> Exportar
            </button>
            <button style={{
              padding: '0.625rem 1.25rem',
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
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <span>➕</span> Nuevo Curso
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div style={{ padding: '2rem' }}>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
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
                <div key={idx} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: `${kpi.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {kpi.icon}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.625rem',
                      background: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      height: 'fit-content'
                    }}>
                      {kpi.change}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {kpi.title}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              {/* Chart */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                    Progreso de Aprendizaje
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Inscripciones en los últimos 6 meses</p>
                </div>

                {/* Simple Line Chart */}
                <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
                  {[40, 65, 45, 80, 60, 95].map((height, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '100%',
                        height: `${height}%`,
                        background: `linear-gradient(180deg, #8b5cf6 0%, #d946ef 100%)`,
                        borderRadius: '6px 6px 0 0',
                        position: 'relative',
                        transition: 'height 0.3s ease'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-2rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#8b5cf6'
                        }}>
                          {Math.floor(height * 2)}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][idx]}
                      </div>
                    </div>
                  ))}
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

        {/* Other Tabs - Placeholder */}
        {activeTab !== 'dashboard' && (
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
    </div>
  );
}
