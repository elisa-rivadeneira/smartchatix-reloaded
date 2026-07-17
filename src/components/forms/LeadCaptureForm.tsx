'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Download, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { LeadFormData } from '@/types';

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  leadMagnet?: string;
  className?: string;
  onSubmit?: (data: LeadFormData) => Promise<void>;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  title = "Descarga tu Guía Gratuita",
  subtitle = "10 Errores Comunes al Seleccionar una Bomba Centrífuga",
  leadMagnet = "Guía PDF de 25 páginas con casos reales",
  className,
  onSubmit
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LeadFormData>();

  const handleFormSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default submission logic
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        console.log('Lead captured:', data);
      }
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-xl p-8 text-center", className)}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Gracias por tu interés!
        </h3>
        <p className="text-gray-600 mb-6">
          Hemos enviado la guía a tu correo electrónico. También recibirás contenido exclusivo sobre ingeniería y CFD.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Próximo paso:</strong> Revisa tu bandeja de entrada y asegúrate de agregar nuestro correo a tu lista de contactos seguros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white text-center">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Download className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100">{subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
        {/* Lead Magnet Description */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Lo que recibirás:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{leadMagnet}</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Casos de estudio de la industria minera</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Checklist de selección de bombas</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Acceso a webinars exclusivos</span>
            </li>
          </ul>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
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
        </div>

        {/* Company Field */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Empresa (opcional)
          </label>
          <input
            type="text"
            id="company"
            {...register('company')}
            className="form-input"
            placeholder="Nombre de tu empresa"
          />
        </div>

        {/* Interests Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Áreas de interés
          </label>
          <div className="space-y-2">
            {[
              'Bombas centrífugas',
              'CFD y simulación',
              'Turbomáquinas',
              'Redes hidráulicas',
              'Capacitación empresarial'
            ].map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={interest}
                  {...register('interests')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            Al enviar este formulario, aceptas recibir comunicaciones de SmartChatix.
            Puedes cancelar la suscripción en cualquier momento.{' '}
            <a href="/privacidad" className="text-primary-600 hover:underline">
              Ver política de privacidad
            </a>
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Descargar Guía Gratuita'}
        </Button>

        {/* Trust Signals */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            🔒 Información segura • 📧 Sin spam • ✅ Descarga inmediata
          </p>
        </div>
      </form>
    </div>
  );
};

export default LeadCaptureForm;