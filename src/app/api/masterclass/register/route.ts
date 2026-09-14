import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const MASTERCLASS_NAME = 'Desarrolla con Claude';

function normalizarWhatsapp(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 9 && digits.startsWith('9')) return `51${digits}`;
  if (digits.length === 11 && digits.startsWith('51')) return digits;
  return null;
}

async function inscribirEnOdoo(nombre: string, numeroWhatsapp: string): Promise<boolean> {
  const baseUrl = process.env.ODOO_MASTERCLASS_URL;
  const secret = process.env.ODOO_MASTERCLASS_SECRET;

  if (!baseUrl || !secret) {
    console.log('⚠️  ODOO_MASTERCLASS_URL / ODOO_MASTERCLASS_SECRET no configuradas — se omite el envío automático por WhatsApp.');
    return false;
  }

  try {
    const response = await fetch(`${baseUrl}/agente_ventas_whatsapp/masterclass/inscribir?token=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, numero_whatsapp: numeroWhatsapp, webinar: MASTERCLASS_NAME }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      console.error('Odoo respondió con error al inscribir:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error llamando al endpoint de Odoo para inscribir en la masterclass:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, whatsapp } = await request.json();

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return NextResponse.json({ error: 'Ingresa tu nombre.' }, { status: 400 });
    }

    const numeroWhatsapp = normalizarWhatsapp(typeof whatsapp === 'string' ? whatsapp : '');
    if (!numeroWhatsapp) {
      return NextResponse.json({ error: 'Ingresa un número de WhatsApp de Perú válido.' }, { status: 400 });
    }

    const nombreLimpio = nombre.trim();

    const enviadoPorOdoo = await inscribirEnOdoo(nombreLimpio, numeroWhatsapp);

    await query(
      'INSERT INTO masterclass_registrations (masterclass_name, nombre, whatsapp, whatsapp_auto_enviado) VALUES (?, ?, ?, ?)',
      [MASTERCLASS_NAME, nombreLimpio, numeroWhatsapp, enviadoPorOdoo]
    );

    return NextResponse.json({ success: true, whatsappAutomatico: enviadoPorOdoo });
  } catch (error: any) {
    console.error('Error procesando inscripción a la masterclass:', error);
    return NextResponse.json({ error: 'Error al procesar la inscripción.' }, { status: 500 });
  }
}
