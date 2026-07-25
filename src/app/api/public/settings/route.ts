import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const settings = await query('SELECT setting_key, setting_value FROM site_settings');

    const settingsObj: Record<string, any> = {};
    settings.forEach((s: any) => {
      settingsObj[s.setting_key] = s.setting_value === 'true' ? true : s.setting_value === 'false' ? false : s.setting_value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ settings: { show_courses_carousel: true } });
  }
}
