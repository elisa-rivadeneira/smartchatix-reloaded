import type { Metadata } from 'next';

const TITLE = 'Capacitación de IA para Empresas | AI Build Lab | SmartChatix';
const DESCRIPTION =
  'AI Build Lab es una experiencia práctica de capacitación en inteligencia artificial para empresas: tu equipo construye y publica aplicaciones reales usando IA como copiloto. In House o remota, sin precios fijos, a medida de tu empresa.';
const URL = 'https://smartchatix.com/capacitacion-ia-empresas';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'capacitación de IA para empresas',
    'capacitación IA empresas',
    'inteligencia artificial para empresas',
    'capacitación en inteligencia artificial',
    'IA para empresas',
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

export default function CapacitacionIaEmpresasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
