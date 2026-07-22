export type DocumentType = 'DNI' | 'CE' | 'PASAPORTE' | 'RUC';
export type ProductType = 'PRODUCTO' | 'SERVICIO';
export type ClaimType = 'RECLAMO' | 'QUEJA';
export type ClaimStatus = 'PENDIENTE' | 'EN_PROCESO' | 'ATENDIDO' | 'ARCHIVADO';

export interface Claim {
  id: number;
  claimCode: string;
  createdAt: Date;
  updatedAt: Date;
  status: ClaimStatus;
  type: ClaimType;
  productType: ProductType;
  productName: string;
  amount: number | null;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string | null;
  description: string;
  consumerRequest: string;
  ipAddress: string;
  userAgent: string;
  isMinor: boolean;
}

export interface CreateClaimInput {
  type: ClaimType;
  productType: ProductType;
  productName: string;
  amount?: number;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor: boolean;
  guardianName?: string;
  description: string;
  consumerRequest: string;
  acceptedPolicy: boolean;
}

export interface ClaimFilters {
  search?: string;
  status?: ClaimStatus;
  type?: ClaimType;
  startDate?: string;
  endDate?: string;
  orderBy?: 'createdAt' | 'claimCode';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ClaimListResponse {
  claims: Claim[];
  total: number;
  page: number;
  totalPages: number;
}
