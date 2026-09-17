import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Banknote
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, MetricTile, StatusBadge, PieChart } from '../components/ui';

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
      name: isAr ? 'مدى والبطاقات البنكية' : 'mada & Contactless Debit',
      shortName: 'mada / Cards',
      percent: 58,
      amount: totalVolume * 0.58,
      color: '#00FF24',
      icon: CreditCard,
    },
    {
      name: isAr ? 'أبل باي والمحافظ الرقمية' : 'Apple Pay & Wallets',
      shortName: 'Apple Pay',
      percent: 24,
      amount: totalVolume * 0.24,
      color: '#38BDF8',
      icon: Smartphone,
    },
    {
      name: isAr ? 'فواتير زاتكا QR' : 'ZATCA Dynamic QR',
      shortName: 'ZATCA QR',
      percent: 14,
      amount: totalVolume * 0.14,
      color: '#A855F7',
      icon: QrCode,
    },
    {
      name: isAr ? 'سجل المبيعات النقدية' : 'Cash Register',
      shortName: 'Cash',
      percent: 4,
      amount: totalVolume * 0.04,
      color: '#F59E0B',
      icon: Banknote,
    },
  ];

  const pieData = railStats.map((r) => ({
    name: r.shortName,
    value: Math.round(r.amount),
    percentage: r.percent,
    color: r.color,
  }));

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
    <div className="w-full text-white select-none space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header & Date Range Filter Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isAr ? 'التحليلات ومؤشرات الأداء المالي' : 'Financial Insights & Analytics'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'متابعة مسارات التحصيل، ساعات الذروة، والتحليلات الضريبية لمتجرك'
              : 'Track payment rail distributions, peak sales velocity, and tax breakdowns'}
          </p>
        </div>

        {/* Period Selector Chips */}
        <div className="flex items-center gap-1.5 bg-[#0E1526] p-1 rounded-xl border border-slate-800">
          {periods.map((p) => {
            const isSelected = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#00FF24] text-black shadow-sm shadow-[#00FF24]/20'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Donut Pie Chart & Payment Rail Distribution */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">
              {isAr ? 'توزيع قنوات وطرق الدفع' : 'Payment Rail Distribution'}
            </span>
            <span className="text-xs text-[#00FF24] font-bold">
              {isAr ? '١٠٠٪ رقمي' : '100% Digital'}
            </span>
          </div>

          {/* Interactive Pie Chart */}
          <PieChart
            data={pieData}
            centerValue={`SAR ${(totalVolume / 1000).toFixed(1)}k`}
            centerLabel={isAr ? 'إجمالي المبيعات' : 'Total Volume'}
            valuePrefix="SAR "
            size={170}
          />
        </Card>

        {/* Right Column: Hourly Velocity Activity Visualizer */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">
              {isAr ? 'ساعات الذروة والنشاط' : 'Hourly Transaction Velocity'}
            </span>
            <span className="text-xs text-slate-400">
              {isAr ? 'الذروة: ١١ ص - ١٢ م' : 'Peak: 11 AM - 12 PM'}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between h-44 p-4 bg-[#080C14] rounded-xl border border-slate-800 mb-4">
            {hourlyData.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div
                  style={{ height: `${Math.max(12, (d.volume / 100) * 110)}px` }}
                  className={`w-4 sm:w-6 rounded-md transition-all duration-300 ${
                    d.isPeak ? 'bg-[#00FF24] shadow-sm shadow-[#00FF24]/40' : 'bg-slate-800'
                  }`}
                />
                <span className={`text-[11px] font-bold ${d.isPeak ? 'text-[#00FF24]' : 'text-slate-500'}`}>
                  {isAr ? d.hourAr : d.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {isAr ? 'مستودع التحصيلات المباشر' : 'Full Historical Ledger'}
            </div>
            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="text-xs font-bold text-[#00FF24] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{isAr ? 'عرض كشف الحساب ←' : 'View Full Ledger →'}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default MerchantInsightsScreen;
