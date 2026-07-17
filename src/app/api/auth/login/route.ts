import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import type { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

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
