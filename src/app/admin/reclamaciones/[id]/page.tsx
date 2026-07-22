import Link from 'next/link';
import { getClaim } from '@/app/actions/claim.actions';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Detalle de Reclamo | Admin SmartChatix',
};

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const result = await getClaim(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const claim = result.data;

  const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const statusColors = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    EN_PROCESO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    ATENDIDO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    ARCHIVADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/reclamaciones"
            className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center"
          >
            ← Volver a la lista
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">CÓDIGO DE {claim.type}</p>
                <h1 className="text-white text-3xl font-bold">{claim.claimCode}</h1>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[claim.status]}`}>
                {claim.status}
              </span>
            </div>

            <p className="text-purple-100 mt-4">
              Registrado el {formattedDate}
            </p>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Información del {claim.type}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo</p>
                  <p className="text-gray-900 dark:text-white">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      claim.type === 'RECLAMO'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}>
                      {claim.type}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {claim.type === 'RECLAMO'
                      ? 'Disconformidad con producto o servicio'
                      : 'Disconformidad con la atención'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bien contratado</p>
                  <p className="text-gray-900 dark:text-white font-medium">{claim.productType}</p>
                  <p className="text-gray-600 dark:text-gray-300">{claim.productName}</p>
                </div>

                {claim.amount && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monto reclamado</p>
                    <p className="text-gray-900 dark:text-white text-2xl font-bold">
                      S/ {claim.amount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Datos del Consumidor
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre completo</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {claim.firstName} {claim.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Documento</p>
                  <p className="text-gray-900 dark:text-white">
                    {claim.documentType}: {claim.documentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Correo electrónico</p>
                  <a
                    href={`mailto:${claim.email}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {claim.email}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
                  <a
                    href={`tel:${claim.phone}`}
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {claim.phone}
                  </a>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dirección</p>
                  <p className="text-gray-900 dark:text-white">{claim.address}</p>
                </div>

                {claim.isMinor && claim.guardianName && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Representante legal (Menor de edad)
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">{claim.guardianName}</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Descripción del {claim.type}
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                  {claim.description}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Pedido del Consumidor
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                  {claim.consumerRequest}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Información Técnica
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dirección IP</p>
                  <p className="text-gray-900 dark:text-white font-mono text-sm">{claim.ipAddress}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de registro</p>
                  <p className="text-gray-900 dark:text-white">{formattedDate}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                  <p className="text-gray-900 dark:text-white font-mono text-xs break-all">
                    {claim.userAgent}
                  </p>
                </div>
              </div>
            </section>

            <section className="flex gap-4">
              <a
                href={`mailto:${claim.email}?subject=Re: ${claim.type} ${claim.claimCode}&body=Estimado(a) ${claim.firstName} ${claim.lastName},%0D%0A%0D%0AEn relación a su ${claim.type.toLowerCase()} con código ${claim.claimCode}...`}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                📧 Responder por correo
              </a>

              <Link
                href="/admin/reclamaciones"
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Volver a la lista
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
