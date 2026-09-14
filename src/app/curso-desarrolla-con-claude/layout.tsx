import type { Metadata } from 'next';

const TITLE = 'Desarrolla con Claude — Taller en vivo | SmartChatix';
const DESCRIPTION =
  'Taller en vivo de 6 sesiones: construye y publica tu propia app con IA, de punta a punta. Sin experiencia previa. Incluye certificado.';
const URL = 'https://smartchatix.com/curso-desarrolla-con-claude';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'desarrolla con claude',
    'curso construir apps con IA',
    'taller Claude Code',
    'aprender a programar con IA',
    'Claude Code Perú',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'SmartChatix',
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function CursoDesarrollaConClaudeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
