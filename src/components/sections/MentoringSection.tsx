'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MessageCircle,
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Calendar,
  Video,
  FileText,
  Award,
  Star
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { mentoringServices } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MentoringContactFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDescription: string;
  timeline: string;
  experience: string;
}

const MentoringSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<MentoringContactFormData>();

  const watchedServiceType = watch('serviceType');

  const handleFormSubmit = async (data: MentoringContactFormData) => {
    setIsLoading(true);
    try {
      // Here you would integrate with your booking system
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Mentoring request:', data);
      setIsFormSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting mentoring form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setValue('serviceType', serviceId);
  };

  const mentors = [
    {
      name: 'Dr. Ana Martinez',
      specialty: 'CFD y Simulación',
      experience: '15+ años',
      companies: ['Boeing', 'Siemens', 'ANSYS'],
      rating: 4.9,
      image: 'AM',
      expertise: ['ANSYS CFX', 'Fluent', 'Turbomáquinas', 'Transferencia de calor']
    },
    {
      name: 'Ing. Carlos Rodriguez',
      specialty: 'Bombas y Turbomáquinas',
      experience: '12+ años',
      companies: ['Schlumberger', 'KSB', 'Grundfos'],
      rating: 4.8,
      image: 'CR',
      expertise: ['Selección de bombas', 'Análisis de rendimiento', 'Mantenimiento', 'NPSH']
    },
    {
      name: 'Dr. Fernando Castro',
      specialty: 'Investigación y Tesis',
      experience: '20+ años',
      companies: ['Universidad de Chile', 'MIT', 'CERN'],
      rating: 5.0,
      image: 'FC',
      expertise: ['Metodología', 'Publicaciones', 'Investigación aplicada', 'Defensa de tesis']
    }
  ];

  const mentoringProcess = [
    {
      step: 1,
      title: 'Evaluación Inicial',
      description: 'Analizamos tu proyecto y objetivos para asignar el mentor ideal',
      icon: User,
      duration: '30 min'
    },
    {
      step: 2,
      title: 'Planificación',
      description: 'Desarrollamos un plan de trabajo personalizado con hitos claros',
      icon: Calendar,
      duration: '1 semana'
    },
    {
      step: 3,
      title: 'Sesiones de Mentoría',
      description: 'Encuentros regulares con tu mentor para guía y retroalimentación',
      icon: Video,
      duration: 'Según programa'
    },
    {
      step: 4,
      title: 'Seguimiento y Resultados',
      description: 'Evaluación continua del progreso y ajustes al plan si es necesario',
      icon: FileText,
      duration: 'Continuo'
    }
  ];

  if (isFormSubmitted) {
    return (
      <section className="py-20 bg-green-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Solicitud de Mentoría Enviada!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Hemos recibido tu solicitud. Nuestro equipo revisará tu proyecto y te contactará en las próximas 24 horas para programar una sesión de evaluación gratuita.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Revisión de tu solicitud y proyecto</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Asignación del mentor especializado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Programación de sesión inicial gratuita</span>
                </li>
              </ul>
            </div>
            <Button>
              Volver al Inicio
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mentorías Personalizadas
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Acelera tu proyecto con un mentor experto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Recibe asesoría personalizada de profesionales con experiencia real en la industria para CFD, bombas, tesis, simulación y turbomáquinas
          </p>
        </div>

        {/* Mentoring Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {mentoringServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={cn(
                'group bg-white rounded-xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                selectedService === service.id
                  ? 'border-purple-500 ring-2 ring-purple-200'
                  : 'border-gray-100 hover:border-purple-300'
              )}
            >
              {/* Service Icon */}
              <div className={cn(
                'aspect-square bg-gradient-to-br from-purple-500 to-indigo-600 relative overflow-hidden',
                selectedService === service.id ? 'from-purple-600 to-indigo-700' : ''
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white">
                    {service.type === 'CFD' ? '🌊' :
                     service.type === 'Bombas' ? '⚙️' :
                     service.type === 'Tesis' ? '📚' :
                     service.type === 'Simulación' ? '💻' : '🔧'}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white font-medium">
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {service.features.slice(0, 3).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(service.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Desde {formatCurrency(Math.round(service.price / 4))}/semana
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentors Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Conoce a nuestros mentores
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {mentor.image}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{mentor.name}</h4>
                <p className="text-purple-600 font-medium text-sm mb-2">{mentor.specialty}</p>
                <p className="text-gray-600 text-sm mb-3">{mentor.experience} de experiencia</p>

                <div className="flex items-center justify-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{mentor.rating}</span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <strong>Experiencia:</strong> {mentor.companies.join(', ')}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Especialidades:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {mentor.expertise.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Proceso de mentoría
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {mentoringProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <span className="text-xs text-purple-600 font-medium">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">
                Solicita tu mentoría personalizada
              </h3>
              <p className="text-purple-100">
                Primera sesión de evaluación completamente gratuita
              </p>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className={cn('form-input', errors.name ? 'border-red-500' : '')}
                  placeholder="Tu nombre completo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'El correo es requerido',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
                  })}
                  className={cn('form-input', errors.email ? 'border-red-500' : '')}
                  placeholder="tu.correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', { required: 'El WhatsApp es requerido' })}
                  className={cn('form-input', errors.phone ? 'border-red-500' : '')}
                  placeholder="+51 999 999 999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de mentoría *
                </label>
                <select
                  id="serviceType"
                  {...register('serviceType', { required: 'Selecciona un tipo de mentoría' })}
                  className={cn('form-select', errors.serviceType ? 'border-red-500' : '')}
                >
                  <option value="">Selecciona una opción</option>
                  {mentoringServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} - {formatCurrency(service.price)}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de experiencia
                </label>
                <select
                  id="experience"
                  {...register('experience')}
                  className="form-select"
                >
                  <option value="">Selecciona tu nivel</option>
                  <option value="principiante">Principiante (0-2 años)</option>
                  <option value="intermedio">Intermedio (3-5 años)</option>
                  <option value="avanzado">Avanzado (5+ años)</option>
                  <option value="estudiante">Estudiante</option>
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuándo te gustaría empezar?
                </label>
                <select
                  id="timeline"
                  {...register('timeline')}
                  className="form-select"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="inmediato">Esta semana</option>
                  <option value="proximasemana">Próxima semana</option>
                  <option value="esemes">Este mes</option>
                  <option value="proximomes">Próximo mes</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe tu proyecto o necesidad *
                </label>
                <textarea
                  id="projectDescription"
                  {...register('projectDescription', { required: 'La descripción del proyecto es requerida' })}
                  className={cn('form-textarea', errors.projectDescription ? 'border-red-500' : '')}
                  placeholder="Cuéntanos sobre tu proyecto, objetivos, desafíos específicos y qué esperas lograr con la mentoría..."
                  rows={4}
                />
                {errors.projectDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectDescription.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Enviando solicitud...' : 'Solicitar Mentoría'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Trust Signals */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  🎯 Primera sesión gratuita • 📞 Respuesta en 24 horas • 🔒 Información confidencial
                </p>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>Mentores expertos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>100% personalizado</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MentoringSection;