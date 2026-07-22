import ClaimForm from '@/components/ClaimForm';

export const metadata = {
  title: 'Libro de Reclamaciones | SmartChatix',
  description: 'Registre su reclamo o queja conforme a la normativa peruana',
};

export default function LibroReclamacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Libro de Reclamaciones
          </h1>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Conforme al <strong>Código de Protección y Defensa del Consumidor</strong> (Ley N° 29571),
              SmartChatix pone a su disposición este Libro de Reclamaciones Virtual.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Usted puede registrar un <strong>reclamo</strong> (disconformidad relacionada con el producto o servicio)
              o una <strong>queja</strong> (disconformidad relacionada con la atención recibida).
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
              <p className="text-sm text-purple-900 dark:text-purple-200">
                <strong>📋 Importante:</strong> La presentación del reclamo no impide acudir a otras vías de solución
                de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
              </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Recibirá una copia de su registro por correo electrónico y atenderemos su solicitud
              en un plazo máximo de <strong>30 días calendario</strong>.
            </p>
          </div>
        </div>

        <ClaimForm />

        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SmartChatix. Todos los derechos reservados.</p>
          <p className="mt-2">Conforme a la Ley N° 29571 - Código de Protección y Defensa del Consumidor</p>
        </div>
      </div>
    </div>
  );
}
