'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const showHeader = !pathname?.startsWith('/dashboard') && pathname !== '/login';

  if (!showHeader) return null;
  return <Header />;
} 