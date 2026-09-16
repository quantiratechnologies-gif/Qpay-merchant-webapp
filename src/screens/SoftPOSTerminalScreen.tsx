import React, { useState } from 'react';
import { Delete, Wifi } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

interface PaymentRail {
  id: string;
  name: string;
  renderIcon: () => React.ReactNode;
}

const PAYMENT_RAILS: PaymentRail[] = [
  {
    id: 'mada',
    name: 'mada',
    renderIcon: () => (
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: radii.full,
          backgroundColor: colors.accentGreen,
        }}
      />
    ),
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    renderIcon: () => <span style={{ fontSize: '13px', lineHeight: 1 }}></span>,
  },
  {
    id: 'visa',
    name: 'VISA',
    renderIcon: () => (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 900,
          fontStyle: 'italic',
          color: colors.accentBlue,
          letterSpacing: '0.05em',
        }}
      >
        VISA
      </span>
    ),
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    renderIcon: () => (
      <div style={{ display: 'flex', alignItems: 'center', width: '16px', height: '11px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '11px',
            height: '11px',
            borderRadius: radii.full,
            backgroundColor: '#EB001B',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            width: '11px',
            height: '11px',
            borderRadius: radii.full,
            backgroundColor: '#F79E1B',
            opacity: 0.9,
          }}
        />
      </div>
    ),
  },
];

export const SoftPOSTerminalScreen: React.FC = () => {
  const {
    softPosAmount,
    setSoftPosAmount,
    softPosCardScheme,
    setSoftPosCardScheme,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  const [rawAmountStr, setRawAmountStr] = useState<string>(
    softPosAmount > 0 ? (softPosAmount * 100).toString() : '6700'
  );
  const [customerNote, setCustomerNote] = useState<string>('');

  const numericValue = (parseInt(rawAmountStr || '0', 10) / 100) || 0;
  const vatAmount = numericValue > 0 ? (numericValue - numericValue / 1.15).toFixed(2) : '0.00';
  const subtotal = (numericValue - parseFloat(vatAmount)).toFixed(2);

  const handleKeyPress = (digit: string) => {
    if (rawAmountStr.length < 8) {
      if (rawAmountStr === '0') setRawAmountStr(digit);
      else setRawAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setRawAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleQuickAdd = (addSar: number) => {
    const current = (parseInt(rawAmountStr || '0', 10) / 100) || 0;
    const updated = current + addSar;
    setRawAmountStr(Math.round(updated * 100).toString());
  };

  const handleClear = () => {
    setRawAmountStr('0');
  };

  const handleCharge = () => {
    if (numericValue > 0) {
      setSoftPosAmount(numericValue);
      navigateTo('SOFTPOS_TAP', {
        amount: numericValue,
        cardScheme: softPosCardScheme,
        note: customerNote,
      });
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          {isAr ? 'نقطة البيع الافتراضية (SoftPOS Terminal)' : 'SoftPOS Virtual Terminal'}
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
          {isAr
            ? 'قبول مدفوعات مدى وأبل باي والبطاقات الائتمانية مع إصدار فواتير ضريبية فورية'
            : 'Accept mada, Apple Pay, & EMV contactless card payments with instant ZATCA tax receipt'}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Keypad & Charge Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Amount Display Inset */}
          <Card
            variant="elevated"
            style={{
              padding: '24px',
              textAlign: 'center',
              background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.12) 0%, #0E131F 70%)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#00C853', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAr ? 'المبلغ المطلوب تحصيله' : 'TOTAL CHARGE AMOUNT'}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '8px 0 12px 0' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#00C853' }}>SAR</span>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {numericValue.toFixed(2)}
              </span>
            </div>

            {/* Quick Add Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {[10, 50, 100, 500].map((sar) => (
                <button
                  key={sar}
                  type="button"
                  onClick={() => handleQuickAdd(sar)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#151C2C',
                    border: '1px solid #1E293B',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  +{sar}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="interactive-tap"
                style={{
                  backgroundColor: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.3)',
                  color: '#FF4757',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            </div>
          </Card>

          {/* Virtual Numeric Keypad */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }}
            >
              {digits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="interactive-tap"
                  style={{
                    height: '54px',
                    borderRadius: '12px',
                    backgroundColor: '#111726',
                    border: '1px solid #1E293B',
                    color: '#FFFFFF',
                    fontSize: '22px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {digit}
                </button>
              ))}

              <button
                onClick={() => handleKeyPress('00')}
                className="interactive-tap"
                style={{
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                00
              </button>

              <button
                onClick={() => handleKeyPress('0')}
                className="interactive-tap"
                style={{
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                0
              </button>

              <button
                onClick={handleDelete}
                className="interactive-tap"
                style={{
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  color: '#94A3B8',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Delete size={20} />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Card Scheme, VAT Breakdown & Checkout Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card Scheme & Method Selector */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              {isAr ? 'شبكة وطريقة الدفع' : 'Payment Rail Scheme'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {PAYMENT_RAILS.map((rail) => {
                const isSelected = softPosCardScheme === rail.id;
                return (
                  <button
                    key={rail.id}
                    onClick={() => setSoftPosCardScheme(rail.id)}
                    className="interactive-tap"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.12)' : '#111726',
                      border: isSelected ? '1.5px solid #00C853' : '1px solid #1E293B',
                      color: isSelected ? '#00C853' : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '13px',
                    }}
                  >
                    {rail.renderIcon()}
                    <span>{rail.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* ZATCA VAT Breakdown & Receipt Info */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              {isAr ? 'تفاصيل الفاتورة الضريبية (زاتكا)' : 'ZATCA Tax Invoice Summary'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>{isAr ? 'المبلغ الصافي الخاضع للضريبة' : 'Taxable Subtotal'}</span>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>SAR {subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>{isAr ? 'ضريبة القيمة المضافة (١٥٪)' : 'VAT (15%)'}</span>
                <span style={{ color: '#00C853', fontWeight: 700 }}>SAR {vatAmount}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #1E293B',
                  paddingTop: '10px',
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                }}
              >
                <span>{isAr ? 'المجموع النهائي' : 'Gross Total'}</span>
                <span style={{ color: '#00C853' }}>SAR {numericValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Optional Customer Note / Invoice Reference Input */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                {isAr ? 'رقم الفاتورة أو ملاحظة (اختياري)' : 'Invoice / Order Reference (Optional)'}
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder={isAr ? 'مثال: طاولة رقم ٤ أو طلب #١٠٩' : 'e.g., Order #1092 or Table 4'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </Card>

          {/* Primary Charge CTA */}
          <button
            onClick={handleCharge}
            disabled={numericValue <= 0}
            className="interactive-tap"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: numericValue > 0 ? '#00C853' : '#1E293B',
              color: numericValue > 0 ? '#080C14' : '#64748B',
              fontSize: '15px',
              fontWeight: 900,
              border: 'none',
              cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: numericValue > 0 ? '0 4px 20px rgba(0, 200, 83, 0.4)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Wifi size={18} />
            <span>
              {isAr
                ? `تحصيل ${numericValue.toFixed(2)} ر.س عبر اللمس بالجوال`
                : `Charge SAR ${numericValue.toFixed(2)} via SoftPOS Tap`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
