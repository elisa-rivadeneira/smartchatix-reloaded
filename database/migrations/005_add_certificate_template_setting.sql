-- Migración: Plantilla de certificado por defecto (a nivel de sitio)
-- Fecha: 2026-08-28
-- Descripción: Siembra la fila en site_settings con el diseño por defecto
-- del certificado (campos estructurados: logo, colores, textos). El valor
-- coincide exactamente con lo que hoy está hardcodeado en
-- generate-certificate/route.ts, para que nada cambie visualmente hasta
-- que un admin edite el diseño desde Configuración.

INSERT INTO site_settings (setting_key, setting_value, description)
VALUES (
  'certificate_template_default',
  '{"logoUrl":null,"primaryColor":"#667eea","accentColor":"#333333","titleText":"CERTIFICADO","subtitleText":"DE FINALIZACIÓN","introText":"Se otorga a:","completionText":"Por completar exitosamente el curso:","footerText":"Verifica la autenticidad en:","showScore":true}',
  'Diseño de certificado por defecto (JSON, campos estructurados)'
)
ON DUPLICATE KEY UPDATE setting_key = setting_key;
