// Script de un solo uso: autoriza el canal de YouTube que sube los videos del curso
// y obtiene un refresh token para usar la YouTube Data API v3 sin volver a pasar por esto.
//
// Uso:
//   node youtube-oauth-setup.mjs
//
// Requiere que .env.local ya tenga YOUTUBE_OAUTH_CLIENT_ID y YOUTUBE_OAUTH_CLIENT_SECRET.

import { readFileSync } from 'node:fs';
import http from 'node:http';

const envLocal = readFileSync(new URL('./.env.local', import.meta.url), 'utf-8');
const getEnvVar = (name) => envLocal.match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]?.trim();

const CLIENT_ID = getEnvVar('YOUTUBE_OAUTH_CLIENT_ID');
const CLIENT_SECRET = getEnvVar('YOUTUBE_OAUTH_CLIENT_SECRET');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Falta YOUTUBE_OAUTH_CLIENT_ID o YOUTUBE_OAUTH_CLIENT_SECRET en .env.local');
  process.exit(1);
}

const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}`;
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent'); // fuerza que siempre entregue refresh_token

console.log('\n1) Abre esta URL en tu navegador, inicia sesión con la cuenta DUEÑA del canal de YouTube, y acepta:\n');
console.log(authUrl.toString());
console.log('\n2) Esperando la autorización...\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.end('Autorización rechazada. Puedes cerrar esta pestaña.');
    console.error('❌ Autorización rechazada:', error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.end('Falta el código. Puedes cerrar esta pestaña.');
    return;
  }

  res.end('✅ Autorizado. Ya puedes cerrar esta pestaña y volver a la terminal.');
  server.close();

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.refresh_token) {
    console.error('❌ Google no devolvió un refresh_token. Respuesta completa:', tokenData);
    console.error('   Si ya habías autorizado esta app antes, revoca el acceso en https://myaccount.google.com/permissions y vuelve a correr este script.');
    process.exit(1);
  }

  console.log('\n✅ Listo. Agrega esta línea a tu .env.local:\n');
  console.log(`YOUTUBE_OAUTH_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
  process.exit(0);
});

server.listen(PORT);
