import Link from 'next/link';
import { getClaimByCode } from '@/app/actions/claim.actions';

export const metadata = {
  title: 'Reclamo Registrado | SmartChatix',
};

export default async function ClaimSuccessPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code;

  if (!code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Código no encontrado</p>
          <Link href="/libro-de-reclamaciones" className="text-purple-600 dark:text-purple-400 hover:underline">
            Volver al formulario
          </Link>
        </div>
      </div>
    );
  }

  const result = await getClaimByCode(code);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Reclamo no encontrado: {code}</p>
          <Link href="/libro-de-reclamaciones" className="text-purple-600 dark:text-purple-400 hover:underline">
            Volver al formulario
          </Link>
        </div>
      </div>
    );
  }

  const claim = result.data;
  const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {claim.type} Registrado Correctamente
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hemos recibido su {claim.type.toLowerCase()} exitosamente
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
            <p className="text-purple-100 text-sm font-medium mb-1">CÓDIGO DE {claim.type}</p>
            <p className="text-white text-3xl font-bold">{claim.claimCode}</p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fecha de registro</p>
              <p className="text-gray-900 dark:text-white">{formattedDate}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Consumidor</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {claim.firstName} {claim.lastName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{claim.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bien contratado</p>
              <p className="text-gray-900 dark:text-white">
                {claim.productType}: {claim.productName}
              </p>
              {claim.amount && (
                <p className="text-sm text-gray-600 dark:text-gray-400">Monto: S/ {claim.amount.toFixed(2)}</p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">¿Qué sigue ahora?</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>✓ Hemos enviado una copia a <strong>{claim.email}</strong></li>
                <li>✓ Su {claim.type.toLowerCase()} será evaluado por nuestro equipo</li>
                <li>✓ Recibirá respuesta en máximo <strong>30 días calendario</strong></li>
                <li>✓ Guarde este código: <strong>{claim.claimCode}</strong></li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
