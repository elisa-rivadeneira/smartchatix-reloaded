'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  ArrowRight,
  Award,
  Users,
  BookOpen
} from 'lucide-react';
import Button from '@/components/ui/Button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    {
      title: 'Programas',
      links: [
        { name: 'Bombas y Turbomáquinas', href: '/programas/bombas-turbomaquinas' },
        { name: 'CFD y Simulación', href: '/programas/cfd-simulacion' },
        { name: 'Diseño Mecánico', href: '/programas/diseno-mecanico' },
        { name: 'Fundamentos de Ingeniería', href: '/programas/fundamentos' },
      ]
    },
    {
      title: 'Servicios',
      links: [
        { name: 'Cursos Online', href: '/cursos' },
        { name: 'Capacitación Empresarial', href: '/capacitacion' },
        { name: 'Mentorías', href: '/mentorias' },
        { name: 'Masterclass Gratuita', href: '/masterclass' },
      ]
    },
    {
      title: 'Recursos',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Guías Gratuitas', href: '/recursos' },
        { name: 'Casos de Estudio', href: '/casos-estudio' },
        { name: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'Academia',
      links: [
        { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
        { name: 'Instructores', href: '/instructores' },
        { name: 'Testimonios', href: '/testimonios' },
        { name: 'Contacto', href: '/contacto' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/company/smartchatix', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/@smartchatix', icon: Youtube },
    { name: 'Facebook', href: 'https://facebook.com/smartchatix', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com/smartchatix', icon: Instagram },
    { name: 'WhatsApp', href: 'https://wa.me/51999999999', icon: MessageCircle },
  ];

  const stats = [
    { icon: Users, value: '15,000+', label: 'Estudiantes' },
    { icon: BookOpen, value: '15', label: 'Cursos' },
    { icon: Award, value: '95%', label: 'Satisfacción' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Listo para acelerar tu carrera en ingeniería?
              </h2>
              <p className="text-blue-100 text-lg">
                Únete a más de 15,000 ingenieros que ya están transformando sus carreras con SmartChatix
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/programas">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Ver Todos los Programas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/masterclass">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
                  Masterclass Gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  SmartChatix
                </span>
              </Link>

              <p className="text-gray-400 mb-6 leading-relaxed">
                La academia online líder en Latinoamérica especializada en bombas, mecánica de fluidos, simulación CFD, turbomáquinas, minería y diseño de ingeniería.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-4 h-4 text-primary-400" />
                    </div>
                    <div className="text-sm font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">info@smartchatix.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">+51 999 999 999</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Lima, Perú</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-4 gap-8">
                {navigationLinks.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="text-gray-400 hover:text-white transition-colors text-sm"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links & Newsletter */}
      <div className="border-t border-gray-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Mantente actualizado
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Recibe contenido exclusivo, nuevos cursos y ofertas especiales
              </p>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button className="rounded-l-none">
                  Suscribirse
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold text-white mb-4">
                Síguenos
              </h3>
              <div className="flex justify-center md:justify-end space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} SmartChatix. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacidad" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/51999999999?text=Hola!%20Me%20interesa%20conocer%20más%20sobre%20los%20cursos%20de%20SmartChatix%20ACADEMY"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;