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
  Printer,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, formatLocalizedNumber, getLocalizedPaymentMethod } from '../utils/i18n';
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
          {isAr ? 'إيصال الدفع' : 'Payment Receipt'}
        </h1>
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '4px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'فاتورة إلكترونية معتمدة' : 'ZATCA compliant receipt'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: Success Hero + Amount ────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Success Hero */}
          <Card
            variant="elevated"
            style={{
              padding: '36px 28px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(ellipse at top, rgba(127, 232, 127, 0.14) 0%, #111726 70%)',
              border: '1px solid rgba(127, 232, 127, 0.35)',
              textAlign: 'center',
              gap: '14px',
            }}
          >
            {/* Check circle */}
            <div
              style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(127, 232, 127, 0.14)',
                border: '2px solid #7FE87F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px rgba(127, 232, 127, 0.3)',
              }}
            >
              <CheckCircle2 size={38} color="#7FE87F" />
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                {isAr ? 'تم الدفع بنجاح' : 'Payment Approved'}
              </h2>
              <div
                className="tabular-nums"
                style={{
                  fontSize: '40px', fontWeight: 900,
                  color: '#7FE87F',
                  letterSpacing: '-0.04em',
                  margin: '4px 0',
                }}
              >
                +{formatCurrency(collection.amount, language)}
              </div>
              <p style={{ fontSize: '12.5px', color: '#A2A2BA', margin: '4px 0 0 0' }}>
                {collection.paymentMethod === 'cash'
                  ? isAr
                    ? 'تم استلام الدفعة نقداً وتوثيق الفاتورة في السجل'
                    : 'Cash received & logged in sales ledger'
                  : isAr
                  ? `تسوية مباشرة إلى ${translateText(merchantInfo.settlementBank, language)}`
                  : `Direct settlement to ${merchantInfo.settlementBank}`}
              </p>
            </div>

            {/* Settlement info row */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(127, 232, 127, 0.08)',
                border: '1px solid rgba(127, 232, 127, 0.25)',
                borderRadius: radii.full,
                fontSize: '12px',
                color: '#FFFFFF',
              }}
            >
              <Building2 size={13} color="#7FE87F" />
              <span>
                {collection.paymentMethod === 'cash'
                  ? isAr
                    ? 'صندوق النقد المباشر'
                    : 'Cash Register Drawer'
                  : translateText(merchantInfo.settlementBank, language)}
              </span>
              <span style={{ color: '#7FE87F', fontWeight: 700, fontSize: '11px' }}>
                ✓ {collection.paymentMethod === 'cash' ? (isAr ? 'توثيق فوري' : 'Instant Log') : (isAr ? 'تسوية سريعة' : 'Sarie Settled')}
              </span>
            </div>
          </Card>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <PrimaryButton onClick={() => navigateTo('SOFTPOS_TERMINAL')}>
              <Plus size={18} />
              {isAr ? 'عملية بيع جديدة' : 'New Sale'}
            </PrimaryButton>

            <button
              onClick={() => navigateTo('MERCHANT_HOME')}
              className="interactive-tap"
              style={{
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '13px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Dashboard'}
              <ArrowRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* ─── RIGHT: ZATCA Digital Receipt ───────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          {/* Receipt Card */}
          <Card variant="elevated" style={{ padding: '20px', background: '#111726', border: '1px solid #2C2C44' }}>
            {/* Receipt Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid #2C2C44' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ZatcaLogo variant="icon" size={18} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'فاتورة زاتكا الإلكترونية' : 'ZATCA E-Invoice'}
                </span>
              </div>
              <StatusBadge status="success" size="sm" label={isAr ? 'مكتملة' : 'Settled'} />
            </div>

            {/* Breakdown Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
              {[
                { label: isAr ? 'المنشأة' : 'Merchant', value: translateText(merchantInfo.businessName, language) },
                { label: isAr ? 'الرقم الضريبي' : 'VAT ID', value: formatLocalizedNumber(merchantInfo.vatNumber, language), mono: true },
                { label: isAr ? 'المرجع' : 'Reference', value: collection.id, mono: true },
                { label: isAr ? 'طريقة الدفع' : 'Method', value: `${getLocalizedPaymentMethod(collection.paymentMethod, language)}${collection.cardLast4 ? ` • ${isAr ? formatLocalizedNumber(collection.cardLast4, language) : collection.cardLast4}` : ''}` },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #2C2C44' }}>
                  <span style={{ color: '#A2A2BA' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: mono ? 'monospace' : undefined, fontSize: '12px' }}>{value}</span>
                </div>
              ))}

              {/* VAT */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #2C2C44' }}>
                <span style={{ color: '#7FE87F', fontWeight: 700 }}>{isAr ? 'المبلغ قبل الضريبة' : 'Subtotal'}</span>
                <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{formatSaudiCurrency(collection.netAmount, language)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #2C2C44' }}>
                <span style={{ color: '#7FE87F', fontWeight: 700 }}>{isAr ? 'الضريبة (١٥٪)' : 'VAT (15%)'}</span>
                <span style={{ fontWeight: 800, color: '#7FE87F' }}>{formatSaudiCurrency(collection.vatAmount, language)}</span>
              </div>

              {/* Gross Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '13.5px' }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                <span style={{ fontWeight: 900, color: '#7FE87F', fontSize: '15px' }}>{formatSaudiCurrency(collection.amount, language)}</span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #2C2C44' }}>
              <button
                onClick={() => speakSoundBox(collection.amount)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#7FE87F',
                  borderRadius: '10px',
                  padding: '9px 8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  cursor: 'pointer',
                }}
              >
                <Volume2 size={13} />
                {isAr ? 'صوت' : 'Sound'}
              </button>

              <button
                onClick={() => window.print()}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '9px 8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  cursor: 'pointer',
                }}
              >
                <Printer size={13} color="#7FE87F" />
                {isAr ? 'طباعة' : 'Print'}
              </button>

              <button
                onClick={handleShareReceipt}
                className="interactive-tap"
                style={{
                  flex: 1,
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '9px 8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={13} color="#22C55E" /> : <Share2 size={13} color="#7FE87F" />}
                {copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}
              </button>
            </div>
          </Card>

          {/* Compliance Dock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ZatcaLogo variant="full" height={12} themeMode="dark" />
            <span style={{ fontSize: '10px', color: '#6E6E85' }}>•</span>
            <span style={{ fontSize: '10.5px', color: '#6E6E85', fontWeight: 600 }}>
              <Receipt size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {isAr ? 'معتمد من هيئة الزكاة والضريبة' : 'ZATCA Approved'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
