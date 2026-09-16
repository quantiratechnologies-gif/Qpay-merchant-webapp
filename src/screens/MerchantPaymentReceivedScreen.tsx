import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Plus,
  Volume2,
  Check,
  Building2,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { PrimaryButton } from '../components/PrimaryButton';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { Card, StatusBadge } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const MerchantPaymentReceivedScreen: React.FC = () => {
  const {
    lastMerchantCollection,
    merchantInfo,
    navigateTo,
    speakSoundBox,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [copied, setCopied] = useState(false);

  const collection = lastMerchantCollection || {
    id: 'POS-8839201',
    orderRef: 'ORD-9841',
    amount: 67.0,
    vatAmount: 8.74,
    netAmount: 58.26,
    paymentMethod: 'softpos_mada',
    cardLast4: '4821',
    customerMasked: '+966 50 ••• 1234',
    date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date(),
    status: 'settled' as const,
  };

  const handleShareReceipt = () => {
    const text = isAr
      ? `*إيصال فاتورة زاتكا الإلكترونية*\nالمتجر: ${merchantInfo.businessName}\nالسجل التجاري: ${merchantInfo.crNumber}\nالرقم الضريبي: ${merchantInfo.vatNumber}\nالمرجع: ${collection.id}\nالمبلغ: ${collection.amount.toFixed(2)} ر.س (شامل الضريبة: ${collection.vatAmount.toFixed(2)} ر.س)\nتمت التسوية المباشرة عبر شبكة سريع المدعومة بتقنيات كوانتيرا.`
      : `*ZATCA E-INVOICE RECEIPT*\nStore: ${merchantInfo.businessName}\nCR: ${merchantInfo.crNumber}\nVAT ID: ${merchantInfo.vatNumber}\nRef: ${collection.id}\nAmount: SAR ${collection.amount.toFixed(2)} (Incl. 15% VAT: SAR ${collection.vatAmount.toFixed(2)})\nSettled via Sarie Network • Powered by Quantira Technologies.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
          {isAr ? 'إيصال التحصيل والفوترة' : 'Payment Receipt & E-Invoice'}
        </h1>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'فاتورة زاتكا إلكترونية مع سجل التسوية الفورية' : 'ZATCA Phase 2 e-invoice with instant settlement record'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Success Hero + Amount ────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Success Hero */}
          <Card
            variant="elevated"
            style={{
              padding: '40px 32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.12) 0%, #111726 70%)',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            {/* Check circle */}
            <div
              style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '2px solid #00C853',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={42} color="#00C853" />
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', color: colors.textPrimary }}>
                {t('merchant.payment_approved', 'Payment Approved')}
              </h2>
              <div
                className="tabular-nums"
                style={{
                  fontSize: '44px', fontWeight: 900,
                  color: colors.accentGreen,
                  letterSpacing: '-0.04em',
                  margin: '4px 0',
                }}
              >
                +{formatCurrency(collection.amount, language)}
              </div>
              <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '6px 0 0 0' }}>
                {isAr
                  ? `تسوية مباشرة إلى ${translateText(merchantInfo.settlementBank, language)}`
                  : `Direct settlement to ${merchantInfo.settlementBank}`}
              </p>
            </div>

            {/* Settlement info row */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(0, 200, 83, 0.08)',
                border: '1px solid rgba(0, 200, 83, 0.2)',
                borderRadius: radii.full,
                fontSize: '12px',
                color: colors.textSecondary,
              }}
            >
              <Building2 size={13} color={colors.accentGreen} />
              <span>{merchantInfo.settlementBank}</span>
              <span style={{ color: colors.accentGreen, fontWeight: 700, fontSize: '11px' }}>
                ✓ {isAr ? 'تمت التسوية' : 'Settled via Sarie'}
              </span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <PrimaryButton onClick={() => navigateTo('SOFTPOS_TERMINAL')}>
              <Plus size={18} />
              {t('merchant.new_sale', 'New Sale (SoftPOS)')}
            </PrimaryButton>

            <button
              onClick={() => navigateTo('MERCHANT_HOME')}
              className="interactive-tap"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '14px',
                padding: '14px',
                color: colors.textPrimary,
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {t('merchant.back_dashboard', 'Back to Merchant Dashboard')}
              <ArrowRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* ─── RIGHT: ZATCA Digital Receipt ───────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          {/* Receipt Card */}
          <Card variant="elevated" style={{ padding: '22px' }}>
            {/* Receipt Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ZatcaLogo variant="icon" size={20} />
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: colors.textPrimary }}>
                  {t('zatca.title', 'ZATCA Phase 2 E-Invoice')}
                </span>
              </div>
              <StatusBadge status="success" size="sm" label={isAr ? 'مكتملة' : 'Settled'} />
            </div>

            {/* Breakdown Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {[
                { label: isAr ? 'المنشأة' : 'Merchant', value: translateText(merchantInfo.businessName, language) },
                { label: t('zatca.vat_id', 'VAT ID'), value: formatLocalizedNumber(merchantInfo.vatNumber, language), mono: true },
                { label: isAr ? 'رقم العملية المرجعي' : 'Transaction Ref', value: collection.id, mono: true },
                { label: isAr ? 'طريقة الدفع' : 'Method', value: `${collection.paymentMethod.replace('_', ' ').toUpperCase()}${collection.cardLast4 ? ` • ${isAr ? formatLocalizedNumber(collection.cardLast4, language) : collection.cardLast4}` : ''}` },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ color: '#A2A2BA' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: colors.textPrimary, fontFamily: mono ? 'monospace' : undefined, fontSize: '12.5px' }}>{value}</span>
                </div>
              ))}

              {/* VAT */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ color: colors.accentGreen, fontWeight: 700 }}>{t('zatca.net_total', 'Net Amount (Excl. VAT)')}</span>
                <span style={{ fontWeight: 700, color: colors.textPrimary }}>{formatSaudiCurrency(collection.netAmount, language)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ color: colors.accentGreen, fontWeight: 700 }}>{t('zatca.vat_amount', '15% ZATCA VAT')}</span>
                <span style={{ fontWeight: 800, color: colors.accentGreen }}>{formatSaudiCurrency(collection.vatAmount, language)}</span>
              </div>

              {/* Gross Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontWeight: 900, color: colors.textPrimary, fontSize: '14px' }}>{t('zatca.gross_total', 'Gross Total')}</span>
                <span style={{ fontWeight: 900, color: colors.textPrimary, fontSize: '16px' }}>{formatSaudiCurrency(collection.amount, language)}</span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
              <button
                onClick={() => speakSoundBox(collection.amount)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: colors.bgInset,
                  border: `1px solid ${colors.border}`,
                  color: colors.accentGreen,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Volume2 size={15} />
                {isAr ? 'تشغيل صندوق الصوت' : 'Play SoundBox'}
              </button>

              <button
                onClick={handleShareReceipt}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: colors.bgInset,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={15} color={colors.accentGreen} /> : <Share2 size={15} color={colors.accentGreen} />}
                {copied ? (isAr ? 'تم نسخ الإيصال' : 'Copied!') : (isAr ? 'مشاركة الإيصال' : 'Copy Receipt')}
              </button>
            </div>
          </Card>

          {/* Compliance Dock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ZatcaLogo variant="full" height={13} themeMode="dark" />
            <span style={{ fontSize: '10px', color: '#6E6E85' }}>•</span>
            <span style={{ fontSize: '10.5px', color: '#6E6E85', fontWeight: 600 }}>
              <Receipt size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Quantira Technologies Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
