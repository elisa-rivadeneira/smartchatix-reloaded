export interface Course {
  slug: string;
  type: 'course' | 'program';
  order: number;
  category: string;
  title: string;
  hours: string;
  description: string;
  image?: string;
  keyTopics?: string[];
  includesDescription?: string;

  priceVivo: number;
  oldPriceVivo: number;
  priceGrabado: number;
  oldPriceGrabado: number;
  hasLiveMode?: boolean;

  modules: {
    num: number;
    hours: string;
    title: string;
    description?: string;
    topics: string[];
  }[];

  featured?: boolean;
  strategyNote: string;
}

export const courses: Course[] = [
  {
    slug: 'aprende-dirigir-ia',
    type: 'course',
    order: 1,
    category: 'Fundamentos IA',
    title: 'Aprende a dirigir la IA como si fuera tu mejor empleado',
    hours: '4h',
    description: 'Aprender a comunicarse con la IA de forma estratégica',
    image: '/images/tuempleado_ia.png',
    keyTopics: [
      'Metodología SmartPrompt Framework',
      'Contexto efectivo para mejores respuestas',
      'Roles y directivas claras',
      'Iteración y refinamiento',
      'Casos reales aplicados'
    ],
    includesDescription: 'Curso con plantilla SmartPrompt Framework, casos prácticos, grabación y certificado',
    priceVivo: 149,
    oldPriceVivo: 199,
    priceGrabado: 49,
    oldPriceGrabado: 149,
    modules: [
      { num: 1, hours: '1h', title: 'Mentalidad: Cómo pensar estratégicamente con IA', topics: [] },
      { num: 2, hours: '1h', title: 'Contexto: La clave para respuestas precisas', topics: [] },
      { num: 3, hours: '1h', title: 'Roles: Cómo asignar funciones a la IA', topics: [] },
      { num: 4, hours: '0.5h', title: 'Iteración: Mejora continua de resultados', topics: [] },
      { num: 5, hours: '0.5h', title: 'Casos reales aplicados', topics: [] }
    ],
    strategyNote: 'Curso de entrada ideal para profesionales que quieren dominar ChatGPT',
    featured: false
  },
  {
    slug: 'chatgpt-oficina',
    type: 'course',
    order: 2,
    category: 'Productividad',
    title: 'ChatGPT para la Oficina',
    hours: '6h',
    description: 'Ahorrar tiempo en tareas diarias de oficina',
    image: '/images/chatgpt_oficina2.png',
    keyTopics: [
      'Redacción de correos profesionales',
      'Creación de informes y actas',
      'Resúmenes ejecutivos',
      'Preparación de presentaciones',
      'Automatización de tareas administrativas'
    ],
    includesDescription: 'Curso con biblioteca de plantillas, casos prácticos, grabación y certificado',
    priceVivo: 199,
    oldPriceVivo: 299,
    priceGrabado: 69,
    oldPriceGrabado: 199,
    modules: [
      { num: 1, hours: '1h', title: 'Correos efectivos con IA', topics: [] },
      { num: 2, hours: '1h', title: 'Informes y actas profesionales', topics: [] },
      { num: 3, hours: '1h', title: 'Reuniones productivas', topics: [] },
      { num: 4, hours: '1.5h', title: 'Resúmenes y síntesis', topics: [] },
      { num: 5, hours: '1.5h', title: 'Presentaciones impactantes', topics: [] }
    ],
    strategyNote: 'Curso estrella para administrativos, RRHH y asistentes',
    featured: true
  },
  {
    slug: 'excel-ia-profesionales',
    type: 'course',
    order: 3,
    category: 'Análisis de datos',
    title: 'Excel + IA para Profesionales',
    hours: '6h',
    description: 'Resolver tareas de Excel con IA',
    image: '/images/excel_profesionales.png',
    keyTopics: [
      'Fórmulas complejas con IA',
      'Tablas dinámicas automatizadas',
      'Limpieza y transformación de datos',
      'Análisis y visualización',
      '50 casos prácticos reales'
    ],
    includesDescription: 'Curso con 50 casos prácticos, plantillas Excel, grabación y certificado',
    priceVivo: 229,
    oldPriceVivo: 349,
    priceGrabado: 79,
    oldPriceGrabado: 229,
    modules: [
      { num: 1, hours: '1.5h', title: 'Fórmulas inteligentes con IA', topics: [] },
      { num: 2, hours: '1.5h', title: 'Tablas dinámicas y análisis', topics: [] },
      { num: 3, hours: '1.5h', title: 'Limpieza y transformación de datos', topics: [] },
      { num: 4, hours: '1.5h', title: 'Casos prácticos aplicados', topics: [] }
    ],
    strategyNote: 'Producto para analistas, contadores y administrativos',
    featured: false
  },
  {
    slug: 'datos-decisiones-ia',
    type: 'course',
    order: 4,
    category: 'Business Intelligence',
    title: 'Cómo convertir datos en decisiones usando IA',
    hours: '8h',
    description: 'Transformar datos en decisiones estratégicas',
    image: '/images/curso_power_bi_decisiones.png',
    keyTopics: [
      'KPIs y métricas clave',
      'Dashboards ejecutivos',
      'Power BI con IA',
      'Storytelling con datos',
      'Conclusiones accionables'
    ],
    includesDescription: 'Curso con plantilla de dashboard ejecutivo, casos de análisis, grabación y certificado',
    priceVivo: 299,
    oldPriceVivo: 449,
    priceGrabado: 99,
    oldPriceGrabado: 299,
    modules: [
      { num: 1, hours: '2h', title: 'KPIs y métricas de negocio', topics: [] },
      { num: 2, hours: '2h', title: 'Dashboards ejecutivos', topics: [] },
      { num: 3, hours: '2h', title: 'Power BI potenciado con IA', topics: [] },
      { num: 4, hours: '1h', title: 'Storytelling y narrativa visual', topics: [] },
      { num: 5, hours: '1h', title: 'Conclusiones ejecutivas', topics: [] }
    ],
    strategyNote: 'Curso premium para analistas y gerentes',
    featured: false
  },
  {
    slug: 'automatiza-tu-trabajo-sin-programar-con-n8n',
    type: 'course',
    order: 5,
    category: 'Automatización',
    title: 'Automatiza tu trabajo sin programar con n8n',
    hours: '8h',
    description: 'Eliminar tareas repetitivas con herramientas no-code',
    image: '/images/curso_automatiza_conia.png',
    keyTopics: [
      'Automatización con n8n',
      'Formularios inteligentes',
      'Integración de correos',
      'Conexión con hojas de cálculo',
      '10 automatizaciones listas para usar'
    ],
    includesDescription: 'Curso con 10 automatizaciones listas, plantillas n8n, grabación y certificado',
    priceVivo: 299,
    oldPriceVivo: 449,
    priceGrabado: 99,
    oldPriceGrabado: 299,
    modules: [
      { num: 1, hours: '2h', title: 'Introducción a n8n y automatización', topics: [] },
      { num: 2, hours: '2h', title: 'Formularios y captura de datos', topics: [] },
      { num: 3, hours: '2h', title: 'Automatización de correos y notificaciones', topics: [] },
      { num: 4, hours: '2h', title: 'Hojas de cálculo y flujos complejos', topics: [] }
    ],
    strategyNote: 'Curso de alto valor para profesionales y emprendedores',
    featured: false
  }
];

export const getAllProducts = (): Course[] => {
  return courses;
};

export const getProductBySlug = (slug: string): Course | undefined => {
  return courses.find(product => product.slug === slug);
};

export const getCourses = (): Course[] => {
  return courses;
};

export const getPrograms = (): Course[] => {
  return [];
};
