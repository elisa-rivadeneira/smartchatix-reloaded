import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT password_hash FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'La contraseña actual es incorrecta' },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, decoded.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Error al cambiar la contraseña', details: error.message },
      { status: 500 }
    );
  }
}
