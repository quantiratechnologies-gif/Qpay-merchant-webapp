import React, { useState } from 'react';
import { Link2, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { colors } from '../design-system/tokens';
import { formatSaudiCurrency } from '../utils/i18n';

export const PaymentLinkGeneratorScreen: React.FC = () => {
  const {
    merchantInfo,
    processMerchantCollection,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [orderRef, setOrderRef] = useState(isAr ? 'طلب #ORD-8839' : 'Order #ORD-8839');
  const [customerName, setCustomerName] = useState(isAr ? 'سارة المنصور' : 'Sara Al-Mansoor');
  const [amount, setAmount] = useState('320.00');
  const [generatedLink, setGeneratedLink] = useState('https://qtpay.sa/pay/lnk_8839201');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const vatAmount = numAmount > 0 ? (numAmount - numAmount / 1.15).toFixed(2) : '0.00';

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const linkId = 'lnk_' + Math.floor(1000000 + Math.random() * 9000000);
    setGeneratedLink(`https://qtpay.sa/pay/${linkId}`);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      isAr
        ? `مرحباً ${customerName}، إليك رابط الدفع لطلبك ${orderRef} (${merchantInfo.businessName}):\nالمبلغ: ${formatSaudiCurrency(numAmount, language)}\nادفع بأمان عبر أبل باي / البطاقات البنكية / سريع:\n${generatedLink}`
        : `Hello ${customerName}, here is your payment link for ${orderRef} (${merchantInfo.businessName}):\nAmount: SAR ${numAmount.toFixed(2)}\nPay securely via Apple Pay / Debit Card / Sarie:\n${generatedLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSimulateRemotePayment = async () => {
    if (numAmount <= 0) return;
    setIsSimulating(true);
    await processMerchantCollection({
      amount: numAmount,
      paymentMethod: 'payment_link',
      orderRef,
      customerMasked: customerName,
    });
    setTimeout(() => {
      setIsSimulating(false);
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 600);
  };

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
      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          {isAr ? 'روابط الدفع' : 'Payment Links'}
        </h1>
        <p style={{ fontSize: '13px', color: '#A3A3A3', marginTop: '4px', margin: 0 }}>
          {isAr ? 'إنشاء ومشاركة روابط الدفع الفورية' : 'Create and share instant payment links'}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Link Builder Form */}
        <div>
          <Card variant="elevated" style={{ padding: '24px', background: '#171717', border: '1px solid #262626' }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', borderBottom: '1px solid #262626', paddingBottom: '10px' }}>
                {isAr ? 'بيانات الرابط' : 'Link Details'}
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'اسم العميل' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'مثال: محمد الغامدي' : 'e.g., Mohammed Al-Ghamdi'}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #262626',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'المبلغ (ر.س)' : 'Amount (SAR)'}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#0B0B0B',
                    border: '1.5px solid #D4AF37',
                    borderRadius: '10px',
                    color: '#D4AF37',
                    fontSize: '18px',
                    fontWeight: 800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: '11.5px', color: '#A3A3A3', marginTop: '4px' }}>
                  {isAr ? `شامل ${formatSaudiCurrency(parseFloat(vatAmount) || 0, language)} ضريبة (١٥٪)` : `Includes SAR ${vatAmount} (15% VAT)`}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'رقم / وصف الطلب' : 'Order Reference'}
                </label>
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder={isAr ? 'مثال: طلب #٤٠١' : 'e.g., Order #401'}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #262626',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                className="interactive-tap gold-gradient-btn"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
                }}
              >
                <Link2 size={16} />
                <span>{isAr ? 'إنشاء الرابط' : 'Create Link'}</span>
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Active Link Card & Share Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Generated Link Preview */}
          <Card
            variant="elevated"
            style={{
              padding: '24px',
              backgroundColor: '#171717',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              background: 'linear-gradient(145deg, #171717 0%, #111111 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'الرابط النشط' : 'Active Link'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {isAr ? 'جاهز' : 'Ready'}
              </span>
            </div>

            <div style={{ margin: '18px 0', padding: '14px', backgroundColor: '#0B0B0B', borderRadius: '12px', border: '1px solid #262626' }}>
              <div style={{ fontSize: '11px', color: '#A3A3A3' }}>{isAr ? 'الرابط' : 'URL'}</div>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#D4AF37',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  marginTop: '4px',
                }}
              >
                {generatedLink}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', fontSize: '13px' }}>
              <span style={{ color: '#A3A3A3' }}>{isAr ? 'المبلغ' : 'Amount'}</span>
              <span style={{ color: '#D4AF37', fontWeight: 900, fontSize: '16px' }}>{formatSaudiCurrency(numAmount, language)}</span>
            </div>

            {/* Share Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={handleCopy}
                className="interactive-tap"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#212121',
                  border: '1px solid #262626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {copied ? <Check size={16} color="#D4AF37" /> : <Copy size={16} color="#D4AF37" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="interactive-tap"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <MessageSquare size={16} />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </button>
            </div>

            {/* Test Payment Simulation Trigger */}
            <button
              onClick={handleSimulateRemotePayment}
              disabled={isSimulating}
              className="interactive-tap"
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#1E1E1E',
                border: '1px solid #262626',
                color: '#A3A3A3',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#D4AF37" />
              <span>{isSimulating ? (isAr ? 'جاري التحويل...' : 'Simulating...') : (isAr ? 'محاكاة الدفع' : 'Simulate Payment')}</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
