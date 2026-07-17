'use client';

import React from 'react';
import { Download, FileText, CheckCircle, Users, Award } from 'lucide-react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

const LeadMagnetSection: React.FC = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: 'Evita Errores Costosos',
      description: 'Identifica los 10 errores más comunes que pueden costarte miles de dólares en mantenimiento y reemplazos'
    },
    {
      icon: Users,
      title: 'Basado en Experiencia Real',
      description: 'Casos de estudio de proyectos mineros e industriales reales con más de 15 años de experiencia'
    },
    {
      icon: Award,
      title: 'Metodología Probada',
      description: 'Framework paso a paso utilizado por ingenieros en empresas líderes de la industria'
    }
  ];

  const handleLeadSubmit = async (data: any) => {
    // Here you would integrate with your email marketing service
    // For example: Mailchimp, ConvertKit, etc.
    console.log('Lead captured:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // You could also trigger events for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-XXXXXXXXX/XXXXXXXXX'
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <Download className="w-4 h-4 mr-2" />
                Descarga Gratuita
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="text-red-600">10 Errores Comunes</span>
                <br />
                al Seleccionar una
                <br />
                <span className="text-primary-600">Bomba Centrífuga</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Guía práctica de 25 páginas que te ayudará a evitar los errores más costosos
                en la selección de bombas centrífugas para aplicaciones mineras e industriales.
              </p>
            </div>

            {/* Guide Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contenido de la Guía
                  </h3>
                  <p className="text-sm text-gray-600">
                    25 páginas • PDF descargable • Casos reales
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Capítulos incluidos:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Selección por punto de operación</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Cálculo incorrecto del NPSH</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Ignorar la cavitación</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Material inadecuado</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Casos de estudio:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Proyecto minero - Perú</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Planta industrial - Chile</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Sistema de agua - Colombia</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Checklist de verificación</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                ¿Por qué necesitas esta guía?
              </h3>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <benefit.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Lo que dicen nuestros estudiantes:</h4>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-4 h-4 text-yellow-400 fill-current">★</div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                </div>
              </div>
              <blockquote className="text-sm text-gray-600 italic">
                "Esta guía me ahorró semanas de investigación y me ayudó a evitar un error
                que hubiera costado más de $50,000 en mi proyecto."
              </blockquote>
              <cite className="text-xs text-gray-500 mt-2 block">
                - Ing. Carlos Rodriguez, Jefe de Mantenimiento, Minera del Sur
              </cite>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="lg:sticky lg:top-8">
            <LeadCaptureForm
              title="Descarga tu Guía Gratuita"
              subtitle="10 Errores Comunes al Seleccionar una Bomba Centrífuga"
              leadMagnet="Guía PDF de 25 páginas con casos reales"
              onSubmit={handleLeadSubmit}
              className="max-w-md mx-auto lg:max-w-none"
            />

            {/* Trust Signals Below Form */}
            <div className="mt-6 text-center space-y-3">
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>15,000+ descargas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>4.9★ rating</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Únete a más de 15,000 ingenieros que ya descargaron esta guía
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;