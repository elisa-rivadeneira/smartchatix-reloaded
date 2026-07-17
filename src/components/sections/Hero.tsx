'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle, Users, Award, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

const Hero: React.FC = () => {
  const features = [
    'Proyectos reales de la industria',
    'Instructores expertos en el área',
    'Certificación profesional',
    'Acceso de por vida'
  ];

  const stats = [
    { icon: Users, value: '15,000+', label: 'Estudiantes activos' },
    { icon: Award, value: '95%', label: 'Tasa de satisfacción' },
    { icon: BookOpen, value: '15', label: 'Cursos especializados' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-bg">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full" style={{ paddingTop: '10rem' }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Award className="w-4 h-4 mr-2" />
              Academia #1 en CFD y Simulación Industrial
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Domina las habilidades de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  ingeniería que exige
                </span>
                la industria moderna
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl">
                Capacítate en CFD, bombas centrífugas, mecánica de fluidos, turbomáquinas, simulación industrial y diseño de ingeniería mediante proyectos reales y herramientas utilizadas por empresas de todo el mundo.
              </p>
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/programas">
                <Button size="xl" className="w-full sm:w-auto shadow-2xl">
                  <span>Ver Programas</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/guia-gratuita">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                  <span>Descargar Guía Gratuita</span>
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-blue-200 text-sm mb-4">Confían en nosotros:</p>
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2">
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Video/Image */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Video Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                <button className="group flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">
                    🎯 Masterclass Gratuita
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Cómo Seleccionar Correctamente una Bomba Centrífuga para Minería e Industria
                  </p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute top-6 right-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">4.9★</div>
                  <div className="text-xs text-blue-200">Rating promedio</div>
                </div>
              </div>

              {/* Course Preview Cards */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-3 shadow-lg max-w-48 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">CFD con ANSYS</div>
                    <div className="text-xs text-gray-500">50+ estudiantes</div>
                  </div>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-3 shadow-lg hidden lg:block">
                <div className="text-center">
                  <Award className="w-6 h-6 text-white mx-auto mb-1" />
                  <div className="text-xs text-white font-medium">Certificación</div>
                  <div className="text-xs text-green-100">Profesional</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Descubre más</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full relative">
              <div className="w-1 h-3 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;