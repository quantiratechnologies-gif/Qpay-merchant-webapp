import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Delete,
  Wifi,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Store,
  Receipt,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { colors, radii } from '../design-system/tokens';
import { formatSaudiCurrency, formatLocalizedNumber, translateText } from '../utils/i18n';

type CheckoutMode = 'card' | 'cash' | 'online';

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
          width: '9px',
          height: '9px',
          borderRadius: radii.full,
          backgroundColor: '#7FE87F',
          boxShadow: '0 0 8px rgba(127, 232, 127, 0.6)',
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
          color: '#98F598',
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
    processMerchantCollection,
    navigateTo,
    merchantInfo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  // Checkout Mode: 'card' | 'cash' | 'online'
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('card');

  // Amount Builder State
  const [rawAmountStr, setRawAmountStr] = useState<string>(
    softPosAmount > 0 ? (softPosAmount * 100).toString() : '0'
  );
  const [customerNote, setCustomerNote] = useState<string>('');

  // Cashier Cash-Specific State
  const [cashTenderedStr, setCashTenderedStr] = useState<string>('');
  const [isProcessingCash, setIsProcessingCash] = useState<boolean>(false);

  // Online Pay QR-Specific State
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSimulatingQr, setIsSimulatingQr] = useState<boolean>(false);

  // Charge Error State
  const [chargeError, setChargeError] = useState<string | null>(null);

  // Calculations
  const numericValue = parseInt(rawAmountStr || '0', 10) / 100 || 0;
  const vatAmount = numericValue > 0 ? (numericValue - numericValue / 1.15).toFixed(2) : '0.00';
  const subtotal = (numericValue - parseFloat(vatAmount)).toFixed(2);

  // Cash Change calculations
  const cashTenderedVal = parseFloat(cashTenderedStr) || 0;
  const effectiveCashTendered = cashTenderedVal > 0 ? cashTenderedVal : numericValue;
  const changeDue = Math.max(0, effectiveCashTendered - numericValue);
  const remainingDue = Math.max(0, numericValue - effectiveCashTendered);

  // Keypad Handlers
  const handleKeyPress = (digit: string) => {
    if (chargeError) setChargeError(null);
    if (rawAmountStr.length < 8) {
      if (rawAmountStr === '0') setRawAmountStr(digit);
      else setRawAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    if (chargeError) setChargeError(null);
    setRawAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleQuickAdd = (addSar: number) => {
    if (chargeError) setChargeError(null);
    const current = parseInt(rawAmountStr || '0', 10) / 100 || 0;
    const updated = current + addSar;
    setRawAmountStr(Math.round(updated * 100).toString());
  };

  const handleClear = () => {
    if (chargeError) setChargeError(null);
    setRawAmountStr('0');
  };

  // 1. Card Checkout Action
  const handleCardCharge = () => {
    if (numericValue <= 0) return;
    if (chargeError) setChargeError(null);
    setSoftPosAmount(numericValue);
    navigateTo('SOFTPOS_TAP', {
      amount: numericValue,
      cardScheme: softPosCardScheme,
      note: customerNote,
    });
  };

  // 2. Cash Checkout Action -> Directly Issues Receipt
  const handleCashCharge = async () => {
    if (numericValue <= 0) return;
    setChargeError(null);
    setIsProcessingCash(true);
    try {
      await processMerchantCollection({
        amount: numericValue,
        paymentMethod: 'cash',
        orderRef: customerNote || 'CASH-ORD-' + Math.floor(1000 + Math.random() * 9000).toString(),
        customerMasked: isAr ? 'دفع نقدي مباشر • كاشير ١' : 'Cash Register #1',
      });
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    } catch (err) {
      console.warn('Collection processing:', err);
      setChargeError(
        isAr ? 'فشلت عملية التحصيل النقدي. يرجى المحاولة مرة أخرى.' : 'Cash collection failed. Please try again.'
      );
    } finally {
      setIsProcessingCash(false);
    }
  };

  // 3. Online QR Checkout Action
  const payQrUrl = `https://qtpay.sa/pay/pos_${merchantInfo.terminalId || '8839201'}?amt=${numericValue.toFixed(2)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(payQrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleOnlineCharge = async () => {
    if (numericValue <= 0) return;
    setChargeError(null);
    try {
      await processMerchantCollection({
        amount: numericValue,
        paymentMethod: 'zatca_qr',
        orderRef: customerNote || 'QR-POS-' + Math.floor(1000 + Math.random() * 9000).toString(),
        customerMasked: isAr ? 'دفع إلكتروني فوري' : 'Online Pay QR Customer',
      });
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    } catch (err) {
      console.warn('Collection processing:', err);
      setChargeError(
        isAr ? 'فشلت عملية الدفع الإلكتروني. يرجى المحاولة مرة أخرى.' : 'Online payment processing failed. Please try again.'
      );
    }
  };

  const handleSimulateQrPayment = () => {
    if (numericValue <= 0) return;
    setChargeError(null);
    setIsSimulatingQr(true);
    setTimeout(async () => {
      setIsSimulatingQr(false);
      await handleOnlineCharge();
    }, 1000);
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Cash quick notes suggestions
  const cashNotes = [
    Math.ceil(numericValue),
    Math.ceil(numericValue / 10) * 10,
    50,
    100,
    200,
    500,
  ].filter((amt, idx, arr) => amt >= numericValue && arr.indexOf(amt) === idx && amt > 0);

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
          {translateText('softpos.title', language)}
        </h1>
        <p style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '3px', margin: 0 }}>
          {translateText('softpos.subtitle', language)}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop POS Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
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
              background: 'radial-gradient(ellipse at top, rgba(127, 232, 127, 0.14) 0%, #111726 70%)',
              border: '1px solid rgba(127, 232, 127, 0.25)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7FE87F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {translateText('softpos.total_charge', language)}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '6px 0 10px 0' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#7FE87F' }}>
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
                    backgroundColor: '#182236',
                    border: '1px solid #2C2C44',
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
          <Card variant="elevated" style={{ padding: '16px', background: '#111726', border: '1px solid #2C2C44' }}>
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
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="interactive-tap"
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    backgroundColor: '#151524',
                    border: '1px solid #2C2C44',
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
                type="button"
                onClick={() => handleKeyPress('00')}
                className="interactive-tap"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#151524',
                  border: '1px solid #2C2C44',
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
                type="button"
                onClick={() => handleKeyPress('0')}
                className="interactive-tap"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#151524',
                  border: '1px solid #2C2C44',
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
                type="button"
                onClick={handleDelete}
                className="interactive-tap"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#151524',
                  border: '1px solid #2C2C44',
                  color: '#A2A2BA',
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

        {/* Right Column: Supermarket Checkout Modes (Card, Cash, Online QR) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* ── 3 Supermarket Mode Tabs ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              backgroundColor: '#111726',
              padding: '6px',
              borderRadius: '14px',
              border: '1px solid #2C2C44',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCheckoutMode('card');
                if (chargeError) setChargeError(null);
              }}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 8px',
                borderRadius: '10px',
                border: checkoutMode === 'card' ? '1.5px solid #7FE87F' : '1px solid transparent',
                backgroundColor: checkoutMode === 'card' ? 'rgba(127, 232, 127, 0.14)' : 'transparent',
                color: checkoutMode === 'card' ? '#7FE87F' : '#A2A2BA',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <CreditCard size={15} />
              <span>{translateText('softpos.tab_card', language)}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCheckoutMode('cash');
                if (chargeError) setChargeError(null);
                if (!cashTenderedStr) setCashTenderedStr(numericValue > 0 ? numericValue.toString() : '');
              }}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 8px',
                borderRadius: '10px',
                border: checkoutMode === 'cash' ? '1.5px solid #7FE87F' : '1px solid transparent',
                backgroundColor: checkoutMode === 'cash' ? 'rgba(127, 232, 127, 0.14)' : 'transparent',
                color: checkoutMode === 'cash' ? '#7FE87F' : '#A2A2BA',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Banknote size={15} />
              <span>{translateText('softpos.tab_cash', language)}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCheckoutMode('online');
                if (chargeError) setChargeError(null);
              }}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 8px',
                borderRadius: '10px',
                border: checkoutMode === 'online' ? '1.5px solid #7FE87F' : '1px solid transparent',
                backgroundColor: checkoutMode === 'online' ? 'rgba(127, 232, 127, 0.14)' : 'transparent',
                color: checkoutMode === 'online' ? '#7FE87F' : '#A2A2BA',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <QrCode size={15} />
              <span>{translateText('softpos.tab_online', language)}</span>
            </button>
          </div>

          {/* ── Mode 1: CARD PAY (SoftPOS Tap & Networks) ── */}
          {checkoutMode === 'card' && (
            <>
              <Card variant="elevated" style={{ padding: '16px', background: '#111726', border: '1px solid #2C2C44' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    {translateText('softpos.rail_scheme', language)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} />
                    {isAr ? 'مدى و EMV L2' : 'mada & EMV L2'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {PAYMENT_RAILS.map((rail) => {
                    const isSelected = softPosCardScheme === rail.id;
                    return (
                      <button
                        key={rail.id}
                        type="button"
                        onClick={() => setSoftPosCardScheme(rail.id)}
                        className="interactive-tap"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                          border: isSelected ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                          color: isSelected ? '#7FE87F' : '#FFFFFF',
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

              {/* Invoice Summary */}
              <Card variant="elevated" style={{ padding: '16px', background: '#111726', border: '1px solid #2C2C44' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                  {translateText('softpos.tax_summary', language)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA' }}>
                    <span>{translateText('softpos.taxable_subtotal', language)}</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(subtotal) || 0, language)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA' }}>
                    <span>{translateText('softpos.vat_15', language)}</span>
                    <span style={{ color: '#7FE87F', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(vatAmount) || 0, language)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #2C2C44',
                      paddingTop: '8px',
                      fontSize: '14px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                    }}
                  >
                    <span>{translateText('softpos.gross_total', language)}</span>
                    <span style={{ color: '#7FE87F' }}>{formatSaudiCurrency(numericValue, language)}</span>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder={translateText('softpos.order_ref_placeholder', language)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#151524',
                      border: '1px solid #2C2C44',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </Card>

              {/* Card CTA */}
              <button
                type="button"
                onClick={handleCardCharge}
                disabled={numericValue <= 0}
                className={`interactive-tap ${numericValue > 0 ? 'gold-gradient-btn' : ''}`}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: numericValue > 0 ? undefined : '#2C2C44',
                  color: numericValue > 0 ? '#080C14' : '#6E6E85',
                  fontSize: '14px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: numericValue > 0 ? '0 4px 16px rgba(127, 232, 127, 0.25)' : 'none',
                }}
              >
                <Wifi size={17} />
                <span>
                  {isAr
                    ? `تحصيل ${formatSaudiCurrency(numericValue, language)} بالبطاقة`
                    : `Tap to Pay ${formatSaudiCurrency(numericValue, language)}`}
                </span>
              </button>
            </>
          )}

          {/* ── Mode 2: CASH PAY (Supermarket Cashier Counter) ── */}
          {checkoutMode === 'cash' && (
            <>
              <Card variant="elevated" style={{ padding: '16px', background: '#111726', border: '1px solid #2C2C44' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    {translateText('softpos.cash_tendered', language)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#A2A2BA', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Store size={12} color="#7FE87F" />
                    {isAr ? 'صندوق النقد المباشر' : 'Cash Drawer'}
                  </span>
                </div>

                {/* Cash Tendered Input */}
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <input
                    type="number"
                    value={cashTenderedStr}
                    onChange={(e) => setCashTenderedStr(e.target.value)}
                    placeholder={numericValue.toFixed(2)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#151524',
                      border: '1.5px solid rgba(127, 232, 127, 0.35)',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: isRtl ? 'auto' : '14px',
                      left: isRtl ? '14px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#7FE87F',
                    }}
                  >
                    {isAr ? 'ر.س' : 'SAR'}
                  </span>
                </div>

                {/* Quick Cash Presets */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setCashTenderedStr(numericValue.toString())}
                    className="interactive-tap"
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: cashTenderedVal === numericValue ? 'rgba(127, 232, 127, 0.2)' : '#182236',
                      border: cashTenderedVal === numericValue ? '1px solid #7FE87F' : '1px solid #2C2C44',
                      color: cashTenderedVal === numericValue ? '#7FE87F' : '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {translateText('softpos.exact_amount', language)} ({formatSaudiCurrency(numericValue, language)})
                  </button>

                  {cashNotes.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setCashTenderedStr(note.toString())}
                      className="interactive-tap"
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: cashTenderedVal === note ? 'rgba(127, 232, 127, 0.2)' : '#182236',
                        border: cashTenderedVal === note ? '1px solid #7FE87F' : '1px solid #2C2C44',
                        color: cashTenderedVal === note ? '#7FE87F' : '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {formatSaudiCurrency(note, language)}
                    </button>
                  ))}
                </div>

                {/* Change Due / Remaining Box */}
                {numericValue > 0 && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: effectiveCashTendered >= numericValue ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: effectiveCashTendered >= numericValue ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 800, color: effectiveCashTendered >= numericValue ? '#22C55E' : '#EF4444' }}>
                      {effectiveCashTendered >= numericValue
                        ? translateText('softpos.change_due', language)
                        : translateText('softpos.remaining_due', language)}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: effectiveCashTendered >= numericValue ? '#22C55E' : '#EF4444' }}>
                      {effectiveCashTendered >= numericValue
                        ? formatSaudiCurrency(changeDue, language)
                        : formatSaudiCurrency(remainingDue, language)}
                    </span>
                  </div>
                )}
              </Card>

              {/* Invoice Summary */}
              <Card variant="elevated" style={{ padding: '16px', background: '#111726', border: '1px solid #2C2C44' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA' }}>
                    <span>{translateText('softpos.taxable_subtotal', language)}</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(subtotal) || 0, language)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA' }}>
                    <span>{translateText('softpos.vat_15', language)}</span>
                    <span style={{ color: '#7FE87F', fontWeight: 700 }}>{formatSaudiCurrency(parseFloat(vatAmount) || 0, language)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #2C2C44',
                      paddingTop: '8px',
                      fontSize: '14px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                    }}
                  >
                    <span>{translateText('softpos.gross_total', language)}</span>
                    <span style={{ color: '#7FE87F' }}>{formatSaudiCurrency(numericValue, language)}</span>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder={translateText('softpos.order_ref_placeholder', language)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#151524',
                      border: '1px solid #2C2C44',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </Card>

              {/* Error Alert */}
              {chargeError && (
                <div
                  className="fade-in"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{chargeError}</span>
                </div>
              )}

              {/* Cash CTA Button -> Guaranteed Issue Receipt */}
              <button
                type="button"
                onClick={handleCashCharge}
                disabled={numericValue <= 0 || isProcessingCash}
                className={`interactive-tap ${numericValue > 0 ? 'gold-gradient-btn' : ''}`}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: numericValue > 0 ? undefined : '#2C2C44',
                  color: numericValue > 0 ? '#080C14' : '#6E6E85',
                  fontSize: '14px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: numericValue > 0 ? '0 4px 16px rgba(127, 232, 127, 0.25)' : 'none',
                }}
              >
                {isProcessingCash ? (
                  <>
                    <Loader2 size={18} className="spin-animation" />
                    <span>{isAr ? 'جاري إصدار الفاتورة...' : 'Issuing Receipt...'}</span>
                  </>
                ) : (
                  <>
                    <Banknote size={18} />
                    <span>
                      {translateText('softpos.charge_cash_cta', language)} ({formatSaudiCurrency(numericValue, language)})
                    </span>
                  </>
                )}
              </button>
            </>
          )}

          {/* ── Mode 3: ONLINE / PAY QR (Dynamic Instant QR) ── */}
          {checkoutMode === 'online' && (
            <>
              <Card
                variant="elevated"
                style={{
                  padding: '20px',
                  background: 'radial-gradient(ellipse at top, rgba(127, 232, 127, 0.12) 0%, #111726 80%)',
                  border: '1px solid rgba(127, 232, 127, 0.25)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  {translateText('softpos.online_qr_title', language)}
                </div>
                <p style={{ fontSize: '11.5px', color: '#A2A2BA', margin: '0 0 14px 0' }}>
                  {translateText('softpos.online_qr_desc', language)}
                </p>

                {/* Dynamic QR Code */}
                <div
                  style={{
                    display: 'inline-block',
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    marginBottom: '14px',
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                      payQrUrl
                    )}`}
                    alt="Payment QR"
                    style={{ width: '160px', height: '160px', display: 'block', borderRadius: '6px' }}
                  />
                </div>

                {/* Direct Pay Link Pill + Copy */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#121212',
                    border: '1px solid #2C2C44',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11.5px',
                      color: '#7FE87F',
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {payQrUrl}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="interactive-tap"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#182236',
                      border: '1px solid #3A3A52',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isCopied ? <Check size={12} color="#22C55E" /> : <Copy size={12} color="#7FE87F" />}
                    <span>{isCopied ? translateText('softpos.pay_link_copied', language) : translateText('softpos.copy_pay_link', language)}</span>
                  </button>
                </div>
              </Card>

              {/* Error Alert */}
              {chargeError && (
                <div
                  className="fade-in"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{chargeError}</span>
                </div>
              )}

              {/* Online Pay Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSimulateQrPayment}
                  disabled={numericValue <= 0 || isSimulatingQr}
                  className="interactive-tap"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(127, 232, 127, 0.14)',
                    border: '1.5px solid #7FE87F',
                    color: '#7FE87F',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isSimulatingQr ? (
                    <>
                      <Loader2 size={16} className="spin-animation" />
                      <span>{isAr ? 'جاري معالجة دفع العميل...' : 'Customer Paying Online...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>{translateText('softpos.simulate_qr_scan', language)}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOnlineCharge}
                  disabled={numericValue <= 0}
                  className={`interactive-tap ${numericValue > 0 ? 'gold-gradient-btn' : ''}`}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    backgroundColor: numericValue > 0 ? undefined : '#2C2C44',
                    color: numericValue > 0 ? '#080C14' : '#6E6E85',
                    fontSize: '13.5px',
                    fontWeight: 900,
                    border: 'none',
                    cursor: numericValue > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Receipt size={16} />
                  <span>
                    {translateText('softpos.charge_online_cta', language)} ({formatSaudiCurrency(numericValue, language)})
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
