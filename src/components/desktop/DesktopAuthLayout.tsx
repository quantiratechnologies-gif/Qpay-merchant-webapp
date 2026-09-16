import React from 'react';
import { AlphPayLogo } from '../AlphPayLogo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, SmartphoneNfc, QrCode, Zap } from 'lucide-react';

interface DesktopAuthLayoutProps {
  children: React.ReactNode;
}

export const DesktopAuthLayout: React.FC<DesktopAuthLayoutProps> = ({ children }) => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const highlights = [
    {
      icon: <Zap size={16} color="#00C853" />,
      textEn: 'Instant 24/7 Sarie Settlements',
      textAr: 'تسويات فورية ٢٤/٧ عبر سريع',
    },
    {
      icon: <SmartphoneNfc size={16} color="#00C853" />,
      textEn: 'SoftPOS Virtual POS & mada Tap',
      textAr: 'نقاط بيع افتراضية والدفع باللمس',
    },
    {
      icon: <QrCode size={16} color="#00C853" />,
      textEn: 'ZATCA Phase 2 E-Invoicing',
      textAr: 'فوترة ضريبية معتمدة من الزكاة',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* Left 45% Minimal Hero Brand Showcase */}
      <div
        style={{
          flex: '0.9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          background: 'radial-gradient(circle at 20% 30%, rgba(0, 200, 83, 0.12) 0%, rgba(8, 12, 20, 0.98) 75%)',
          borderRight: isRtl ? 'none' : '1px solid #141C2E',
          borderLeft: isRtl ? '1px solid #141C2E' : 'none',
          boxSizing: 'border-box',
        }}
        className="auth-hero-panel"
      >
        {/* Brand Top */}
        <div>
          <AlphPayLogo variant="horizontal" size={30} themeMode="dark" />

          <div style={{ marginTop: '56px', maxWidth: '440px' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 900,
                lineHeight: 1.3,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 12px 0',
              }}
            >
              {isAr ? 'بوابة مدفوعات التجار الذكية' : 'Smart Business Payments Portal'}
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              {isAr ? 'منصة متكاملة للمدفوعات الرقمية والفوترة الفورية' : 'Next-gen payment rails and instant billing infrastructure'}
            </p>
          </div>

          {/* Minimal Highlights Strip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '36px' }}>
            {highlights.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(17, 23, 38, 0.5)',
                  border: '1px solid #1A2234',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#CBD5E1',
                  maxWidth: '380px',
                }}
              >
                {item.icon}
                <span>{isAr ? item.textAr : item.textEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '11.5px', fontWeight: 600 }}>
          <ShieldCheck size={14} color="#00C853" />
          <span>mada • Sarie • SAMA & ZATCA Compliant</span>
        </div>
      </div>

      {/* Right 55% Minimal Auth Form */}
      <div
        style={{
          flex: '1.1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          backgroundColor: '#080C14',
          padding: '32px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header with Language Pill */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px',
            margin: '0 auto',
          }}
        >
          <LanguageSwitchPill variant="compact" />
        </div>

        {/* Center Minimal Auth Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            margin: 'auto',
            padding: '32px 28px',
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>

        {/* Minimal Copyright */}
        <div style={{ textAlign: 'center', color: '#334155', fontSize: '11px', fontWeight: 600 }}>
          © 2026 QTPay • Quantira Technologies
        </div>
      </div>
    </div>
  );
};
