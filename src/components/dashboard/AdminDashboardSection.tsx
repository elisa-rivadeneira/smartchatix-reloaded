'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalInstructors: number;
}

export default function AdminDashboardSection() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivity = [
    { type: 'enrollment', user: 'María García', course: 'Introducción a Python', time: '2 min', icon: '✅', color: '#10b981' },
    { type: 'completion', user: 'Juan Pérez', course: 'React Avanzado', time: '15 min', icon: '🎓', color: '#3b82f6' },
    { type: 'new_user', user: 'Ana Rodríguez', course: 'Registro nuevo', time: '1 hora', icon: '👤', color: '#8b5cf6' },
    { type: 'enrollment', user: 'Carlos López', course: 'Data Science', time: '2 horas', icon: '✅', color: '#10b981' }
  ];

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
          📊 Dashboard
        </h2>
      </div>

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
            <div className="kpi-value" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
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

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Inscripciones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8b5cf6' }}></div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Cursos completados</span>
            </div>
          </div>

          <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>📊 Gráfico de tendencias</p>
          </div>
        </div>

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
    </div>
  );
}
