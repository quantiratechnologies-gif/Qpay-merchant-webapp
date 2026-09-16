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
  Zap,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { AlphPayLogo } from '../AlphPayLogo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import type { ScreenId } from '../../types';

interface DesktopWebLayoutProps {
  children: React.ReactNode;
}

export const DesktopWebLayout: React.FC<DesktopWebLayoutProps> = ({ children }) => {
  const {
    currentScreen,
    navigateTo,
    language,
    isRtl,
    merchantInfo,
    merchantCollections,
    triggerSettleNow,
    setIsLogoutModalOpen,
    speakSoundBox,
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

  const handleSettleClick = async () => {
    setIsSettling(true);
    try {
      await triggerSettleNow();
    } finally {
      setIsSettling(false);
    }
  };

  const navItems: {
    id: ScreenId;
    labelEn: string;
    labelAr: string;
    icon: React.ReactNode;
    categoryEn: string;
    categoryAr: string;
    badge?: string;
  }[] = [
    // Section 1: Core Operations
    {
      id: 'MERCHANT_HOME',
      labelEn: 'Dashboard Overview',
      labelAr: 'لوحة التحكم الرئيسية',
      icon: <LayoutDashboard size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'SOFTPOS_TERMINAL',
      labelEn: 'SoftPOS Virtual Terminal',
      labelAr: 'الدفع باللمس بالجوال',
      icon: <SmartphoneNfc size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'NFC',
    },
    {
      id: 'PAYMENT_LINK_GENERATOR',
      labelEn: 'Payment Links',
      labelAr: 'روابط الدفع الرقمية',
      icon: <Link2 size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'MERCHANT_QR_GENERATOR',
      labelEn: 'ZATCA E-Invoice QR',
      labelAr: 'رمز الفاتورة الضريبية',
      icon: <QrCode size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Phase 2',
    },
    {
      id: 'MERCHANT_COLLECTIONS',
      labelEn: 'Collections & Settlements',
      labelAr: 'التحصيلات والتسويات',
      icon: <ReceiptText size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'MERCHANT_INSIGHTS',
      labelEn: 'Analytics & Insights',
      labelAr: 'التحليلات والتقارير',
      icon: <TrendingUp size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
    },
    {
      id: 'SOUNDBOX_NOTIFIER',
      labelEn: 'Smart SoundBox Speaker',
      labelAr: 'جهاز الإشعار الصوتي',
      icon: <Volume2 size={19} />,
      categoryEn: 'OPERATIONS',
      categoryAr: 'العمليات الأساسية',
      badge: 'Active',
    },

    // Section 2: Store Management & Settings
    {
      id: 'PROFILE',
      labelEn: 'Store Profile & KYC',
      labelAr: 'ملف المنشأة والتوثيق',
      icon: <Store size={19} />,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'MERCHANT_BANK_LINK',
      labelEn: 'Settlement Bank IBAN',
      labelAr: 'حساب التسوية البنكي',
      icon: <Building2 size={19} />,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'SECURITY',
      labelEn: 'Cashiers & PIN Security',
      labelAr: 'الكاشيرات والأمان',
      icon: <ShieldCheck size={19} />,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
    {
      id: 'NOTIFICATIONS',
      labelEn: 'Alerts & Activity Log',
      labelAr: 'التنبيهات وسجل النشاط',
      icon: <Bell size={19} />,
      categoryEn: 'MANAGEMENT',
      categoryAr: 'إدارة المنشأة',
    },
  ];

  // If in auth/onboarding screen on web, render without enterprise sidebar
  const isAuthFlow =
    currentScreen === 'SPLASH' ||
    currentScreen === 'ONBOARDING' ||
    currentScreen === 'MOBILE_NUMBER' ||
    currentScreen === 'SMS_OTP' ||
    currentScreen === 'PERMISSIONS';

  if (isAuthFlow) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#080C14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* 1. Left Persistent Enterprise Desktop Sidebar */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          backgroundColor: '#0B0F19',
          borderRight: isRtl ? 'none' : '1px solid #1A2234',
          borderLeft: isRtl ? '1px solid #1A2234' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          padding: '20px 16px',
          boxSizing: 'border-box',
          zIndex: 40,
        }}
      >
        {/* Top: Brand Header & Store Identity */}
        <div>
          <div
            onClick={() => navigateTo('MERCHANT_HOME')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 8px 18px 8px',
              borderBottom: '1px solid #1A2234',
              cursor: 'pointer',
            }}
          >
            <AlphPayLogo variant="horizontal" size={26} themeMode="dark" />
          </div>

          {/* Store Identification Squircle */}
          <div
            onClick={() => navigateTo('PROFILE')}
            className="interactive-tap"
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #1E293B',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
                flexShrink: 0,
              }}
            >
              <Store size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {merchantInfo.businessName || (isAr ? 'تموينات القمة للتجارة' : 'GreenLeaf Markets LLC')}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#00C853',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{isAr ? 'موثق زكاة وسريع' : 'ZATCA & Sarie Verified'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isSelected = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="interactive-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(0, 200, 83, 0.3)' : '1px solid transparent',
                    color: isSelected ? '#00C853' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    fontWeight: isSelected ? 800 : 600,
                    textAlign: isRtl ? 'right' : 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: isSelected ? '#00C853' : '#64748B' }}>{item.icon}</span>
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: isSelected ? '#00C853' : '#1E293B',
                        color: isSelected ? '#080C14' : '#94A3B8',
                        padding: '2px 6px',
                        borderRadius: '6px',
                      }}
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
        <div style={{ borderTop: '1px solid #1A2234', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Quick Settlement CTA Tile */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#111726',
              border: '1px solid rgba(0, 200, 83, 0.2)',
              borderRadius: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? 'الرصيد المتاح للتحويل' : 'Unsettled Balance'}
              </span>
              <span style={{ fontSize: '10px', color: '#00C853', fontWeight: 800 }}>
                {isAr ? 'سريع ٢٤/٧' : 'Sarie 24/7'}
              </span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
              SAR {displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <button
              onClick={handleSettleClick}
              disabled={isSettling}
              className="interactive-tap"
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#00C853',
                color: '#080C14',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Zap size={14} />
              <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : (isAr ? 'تسوية فورية للبنك' : 'Instant Settle')}</span>
            </button>
          </div>

          {/* Language Switcher & Logout Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <LanguageSwitchPill variant="compact" />
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              aria-label="Logout"
              className="interactive-tap"
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                border: '1px solid rgba(255, 71, 87, 0.25)',
                color: '#FF4757',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={13} />
              <span>{isAr ? 'خروج' : 'Exit'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Canvas & Top Enterprise Header */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Top Desktop Navigation & Search Bar */}
        <header
          style={{
            height: '68px',
            backgroundColor: 'rgba(11, 15, 25, 0.94)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid #1A2234',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxSizing: 'border-box',
          }}
        >
          {/* Left: Global Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '420px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={16}
                color="#64748B"
                style={{
                  position: 'absolute',
                  [isRtl ? 'right' : 'left']: '12px',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في العمليات، الفواتير، المرجع البنكي...' : 'Search collections, UTR, invoices, customers...'}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  paddingLeft: isRtl ? '12px' : '36px',
                  paddingRight: isRtl ? '36px' : '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Right: SoundBox Live Status & Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Live SoundBox Audio Test Trigger */}
            <button
              onClick={() => speakSoundBox(350.0)}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 200, 83, 0.08)',
                border: '1px solid rgba(0, 200, 83, 0.25)',
                color: '#00C853',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Volume2 size={15} />
              <span>{isAr ? '🔊 جهاز الصوت متصل' : '🔊 SoundBox Online'}</span>
            </button>

            {/* Quick Charge / QR Button */}
            <button
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: '#00C853',
                color: '#080C14',
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <SmartphoneNfc size={16} />
              <span>{isAr ? '+ تحصيل جديد' : '+ New Charge'}</span>
            </button>
          </div>
        </header>

        {/* Desktop Screen Content Canvas */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px 60px 32px',
            maxWidth: '1360px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
