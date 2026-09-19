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
  const { merchantInfo, updateMerchantInfo, navigateTo, language, isRtl } = useApp();
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
          {isAr ? 'حساب التسوية' : 'Settlement Account'}
        </h1>
        <p style={{ fontSize: '13px', color: '#A3A3A3', margin: '4px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'التحويل المباشر لمبيعات المتجر عبر سريع' : 'Automatic daily settlements via Sarie'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Bank Selector ─────────────────────────── */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            {isAr ? 'اختر البنك' : 'Select Bank'}
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
                    padding: '14px 18px',
                    backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.1)' : '#171717',
                    border: `1.5px solid ${isSelected ? '#D4AF37' : '#262626'}`,
                    borderRadius: radii.lg,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
                    <div
                      style={{
                        width: '40px', height: '40px',
                        borderRadius: radii.md,
                        backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.15)' : '#1E1E1E',
                        border: `1px solid ${isSelected ? 'rgba(212, 175, 55, 0.35)' : '#262626'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#D4AF37' : '#737373',
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#FFFFFF' : '#A3A3A3' }}>
                        {isAr ? bank.arabicName : bank.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#737373', fontFamily: 'monospace', marginTop: '2px' }} dir="ltr">
                        {bank.iban}
                      </div>
                    </div>
                  </div>

                  {/* Radio dot */}
                  <div
                    style={{
                      width: '20px', height: '20px',
                      borderRadius: radii.full,
                      backgroundColor: isSelected ? '#D4AF37' : 'transparent',
                      border: `1.5px solid ${isSelected ? '#D4AF37' : '#262626'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#0B0B0B',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
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
              padding: '20px',
              background: 'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.12) 0%, #171717 70%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4AF37',
                }}
              >
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>
                  {currentBank ? (isAr ? currentBank.arabicName : currentBank.name) : (isAr ? 'غير محدد' : 'Not selected')}
                </div>
                <div style={{ marginTop: '3px' }}>
                  <StatusBadge status="success" size="sm" label={isAr ? 'معتمد' : 'Verified'} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {
                  label: isAr ? 'الآيبان' : 'IBAN',
                  value: currentBank?.iban || '—',
                  mono: true,
                },
                {
                  label: isAr ? 'سويفت' : 'SWIFT',
                  value: currentBank?.swift || '—',
                  mono: true,
                },
                {
                  label: isAr ? 'الشبكة' : 'Network',
                  value: isAr ? 'سريع' : 'Sarie Instant',
                },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #262626' }}>
                  <span style={{ fontSize: '12px', color: '#A3A3A3' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', fontFamily: mono ? 'monospace' : undefined }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Trust Note */}
          <Card variant="inset" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px', background: '#121212', border: '1px solid #262626' }}>
            <ShieldCheck size={15} color="#D4AF37" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '11.5px', color: '#A3A3A3', margin: 0, fontWeight: 500 }}>
              {isAr ? 'جميع البنوك معتمدة وتدعم تسوية سريع الفورية' : 'All banks support instant Sarie settlements'}
            </p>
          </Card>

          {/* CTA */}
          <PrimaryButton onClick={handleContinue}>
            {isAr ? 'متابعة' : 'Continue'}
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
