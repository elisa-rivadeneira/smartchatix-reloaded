import Culqi from 'culqi-node';

const culqi = new Culqi({
  privateKey: process.env.CULQI_SECRET_KEY || '',
  publicKey: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || '',
  pciCompliant: true
});

export default culqi;

export interface CulqiTokenData {
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
}

export interface CulqiChargeData {
  amount: number;
  currency_code: string;
  email: string;
  source_id: string;
  description: string;
  metadata?: {
    course_slug?: string;
    course_title?: string;
    modality?: string;
    student_name?: string;
    student_phone?: string;
  };
}
