import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies['auth_token'];
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const courses = await query(`
      SELECT
        c.id,
        c.slug,
        c.title,
        c.thumbnail,
        e.modality,
        e.enrolled_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ? AND e.payment_status = 'completed'
      ORDER BY e.enrolled_at DESC
    `, [payload.id]);

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      },
      courses
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del usuario' },
      { status: 500 }
    );
  }
}
