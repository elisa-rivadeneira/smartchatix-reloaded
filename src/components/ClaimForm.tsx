'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClaim } from '@/app/actions/claim.actions';
import type { ClaimType, ProductType, DocumentType } from '@/types/claims';

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

    if (result.success) {
      router.push(`/libro-de-reclamaciones/exito?code=${result.data.claimCode}`);
    } else {
      setError(result.error || 'Error al registrar el reclamo');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Tipo de Registro</h3>

        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="RECLAMO"
              checked={formData.type === 'RECLAMO'}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Reclamo</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Disconformidad relacionada con el producto o servicio
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="QUEJA"
              checked={formData.type === 'QUEJA'}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Queja</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Disconformidad relacionada con la atención recibida
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Bien Contratado</h3>

        <div className="space-y-4 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="PRODUCTO"
              checked={formData.productType === 'PRODUCTO'}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-900 dark:text-white">Producto</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="SERVICIO"
              checked={formData.productType === 'SERVICIO'}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-900 dark:text-white">Servicio</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del producto o servicio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Ej: Curso ChatGPT Empresarial"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto reclamado (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">S/</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Datos del Consumidor</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de documento <span className="text-red-500">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número de documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="999999999"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Av/Jr/Calle, Nro, Distrito, Provincia, Departamento"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isMinor"
              checked={formData.isMinor}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
            />
            <span className="text-gray-900 dark:text-white">Soy menor de edad</span>
          </label>
        </div>

        {formData.isMinor && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del padre, madre o representante legal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              required={formData.isMinor}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Detalle del {formData.type}</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Describa detalladamente su reclamo o queja..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 20 caracteres, máximo 2000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pedido del consumidor <span className="text-red-500">*</span>
            </label>
            <textarea
              name="consumerRequest"
              value={formData.consumerRequest}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Indique qué solicita o espera como solución..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 10 caracteres, máximo 2000
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptedPolicy"
            checked={formData.acceptedPolicy}
            onChange={handleChange}
            required
            className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            He leído y acepto que la información proporcionada será utilizada únicamente para atender mi reclamo conforme a la Política de Privacidad. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Registrando...' : 'Registrar Reclamo'}
      </button>
    </form>
  );
}
