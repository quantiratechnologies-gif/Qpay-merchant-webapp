import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { Card, MetricTile, StatusBadge, PieChart } from '../components/ui';
import { formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';

type PeriodType = 'today' | 'week' | 'month' | 'year';

export const MerchantInsightsScreen: React.FC = () => {
  const {
    merchantCollections,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('today');

  const liveTodayTotal = merchantCollections.reduce(
    (sum, c) => sum + (c.status === 'settled' ? c.amount : 0),
    0
  ) || 2392.50;
  const liveTodayCount = merchantCollections.filter((c) => c.status === 'settled').length || 8;

  // Rich, realistic dynamic data for each requested timeframe: today, week, month, year
  const periodData = {
    today: {
      totalVolume: liveTodayTotal,
      settledCount: liveTodayCount,
      avgTicket: liveTodayTotal / liveTodayCount,
      trendSales: '+18.4%',
      trendTicket: '+4.2%',
      priorPeriodLabel: isAr ? 'مقارنة بأمس' : 'vs yesterday',
      settlementStatusLabel: isAr ? 'جاهز للتحويل' : 'Ready to settle',
      settlementBadgeLabel: isAr ? 'سريع' : 'Sarie',
      activityTitle: isAr ? 'النشاط بالساعات' : 'Hourly Activity',
      activityPeak: isAr ? 'الذروة: ١١ ص - ١٢ م' : 'Peak: 11 AM - 12 PM',
      distribution: [
        { shortName: isAr ? 'مدى / بطاقات' : 'mada / Cards', percent: 58, color: '#7FE87F' },
        { shortName: 'Apple Pay', percent: 24, color: '#98F598' },
        { shortName: isAr ? 'رمز PAY QR' : 'PAY QR', percent: 14, color: '#C59B27' },
        { shortName: isAr ? 'نقدي' : 'Cash', percent: 4, color: '#8C6D1F' },
      ],
      chartData: [
        { label: '9A', labelAr: '٩ص', volume: 15, isPeak: false },
        { label: '10A', labelAr: '١٠ص', volume: 30, isPeak: false },
        { label: '11A', labelAr: '١١ص', volume: 100, isPeak: true },
        { label: '12P', labelAr: '١٢م', volume: 85, isPeak: true },
        { label: '1P', labelAr: '١م', volume: 25, isPeak: false },
        { label: '2P', labelAr: '٢م', volume: 35, isPeak: false },
        { label: '3P', labelAr: '٣م', volume: 20, isPeak: false },
        { label: '4P', labelAr: '٤م', volume: 75, isPeak: true },
      ],
    },
    week: {
      totalVolume: 18450.00,
      settledCount: 62,
      avgTicket: 297.58,
      trendSales: '+12.8%',
      trendTicket: '+6.1%',
      priorPeriodLabel: isAr ? 'مقارنة بالأسبوع الماضي' : 'vs last week',
      settlementStatusLabel: isAr ? 'تمت التسوية آلياً عبر سريع' : 'Auto settled via Sarie',
      settlementBadgeLabel: isAr ? 'مكتملة' : 'Settled',
      activityTitle: isAr ? 'النشاط اليومي خلال الأسبوع' : 'Daily Activity (This Week)',
      activityPeak: isAr ? 'الذروة: الخميس والجمعة' : 'Peak: Thursday & Friday',
      distribution: [
        { shortName: isAr ? 'مدى / بطاقات' : 'mada / Cards', percent: 62, color: '#7FE87F' },
        { shortName: 'Apple Pay', percent: 26, color: '#98F598' },
        { shortName: isAr ? 'رمز PAY QR' : 'PAY QR', percent: 9, color: '#C59B27' },
        { shortName: isAr ? 'نقدي' : 'Cash', percent: 3, color: '#8C6D1F' },
      ],
      chartData: [
        { label: 'Sun', labelAr: 'أحد', volume: 40, isPeak: false },
        { label: 'Mon', labelAr: 'اثن', volume: 55, isPeak: false },
        { label: 'Tue', labelAr: 'ثلا', volume: 50, isPeak: false },
        { label: 'Wed', labelAr: 'أرب', volume: 65, isPeak: false },
        { label: 'Thu', labelAr: 'خمي', volume: 100, isPeak: true },
        { label: 'Fri', labelAr: 'جمع', volume: 92, isPeak: true },
        { label: 'Sat', labelAr: 'سبت', volume: 70, isPeak: false },
      ],
    },
    month: {
      totalVolume: 78920.00,
      settledCount: 284,
      avgTicket: 277.89,
      trendSales: '+24.6%',
      trendTicket: '+8.3%',
      priorPeriodLabel: isAr ? 'مقارنة بالشهر الماضي' : 'vs last month',
      settlementStatusLabel: isAr ? 'حساب الراجحي' : 'Settled to Al Rajhi',
      settlementBadgeLabel: isAr ? 'سريع' : 'Sarie',
      activityTitle: isAr ? 'النشاط الأسبوعي خلال الشهر' : 'Weekly Activity (This Month)',
      activityPeak: isAr ? 'الذروة: الأسبوع الرابع (الرواتب)' : 'Peak: Week 4 (Payday)',
      distribution: [
        { shortName: isAr ? 'مدى / بطاقات' : 'mada / Cards', percent: 65, color: '#7FE87F' },
        { shortName: 'Apple Pay', percent: 23, color: '#98F598' },
        { shortName: isAr ? 'رمز PAY QR' : 'PAY QR', percent: 10, color: '#C59B27' },
        { shortName: isAr ? 'نقدي' : 'Cash', percent: 2, color: '#8C6D1F' },
      ],
      chartData: [
        { label: 'W1', labelAr: 'أ١', volume: 60, isPeak: false },
        { label: 'W2', labelAr: 'أ٢', volume: 72, isPeak: false },
        { label: 'W3', labelAr: 'أ٣', volume: 78, isPeak: false },
        { label: 'W4', labelAr: 'أ٤', volume: 100, isPeak: true },
      ],
    },
    year: {
      totalVolume: 892400.00,
      settledCount: 3180,
      avgTicket: 280.63,
      trendSales: '+38.2%',
      trendTicket: '+11.5%',
      priorPeriodLabel: isAr ? 'مقارنة بالعام الماضي' : 'vs last year',
      settlementStatusLabel: isAr ? 'إجمالي تحويلات سريع' : 'Dispatched via Sarie',
      settlementBadgeLabel: isAr ? 'معتمد' : 'Verified',
      activityTitle: isAr ? 'النشاط الشهري خلال السنة' : 'Monthly Activity (This Year)',
      activityPeak: isAr ? 'الذروة: مارس وسبتمبر' : 'Peak: Ramadan & National Day',
      distribution: [
        { shortName: isAr ? 'مدى / بطاقات' : 'mada / Cards', percent: 68, color: '#7FE87F' },
        { shortName: 'Apple Pay', percent: 22, color: '#98F598' },
        { shortName: isAr ? 'رمز PAY QR' : 'PAY QR', percent: 8, color: '#C59B27' },
        { shortName: isAr ? 'نقدي' : 'Cash', percent: 2, color: '#8C6D1F' },
      ],
      chartData: [
        { label: 'Jan', labelAr: 'ينا', volume: 55, isPeak: false },
        { label: 'Feb', labelAr: 'فبر', volume: 60, isPeak: false },
        { label: 'Mar', labelAr: 'مار', volume: 95, isPeak: true },
        { label: 'Apr', labelAr: 'أبر', volume: 70, isPeak: false },
        { label: 'May', labelAr: 'ماي', volume: 65, isPeak: false },
        { label: 'Jun', labelAr: 'يون', volume: 58, isPeak: false },
        { label: 'Jul', labelAr: 'يول', volume: 50, isPeak: false },
        { label: 'Aug', labelAr: 'أغس', volume: 72, isPeak: false },
        { label: 'Sep', labelAr: 'سبت', volume: 100, isPeak: true },
        { label: 'Oct', labelAr: 'أكت', volume: 80, isPeak: false },
        { label: 'Nov', labelAr: 'نوف', volume: 85, isPeak: false },
        { label: 'Dec', labelAr: 'ديس', volume: 90, isPeak: true },
      ],
    },
  };

  const current = periodData[selectedPeriod];

  const pieData = current.distribution.map((r) => ({
    name: r.shortName,
    value: Math.round(current.totalVolume * (r.percent / 100)),
    percentage: r.percent,
    color: r.color,
  }));

  const periods: { id: PeriodType; labelEn: string; labelAr: string }[] = [
    { id: 'today', labelEn: 'Today', labelAr: 'اليوم' },
    { id: 'week', labelEn: 'Week', labelAr: 'الأسبوع' },
    { id: 'month', labelEn: 'Month', labelAr: 'الشهر' },
    { id: 'year', labelEn: 'Year', labelAr: 'السنة' },
  ];

  return (
    <div className="w-full text-white select-none space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header & Date Range Filter Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isAr ? 'التحليلات المالية' : 'Analytics'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAr ? 'مؤشرات المبيعات وساعات الذروة' : 'Sales performance and peak volume'}
          </p>
        </div>

        {/* Period Selector Chips: Today, Week, Month, Year */}
        <div className="flex items-center gap-1.5 bg-[#111726] p-1 rounded-xl border border-[#2C2C44]">
          {periods.map((p) => {
            const isSelected = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7FE87F] to-[#98F598] text-[#080C14] font-black shadow-sm shadow-[#7FE87F]/30'
                    : 'bg-transparent text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? p.labelAr : p.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricTile
          title={isAr ? 'إجمالي المبيعات' : 'TOTAL SALES'}
          value={formatSaudiCurrency(current.totalVolume, language)}
          trend={{ value: current.trendSales, isPositive: true }}
          subtitle={current.priorPeriodLabel}
          highlightGreen={true}
          icon={<StatusBadge status="success" dot={true} size="sm" label={isAr ? 'مباشر' : 'Live'} />}
        />

        <MetricTile
          title={isAr ? 'متوسط العملية' : 'AVG TICKET'}
          value={formatSaudiCurrency(current.avgTicket, language)}
          trend={{ value: current.trendTicket, isPositive: true }}
          subtitle={isAr ? `${formatLocalizedNumber(current.settledCount, language)} عملية` : `${current.settledCount.toLocaleString()} transactions`}
        />

        <MetricTile
          title={isAr ? 'الرصيد المتاح' : 'SETTLEMENT'}
          value={formatSaudiCurrency(current.totalVolume, language)}
          subtitle={current.settlementStatusLabel}
          icon={<StatusBadge status="success" size="sm" label={current.settlementBadgeLabel} />}
          highlightGreen={true}
        />
      </div>

      {/* 2-Column Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Donut Pie Chart & Payment Rail Distribution */}
        <Card className="p-6 bg-[#111726] border border-[#2C2C44]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">
              {isAr ? 'طرق الدفع' : 'Payment Methods'}
            </span>
            <span className="text-xs text-[#7FE87F] font-bold">
              {isAr ? '١٠٠٪ رقمي' : '100% Digital'}
            </span>
          </div>

          {/* Interactive Pie Chart */}
          <PieChart
            data={pieData}
            centerValue={formatSaudiCurrency(current.totalVolume, language)}
            centerLabel={isAr ? 'الإجمالي' : 'Total'}
            valuePrefix=""
            size={170}
          />
        </Card>

        {/* Right Column: Velocity Activity Visualizer */}
        <Card className="p-6 bg-[#111726] border border-[#2C2C44]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">
              {current.activityTitle}
            </span>
            <span className="text-xs text-slate-400">
              {current.activityPeak}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between h-44 p-4 bg-[#080C14] rounded-xl border border-[#2C2C44] mb-4 gap-1 sm:gap-2">
            {current.chartData.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div
                  style={{ height: `${Math.max(12, (d.volume / 100) * 110)}px` }}
                  className={`w-3 sm:w-5 md:w-6 rounded-md transition-all duration-300 ${
                    d.isPeak ? 'bg-[#7FE87F] shadow-sm shadow-[#7FE87F]/40' : 'bg-[#2C2C44]'
                  }`}
                />
                <span className={`text-[10.5px] font-bold ${d.isPeak ? 'text-[#7FE87F]' : 'text-slate-500'}`}>
                  {isAr ? d.labelAr : d.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#2C2C44]">
            <div className="text-xs text-slate-400">
              {isAr ? 'سجل العمليات' : 'Transactions'}
            </div>
            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="text-xs font-bold text-[#7FE87F] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{isAr ? '← عرض الكل' : 'View All →'}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default MerchantInsightsScreen;
