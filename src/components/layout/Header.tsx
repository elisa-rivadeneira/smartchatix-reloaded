'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, GraduationCap, BookOpen, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const navigation = [
  {
    name: 'Programas',
    href: '/programas',
    children: [
      { name: 'Todas las Rutas', href: '/programas' },
      { name: 'Bombas y Turbomáquinas', href: '/programas/bombas-turbomaquinas' },
      { name: 'CFD y Simulación', href: '/programas/cfd-simulacion' },
      { name: 'Diseño Mecánico', href: '/programas/diseno-mecanico' },
      { name: 'Fundamentos', href: '/programas/fundamentos' },
    ],
  },
  {
    name: 'Cursos',
    href: '/cursos',
    children: [
      { name: 'Todos los Cursos', href: '/cursos' },
      { name: 'Más Populares', href: '/cursos?filter=popular' },
      { name: 'Nuevos Lanzamientos', href: '/cursos?filter=new' },
      { name: 'Gratuitos', href: '/cursos?filter=free' },
    ],
  },
  {
    name: 'Capacitación Empresarial',
    href: '/capacitacion',
  },
  {
    name: 'Mentorías',
    href: '/mentorias',
  },
  {
    name: 'Blog',
    href: '/blog',
  },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo_samartchatix.png"
                alt="SmartChatix Academy"
                width={160}
                height={150}
                className="h-24 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <div className="relative group">
                      <button
                        className={cn(
                          'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          scrolled
                            ? 'text-gray-700 hover:text-primary-600'
                            : 'text-white hover:text-primary-200'
                        )}
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Dropdown */}
                      <div
                        className={cn(
                          'absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 transition-all duration-200',
                          openDropdown === item.name
                            ? 'opacity-100 visible transform translate-y-0'
                            : 'opacity-0 invisible transform -translate-y-2'
                        )}
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        scrolled
                          ? 'text-gray-700 hover:text-primary-600'
                          : 'text-white hover:text-primary-200'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/masterclass">
              <Button
                variant={scrolled ? "outline" : "secondary"}
                size="sm"
              >
                Masterclass Gratuita
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="sm">
                Hablar con Asesor
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-md transition-colors',
                scrolled
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-primary-200'
              )}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2 border border-gray-100">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            openDropdown === item.name ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <Link href="/masterclass" className="block">
                  <Button variant="outline" className="w-full">
                    Masterclass Gratuita
                  </Button>
                </Link>
                <Link href="/contacto" className="block">
                  <Button className="w-full">
                    Hablar con Asesor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;