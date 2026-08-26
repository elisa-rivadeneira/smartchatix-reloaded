export interface DashboardMenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  badge?: number;
  roles: ('admin' | 'instructor' | 'student')[];
}

export function getDashboardMenuItems(userRole: string, activeTab: string, setActiveTab: (tab: string) => void, badges?: { usuarios?: number; cursos?: number; inscripciones?: number }): DashboardMenuItem[] {
  const allMenuItems: DashboardMenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      onClick: () => setActiveTab('dashboard'),
      roles: ['admin', 'instructor', 'student']
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: '👥',
      onClick: () => setActiveTab('usuarios'),
      badge: badges?.usuarios,
      roles: ['admin']
    },
    {
      id: 'cursos',
      label: 'Cursos',
      icon: '📚',
      onClick: () => setActiveTab('cursos'),
      badge: badges?.cursos,
      roles: ['admin']
    },
    {
      id: 'inscripciones',
      label: 'Inscripciones',
      icon: '✅',
      onClick: () => setActiveTab('inscripciones'),
      badge: badges?.inscripciones,
      roles: ['admin']
    },
    {
      id: 'instructores',
      label: 'Instructores',
      icon: '👨‍🏫',
      onClick: () => setActiveTab('instructores'),
      roles: ['admin']
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: '📈',
      onClick: () => setActiveTab('reportes'),
      roles: ['admin']
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: '⚙️',
      onClick: () => setActiveTab('configuracion'),
      roles: ['admin']
    },
    {
      id: 'cursos-instructor',
      label: 'Cursos como Instructor',
      icon: '👨‍🏫',
      onClick: () => setActiveTab('cursos-instructor'),
      roles: ['instructor']
    },
    {
      id: 'mis-cursos',
      label: 'Mis Cursos',
      icon: '📚',
      onClick: () => setActiveTab('mis-cursos'),
      roles: ['student']
    },
    {
      id: 'crear-curso',
      label: 'Crear Curso',
      icon: '➕',
      onClick: () => setActiveTab('crear-curso'),
      roles: ['instructor']
    },
  ];

  return allMenuItems.filter(item => {
    if (userRole === 'admin') return item.roles.includes('admin');
    if (userRole === 'instructor') return item.roles.includes('instructor');
    return item.roles.includes('student');
  });
}

export function getDefaultTab(userRole: string): string {
  return 'dashboard';
}
