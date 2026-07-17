import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import type { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUsers = await query<User>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Insertar usuario
    await query(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name, 'student']
    );

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
