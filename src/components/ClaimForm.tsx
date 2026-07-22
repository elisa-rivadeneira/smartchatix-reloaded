'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClaim } from '@/app/actions/claim.actions';
import type { ClaimType, ProductType, DocumentType } from '@/types/claims';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '15px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  outline: 'none',
  transition: 'all 0.2s',
  backgroundColor: '#ffffff',
  fontFamily: 'inherit'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb',
  marginBottom: '24px'
};

export default function ClaimForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'RECLAMO' as ClaimType,
    productType: 'SERVICIO' as ProductType,
    productName: '',
    amount: '',
    firstName: '',
    lastName: '',
    documentType: 'DNI' as DocumentType,
    documentNumber: '',
    email: '',
    phone: '',
    address: '',
    isMinor: false,
    guardianName: '',
    description: '',
    consumerRequest: '',
    acceptedPolicy: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      guardianName: formData.isMinor ? formData.guardianName : undefined,
    };

    const result = await createClaim(submitData);

    if (result.success && result.data && result.data.claimCode) {
      router.push(`/libro-de-reclamaciones/exito?code=${result.data.claimCode}`);
    } else {
      setError(result.error || 'Error al registrar');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto' }}>
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={cardStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
          Tipo de Registro
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '12px' }}>
            <input
              type="radio"
              name="type"
              value="RECLAMO"
              checked={formData.type === 'RECLAMO'}
              onChange={handleChange}
              style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }}
            />
            <div>
              <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>Reclamo</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Disconformidad relacionada con el producto o servicio
              </div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '12px' }}>
            <input
              type="radio"
              name="type"
              value="QUEJA"
              checked={formData.type === 'QUEJA'}
              onChange={handleChange}
              style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }}
            />
            <div>
              <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>Queja</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Disconformidad relacionada con la atención recibida
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
          Bien Contratado
        </h3>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
            <input
              type="radio"
              name="productType"
              value="PRODUCTO"
              checked={formData.productType === 'PRODUCTO'}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }}
            />
            <span style={{ color: '#111827' }}>Producto</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
            <input
              type="radio"
              name="productType"
              value="SERVICIO"
              checked={formData.productType === 'SERVICIO'}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }}
            />
            <span style={{ color: '#111827' }}>Servicio</span>
          </label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Nombre del producto/servicio <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Ej: Curso ChatGPT Empresarial"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Monto reclamado (opcional)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              placeholder="S/ 0.00"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
          Datos del Consumidor
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Nombres <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Apellidos <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Tipo de documento <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select name="documentType" value={formData.documentType} onChange={handleChange} style={inputStyle}>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Número de documento <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Correo electrónico <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Teléfono <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="999999999" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Dirección completa <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Av/Jr/Calle, Nro, Distrito, Provincia, Departamento" style={inputStyle} />
        </div>
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
            <input type="checkbox" name="isMinor" checked={formData.isMinor} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }} />
            <span style={{ color: '#111827' }}>Soy menor de edad</span>
          </label>
        </div>
        {formData.isMinor && (
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Nombre del representante legal <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} required={formData.isMinor} style={inputStyle} />
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
          Detalle del {formData.type}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Descripción <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Describa detalladamente su reclamo o queja (mínimo 20 caracteres)" style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Pedido del consumidor <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea name="consumerRequest" value={formData.consumerRequest} onChange={handleChange} required rows={3} placeholder="Indique qué solicita o espera como solución (mínimo 10 caracteres)" style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '12px' }}>
          <input type="checkbox" name="acceptedPolicy" checked={formData.acceptedPolicy} onChange={handleChange} required style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#667eea' }} />
          <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
            Acepto que la información proporcionada será utilizada conforme a la Política de Privacidad <span style={{ color: '#dc2626' }}>*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          fontWeight: '600',
          fontSize: '16px',
          padding: '16px 32px',
          borderRadius: '8px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}
      >
        {loading ? 'Registrando...' : 'Registrar Reclamo'}
      </button>
    </form>
  );
}
