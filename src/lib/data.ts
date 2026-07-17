import { Course, LearningPath, CorporateTraining, MentoringService } from '@/types';

export const courses: Course[] = [
  {
    id: 'bombas-centrifugas-mineria',
    title: 'Selección y Operación de Bombas Centrífugas para Minería e Industria',
    description: 'Domina los fundamentos de selección, operación y mantenimiento de bombas centrífugas aplicados específicamente al sector minero e industrial.',
    shortDescription: 'Aprende a seleccionar y operar bombas centrífugas para aplicaciones mineras e industriales',
    duration: '40 horas',
    level: 'Intermedio',
    category: 'Bombas y Turbomáquinas',
    image: '/images/courses/bombas-centrifugas.jpg',
    price: 297,
    originalPrice: 497,
    features: [
      'Principios de funcionamiento de bombas centrífugas',
      'Curvas características H-Q',
      'Cálculo de NPSH y prevención de cavitación',
      'Selección según aplicación industrial',
      'Análisis de eficiencia energética',
      'Casos prácticos mineros',
      'Certificado de finalización'
    ],
    curriculum: [
      {
        id: 'mod1',
        title: 'Fundamentos de Bombas Centrífugas',
        duration: '8 horas',
        lessons: [
          { id: 'l1', title: 'Principios de funcionamiento', duration: '45 min', type: 'video' },
          { id: 'l2', title: 'Componentes principales', duration: '60 min', type: 'video' },
          { id: 'l3', title: 'Tipos de bombas centrífugas', duration: '45 min', type: 'video' }
        ]
      }
    ],
    instructor: 'Ing. Carlos Rodriguez',
    rating: 4.8,
    studentsCount: 1250,
    isPopular: true,
    isFeatured: true
  },
  {
    id: 'cfd-bombas-ansys',
    title: 'Simulación CFD de Bombas Centrífugas con ANSYS CFX',
    description: 'Aprende a simular el comportamiento fluidodinámico de bombas centrífugas utilizando ANSYS CFX para optimizar el diseño y predecir el rendimiento.',
    shortDescription: 'Simulación avanzada de bombas centrífugas con CFD',
    duration: '50 horas',
    level: 'Avanzado',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/cfd-bombas.jpg',
    price: 497,
    originalPrice: 697,
    features: [
      'Mallado para turbomáquinas',
      'Configuración de condiciones de frontera',
      'Modelos de turbulencia aplicados',
      'Post-procesamiento avanzado',
      'Análisis de cavitación en CFD',
      'Optimización de diseño',
      'Proyectos reales de la industria'
    ],
    curriculum: [],
    instructor: 'Dr. Ana Martinez',
    rating: 4.9,
    studentsCount: 580,
    isFeatured: true
  },
  {
    id: 'diseno-turbomaquinas',
    title: 'Diseño de Turbomáquinas con CFturbo',
    description: 'Curso completo para el diseño de turbomáquinas utilizando CFturbo, desde conceptos básicos hasta diseño avanzado de impulsores y difusores.',
    shortDescription: 'Diseño profesional de turbomáquinas con software especializado',
    duration: '45 horas',
    level: 'Avanzado',
    category: 'Bombas y Turbomáquinas',
    image: '/images/courses/cfturbo.jpg',
    price: 597,
    originalPrice: 797,
    features: [
      'Teoría de diseño de turbomáquinas',
      'Uso profesional de CFturbo',
      'Diseño de impulsores',
      'Diseño de difusores y volutas',
      'Análisis de rendimiento',
      'Exportación a CAD y CFD',
      'Casos de estudio industriales'
    ],
    curriculum: [],
    instructor: 'Ing. Miguel Torres',
    rating: 4.7,
    studentsCount: 320,
    isPopular: true
  },
  {
    id: 'aft-fathom-basico',
    title: 'AFT Fathom Básico: Redes Hidráulicas Industriales',
    description: 'Aprende a analizar y diseñar redes hidráulicas industriales utilizando AFT Fathom, el software líder en análisis de sistemas de tuberías.',
    shortDescription: 'Análisis de redes hidráulicas con AFT Fathom',
    duration: '30 horas',
    level: 'Básico',
    category: 'Fundamentos de Ingeniería',
    image: '/images/courses/aft-fathom.jpg',
    price: 197,
    originalPrice: 297,
    features: [
      'Fundamentos de redes hidráulicas',
      'Interface de AFT Fathom',
      'Modelado de sistemas de tuberías',
      'Análisis de pérdidas de carga',
      'Cálculo de puntos de operación',
      'Casos prácticos industriales'
    ],
    curriculum: [],
    instructor: 'Ing. Laura Vega',
    rating: 4.6,
    studentsCount: 890,
    isPopular: true
  },
  {
    id: 'ansys-rocky-mineria',
    title: 'ANSYS Rocky para Minería',
    description: 'Simulación de materiales granulares y partículas en procesos mineros utilizando ANSYS Rocky DEM.',
    shortDescription: 'Simulación DEM para procesos mineros',
    duration: '35 horas',
    level: 'Intermedio',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/ansys-rocky.jpg',
    price: 397,
    originalPrice: 597,
    features: [
      'Fundamentos de DEM',
      'Modelado de partículas',
      'Simulación de transportadores',
      'Análisis de chancadores',
      'Optimización de procesos',
      'Casos mineros reales'
    ],
    curriculum: [],
    instructor: 'Ing. Pedro Ramirez',
    rating: 4.5,
    studentsCount: 445,
  },
  {
    id: 'mecanica-fluidos-cfd',
    title: 'Mecánica de Fluidos para Simulación CFD',
    description: 'Fundamentos sólidos de mecánica de fluidos orientados a la aplicación en simulación CFD.',
    shortDescription: 'Bases teóricas para simulación CFD',
    duration: '25 horas',
    level: 'Básico',
    category: 'Fundamentos de Ingeniería',
    image: '/images/courses/mecanica-fluidos.jpg',
    price: 147,
    originalPrice: 247,
    features: [
      'Ecuaciones fundamentales',
      'Análisis dimensional',
      'Flujo viscoso e invíscido',
      'Turbulencia',
      'Transferencia de calor',
      'Preparación para CFD'
    ],
    curriculum: [],
    instructor: 'Dr. Sofia Mendez',
    rating: 4.8,
    studentsCount: 1150,
  },
  {
    id: 'ansys-cfd-cero',
    title: 'ANSYS CFD desde Cero',
    description: 'Curso introductorio completo para aprender simulación CFD con ANSYS desde los conceptos básicos.',
    shortDescription: 'Introducción completa a ANSYS CFD',
    duration: '60 horas',
    level: 'Básico',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/ansys-cfd.jpg',
    price: 397,
    originalPrice: 597,
    features: [
      'Interface de ANSYS Workbench',
      'Geometría y mallado',
      'Configuración de casos CFD',
      'Modelos de turbulencia',
      'Post-procesamiento',
      'Proyectos guiados'
    ],
    curriculum: [],
    instructor: 'Ing. Roberto Silva',
    rating: 4.7,
    studentsCount: 2100,
    isPopular: true
  },
  {
    id: 'ansys-cfx-basico',
    title: 'ANSYS CFX Básico',
    description: 'Especialízate en ANSYS CFX para simulaciones CFD avanzadas, especialmente orientado a turbomáquinas.',
    shortDescription: 'CFD avanzado con ANSYS CFX',
    duration: '40 horas',
    level: 'Intermedio',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/ansys-cfx.jpg',
    price: 347,
    originalPrice: 497,
    features: [
      'Características específicas de CFX',
      'Mallado para turbomáquinas',
      'Interfaces múltiples',
      'Transferencia de calor',
      'Casos especializados',
      'Mejores prácticas'
    ],
    curriculum: [],
    instructor: 'Dr. Fernando Castro',
    rating: 4.6,
    studentsCount: 680,
  },
  {
    id: 'ansys-fluent-basico',
    title: 'ANSYS Fluent Básico',
    description: 'Domina ANSYS Fluent para una amplia gama de aplicaciones CFD en la industria.',
    shortDescription: 'CFD versátil con ANSYS Fluent',
    duration: '45 horas',
    level: 'Intermedio',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/ansys-fluent.jpg',
    price: 347,
    originalPrice: 497,
    features: [
      'Interface de Fluent',
      'Modelos físicos avanzados',
      'Multifase',
      'Combustión',
      'Casos industriales',
      'Optimización'
    ],
    curriculum: [],
    instructor: 'Ing. Carmen Lopez',
    rating: 4.7,
    studentsCount: 950,
  },
  {
    id: 'ansys-mechanical-basico',
    title: 'ANSYS Mechanical Básico',
    description: 'Análisis estructural y mecánico utilizando ANSYS Mechanical para aplicaciones industriales.',
    shortDescription: 'Simulación estructural con ANSYS Mechanical',
    duration: '35 horas',
    level: 'Básico',
    category: 'Diseño Mecánico y Simulación Estructural',
    image: '/images/courses/ansys-mechanical.jpg',
    price: 297,
    originalPrice: 397,
    features: [
      'Análisis estático',
      'Análisis modal',
      'Fatiga',
      'Contactos',
      'Materiales no lineales',
      'Casos prácticos'
    ],
    curriculum: [],
    instructor: 'Ing. Diego Morales',
    rating: 4.5,
    studentsCount: 760,
  },
  {
    id: 'spaceclaim-3d',
    title: 'Modelamiento 3D con SpaceClaim',
    description: 'Aprende modelamiento 3D rápido y eficiente con ANSYS SpaceClaim para preparación de geometrías CFD.',
    shortDescription: 'Modelado 3D eficiente para simulación',
    duration: '20 horas',
    level: 'Básico',
    category: 'Diseño Mecánico y Simulación Estructural',
    image: '/images/courses/spaceclaim.jpg',
    price: 197,
    originalPrice: 297,
    features: [
      'Interface intuitiva',
      'Modelado directo',
      'Preparación para CFD',
      'Reparación de geometría',
      'Casos prácticos',
      'Integración ANSYS'
    ],
    curriculum: [],
    instructor: 'Ing. Patricia Herrera',
    rating: 4.4,
    studentsCount: 640,
  },
  {
    id: 'solidworks-ingenieros',
    title: 'SOLIDWORKS para Ingenieros y Técnicos',
    description: 'Curso completo de SOLIDWORKS orientado a ingenieros para diseño mecánico y documentación técnica.',
    shortDescription: 'Diseño mecánico profesional con SOLIDWORKS',
    duration: '50 horas',
    level: 'Básico',
    category: 'Diseño Mecánico y Simulación Estructural',
    image: '/images/courses/solidworks.jpg',
    price: 297,
    originalPrice: 497,
    features: [
      'Modelado paramétrico',
      'Ensamblajes',
      'Planos técnicos',
      'Simulación básica',
      'Renderizado',
      'Proyectos industriales'
    ],
    curriculum: [],
    instructor: 'Ing. Manuel Garcia',
    rating: 4.6,
    studentsCount: 1450,
    isPopular: true
  },
  {
    id: 'ansys-discovery',
    title: 'ANSYS Discovery',
    description: 'Simulación rápida y exploración de diseño con ANSYS Discovery para validación temprana de conceptos.',
    shortDescription: 'Simulación rápida para validación de diseños',
    duration: '15 horas',
    level: 'Básico',
    category: 'CFD y Simulación Industrial',
    image: '/images/courses/ansys-discovery.jpg',
    price: 147,
    originalPrice: 197,
    features: [
      'Simulación en tiempo real',
      'CFD instantáneo',
      'Análisis estructural rápido',
      'Optimización topológica',
      'Interface simplificada',
      'Casos de validación'
    ],
    curriculum: [],
    instructor: 'Ing. Andrea Ruiz',
    rating: 4.5,
    studentsCount: 420,
  },
  {
    id: 'calculo-ingenieros',
    title: 'Cálculo para Ingenieros',
    description: 'Fundamentos matemáticos esenciales para ingeniería, con enfoque en aplicaciones prácticas.',
    shortDescription: 'Matemáticas fundamentales para ingeniería',
    duration: '30 horas',
    level: 'Básico',
    category: 'Fundamentos de Ingeniería',
    image: '/images/courses/calculo.jpg',
    price: 97,
    originalPrice: 147,
    features: [
      'Límites y derivadas',
      'Integrales',
      'Ecuaciones diferenciales',
      'Aplicaciones ingenieriles',
      'Ejercicios resueltos',
      'Casos prácticos'
    ],
    curriculum: [],
    instructor: 'Dr. Ricardo Valera',
    rating: 4.3,
    studentsCount: 890,
  },
  {
    id: 'introduccion-mecanica-fluidos',
    title: 'Introducción a la Mecánica de Fluidos Aplicada',
    description: 'Curso introductorio de mecánica de fluidos con enfoque en aplicaciones industriales y mineras.',
    shortDescription: 'Fundamentos de mecánica de fluidos aplicada',
    duration: '25 horas',
    level: 'Básico',
    category: 'Fundamentos de Ingeniería',
    image: '/images/courses/intro-fluidos.jpg',
    price: 147,
    originalPrice: 197,
    features: [
      'Propiedades de fluidos',
      'Estática de fluidos',
      'Ecuaciones fundamentales',
      'Flujo en tuberías',
      'Aplicaciones industriales',
      'Casos mineros'
    ],
    curriculum: [],
    instructor: 'Ing. Elena Vargas',
    rating: 4.4,
    studentsCount: 1050,
  }
];

