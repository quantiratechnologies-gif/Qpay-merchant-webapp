import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronRight,
  QrCode,
  SmartphoneNfc,
  Banknote,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, SectionHeader } from '../components/ui';
import { colors } from '../design-system/tokens';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantCollections,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const [showBalance, setShowBalance] = useState(true);

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142;
  const avgTicket = (displayTotal / paymentCount).toFixed(2);

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

      {/* 2. Main Dashboard Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Accept Payment Action Hub (3 Cards) */}
        <div>
          <SectionHeader title={isAr ? 'طرق الدفع' : 'Payment Channels'} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {/* Tile 1: Show QR */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              style={{
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                textAlign: 'center',
                background: '#111726',
                border: '1px solid #2C2C44',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7FE87F',
                }}
              >
                <QrCode size={22} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'رمز PAY QR' : 'PAY QR'}
              </span>
            </Card>

            {/* Tile 2: SoftPOS Terminal */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              style={{
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                textAlign: 'center',
                background: '#111726',
                border: '1px solid #2C2C44',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7FE87F',
                }}
              >
                <SmartphoneNfc size={22} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'الدفع باللمس' : 'SoftPOS'}
              </span>
            </Card>

            {/* Tile 3: Cash Sale */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              style={{
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                textAlign: 'center',
                background: '#111726',
                border: '1px solid #2C2C44',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.14)',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7FE87F',
                }}
              >
                <Banknote size={22} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'نقدي' : 'Cash'}
              </span>
            </Card>
          </div>
        </div>

        {/* Recent Collections Live Ledger Table */}
        <Card variant="elevated" style={{ padding: '20px 22px', background: '#111726', border: '1px solid #2C2C44' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
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
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
              <ChevronRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>

          {/* Desktop Table View */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2C2C44', color: '#6E6E85', fontSize: '12px', fontWeight: 700 }}>
                  <th style={{ padding: '10px 12px' }}>{isAr ? 'العميل' : 'Customer'}</th>
                  <th style={{ padding: '10px 12px' }}>{isAr ? 'المرجع' : 'Ref'}</th>
                  <th style={{ padding: '10px 12px' }}>{isAr ? 'الوقت' : 'Time'}</th>
                  <th style={{ padding: '10px 12px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '10px 12px', textAlign: isRtl ? 'left' : 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {merchantCollections.slice(0, 6).map((col) => (
                  <tr
                    key={col.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '13px',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#182236',
                            border: '1px solid rgba(127, 232, 127, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 800,
                            color: '#7FE87F',
                          }}
                        >
                          {col.customerMasked ? col.customerMasked.slice(0, 2).toUpperCase() : 'TX'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{col.customerMasked || (isAr ? 'عميل' : 'Customer')}</div>
                          <div style={{ fontSize: '11px', color: '#A2A2BA' }}>
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
                    <td style={{ padding: '12px', color: '#A2A2BA', fontFamily: 'monospace', fontSize: '12px' }}>
                      {col.id}
                    </td>
                    <td style={{ padding: '12px', color: '#A2A2BA', fontSize: '12px' }}>
                      {col.date}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <StatusBadge
                        status={col.status === 'settled' ? 'success' : col.status === 'refunded' ? 'warning' : 'neutral'}
                        size="sm"
                        label={col.status === 'settled' ? (isAr ? 'مكتمل' : 'Settled') : (isAr ? 'مستردة' : col.status)}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: isRtl ? 'left' : 'right', fontWeight: 900, color: '#7FE87F' }}>
                      {isAr ? `${formatLocalizedNumber(col.amount.toFixed(2), language)} ر.س` : `SAR ${col.amount.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MerchantHomeScreen;
