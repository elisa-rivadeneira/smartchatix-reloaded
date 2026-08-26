'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface Course {
  id: number;
  title: string;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
}

export default function AdminUsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'instructor' | 'admin',
    is_active: true,
    password: ''
  });
  const [newUserFormData, setNewUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'instructor' | 'admin',
    is_active: true
  });
  const [userEnrollments, setUserEnrollments] = useState<number[]>([]);
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState<number | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [enrollmentEmailData, setEnrollmentEmailData] = useState<{
    user: { id: number; email: string; name: string } | null;
    course: { id: number; title: string; slug: string; emailTemplate?: string } | null;
    hasPassword: boolean;
  }>({ user: null, course: null, hasPassword: true });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/enrollments')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

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

  const handleDeleteUser = async () => {
    if (!editingUser) return;

    const confirmDelete = window.confirm(
      `⚠️ ¿Estás seguro de que deseas eliminar al usuario "${editingUser.name}"?\n\n` +
      `Esta acción NO se puede deshacer y eliminará:\n` +
      `• El usuario y toda su información\n` +
      `• Todas sus inscripciones a cursos\n` +
      `• Todo su progreso y calificaciones\n\n` +
      `¿Deseas continuar?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEditModalOpen(false);
        setEditingUser(null);
        loadData();
        alert('✅ Usuario eliminado correctamente');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Error al eliminar usuario'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Error al eliminar usuario');
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
        const data = await response.json();
        setUserEnrollments([...userEnrollments, selectedCourseToAdd]);
        setSelectedCourseToAdd(null);
        loadData();

        if (data.user && data.course) {
          setEnrollmentEmailData({
            user: data.user,
            course: data.course,
            hasPassword: data.hasPassword || false
          });
          setShowEmailModal(true);
        } else {
          alert('✅ Inscripción agregada correctamente');
        }
      } else {
        alert('❌ Error al agregar inscripción');
      }
    } catch (error) {
      console.error('Error adding enrollment:', error);
      alert('❌ Error al agregar inscripción');
    }
  };

  const handleSendWelcomeEmail = async () => {
    if (!enrollmentEmailData.user || !enrollmentEmailData.course) return;

    setSendingEmail(true);
    try {
      const tempPassword = Math.random().toString(36).slice(-8);

      const updatePasswordResponse = await fetch(`/api/admin/users/${enrollmentEmailData.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: tempPassword
        })
      });

      if (!updatePasswordResponse.ok) {
        alert('❌ Error al generar contraseña');
        setSendingEmail(false);
        return;
      }

      const response = await fetch('/api/email/send-purchase-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: enrollmentEmailData.user.email,
          name: enrollmentEmailData.user.name,
          courseTitle: enrollmentEmailData.course.title,
          modality: 'grabado',
          amount: 0,
          password: tempPassword,
          isNewUser: true,
          emailConfirmationTemplate: enrollmentEmailData.course.emailTemplate || ''
        })
      });

      if (response.ok) {
        alert('✅ Email de bienvenida enviado correctamente con contraseña temporal');
        setShowEmailModal(false);
      } else {
        alert('❌ Error al enviar email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Error al enviar email');
    } finally {
      setSendingEmail(false);
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
      <style>{`
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          👥 Usuarios
        </h2>
        <button
          onClick={() => {
            setNewUserFormData({
              name: '',
              email: '',
              password: '',
              role: 'student',
              is_active: true
            });
            setNewUserModalOpen(true);
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ➕ Nuevo Usuario
        </button>
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

      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '1rem'
      }}>
        {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
      </div>

      <div className="users-cards" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {filteredUsers.map((user) => (
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

        {filteredUsers.length === 0 && (
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
              {filteredUsers.map((user) => (
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

        {filteredUsers.length === 0 && (
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
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditModalOpen(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                lineHeight: 1,
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingRight: '1.5rem'
            }}>
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
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid #fee2e2'
              }}>
                <button
                  onClick={handleDeleteUser}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.5rem',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  🗑️ Eliminar Usuario
                </button>
                <p style={{
                  fontSize: '12px',
                  color: '#991b1b',
                  marginTop: '0.5rem',
                  marginBottom: 0,
                  textAlign: 'center'
                }}>
                  ⚠️ Esta acción no se puede deshacer
                </p>
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
              position: 'relative',
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setNewUserModalOpen(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                lineHeight: 1,
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingRight: '1.5rem'
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
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de email */}
      {showEmailModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setShowEmailModal(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                lineHeight: 1,
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#003366',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📧 Enviar Email de Bienvenida
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#5F6368',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              ¿Deseas enviar un email de bienvenida al curso a <strong>{enrollmentEmailData.user?.name}</strong>?
            </p>

            <div style={{
              background: '#F8F9FA',
              borderLeft: '4px solid #FF6600',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#5F6368' }}>
                <strong>Usuario:</strong> {enrollmentEmailData.user?.email}<br/>
                <strong>Curso:</strong> {enrollmentEmailData.course?.title}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowEmailModal(false)}
                disabled={sendingEmail}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#5F6368',
                  border: '2px solid #E8EAED',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: sendingEmail ? 'not-allowed' : 'pointer',
                  opacity: sendingEmail ? 0.5 : 1
                }}
              >
                No, gracias
              </button>
              <button
                onClick={handleSendWelcomeEmail}
                disabled={sendingEmail}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: sendingEmail ? '#9AA0A6' : 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: sendingEmail ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)'
                }}
              >
                {sendingEmail ? '📧 Enviando...' : '✅ Sí, enviar email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
