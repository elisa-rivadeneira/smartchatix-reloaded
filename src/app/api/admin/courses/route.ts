import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const courses = await query(`
      SELECT
        c.*,
        u.name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}

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
    const { title, slug, description, price_vivo, price_grabado, instructor_id } = body;

    if (!title || !slug) {
      return NextResponse.json({ message: 'Título y slug son obligatorios' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM courses WHERE slug = ?', [slug]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ message: 'Ya existe un curso con ese slug' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO courses (title, slug, description, price_vivo, price_grabado, instructor_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [title, slug, description || '', price_vivo || 0, price_grabado || 0, instructor_id || null]
    );

    return NextResponse.json({
      message: 'Curso creado exitosamente',
      courseId: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Error al crear el curso' }, { status: 500 });
  }
}
