import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond, JetBrains_Mono, Poppins, Caveat } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'Carousel Studio OS',
  description: 'Directed Creative Operating System for Carousels',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} ${poppins.variable} ${caveat.variable} dark`} suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased selection:bg-clay selection:text-white overflow-hidden">
        {/* Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.02]">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
