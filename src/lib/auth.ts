import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const SALT_ROUNDS = 10;

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verificar contraseña
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generar JWT token
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token válido por 7 días
  });
}

// Verificar JWT token
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

// Extraer token de cookies
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies['auth_token'] || null;
}
