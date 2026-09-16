import React, { useState } from 'react';
import { Landmark, Check, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card, StatusBadge } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

const SAUDI_SETTLEMENT_BANKS = [
  {
    name: 'Al Rajhi Bank',
    arabicName: 'مصرف الراجحي',
    iban: 'SA55 8000 0000 6271 5005',
    code: '03',
    swift: 'RJHISARI',
  },
  {
    name: 'Saudi National Bank (SNB)',
    arabicName: 'البنك الأهلي السعودي (SNB)',
    iban: 'SA12 1000 0000 1903 4004',
    code: '10',
    swift: 'NCBKSAJE',
  },
  {
    name: 'Riyad Bank',
    arabicName: 'بنك الرياض',
    iban: 'SA03 2000 0000 9397 1001',
    code: '20',
    swift: 'RIBLSARI',
  },
  {
    name: 'Alinma Bank',
    arabicName: 'مصرف الإنماء',
    iban: 'SA84 0500 0000 4102 2002',
    code: '05',
    swift: 'INMASARI',
  },
  {
    name: 'Saudi Awwal Bank (SAB)',
    arabicName: 'البنك السعودي الأول (SAB)',
    iban: 'SA44 5000 0000 8821 3003',
    code: '45',
    swift: 'SABBSARI',
  },
];

export const MerchantSettlementBankScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';
  const [selectedBank, setSelectedBank] = useState(merchantInfo.settlementBank || 'Al Rajhi Bank');
  const [selectedIban, setSelectedIban] = useState(merchantInfo.settlementIban || 'SA55 8000 0000 6271 5005');

  const handleSelectBank = (bank: typeof SAUDI_SETTLEMENT_BANKS[0]) => {
    setSelectedBank(bank.name);
    setSelectedIban(bank.iban);
  };

  const handleContinue = () => {
    updateMerchantInfo({
      settlementBank: selectedBank,
      settlementIban: selectedIban,
    });
    navigateTo('MERCHANT_PIN_SETUP');
  };

  const currentBank = SAUDI_SETTLEMENT_BANKS.find((b) => b.name === selectedBank);

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
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
          {isAr ? 'حساب التسوية البنكي' : 'Settlement Account'}
        </h1>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr
            ? 'يتم إيداع وتحويل مبيعات المتجر اليومية تلقائياً إلى هذا الحساب عبر سريع.'
            : 'Daily collections from cards and QR will be deposited directly via Sarie.'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Bank Selector ─────────────────────────── */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            {isAr ? 'اختر بنك التسوية' : 'SELECT SETTLEMENT BANK'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAUDI_SETTLEMENT_BANKS.map((bank) => {
              const isSelected = selectedBank === bank.name;
              return (
                <div
                  key={bank.name}
                  onClick={() => handleSelectBank(bank)}
                  className="interactive-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.06)' : colors.bgCard,
                    border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                    borderRadius: radii.lg,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
                    <div
                      style={{
                        width: '44px', height: '44px',
                        borderRadius: radii.md,
                        backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.12)' : colors.bgInset,
                        border: `1px solid ${isSelected ? 'rgba(0, 200, 83, 0.25)' : colors.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? colors.accentGreen : colors.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={20} />
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: isSelected ? 800 : 600, color: isSelected ? colors.textPrimary : '#CBD5E1' }}>
                        {isAr ? bank.arabicName : bank.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: colors.textSecondary, fontFamily: 'monospace', marginTop: '2px' }} dir="ltr">
                        {bank.iban}
                      </div>
                    </div>
                  </div>

                  {/* Radio dot */}
                  <div
                    style={{
                      width: '22px', height: '22px',
                      borderRadius: radii.full,
                      backgroundColor: isSelected ? colors.accentGreen : 'transparent',
                      border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#080C14',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT: Selected Bank Summary + CTA ──────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          {/* Selection Summary Card */}
          <Card
            variant="elevated"
            style={{
              padding: '22px',
              background: 'radial-gradient(ellipse at top left, rgba(0, 200, 83, 0.08) 0%, #111726 70%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '48px', height: '48px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.accentGreen,
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: colors.textPrimary }}>
                  {currentBank ? (isAr ? currentBank.arabicName : currentBank.name) : (isAr ? 'غير محدد' : 'Not selected')}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status="success" size="sm" label={isAr ? 'بنك معتمد SAMA' : 'SAMA Certified'} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                {
                  label: isAr ? 'رقم الآيبان' : 'IBAN',
                  value: currentBank?.iban || '—',
                  mono: true,
                },
                {
                  label: isAr ? 'رمز سويفت' : 'SWIFT',
                  value: currentBank?.swift || '—',
                  mono: true,
                },
                {
                  label: isAr ? 'شبكة التسوية' : 'Network',
                  value: isAr ? 'سريع (تسوية فورية)' : 'Sarie (Instant Transfer)',
                },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary, fontFamily: mono ? 'monospace' : undefined }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Trust Note */}
          <Card variant="inset" style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ShieldCheck size={16} color={colors.accentGreen} style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              {isAr
                ? 'جميع البنوك المدرجة معتمدة من ساما وتدعم تسويات سريع الفورية مع ضمان ZATCA.'
                : 'All listed banks are SAMA-licensed and support Sarie real-time transfers with ZATCA compliance.'}
            </p>
          </Card>

          {/* CTA */}
          <PrimaryButton onClick={handleContinue}>
            {t('btn.continue', 'Continue')}
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
