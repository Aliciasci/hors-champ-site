'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { trackPath } from './navigationHistory';

export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackPath(pathname);
  }, [pathname]);
  return null;
}
