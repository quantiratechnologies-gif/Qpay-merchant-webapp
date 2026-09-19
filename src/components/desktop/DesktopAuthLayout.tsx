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
      icon: <Zap className="h-4 w-4 text-[#D4AF37]" />,
      titleEn: 'Instant Settlements',
      titleAr: 'تسويات فورية',
      descEn: 'Get paid 24/7 via Sarie IPS with real-time bank transfers',
      descAr: 'استلم مستحقاتك 24/7 عبر سريع IPS مع تحويلات بنكية فورية',
    },
    {
      icon: <Wifi className="h-4 w-4 text-[#D4AF37]" />,
      titleEn: 'SoftPOS Payments',
      titleAr: 'مدفوعات SoftPOS',
      descEn: 'Accept cards on your phone - SAMA certified & mada enabled',
      descAr: 'اقبل البطاقات على جوالك - معتمد من ساما ومفعل لمدى',
    },
    {
      icon: <QrCode className="h-4 w-4 text-[#D4AF37]" />,
      titleEn: 'E-Invoicing',
      titleAr: 'الفوترة الإلكترونية',
      descEn: 'ZATCA Phase 2 compliant - Auto-generate tax invoices',
      descAr: 'متوافق مع المرحلة الثانية من هيئة الزكاة - إنشاء تلقائي للفواتير الضريبية',
    },
  ];

  return (
    <div
      className={`min-h-screen lg:h-screen w-screen bg-[#0B0B0B] text-white flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden ${
        isRtl ? 'rtl font-ar' : 'font-sans'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Left 45% Brand Showcase Panel - Fixed / Sticky */}
      <div className="lg:w-[45%] lg:h-screen flex flex-col justify-between p-8 lg:p-14 bg-[#121212] border-b lg:border-b-0 lg:border-r border-[#262626] bg-[radial-gradient(ellipse_at_20%_20%,rgba(212,175,55,0.12)_0%,transparent_70%)] flex-shrink-0 lg:overflow-hidden">
        <div>
          {/* Brand Logo with exact SVG and Merchant Tag */}
          <div className="flex items-center gap-3">
            <Logo height={38} textColor="#FFFFFF" accentColor="#D4AF37" />
            <Badge variant="outline" className="text-[10px] font-bold text-[#D4AF37] border-[#D4AF37]/40 bg-[#D4AF37]/10">
              MERCHANT
            </Badge>
          </div>

          <div className="mt-12 lg:mt-16 max-w-md space-y-3">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              {isAr ? 'لوحة تحكم التاجر الذكية وحلول الدفع' : 'Smart Merchant Dashboard & Payment Solutions'}
            </h1>
            <p className="text-xs lg:text-sm text-[#A3A3A3] leading-relaxed">
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
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#171717] border border-[#262626] text-neutral-200 shadow-lg shadow-black/40 hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white leading-tight">
                    {isAr ? item.titleAr : item.titleEn}
                  </div>
                  <div className="text-[11px] text-[#A3A3A3] mt-1 leading-relaxed">
                    {isAr ? item.descAr : item.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance Footer */}
        <div className="mt-8 pt-6 border-t border-[#262626] flex items-center justify-between text-xs text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            <span className="font-semibold text-neutral-200">
              {isAr ? 'موثق من ساما وهيئة الزكاة' : 'SAMA & ZATCA Verified'}
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            {isAr ? 'مدى • سريع • واثق' : 'mada • Sarie • Wathq'}
          </span>
        </div>
      </div>

      {/* Right 55% Form Panel - Independently Scrollable */}
      <div className="lg:w-[55%] lg:h-screen flex flex-col justify-between p-6 lg:p-10 bg-[#0B0B0B] lg:overflow-y-auto">
        {/* Top Header with Language Pill */}
        <div className="flex justify-end w-full max-w-md mx-auto flex-shrink-0 pb-2">
          <LanguageSwitchPill variant="compact" />
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="p-6 sm:p-8 bg-[#171717] border border-[#262626] rounded-2xl shadow-2xl shadow-black/80">
            {children}
          </div>
        </div>

        {/* Bottom System Info */}
        <div className="text-center text-[11px] text-[#737373] font-medium flex-shrink-0 pt-2 pb-1">
          {isAr
            ? '© ٢٠٢٦ كيو تي باي • مرخص من البنك المركزي السعودي (ساما)'
            : '© 2026 QTPay • SAMA Saudi Central Bank Registered'}
        </div>
      </div>
    </div>
  );
};
