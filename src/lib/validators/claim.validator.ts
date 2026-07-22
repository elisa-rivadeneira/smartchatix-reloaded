import { z } from 'zod';

const dniRegex = /^\d{8}$/;
const ceRegex = /^\d{9}$/;
const rucRegex = /^\d{11}$/;

export const createClaimSchema = z.object({
  type: z.enum(['RECLAMO', 'QUEJA']),
  productType: z.enum(['PRODUCTO', 'SERVICIO']),
  productName: z.string().min(3).max(200).transform(val => val.trim()),
  amount: z.number().positive().optional().nullable(),
  firstName: z.string().min(2).max(100).transform(val => val.trim()),
  lastName: z.string().min(2).max(100).transform(val => val.trim()),
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE', 'RUC']),
  documentNumber: z.string().min(1).max(20).transform(val => val.trim()),
  email: z.string().email().max(150).transform(val => val.toLowerCase().trim()),
  phone: z.string().min(9).max(15).transform(val => val.trim()),
  address: z.string().min(10).max(250).transform(val => val.trim()),
  isMinor: z.boolean().default(false),
  guardianName: z.string().max(200).optional().nullable().transform(val => val?.trim() || null),
  description: z.string().min(20).max(2000).transform(val => val.trim()),
  consumerRequest: z.string().min(10).max(2000).transform(val => val.trim()),
  acceptedPolicy: z.boolean().refine(val => val === true)
}).refine(data => {
  if (data.isMinor && !data.guardianName) return false;
  return true;
}, { message: 'Debe ingresar el nombre del representante legal', path: ['guardianName'] })
.refine(data => {
  if (data.documentType === 'DNI') return dniRegex.test(data.documentNumber);
  if (data.documentType === 'CE') return ceRegex.test(data.documentNumber);
  if (data.documentType === 'RUC') return rucRegex.test(data.documentNumber);
  return true;
}, { message: 'Formato de documento inválido', path: ['documentNumber'] });

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
