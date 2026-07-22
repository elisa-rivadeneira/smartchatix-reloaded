import { Suspense } from 'react';
import Link from 'next/link';
import { getClaimByCode } from '@/app/actions/claim.actions';

async function ClaimSuccessContent({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams.code;

  if (!code) {
    return (
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-6">✗</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Código no encontrado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          No se proporcionó un código de reclamo válido.
        </p>
        <Link
          href="/libro-de-reclamaciones"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
        >
          Volver al formulario
        </Link>
      </div>
    );
  }

  const result = await getClaimByCode(code);

  if (!result.success || !result.data) {
    return (
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-6">✗</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Reclamo no encontrado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          No se encontró un reclamo con el código: <strong>{code}</strong>
        </p>
        <Link
          href="/libro-de-reclamaciones"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
        >
          Volver al formulario
        </Link>
      </div>
    );
  }

  const claim = result.data;
  const formattedDate = new Date(claim.createdAt).toLocaleString('es-PE', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {claim.type} Registrado Correctamente
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Hemos recibido su {claim.type.toLowerCase()} y ha sido procesado exitosamente
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <p className="text-purple-100 text-sm font-medium mb-2">CÓDIGO DE {claim.type}</p>
          <p className="text-white text-3xl font-bold tracking-wider">{claim.claimCode}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de registro</p>
              <p className="text-gray-900 dark:text-white">{formattedDate}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                {claim.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Consumidor</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {claim.firstName} {claim.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {claim.documentType}: {claim.documentNumber}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bien contratado</p>
            <p className="text-gray-900 dark:text-white">
              <span className="font-medium">{claim.productType}:</span> {claim.productName}
            </p>
            {claim.amount && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Monto: S/ {claim.amount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              ¿Qué sigue ahora?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hemos enviado una copia de su {claim.type.toLowerCase()} a <strong>{claim.email}</strong></span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Su {claim.type.toLowerCase()} será evaluado por nuestro equipo</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Recibirá una respuesta en un plazo máximo de <strong>30 días calendario</strong></span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Guarde este código para futuras consultas: <strong>{claim.claimCode}</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-900 dark:text-purple-200">
              <strong>📋 Importante:</strong> La presentación del {claim.type.toLowerCase()} no impide acudir a otras vías de solución
              de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Volver al inicio
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
        <p className="mt-2">Conforme a la Ley N° 29571 - Código de Protección y Defensa del Consumidor</p>
      </div>
    </div>
  );
}

export default function ClaimSuccessPage({ searchParams }: { searchParams: { code?: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        }
      >
        <ClaimSuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
