export type ApplicationId =
  | 'ventas'
  | 'rrhh'
  | 'operaciones'
  | 'finanzas'
  | 'administracion'
  | 'asistente';

export interface ApplicationMeta {
  id: ApplicationId;
  name: string;
  department: string;
  concept: string;
}

// Orden = orden de rotación automática de la galería.
export const APPLICATIONS: ApplicationMeta[] = [
  { id: 'ventas', name: 'SmartVentas', department: 'Ventas', concept: 'Generador de cotizaciones' },
  { id: 'rrhh', name: 'SmartPeople', department: 'Recursos Humanos', concept: 'Evaluación de CV' },
  { id: 'operaciones', name: 'SmartOps', department: 'Operaciones', concept: 'Gestión y seguimiento de procesos' },
  { id: 'finanzas', name: 'SmartFinance', department: 'Finanzas', concept: 'Análisis de gastos y reportes' },
  { id: 'administracion', name: 'SmartDocs', department: 'Administración', concept: 'Gestión y generación de documentos' },
  { id: 'asistente', name: 'SmartAssistant', department: 'Asistente interno', concept: 'Consultas sobre información y procesos internos' },
];
