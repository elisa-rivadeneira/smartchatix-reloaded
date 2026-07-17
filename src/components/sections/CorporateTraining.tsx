'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Building,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { corporateTraining } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CorporateContactFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  employeesCount: string;
  trainingNeeds: string;
  timeline: string;
  message: string;
}

const CorporateTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CorporateContactFormData>();

  const handleFormSubmit = async (data: CorporateContactFormData) => {
    setIsLoading(true);
    try {
      // Here you would integrate with your CRM or email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Corporate training inquiry:', data);
      setIsFormSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting corporate form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Building, value: '150+', label: 'Empresas capacitadas' },
    { icon: Users, value: '5,000+', label: 'Profesionales formados' },
    { icon: TrendingUp, value: '95%', label: 'Satisfacción del cliente' },
    { icon: Award, value: '98%', label: 'Tasa de finalización' },
  ];

  const industries = [
    { name: 'Minería', icon: '⛏️', companies: ['Antamina', 'Cerro Verde', 'Las Bambas'] },
    { name: 'Petróleo y Gas', icon: '🛢️', companies: ['Repsol', 'Pluspetrol', 'Hunt Oil'] },
    { name: 'Manufactura', icon: '🏭', companies: ['Nestle', 'Gloria', 'Backus'] },
    { name: 'Consultoría', icon: '💼', companies: ['Bechtel', 'Fluor', 'Jacobs'] },
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
              ¡Mensaje Enviado Exitosamente!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Hemos recibido tu consulta sobre capacitación empresarial. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Análisis de necesidades de capacitación</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Propuesta personalizada con costos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Cronograma de implementación</span>
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
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Building className="w-4 h-4 mr-2" />
            Capacitación Empresarial
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Impulsa las capacidades de tu equipo de ingeniería
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Programas de capacitación especializados diseñados para empresas mineras, industriales y de consultoría que buscan mejorar la competitividad de sus equipos técnicos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Program Details */}
          <div className="space-y-8">
            {/* Training Programs Tabs */}
            <div>
              <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg mb-6">
                {corporateTraining.map((program, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                      activeTab === index
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600'
                    )}
                  >
                    {program.title.split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>

              {/* Active Program Content */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {corporateTraining[activeTab].title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {corporateTraining[activeTab].description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Características del programa:
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {corporateTraining[activeTab].features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Beneficios para tu empresa:
                  </h4>
                  <div className="space-y-2">
                    {corporateTraining[activeTab].benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Dirigido a:
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {corporateTraining[activeTab].targetAudience.map((audience: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-sm">{audience}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Industries We Serve */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Industrias que atendemos
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {industries.map((industry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{industry.icon}</span>
                      <h4 className="font-semibold text-gray-900">{industry.name}</h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Clientes:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {industry.companies.map((company, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-8">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Solicita información personalizada
                </h3>
                <p className="text-blue-100">
                  Nuestro equipo diseñará un programa específico para tu empresa
                </p>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-4">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la empresa *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    {...register('companyName', { required: 'El nombre de la empresa es requerido' })}
                    className={cn('form-input', errors.companyName ? 'border-red-500' : '')}
                    placeholder="Tu empresa"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del contacto *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    {...register('contactName', { required: 'El nombre del contacto es requerido' })}
                    className={cn('form-input', errors.contactName ? 'border-red-500' : '')}
                    placeholder="Tu nombre completo"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo corporativo *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'El correo es requerido',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
                    })}
                    className={cn('form-input', errors.email ? 'border-red-500' : '')}
                    placeholder="tu.correo@empresa.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone', { required: 'El teléfono es requerido' })}
                    className={cn('form-input', errors.phone ? 'border-red-500' : '')}
                    placeholder="+51 999 999 999"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Employees Count */}
                <div>
                  <label htmlFor="employeesCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de colaboradores a capacitar
                  </label>
                  <select
                    id="employeesCount"
                    {...register('employeesCount')}
                    className="form-select"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="1-10">1 - 10 personas</option>
                    <option value="11-25">11 - 25 personas</option>
                    <option value="26-50">26 - 50 personas</option>
                    <option value="51-100">51 - 100 personas</option>
                    <option value="100+">Más de 100 personas</option>
                  </select>
                </div>

                {/* Training Needs */}
                <div>
                  <label htmlFor="trainingNeeds" className="block text-sm font-medium text-gray-700 mb-2">
                    Área de capacitación de interés
                  </label>
                  <select
                    id="trainingNeeds"
                    {...register('trainingNeeds')}
                    className="form-select"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="bombas">Bombas centrífugas</option>
                    <option value="cfd">CFD y simulación</option>
                    <option value="turbomaquinas">Turbomáquinas</option>
                    <option value="diseno">Diseño mecánico</option>
                    <option value="personalizado">Programa personalizado</option>
                  </select>
                </div>

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Plazo deseado para iniciar
                  </label>
                  <select
                    id="timeline"
                    {...register('timeline')}
                    className="form-select"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="inmediato">Inmediatamente</option>
                    <option value="1mes">En 1 mes</option>
                    <option value="3meses">En 3 meses</option>
                    <option value="6meses">En 6 meses</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje adicional
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    className="form-textarea"
                    placeholder="Cuéntanos sobre tus necesidades específicas de capacitación..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Solicitar Información'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Trust Signals */}
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    🔒 Información confidencial • 📞 Respuesta en 24 horas
                  </p>
                  <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3" />
                      <span>150+ empresas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>5,000+ capacitados</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateTraining;