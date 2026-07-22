'use server';

import { headers } from 'next/headers';
import { createClaimSchema, updateClaimStatusSchema, claimFiltersSchema } from '@/lib/validators/claim.validator';
import { claimRepository } from '@/lib/repositories/claim.repository';
import { claimCodeService } from '@/lib/services/claim-code.service';
import { claimEmailService } from '@/lib/services/claim-email.service';
import type { CreateClaimInput } from '@/types/claims';
import type { ClaimStatus, ClaimFilters } from '@/types/claims';

export async function createClaim(data: CreateClaimInput) {
  try {
    const validated = createClaimSchema.parse(data);

    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
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
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
    });

    await Promise.all([
      claimEmailService.sendConsumerConfirmation(claim),
      claimEmailService.sendAdminNotification(claim),
    ]);

    return {
      success: true,
      data: claim,
    };
  } catch (error: any) {
    console.error('Error creating claim:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Datos de formulario inválidos',
        details: error.errors,
      };
    }

    return {
      success: false,
      error: 'Error al registrar el reclamo. Por favor intente nuevamente.',
    };
  }
}

export async function getClaim(id: number) {
  try {
    const claim = await claimRepository.findById(id);
    return {
      success: true,
      data: claim,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al obtener el reclamo',
    };
  }
}

export async function getClaimByCode(code: string) {
  try {
    const claim = await claimRepository.findByCode(code);

    if (!claim) {
      return {
        success: false,
        error: 'Reclamo no encontrado',
      };
    }

    return {
      success: true,
      data: claim,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error al obtener el reclamo',
    };
  }
}

export async function getAllClaims(filters: ClaimFilters) {
  try {
    const validated = claimFiltersSchema.parse(filters);
    const result = await claimRepository.findAll(validated);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Error getting claims:', error);
    return {
      success: false,
      error: 'Error al obtener los reclamos',
    };
  }
}

export async function updateClaimStatus(id: number, status: ClaimStatus) {
  try {
    const validated = updateClaimStatusSchema.parse({ id, status });
    await claimRepository.updateStatus(validated.id, validated.status);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error updating claim status:', error);

    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Datos inválidos',
        details: error.errors,
      };
    }

    return {
      success: false,
      error: 'Error al actualizar el estado del reclamo',
    };
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

    return {
      success: true,
      data: {
        total,
        pendiente,
        enProceso,
        atendido,
      },
    };
  } catch (error: any) {
    console.error('Error getting claim stats:', error);
    return {
      success: false,
      error: 'Error al obtener las estadísticas',
    };
  }
}

export async function exportClaimsToCSV(filters: ClaimFilters) {
  try {
    const validated = claimFiltersSchema.parse(filters);
    const claims = await claimRepository.exportToCSV(validated);

    const headers = [
      'Código',
      'Fecha',
      'Estado',
      'Tipo',
      'Tipo de Bien',
      'Producto/Servicio',
      'Monto',
      'Nombres',
      'Apellidos',
      'Tipo Doc.',
      'Nro. Doc.',
      'Email',
      'Teléfono',
      'Dirección',
      'Descripción',
      'Pedido',
    ];

    const rows = claims.map(claim => [
      claim.claimCode,
      new Date(claim.createdAt).toLocaleString('es-PE'),
      claim.status,
      claim.type,
      claim.productType,
      claim.productName,
      claim.amount ? `S/ ${claim.amount.toFixed(2)}` : '',
      claim.firstName,
      claim.lastName,
      claim.documentType,
      claim.documentNumber,
      claim.email,
      claim.phone,
      claim.address,
      claim.description,
      claim.consumerRequest,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return {
      success: true,
      data: csvContent,
    };
  } catch (error: any) {
    console.error('Error exporting claims:', error);
    return {
      success: false,
      error: 'Error al exportar los reclamos',
    };
  }
}
