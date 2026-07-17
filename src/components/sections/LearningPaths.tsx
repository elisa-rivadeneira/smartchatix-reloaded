'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import { learningPaths } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

const LearningPaths: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rutas de Aprendizaje
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Acelera tu carrera profesional
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Programas estructurados que te llevan desde principiante hasta experto en áreas específicas de la ingeniería
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {learningPaths.map((path, index) => (
            <div
              key={path.id}
              className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Path Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Path Icon/Number */}
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Savings Badge */}
                {path.originalPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{Math.round((1 - path.price / path.originalPrice) * 100)}%
                  </div>
                )}

                {/* Path Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/80" />
                </div>

                {/* Level Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white font-medium">
                    {path.level}
                  </span>
                </div>
              </div>

              {/* Path Content */}
              <div className="p-6 space-y-4">
                {/* Path Title */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                {/* Path Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{path.totalDuration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{path.courses.length} cursos</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(path.price)}
                        </span>
                        {path.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(path.originalPrice)}
                          </span>
                        )}
                      </div>
                      {path.originalPrice && (
                        <p className="text-xs text-green-600 font-medium">
                          Ahorras {formatCurrency(path.originalPrice - path.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/programas/${path.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary-50 group-hover:border-primary-300 group-hover:text-primary-700"
                    >
                      <span>Ver Programa</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ¿No estás seguro qué ruta elegir?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Nuestros asesores académicos te ayudan a encontrar el programa perfecto según tu experiencia y objetivos profesionales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/asesoria">
                <Button size="lg">
                  Hablar con un Asesor
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/quiz-carrera">
                <Button variant="outline" size="lg">
                  Test de Orientación Gratuito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;