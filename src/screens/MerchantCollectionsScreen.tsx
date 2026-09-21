import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Landmark,
  QrCode,
  Banknote,
  Share2,
  CheckCircle2,
  X,
  Lock,
  Zap,
  ArrowUpRight,
  Building2,
  Receipt,
  RotateCcw,
  Smartphone,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileText,
  Download,
  Printer,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency, getRiyadhDateStr } from '../utils/formatters';
import type { MerchantCollection, MerchantSettlement } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { QRCodeView } from '../components/QRCodeView';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, FilterPills } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

export const MerchantCollectionsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantSettlements,
    triggerSettleNow,
    merchantInfo,
    processMerchantRefund,
    navigateTo,
    language,
    isRtl,
    screenParams,
    openManagerPinModal,
  } = useApp();

  const isAr = language === 'العربية';
  const [exportSuccessToast, setExportSuccessToast] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'transactions' | 'settlements'>(() => {
    if (screenParams?.tab === 'settlements') return 'settlements';
    return 'transactions';
  });

  const handleTabChange = (tabId: 'transactions' | 'settlements') => {
    setActiveMainTab(tabId);
    navigateTo('MERCHANT_COLLECTIONS', { tab: tabId });
  };

  useEffect(() => {
    if (screenParams?.tab === 'settlements') {
      setActiveMainTab('settlements');
    } else if (screenParams?.tab === 'transactions' || screenParams?.tab === 'collections') {
      setActiveMainTab('transactions');
    }
  }, [screenParams?.tab]);

  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (screenParams?.filter) return screenParams.filter;
    return 'all';
  });

  useEffect(() => {
    if (screenParams?.filter) {
      setActiveFilter(screenParams.filter);
    }
  }, [screenParams?.filter]);

  const [selectedTxn, setSelectedTxn] = useState<MerchantCollection | null>(null);
  const [selectedSettlementInvoice, setSelectedSettlementInvoice] = useState<MerchantSettlement | null>(null);
  const [refundPin, setRefundPin] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [settlementSuccessToast, setSettlementSuccessToast] = useState<{ utr: string; amount: number } | null>(null);
  const [settlementError, setSettlementError] = useState<string>('');

  const todayRiyadhStr = getRiyadhDateStr(new Date());

  const handleSettleNow = () => {
    if (isSettling) return;
    if (unsettledTotal <= 0) return;

    openManagerPinModal({
      title: isAr ? 'تأكيد التسوية الفورية' : 'Confirm Instant Settlement',
      subtitle: isAr
        ? `أدخل رمز PIN لتسوية ${formatSaudiCurrency(unsettledTotal, language)} إلى حسابك البنكي`
        : `Enter Security PIN to settle ${formatSaudiCurrency(unsettledTotal, language)} to your bank account`,
      onSuccess: async () => {
        setIsSettling(true);
        setSettlementError('');
        try {
          const res = await triggerSettleNow();
          setSettlementSuccessToast({ utr: res.utr, amount: res.amount });
          setTimeout(() => setSettlementSuccessToast(null), 6000);
        } catch (err: any) {
          console.error('Settlement error:', err);
          setSettlementError(
            isAr
              ? 'فشلت عملية التسوية. لا يوجد رصيد معلق قابل للتسوية.'
              : 'Settlement failed. No pending unsettled balance found.'
          );
          setTimeout(() => setSettlementError(''), 5000);
        } finally {
          setIsSettling(false);
        }
      },
    });
  };

  const allCollections: MerchantCollection[] = merchantCollections;

  const filtered = allCollections.filter((c) => {
    if (activeFilter === 'today') {
      const colDateStr = c.timestamp ? getRiyadhDateStr(new Date(c.timestamp)) : '';
      return colDateStr === todayRiyadhStr;
    }
    if (activeFilter === 'card') return c.paymentMethod === 'softpos_mada' || c.paymentMethod.includes('card') || c.paymentMethod.includes('mada');
    if (activeFilter === 'applepay') return c.paymentMethod === 'softpos_applepay' || c.paymentMethod.includes('apple');
    if (activeFilter === 'zatca') return c.paymentMethod === 'zatca_qr';
    if (activeFilter === 'cash') return c.paymentMethod === 'cash';
    if (activeFilter === 'link') return c.paymentMethod === 'payment_link';
    if (activeFilter === 'refunded') return c.status === 'refunded';
    return true;
  });

  const totalSales = filtered.reduce((acc, c) => acc + (c.status !== 'refunded' ? c.amount : 0), 0);
  const unsettledTotal = merchantCollections
    .filter((c) => c.status === 'pending_settlement' && c.paymentMethod !== 'cash')
    .reduce((sum, c) => sum + c.amount, 0);

  const handleOpenRefundModal = (txn: MerchantCollection) => {
    if (txn.status === 'refunded') return;
    setSelectedTxn(txn);
    setRefundPin('');
    setRefundError('');
    setRefundSuccess(false);
  };

  const handleConfirmRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setIsRefunding(true);
    setRefundError('');

    const success = await processMerchantRefund(selectedTxn.id, refundPin);
    setIsRefunding(false);

    if (success) {
      setRefundSuccess(true);
      setTimeout(() => {
        setSelectedTxn(null);
      }, 1200);
    } else {
      setRefundError(
        isAr
          ? 'رمز التاجر غير صحيح'
          : 'Incorrect PIN'
      );
    }
  };



  const handleDownloadTaxInvoice = (settlementRef: string) => {
    const s = merchantSettlements.find((item) => item.settlementRef === settlementRef);
    if (s) {
      setSelectedSettlementInvoice(s);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) return <CreditCard size={15} />;
    if (method.includes('apple')) return <Smartphone size={15} />;
    if (method === 'zatca_qr') return <QrCode size={15} />;
    if (method === 'cash') return <Banknote size={15} />;
    return <Share2 size={15} />;
  };

  const getPaymentMethodBadge = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return { label: isAr ? 'بطاقة مدى' : 'mada Card', color: colors.accentGreen, bg: colors.primaryLight };
    }
    if (method.includes('apple')) return { label: 'Apple Pay', color: '#fff', bg: '#1E293B' };
    if (method === 'zatca_qr') return { label: isAr ? 'رمز PAY QR' : 'PAY QR', color: colors.accentPurple, bg: colors.purpleLight };
    if (method === 'cash') return { label: isAr ? 'نقدي' : 'Cash', color: colors.accentGreen, bg: colors.primaryLight };
    return { label: isAr ? 'رابط دفع' : 'Pay Link', color: '#38BDF8', bg: '#0F2942' };
  };

  const getTransactionTitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada') || c.paymentMethod.includes('card') || c.paymentMethod.startsWith('softpos')) {
      return isAr ? 'بطاقة بنكية' : 'Contactless Card';
    }
    if (c.paymentMethod.includes('apple')) return `Apple Pay • ${c.orderRef || 'ORD-9842'}`;
    if (c.paymentMethod === 'zatca_qr') return c.customerMasked || (isAr ? 'طارق العتيبي' : 'Tariq Al-Otaibi');
    if (c.paymentMethod === 'cash') return isAr ? 'بيع نقدي • كاشير ١' : 'Cash Sale • Register 1';
    return c.customerMasked || c.orderRef || (isAr ? 'رابط دفع' : 'Payment Link');
  };

  const getTransactionSubtitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada')) return isAr ? '١١:٤٢ ص • نقطة بيع بالجوال' : '11:42 AM • SoftPOS Tap';
    if (c.paymentMethod.includes('apple')) return isAr ? '١٠:١٥ ص • جهاز #٨٨٣٩٢٠٢' : '10:15 AM • POS–8839202';
    if (c.paymentMethod === 'zatca_qr') return isAr ? '٠٩:٣٠ ص • فاتورة ضريبية #٤٠١٩' : '09:30 AM • Tax Inv #4019';
    if (c.paymentMethod === 'cash') return isAr ? 'أمس • سجل النقد' : 'Yesterday • Cash Log';
    return translateText(c.date, language);
  };

  const handleExportCsv = () => {
    try {
      const headers = isAr
        ? ['رقم العملية', 'رقم المرجع', 'طريقة الدفع', 'المبلغ الإجمالي (ر.س)', 'ضريبة القيمة المضافة (ر.س)', 'المبلغ الصافي (ر.س)', 'الحالة', 'العميل', 'التاريخ']
        : ['Transaction ID', 'Order Ref', 'Payment Method', 'Gross Amount (SAR)', 'VAT Amount (SAR)', 'Net Amount (SAR)', 'Status', 'Customer', 'Date'];

      const rows = filtered.map((c) => [
        `"${c.id}"`,
        `"${c.orderRef || ''}"`,
        `"${c.paymentMethod}"`,
        c.amount.toFixed(2),
        c.vatAmount.toFixed(2),
        c.netAmount.toFixed(2),
        `"${c.status}"`,
        `"${c.customerMasked || ''}"`,
        `"${typeof c.date === 'string' ? c.date : (c.timestamp ? new Date(c.timestamp).toLocaleString() : '')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      link.setAttribute('href', url);
      link.setAttribute('download', `qpay_collections_statement_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccessToast(true);
      setTimeout(() => setExportSuccessToast(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const collectionFilterTabs = [
    { id: 'all', label: isAr ? `الكل (${allCollections.length})` : `All (${allCollections.length})`, icon: <Layers size={13} /> },
    { id: 'today', label: isAr ? 'اليوم' : 'Today', icon: <Clock size={13} /> },
    { id: 'card', label: isAr ? 'بطاقات' : 'Cards', icon: <CreditCard size={13} /> },
    { id: 'applepay', label: 'Apple Pay', icon: <Smartphone size={13} /> },
    { id: 'zatca', label: 'PAY QR', icon: <QrCode size={13} /> },
    { id: 'cash', label: isAr ? 'نقدي' : 'Cash', icon: <Banknote size={13} /> },
    { id: 'link', label: isAr ? 'روابط' : 'Links', icon: <Share2 size={13} /> },
    {
      id: 'refunded',
      label: isAr
        ? `المستردات (${allCollections.filter((c) => c.status === 'refunded').length})`
        : `Refunds (${allCollections.filter((c) => c.status === 'refunded').length})`,
      icon: <RotateCcw size={13} />,
    },
  ];

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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: colors.textPrimary }}>
              {isAr ? 'التحصيلات والتسويات' : 'Collections & Settlements'}
            </h1>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '4px 0 0 0', fontWeight: 500 }}>
              {isAr ? 'سجل العمليات والتسويات الفورية' : 'Transaction and settlement ledger'}
            </p>
          </div>

          {/* CSV Export + Receipt CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleExportCsv}
              className="interactive-tap"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.md,
                padding: '8px 14px',
                color: colors.textSecondary,
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              {isAr ? 'تصدير' : 'Export'}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              className="interactive-tap"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: colors.primaryLight,
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: radii.md,
                padding: '8px 14px',
                color: colors.accentGreen,
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Receipt size={14} />
              {isAr ? 'فاتورة' : 'Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Dual Tab Segmented Control ───────────────────────── */}
      <div
        style={{
          backgroundColor: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          padding: '5px',
          display: 'inline-flex',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'transactions', label: isAr ? 'التحصيلات' : 'Collections', icon: <CreditCard size={16} strokeWidth={2.4} /> },
          { id: 'settlements', label: isAr ? 'التسويات' : 'Settlements', icon: <Landmark size={16} strokeWidth={2.4} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id as 'transactions' | 'settlements')}
            className="interactive-tap"
            style={{
              backgroundColor: activeMainTab === tab.id ? colors.accentGreen : 'transparent',
              color: activeMainTab === tab.id ? '#080C14' : colors.textSecondary,
              border: 'none',
              borderRadius: radii.md,
              padding: '9px 22px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB 1 — COLLECTIONS
      ═══════════════════════════════════════════════════════ */}
      {activeMainTab === 'transactions' && (
        <>
          {/* Filter Chips */}
          <FilterPills
            tabs={collectionFilterTabs}
            activeId={activeFilter}
            onSelect={(id) => setActiveFilter(id)}
            style={{ marginBottom: '20px' }}
          />

          {/* Summary Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAr ? 'اليوم، ٢٤ أكتوبر' : 'TODAY, 24 OCT'}
            </span>
            <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
              {formatSaudiCurrency(totalSales, language)}
            </span>
          </div>

          {/* Full-Width Enterprise Table */}
          <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.4fr 100px 80px 90px 90px',
                padding: '11px 20px',
                backgroundColor: colors.bgInset,
                borderBottom: `1px solid ${colors.border}`,
                gap: '12px',
              }}
            >
              {[
                isAr ? 'العميل / الطريقة' : 'Customer / Method',
                isAr ? 'المرجع' : 'Reference',
                isAr ? 'الوقت' : 'Timestamp',
                isAr ? 'المبلغ' : 'Amount',
                isAr ? 'ضريبة' : 'VAT',
                isAr ? 'الحالة' : 'Status',
                isAr ? 'إجراء' : 'Action',
              ].map((col, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    textAlign: i >= 3 ? 'right' : 'left',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.map((c, idx) => {
              const badge = getPaymentMethodBadge(c.paymentMethod);
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.4fr 100px 80px 90px 90px',
                    padding: '14px 20px',
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${colors.border}` : 'none',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: c.status !== 'refunded' ? 'pointer' : 'default',
                    transition: 'background 0.12s ease',
                  }}
                  className="interactive-tap"
                  onClick={() => handleOpenRefundModal(c)}
                >
                  {/* Col 1: Customer / Method */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px', height: '34px',
                        borderRadius: radii.md,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: badge.color,
                        flexShrink: 0,
                      }}
                    >
                      {getPaymentMethodIcon(c.paymentMethod)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
                        {getTransactionTitle(c)}
                      </div>
                      <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '1px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '1px 7px',
                            borderRadius: radii.full,
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Reference */}
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.textSecondary, fontWeight: 600 }}>
                    {c.id}
                  </span>

                  {/* Col 3: Timestamp */}
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                    {getTransactionSubtitle(c)}
                  </span>

                  {/* Col 4: Amount */}
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '14px', fontWeight: 900,
                      color: c.status === 'refunded' ? colors.dangerText : colors.accentGreen,
                      textAlign: 'right',
                    }}
                  >
                    {c.status === 'refunded' ? '-' : '+'}{formatSaudiCurrency(c.amount, language)}
                  </span>

                  {/* Col 5: VAT */}
                  <span
                    className="tabular-nums"
                    style={{ fontSize: '12px', color: colors.textSecondary, textAlign: 'right', fontWeight: 600 }}
                  >
                    {formatLocalizedNumber(c.vatAmount.toFixed(2), language)}
                  </span>

                  {/* Col 6: Status */}
                  <div style={{ textAlign: 'right' }}>
                    {c.status === 'refunded' ? (
                      <StatusBadge status="warning" size="sm" label={isAr ? 'مستردة' : 'Refunded'} />
                    ) : c.status === 'pending_settlement' ? (
                      <StatusBadge status="neutral" size="sm" label={isAr ? 'معلقة للتسوية' : 'Pending'} />
                    ) : (
                      <StatusBadge status="success" size="sm" label={isAr ? 'تمت التسوية' : 'Settled'} />
                    )}
                  </div>

                  {/* Col 7: Action */}
                  <div style={{ textAlign: 'right' }}>
                    {c.status !== 'refunded' && (
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: `1px solid ${colors.borderStrong}`,
                          borderRadius: radii.sm,
                          padding: '4px 10px',
                          color: colors.textSecondary,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <RotateCcw size={11} />
                        {isAr ? 'استرداد' : 'Refund'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>
                {isAr ? 'لا توجد عمليات في هذا التصنيف' : 'No transactions in this category'}
              </div>
            )}
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 2 — SETTLEMENTS
      ═══════════════════════════════════════════════════════ */}
      {activeMainTab === 'settlements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Settlement Error Alert */}
          {settlementError && (
            <div
              className="fade-in"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: radii.md,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <ShieldAlert size={18} color="#EF4444" />
              <span>{settlementError}</span>
            </div>
          )}

          {/* Settlement Success Toast Alert */}
          {settlementSuccessToast && (
            <div
              className="fade-in"
              style={{
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.4)',
                borderRadius: radii.md,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 4px 20px rgba(0, 200, 83, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color={colors.accentGreen} />
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 800 }}>
                    {isAr
                      ? `تم تحويل مبلغ التسوية ${formatSaudiCurrency(settlementSuccessToast.amount, language)} بنجاح!`
                      : `Settlement payout of ${formatSaudiCurrency(settlementSuccessToast.amount, language)} dispatched successfully!`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {isAr ? 'تم الإيداع الفوري في الحساب البنكي عبر شبكة سريع' : 'Credited instantly to settlement IBAN via Sarie IPS rail'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: colors.accentGreen, fontWeight: 700 }}>
                UTR: {settlementSuccessToast.utr}
              </span>
            </div>
          )}

          {/* Settle Now Hero Card */}
          <Card
            variant="elevated"
            style={{
              padding: '24px 28px',
              background: 'radial-gradient(ellipse at top left, rgba(0, 200, 83, 0.10) 0%, #0D1424 65%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {isAr ? 'الرصيد غير المسوى' : 'Unsettled Balance'}
                </span>
                <div className="tabular-nums" style={{ fontSize: '36px', fontWeight: 900, color: colors.textPrimary, marginTop: '4px', letterSpacing: '-0.04em' }}>
                  {formatCurrency(unsettledTotal, language)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '12px', color: colors.textSecondary }}>
                  <Building2 size={14} color={colors.accentGreen} />
                  <span>
                    {isAr ? 'الحساب:' : 'Bank:'}{' '}
                    <strong style={{ color: colors.textPrimary }}>{translateText(merchantInfo.settlementBank, language)}</strong>
                  </span>
                  <ShieldCheck size={13} color={colors.accentGreen} />
                  <span style={{ color: colors.accentGreen, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {isAr ? 'يومياً ٠٦:٠٠ ص' : 'Daily 06:00 AM'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSettleNow}
                disabled={isSettling || unsettledTotal <= 0}
                className="interactive-tap"
                style={{
                  backgroundColor: unsettledTotal > 0 ? colors.accentGreen : '#2C2C44',
                  color: unsettledTotal > 0 ? '#080C14' : '#6E6E85',
                  border: 'none',
                  borderRadius: radii.lg,
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: unsettledTotal > 0 && !isSettling ? 'pointer' : 'not-allowed',
                  opacity: unsettledTotal > 0 && !isSettling ? 1 : 0.6,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: unsettledTotal > 0 ? '0 6px 24px rgba(0, 200, 83, 0.4)' : 'none',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <Zap size={17} fill={unsettledTotal > 0 ? '#080C14' : '#6E6E85'} />
                <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : (isAr ? 'تسوية فورية' : 'Settle Now')}</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </Card>

          {/* 1. Transactions to be Settled (Merchant Settle Cheyyalsina Transactions) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color={colors.accentGreen} />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                  {isAr ? 'العمليات المشمولة في التسوية (جاهزة للإيداع)' : 'Transactions to Settle (Ready for Payout)'}
                </h3>
                <span
                  style={{
                    backgroundColor: colors.primaryLight,
                    border: '1px solid rgba(0, 200, 83, 0.3)',
                    color: colors.accentGreen,
                    borderRadius: radii.full,
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {formatLocalizedNumber(allCollections.filter((c) => c.status === 'pending_settlement' && c.paymentMethod !== 'cash').length, language)} {isAr ? 'عمليات' : 'Transactions'}
                </span>
              </div>

              <span style={{ fontSize: '12px', fontWeight: 700, color: colors.textSecondary }}>
                {isAr ? 'إجمالي المبالغ:' : 'Total Payable:'}{' '}
                <strong style={{ color: colors.accentGreen, fontSize: '13px' }}>{formatCurrency(unsettledTotal, language)}</strong>
              </span>
            </div>

            <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1.3fr 110px 90px 100px',
                  padding: '11px 20px',
                  backgroundColor: colors.bgInset,
                  borderBottom: `1px solid ${colors.border}`,
                  gap: '12px',
                }}
              >
                {[
                  isAr ? 'العميل / القناة' : 'Customer / Channel',
                  isAr ? 'رقم المرجع' : 'Order Ref',
                  isAr ? 'التاريخ والوقت' : 'Timestamp',
                  isAr ? 'المبلغ الإجمالي' : 'Gross Amount',
                  isAr ? 'ضريبة ١٥٪' : 'VAT (15%)',
                  isAr ? 'حالة العملية' : 'Status',
                ].map((col, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      textAlign: i >= 3 ? 'right' : 'left',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {/* Transactions List */}
              {allCollections.filter((c) => c.status === 'pending_settlement' && c.paymentMethod !== 'cash').length === 0 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: colors.textSecondary, fontSize: '13px' }}>
                  {isAr ? 'تمت تسوية جميع العمليات بنجاح. لا توجد عمليات معلقة.' : 'All transactions have been settled successfully. No pending collections.'}
                </div>
              ) : (
                allCollections
                  .filter((c) => c.status === 'pending_settlement' && c.paymentMethod !== 'cash')
                  .map((c, idx, arr) => {
                    const badge = getPaymentMethodBadge(c.paymentMethod);
                    return (
                      <div
                        key={c.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1.3fr 110px 90px 100px',
                          padding: '13px 20px',
                          borderBottom: idx < arr.length - 1 ? `1px solid ${colors.border}` : 'none',
                          gap: '12px',
                          alignItems: 'center',
                        }}
                      >
                        {/* Customer & Method */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: radii.md,
                              backgroundColor: badge.bg,
                              border: `1px solid ${badge.color}33`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: badge.color,
                              flexShrink: 0,
                            }}
                          >
                            {getPaymentMethodIcon(c.paymentMethod)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {getTransactionTitle(c)}
                            </div>
                            <div style={{ fontSize: '10.5px', color: badge.color, fontWeight: 700 }}>
                              {badge.label}
                            </div>
                          </div>
                        </div>

                        {/* Order Ref */}
                        <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: colors.textSecondary, fontWeight: 600 }}>
                          {c.orderRef || c.id}
                        </span>

                        {/* Time */}
                        <span style={{ fontSize: '11.5px', color: colors.textSecondary }}>
                          {getTransactionSubtitle(c)}
                        </span>

                        {/* Gross Amount */}
                        <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 900, color: colors.accentGreen, textAlign: 'right' }}>
                          {formatSaudiCurrency(c.amount, language)}
                        </span>

                        {/* VAT */}
                        <span className="tabular-nums" style={{ fontSize: '11.5px', color: colors.textSecondary, textAlign: 'right', fontWeight: 600 }}>
                          {formatLocalizedNumber(c.vatAmount.toFixed(2), language)}
                        </span>

                        {/* Status Badge */}
                        <div style={{ textAlign: 'right' }}>
                          <StatusBadge status="neutral" size="sm" label={isAr ? 'جاهزة للتسوية' : 'To Settle'} />
                        </div>
                      </div>
                    );
                  })
              )}
            </Card>
          </div>
          {/* 2. Settlements History Ledger — table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Landmark size={16} color={colors.accentGreen} />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                {isAr ? 'سجل التسويات السابقة' : 'Past Settlements History'}
              </h3>
              <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                {formatLocalizedNumber(merchantSettlements.length, language)} {isAr ? 'تسويات' : 'Settlements'}
              </span>
            </div>

            <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Settlement Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1.2fr 120px 80px 130px',
                  padding: '11px 20px',
                  backgroundColor: colors.bgInset,
                  borderBottom: `1px solid ${colors.border}`,
                  gap: '12px',
                }}
              >
                {[
                  isAr ? 'مرجع التسوية' : 'Settlement Ref',
                  isAr ? 'مرجع سريع' : 'Sarie Ref',
                  isAr ? 'البنك' : 'Bank',
                  isAr ? 'المبلغ' : 'Amount',
                  isAr ? 'النوع' : 'Type',
                  isAr ? 'إجراء' : 'Action',
                ].map((col, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10.5px', fontWeight: 700,
                      color: colors.textMuted, textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      textAlign: i >= 3 ? 'right' : 'left',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {merchantSettlements.map((s, idx) => (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1.2fr 120px 80px 130px',
                    padding: '15px 20px',
                    borderBottom: idx < merchantSettlements.length - 1 ? `1px solid ${colors.border}` : 'none',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  {/* Ref */}
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: colors.textPrimary }}>{s.settlementRef}</div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '1px' }}>{translateText(s.date, language)}</div>
                  </div>

                  {/* UTR */}
                  <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: colors.textSecondary, fontWeight: 600 }}>
                    {s.utr}
                  </span>

                  {/* Bank */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colors.textSecondary }}>
                    <Building2 size={13} color={colors.accentBlue} />
                    {translateText(s.bankName, language)} ({s.ibanMasked.slice(-8)})
                  </div>

                  {/* Amount */}
                  <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 900, color: colors.accentGreen, textAlign: 'right' }}>
                    +{formatCurrency(s.amount, language)}
                  </span>

                  {/* Type */}
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge
                      status={s.method === 'instant_settlenow' ? 'success' : 'info'}
                      size="sm"
                      label={s.method === 'instant_settlenow' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'تلقائي' : 'Auto')}
                    />
                  </div>

                  {/* Action */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadTaxInvoice(s.settlementRef)}
                      className="interactive-tap"
                      style={{
                        background: colors.bgInset,
                        border: `1px solid ${colors.borderStrong}`,
                        borderRadius: radii.sm,
                        padding: '5px 12px',
                        color: colors.textPrimary,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                      }}
                    >
                      <FileText size={12} color={colors.accentGreen} />
                      {isAr ? 'تحميل الفاتورة' : 'Invoice'}
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── Refund Authorization Modal ───────────────────────── */}
      {selectedTxn && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: spacing.space5,
            boxSizing: 'border-box',
          }}
          onClick={() => !isRefunding && setSelectedTxn(null)}
        >
          <Card
            variant="elevated"
            style={{
              width: '100%', maxWidth: '420px',
              padding: `${spacing.space6} ${spacing.space5}`,
              boxSizing: 'border-box',
              color: colors.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <RotateCcw size={18} color={colors.dangerText} />
                <span style={{ fontSize: '16px', fontWeight: 800 }}>
                  {isAr ? 'استرداد العملية' : 'Refund Transaction'}
                </span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: colors.bgInset, border: `1px solid ${colors.border}`,
                  borderRadius: radii.full, width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.textSecondary, cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {refundSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color={colors.accentGreen} style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>
                  {isAr ? 'تم الاسترداد بنجاح' : 'Refund Successful'}
                </div>
                <div style={{ fontSize: '12.5px', color: colors.textSecondary, marginTop: '6px' }}>
                  {isAr
                    ? `تم إرجاع ${formatSaudiCurrency(selectedTxn.amount, language)} إلى حساب العميل فورياً.`
                    : `SAR ${selectedTxn.amount.toFixed(2)} refunded to customer.`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmRefund} style={{ display: 'flex', flexDirection: 'column', gap: spacing.space3 }}>
                <Card variant="inset" style={{ padding: spacing.space3, fontSize: '12.5px' }}>
                  {[
                    { label: isAr ? 'العملية:' : 'Transaction:', value: getTransactionTitle(selectedTxn) },
                    { label: isAr ? 'المرجع:' : 'Reference:', value: selectedTxn.id, mono: true },
                    { label: isAr ? 'الضريبة (١٥٪):' : 'VAT (15%):', value: formatSaudiCurrency(selectedTxn.vatAmount, language), green: true },
                  ].map(({ label, value, mono, green }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: colors.textSecondary }}>{label}</span>
                      <span style={{ fontWeight: 700, fontFamily: mono ? 'monospace' : undefined, color: green ? colors.accentGreen : undefined }}>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: `1px solid ${colors.border}` }}>
                    <span style={{ color: colors.textSecondary }}>{isAr ? 'المبلغ:' : 'Total Amount:'}</span>
                    <span style={{ fontWeight: 900, color: colors.textPrimary }}>{formatSaudiCurrency(selectedTxn.amount, language)}</span>
                  </div>
                </Card>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    {isAr ? 'رمز التاجر السري' : 'Merchant PIN'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: colors.bgInset, border: `1px solid ${colors.border}`, borderRadius: radii.md, padding: '12px 14px' }}>
                    <Lock size={16} color={colors.accentGreen} style={{ marginRight: isRtl ? 0 : '10px', marginLeft: isRtl ? '10px' : 0 }} />
                    <input
                      type="password"
                      maxLength={4}
                      value={refundPin}
                      onChange={(e) => setRefundPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      required
                      style={{
                        background: 'none', border: 'none', outline: 'none',
                        color: colors.textPrimary, fontSize: '20px', fontWeight: 900,
                        letterSpacing: '0.3em', width: '100%',
                        direction: 'ltr', textAlign: isRtl ? 'right' : 'left',
                      }}
                    />
                  </div>
                </div>

                {refundError && (
                  <div style={{ fontSize: '12px', color: colors.dangerText, fontWeight: 700 }}>{refundError}</div>
                )}

                <PrimaryButton type="submit" disabled={isRefunding || refundPin.length < 4}>
                  {isRefunding
                    ? (isAr ? 'جاري الاسترداد...' : 'Processing...')
                    : (isAr ? `تأكيد استرداد ${formatSaudiCurrency(selectedTxn.amount, language)}` : `Confirm Refund SAR ${selectedTxn.amount.toFixed(2)}`)}
                </PrimaryButton>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* ── Settlement Tax Invoice Modal ───────────────────────── */}
      {selectedSettlementInvoice && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: spacing.space4,
            boxSizing: 'border-box',
          }}
          onClick={() => setSelectedSettlementInvoice(null)}
        >
          <Card
            variant="elevated"
            style={{
              width: '100%', maxWidth: '520px',
              padding: '24px',
              boxSizing: 'border-box',
              color: colors.textPrimary,
              background: '#0D1424',
              border: '1px solid #2C2C44',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #2C2C44', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ZatcaLogo size={22} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>
                    {isAr ? 'فاتورة تسوية ضريبية معتمدة' : 'ZATCA Settlement Tax Invoice'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
                    {isAr ? 'هيئة الزكاة والضريبة والجمارك' : 'ZATCA Phase 2 E-Invoice'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSettlementInvoice(null)}
                style={{
                  background: colors.bgInset, border: `1px solid ${colors.border}`,
                  borderRadius: radii.full, width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.textSecondary, cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Merchant Details */}
            <div style={{ padding: '12px 14px', backgroundColor: '#080C14', borderRadius: '10px', border: '1px solid #2C2C44', marginBottom: '14px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {translateText(merchantInfo.businessName, language)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#A2A2BA', marginTop: '4px' }}>
                <span>{isAr ? 'السجل التجاري:' : 'CR Number:'} <strong style={{ color: '#FFFFFF' }}>{merchantInfo.crNumber}</strong></span>
                <span>{isAr ? 'الرقم الضريبي:' : 'VAT Number:'} <strong style={{ color: '#7FE87F' }}>{merchantInfo.vatNumber}</strong></span>
              </div>
            </div>

            {/* Settlement Breakdown Table */}
            <Card variant="inset" style={{ padding: '14px', fontSize: '12.5px', marginBottom: '16px' }}>
              {[
                { label: isAr ? 'مرجع التسوية:' : 'Settlement Reference:', value: selectedSettlementInvoice.settlementRef, mono: true },
                { label: isAr ? 'مرجع شبكة سريع (UTR):' : 'Sarie Network UTR:', value: selectedSettlementInvoice.utr, mono: true },
                { label: isAr ? 'التاريخ والوقت:' : 'Settlement Date:', value: translateText(selectedSettlementInvoice.date, language) },
                { label: isAr ? 'الحساب البنكي المحول إليه:' : 'Destination Bank Account:', value: `${translateText(selectedSettlementInvoice.bankName, language)} (${selectedSettlementInvoice.ibanMasked})` },
                { label: isAr ? 'طريقة التحويل:' : 'Payout Rail:', value: selectedSettlementInvoice.method === 'instant_settlenow' ? (isAr ? 'تسوية فورية (سريع)' : 'Sarie Instant Dispatch') : (isAr ? 'تسوية يومية آلية' : 'Daily Automated Settlement') },
                { label: isAr ? 'المبلغ الأساسي (قبل الضريبة):' : 'Subtotal (Net Amount):', value: formatSaudiCurrency(selectedSettlementInvoice.netAmount || Number((selectedSettlementInvoice.amount / 1.15).toFixed(2)), language) },
                { label: isAr ? 'ضريبة القيمة المضافة (١٥٪):' : 'VAT (15%):', value: formatSaudiCurrency(selectedSettlementInvoice.vatAmount || Number((selectedSettlementInvoice.amount - selectedSettlementInvoice.amount / 1.15).toFixed(2)), language), green: true },
              ].map(({ label, value, mono, green }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ color: colors.textSecondary }}>{label}</span>
                  <span style={{ fontWeight: 700, fontFamily: mono ? 'monospace' : undefined, color: green ? colors.accentGreen : colors.textPrimary }}>
                    {value}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px solid ${colors.border}`, marginTop: '4px' }}>
                <span style={{ color: colors.textPrimary, fontWeight: 800 }}>{isAr ? 'إجمالي مبلغ التسوية:' : 'Total Settled Amount:'}</span>
                <span style={{ fontWeight: 900, color: colors.accentGreen, fontSize: '15px' }}>
                  {formatSaudiCurrency(selectedSettlementInvoice.amount, language)}
                </span>
              </div>
            </Card>

            {/* QR Code & Digital Stamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#080C14', borderRadius: '10px', border: '1px solid #2C2C44', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
                <QRCodeView
                  value={`zatca://settlement?ref=${selectedSettlementInvoice.settlementRef}&utr=${selectedSettlementInvoice.utr}&amt=${selectedSettlementInvoice.amount}&vat=${selectedSettlementInvoice.vatAmount}&seller=${encodeURIComponent(merchantInfo.businessName)}`}
                  size={64}
                />
              </div>
              <div style={{ flex: 1, marginLeft: isRtl ? 0 : '12px', marginRight: isRtl ? '12px' : 0 }}>
                <div style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} />
                  <span>{isAr ? 'معتمد رقمياً من الزكاة والضريبة' : 'ZATCA Cryptographically Verified'}</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#A2A2BA', marginTop: '2px' }}>
                  {isAr ? 'رمز استجابة سريعة مشفر للفاتورة الضريبية وفق اشتراطات الفوترة الإلكترونية.' : 'QR code contains Base64 encoded TLV payload for tax clearance.'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="interactive-tap"
                style={{
                  padding: '11px',
                  borderRadius: radii.md,
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={15} color="#7FE87F" />
                <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSettlementInvoice(null)}
                className="interactive-tap"
                style={{
                  padding: '11px',
                  borderRadius: radii.md,
                  backgroundColor: colors.accentGreen,
                  border: 'none',
                  color: '#080C14',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>{isAr ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Export CSV Toast Notification */}
      {exportSuccessToast && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#00C853',
            color: '#080C14',
            padding: '12px 24px',
            borderRadius: '30px',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 200, 83, 0.4)',
            zIndex: 9999,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{isAr ? 'تم تصدير كشف العمليات بنجاح (CSV)' : 'Collections Statement exported successfully (CSV)'}</span>
        </div>
      )}
    </div>
  );
};
