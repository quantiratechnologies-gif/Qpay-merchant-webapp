import React, { useState } from 'react';
import { Link2, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { colors } from '../design-system/tokens';

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
        ? `مرحباً ${customerName}، إليك رابط الدفع لطلبك ${orderRef} (${merchantInfo.businessName}):\nالمبلغ: ${numAmount.toFixed(2)} ر.س\nادفع بأمان عبر أبل باي / البطاقات البنكية / سريع:\n${generatedLink}`
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
          {isAr ? 'روابط الدفع الرقمية (Smart Payment Links)' : 'Digital Payment Links'}
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
          {isAr
            ? 'إنشاء ومشاركة روابط تحصيل رقمية مع العملاء عبر واتساب والرسائل النصية والبريد الإلكتروني'
            : 'Create, share, and track remote payment links via WhatsApp, SMS, or Email'}
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
          <Card variant="elevated" style={{ padding: '24px' }}>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', borderBottom: '1px solid #1E293B', paddingBottom: '10px' }}>
                {isAr ? 'بيانات رابط الدفع الجديد' : 'Create New Payment Link'}
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
                    backgroundColor: '#080C14',
                    border: '1px solid #1E293B',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'المبلغ المطلوب تحصيله (ر.س)' : 'Charge Amount (SAR)'}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#080C14',
                    border: '1.5px solid #00C853',
                    borderRadius: '10px',
                    color: '#00C853',
                    fontSize: '18px',
                    fontWeight: 800,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                  {isAr ? `شامل ${vatAmount} ر.س ضريبة القيمة المضافة (١٥٪)` : `Includes SAR ${vatAmount} (15% VAT)`}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'مرجع الطلب أو الوصف' : 'Order Description / Reference'}
                </label>
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder={isAr ? 'مثال: توريد بضاعة رقم #٤٠١' : 'e.g., Catering invoice #401'}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#080C14',
                    border: '1px solid #1E293B',
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
                className="interactive-tap"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  fontSize: '14px',
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Link2 size={16} />
                <span>{isAr ? 'تحديث وإنشاء الرابط' : 'Generate Secure Link'}</span>
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
              backgroundColor: '#0E131F',
              border: '1px solid rgba(0, 200, 83, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'معاينة الرابط النشط' : 'Active Link Preview'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(0, 200, 83, 0.15)',
                  color: '#00C853',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {isAr ? 'نشط وصالح' : 'Active & Ready'}
              </span>
            </div>

            <div style={{ margin: '18px 0', padding: '14px', backgroundColor: '#080C14', borderRadius: '12px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{isAr ? 'رابط الدفع المباشر' : 'Secure URL'}</div>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#00C853',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  marginTop: '4px',
                }}
              >
                {generatedLink}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', fontSize: '13px' }}>
              <span style={{ color: '#94A3B8' }}>{isAr ? 'المبلغ المطلوب' : 'Payable Amount'}</span>
              <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '16px' }}>SAR {numAmount.toFixed(2)}</span>
            </div>

            {/* Share Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={handleCopy}
                className="interactive-tap"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
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
                {copied ? <Check size={16} color="#00C853" /> : <Copy size={16} color="#00C853" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="interactive-tap"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  color: '#00C853',
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
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #1E293B',
                color: '#94A3B8',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#00C853" />
              <span>{isSimulating ? (isAr ? 'جاري التحويل...' : 'Simulating...') : (isAr ? 'محاكاة دفع العميل للرابط' : 'Simulate Customer Remote Payment')}</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
