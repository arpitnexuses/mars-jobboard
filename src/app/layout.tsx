"use client"

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import HeaderWrapper from '../components/HeaderWrapper';
import Footer from '../components/Footer';
const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Job Board',
//   description: 'Find your next career opportunity',
// };

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
        <Footer />
      </body>
    </html>
  );
}