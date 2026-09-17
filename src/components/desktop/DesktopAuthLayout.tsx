import React from 'react';
import { Logo } from '../Logo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, SmartphoneNfc, QrCode, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';

interface DesktopAuthLayoutProps {
  children: React.ReactNode;
}

export const DesktopAuthLayout: React.FC<DesktopAuthLayoutProps> = ({ children }) => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const highlights = [
    {
      icon: <Zap className="h-4 w-4 text-[#00FF24]" />,
      textEn: 'Instant 24/7 Sarie IPS Settlements',
      textAr: 'تسويات بنكية فورية على مدار الساعة عبر سريع',
    },
    {
      icon: <SmartphoneNfc className="h-4 w-4 text-[#00FF24]" />,
      textEn: 'SAMA-Certified SoftPOS & mada Tap',
      textAr: 'نقاط بيع افتراضية معتمدة والدفع باللمس عبر مدى',
    },
    {
      icon: <QrCode className="h-4 w-4 text-[#00FF24]" />,
      textEn: 'ZATCA Phase 2 Cryptographic Invoices',
      textAr: 'فوترة ضريبية إلكترونية مشفرة معتمدة من الزكاة',
    },
  ];

  return (
    <div
      className={`min-h-screen w-screen bg-[#080C14] text-white flex flex-col lg:flex-row overflow-x-hidden ${
        isRtl ? 'rtl font-ar' : 'font-sans'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Left 45% Brand Showcase Panel */}
      <div className="lg:w-[45%] flex flex-col justify-between p-8 lg:p-14 bg-[#0A0F1D] border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,255,36,0.08)_0%,transparent_70%)]">
        <div>
          {/* Brand Logo with exact SVG and Merchant Tag */}
          <div className="flex items-center gap-3">
            <Logo height={38} textColor="#FFFFFF" accentColor="#00FF24" />
            <Badge variant="outline" className="text-[10px] font-bold text-[#00FF24] border-[#00FF24]/30 bg-[#00FF24]/5">
              MERCHANT
            </Badge>
          </div>

          <div className="mt-12 lg:mt-16 max-w-md space-y-3">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              {isAr ? 'بوابة مدفوعات التجار الموحدة' : 'Enterprise Merchant & SoftPOS Portal'}
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              {isAr
                ? 'إدارة نقاط البيع الافتراضية، التسويات اليومية المباشرة، والفوترة الضريبية الإلكترونية المعتمدة.'
                : 'Centralized telemetry, SoftPOS contactless terminal fleet, and instant Sarie IPS clearing.'}
            </p>
          </div>

          {/* Highlights Cards */}
          <div className="flex flex-col gap-2.5 mt-8 max-w-md">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0E1526]/80 border border-slate-800/80 text-xs font-semibold text-slate-200"
              >
                <div className="p-1.5 rounded-lg bg-[#00FF24]/10 text-[#00FF24] flex-shrink-0">
                  {item.icon}
                </div>
                <span>{isAr ? item.textAr : item.textEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00FF24]" />
            <span className="font-semibold text-slate-300">SAMA & ZATCA Verified</span>
          </div>
          <span className="text-[11px] text-slate-500">mada • Sarie • Wathq</span>
        </div>
      </div>

      {/* Right 55% Form Panel */}
      <div className="lg:w-[55%] flex flex-col justify-between p-6 lg:p-12 bg-[#080C14]">
        {/* Top Header with Language Pill */}
        <div className="flex justify-end w-full max-w-md mx-auto">
          <LanguageSwitchPill variant="compact" />
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="p-6 sm:p-8 bg-[#0E1526] border border-slate-800/80 rounded-2xl shadow-2xl">
            {children}
          </div>
        </div>

        {/* Bottom System Info */}
        <div className="text-center text-[11px] text-slate-500 font-medium">
          © 2026 QTPay • SAMA Saudi Central Bank Registered
        </div>
      </div>
    </div>
  );
};
