'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateClaimStatus, exportClaimsToCSV } from '@/app/actions/claim.actions';
import type { Claim, ClaimStatus } from '@/types/claims';

interface ClaimsTableProps {
  initialClaims: Claim[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const statusColors: Record<ClaimStatus, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  EN_PROCESO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ATENDIDO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  ARCHIVADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

export default function ClaimsTable({ initialClaims, total, currentPage, totalPages }: ClaimsTableProps) {
  const [claims, setClaims] = useState(initialClaims);
  const [updating, setUpdating] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleStatusChange = async (id: number, newStatus: ClaimStatus) => {
    setUpdating(id);

    const result = await updateClaimStatus(id, newStatus);

    if (result.success) {
      setClaims(prevClaims =>
        prevClaims.map(claim =>
          claim.id === id ? { ...claim, status: newStatus } : claim
        )
      );
    } else {
      alert('Error al actualizar el estado');
    }

    setUpdating(null);
  };

  const handleExport = async () => {
    setExporting(true);

    const result = await exportClaimsToCSV({});

    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `reclamos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Error al exportar los reclamos');
    }

    setExporting(false);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Total: <strong>{total}</strong> reclamo{total !== 1 ? 's' : ''}
        </p>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {exporting ? 'Exportando...' : '📥 Exportar CSV'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Consumidor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/reclamaciones/${claim.id}`}
                      className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      {claim.claimCode}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(claim.createdAt).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {claim.firstName} {claim.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {claim.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      claim.type === 'RECLAMO'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {claim.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                    {claim.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={claim.status}
                      onChange={(e) => handleStatusChange(claim.id, e.target.value as ClaimStatus)}
                      disabled={updating === claim.id}
                      className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-purple-500 ${
                        statusColors[claim.status]
                      } ${updating === claim.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_PROCESO">EN PROCESO</option>
                      <option value="ATENDIDO">ATENDIDO</option>
                      <option value="ARCHIVADO">ARCHIVADO</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/reclamaciones/${claim.id}`}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}

              {claims.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron reclamos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/admin/reclamaciones?page=${page}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                page === currentPage
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
