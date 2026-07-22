import { claimRepository } from '@/lib/repositories/claim.repository';

export class ClaimCodeService {
  async generateUniqueCode(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const sequenceNumber = await claimRepository.getNextSequenceNumber(currentYear);

    const paddedNumber = sequenceNumber.toString().padStart(6, '0');
    const claimCode = `LR-${currentYear}-${paddedNumber}`;

    const existing = await claimRepository.findByCode(claimCode);
    if (existing) {
      return this.generateUniqueCode();
    }

    return claimCode;
  }

  validateCodeFormat(code: string): boolean {
    const regex = /^LR-\d{4}-\d{6}$/;
    return regex.test(code);
  }

  extractYearFromCode(code: string): number | null {
    const match = code.match(/^LR-(\d{4})-\d{6}$/);
    return match ? parseInt(match[1], 10) : null;
  }

  extractSequenceFromCode(code: string): number | null {
    const match = code.match(/^LR-\d{4}-(\d{6})$/);
    return match ? parseInt(match[1], 10) : null;
  }
}

export const claimCodeService = new ClaimCodeService();
