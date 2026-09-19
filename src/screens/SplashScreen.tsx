import React, { useEffect } from 'react';
import { Logo } from '../components/Logo';
import { QuantiraLogo } from '../components/QuantiraLogo';
import { useApp } from '../state/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('ONBOARDING');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,175,55,0.15)_0%,rgba(11,11,11,0.98)_70%)] text-white flex flex-col items-center justify-between p-8 sm:p-12 relative select-none">
      <div className="h-8" />

      {/* Central App Brand Logo with Ambient Aura */}
      <div className="fade-in flex flex-col items-center text-center relative">
        <div className="absolute w-48 h-48 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
        <Logo height={56} textColor="#FFFFFF" accentColor="#D4AF37" />
        <div className="mt-4 text-xs font-black tracking-[0.25em] text-[#D4AF37] uppercase">
          QUICK | TRUSTED | PAYMENTS
        </div>
      </div>

      {/* Bottom Center: Powered by Quantira Technologies */}
      <div className="fade-in flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold text-[#737373] tracking-[0.2em] uppercase">
          powered by
        </span>
        <QuantiraLogo size={24} color="#D4AF37" textColor="#FFFFFF" />
      </div>
    </div>
  );
};
export default SplashScreen;
