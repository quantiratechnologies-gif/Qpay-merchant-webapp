import React, { useState } from 'react';
import {
  Share2,
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
  const [copied, setCopied] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const numAmount = qrMode === 'invoice' ? (parseFloat(invoiceAmount) || 0) : 0;
  const vatAmount = numAmount > 0 ? Number((numAmount - numAmount / 1.15).toFixed(2)) : 0;
  const subtotal = (numAmount - vatAmount).toFixed(2);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const shareText = isAr
      ? `ادفع مباشرة لمتجر ${merchantInfo.businessName} عبر الباركود ورابط سريع: ${zatcaPayload}`
      : `Pay directly to ${merchantInfo.businessName} via QR / Sarie: ${zatcaPayload}`;
    if (navigator.share) {
      navigator.share({ title: merchantInfo.businessName, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
    }
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
          {isAr ? 'مركز باركود المتجر والفواتير الضريبية (ZATCA Phase 2)' : 'Store QR Hub & ZATCA E-Invoicing'}
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
          {isAr
            ? 'إنشاء وطباعة ملصقات الباركود الثابتة للطاولات أو إصدار فواتير ضريبية إلكترونية فورية'
            : 'Generate static counter stand posters or dynamic 15% VAT QR invoices for instant customer checkout'}
        </p>
      </div>

      {/* Side-by-Side 2-Column Desktop Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.2fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Mode Selector & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Mode Selector Tabs */}
          <Card variant="elevated" style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={() => setQrMode('stand')}
                className="interactive-tap"
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: qrMode === 'stand' ? 'rgba(0, 255, 36, 0.15)' : '#111726',
                  border: qrMode === 'stand' ? '1.5px solid #00FF24' : '1px solid #1E293B',
                  color: qrMode === 'stand' ? '#00FF24' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <QrCode size={16} />
                <span>{isAr ? 'باركود الملصق (ثابت)' : 'Static Stand QR'}</span>
              </button>

              <button
                onClick={() => setQrMode('invoice')}
                className="interactive-tap"
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: qrMode === 'invoice' ? 'rgba(0, 255, 36, 0.15)' : '#111726',
                  border: qrMode === 'invoice' ? '1.5px solid #00FF24' : '1px solid #1E293B',
                  color: qrMode === 'invoice' ? '#00FF24' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <FileText size={16} />
                <span>{isAr ? 'فاتورة ضريبية (محدد)' : 'Dynamic Invoice QR'}</span>
              </button>
            </div>
          </Card>

          {/* Configuration Form Card */}
          <Card variant="elevated" style={{ padding: '22px' }}>
            {qrMode === 'stand' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'بيانات ملصق الكاونتر والطاولات' : 'Store Stand Details'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5 }}>
                  {isAr
                    ? 'يمكن للعميل مسح هذا الرمز بأي تطبيق بنكي سعودي وإدخال المبلغ المطلوب مباشرة.'
                    : 'Customers scan this code with any Saudi Banking app (Al Rajhi, SNB, Riyad, Urpay) and enter the custom amount.'}
                </div>

                <div style={{ padding: '14px', backgroundColor: '#080C14', borderRadius: '12px', border: '1px solid #1E293B' }}>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{isAr ? 'اسم المنشأة' : 'Business Name'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {merchantInfo.businessName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#00FF24', marginTop: '6px', fontWeight: 700 }}>
                    {isAr ? 'الرقم الضريبي' : 'VAT ID'}: {merchantInfo.vatNumber}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'إنشاء فاتورة ضريبية محددة القيمة' : 'Set Invoice Amount & Reference'}
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'إجمالي الفاتورة (ر.س)' : 'Invoice Total (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#080C14',
                      border: '1.5px solid #00FF24',
                      borderRadius: '10px',
                      color: '#00FF24',
                      fontSize: '18px',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    {isAr ? 'رقم الفاتورة أو مرجع الطلب' : 'Invoice / Order Reference'}
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
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

                <div style={{ padding: '12px', backgroundColor: '#080C14', borderRadius: '10px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>{isAr ? 'الصافي الخاضع للضريبة' : 'Subtotal'}</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>SAR {subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginTop: '4px' }}>
                    <span>{isAr ? 'ضريبة القيمة المضافة (١٥٪)' : 'VAT (15%)'}</span>
                    <span style={{ color: '#00FF24', fontWeight: 700 }}>SAR {vatAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Test Customer Payment Simulation Button */}
            <button
              onClick={handleSimulateCustomerPayment}
              disabled={isSimulatingScan}
              className="interactive-tap"
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 255, 36, 0.12)',
                border: '1px solid rgba(0, 255, 36, 0.3)',
                color: '#00FF24',
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
              backgroundColor: '#0E131F',
              border: '1px solid rgba(0, 255, 36, 0.25)',
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

            <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '18px' }}>
              {isAr ? 'امسح الرمز عبر أي تطبيق بنكي للدفع الفوري' : 'Scan via Any Saudi Bank App to Pay via Sarie'}
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
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#00FF24', marginBottom: '12px' }}>
                SAR {numAmount.toFixed(2)}
              </div>
            )}

            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
              {merchantInfo.businessName}
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
              CR: {merchantInfo.crNumber} &bull; VAT: {merchantInfo.vatNumber}
            </div>

            {/* Action Bar (Print, Copy, WhatsApp) */}
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
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
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
                <Printer size={15} color="#00FF24" />
                <span>{isAr ? 'طباعة' : 'Print A4'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
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
                {copied ? <Check size={15} color="#00FF24" /> : <Copy size={15} color="#00FF24" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ النص' : 'Copy')}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
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
                <Share2 size={15} color="#00FF24" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
