import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import HeaderWrapper from '@/components/HeaderWrapper';
import FooterWrapper from '@/components/FooterWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mars Job Board',
  description: 'Find your next career opportunity',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mars-jobboard.vercel.app'),
  icons: {
    icon: 'https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS/MARS-1%20(1).png',
    apple: 'https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS/MARS-1%20(1).png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}