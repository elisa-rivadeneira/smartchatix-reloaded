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
  instructor_id: number;
  title: string;
}

interface Enrollment {
  user_id: number;
  course_id: number;
}

export default function AdminInstructorsSection() {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'instructor' as 'student' | 'instructor' | 'admin',
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
    role: 'instructor' as 'student' | 'instructor' | 'admin',
    is_active: true
  });
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({ open: false, userId: null, userName: '' });
  const [messageModal, setMessageModal] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });

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
        const data = await usersRes.json();
        setInstructors((data.users || []).filter((u: User) => u.role === 'instructor'));
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.courses || []);
      }

      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
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
        setMessageModal({ open: true, type: 'success', message: 'Instructor actualizado correctamente' });
      } else {
        setMessageModal({ open: true, type: 'error', message: 'Error al actualizar instructor' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessageModal({ open: true, type: 'error', message: 'Error al actualizar instructor' });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEditModalOpen(false);
        setEditingUser(null);
        setConfirmDeleteModal({ open: false, userId: null, userName: '' });
        loadData();
        setMessageModal({ open: true, type: 'success', message: 'Instructor eliminado correctamente' });
      } else {
        setMessageModal({ open: true, type: 'error', message: 'Error al eliminar instructor' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessageModal({ open: true, type: 'error', message: 'Error al eliminar instructor' });
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserFormData)
      });

      if (response.ok) {
        setNewUserModalOpen(false);
        setNewUserFormData({ name: '', email: '', password: '', role: 'instructor', is_active: true });
        loadData();
        setMessageModal({ open: true, type: 'success', message: 'Instructor creado correctamente' });
      } else {
        const data = await response.json();
        setMessageModal({ open: true, type: 'error', message: data.error || 'Error al crear instructor' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessageModal({ open: true, type: 'error', message: 'Error al crear instructor' });
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
          modality: 'grabado'
        })
      });

      if (response.ok) {
        setUserEnrollments([...userEnrollments, selectedCourseToAdd]);
        setSelectedCourseToAdd(null);
        setMessageModal({ open: true, type: 'success', message: 'Curso agregado correctamente' });
      } else {
        setMessageModal({ open: true, type: 'error', message: 'Error al agregar curso' });
      }
    } catch (error) {
      setMessageModal({ open: true, type: 'error', message: 'Error al agregar curso' });
    }
  };

  const handleRemoveEnrollment = async (courseId: number) => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/admin/enrollments/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: editingUser.id,
          course_id: courseId
        })
      });

      if (response.ok) {
        setUserEnrollments(userEnrollments.filter(id => id !== courseId));
        setMessageModal({ open: true, type: 'success', message: 'Curso eliminado correctamente' });
      } else {
        setMessageModal({ open: true, type: 'error', message: 'Error al eliminar curso' });
      }
    } catch (error) {
      setMessageModal({ open: true, type: 'error', message: 'Error al eliminar curso' });
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          👨‍🏫 Instructores
        </h2>
        <button
          onClick={() => {
            setNewUserFormData({ name: '', email: '', password: '', role: 'instructor', is_active: true });
            setNewUserModalOpen(true);
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>+</span> Nuevo Instructor
        </button>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Cursos Asignados</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Fecha Registro</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => {
                const coursesCount = courses.filter(c => c.instructor_id === instructor.id).length;
                return (
                  <tr key={instructor.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>#{instructor.id}</td>
                    <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{instructor.name}</td>
                    <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>{instructor.email}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
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
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
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
                    <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
                      {new Date(instructor.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEditUser(instructor)}
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
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {instructors.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👨‍🏫</div>
            <p>No hay instructores registrados.</p>
            <p style={{ fontSize: '14px' }}>Haz click en "Nuevo Instructor" para agregar uno.</p>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editModalOpen && (
        <div
          onClick={() => setEditModalOpen(false)}
          style={{
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              ✏️ Editar Instructor
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
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
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
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

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={selectedCourseToAdd || ''}
                    onChange={(e) => setSelectedCourseToAdd(parseInt(e.target.value) || null)}
                    style={{
                      flex: 1,
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
                justifyContent: 'space-between'
              }}>
                <button
                  onClick={() => {
                    if (editingUser) {
                      setConfirmDeleteModal({
                        open: true,
                        userId: editingUser.id,
                        userName: editingUser.name
                      });
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Eliminar
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
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
        </div>
      )}

      {/* Modal de Nuevo Instructor */}
      {newUserModalOpen && (
        <div
          onClick={() => setNewUserModalOpen(false)}
          style={{
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>
              ➕ Nuevo Instructor
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, name: e.target.value }))}
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, email: e.target.value }))}
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData(prev => ({ ...prev, password: e.target.value }))}
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
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
                  ➕ Crear Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmDeleteModal.open && (
        <div
          onClick={() => setConfirmDeleteModal({ open: false, userId: null, userName: '' })}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '32px'
            }}>
              ⚠️
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>
              ¿Eliminar instructor?
            </h3>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2rem' }}>
              ¿Estás seguro de que deseas eliminar a <strong>{confirmDeleteModal.userName}</strong>?<br/>
              Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmDeleteModal({ open: false, userId: null, userName: '' })}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmDeleteModal.userId) {
                    handleDeleteUser(confirmDeleteModal.userId);
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mensajes */}
      {messageModal.open && (
        <div
          onClick={() => setMessageModal({ open: false, type: 'success', message: '' })}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: messageModal.type === 'success' ? '#d1fae5' : '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '32px'
            }}>
              {messageModal.type === 'success' ? '✅' : '❌'}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>
              {messageModal.type === 'success' ? '¡Éxito!' : 'Error'}
            </h3>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>
              {messageModal.message}
            </p>

            <button
              onClick={() => setMessageModal({ open: false, type: 'success', message: '' })}
              style={{
                padding: '0.75rem 2rem',
                background: messageModal.type === 'success' ? '#10b981' : '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
