import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      );
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe otro usuario con ese email' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name || 'Usuario', email, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el usuario', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    await query('DELETE FROM enrollments WHERE user_id = ?', [userId]);
    await query('DELETE FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el usuario', details: error.message },
      { status: 500 }
    );
  }
}
