import React, { useState } from 'react';
import {
  Link2,
  Copy,
  Check,
  QrCode,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card } from '../components/ui';
import { QRCodeView } from '../components/QRCodeView';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { colors } from '../design-system/tokens';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';

export const MerchantQrGeneratorScreen: React.FC = () => {
  const {
    merchantInfo,
    processMerchantCollection,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [qrMode, setQrMode] = useState<'stand' | 'invoice'>('stand');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('150.00');
  const [orderNote, setOrderNote] = useState<string>(isAr ? 'فاتورة رقم #INV-9901' : 'Invoice #INV-9901');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const numAmount = qrMode === 'invoice' ? (parseFloat(invoiceAmount) || 0) : 0;
  const vatAmount = numAmount > 0 ? Number((numAmount - numAmount / 1.15).toFixed(2)) : 0;
  const subtotal = (numAmount - vatAmount).toFixed(2);

  const payLinkId = merchantInfo.terminalId
    ? merchantInfo.terminalId.replace(/\D/g, '').slice(-7) || '8839201'
    : '8839201';

  const payLinkUrl =
    qrMode === 'invoice' && numAmount > 0
      ? `https://qtpay.sa/pay/lnk_${payLinkId}?amt=${numAmount.toFixed(2)}`
      : `https://qtpay.sa/pay/lnk_${payLinkId}`;

  const zatcaPayload =
    qrMode === 'invoice'
      ? `zatca://taxinvoice?seller=${encodeURIComponent(merchantInfo.businessName)}&vat=${merchantInfo.vatNumber}&total=${numAmount.toFixed(2)}&vat_total=${vatAmount.toFixed(2)}&terminal=${merchantInfo.terminalId}&rail=sarie&ts=${encodeURIComponent(new Date().toISOString())}`
      : `zatca://posqr?seller=${encodeURIComponent(merchantInfo.businessName)}&cr=${merchantInfo.crNumber}&vat=${merchantInfo.vatNumber}&terminal=${merchantInfo.terminalId}&rail=sarie_mada`;

  const handleSimulateCustomerPayment = async () => {
    const payAmount = qrMode === 'invoice' && numAmount > 0 ? numAmount : 85.0;
    setIsSimulatingScan(true);
    await processMerchantCollection({
      amount: payAmount,
      paymentMethod: 'zatca_qr',
      orderRef: qrMode === 'invoice' ? (orderNote || 'QR-INVOICE') : 'COUNTER-QR',
      customerMasked: '+966 54 ••• 8821',
    });
    setTimeout(() => {
      setIsSimulatingScan(false);
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 600);
  };

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(zatcaPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyPayLink = () => {
    navigator.clipboard?.writeText(payLinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
          {isAr ? 'رمز PAY QR والفواتير' : 'PAY QR & Invoices'}
        </h1>
        <p style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '3px', margin: 0 }}>
          {isAr ? 'إنشاء باركود المتجر وفواتير الدفع والروابط المباشرة' : 'Generate counter QR stand, invoices & direct pay links'}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.2fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Mode Selector & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Mode Selector Tabs */}
          <Card variant="elevated" style={{ padding: '14px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                onClick={() => setQrMode('stand')}
                className="interactive-tap"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: qrMode === 'stand' ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                  border: qrMode === 'stand' ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                  color: qrMode === 'stand' ? '#7FE87F' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <QrCode size={15} />
                <span>{isAr ? 'ملصق المتجر' : 'Stand QR'}</span>
              </button>

              <button
                onClick={() => setQrMode('invoice')}
                className="interactive-tap"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: qrMode === 'invoice' ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                  border: qrMode === 'invoice' ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                  color: qrMode === 'invoice' ? '#7FE87F' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={15} />
                <span>{isAr ? 'فاتورة ضريبية' : 'Invoice QR'}</span>
              </button>
            </div>
          </Card>

          {/* Configuration Form Card */}
          <Card variant="elevated" style={{ padding: '18px', background: '#111726', border: '1px solid #2C2C44' }}>
            {qrMode === 'stand' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'بيانات ملصق الكاونتر والطاولات' : 'Store Stand Details'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#A2A2BA', lineHeight: 1.5 }}>
                  {isAr
                    ? 'يمكن للعميل مسح هذا الرمز بأي تطبيق بنكي سعودي وإدخال المبلغ المطلوب مباشرة.'
                    : 'Customers scan this code with any Saudi Banking app (Al Rajhi, SNB, Riyad, Urpay) and enter the custom amount.'}
                </div>

                <div style={{ padding: '14px', backgroundColor: '#080C14', borderRadius: '12px', border: '1px solid #2C2C44' }}>
                  <div style={{ fontSize: '12px', color: '#A2A2BA' }}>{isAr ? 'اسم المنشأة' : 'Business Name'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {translateText(merchantInfo.businessName, language)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7FE87F', marginTop: '6px', fontWeight: 700 }}>
                    {isAr ? 'الرقم الضريبي' : 'VAT ID'}: {formatLocalizedNumber(merchantInfo.vatNumber, language)}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'تخصيص الفاتورة الضريبية' : 'Dynamic Tax Invoice Config'}
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#A2A2BA', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'المبلغ الإجمالي (شامل الضريبة ١٥٪)' : 'Total Amount (Inc. 15% VAT)'}
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: '#080C14',
                        border: '1.5px solid #7FE87F',
                        borderRadius: '10px',
                        color: '#7FE87F',
                        fontSize: '18px',
                        fontWeight: 800,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Quick Amount Selector Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {['50', '100', '250', '500'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setInvoiceAmount(amt + '.00')}
                      className="interactive-tap"
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: invoiceAmount === amt + '.00' ? '#7FE87F' : '#151524',
                        border: '1px solid #2C2C44',
                        color: invoiceAmount === amt + '.00' ? '#080C14' : '#A2A2BA',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {/* Invoice Breakdown */}
                <div style={{ padding: '12px 14px', backgroundColor: '#080C14', borderRadius: '10px', border: '1px solid #2C2C44', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA', marginBottom: '4px' }}>
                    <span>{isAr ? 'المبلغ الأساسي' : 'Subtotal'}</span>
                    <span className="font-mono text-white">SAR {subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A2A2BA', marginBottom: '6px' }}>
                    <span>{isAr ? 'ضريبة القيمة المضافة (١٥٪)' : 'VAT (15%)'}</span>
                    <span className="font-mono text-white">SAR {vatAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7FE87F', fontWeight: 800, borderTop: '1px solid #2C2C44', paddingTop: '6px' }}>
                    <span>{isAr ? 'الإجمالي المستحق' : 'Total Due'}</span>
                    <span className="font-mono">{formatSaudiCurrency(numAmount, language)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#A2A2BA', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'مرجع الفاتورة / الملاحظة' : 'Invoice Ref / Note'}
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#080C14',
                      border: '1px solid #2C2C44',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Test Customer Payment Simulation Button */}
            <button
              onClick={handleSimulateCustomerPayment}
              disabled={isSimulatingScan}
              className="interactive-tap"
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(127, 232, 127, 0.14)',
                border: '1px solid rgba(127, 232, 127, 0.3)',
                color: '#7FE87F',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              <span>{isSimulatingScan ? (isAr ? 'جاري المحاكاة...' : 'Processing...') : (isAr ? 'تجربة مسح العميل والدفع' : 'Simulate Customer Scan & Pay')}</span>
            </button>
          </Card>
        </div>

        {/* Right Column: High-Res Stand Poster Preview */}
        <div>
          <Card
            variant="elevated"
            style={{
              padding: '28px',
              textAlign: 'center',
              backgroundColor: '#111726',
              border: '1px solid rgba(127, 232, 127, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Poster Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ZatcaLogo size={24} />
              <span style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF' }}>
                {isAr ? 'الفاتورة الضريبية المبسطة' : 'ZATCA Simplified Tax Invoice'}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#A2A2BA', marginBottom: '18px' }}>
              {isAr ? 'امسح الرمز أو استخدم الرابط للدفع الفوري' : 'Scan via Any Saudi Bank App or Use Direct Pay Link'}
            </div>

            {/* High-Resolution QR Display */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                marginBottom: '16px',
              }}
            >
              <QRCodeView
                value={zatcaPayload}
                size={220}
              />
            </div>

            {/* Amount Label (if Dynamic Invoice) */}
            {qrMode === 'invoice' && (
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#7FE87F', marginBottom: '12px' }}>
                {formatSaudiCurrency(numAmount, language)}
              </div>
            )}

            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
              {translateText(merchantInfo.businessName, language)}
            </div>

            <div style={{ fontSize: '11.5px', color: '#6E6E85', marginTop: '4px' }}>
              {isAr ? 'السجل التجاري' : 'CR'}: {formatLocalizedNumber(merchantInfo.crNumber, language)} &bull; {isAr ? 'الرقم الضريبي' : 'VAT'}: {formatLocalizedNumber(merchantInfo.vatNumber, language)}
            </div>

            {/* Action Bar (Print, Copy, Pay Link) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
                marginTop: '22px',
              }}
            >
              <button
                onClick={() => window.print()}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={15} color="#7FE87F" />
                <span>{isAr ? 'طباعة' : 'Print A4'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {copiedPayload ? <Check size={15} color="#7FE87F" /> : <Copy size={15} color="#7FE87F" />}
                <span>{copiedPayload ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ النص' : 'Copy')}</span>
              </button>

              {/* Pay Link Button (Replaced WhatsApp) */}
              <button
                onClick={handleCopyPayLink}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: copiedLink ? 'rgba(127, 232, 127, 0.2)' : '#182236',
                  border: copiedLink ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                  color: copiedLink ? '#7FE87F' : '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {copiedLink ? <Check size={15} color="#7FE87F" /> : <Link2 size={15} color="#7FE87F" />}
                <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied Link') : (isAr ? 'رابط الدفع' : 'Pay Link')}</span>
              </button>
            </div>

            {/* Direct Pay Link Strip */}
            <div
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px 14px',
                backgroundColor: '#080C14',
                border: '1px solid #2C2C44',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isAr ? 'رابط الدفع المباشر' : 'Direct Pay Link'}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#7FE87F',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                  dir="ltr"
                >
                  {payLinkUrl}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyPayLink}
                className="interactive-tap"
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: copiedLink ? '#7FE87F' : 'rgba(127, 232, 127, 0.14)',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  color: copiedLink ? '#080C14' : '#7FE87F',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
