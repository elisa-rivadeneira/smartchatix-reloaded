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

    const registrations = await query(`
      SELECT id, masterclass_name, nombre, whatsapp, whatsapp_auto_enviado, created_at
      FROM masterclass_registrations
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching masterclass registrations:', error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}
