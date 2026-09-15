import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import type { User } from '@/lib/types';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

// Nota: en memoria del proceso — suficiente para un solo servidor (como el actual),
// no persiste entre reinicios ni se comparte entre múltiples instancias.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

function isBlocked(ip: string): number | null {
  const record = loginAttempts.get(ip);
  if (!record) return null;

  const now = Date.now();
  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return null;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return record.resetAt - now;
  }

  return null;
}

function registerFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    record.count += 1;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const blockedForMs = isBlocked(ip);
    if (blockedForMs !== null) {
      const minutesLeft = Math.ceil(blockedForMs / 60000);
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} minuto(s).` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      registerFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      registerFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Login exitoso: limpiar intentos fallidos previos de esta IP
    loginAttempts.delete(ip);

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Crear respuesta con cookie HttpOnly
    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Establecer cookie con el token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
