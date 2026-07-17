'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Play, Calendar, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MasterclassFormData {
  name: string;
  email: string;
  phone: string;
}

const MasterclassSection: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MasterclassFormData>();

  const masterclassDetails = {
    title: 'Cómo Seleccionar Correctamente una Bomba Centrífuga para Minería e Industria',
    subtitle: 'Masterclass gratuita con casos reales y metodología paso a paso',
    instructor: 'Ing. Carlos Rodriguez',
    instructorTitle: 'Especialista en Turbomáquinas con +15 años de experiencia',
    date: 'Jueves 20 de Enero',
    time: '7:00 PM (GMT-5)',
    duration: '90 minutos',
    attendees: '2,500+',
    topics: [
      'Análisis del punto de operación y curvas H-Q',
      'Cálculo correcto del NPSH disponible y requerido',
      'Selección de materiales según el fluido',
      'Criterios de eficiencia energética',
      'Casos de estudio: errores comunes y cómo evitarlos',
      'Sesión de preguntas y respuestas'
    ],
    bonuses: [
      'Grabación de la masterclass por 48 horas',
      'Calculadora de NPSH en Excel',
      'Checklist de selección de bombas',
      'Acceso a comunidad privada de Telegram'
    ]
  };

  const handleRegistration = async (data: MasterclassFormData) => {
    setIsLoading(true);
    try {
      // Here you would integrate with your webinar platform
      // For example: Zoom, GoToWebinar, WebinarJam, etc.
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Masterclass registration:', data);
      setIsRegistered(true);
      reset();
    } catch (error) {
      console.error('Error registering for masterclass:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Te has registrado exitosamente para la masterclass.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Revisa tu correo para el enlace de acceso</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Agrega el evento a tu calendario</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Únete a nuestro grupo de WhatsApp para recordatorios</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                Agregar a Calendario
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline">
                Unirse al Grupo WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Masterclass Details */}
          <div className="text-white space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Play className="w-4 h-4 mr-2" />
              Masterclass Gratuita
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {masterclassDetails.title}
              </h2>
              <p className="text-xl text-blue-100">
                {masterclassDetails.subtitle}
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">CR</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{masterclassDetails.instructor}</h3>
                <p className="text-blue-200 text-sm">{masterclassDetails.instructorTitle}</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Fecha y Hora</span>
                </div>
                <p className="text-blue-100">{masterclassDetails.date}</p>
                <p className="text-blue-100">{masterclassDetails.time}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Duración</span>
                </div>
                <p className="text-blue-100">{masterclassDetails.duration}</p>
              </div>
            </div>

            {/* What You'll Learn */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Lo que aprenderás:</h3>
              <div className="space-y-3">
                {masterclassDetails.topics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-100">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonuses */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">Bonos Exclusivos:</h3>
              <div className="space-y-2">
                {masterclassDetails.bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-yellow-100 text-sm">{bonus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">{masterclassDetails.attendees} registrados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 text-yellow-400">★</div>
                  ))}
                </div>
                <span className="text-blue-100">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:sticky lg:top-8">
            <form onSubmit={handleSubmit(handleRegistration)} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Regístrate GRATIS
                </h3>
                <p className="text-green-100">
                  Acceso inmediato + bonos exclusivos
                </p>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="masterclass-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="masterclass-name"
                    {...register('name', {
                      required: 'El nombre es requerido',
                      minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                    })}
                    className={cn(
                      'form-input',
                      errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    )}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="masterclass-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="masterclass-email"
                    {...register('email', {
                      required: 'El correo es requerido',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un correo válido'
                      }
                    })}
                    className={cn(
                      'form-input',
                      errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    )}
                    placeholder="tu.correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="masterclass-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="masterclass-phone"
                    {...register('phone', {
                      required: 'El WhatsApp es requerido',
                      pattern: {
                        value: /^(\+?51)?[\s-]?9\d{8}$/,
                        message: 'Ingresa un número de WhatsApp válido'
                      }
                    })}
                    className={cn(
                      'form-input',
                      errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    )}
                    placeholder="+51 999 999 999"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Para enviarte recordatorios importantes
                  </p>
                </div>

                {/* Registration Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarme GRATIS'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Trust Signals */}
                <div className="text-center space-y-2 pt-2">
                  <p className="text-xs text-gray-600">
                    🎯 100% Gratuito • 📱 Sin spam • ✅ Acceso inmediato
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{masterclassDetails.attendees} registrados</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Solo {masterclassDetails.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Urgency Message */}
            <div className="mt-6 bg-red-500 text-white rounded-lg p-4 text-center">
              <p className="font-semibold">⚡ ¡Últimos cupos disponibles!</p>
              <p className="text-sm text-red-100">Más de 2,500 ingenieros ya se registraron</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassSection;