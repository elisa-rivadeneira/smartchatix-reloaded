import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();

    const course: any = await query(
      'SELECT id, instructor_id FROM courses WHERE slug = ?',
      [slug]
    );

    if (!course || course.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (user.role === 'instructor' && course[0].instructor_id !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar este curso' }, { status: 403 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (body.title) {
      updates.push('title = ?');
      values.push(body.title);
    }

    if (body.description) {
      updates.push('description = ?');
      values.push(body.description);
    }

    if (body.thumbnail !== undefined) {
      updates.push('thumbnail = ?');
      values.push(body.thumbnail || null);
    }

    if (typeof body.price_vivo === 'number') {
      updates.push('price_vivo = ?');
      values.push(body.price_vivo);
    }

    if (typeof body.price_grabado === 'number') {
      updates.push('price_grabado = ?');
      values.push(body.price_grabado);
    }

    if (typeof body.is_active === 'boolean') {
      updates.push('is_active = ?');
      values.push(body.is_active);
    }

    if (typeof body.has_live_mode === 'boolean') {
      updates.push('has_live_mode = ?');
      values.push(body.has_live_mode);
    }

    if (body.live_start_date !== undefined) {
      updates.push('live_start_date = ?');
      values.push(body.live_start_date || null);
    }

    if (body.live_schedule !== undefined) {
      updates.push('live_schedule = ?');
      values.push(body.live_schedule || null);
    }

    if (body.recorded_features) {
      updates.push('recorded_features = ?');
      values.push(JSON.stringify(body.recorded_features));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay cambios para actualizar' }, { status: 400 });
    }

    values.push(course[0].id);

    await query(
      `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Curso actualizado correctamente'
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Error al actualizar curso' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();

    const course: any = await query(
      'SELECT id, instructor_id FROM courses WHERE slug = ?',
      [slug]
    );

    if (!course || course.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (user.role === 'instructor' && course[0].instructor_id !== user.id) {
      return NextResponse.json({ error: 'No tienes permiso para editar este curso' }, { status: 403 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (typeof body.is_certification_enabled === 'boolean') {
      updates.push('is_certification_enabled = ?');
      values.push(body.is_certification_enabled);
    }

    if (typeof body.passing_score === 'number') {
      const score = Math.max(0, Math.min(100, body.passing_score));
      updates.push('passing_score = ?');
      values.push(score);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay cambios para actualizar' }, { status: 400 });
    }

    values.push(course[0].id);

    await query(
      `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada'
    });

  } catch (error) {
    console.error('Error updating course config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
