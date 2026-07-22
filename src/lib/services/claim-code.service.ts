import { claimRepository } from '@/lib/repositories/claim.repository';

export class ClaimCodeService {
  async generateUniqueCode(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const sequenceNumber = await claimRepository.getNextSequenceNumber(currentYear);
    const paddedNumber = sequenceNumber.toString().padStart(6, '0');
    return `LR-${currentYear}-${paddedNumber}`;
  }
}

export const claimCodeService = new ClaimCodeService();
