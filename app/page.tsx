'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Root redirects to /map so onboarding (on map page) runs on every app load. */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/map');
  }, [router]);

  return null;
}
