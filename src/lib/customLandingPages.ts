// Registro de landing pages personalizadas disponibles para asignar a un curso.
// Cada vez que se crea una nueva landing en /src/app/<ruta>/page.tsx pensada para
// reemplazar la plantilla genérica /cursos/[slug] de un curso, agrégala aquí para
// que aparezca en el selector de "Configuración del curso" en el dashboard.
export interface CustomLandingPage {
  path: string;
  label: string;
}

export const CUSTOM_LANDING_PAGES: CustomLandingPage[] = [
  { path: '/curso-desarrolla-con-claude', label: 'Desarrolla con Claude' },
];
