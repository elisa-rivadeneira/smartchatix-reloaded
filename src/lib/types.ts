// Tipos de base de datos

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  price_vivo: number | null;
  price_grabado: number | null;
  duration: string | null;
  instructor_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  order_index: number;
  created_at: Date;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string | null;
  content_type: 'video' | 'document' | 'quiz' | 'assignment';
  video_url: string | null;
  document_url: string | null;
  duration: string | null;
  order_index: number;
  is_free: boolean;
  created_at: Date;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  modality: 'vivo' | 'grabado';
  payment_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  enrolled_at: Date;
  expires_at: Date | null;
}

export interface Progress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed: boolean;
  completed_at: Date | null;
  last_position: number;
  updated_at: Date;
}
