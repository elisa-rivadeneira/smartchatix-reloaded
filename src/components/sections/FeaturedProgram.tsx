'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const FeaturedProgram: React.FC = () => {
  const program = {
    title: 'SmartChatix PUMP ENGINEER PROGRAM',
    subtitle: 'Programa Especializado en Bombas Centrífugas',
    description: 'Conviértete en un experto en bombas centrífugas con nuestro programa más completo. Aprende selección, operación, simulación CFD y diseño de turbomáquinas aplicado a la industria minera.',
    duration: '165 horas',
    students: '1,200+',
    rating: 4.9,
    price: 1297,
    originalPrice: 1891,
    savings: 594,
    image: '/images/programs/pump-engineer.jpg',
    features: [
      'Selección y dimensionamiento de bombas',
      'Análisis de curvas características H-Q',
      'Cálculo y prevención de NPSH y cavitación',
      'Diseño de redes hidráulicas industriales',
      'Simulación CFD con ANSYS CFX',
      'Diseño de turbomáquinas con CFturbo',
      'Casos prácticos de minería e industria',
      'Certificación profesional'
    ],
    modules: [
      {
        title: 'Fundamentos de Bombas Centrífugas',
        lessons: 12,
        duration: '40 horas'
      },
      {
        title: 'Simulación CFD Avanzada',
        lessons: 15,
        duration: '50 horas'
      },
      {
        title: 'Diseño de Turbomáquinas',
        lessons: 18,
        duration: '45 horas'
      },
      {
        title: 'Redes Hidráulicas con AFT Fathom',
        lessons: 10,
        duration: '30 horas'
      }
    ]
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4 mr-2" />
            Programa Destacado
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {program.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {program.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Program Details */}
          <div className="space-y-8">
            {/* Program Description */}
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Program Stats */}
            <div className="grid grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{program.duration}</div>
                <div className="text-sm text-gray-600">de contenido</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{program.students}</div>
                <div className="text-sm text-gray-600">estudiantes</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{program.rating}</div>
                <div className="text-sm text-gray-600">★ rating</div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Lo que aprenderás:
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {program.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Modules */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Módulos del programa:
              </h3>
              <div className="space-y-3">
                {program.modules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-600">{module.lessons} lecciones</p>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {module.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Program Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">Programa Certificado</h3>
                    <p className="text-sm text-blue-100">Nivel Profesional</p>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Ahorra {formatCurrency(program.savings)}
                </div>
              </div>

              {/* Pricing and CTA */}
              <div className="p-6 space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(program.price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(program.originalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Precio especial de lanzamiento
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link href="/programas/pump-engineer">
                    <Button size="lg" className="w-full">
                      <span>Inscribirme Ahora</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/info-programa">
                    <Button variant="outline" size="lg" className="w-full">
                      Más Información
                    </Button>
                  </Link>
                </div>

                {/* Guarantees */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Acceso de por vida</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Certificado profesional</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Soporte técnico</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>

                {/* Urgency */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-800">
                      ¡Solo quedan 15 cupos disponibles!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProgram;