import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Zap,
  ChevronRight,
  QrCode,
  SmartphoneNfc,
  Share2,
  Banknote,
  Building2,
  CreditCard,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, SectionHeader } from '../components/ui';
import { colors } from '../design-system/tokens';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantInfo,
    triggerSettleNow,
    navigateTo,
    openManagerPinModal,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142;
  const avgTicket = (displayTotal / paymentCount).toFixed(2);

  const handleSettleNowClick = () => {
    openManagerPinModal({
      title: isAr ? 'تأكيد التسوية الفورية عبر سريع' : 'Authorize Instant Settlement',
      subtitle: isAr
        ? 'أدخل رمز المدير السري لإتمام الصرف الفوري'
        : 'Enter Manager Security PIN to dispatch Sarie instant payout',
      onSuccess: async () => {
        setIsSettling(true);
        try {
          await triggerSettleNow();
        } finally {
          setIsSettling(false);
        }
      },
    });
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
      {/* 1. Top Enterprise Metric KPI Strip (3 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Metric 1: Today's Total Amount */}
        <Card variant="elevated" style={{ padding: '18px 20px', background: 'linear-gradient(145deg, #111726 0%, #121212 100%)', border: '1px solid rgba(127, 232, 127, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#A2A2BA', fontWeight: 600 }}>
              {isAr ? 'إجمالي اليوم' : "Today's Total"}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setShowBalance(!showBalance)}
                aria-label="Toggle Balance Visibility"
                style={{ background: 'none', border: 'none', color: '#A2A2BA', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <StatusBadge status="success" dot={true} size="sm" label={isAr ? 'مباشر' : 'Live'} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '15px', color: '#7FE87F', fontWeight: 800 }}>{isAr ? 'ر.س' : 'SAR'}</span>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#7FE87F', letterSpacing: '-0.02em' }}>
              {showBalance ? formatLocalizedNumber(displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }), language) : '••••••'}
            </span>
          </div>
        </Card>

        {/* Metric 2: Total Transactions Count */}
        <Card variant="elevated" style={{ padding: '18px 20px', background: '#111726', border: '1px solid #2C2C44' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#A2A2BA', fontWeight: 600 }}>
              {isAr ? 'العمليات' : 'Transactions'}
            </span>
            <TrendingUp size={16} color="#7FE87F" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF' }}>
              {formatLocalizedNumber(paymentCount, language)}
            </span>
            <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
              {isAr ? '+١٨٪' : '+18.4%'}
            </span>
          </div>
        </Card>

        {/* Metric 3: Average Ticket Size */}
        <Card variant="elevated" style={{ padding: '18px 20px', background: '#111726', border: '1px solid #2C2C44' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#A2A2BA', fontWeight: 600 }}>
              {isAr ? 'متوسط العملية' : 'Average Ticket'}
            </span>
            <CreditCard size={16} color="#7FE87F" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '15px', color: '#7FE87F', fontWeight: 800 }}>{isAr ? 'ر.س' : 'SAR'}</span>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {formatLocalizedNumber(avgTicket, language)}
            </span>
          </div>
        </Card>
      </div>

      {/* 2. Main Desktop 2-Column Dashboard Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left Column (65%): Quick Action Hub & Recent Collections Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Accept Payment Action Hub (3 Cards) */}
          <div>
            <SectionHeader title={isAr ? 'طرق الدفع' : 'Payment Channels'} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {/* Tile 1: Show QR */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                style={{
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textAlign: 'center',
                  background: '#111726',
                  border: '1px solid #2C2C44',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(127, 232, 127, 0.14)',
                    border: '1px solid rgba(127, 232, 127, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7FE87F',
                  }}
                >
                  <QrCode size={20} />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'رمز PAY QR' : 'PAY QR'}
                </span>
              </Card>

              {/* Tile 2: SoftPOS Terminal */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('SOFTPOS_TERMINAL')}
                style={{
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textAlign: 'center',
                  background: '#111726',
                  border: '1px solid #2C2C44',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(127, 232, 127, 0.14)',
                    border: '1px solid rgba(127, 232, 127, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7FE87F',
                  }}
                >
                  <SmartphoneNfc size={20} />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'الدفع باللمس' : 'SoftPOS'}
                </span>
              </Card>

              {/* Tile 3: Cash Sale */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                style={{
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textAlign: 'center',
                  background: '#111726',
                  border: '1px solid #2C2C44',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(127, 232, 127, 0.14)',
                    border: '1px solid rgba(127, 232, 127, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7FE87F',
                  }}
                >
                  <Banknote size={20} />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'نقدي' : 'Cash'}
                </span>
              </Card>
            </div>
          </div>

          {/* Recent Collections Live Ledger Table */}
          <Card variant="elevated" style={{ padding: '18px 20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'أحدث التحصيلات' : 'Recent Collections'}
              </h3>

              <button
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                className="interactive-tap"
                style={{
                  backgroundColor: '#182236',
                  border: '1px solid rgba(127, 232, 127, 0.25)',
                  color: '#7FE87F',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                <ChevronRight size={13} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>

            {/* Desktop Table View */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2C2C44', color: '#6E6E85', fontSize: '11.5px', fontWeight: 700 }}>
                    <th style={{ padding: '8px 10px' }}>{isAr ? 'العميل' : 'Customer'}</th>
                    <th style={{ padding: '8px 10px' }}>{isAr ? 'المرجع' : 'Ref'}</th>
                    <th style={{ padding: '8px 10px' }}>{isAr ? 'الوقت' : 'Time'}</th>
                    <th style={{ padding: '8px 10px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '8px 10px', textAlign: isRtl ? 'left' : 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantCollections.slice(0, 5).map((col) => (
                    <tr
                      key={col.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        fontSize: '12.5px',
                      }}
                    >
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '7px',
                              backgroundColor: '#182236',
                              border: '1px solid rgba(127, 232, 127, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 800,
                              color: '#7FE87F',
                            }}
                          >
                            {col.customerMasked ? col.customerMasked.slice(0, 2).toUpperCase() : 'TX'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{col.customerMasked || (isAr ? 'عميل' : 'Customer')}</div>
                            <div style={{ fontSize: '10.5px', color: '#A2A2BA' }}>
                              {isAr
                                ? col.paymentMethod.includes('mada') ? 'مدى'
                                  : col.paymentMethod.includes('apple') ? 'أبل باي'
                                  : col.paymentMethod.includes('zatca') ? 'زاتكا'
                                  : col.paymentMethod.includes('cash') ? 'نقدي'
                                  : 'رابط'
                                : col.paymentMethod.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px', color: '#A2A2BA', fontFamily: 'monospace', fontSize: '11.5px' }}>
                        {col.id}
                      </td>
                      <td style={{ padding: '10px', color: '#A2A2BA', fontSize: '11.5px' }}>
                        {col.date}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <StatusBadge
                          status={col.status === 'settled' ? 'success' : col.status === 'refunded' ? 'warning' : 'neutral'}
                          size="sm"
                          label={col.status === 'settled' ? (isAr ? 'مكتمل' : 'Settled') : (isAr ? 'مستردة' : col.status)}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: isRtl ? 'left' : 'right', fontWeight: 900, color: '#7FE87F' }}>
                        {isAr ? `${formatLocalizedNumber(col.amount.toFixed(2), language)} ر.س` : `SAR ${col.amount.toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (35%): Instant Settlement Station, Store Stand QR & Settlement Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Instant Sarie Payout Station Card */}
          <Card
            variant="elevated"
            style={{
              padding: '20px',
              backgroundColor: '#111726',
              border: '1px solid rgba(127, 232, 127, 0.35)',
              background: 'linear-gradient(145deg, #111726 0%, #111111 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'التسوية الفورية' : 'Instant Payout'}
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  color: '#7FE87F',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  padding: '2px 7px',
                  borderRadius: '5px',
                }}
              >
                Sarie
              </span>
            </div>

            <div style={{ margin: '14px 0', padding: '12px', backgroundColor: '#080C14', borderRadius: '10px', border: '1px solid #2C2C44' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={15} color="#7FE87F" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? (merchantInfo.settlementBank ? (merchantInfo.settlementBank.includes('Rajhi') ? 'مصرف الراجحي' : merchantInfo.settlementBank) : 'مصرف الراجحي') : (merchantInfo.settlementBank || 'Al Rajhi Bank')}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#A2A2BA', fontFamily: 'monospace', marginTop: '3px' }}>
                {merchantInfo.settlementIban || 'SA44 8000 0201 6080 1005 5005'}
              </div>
            </div>

            <button
              onClick={handleSettleNowClick}
              disabled={isSettling}
              className="interactive-tap gold-gradient-btn"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(127, 232, 127, 0.25)',
              }}
            >
              <Zap size={16} fill="#080C14" color="#080C14" />
              <span>
                {isSettling
                  ? (isAr ? 'جاري التحويل...' : 'Processing...')
                  : (isAr ? `تسوية ${formatLocalizedNumber(displayTotal.toFixed(2), language)} ر.س` : `Settle SAR ${displayTotal.toFixed(2)}`)}
              </span>
            </button>
          </Card>

          {/* Store Stand QR Card Preview */}
          <Card variant="elevated" style={{ padding: '20px', textAlign: 'center', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'باركود PAY QR المعتمد' : 'Store PAY QR'}
              </span>
              <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 800 }}>ZATCA Phase 2</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-block',
                margin: '8px auto',
                boxShadow: '0 0 20px rgba(127, 232, 127, 0.14)',
              }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://qtpay-merchant.vercel.app"
                alt="Store QR"
                style={{ width: '150px', height: '150px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#A2A2BA', margin: '10px 0' }}>
              {merchantInfo.businessName || 'GreenLeaf Markets LLC'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} color="#7FE87F" />
                <span>{isAr ? 'تحميل الملصق' : 'Get Poster'}</span>
              </button>

              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#182236',
                  border: '1px solid #2C2C44',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Share2 size={14} color="#7FE87F" />
                <span>{isAr ? 'مشاركة' : 'Share'}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
