'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SCREEN_DURATION_MS = 750;
const FADE_DURATION_S = 0.5;

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isExiting, setIsExiting] = useState(false);

  // Advance: 1 → 2 after 0.75s, 2 → 3 after 0.75s
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setStep(2), SCREEN_DURATION_MS);
      return () => clearTimeout(t);
    }
    if (step === 2) {
      const t = setTimeout(() => setStep(3), SCREEN_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleCTAClick = () => {
    setIsExiting(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
      initial={false}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: FADE_DURATION_S }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
    >
          {/* Screen 1: white only */}
          {step === 1 && <div className="absolute inset-0 bg-white" aria-hidden />}

          {/* Screen 2 & 3: cookie + tagline + CTA (centered, equal gap-8) */}
          {(step === 2 || step === 3) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white gap-8">
              <motion.div
                className="flex flex-col items-center justify-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: FADE_DURATION_S }}
              >
                {/* Cookie image - larger (180px) */}
                <img
                  src="/marker-icon.svg"
                  alt=""
                  className="w-[180px] h-auto object-contain"
                  width={180}
                  height={126}
                />
                <p className="font-sans font-bold text-xl sm:text-2xl text-figma-black/90 tracking-tight">
                  democratizing indulgence.
                </p>
              </motion.div>

              {/* Screen 3: CTA fades in below with same gap */}
              {step === 3 && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: FADE_DURATION_S }}
                >
                  <button
                    type="button"
                    onClick={handleCTAClick}
                    className="w-[246px] h-[62px] rounded-2xl bg-figma-green-cta text-white font-sans font-semibold text-base shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:opacity-95 active:scale-[0.98] transition-opacity transition-transform"
                  >
                    find a dubai chewy cookie
                  </button>
                </motion.div>
              )}
            </div>
          )}
    </motion.div>
  );
}
