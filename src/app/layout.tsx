import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import '@/styles/tiptap.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'SmartChatix -- Transformamos la forma en que las personas trabajan',
  description: 'Transformamos la forma en que las personas trabajan',
  keywords: [
    'CFD',
    'bombas centrífugas',
    'mecánica de fluidos',
    'simulación',
    'ANSYS',
    'turbomáquinas',
    'ingeniería',
    'minería',
    'capacitación técnica',
    'cursos online',
    'SmartChatix'
  ],
  authors: [{ name: 'SmartChatix' }],
  creator: 'SmartChatix',
  publisher: 'SmartChatix',
  metadataBase: new URL('https://smartchatix.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://smartchatix.com',
    title: 'SmartChatix -- Transformamos la forma en que las personas trabajan',
    description: 'Transformamos la forma en que las personas trabajan',
    siteName: 'SmartChatix',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SmartChatix - Academia de Ingeniería y CFD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartChatix -- Transformamos la forma en que las personas trabajan',
    description: 'Transformamos la forma en que las personas trabajan',
    images: ['/images/twitter-image.jpg'],
    creator: '@smartchatix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script src="https://checkout.culqi.com/js/v4" async></script>
      </head>
      <body
        style={{
          minHeight: '100vh',
          backgroundColor: 'white',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          color: '#111827',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
        className={`${inter.variable} ${poppins.variable}`}
      >
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          {children}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "SmartChatix",
              "alternateName": "Academia SmartChatix",
              "description": "Academia online especializada en ingeniería, CFD y simulación industrial",
              "url": "https://smartchatix.com",
              "logo": "https://smartchatix.com/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+51-999-999-999",
                "contactType": "customer service",
                "availableLanguage": "Spanish"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PE"
              },
              "sameAs": [
                "https://linkedin.com/company/smartchatix",
                "https://facebook.com/smartchatix",
                "https://instagram.com/smartchatix",
                "https://tiktok.com/@smartchatix",
                "https://youtube.com/@smartchatix"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
