import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, is_active } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users (name, email, password_hash, role, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email, hashedPassword, role || 'student', is_active !== false]
    );

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente'
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario', details: error.message },
      { status: 500 }
    );
  }
}
