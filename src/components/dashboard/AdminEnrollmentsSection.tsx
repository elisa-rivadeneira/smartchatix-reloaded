'use client';

import { useState, useEffect } from 'react';

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  student_name: string;
  student_email: string;
  course_title: string;
  modality: string;
  payment_amount: number;
  payment_status: string;
  enrolled_at: string;
}

export default function AdminEnrollmentsSection() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const response = await fetch('/api/admin/enrollments');
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_title.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          ✅ Inscripciones
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
            placeholder="Buscar inscripciones..."
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
      </div>

      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '1rem'
      }}>
        {filteredEnrollments.length} inscripción{filteredEnrollments.length !== 1 ? 'es' : ''} encontrada{filteredEnrollments.length !== 1 ? 's' : ''}
      </div>

      <div className="enrollments-cards" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {filteredEnrollments.map((enrollment) => (
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

        {filteredEnrollments.length === 0 && (
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
              {filteredEnrollments.map((enrollment) => (
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
        {filteredEnrollments.length === 0 && (
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
  );
}
