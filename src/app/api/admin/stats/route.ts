import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
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

    const totalUsers = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );

    const totalCourses = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM courses WHERE is_active = 1'
    );

    const totalEnrollments = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM enrollments'
    );

    const activeStudents = await queryOne<{ count: number }>(
      'SELECT COUNT(DISTINCT user_id) as count FROM enrollments WHERE payment_status = "completed"'
    );

    const stats = {
      totalUsers: totalUsers?.count || 0,
      totalCourses: totalCourses?.count || 0,
      totalEnrollments: totalEnrollments?.count || 0,
      activeStudents: activeStudents?.count || 0
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
