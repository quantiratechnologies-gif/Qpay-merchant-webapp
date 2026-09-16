import React, { useState, useEffect } from 'react';
import { Wifi, CheckCircle2, CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { formatLocalizedNumber } from '../utils/i18n';
import type { PaymentAcceptanceMethod } from '../types';
import { Card, StatusBadge } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const TapCardScreen: React.FC = () => {
  const {
    screenParams,
    softPosAmount,
    softPosCardScheme,
    processMerchantCollection,
    navigateTo,
    merchantInfo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const amount = screenParams.amount || softPosAmount || 67.0;
  const scheme = screenParams.cardScheme || softPosCardScheme || 'mada';

  const [step, setStep] = useState<'waiting' | 'reading' | 'authorizing' | 'success'>('waiting');

  useEffect(() => {
    const t1 = setTimeout(() => { setStep('reading'); }, 1200);
    const t2 = setTimeout(() => { setStep('authorizing'); }, 2000);
    const t3 = setTimeout(async () => {
      setStep('success');
      let paymentMethod: PaymentAcceptanceMethod = 'softpos_mada';
      if (scheme === 'applepay') paymentMethod = 'softpos_applepay';
      else if (scheme === 'visa') paymentMethod = 'softpos_visa';
      else if (scheme === 'mastercard') paymentMethod = 'softpos_mastercard';

      await processMerchantCollection({
        amount,
        paymentMethod,
        cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
        orderRef: 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString(),
        customerMasked: '+966 5' + Math.floor(10 + Math.random() * 90) + ' ••• ' + Math.floor(1000 + Math.random() * 9000),
      });

      setTimeout(() => { navigateTo('MERCHANT_PAYMENT_SUCCESS'); }, 800);
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [amount, scheme]);

  const stepLabels = {
    waiting: { title: isAr ? 'مرر البطاقة أو الجوال خلف الجهاز' : 'Hold Card or Phone to Back of Device', sub: isAr ? 'يدعم البطاقات البنكية وأبل باي وفيزا وماستركارد اللاتلامسية' : 'Accepts Contactless Debit Cards, Apple Pay, Visa, and Mastercard', badge: 'info' as const, badgeLabel: isAr ? 'انتظار البطاقة' : 'Awaiting Card' },
    reading: { title: isAr ? 'جاري قراءة الشريحة اللاتلامسية...' : 'Reading Contactless Chip...', sub: isAr ? 'يرجى إبقاء البطاقة ثابتة حتى انتهاء التفويض' : 'Please keep the card still until authorization finishes', badge: 'warning' as const, badgeLabel: isAr ? 'جاري القراءة' : 'Reading' },
    authorizing: { title: isAr ? 'جاري التفويض مع الشبكة البنكية...' : 'Authorizing with Banking Network...', sub: isAr ? 'يرجى إبقاء البطاقة ثابتة حتى انتهاء التفويض' : 'Please keep the card still until authorization finishes', badge: 'warning' as const, badgeLabel: isAr ? 'جاري التفويض' : 'Authorizing' },
    success: { title: isAr ? 'تمت العملية بنجاح!' : 'Payment Approved!', sub: isAr ? 'تمت التسوية الفورية إلى حسابك البنكي عبر سريع' : 'Instantly settled to your bank account via Sarie', badge: 'success' as const, badgeLabel: isAr ? 'مقبولة' : 'Approved' },
  };

  const current = stepLabels[step];

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
      <style>{`
        @keyframes nfcPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
          {isAr ? `جهاز رقم #${formatLocalizedNumber(merchantInfo.terminalId, language)}` : `Terminal #${merchantInfo.terminalId}`}
        </h1>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'نقطة بيع SoftPOS • اللاتلامسية NFC' : 'SoftPOS Terminal • NFC Contactless'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: NFC Animation Zone ───────────────────── */}
        <Card
          variant="elevated"
          style={{
            padding: '48px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '24px',
            background: 'radial-gradient(ellipse at center, rgba(0, 200, 83, 0.07) 0%, #111726 70%)',
            minHeight: '400px',
          }}
        >
          {/* Pulsating NFC Circles */}
          <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {step !== 'success' && (
              <>
                <div
                  style={{
                    position: 'absolute', width: '220px', height: '220px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 200, 83, 0.2)',
                    animation: 'nfcPulse 2.4s infinite ease-out',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', width: '165px', height: '165px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 200, 83, 0.4)',
                    animation: 'nfcPulse 2.4s infinite ease-out 0.6s',
                  }}
                />
              </>
            )}

            {/* Central NFC Icon */}
            <div
              style={{
                width: '100px', height: '100px',
                borderRadius: '30px',
                backgroundColor: '#111726',
                border: `2px solid ${step === 'success' ? colors.accentGreen : 'rgba(0, 200, 83, 0.6)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: colors.accentGreen,
                zIndex: 2,
                boxShadow: `0 0 ${step === 'success' ? '48px' : '24px'} rgba(0, 200, 83, 0.3)`,
                transition: 'all 0.4s ease',
              }}
            >
              {step === 'success' ? (
                <CheckCircle2 size={52} color={colors.accentGreen} />
              ) : (
                <Wifi size={52} style={{ transform: 'rotate(90deg)' }} />
              )}
            </div>
          </div>

          {/* Step Status */}
          <div style={{ textAlign: 'center' }}>
            <StatusBadge status={current.badge} size="sm" label={current.badgeLabel} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: colors.textPrimary, marginTop: '12px' }}>
              {current.title}
            </div>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '8px 0 0 0', maxWidth: '320px', lineHeight: 1.5 }}>
              {current.sub}
            </p>
          </div>
        </Card>

        {/* ─── RIGHT: Terminal Summary ─────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Amount Card */}
          <Card
            variant="elevated"
            style={{
              padding: '24px',
              background: step === 'success'
                ? 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.12) 0%, #111726 70%)'
                : undefined,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              {isAr ? 'مبلغ العملية' : 'CHARGE AMOUNT'}
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: '42px', fontWeight: 900,
                color: step === 'success' ? colors.accentGreen : colors.textPrimary,
                letterSpacing: '-0.04em',
                transition: 'color 0.4s ease',
              }}
            >
              {formatCurrency(amount, language)}
            </div>
            {step === 'success' && (
              <div style={{ marginTop: '8px', fontSize: '12.5px', color: colors.textSecondary }}>
                {isAr ? 'تمت التسوية إلى حسابك البنكي' : 'Settled to your bank account'}
              </div>
            )}
          </Card>

          {/* Terminal Info */}
          <Card variant="elevated" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
              {isAr ? 'معلومات الجهاز' : 'TERMINAL INFO'}
            </div>

            {[
              { icon: <CreditCard size={13} />, label: isAr ? 'الطريقة' : 'Method', value: scheme.toUpperCase() },
              { icon: <Wifi size={13} />, label: isAr ? 'البروتوكول' : 'Protocol', value: 'NFC ISO 14443' },
              { icon: <ShieldCheck size={13} />, label: isAr ? 'التشفير' : 'Security', value: 'EMV + 3DS' },
              { icon: <Smartphone size={13} />, label: isAr ? 'الجهاز' : 'Terminal', value: `#${merchantInfo.terminalId}` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: colors.textSecondary, fontSize: '12.5px' }}>
                  {icon}
                  {label}
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary, fontFamily: 'monospace' }}>{value}</span>
              </div>
            ))}
          </Card>

          {/* Accepted Cards */}
          <Card variant="inset" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: colors.textMuted, marginBottom: '10px' }}>
              {isAr ? 'طرق الدفع المقبولة' : 'ACCEPTED METHODS'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { label: '💳 Debit Card', color: colors.accentGreen },
                { label: ' Apple Pay', color: colors.textPrimary },
                { label: 'VISA', color: '#5CA3FF' },
                { label: 'Mastercard', color: '#FF7B54' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  style={{
                    fontSize: '11.5px', fontWeight: 800,
                    color, padding: '4px 10px',
                    backgroundColor: `${color}18`,
                    border: `1px solid ${color}33`,
                    borderRadius: radii.full,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
