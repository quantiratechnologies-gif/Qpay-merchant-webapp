import React, { useState, useEffect, useRef } from 'react';
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
  PanelLeft,
  X,
  CreditCard,
  ChevronDown,
  Landmark,
  Settings,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { Logo } from '../Logo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { DesktopAuthLayout } from './DesktopAuthLayout';
import { Badge } from '../ui/badge';
import { formatSaudiCurrency } from '../../utils/formatters';

interface DesktopWebLayoutProps {
  children: React.ReactNode;
}

interface NavSubItem {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
}

interface NavItem {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: any;
  categoryEn: string;
  categoryAr: string;
  badge?: string;
  isParent?: boolean;
  isOpen?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  subItems?: NavSubItem[];
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
    setIsLogoutModalOpen,
    screenParams,
  } = useApp();

  const isAr = language === 'العربية';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Statements sub-menu accordion state
  const isStatementsScreen =
    currentScreen === 'MERCHANT_COLLECTIONS' ||
    currentScreen === 'MERCHANT_INSIGHTS';

  const [statementsOpen, setStatementsOpen] = useState(false);

  // Auto-expand Statements when navigating to its screens
  useEffect(() => {
    if (isStatementsScreen) {
      setStatementsOpen(true);
    }
  }, [isStatementsScreen]);

  // Settings sub-menu accordion state
  const isSettingsScreen =
    currentScreen === 'SECURITY' ||
    currentScreen === 'NOTIFICATIONS' ||
    currentScreen === 'MERCHANT_BANK_LINK' ||
    currentScreen === 'MERCHANT_SETUP';

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auto-expand Settings when navigating to its screens
  useEffect(() => {
    if (isSettingsScreen) {
      setSettingsOpen(true);
    }
  }, [isSettingsScreen]);

  // Sidebar toggle state (persisted in localStorage)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('qpay_desktop_sidebar_open');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('qpay_desktop_sidebar_open', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for search popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCollectionsActive =
    currentScreen === 'MERCHANT_COLLECTIONS' &&
    (!screenParams?.tab || screenParams?.tab === 'transactions' || screenParams?.tab === 'collections');

  const isSettlementsActive =
    currentScreen === 'MERCHANT_COLLECTIONS' &&
    screenParams?.tab === 'settlements';

  const isAnalyticsActive = currentScreen === 'MERCHANT_INSIGHTS';

  const navItems: NavItem[] = [
    // Section 1: Core Operations
    {
      id: 'MERCHANT_HOME',
      labelEn: 'Overview',
      labelAr: 'لوحة التحكم الرئيسية',
      icon: LayoutDashboard,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      isActive: currentScreen === 'MERCHANT_HOME',
      onClick: () => navigateTo('MERCHANT_HOME'),
    },
    {
      id: 'SOFTPOS_TERMINAL',
      labelEn: 'SoftPOS Tap',
      labelAr: 'الدفع باللمس بالجوال',
      icon: SmartphoneNfc,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'NFC',
      isActive: currentScreen === 'SOFTPOS_TERMINAL',
      onClick: () => navigateTo('SOFTPOS_TERMINAL'),
    },
    {
      id: 'MERCHANT_QR_GENERATOR',
      labelEn: 'PAY QR',
      labelAr: 'رمز الدفع PAY QR',
      icon: QrCode,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Instant',
      isActive: currentScreen === 'MERCHANT_QR_GENERATOR',
      onClick: () => navigateTo('MERCHANT_QR_GENERATOR'),
    },
    // STATEMENTS: Contains Collections, Settlements, and Analytics
    {
      id: 'STATEMENTS',
      labelEn: 'Statements',
      labelAr: 'كشوفات الحساب',
      icon: ReceiptText,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      isParent: true,
      isOpen: statementsOpen,
      isActive: isStatementsScreen,
      onClick: () => {
        setStatementsOpen((prev) => !prev);
      },
      subItems: [
        {
          id: 'collections',
          labelEn: 'Collections',
          labelAr: 'التحصيلات',
          icon: CreditCard,
          isActive: isCollectionsActive,
          onClick: () => navigateTo('MERCHANT_COLLECTIONS', { tab: 'transactions' }),
        },
        {
          id: 'settlements',
          labelEn: 'Settlements',
          labelAr: 'التسويات',
          icon: Landmark,
          isActive: isSettlementsActive,
          onClick: () => navigateTo('MERCHANT_COLLECTIONS', { tab: 'settlements' }),
        },
        {
          id: 'analytics',
          labelEn: 'Analytics',
          labelAr: 'التحليلات والتقارير',
          icon: TrendingUp,
          isActive: isAnalyticsActive,
          onClick: () => navigateTo('MERCHANT_INSIGHTS'),
        },
      ],
    },
    {
      id: 'SOUNDBOX_NOTIFIER',
      labelEn: 'SoundBox',
      labelAr: 'جهاز الإشعار الصوتي',
      icon: Volume2,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Active',
      isActive: currentScreen === 'SOUNDBOX_NOTIFIER',
      onClick: () => navigateTo('SOUNDBOX_NOTIFIER'),
    },

    // Section 2: Unified Settings Menu (Security, Alerts, Bank IBAN, Business/Operations Setup)
    {
      id: 'SETTINGS',
      labelEn: 'Settings',
      labelAr: 'الإعدادات العامة',
      icon: Settings,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
      isParent: true,
      isOpen: settingsOpen,
      isActive: isSettingsScreen,
      onClick: () => {
        setSettingsOpen((prev) => !prev);
      },
      subItems: [
        {
          id: 'security',
          labelEn: 'Security & Staff',
          labelAr: 'الكاشيرات والأمان',
          icon: ShieldCheck,
          isActive: currentScreen === 'SECURITY',
          onClick: () => navigateTo('SECURITY'),
        },
        {
          id: 'alerts',
          labelEn: 'Alerts & Activity',
          labelAr: 'التنبيهات وسجل النشاط',
          icon: Bell,
          isActive: currentScreen === 'NOTIFICATIONS',
          onClick: () => navigateTo('NOTIFICATIONS'),
        },
        {
          id: 'bank_iban',
          labelEn: 'Bank IBAN',
          labelAr: 'حساب التسوية البنكي',
          icon: Building2,
          isActive: currentScreen === 'MERCHANT_BANK_LINK',
          onClick: () => navigateTo('MERCHANT_BANK_LINK'),
        },
        {
          id: 'business_setup',
          labelEn: 'Business & Tax Info',
          labelAr: 'بيانات المنشأة والضريبة',
          icon: Store,
          isActive: currentScreen === 'MERCHANT_SETUP',
          onClick: () => navigateTo('MERCHANT_SETUP'),
        },
      ],
    },
  ];

  // Search Results Filtering
  const searchableEntries = [
    {
      id: 'MERCHANT_HOME',
      labelEn: 'Overview',
      labelAr: 'لوحة التحكم الرئيسية',
      icon: LayoutDashboard,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      action: () => navigateTo('MERCHANT_HOME'),
    },
    {
      id: 'SOFTPOS_TERMINAL',
      labelEn: 'SoftPOS Tap',
      labelAr: 'الدفع باللمس بالجوال',
      icon: SmartphoneNfc,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      action: () => navigateTo('SOFTPOS_TERMINAL'),
    },
    {
      id: 'MERCHANT_QR_GENERATOR',
      labelEn: 'PAY QR & Invoices',
      labelAr: 'رمز الدفع PAY QR والفواتير',
      icon: QrCode,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      action: () => navigateTo('MERCHANT_QR_GENERATOR'),
    },
    {
      id: 'STATEMENTS_MAIN',
      labelEn: 'Statements',
      labelAr: 'كشوفات الحساب',
      icon: ReceiptText,
      categoryEn: 'STATEMENTS',
      categoryAr: 'كشوفات الحساب',
      action: () => navigateTo('MERCHANT_COLLECTIONS', { tab: 'transactions' }),
    },
    {
      id: 'COLLECTIONS',
      labelEn: 'Collections (Transactions)',
      labelAr: 'التحصيلات والعمليات',
      icon: CreditCard,
      categoryEn: 'STATEMENTS',
      categoryAr: 'كشوفات الحساب',
      action: () => navigateTo('MERCHANT_COLLECTIONS', { tab: 'transactions' }),
    },
    {
      id: 'SETTLEMENTS',
      labelEn: 'Settlements (Sarie Payouts)',
      labelAr: 'التسويات والتحويل الفوري',
      icon: Landmark,
      categoryEn: 'STATEMENTS',
      categoryAr: 'كشوفات الحساب',
      action: () => navigateTo('MERCHANT_COLLECTIONS', { tab: 'settlements' }),
    },
    {
      id: 'ANALYTICS',
      labelEn: 'Analytics & Reports',
      labelAr: 'التحليلات والتقارير المالية',
      icon: TrendingUp,
      categoryEn: 'STATEMENTS',
      categoryAr: 'كشوفات الحساب',
      action: () => navigateTo('MERCHANT_INSIGHTS'),
    },
    {
      id: 'SOUNDBOX_NOTIFIER',
      labelEn: 'SoundBox',
      labelAr: 'جهاز الإشعار الصوتي',
      icon: Volume2,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      action: () => navigateTo('SOUNDBOX_NOTIFIER'),
    },
    {
      id: 'PROFILE',
      labelEn: 'Store Profile',
      labelAr: 'ملف المنشأة والتوثيق',
      icon: Store,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
      action: () => navigateTo('PROFILE'),
    },
    {
      id: 'SECURITY',
      labelEn: 'Security & Staff PINs',
      labelAr: 'الكاشيرات والأمان',
      icon: ShieldCheck,
      categoryEn: 'SETTINGS',
      categoryAr: 'الإعدادات',
      action: () => navigateTo('SECURITY'),
    },
    {
      id: 'NOTIFICATIONS',
      labelEn: 'Alerts & System Logs',
      labelAr: 'التنبيهات وسجل النشاط',
      icon: Bell,
      categoryEn: 'SETTINGS',
      categoryAr: 'الإعدادات',
      action: () => navigateTo('NOTIFICATIONS'),
    },
    {
      id: 'MERCHANT_BANK_LINK',
      labelEn: 'Bank IBAN & Settlement Account',
      labelAr: 'حساب التسوية البنكي',
      icon: Building2,
      categoryEn: 'SETTINGS',
      categoryAr: 'الإعدادات',
      action: () => navigateTo('MERCHANT_BANK_LINK'),
    },
    {
      id: 'MERCHANT_SETUP',
      labelEn: 'Business & Tax Profile',
      labelAr: 'بيانات المنشأة والضريبة',
      icon: Store,
      categoryEn: 'SETTINGS',
      categoryAr: 'الإعدادات',
      action: () => navigateTo('MERCHANT_SETUP'),
    },
  ];

  const cleanSearch = searchQuery.trim().toLowerCase();
  const matchingNavItems = cleanSearch
    ? searchableEntries.filter(
        (item) =>
          item.labelEn.toLowerCase().includes(cleanSearch) ||
          item.labelAr.includes(cleanSearch) ||
          item.categoryEn.toLowerCase().includes(cleanSearch)
      )
    : [];

  const matchingCollections = cleanSearch
    ? merchantCollections.filter(
        (c) =>
          c.customerMasked?.toLowerCase().includes(cleanSearch) ||
          c.orderRef?.toLowerCase().includes(cleanSearch) ||
          c.paymentMethod?.toLowerCase().includes(cleanSearch) ||
          c.amount?.toString().includes(cleanSearch)
      )
    : [];

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
      {/* 1. Left Persistent Enterprise Desktop Sidebar (Collapsible & Toggleable) */}
      <aside
        className={`bg-[#121212] flex flex-col justify-between sticky top-0 h-screen z-40 shrink-0 transition-all duration-300 ease-in-out ${
          isRtl ? 'border-l border-[#2C2C44]' : 'border-r border-[#2C2C44]'
        } ${
          sidebarOpen
            ? 'w-72 min-w-[18rem] p-4 opacity-100'
            : 'w-0 min-w-0 p-0 opacity-0 overflow-hidden border-none pointer-events-none'
        }`}
      >
        {/* Top: Store Identity & Navigation Links */}
        <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
          {/* Store Identification Card (Clicking opens Merchant Profile) */}
          <div
            onClick={() => navigateTo('PROFILE')}
            title={isAr ? 'عرض ملف المنشأة' : 'View Merchant Profile'}
            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
              currentScreen === 'PROFILE'
                ? 'bg-[#7FE87F]/10 border border-[#7FE87F]/40 shadow-md shadow-[#7FE87F]/10 ring-1 ring-[#7FE87F]/30'
                : 'bg-[#111726] border border-[#2C2C44] hover:border-[#7FE87F]/40 hover:bg-[#111726]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                currentScreen === 'PROFILE'
                  ? 'bg-[#7FE87F] text-black shadow-md shadow-[#7FE87F]/20'
                  : 'bg-[#7FE87F]/10 border border-[#7FE87F]/20 text-[#7FE87F]'
              }`}
            >
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {merchantInfo.businessName ||
                  (isAr ? 'تموينات القمة للتجارة' : 'Quantira Gourmet Cafe')}
              </div>
              <div className="text-[10px] text-[#7FE87F] font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3 inline" />
                <span>{isAr ? 'موثق واثق وزكاة' : 'Wathq & ZATCA Verified'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = item.isActive;

              if (item.isParent) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={`w-full h-11 flex items-center justify-between px-3.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/5'
                          : 'bg-transparent border border-transparent text-[#A2A2BA] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4.5 w-4.5 ${
                            isSelected ? 'text-[#7FE87F]' : 'text-[#A2A2BA]'
                          }`}
                        />
                        <span>{isAr ? item.labelAr : item.labelEn}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <ChevronDown
                          className={`h-4 w-4 text-[#A2A2BA] transition-transform duration-200 ${
                            item.isOpen ? 'rotate-180 text-[#7FE87F]' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Sub-items accordion */}
                    {item.isOpen && item.subItems && (
                      <div
                        className={`space-y-1 my-1 ${
                          isRtl
                            ? 'mr-4 pr-2 border-r border-[#2C2C44]'
                            : 'ml-4 pl-2 border-l border-[#2C2C44]'
                        }`}
                      >
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = sub.isActive;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={sub.onClick}
                              className={`w-full h-9 flex items-center justify-between px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-[#7FE87F]/15 text-[#7FE87F] font-bold shadow-sm'
                                  : 'text-[#A2A2BA] hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <SubIcon
                                  className={`h-3.5 w-3.5 ${
                                    isSubActive ? 'text-[#7FE87F]' : 'text-[#A2A2BA]'
                                  }`}
                                />
                                <span>{isAr ? sub.labelAr : sub.labelEn}</span>
                              </div>
                              {isSubActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7FE87F] shadow-[0_0_8px_#7FE87F]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full h-11 flex items-center justify-between px-3.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#7FE87F]/10 border border-[#7FE87F]/30 text-[#7FE87F] shadow-sm shadow-[#7FE87F]/5'
                      : 'bg-transparent border border-transparent text-[#A2A2BA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4.5 w-4.5 ${
                        isSelected ? 'text-[#7FE87F]' : 'text-[#A2A2BA]'
                      }`}
                    />
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? 'bg-[#7FE87F]/20 text-[#7FE87F] border-[#7FE87F]/40'
                          : 'bg-[#111726] text-[#A2A2BA] border-[#2C2C44]'
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

        {/* Bottom Sidebar Widget: Language Switcher & Logout */}
        <div className="pt-3 border-t border-[#2C2C44] space-y-3 shrink-0">
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
        {/* Top Desktop Navigation & Search Bar (Modern High-Contrast Prominent Search) */}
        <header className="h-20 lg:h-22 bg-[#0A0E1A] border-b border-[#242E44] flex items-center justify-between px-6 lg:px-8 gap-6 sticky top-0 z-40 w-full shadow-lg shadow-black/50">
          {/* Left: Sidebar Toggle Button & Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            {/* 1. Sidebar Toggle Icon Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              title={
                sidebarOpen
                  ? isAr
                    ? 'إخفاء القائمة الجانبية'
                    : 'Collapse Sidebar'
                  : isAr
                  ? 'إظهار القائمة الجانبية'
                  : 'Open Sidebar'
              }
              className={`h-11 w-11 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                sidebarOpen
                  ? 'bg-[#121A2C] border-[#2C3954] text-[#A2A2BA] hover:text-white hover:border-[#7FE87F]/40 hover:bg-[#18233B]'
                  : 'bg-[#7FE87F]/10 border-[#7FE87F]/30 text-[#7FE87F] hover:bg-[#7FE87F]/20 shadow-md shadow-[#7FE87F]/10'
              }`}
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            {/* 2. Pay Merchant Brand Logo & Badge */}
            <div
              onClick={() => navigateTo('MERCHANT_HOME')}
              className="flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              <Logo height={28} textColor="#FFFFFF" accentColor="#7FE87F" />
              <Badge
                variant="outline"
                className="text-[9.5px] font-bold px-2 py-0.5 text-[#7FE87F] border-[#7FE87F]/40 bg-[#7FE87F]/10"
              >
                {isAr ? 'التاجر' : 'MERCHANT'}
              </Badge>
            </div>
          </div>

          {/* Center: Sleek Premium Global Search Bar */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-2xl lg:max-w-3xl my-auto">
            <div
              className={`relative w-full flex items-center h-12 lg:h-[50px] rounded-2xl transition-all duration-200 ${
                isSearchFocused
                  ? 'bg-[#141E34] border-2 border-[#7FE87F] ring-4 ring-[#7FE87F]/15 shadow-2xl shadow-black'
                  : 'bg-[#121A2C] hover:bg-[#152037] border border-[#2B3954] hover:border-[#3D4F74] shadow-md shadow-black/40'
              }`}
            >
              {/* Search Icon */}
              <div
                className={`flex items-center justify-center shrink-0 transition-colors ${
                  isRtl ? 'pr-4 pl-2' : 'pl-4 pr-2'
                } ${isSearchFocused ? 'text-[#7FE87F]' : 'text-[#8E9AB5]'}`}
              >
                <Search className="h-5 w-5" />
              </div>

              {/* Input Field */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'بحث سريع في التحصيلات، العمليات، الفواتير، المرجع البنكي...'
                    : 'Search collections, UTR, transactions, customers, invoices...'
                }
                className={`w-full h-full bg-transparent text-sm text-white placeholder-[#7885A3] font-medium outline-none transition-all ${
                  isRtl ? 'pr-2 pl-16' : 'pl-2 pr-16'
                }`}
              />

              {/* Right Action: Clear Button or Cmd+K Badge */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 ${
                  isRtl ? 'left-3.5' : 'right-3.5'
                }`}
              >
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-lg text-[#A2A2BA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <kbd className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#1B253D] border border-[#344468] text-[#A2A2BA] shadow-sm">
                      ⌘K
                    </kbd>
                  </div>
                )}
              </div>
            </div>

            {/* Live Interactive Search Popup Dropdown (100% Solid Opaque Background) */}
            {isSearchFocused && cleanSearch.length > 0 && (
              <div
                className="absolute top-full mt-3 w-full bg-[#0D1424] border border-[#2B3954] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: '#0D1424', opacity: 1 }}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {/* Results Body */}
                <div
                  className="max-h-88 overflow-y-auto p-3 space-y-3 bg-[#0D1424] custom-scrollbar"
                  style={{ backgroundColor: '#0D1424' }}
                >
                  {/* 1. Quick Navigation Links */}
                  {matchingNavItems.length > 0 && (
                    <div>
                      <div className="text-[10.5px] font-extrabold text-[#7FE87F] uppercase tracking-wider px-2.5 py-1 flex items-center justify-between">
                        <span>{isAr ? 'الصفحات والأقسام' : 'Pages & Features'}</span>
                        <span className="text-[10px] text-[#6E7B98] font-normal lowercase">{matchingNavItems.length} {isAr ? 'نتائج' : 'found'}</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                item.action();
                                setIsSearchFocused(false);
                                setSearchQuery('');
                              }}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#131C30] hover:bg-[#1B2742] border border-[#1E2B45] hover:border-[#7FE87F]/40 text-neutral-200 hover:text-white transition-all cursor-pointer text-start shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#7FE87F]/10 border border-[#7FE87F]/20 flex items-center justify-center text-[#7FE87F]">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span>{isAr ? item.labelAr : item.labelEn}</span>
                              </div>
                              <span className="text-[10px] text-[#7FE87F] font-mono px-2 py-0.5 rounded bg-[#7FE87F]/10 border border-[#7FE87F]/20 font-bold">
                                {isAr ? 'انتقال ↵' : 'Jump ↵'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Collections / Transactions */}
                  {matchingCollections.length > 0 && (
                    <div>
                      <div className="text-[10.5px] font-extrabold text-[#7FE87F] uppercase tracking-wider px-2.5 py-1 flex items-center justify-between">
                        <span>{isAr ? 'العمليات والتحصيلات' : 'Transactions & Collections'}</span>
                        <span className="text-[10px] text-[#6E7B98] font-normal lowercase">{matchingCollections.length} {isAr ? 'عملية' : 'items'}</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingCollections.slice(0, 5).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              navigateTo('MERCHANT_COLLECTIONS');
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs bg-[#131C30] hover:bg-[#1B2742] border border-[#1E2B45] hover:border-[#7FE87F]/40 transition-all cursor-pointer text-start shadow-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                <CreditCard className="h-3.5 w-3.5" />
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-white text-xs truncate">
                                  {c.customerMasked || c.orderRef}
                                </div>
                                <div className="text-[10px] text-[#8E9AB5] mt-0.5">
                                  {c.paymentMethod} • <span className="font-mono">{c.orderRef}</span>
                                </div>
                              </div>
                            </div>
                            <span className="font-extrabold text-[#7FE87F] text-xs font-mono shrink-0 ml-2">
                              {formatSaudiCurrency(c.amount, language)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Empty Search State */}
                  {cleanSearch.length > 0 &&
                    matchingNavItems.length === 0 &&
                    matchingCollections.length === 0 && (
                      <div className="py-8 px-4 text-center bg-[#131C30] border border-[#1E2B45] rounded-xl space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-[#7FE87F]/10 border border-[#7FE87F]/20 flex items-center justify-center text-[#7FE87F]">
                          <Search className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-[#8E9AB5]">
                          {isAr ? 'لم يتم العثور على نتائج لـ' : 'No matches found for'}
                        </p>
                        <p className="font-bold text-white text-sm break-all font-mono">"{searchQuery}"</p>
                        <p className="text-[11px] text-[#6E7B98]">
                          {isAr ? 'جرّب البحث باسم المتجر، أو المرجع، أو الصفحة' : 'Try searching by customer name, order ref, amount or feature'}
                        </p>
                      </div>
                    )}
                </div>

                {/* Dropdown Footer */}
                <div className="px-4 py-2.5 bg-[#080D18] border-t border-[#1E2B45] text-[11px] text-[#8E9AB5] flex items-center justify-between">
                  <span>{isAr ? 'اضغط ESC للإغلاق' : 'Press ESC to dismiss'}</span>
                  <span className="text-[#7FE87F] font-semibold flex items-center gap-1">
                    <span>⚡</span> {isAr ? 'بحث تاجر كيو باي' : 'QPay Merchant Search'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Empty Balance Spacer */}
          <div className="w-11 shrink-0 hidden sm:block" />
        </header>

        {/* Desktop Screen Content Canvas */}
        <main className="flex-1 p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};



