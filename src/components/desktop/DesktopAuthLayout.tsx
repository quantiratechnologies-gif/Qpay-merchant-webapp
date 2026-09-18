import React from 'react';
import { Logo } from '../Logo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, Wifi, QrCode, Zap } from 'lucide-react';
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
      titleEn: 'Instant Settlements',
      titleAr: 'تسويات فورية',
      descEn: 'Get paid 24/7 via Sarie IPS with real-time bank transfers',
      descAr: 'استلم مستحقاتك 24/7 عبر سريع IPS مع تحويلات بنكية فورية',
    },
    {
      icon: <Wifi className="h-4 w-4 text-[#00FF24]" />,
      titleEn: 'SoftPOS Payments',
      titleAr: 'مدفوعات SoftPOS',
      descEn: 'Accept cards on your phone - SAMA certified & mada enabled',
      descAr: 'اقبل البطاقات على جوالك - معتمد من ساما ومفعل لمدى',
    },
    {
      icon: <QrCode className="h-4 w-4 text-[#00FF24]" />,
      titleEn: 'E-Invoicing',
      titleAr: 'الفوترة الإلكترونية',
      descEn: 'ZATCA Phase 2 compliant - Auto-generate tax invoices',
      descAr: 'متوافق مع المرحلة الثانية من هيئة الزكاة - إنشاء تلقائي للفواتير الضريبية',
    },
  ];

  return (
    <div
      className={`min-h-screen lg:h-screen w-screen bg-[#080C14] text-white flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden ${
        isRtl ? 'rtl font-ar' : 'font-sans'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Left 45% Brand Showcase Panel - Fixed / Sticky */}
      <div className="lg:w-[45%] lg:h-screen flex flex-col justify-between p-8 lg:p-14 bg-[#0A0F1D] border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,255,36,0.08)_0%,transparent_70%)] flex-shrink-0 lg:overflow-hidden">
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
              {isAr ? 'لوحة تحكم التاجر الذكية وحلول الدفع' : 'Smart Merchant Dashboard & Payment Solutions'}
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              {isAr
                ? 'اقبل المدفوعات، وأدر المبيعات، واحصل على تسويات فورية - الكل في منصة واحدة آمنة.'
                : 'Accept payments, manage sales & get instant settlements - All in one secure platform'}
            </p>
          </div>

          {/* Highlights Cards */}
          <div className="flex flex-col gap-3 mt-8 max-w-md">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0E1526]/80 border border-slate-800/80 text-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#00FF24]/10 border border-[#00FF24]/20 flex items-center justify-center text-[#00FF24] flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white leading-tight">
                    {isAr ? item.titleAr : item.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {isAr ? item.descAr : item.descEn}
                  </div>
                </div>
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

      {/* Right 55% Form Panel - Independently Scrollable */}
      <div className="lg:w-[55%] lg:h-screen flex flex-col justify-between p-6 lg:p-10 bg-[#080C14] lg:overflow-y-auto">
        {/* Top Header with Language Pill */}
        <div className="flex justify-end w-full max-w-md mx-auto flex-shrink-0 pb-2">
          <LanguageSwitchPill variant="compact" />
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="p-6 sm:p-8 bg-[#0E1526] border border-slate-800/80 rounded-2xl shadow-2xl">
            {children}
          </div>
        </div>

        {/* Bottom System Info */}
        <div className="text-center text-[11px] text-slate-500 font-medium flex-shrink-0 pt-2 pb-1">
          © 2026 QTPay • SAMA Saudi Central Bank Registered
        </div>
      </div>
    </div>
  );
};
