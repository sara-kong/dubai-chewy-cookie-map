'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCTAClick = () => {
    router.push('/map');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-amber-900 mb-2">
            Dubai Chocolate
          </h1>
          <h2 className="text-4xl font-semibold text-amber-800">
            Chewy Cookie
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6 pt-8">
          <p className="text-lg text-amber-900/80 leading-relaxed">
            Discover where to find the legendary Dubai Chocolate Chewy Cookie
          </p>
          <p className="text-base text-amber-800/70">
            Explore our curated map of locations across the U.S.
          </p>
        </div>

        <button
          onClick={handleCTAClick}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
        >
          Find Cookie Locations
        </button>

        <div className="pt-8">
          <div className="inline-block p-4 bg-white/50 rounded-2xl shadow-md">
            <div className="w-16 h-16 mx-auto bg-amber-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
