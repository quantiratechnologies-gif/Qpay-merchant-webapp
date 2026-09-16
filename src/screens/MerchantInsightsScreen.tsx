import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, MetricTile, StatusBadge } from '../components/ui';
import { colors } from '../design-system/tokens';

export const MerchantInsightsScreen: React.FC = () => {
  const {
    merchantCollections,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');

  const totalVolume = merchantCollections.reduce((sum, c) => sum + (c.status === 'settled' ? c.amount : 0), 0) || 14850.5;
  const settledCount = merchantCollections.filter((c) => c.status === 'settled').length || 142;
  const avgTicket = settledCount > 0 ? (totalVolume / settledCount).toFixed(2) : '104.58';

  const railStats = [
    {
      name: isAr ? 'مدى والبطاقات البنكية (الدفع باللمس)' : 'mada & Contactless Debit Cards',
      shortName: 'mada / Cards',
      percent: 58,
      amount: totalVolume * 0.58,
      color: '#00C853',
      icon: CreditCard,
    },
    {
      name: isAr ? 'أبل باي والمحافظ الرقمية' : 'Apple Pay & Mobile Wallets',
      shortName: 'Apple Pay',
      percent: 24,
      amount: totalVolume * 0.24,
      color: '#3B82F6',
      icon: Smartphone,
    },
    {
      name: isAr ? 'فواتير زاتكا برمز الاستجابة السريع' : 'ZATCA Dynamic QR Invoices',
      shortName: 'ZATCA QR',
      percent: 14,
      amount: totalVolume * 0.14,
      color: '#8B5CF6',
      icon: QrCode,
    },
    {
      name: isAr ? 'سجل المبيعات النقدية' : 'Cash Register Sales',
      shortName: 'Cash',
      percent: 4,
      amount: totalVolume * 0.04,
      color: '#F59E0B',
      icon: Banknote,
    },
  ];

  const hourlyData = [
    { hour: '9A', hourAr: '٩ص', volume: 15, count: 1, isPeak: false },
    { hour: '10A', hourAr: '١٠ص', volume: 30, count: 2, isPeak: false },
    { hour: '11A', hourAr: '١١ص', volume: 100, count: 4, isPeak: true },
    { hour: '12P', hourAr: '١٢م', volume: 85, count: 3, isPeak: true },
    { hour: '1P', hourAr: '١م', volume: 25, count: 2, isPeak: false },
    { hour: '2P', hourAr: '٢م', volume: 35, count: 2, isPeak: false },
    { hour: '3P', hourAr: '٣م', volume: 20, count: 1, isPeak: false },
    { hour: '4P', hourAr: '٤م', volume: 75, count: 3, isPeak: true },
  ];

  const periods = [
    { id: 'today', labelEn: 'Today', labelAr: 'اليوم' },
    { id: 'yesterday', labelEn: 'Yesterday', labelAr: 'أمس' },
    { id: 'week', labelEn: 'Last 7 Days', labelAr: 'آخر ٧ أيام' },
    { id: 'month', labelEn: 'This Month', labelAr: 'هذا الشهر' },
  ];

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
      {/* Header & Date Range Filter Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            {isAr ? 'التحليلات ومؤشرات الأداء المالي' : 'Financial Insights & Analytics'}
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
            {isAr
              ? 'متابعة مسارات التحصيل، ساعات الذروة، والتحليلات الضريبية لمتجرك'
              : 'Track payment rail distributions, peak sales velocity, and tax breakdowns'}
          </p>
        </div>

        {/* Period Selector Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111726', padding: '4px', borderRadius: '10px', border: '1px solid #1E293B' }}>
          {periods.map((p) => {
            const isSelected = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className="interactive-tap"
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#00C853' : 'transparent',
                  color: isSelected ? '#080C14' : '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 800 : 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isAr ? p.labelAr : p.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <MetricTile
          title={isAr ? 'إجمالي المبيعات' : 'TOTAL SALES'}
          value={`SAR ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          trend={{ value: '+18.4%', isPositive: true }}
          subtitle={isAr ? 'مقارنة بالفترة السابقة' : 'vs prior period'}
          highlightGreen={true}
          icon={<StatusBadge status="success" dot={true} size="sm" label={isAr ? 'مباشر' : 'Live'} />}
        />

        <MetricTile
          title={isAr ? 'متوسط قيمة العملية' : 'AVG TICKET'}
          value={`SAR ${avgTicket}`}
          trend={{ value: '+4.2%', isPositive: true }}
          subtitle={isAr ? `${settledCount} عملية مسجلة` : `${settledCount} collections logged`}
        />

        <MetricTile
          title={isAr ? 'الرصيد المتاح للتسوية' : 'SETTLEMENT'}
          value={`SAR ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={isAr ? 'جاهز للتحويل الفوري' : 'Ready for Sarie rail'}
          icon={<StatusBadge status="success" size="sm" label={isAr ? 'سريع ٢٤/٧' : 'Sarie 24/7'} />}
          highlightGreen={true}
        />
      </div>

      {/* 2-Column Visual Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Payment Rail Distribution Breakdown */}
        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'توزيع قنوات وطرق الدفع' : 'Payment Rail Distribution'}
            </span>
            <span style={{ fontSize: '12px', color: '#00C853', fontWeight: 700 }}>
              {isAr ? '١٠٠٪ رقمي' : '100% Digital'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {railStats.map((rail, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700 }}>
                    <rail.icon size={16} color={rail.color} />
                    <span>{rail.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '12px' }}>SAR {rail.amount.toFixed(2)}</span>
                    <span style={{ color: rail.color, fontWeight: 800 }}>{rail.percent}%</span>
                  </div>
                </div>

                {/* Progress Track Bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#111726', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${rail.percent}%`,
                      height: '100%',
                      backgroundColor: rail.color,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Hourly Velocity Activity Visualizer */}
        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'ساعات الذروة والنشاط' : 'Hourly Transaction Velocity'}
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              {isAr ? 'الذروة: ١١ ص - ١٢ م' : 'Peak: 11 AM - 12 PM'}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '160px',
              padding: '16px 8px 8px 8px',
              backgroundColor: '#080C14',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              marginBottom: '16px',
            }}
          >
            {hourlyData.map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: `${Math.max(12, (d.volume / 100) * 110)}px`,
                    backgroundColor: d.isPeak ? '#00C853' : '#1E293B',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '11px', color: d.isPeak ? '#00C853' : '#64748B', fontWeight: d.isPeak ? 800 : 600 }}>
                  {isAr ? d.hourAr : d.hour}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #1E293B' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              {isAr ? 'مستودع التحصيلات المباشر' : 'Full Historical Ledger'}
            </div>
            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#00C853',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'عرض كشف الحساب ←' : 'View Full Ledger →'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
