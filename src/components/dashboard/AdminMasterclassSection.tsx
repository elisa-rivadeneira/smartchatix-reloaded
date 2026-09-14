'use client';

import { useState, useEffect } from 'react';

interface MasterclassRegistration {
  id: number;
  masterclass_name: string;
  nombre: string;
  whatsapp: string;
  whatsapp_auto_enviado: boolean;
  created_at: string;
}

export default function AdminMasterclassSection() {
  const [registrations, setRegistrations] = useState<MasterclassRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/masterclass');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Error loading masterclass registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = registrations.filter(r =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.whatsapp.includes(searchTerm) ||
    r.masterclass_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          🎓 Masterclasses
        </h2>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o WhatsApp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '1rem' }}>
        {filtered.length} inscripción{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </div>

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
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>WhatsApp</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Masterclass</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>WhatsApp automático</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{r.nombre}</td>
                  <td style={{ padding: '1rem', fontSize: '14px', color: '#111827' }}>
                    <a href={`https://wa.me/${r.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {r.whatsapp}
                    </a>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>{r.masterclass_name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: r.whatsapp_auto_enviado ? '#dcfce7' : '#fee2e2',
                      color: r.whatsapp_auto_enviado ? '#166534' : '#991b1b'
                    }}>
                      {r.whatsapp_auto_enviado ? '✅ Enviado' : '❌ No enviado'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(r.created_at).toLocaleDateString('es-PE', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <p style={{ fontSize: '14px' }}>No hay inscripciones registradas todavía</p>
          </div>
        )}
      </div>
    </div>
  );
}
