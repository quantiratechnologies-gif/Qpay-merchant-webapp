import React from 'react';
import { AlphPayLogo } from '../AlphPayLogo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { ShieldCheck, SmartphoneNfc, QrCode, Zap, Building2, CheckCircle2 } from 'lucide-react';

interface DesktopAuthLayoutProps {
  children: React.ReactNode;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
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
    ? 'بوابة المدفوعات الذكية لقطاع الأعمال في المملكة'
    : 'Unified Smart Payment Infrastructure for Saudi Merchants';

  const defaultSubtitle = isAr
    ? 'إدارة نقاط البيع الافتراضية، إصدار الفواتير المعتمدة من هيئة الزكاة، والتسوية الفورية للمبيعات ٢٤/٧ عبر شبكة سريع.'
    : 'Virtual POS operations, ZATCA Phase 2 compliant e-invoicing, and 24/7 instant sales settlements via Sarie rail.';

  const features = [
    {
      icon: <SmartphoneNfc size={20} color="#00C853" />,
      titleEn: 'SoftPOS Virtual Terminal',
      titleAr: 'نقاط بيع فورية SoftPOS',
      descEn: 'Accept mada, Apple Pay, Visa & Mastercard with zero hardware cost',
      descAr: 'قبول مدفوعات مدى وأبل باي والبطاقات دون الحاجة لأجهزة مخصصة',
    },
    {
      icon: <QrCode size={20} color="#00C853" />,
      titleEn: 'ZATCA Phase 2 E-Invoicing',
      titleAr: 'فوترة إلكترونية معتمدة من الزكاة',
      descEn: '100% compliant dynamic QR invoices with 15% VAT calculation',
      descAr: 'فواتير ضريبية مبسطة متوافقة بالكامل مع المرحلة الثانية لزاتكا',
    },
    {
      icon: <Zap size={20} color="#00C853" />,
      titleEn: 'Instant 24/7 Sarie Settlements',
      titleAr: 'تسويات فورية ٢٤/٧ عبر سريع',
      descEn: 'Funds transferred directly into your Saudi business IBAN in seconds',
      descAr: 'إيداع المبيعات مباشرة في آيبان المنشأة المصرفي خلال ثوانٍ',
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
      {/* Left 52% Hero Enterprise Showcase Panel */}
      <div
        style={{
          flex: '1.1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          background: 'radial-gradient(circle at 20% 30%, rgba(0, 200, 83, 0.14) 0%, rgba(8, 12, 20, 0.98) 75%)',
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

          <div style={{ marginTop: '36px', maxWidth: '540px' }}>
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
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={14} />
              {isAr ? 'شبكة التجار المعتمدة في المملكة' : 'Regulated Saudi Merchant Network'}
            </div>

            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                lineHeight: 1.25,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {heroTitle || defaultTitle}
            </h1>

            <p
              style={{
                fontSize: '14.5px',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginTop: '14px',
                marginBottom: 0,
              }}
            >
              {heroSubtitle || defaultSubtitle}
            </p>
          </div>
        </div>

        {/* Value Prop Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '32px 0', maxWidth: '520px' }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(17, 23, 38, 0.7)',
                border: '1px solid #1E293B',
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
            <span>{isAr ? 'مشفر وفق معايير الحماية المصرفية ٢٥٦-بت' : 'Bank-Grade 256-Bit SSL Encrypted Rail'}</span>
          </div>

          <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 700 }}>
            mada • Sarie • ZATCA
          </div>
        </div>
      </div>

      {/* Right 48% Enterprise Auth Form Panel */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          backgroundColor: '#080C14',
          padding: '36px 48px',
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
            maxWidth: '480px',
            margin: '0 auto',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '12.5px', fontWeight: 700 }}>
            <Building2 size={16} color="#00C853" />
            <span>{isAr ? 'بوابة الأعمال والتجار' : 'Merchant Business Portal'}</span>
          </div>

          <div>
            <LanguageSwitchPill variant="compact" />
          </div>
        </div>

        {/* Center Container for Active Screen Form */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            margin: 'auto',
            padding: '36px 32px',
            backgroundColor: '#0E131F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.55)',
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
