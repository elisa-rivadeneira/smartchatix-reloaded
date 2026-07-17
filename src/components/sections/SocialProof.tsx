'use client';

import React from 'react';
import { Star, Quote, Building, Users, Award, TrendingUp } from 'lucide-react';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Ingeniero de Mantenimiento',
      company: 'Antamina',
      image: 'CM',
      rating: 5,
      text: 'El curso de bombas centrífugas me ayudó a optimizar el sistema hidráulico de nuestra planta. Redujimos los costos de mantenimiento en un 40% aplicando lo aprendido.',
      course: 'Bombas Centrífugas para Minería'
    },
    {
      name: 'Ana Rodriguez',
      role: 'Especialista CFD',
      company: 'Bechtel',
      image: 'AR',
      rating: 5,
      text: 'La metodología de enseñanza es excelente. Los proyectos prácticos con ANSYS CFX me dieron la confianza para liderar simulaciones complejas en mi trabajo.',
      course: 'CFD con ANSYS CFX'
    },
    {
      name: 'Miguel Santos',
      role: 'Jefe de Proyecto',
      company: 'Fluor',
      image: 'MS',
      rating: 5,
      text: 'Completé mi tesis de maestría con la mentoría de SmartChatix. El acompañamiento fue fundamental para lograr resultados de calidad internacional.',
      course: 'Mentoría de Tesis'
    },
    {
      name: 'Diana Torres',
      role: 'Ingeniera Senior',
      company: 'Repsol',
      image: 'DT',
      rating: 5,
      text: 'Los casos reales de la industria petroleum fueron invaluables. Ahora lidero el equipo de simulación de procesos en mi empresa.',
      course: 'CFD y Simulación Industrial'
    },
    {
      name: 'Roberto Vargas',
      role: 'Consultor Independiente',
      company: 'Freelancer',
      image: 'RV',
      rating: 5,
      text: 'Gracias a los conocimientos adquiridos en turbomáquinas, pude empezar mi propia consultoría y triplicar mis ingresos en 6 meses.',
      course: 'Diseño de Turbomáquinas'
    },
    {
      name: 'Sofia Ramirez',
      role: 'Investigadora',
      company: 'Universidad Nacional',
      image: 'SR',
      rating: 5,
      text: 'El programa de fundamentos me permitió tener bases sólidas para mi doctorado. Los instructores son verdaderos expertos en la materia.',
      course: 'Fundamentos de Ingeniería'
    }
  ];

  const companies = [
    'Antamina', 'Cerro Verde', 'Las Bambas', 'Yanacocha', 'Bechtel',
    'Fluor', 'Jacobs', 'Repsol', 'Pluspetrol', 'Hunt Oil',
    'Nestle', 'Gloria', 'Backus', 'Schlumberger', 'Halliburton'
  ];

  const achievements = [
    {
      icon: Users,
      title: '15,000+ Estudiantes',
      subtitle: 'En 15 países de Latinoamérica',
      color: 'text-blue-600'
    },
    {
      icon: Building,
      title: '150+ Empresas',
      subtitle: 'Confían en nuestros programas',
      color: 'text-green-600'
    },
    {
      icon: Award,
      title: '95% Satisfacción',
      subtitle: 'Rating promedio de nuestros cursos',
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      title: '80% Promociones',
      subtitle: 'De nuestros estudiantes en 12 meses',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Testimonios de Éxito
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Historias de transformación profesional
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce cómo nuestros estudiantes han acelerado sus carreras y transformado sus vidas profesionales
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-white flex items-center justify-center ${achievement.color}`}>
                <achievement.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {achievement.title}
              </h3>
              <p className="text-sm text-gray-600">
                {achievement.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative">
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              {/* Course Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {testimonial.course}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Companies Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Empresas donde trabajan nuestros estudiantes
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            {companies.map((company, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Video Testimonial Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Escucha más historias de éxito
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre cómo nuestros estudiantes han logrado ascensos, aumentos salariales y nuevas oportunidades profesionales
          </p>

          <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                <h4 className="font-semibold mb-1">Testimonios de Estudiantes 2024</h4>
                <p className="text-sm text-gray-200">15+ historias inspiradoras de transformación profesional</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            📹 Nuevos testimonios cada mes • 🎯 Casos reales • ✅ Resultados verificables
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;