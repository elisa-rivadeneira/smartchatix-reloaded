import { z } from 'zod';

const dniRegex = /^\d{8}$/;
const ceRegex = /^\d{9}$/;
const rucRegex = /^\d{11}$/;
const phoneRegex = /^9\d{8}$/;

export const createClaimSchema = z.object({
  type: z.enum(['RECLAMO', 'QUEJA'], {
    required_error: 'Debe seleccionar el tipo de registro'
  }),
  productType: z.enum(['PRODUCTO', 'SERVICIO'], {
    required_error: 'Debe seleccionar el tipo de bien contratado'
  }),
  productName: z.string()
    .min(3, 'El nombre del producto o servicio debe tener al menos 3 caracteres')
    .max(200, 'El nombre del producto o servicio no puede exceder 200 caracteres')
    .transform(val => val.trim()),
  amount: z.number()
    .positive('El monto debe ser positivo')
    .optional()
    .nullable(),
  firstName: z.string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(100, 'Los nombres no pueden exceder 100 caracteres')
    .transform(val => val.trim()),
  lastName: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .transform(val => val.trim()),
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE', 'RUC'], {
    required_error: 'Debe seleccionar el tipo de documento'
  }),
  documentNumber: z.string()
    .min(1, 'El número de documento es obligatorio')
    .max(20, 'El número de documento no puede exceder 20 caracteres')
    .transform(val => val.trim()),
  email: z.string()
    .email('Ingrese un correo electrónico válido')
    .max(150, 'El correo no puede exceder 150 caracteres')
    .transform(val => val.toLowerCase().trim()),
  phone: z.string()
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .transform(val => val.trim()),
  address: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(250, 'La dirección no puede exceder 250 caracteres')
    .transform(val => val.trim()),
  isMinor: z.boolean().default(false),
  guardianName: z.string()
    .max(200, 'El nombre del representante no puede exceder 200 caracteres')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  description: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .transform(val => val.trim()),
  consumerRequest: z.string()
    .min(10, 'El pedido debe tener al menos 10 caracteres')
    .max(2000, 'El pedido no puede exceder 2000 caracteres')
    .transform(val => val.trim()),
  acceptedPolicy: z.boolean()
    .refine(val => val === true, {
      message: 'Debe aceptar la política de privacidad para continuar'
    })
}).refine(data => {
  if (data.isMinor && !data.guardianName) {
    return false;
  }
  return true;
}, {
  message: 'Debe ingresar el nombre del representante legal para menores de edad',
  path: ['guardianName']
}).refine(data => {
  if (data.documentType === 'DNI') {
    return dniRegex.test(data.documentNumber);
  }
  if (data.documentType === 'CE') {
    return ceRegex.test(data.documentNumber);
  }
  if (data.documentType === 'RUC') {
    return rucRegex.test(data.documentNumber);
  }
  return true;
}, {
  message: 'El formato del documento no es válido',
  path: ['documentNumber']
});

export const updateClaimStatusSchema = z.object({
  id: z.number().positive(),
  status: z.enum(['PENDIENTE', 'EN_PROCESO', 'ATENDIDO', 'ARCHIVADO'])
});

export const claimFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDIENTE', 'EN_PROCESO', 'ATENDIDO', 'ARCHIVADO']).optional(),
  type: z.enum(['RECLAMO', 'QUEJA']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  orderBy: z.enum(['createdAt', 'claimCode']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20)
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimStatusInput = z.infer<typeof updateClaimStatusSchema>;
export type ClaimFiltersInput = z.infer<typeof claimFiltersSchema>;
