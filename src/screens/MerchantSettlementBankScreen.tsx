import React, { useState, useEffect } from 'react';
import { Landmark, Check, ArrowRight, ShieldCheck, Building2, CheckCircle2, Lock, Delete, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card, StatusBadge } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';
import { toArabicNumerals } from '../utils/i18n';

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
  const [successToast, setSuccessToast] = useState(false);

  // Dedicated in-screen PIN pop-up state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);

  const handleSelectBank = (bank: typeof SAUDI_SETTLEMENT_BANKS[0]) => {
    setSelectedBank(bank.name);
    setSelectedIban(bank.iban);
  };

  const handleOpenPinPopup = () => {
    setEnteredPin('');
    setPinError('');
    setPinSuccess(false);
    setIsPinModalOpen(true);
  };

  const handleClosePinPopup = () => {
    setEnteredPin('');
    setPinError('');
    setPinSuccess(false);
    setIsPinModalOpen(false);
  };

  const handlePinDigitPress = (digit: string) => {
    if (pinSuccess) return;
    setPinError('');

    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        // Validate strictly against the starting PIN created by user
        const targetPin = (merchantInfo.merchantPin || localStorage.getItem('qpay_merchant_pin') || '1234').trim();

        if (nextPin === targetPin) {
          setPinSuccess(true);
          updateMerchantInfo({
            settlementBank: selectedBank,
            settlementIban: selectedIban,
          });

          setTimeout(() => {
            setIsPinModalOpen(false);
            setEnteredPin('');
            setPinSuccess(false);
            setSuccessToast(true);
            setTimeout(() => {
              setSuccessToast(false);
              navigateTo('PROFILE');
            }, 1200);
          }, 600);
        } else {
          setPinError(
            isAr
              ? 'رمز PIN غير صحيح. يرجى إدخال الرمز السري الأساسي.'
              : 'Incorrect Security PIN. Please enter your setup PIN.'
          );
          setTimeout(() => {
            setEnteredPin('');
          }, 700);
        }
      }
    }
  };

  const handlePinDelete = () => {
    if (pinSuccess) return;
    setPinError('');
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  // Keyboard support for desktop web
  useEffect(() => {
    if (!isPinModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePinPopup();
      } else if (e.key >= '0' && e.key <= '9') {
        handlePinDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handlePinDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinModalOpen, enteredPin, pinSuccess]);

  const currentBank = SAUDI_SETTLEMENT_BANKS.find((b) => b.name === selectedBank);
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '4px 0 0 0', fontWeight: 500 }}>
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
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
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
                    backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.12)' : '#111726',
                    border: `1.5px solid ${isSelected ? '#7FE87F' : '#2C2C44'}`,
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
                        backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                        border: `1px solid ${isSelected ? 'rgba(127, 232, 127, 0.35)' : '#2C2C44'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isSelected ? '#7FE87F' : '#6E6E85',
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#FFFFFF' : '#A2A2BA' }}>
                        {isAr ? bank.arabicName : bank.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6E6E85', fontFamily: 'monospace', marginTop: '2px' }} dir="ltr">
                        {bank.iban}
                      </div>
                    </div>
                  </div>

                  {/* Radio dot */}
                  <div
                    style={{
                      width: '20px', height: '20px',
                      borderRadius: radii.full,
                      backgroundColor: isSelected ? '#7FE87F' : 'transparent',
                      border: `1.5px solid ${isSelected ? '#7FE87F' : '#2C2C44'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#080C14',
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
              background: 'radial-gradient(ellipse at top left, rgba(127, 232, 127, 0.14) 0%, #111726 70%)',
              border: '1px solid rgba(127, 232, 127, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  border: '1px solid rgba(127, 232, 127, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7FE87F',
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
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #2C2C44' }}>
                  <span style={{ fontSize: '12px', color: '#A2A2BA' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', fontFamily: mono ? 'monospace' : undefined }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Trust Note */}
          <Card variant="inset" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px', background: '#121212', border: '1px solid #2C2C44' }}>
            <ShieldCheck size={15} color="#7FE87F" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '11.5px', color: '#A2A2BA', margin: 0, fontWeight: 500 }}>
              {isAr ? 'جميع البنوك معتمدة وتدعم تسوية سريع الفورية' : 'All banks support instant Sarie settlements'}
            </p>
          </Card>

          {/* CTA Button -> Opens Dedicated Security PIN Popup */}
          <PrimaryButton onClick={handleOpenPinPopup}>
            {isAr ? 'متابعة وتأكيد البنك' : 'Continue & Verify PIN'}
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </PrimaryButton>
        </div>
      </div>

      {/* ── DEDICATED SECURITY PIN POPUP MODAL ────────────────── */}
      {isPinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={handleClosePinPopup}
        >
          <div
            className="scale-up"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#0D1424',
              borderRadius: '24px',
              border: '1px solid #2C2C44',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(127, 232, 127, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClosePinPopup}
              className="interactive-tap"
              style={{
                position: 'absolute',
                top: '16px',
                right: isRtl ? 'auto' : '16px',
                left: isRtl ? '16px' : 'auto',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#182236',
                border: '1px solid #2C2C44',
                color: '#A2A2BA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: pinSuccess ? 'rgba(127, 232, 127, 0.2)' : 'rgba(127, 232, 127, 0.14)',
                border: `1.5px solid ${pinSuccess ? '#7FE87F' : 'rgba(127, 232, 127, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7FE87F',
                marginBottom: '12px',
                marginTop: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              {pinSuccess ? <CheckCircle2 size={24} /> : <Lock size={22} />}
            </div>

            {/* Title & Description */}
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', marginBottom: '4px' }}>
              {pinSuccess
                ? (isAr ? 'تم التحقق بنجاح' : 'PIN Verified Successfully')
                : (isAr ? 'رمز التاجر السري' : 'Enter Security PIN')}
            </div>

            <div style={{ fontSize: '12px', color: '#A2A2BA', textAlign: 'center', marginBottom: '20px', lineHeight: 1.4 }}>
              {isAr
                ? `أدخل رمز PIN لتأكيد ربط ${currentBank ? currentBank.arabicName : selectedBank}`
                : `Enter your starting 4-digit PIN to link ${selectedBank}`}
            </div>

            {/* 4-Digit Indicator Dots */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: isFilled ? (pinSuccess ? '#7FE87F' : '#7FE87F') : '#182236',
                      border: isFilled ? '2px solid #7FE87F' : '1.5px solid #2C2C44',
                      boxShadow: isFilled ? '0 0 10px rgba(127, 232, 127, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {pinError && (
              <div
                className="shake-anim"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#EF4444',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                <ShieldAlert size={14} />
                <span>{pinError}</span>
              </div>
            )}

            {/* Keypad Grid (3x4) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
                marginTop: '6px',
              }}
            >
              {digits.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigitPress(num)}
                  disabled={pinSuccess}
                  className="interactive-tap"
                  style={{
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: '#111726',
                    border: '1px solid #2C2C44',
                    color: '#FFFFFF',
                    fontSize: '19px',
                    fontWeight: 800,
                    cursor: pinSuccess ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {isAr ? toArabicNumerals(num) : num}
                </button>
              ))}

              {/* Clear */}
              <button
                type="button"
                onClick={() => setEnteredPin('')}
                disabled={pinSuccess}
                className="interactive-tap"
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  color: '#A2A2BA',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: pinSuccess ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>

              {/* 0 */}
              <button
                type="button"
                onClick={() => handlePinDigitPress('0')}
                disabled={pinSuccess}
                className="interactive-tap"
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '19px',
                  fontWeight: 800,
                  cursor: pinSuccess ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isAr ? toArabicNumerals('0') : '0'}
              </button>

              {/* Backspace / Delete */}
              <button
                type="button"
                onClick={handlePinDelete}
                disabled={pinSuccess}
                className="interactive-tap"
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  color: '#A2A2BA',
                  cursor: pinSuccess ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Delete size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#00C853',
            color: '#080C14',
            padding: '12px 24px',
            borderRadius: '30px',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 200, 83, 0.4)',
            zIndex: 9999,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{isAr ? 'تم تحديث حساب التسوية البنكي بنجاح' : 'Settlement Bank Account updated successfully'}</span>
        </div>
      )}
    </div>
  );
};
export default MerchantSettlementBankScreen;
