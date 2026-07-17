export interface Course {
  id?: string;
  title: string;
  description: string;
  shortDescription?: string;
  duration: string;
  price: string | number;
  normalPrice?: string;
  originalPrice?: number;
  transformation?: string;
  slug?: string;
  category?: string;
  level?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  studentsCount?: number;
  rating?: number;
  instructor?: string;
  image?: string;
  thumbnail?: string;
  modules?: any[];
  lessons?: any[];
  is_certification_enabled?: boolean;
  passing_score?: number;
  certificate_template?: string;
  [key: string]: any;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface Persona {
  type: string;
  description: string;
  path: string;
  cta: string;
}

export interface Story {
  role: string;
  before: string;
  after: string;
  tool: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  interests?: string[];
}

export interface LearningPath {
  [key: string]: any;
}

export interface CorporateTraining {
  [key: string]: any;
}

export interface MentoringService {
  id: string;
  type: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
  [key: string]: any;
}