export const learningPaths: LearningPath[] = [
  {
    id: 'bombas-turbomaquinas',
    title: 'Especialista en Bombas y Turbomáquinas',
    description: 'Ruta completa para convertirte en experto en bombas centrífugas, selección, operación, simulación CFD y diseño de turbomáquinas.',
    courses: [
      'bombas-centrifugas-mineria',
      'cfd-bombas-ansys',
      'diseno-turbomaquinas',
      'aft-fathom-basico'
    ],
    totalDuration: '165 horas',
    level: 'Intermedio',
    image: '/images/paths/bombas-path.jpg',
    price: 1297,
    originalPrice: 1891
  },
  {
    id: 'cfd-simulacion',
    title: 'Experto en CFD y Simulación Industrial',
    description: 'Domina la simulación CFD desde los fundamentos hasta aplicaciones avanzadas con ANSYS CFX, Fluent y Rocky.',
    courses: [
      'mecanica-fluidos-cfd',
      'ansys-cfd-cero',
      'ansys-cfx-basico',
      'ansys-fluent-basico',
      'ansys-rocky-mineria'
    ],
    totalDuration: '205 horas',
    level: 'Intermedio',
    image: '/images/paths/cfd-path.jpg',
    price: 1497,
    originalPrice: 2135
  },
  {
    id: 'diseno-mecanico',
    title: 'Diseño Mecánico y Simulación Estructural',
    description: 'Aprende diseño mecánico con SOLIDWORKS y simulación estructural con ANSYS Mechanical.',
    courses: [
      'solidworks-ingenieros',
      'ansys-mechanical-basico',
      'spaceclaim-3d',
      'ansys-discovery'
    ],
    totalDuration: '120 horas',
    level: 'Básico',
    image: '/images/paths/diseno-path.jpg',
    price: 797,
    originalPrice: 1188
  },
  {
    id: 'fundamentos',
    title: 'Fundamentos de Ingeniería',
    description: 'Base sólida en matemáticas, mecánica de fluidos y análisis de sistemas hidráulicos.',
    courses: [
      'calculo-ingenieros',
      'introduccion-mecanica-fluidos',
      'mecanica-fluidos-cfd',
      'aft-fathom-basico'
    ],
    totalDuration: '110 horas',
    level: 'Básico',
    image: '/images/paths/fundamentos-path.jpg',
    price: 497,
    originalPrice: 688
  }
];

