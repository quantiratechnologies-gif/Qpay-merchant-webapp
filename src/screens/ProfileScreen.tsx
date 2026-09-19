import React from 'react';
import {
  Store,
  ShieldCheck,
  QrCode,
  SlidersHorizontal,
  CreditCard,
  Users,
  Languages,
  LogOut,
  Building2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, StatusBadge, ListRow } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';
import { translateText, formatLocalizedNumber } from '../utils/i18n';

export const ProfileScreen: React.FC = () => {
  const {
    merchantInfo,
    language,
    navigateTo,
    setIsLanguageModalOpen,
    setIsLogoutModalOpen,
    setIsKycModalOpen,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            {isAr ? 'متجري' : 'My Store'}
          </h1>
          <span
            style={{
              width: '8px', height: '8px',
              borderRadius: radii.full,
              backgroundColor: '#7FE87F',
              display: 'inline-block',
              boxShadow: '0 0 8px #7FE87F',
            }}
          />
        </div>
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '4px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'إدارة ملف المتجر والامتثال' : 'Store profile and settings'}
        </p>
      </div>

      {/* ── 2-Column Desktop Grid ─────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT COLUMN ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Store Identity Card */}
          <Card
            variant="elevated"
            style={{
              padding: '20px 22px',
              background: 'radial-gradient(ellipse at top left, rgba(127, 232, 127, 0.14) 0%, #111726 70%)',
              border: '1px solid rgba(127, 232, 127, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              {/* Store avatar */}
              <div
                style={{
                  width: '52px', height: '52px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  border: '1.5px solid rgba(127, 232, 127, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7FE87F',
                  flexShrink: 0,
                }}
              >
                <Store size={26} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>
                  {translateText(merchantInfo.businessName || (isAr ? 'متجر كوانتيرا' : 'Quantira Store'), language)}
                </div>
                <div style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '2px', fontFamily: 'monospace' }}>
                  {isAr ? 'السجل التجاري' : 'CR'}: {formatLocalizedNumber(merchantInfo.crNumber || '1010XXXXXX', language)}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status="success" size="sm" label={isAr ? 'معتمد' : 'Verified'} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2C2C44', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: isAr ? 'الرقم الضريبي' : 'VAT Number', value: formatLocalizedNumber(merchantInfo.vatNumber || '300XXXXXXXXX', language), mono: true },
                { label: isAr ? 'المدينة' : 'City', value: translateText(merchantInfo.city || (isAr ? 'الرياض' : 'Riyadh'), language) },
                { label: isAr ? 'النشاط' : 'Business Type', value: isAr ? 'تجزئة عامة' : 'General Retail' },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#A2A2BA' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', fontFamily: mono ? 'monospace' : undefined }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Settlement Account Card */}
          <Card variant="elevated" style={{ padding: '18px 20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'حساب التسوية' : 'Settlement Account'}
              </span>
              <StatusBadge status="success" size="sm" label={isAr ? 'الأساسي' : 'Primary'} />
            </div>

            <div
              onClick={() => navigateTo('MERCHANT_BANK_LINK')}
              className="interactive-tap"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
                <div
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: radii.md,
                    backgroundColor: 'rgba(127, 232, 127, 0.14)',
                    border: '1px solid rgba(127, 232, 127, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#7FE87F', flexShrink: 0,
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                    {translateText(merchantInfo.settlementBank || 'Al Rajhi Bank', language)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#A2A2BA', marginTop: '2px', fontFamily: 'monospace', fontWeight: 600 }} dir="ltr">
                    •••• {merchantInfo.settlementIban ? merchantInfo.settlementIban.slice(-9) : '6271 5005'}
                  </div>
                </div>
              </div>
              {isRtl ? <ChevronLeft size={18} color="#6E6E85" /> : <ChevronRight size={18} color="#6E6E85" />}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2C2C44', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#7FE87F" />
              <span style={{ fontSize: '11.5px', color: '#A2A2BA', fontWeight: 500 }}>
                {isAr ? 'تسوية فورية عبر سريع' : 'Instant Sarie settlement'}
              </span>
            </div>
          </Card>
        </div>

        {/* ─── RIGHT COLUMN ────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Core Store Management */}
          <Card variant="elevated" style={{ padding: '4px 0', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid #2C2C44', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'إدارة المتجر' : 'STORE MANAGEMENT'}
              </span>
            </div>
            <ListRow
              onClick={() => navigateTo('MERCHANT_SETUP')}
              leftIcon={<Store size={18} color="#7FE87F" />}
              title={isAr ? 'ملف المنشأة' : 'Business Profile'}
              subtitle={isAr ? 'بيانات السجل والضريبة' : 'Store & tax info'}
              showChevron={true}
            />
            <ListRow
              onClick={() => setIsKycModalOpen(true)}
              leftIcon={<ShieldCheck size={18} color="#7FE87F" />}
              title={isAr ? 'التحقق والامتثال' : 'KYC Verification'}
              subtitle={isAr ? 'حالة التوثيق' : 'Verification status'}
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              leftIcon={<QrCode size={18} color="#7FE87F" />}
              title={isAr ? 'إدارة الباركود' : 'Manage QR'}
              subtitle={isAr ? 'عرض ومشاركة الباركود' : 'QR settings'}
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('SECURITY')}
              leftIcon={<SlidersHorizontal size={18} color="#7FE87F" />}
              title={isAr ? 'إدارة الأعمال' : 'Manage Business'}
              subtitle={isAr ? 'إعدادات الدفع' : 'Payment settings'}
              showChevron={true}
            />
          </Card>

          {/* Operations & Settings */}
          <Card variant="elevated" style={{ padding: '4px 0', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid #2C2C44', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'الإعدادات والعمليات' : 'OPERATIONS & SETTINGS'}
              </span>
            </div>
            <ListRow
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              leftIcon={<CreditCard size={18} color="#7FE87F" />}
              title={isAr ? 'أجهزة وطرق الدفع' : 'Payment Instruments'}
              rightElement={
                <ExternalLink size={13} color="#6E6E85" />
              }
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('SECURITY')}
              leftIcon={<Users size={18} color="#7FE87F" />}
              title={isAr ? 'إدارة طاقم العمل' : 'Manage Staff'}
              rightElement={
                <span style={{ fontSize: '12px', color: '#A2A2BA', fontWeight: 600 }}>
                  {isAr ? '٣ نشطين' : '3 Active'}
                </span>
              }
              showChevron={true}
            />
            <ListRow
              onClick={() => setIsLanguageModalOpen(true)}
              leftIcon={<Languages size={18} color="#7FE87F" />}
              title={isAr ? 'لغة التطبيق' : 'App Language'}
              rightElement={
                <span style={{ fontSize: '12px', color: '#7FE87F', fontWeight: 800 }}>
                  {isAr ? '🇸🇦 العربية' : '🇬🇧 English'}
                </span>
              }
              showChevron={true}
            />
          </Card>

          {/* Danger Zone */}
          <Card variant="elevated" style={{ padding: '4px 0', background: '#111726', border: '1px solid #2C2C44' }}>
            <ListRow
              danger={true}
              onClick={() => setIsLogoutModalOpen(true)}
              leftIcon={<LogOut size={18} />}
              title={isAr ? 'تسجيل الخروج' : 'Log Out'}
              showChevron={true}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
