import { getAllClaims, getClaimStats } from '@/app/actions/claim.actions';
import ClaimsTable from '@/components/admin/ClaimsTable';

export const metadata = {
  title: 'Gestión de Reclamaciones | Admin SmartChatix',
  description: 'Panel administrativo de libro de reclamaciones',
};

export default async function AdminReclamacionesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string; type?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const search = searchParams.search;
  const status = searchParams.status as any;
  const type = searchParams.type as any;

  const [claimsResult, statsResult] = await Promise.all([
    getAllClaims({ page, search, status, type }),
    getClaimStats(),
  ]);

  if (!claimsResult.success || !claimsResult.data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
          Error al cargar los reclamos
        </div>
      </div>
    );
  }

  const { claims, total, totalPages } = claimsResult.data;
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Libro de Reclamaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de reclamos y quejas de consumidores
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendiente}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">En Proceso</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.enProceso}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Atendidos</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.atendido}</p>
            </div>
          </div>
        )}

        <ClaimsTable
          initialClaims={claims}
          total={total}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
