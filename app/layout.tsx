import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { OrderProvider } from '@/context/order-context';
import { DemoBanner } from '@/components/ui/demo-banner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOSGAZ DOMESTIC • Votre gaz, en un clic ! Abidjan',
  description:
    'Service n°1 de livraison express de gaz domestique à Abidjan (Cocody, Yopougon, Marcory...). Bouteilles 6kg, 12.5kg, 28kg. Commande sans compte, paiement à la livraison.',
  keywords: ['gaz', 'abidjan', 'livraison gaz', 'bouteille b12.5', 'total gaz', 'petroci', 'sosgaz', 'côte d’ivoire'],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#E52020',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
        <OrderProvider>
          <DemoBanner />
          {children}
        </OrderProvider>
      </body>
    </html>
  );
}
