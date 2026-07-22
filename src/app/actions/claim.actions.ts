'use server';

import { headers } from 'next/headers';
import { createClaimSchema } from '@/lib/validators/claim.validator';
import { claimRepository } from '@/lib/repositories/claim.repository';
import { claimCodeService } from '@/lib/services/claim-code.service';
import { claimEmailService } from '@/lib/services/claim-email.service';
import type { CreateClaimInput, ClaimStatus, ClaimFilters } from '@/types/claims';

export async function createClaim(data: CreateClaimInput) {
  try {
    const validated = createClaimSchema.parse(data);

    const headersList = await headers();
    const ipAddress = (headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1').split(',')[0].trim();
    const userAgent = headersList.get('user-agent') || 'Unknown';

    const claimCode = await claimCodeService.generateUniqueCode();

    const claim = await claimRepository.create({
      claimCode,
      status: 'PENDIENTE',
      type: validated.type,
      productType: validated.productType,
      productName: validated.productName,
      amount: validated.amount || null,
      firstName: validated.firstName,
      lastName: validated.lastName,
      documentType: validated.documentType,
      documentNumber: validated.documentNumber,
      email: validated.email,
      phone: validated.phone,
      address: validated.address,
      isMinor: validated.isMinor,
      guardianName: validated.guardianName || null,
      description: validated.description,
      consumerRequest: validated.consumerRequest,
      ipAddress,
      userAgent,
    });

    await Promise.all([
      claimEmailService.sendConsumerConfirmation(claim),
      claimEmailService.sendAdminNotification(claim),
    ]);

    return { success: true, data: claim };
  } catch (error: any) {
    console.error('Error creating claim:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

    if (error.name === 'ZodError') {
      const firstError = error.errors[0];
      let errorMessage = 'Datos inválidos';

      if (firstError.path.includes('phone')) {
        errorMessage = 'El teléfono debe tener entre 9 y 15 dígitos';
      } else if (firstError.path.includes('description')) {
        errorMessage = 'La descripción debe tener al menos 20 caracteres';
      } else if (firstError.path.includes('consumerRequest')) {
        errorMessage = 'El pedido debe tener al menos 10 caracteres';
      } else if (firstError.path.includes('documentNumber')) {
        errorMessage = 'Formato de documento inválido (DNI: 8 dígitos, CE: 9 dígitos, RUC: 11 dígitos)';
      }

      return {
        success: false,
        error: errorMessage,
        details: error.errors,
      };
    }

    return {
      success: false,
      error: 'Error al registrar el reclamo',
      details: error.message || error.errors,
    };
  }
}

export async function getClaim(id: number) {
  try {
    const claim = await claimRepository.findById(id);
    return { success: true, data: claim };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClaimByCode(code: string) {
  try {
    const claim = await claimRepository.findByCode(code);
    if (!claim) return { success: false, error: 'Reclamo no encontrado' };
    return { success: true, data: claim };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllClaims(filters: ClaimFilters) {
  try {
    const result = await claimRepository.findAll(filters);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: 'Error al obtener reclamos' };
  }
}

export async function updateClaimStatus(id: number, status: ClaimStatus) {
  try {
    await claimRepository.updateStatus(id, status);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Error al actualizar estado' };
  }
}

export async function getClaimStats() {
  try {
    const [total, pendiente, enProceso, atendido] = await Promise.all([
      claimRepository.countByStatus(),
      claimRepository.countByStatus('PENDIENTE'),
      claimRepository.countByStatus('EN_PROCESO'),
      claimRepository.countByStatus('ATENDIDO'),
    ]);
    return { success: true, data: { total, pendiente, enProceso, atendido } };
  } catch (error: any) {
    return { success: false, error: 'Error al obtener estadísticas' };
  }
}

export async function exportClaimsToCSV(filters: ClaimFilters) {
  try {
    const result = await claimRepository.findAll({ ...filters, limit: 10000 });
    const headers = ['Código', 'Fecha', 'Estado', 'Tipo', 'Producto', 'Nombres', 'Email'];
    const rows = result.claims.map(c => [
      c.claimCode,
      new Date(c.createdAt).toLocaleString('es-PE'),
      c.status,
      c.type,
      c.productName,
      `${c.firstName} ${c.lastName}`,
      c.email
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    return { success: true, data: csvContent };
  } catch (error: any) {
    return { success: false, error: 'Error al exportar' };
  }
}
