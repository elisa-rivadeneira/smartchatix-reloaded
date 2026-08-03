import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const settings: any = await query(
      `SELECT setting_value FROM site_settings WHERE setting_key = 'exchange_rate' LIMIT 1`
    );

    const exchangeRate = settings && settings.length > 0
      ? parseFloat(settings[0].setting_value)
      : 3.80;

    return NextResponse.json({
      exchangeRate,
      success: true
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({
      exchangeRate: 3.80,
      success: false
    });
  }
}
