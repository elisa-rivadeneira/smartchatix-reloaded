import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

interface ActivationToken {
  id: number;
  email: string;
  token: string;
  course_id: number;
  modality: 'vivo' | 'grabado';
  payment_amount: number;
  used: boolean;
  expires_at: Date;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, phone, password } = body;

    if (!token || !name || !phone || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const activationToken = await queryOne<ActivationToken>(
      'SELECT * FROM activation_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
      [token]
    );

    if (!activationToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    const existingUser = await queryOne<User>(
      'SELECT id FROM users WHERE email = ?',
      [activationToken.email]
    );

    const passwordHash = await hashPassword(password);

    let userId: number;

    if (existingUser) {
      await query(
        'UPDATE users SET password_hash = ?, name = ?, phone = ?, is_active = TRUE WHERE id = ?',
        [passwordHash, name, phone, existingUser.id]
      );
      userId = existingUser.id;
    } else {
      const result: any = await query(
        'INSERT INTO users (email, password_hash, name, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [activationToken.email, passwordHash, name, phone, 'student', true]
      );
      userId = result.insertId;
    }

    await query(
      'INSERT INTO enrollments (user_id, course_id, modality, payment_amount, payment_status) VALUES (?, ?, ?, ?, ?)',
      [userId, activationToken.course_id, activationToken.modality, activationToken.payment_amount, 'completed']
    );

    await query(
      'UPDATE activation_tokens SET used = TRUE WHERE id = ?',
      [activationToken.id]
    );

    const user = await queryOne<User>(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('Error al recuperar usuario');
    }

    const authToken = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'instructor' | 'admin'
    });

    const response = NextResponse.json({
      message: 'Cuenta activada exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set('auth_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error en activación:', error);
    return NextResponse.json(
      { error: 'Error al activar cuenta' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      );
    }

    const activationToken = await queryOne<ActivationToken>(
      'SELECT email, used, expires_at FROM activation_tokens WHERE token = ?',
      [token]
    );

    if (!activationToken) {
      return NextResponse.json(
        { error: 'Token no encontrado' },
        { status: 404 }
      );
    }

    if (activationToken.used) {
      return NextResponse.json(
        { error: 'Token ya utilizado' },
        { status: 400 }
      );
    }

    if (new Date(activationToken.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      email: activationToken.email,
      valid: true
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    return NextResponse.json(
      { error: 'Error al verificar token' },
      { status: 500 }
    );
  }
}
