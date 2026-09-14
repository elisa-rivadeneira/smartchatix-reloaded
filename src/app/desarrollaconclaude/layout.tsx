import type { Metadata } from 'next';

const TITLE = 'Desarrolla con Claude — Masterclass gratuita en vivo | SmartChatix';
const DESCRIPTION =
  'Construye tu primera app con IA en una sesión en vivo, sin saber programar. Masterclass gratuita "Desarrolla con Claude" — domingo 20 de septiembre, 10:00 am.';
const URL = 'https://smartchatix.com/desarrollaconclaude';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'desarrolla con claude',
    'masterclass IA gratuita',
    'construir apps con IA',
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

export default function DesarrollaConClaudeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
