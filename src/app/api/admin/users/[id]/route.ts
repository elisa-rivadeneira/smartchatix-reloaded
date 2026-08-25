import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      values.push(body.name);
    }

    if (body.email !== undefined) {
      const existingUser = await query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [body.email, userId]
      );

      if (existingUser && existingUser.length > 0) {
        return NextResponse.json(
          { error: 'Ya existe otro usuario con ese email' },
          { status: 400 }
        );
      }

      updates.push('email = ?');
      values.push(body.email);
    }

    if (body.role !== undefined && ['student', 'instructor', 'admin'].includes(body.role)) {
      updates.push('role = ?');
      values.push(body.role);
    }

    if (typeof body.is_active === 'boolean') {
      updates.push('is_active = ?');
      values.push(body.is_active);
    }

    if (body.password && body.password.trim() !== '') {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updates.push('password_hash = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay cambios para actualizar' }, { status: 400 });
    }

    values.push(userId);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
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
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    const userToDelete = await query('SELECT role FROM users WHERE id = ?', [userId]);
    if (!userToDelete || userToDelete.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (decoded.id === userId) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Eliminando usuario ID: ${userId}`);

    await query('DELETE FROM quiz_responses WHERE user_id = ?', [userId]);
    await query('DELETE FROM assignment_submissions WHERE user_id = ?', [userId]);
    await query('DELETE FROM enrollments WHERE user_id = ?', [userId]);
    await query('DELETE FROM users WHERE id = ?', [userId]);

    console.log(`✅ Usuario ID: ${userId} eliminado exitosamente`);

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