export const corporateTraining: CorporateTraining[] = [
  {
    id: 'bombas-mineria-empresarial',
    title: 'Capacitación Empresarial en Bombas para Minería',
    description: 'Programa especializado para equipos de ingeniería en empresas mineras, enfocado en selección, operación y mantenimiento de bombas centrífugas.',
    features: [
      'Capacitación in-situ o virtual',
      'Material personalizado para la empresa',
      'Casos de estudio con equipos reales',
      'Soporte post-capacitación',
      'Certificados corporativos',
      'Evaluaciones y métricas de aprendizaje'
    ],
    benefits: [
      'Reduce costos de mantenimiento',
      'Optimiza la selección de equipos',
      'Mejora la eficiencia operacional',
      'Capacita al personal técnico',
      'Disminuye paradas no programadas'
    ],
    targetAudience: [
      'Ingenieros de mantenimiento',
      'Supervisores de operaciones',
      'Técnicos especializados',
      'Jefes de planta',
      'Gerentes de operaciones'
    ]
  },
  {
    id: 'cfd-industrial-empresarial',
    title: 'Simulación CFD para Industria',
    description: 'Programa avanzado de CFD para equipos de I+D en empresas industriales, enfocado en optimización de procesos y desarrollo de productos.',
    features: [
      'Entrenamiento con software empresarial',
      'Proyectos basados en necesidades reales',
      'Mentorías especializadas',
      'Licencias de software incluidas',
      'Soporte técnico continuo',
      'Workshops especializados'
    ],
    benefits: [
      'Acelera el desarrollo de productos',
      'Optimiza procesos existentes',
      'Reduce costos de prototipado',
      'Mejora la competitividad',
      'Desarrolla capacidades internas'
    ],
    targetAudience: [
      'Ingenieros de diseño',
      'Especialistas en CFD',
      'Equipos de I+D',
      'Ingenieros de proceso',
      'Consultores técnicos'
    ]
  }
];

