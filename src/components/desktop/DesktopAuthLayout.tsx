import React from 'react';
import { AlphPayLogo } from '../AlphPayLogo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, SmartphoneNfc, QrCode, Zap, CheckCircle2 } from 'lucide-react';

interface DesktopAuthLayoutProps {
  children: React.ReactNode;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  activeFeatureIndex?: number;
}

export const DesktopAuthLayout: React.FC<DesktopAuthLayoutProps> = ({
  children,
  heroImage: _heroImage = '/onboarding-softpos.jpg',
  heroTitle,
  heroSubtitle,
}) => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const defaultTitle = isAr
    ? 'بوابة مدفوعات الأعمال الذكية في المملكة'
    : 'Unified Smart Payment Infrastructure for Saudi Merchants';

  const defaultSubtitle = isAr
    ? 'قبول مدفوعات مدى والبطاقات، إصدار فواتير ضريبية متوافقة مع هيئة الزكاة، وتسويات فورية ٢٤/٧ عبر نظام سريع.'
    : 'Accept mada contactless payments, issue ZATCA Phase 2 e-invoices, and settle funds instantly 24/7 via the Sarie rail.';

  const features = [
    {
      icon: <SmartphoneNfc size={18} color="#00C853" />,
      titleEn: 'Turn Phone into SoftPOS',
      titleAr: 'نقاط بيع فورية عبر الجوال',
      descEn: 'Accept mada, Apple Pay, Visa & Mastercard',
      descAr: 'قبول مدفوعات مدى وأبل باي والبطاقات الائتمانية',
    },
    {
      icon: <QrCode size={18} color="#00C853" />,
      titleEn: 'ZATCA Phase 2 E-Invoicing',
      titleAr: 'فوترة إلكترونية معتمدة من الزكاة',
      descEn: '100% compliant QR invoices with 15% VAT breakdown',
      descAr: 'فواتير ضريبية مبسطة متوافقة مع متطلبات المرحلة الثانية',
    },
    {
      icon: <Zap size={18} color="#00C853" />,
      titleEn: 'Instant 24/7 Sarie Payouts',
      titleAr: 'تسويات فورية عبر شبكة سريع',
      descEn: 'Funds deposited straight to your Saudi IBAN in seconds',
      descAr: 'تحويل مباشر إلى حسابك البنكي خلال ثوانٍ معدودة',
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
      {/* Left 50% Hero Showcase Panel (Visible on Desktop >= 1024px) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          background: 'radial-gradient(circle at 20% 30%, rgba(0, 200, 83, 0.16) 0%, rgba(8, 12, 20, 0.98) 75%)',
          borderRight: isRtl ? 'none' : '1px solid #1A2234',
          borderLeft: isRtl ? '1px solid #1A2234' : 'none',
          position: 'relative',
          boxSizing: 'border-box',
        }}
        className="auth-hero-panel"
      >
        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlphPayLogo variant="horizontal" size={32} themeMode="dark" />
          </div>

          <div style={{ marginTop: '40px', maxWidth: '520px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                color: '#00C853',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={13} />
              <span>{isAr ? 'مرخص ومعتمد في المملكة العربية السعودية' : 'Regulated Saudi Merchant Network'}</span>
            </div>

            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {heroTitle || defaultTitle}
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginTop: '14px',
                fontWeight: 500,
              }}
            >
              {heroSubtitle || defaultSubtitle}
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '36px 0', maxWidth: '520px' }}>
          {features.map((feat, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid #1E293B',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? feat.titleAr : feat.titleEn}
                </div>
                <div style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.4 }}>
                  {isAr ? feat.descAr : feat.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust & Compliance Footnote */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid #1A2234',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>
            <ShieldCheck size={16} color="#00C853" />
            <span>{isAr ? 'محمي بواسطة بنية تحتية مصرفية مشفرة ٢٥٦-بت' : 'Bank-Grade 256-Bit SSL Encrypted Rail'}</span>
          </div>

          <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 700 }}>
            mada • Sarie • ZATCA
          </div>
        </div>
      </div>

      {/* Right 50% Interactive Action Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          backgroundColor: '#080C14',
          padding: '24px 32px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Top Header Row with Language Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '440px',
            margin: '0 auto',
            paddingBottom: '16px',
          }}
        >
          <div className="mobile-logo-only" style={{ display: 'none' }}>
            <AlphPayLogo variant="horizontal" size={24} themeMode="dark" />
          </div>

          <div style={{ [isRtl ? 'marginRight' : 'marginLeft']: 'auto' }}>
            <LanguageSwitchPill variant="compact" />
          </div>
        </div>

        {/* Center Container for Active Screen Form */}
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            margin: 'auto',
            padding: '28px 24px',
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            textAlign: 'center',
            color: '#475569',
            fontSize: '12px',
            fontWeight: 600,
            paddingTop: '16px',
          }}
        >
          {isAr
            ? '© ٢٠٢٦ كيو تي باي. مشغل بواسطة تقنيات كوانتيرا. جميع الحقوق محفوظة.'
            : '© 2026 QTPay. Powered by Quantira Technologies. All rights reserved.'}
        </div>
      </div>
    </div>
  );
};
