import React, { useState } from 'react';
import {
  LayoutDashboard,
  SmartphoneNfc,
  Link2,
  QrCode,
  ReceiptText,
  TrendingUp,
  Volume2,
  Building2,
  ShieldCheck,
  Store,
  Bell,
  Search,
  LogOut,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { Logo } from '../Logo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { DesktopAuthLayout } from './DesktopAuthLayout';
import { Badge } from '../ui/badge';
import type { ScreenId } from '../../types';

interface DesktopWebLayoutProps {
  children: React.ReactNode;
}

export const DesktopWebLayout: React.FC<DesktopWebLayoutProps> = ({ children }) => {
  const {
    currentScreen,
    isAuthenticated,
    navigateTo,
    language,
    isRtl,
    merchantInfo,
    merchantCollections,
    triggerSettleNow,
    setIsLogoutModalOpen,
    speakSoundBox,
    openManagerPinModal,
  } = useApp();

  const isAr = language === 'العربية';
  const [isSettling, setIsSettling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate live unsettled balance
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;

  const handleSettleClick = () => {
    openManagerPinModal({
      title: isAr ? 'تأكيد الصرف الفوري عبر سريع' : 'Authorize Instant Settlement',
      subtitle: isAr
        ? 'أدخل رمز المدير السري المكون من ٤ أرقام لإتمام التحويل الفوري'
        : 'Enter 4-digit Manager Security PIN to dispatch Sarie instant settlement',
      onSuccess: async () => {
        setIsSettling(true);
        try {
          await triggerSettleNow();
        } finally {
          setIsSettling(false);
        }
      },
    });
  };

  const navItems: {
    id: ScreenId;
    labelEn: string;
    labelAr: string;
    icon: any;
    categoryEn: string;
    categoryAr: string;
    badge?: string;
  }[] = [
    // Section 1: Core Operations
    {
      id: 'MERCHANT_HOME',
      labelEn: 'Overview',
      labelAr: 'لوحة التحكم الرئيسية',
      icon: LayoutDashboard,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'SOFTPOS_TERMINAL',
      labelEn: 'SoftPOS Tap',
      labelAr: 'الدفع باللمس بالجوال',
      icon: SmartphoneNfc,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'NFC',
    },
    {
      id: 'PAYMENT_LINK_GENERATOR',
      labelEn: 'Pay Links',
      labelAr: 'روابط الدفع الرقمية',
      icon: Link2,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'MERCHANT_QR_GENERATOR',
      labelEn: 'ZATCA QR',
      labelAr: 'رمز الفاتورة الضريبية',
      icon: QrCode,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Phase 2',
    },
    {
      id: 'MERCHANT_COLLECTIONS',
      labelEn: 'Collections',
      labelAr: 'التحصيلات والتسويات',
      icon: ReceiptText,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'MERCHANT_INSIGHTS',
      labelEn: 'Analytics',
      labelAr: 'التحليلات والتقارير',
      icon: TrendingUp,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'SOUNDBOX_NOTIFIER',
      labelEn: 'SoundBox',
      labelAr: 'جهاز الإشعار الصوتي',
      icon: Volume2,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Active',
    },

    // Section 2: Store Management & Settings
    {
      id: 'PROFILE',
      labelEn: 'Store Profile',
      labelAr: 'ملف المنشأة والتوثيق',
      icon: Store,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'MERCHANT_BANK_LINK',
      labelEn: 'Bank IBAN',
      labelAr: 'حساب التسوية البنكي',
      icon: Building2,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'SECURITY',
      labelEn: 'Security',
      labelAr: 'الكاشيرات والأمان',
      icon: ShieldCheck,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'NOTIFICATIONS',
      labelEn: 'Alerts',
      labelAr: 'التنبيهات وسجل النشاط',
      icon: Bell,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
  ];

  // If in web login/OTP/Registration/PIN Setup auth screen or unauthenticated, render with split hero desktop layout
  const isAuthFlow =
    !isAuthenticated ||
    currentScreen === 'MOBILE_NUMBER' ||
    currentScreen === 'SMS_OTP' ||
    currentScreen === 'MERCHANT_REGISTER' ||
    currentScreen === 'MERCHANT_PIN_SETUP';

  if (isAuthFlow) {
    return <DesktopAuthLayout>{children}</DesktopAuthLayout>;
  }

  return (
    <div
      className={`min-h-screen w-screen bg-[#080C14] text-white flex overflow-x-hidden ${
        isRtl ? 'rtl font-ar' : 'font-sans'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. Left Persistent Enterprise Desktop Sidebar */}
      <aside
        className={`w-64 min-w-[16rem] bg-[#0A0F1D] flex flex-col justify-between sticky top-0 h-screen p-4 z-40 ${
          isRtl ? 'border-l border-slate-800/80' : 'border-r border-slate-800/80'
        }`}
      >
        {/* Top: Brand Header & Store Identity */}
        <div className="space-y-4">
          <div
            onClick={() => navigateTo('MERCHANT_HOME')}
            className="flex items-center justify-between pb-3 border-b border-slate-800/80 cursor-pointer pt-1"
          >
            <div className="flex items-center gap-2">
              <Logo height={28} textColor="#FFFFFF" accentColor="#00FF24" />
              <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0.5 text-[#00FF24] border-[#00FF24]/30 bg-[#00FF24]/5">
                MERCHANT
              </Badge>
            </div>
          </div>

          {/* Store Identification Card */}
          <div
            onClick={() => navigateTo('PROFILE')}
            className="p-3 bg-[#0E1526] border border-slate-800/80 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00FF24]/10 border border-[#00FF24]/20 flex items-center justify-center text-[#00FF24] flex-shrink-0">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {merchantInfo.businessName || (isAr ? 'تموينات القمة للتجارة' : 'Al-Madinah Supermarket')}
              </div>
              <div className="text-[10px] text-[#00FF24] font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3 inline" />
                <span>{isAr ? 'موثق زكاة وسريع' : 'Wathq & ZATCA Verified'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00FF24]/10 border border-[#00FF24]/30 text-[#00FF24]'
                      : 'bg-transparent border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#00FF24]' : 'text-slate-400'}`} />
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border ${
                        isSelected
                          ? 'bg-[#00FF24]/20 text-[#00FF24] border-[#00FF24]/40'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Widget: Instant Sarie Payout & Language Switcher */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          {/* Quick Settlement CTA Tile */}
          <div className="p-3 bg-[#0E1526] border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>{isAr ? 'الرصيد المتاح للتحويل' : 'Unsettled Balance'}</span>
              <span className="text-[#00FF24] font-bold">{isAr ? 'سريع ٢٤/٧' : 'Sarie T+0'}</span>
            </div>
            <div className="text-base font-extrabold text-white tabular-nums">
              SAR {displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <button
              onClick={handleSettleClick}
              disabled={isSettling}
              className="w-full py-1.5 rounded-lg bg-[#00FF24] text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#00FF24]/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : (isAr ? 'تسوية فورية للبنك' : 'Instant Settle')}</span>
            </button>
          </div>

          {/* Language Switcher & Logout Row */}
          <div className="flex items-center justify-between pt-1">
            <LanguageSwitchPill variant="compact" />
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>{isAr ? 'خروج' : 'Exit'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas & Top Enterprise Header */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Desktop Navigation & Search Bar */}
        <header className="h-16 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          {/* Left: Global Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none ${
                isRtl ? 'right-3' : 'left-3'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في التحصيلات، الفواتير، المرجع البنكي...' : 'Search collections, UTR, invoices, customers...'}
                className={`w-full h-9 bg-[#10182A] border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#00FF24]/50 ${
                  isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                }`}
              />
            </div>
          </div>

          {/* Right: SoundBox Live Status & Quick Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Live SoundBox Audio Test Trigger */}
            <button
              onClick={() => speakSoundBox(45.0)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00FF24]/10 border border-[#00FF24]/20 text-[#00FF24] text-xs font-bold hover:bg-[#00FF24]/20 transition-colors cursor-pointer"
            >
              <span className="live-indicator w-1.5 h-1.5" />
              <Volume2 className="h-3.5 w-3.5" />
              <span>{isAr ? 'جهاز الصوت متصل' : 'SoundBox Online'}</span>
            </button>

            {/* Quick Charge / QR Button */}
            <button
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00FF24] text-black text-xs font-extrabold hover:bg-[#00FF24]/90 transition-colors cursor-pointer"
            >
              <SmartphoneNfc className="h-3.5 w-3.5" />
              <span>{isAr ? '+ تحصيل جديد' : '+ New Charge'}</span>
            </button>
          </div>
        </header>

        {/* Desktop Screen Content Canvas */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
