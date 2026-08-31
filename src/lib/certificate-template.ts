export interface CertificateTemplate {
  logoUrl: string | null;
  backgroundImageUrl: string | null;
  primaryColor: string;
  accentColor: string;
  titleText: string;
  subtitleText: string;
  introText: string;
  completionText: string;
  footerText: string;
  showScore: boolean;
}

export const DEFAULT_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  logoUrl: null,
  backgroundImageUrl: null,
  primaryColor: '#667eea',
  accentColor: '#333333',
  titleText: 'CERTIFICADO',
  subtitleText: 'DE FINALIZACIÓN',
  introText: 'Se otorga a:',
  completionText: 'Por completar exitosamente el curso:',
  footerText: 'Verifica la autenticidad en:',
  showScore: true,
};

export function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const num = parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(num)) {
    return hexToRgb01(DEFAULT_CERTIFICATE_TEMPLATE.primaryColor);
  }
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

function parseTemplateJson(json: string | null | undefined): Partial<CertificateTemplate> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function resolveCertificateTemplate(
  siteDefaultJson: string | null | undefined,
  courseOverrideJson: string | null | undefined
): CertificateTemplate {
  const siteDefault = parseTemplateJson(siteDefaultJson);
  const courseOverride = parseTemplateJson(courseOverrideJson);
  return {
    ...DEFAULT_CERTIFICATE_TEMPLATE,
    ...siteDefault,
    ...courseOverride,
  };
}
