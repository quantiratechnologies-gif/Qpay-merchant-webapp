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
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
            {isAr ? 'متجري' : 'My Store'}
          </h1>
          <span
            style={{
              width: '8px', height: '8px',
              borderRadius: radii.full,
              backgroundColor: colors.accentGreen,
              display: 'inline-block',
              boxShadow: `0 0 8px ${colors.accentGreen}`,
            }}
          />
        </div>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'إدارة ملف المتجر والأجهزة والامتثال' : 'Manage store profile, hardware & compliance'}
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
              padding: '22px 24px',
              background: 'radial-gradient(ellipse at top left, rgba(0, 200, 83, 0.07) 0%, #111726 70%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              {/* Store avatar */}
              <div
                style={{
                  width: '60px', height: '60px',
                  borderRadius: '18px',
                  backgroundColor: colors.primaryLight,
                  border: '1.5px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.accentGreen,
                  flexShrink: 0,
                }}
              >
                <Store size={28} />
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: colors.textPrimary }}>
                  {merchantInfo.businessName || (isAr ? 'متجر كوانتيرا' : 'Quantira Store')}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px', fontFamily: 'monospace' }}>
                  CR: {merchantInfo.crNumber || '1010XXXXXX'}
                </div>
                <div style={{ marginTop: '6px' }}>
                  <StatusBadge status="success" size="sm" label={isAr ? 'معتمد ZATCA' : 'ZATCA Approved'} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: isAr ? 'الرقم الضريبي' : 'VAT Number', value: merchantInfo.vatNumber || '300XXXXXXXXX', mono: true },
                { label: isAr ? 'المدينة' : 'City', value: merchantInfo.city || (isAr ? 'الرياض' : 'Riyadh') },
                { label: isAr ? 'التصنيف التجاري' : 'Business Type', value: isAr ? 'تجزئة عامة' : 'General Retail' },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', color: colors.textSecondary }}>{label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary, fontFamily: mono ? 'monospace' : undefined }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Settlement Account Card */}
          <Card variant="elevated" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'حساب التسوية البنكي' : 'SETTLEMENT ACCOUNT'}
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
                    width: '44px', height: '44px',
                    borderRadius: radii.md,
                    backgroundColor: colors.primaryLight,
                    border: '1px solid rgba(0, 200, 83, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: colors.accentGreen, flexShrink: 0,
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: colors.textPrimary }}>
                    {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px', fontFamily: 'monospace', fontWeight: 600 }} dir="ltr">
                    •••• {merchantInfo.settlementIban ? merchantInfo.settlementIban.slice(-9) : '6271 5005'}
                  </div>
                </div>
              </div>
              {isRtl ? <ChevronLeft size={18} color={colors.textMuted} /> : <ChevronRight size={18} color={colors.textMuted} />}
            </div>

            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color={colors.accentGreen} />
              <span style={{ fontSize: '11.5px', color: colors.textSecondary, fontWeight: 500 }}>
                {isAr ? 'متصل بنظام سريع • تحويل فوري' : 'Connected to Sarie • Instant settlement'}
              </span>
            </div>
          </Card>
        </div>

        {/* ─── RIGHT COLUMN ────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Core Store Management */}
          <Card variant="elevated" style={{ padding: '6px 0' }}>
            <div style={{ padding: '12px 18px 8px', borderBottom: `1px solid ${colors.border}`, marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'إدارة المتجر' : 'STORE MANAGEMENT'}
              </span>
            </div>
            <ListRow
              onClick={() => navigateTo('MERCHANT_SETUP')}
              leftIcon={<Store size={18} />}
              title={isAr ? 'ملف المنشأة' : 'Business Profile'}
              subtitle={isAr ? 'عرض وتعديل بيانات السجل والضريبة' : 'View & edit store & tax info'}
              showChevron={true}
            />
            <ListRow
              onClick={() => setIsKycModalOpen(true)}
              leftIcon={<ShieldCheck size={18} />}
              title={isAr ? 'التحقق والامتثال' : 'KYC Verification'}
              subtitle={isAr ? 'توثيق معتمد لرفع سقوف التحصيل' : 'Unlock exclusive tier benefits'}
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              leftIcon={<QrCode size={18} />}
              title={isAr ? 'إدارة الباركود' : 'Manage QR'}
              subtitle={isAr ? 'طباعة ومشاركة باركود المتجر' : 'Manage & order store QR'}
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('SECURITY')}
              leftIcon={<SlidersHorizontal size={18} />}
              title={isAr ? 'إدارة الأعمال' : 'Manage Business'}
              subtitle={isAr ? 'إعدادات الدفع' : 'Payment settings'}
              showChevron={true}
            />
          </Card>

          {/* Operations & Settings */}
          <Card variant="elevated" style={{ padding: '6px 0' }}>
            <div style={{ padding: '12px 18px 8px', borderBottom: `1px solid ${colors.border}`, marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {isAr ? 'الإعدادات والعمليات' : 'OPERATIONS & SETTINGS'}
              </span>
            </div>
            <ListRow
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              leftIcon={<CreditCard size={18} />}
              title={isAr ? 'أجهزة وطرق الدفع' : 'Payment Instruments'}
              rightElement={
                <ExternalLink size={13} color={colors.textMuted} />
              }
              showChevron={true}
            />
            <ListRow
              onClick={() => navigateTo('SECURITY')}
              leftIcon={<Users size={18} />}
              title={isAr ? 'إدارة طاقم العمل' : 'Manage Staff'}
              rightElement={
                <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: 600 }}>
                  {isAr ? '٣ نشطين' : '3 Active'}
                </span>
              }
              showChevron={true}
            />
            <ListRow
              onClick={() => setIsLanguageModalOpen(true)}
              leftIcon={<Languages size={18} />}
              title={isAr ? 'لغة التطبيق' : 'App Language'}
              rightElement={
                <span style={{ fontSize: '12.5px', color: '#00FF24', fontWeight: 800 }}>
                  {isAr ? '🇸🇦 العربية' : '🇬🇧 English'}
                </span>
              }
              showChevron={true}
            />
          </Card>

          {/* Danger Zone */}
          <Card variant="elevated" style={{ padding: '6px 0' }}>
            <ListRow
              danger={true}
              onClick={() => setIsLogoutModalOpen(true)}
              leftIcon={<LogOut size={18} />}
              title={isAr ? 'تسجيل الخروج من الحساب' : 'Log Out Account'}
              showChevron={true}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