export const mentoringServices: MentoringService[] = [
  {
    id: 'mentoria-cfd',
    title: 'Mentoría en CFD',
    description: 'Mentoría personalizada para proyectos de simulación CFD, desde configuración hasta interpretación de resultados.',
    type: 'CFD',
    duration: '4 semanas',
    price: 497,
    features: [
      'Sesiones 1:1 con expertos',
      'Revisión de casos específicos',
      'Guía en mejores prácticas',
      'Soporte en interpretación',
      'Acceso a recursos exclusivos'
    ]
  },
  {
    id: 'mentoria-bombas',
    title: 'Mentoría en Bombas Centrífugas',
    description: 'Asesoría especializada en selección, operación y troubleshooting de bombas centrífugas.',
    type: 'Bombas',
    duration: '3 semanas',
    price: 397,
    features: [
      'Análisis de casos reales',
      'Criterios de selección',
      'Diagnóstico de problemas',
      'Optimización operacional',
      'Networking con expertos'
    ]
  },
  {
    id: 'mentoria-tesis',
    title: 'Mentoría para Tesis',
    description: 'Acompañamiento completo para tesis de grado y postgrado relacionadas con mecánica de fluidos, CFD y turbomáquinas.',
    type: 'Tesis',
    duration: '12 semanas',
    price: 897,
    features: [
      'Definición de objetivos',
      'Metodología de investigación',
      'Análisis de resultados',
      'Redacción técnica',
      'Preparación de defensa'
    ]
  },
  {
    id: 'mentoria-simulacion',
    title: 'Mentoría en Simulación Industrial',
    description: 'Orientación para proyectos de simulación en procesos industriales y optimización de sistemas.',
    type: 'Simulación',
    duration: '6 semanas',
    price: 697,
    features: [
      'Modelado de procesos',
      'Validación de modelos',
      'Análisis de sensibilidad',
      'Optimización multiobjetivo',
      'Implementación industrial'
    ]
  },
  {
    id: 'mentoria-turbomaquinas',
    title: 'Mentoría en Diseño de Turbomáquinas',
    description: 'Asesoría experta en diseño, análisis y optimización de turbomáquinas para aplicaciones específicas.',
    type: 'Turbomáquinas',
    duration: '8 semanas',
    price: 797,
    features: [
      'Teoría de diseño avanzada',
      'Uso de software especializado',
      'Análisis de rendimiento',
      'Optimización aerodinámica',
      'Validación experimental'
    ]
  }
];