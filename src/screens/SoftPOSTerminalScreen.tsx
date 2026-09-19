import React, { useState } from 'react';
import { Delete, Wifi } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { colors, radii } from '../design-system/tokens';
import { formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';

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
          backgroundColor: '#D4AF37',
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
          color: '#F1D77A',
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
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          {isAr ? 'نقطة البيع (SoftPOS)' : 'SoftPOS Terminal'}
        </h1>
        <p style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '3px', margin: 0 }}>
          {isAr ? 'قبول مدى، أبل باي والبطاقات' : 'Accept mada, Apple Pay & cards'}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Keypad & Charge Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Amount Display Inset */}
          <Card
            variant="elevated"
            style={{
              padding: '20px',
              textAlign: 'center',
              background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12) 0%, #171717 70%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAr ? 'المبلغ' : 'AMOUNT'}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '6px 0 10px 0' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#D4AF37' }}>
                {isAr ? 'ر.س' : 'SAR'}
              </span>
              <span style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {formatLocalizedNumber(numericValue.toFixed(2), language)}
              </span>
            </div>

            {/* Quick Add Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[10, 50, 100, 500].map((sar) => (
                <button
                  key={sar}
                  type="button"
                  onClick={() => handleQuickAdd(sar)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#212121',
                    border: '1px solid #262626',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  +{formatLocalizedNumber(sar, language)}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="interactive-tap"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            </div>
          </Card>

          {/* Virtual Numeric Keypad */}
          <Card variant="elevated" style={{ padding: '16px', background: '#171717', border: '1px solid #262626' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {digits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="interactive-tap"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: '#1E1E1E',
                    border: '1px solid #262626',
                    color: '#FFFFFF',
                    fontSize: '20px',
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
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #262626',
                  color: '#FFFFFF',
                  fontSize: '16px',
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
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #262626',
                  color: '#FFFFFF',
                  fontSize: '20px',
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
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #262626',
                  color: '#A3A3A3',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Delete size={18} />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Card Scheme, VAT Breakdown & Checkout Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card Scheme & Method Selector */}
          <Card variant="elevated" style={{ padding: '16px', background: '#171717', border: '1px solid #262626' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              {isAr ? 'طريقة الدفع' : 'Payment Method'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
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
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.12)' : '#1E1E1E',
                      border: isSelected ? '1.5px solid #D4AF37' : '1px solid #262626',
                      color: isSelected ? '#D4AF37' : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '12.5px',
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
          <Card variant="elevated" style={{ padding: '16px', background: '#171717', border: '1px solid #262626' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              {isAr ? 'ملخص الفاتورة' : 'Invoice Summary'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>{isAr ? 'المبلغ الصافي' : 'Subtotal'}</span>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(subtotal) || 0, language)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>{isAr ? 'الضريبة (١٥٪)' : 'VAT (15%)'}</span>
                <span style={{ color: '#D4AF37', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(vatAmount) || 0, language)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #262626',
                  paddingTop: '8px',
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                }}
              >
                <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                <span style={{ color: '#D4AF37' }}>{formatSaudiCurrency(numericValue, language)}</span>
              </div>
            </div>

            {/* Optional Customer Note / Invoice Reference Input */}
            <div style={{ marginTop: '12px' }}>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder={isAr ? 'رقم الطلب أو ملاحظة (اختياري)' : 'Order ref / note (optional)'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '12px',
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
            className={`interactive-tap ${numericValue > 0 ? 'gold-gradient-btn' : ''}`}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: numericValue > 0 ? undefined : '#262626',
              color: numericValue > 0 ? '#0B0B0B' : '#737373',
              fontSize: '14px',
              fontWeight: 900,
              border: 'none',
              cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: numericValue > 0 ? '0 4px 16px rgba(212, 175, 55, 0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Wifi size={17} />
            <span>
              {isAr
                ? `تحصيل ${formatSaudiCurrency(numericValue, language)}`
                : `Charge ${formatSaudiCurrency(numericValue, language)}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
