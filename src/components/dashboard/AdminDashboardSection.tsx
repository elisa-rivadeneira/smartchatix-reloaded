'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalInstructors: number;
}

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  student_name: string;
  course_title: string;
}

export default function AdminDashboardSection() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [statsRes, enrollmentsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/enrollments')
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats || stats);
      }

      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const enrollDate = new Date(date);
    const diffMs = now.getTime() - enrollDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return enrollDate.toLocaleDateString('es');
  };

  const recentActivity = enrollments
    .slice()
    .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
    .slice(0, 4)
    .map(e => ({
      type: 'enrollment',
      user: e.student_name,
      course: e.course_title,
      time: getTimeAgo(e.enrolled_at),
      icon: '✅',
      color: '#10b981'
    }));

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
              <div className="kpi-value" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
                {kpi.value}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {kpi.title}
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

          {(() => {
            if (enrollments.length === 0) {
              return (
                <div style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  fontSize: '14px'
                }}>
                  No hay inscripciones todavía
                </div>
              );
            }

            const now = new Date();
            const firstEnrollmentDate = new Date(
              Math.min(...enrollments.map(e => new Date(e.enrolled_at).getTime()))
            );

            const startMonth = new Date(firstEnrollmentDate.getFullYear(), firstEnrollmentDate.getMonth(), 1);
            const endMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const monthsData = [];
            let currentMonth = new Date(startMonth);

            while (currentMonth <= endMonth) {
              const monthName = currentMonth.toLocaleDateString('es', { month: 'short' });
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();

              const count = enrollments.filter(e => {
                const enrollDate = new Date(e.enrolled_at);
                return enrollDate.getFullYear() === year &&
                       enrollDate.getMonth() === month;
              }).length;

              monthsData.push({ monthName, count, year, month });
              currentMonth = new Date(year, month + 1, 1);
            }

            const maxCount = Math.max(...monthsData.map(m => m.count), 10);
            const yAxisMax = Math.ceil(maxCount / 10) * 10;
            const yAxisSteps = [yAxisMax, yAxisMax * 0.75, yAxisMax * 0.5, yAxisMax * 0.25, 0];

            const chartWidth = 700;
            const chartHeight = 160;
            const paddingLeft = 20;
            const paddingRight = 20;
            const usableWidth = chartWidth - paddingLeft - paddingRight;
            const xStep = monthsData.length > 1 ? usableWidth / (monthsData.length - 1) : 0;

            const points = monthsData.map((m, i) => {
              const x = paddingLeft + (i * xStep);
              const y = yAxisMax > 0 ? chartHeight - (m.count / yAxisMax) * chartHeight : chartHeight;
              return { x, y, count: m.count };
            });

            const pathD = points.length > 0
              ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
              : '';

            const areaD = points.length > 0
              ? `M ${points[0].x},0 L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},0 Z`
              : '';

            return (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '0.5rem', paddingBottom: '1.5rem', paddingRight: '0.5rem' }}>
                      {yAxisSteps.map((val, idx) => (
                        <div key={idx} style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '500', textAlign: 'right', width: '30px' }}>
                          {Math.round(val)}
                        </div>
                      ))}
                    </div>

                    <div style={{ flex: 1 }}>
                      <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} 180`} preserveAspectRatio="none" style={{ display: 'block' }}>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={i * 40}
                            x2={chartWidth}
                            y2={i * 40}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}

                        <defs>
                          <linearGradient id="blueGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                          </linearGradient>
                        </defs>

                        {areaD && (
                          <path
                            d={areaD}
                            fill="url(#blueGradient)"
                          />
                        )}

                        {pathD && (
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        )}

                        {points.map((point, idx) => (
                          <g key={`point-${idx}`}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="#fff"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              vectorEffect="non-scaling-stroke"
                            />
                            {point.count > 0 && (
                              <text
                                x={point.x}
                                y={point.y - 10}
                                textAnchor="middle"
                                fill="#3b82f6"
                                fontSize="12"
                                fontWeight="600"
                              >
                                {point.count}
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${monthsData.length}, 1fr)`,
                        marginTop: '0.5rem'
                      }}>
                        {monthsData.map((m, idx) => (
                          <div key={idx} style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            fontWeight: '500',
                            textAlign: 'center',
                            textTransform: 'capitalize'
                          }}>
                            {m.monthName}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            );
          })()}
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
            {recentActivity.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                No hay actividad reciente
              </div>
            ) : recentActivity.map((activity, idx) => (
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
