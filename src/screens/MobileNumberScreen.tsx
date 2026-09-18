import React, { useState } from 'react';
import { ArrowRight, User, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>(user.name || (isAr ? 'فهد الحربي' : 'Fahad Al-Harbi'));
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');

  const isFormValid = mobileNumber.length >= 9 && fullName.trim().length > 0;

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isFormValid) {
      setUserRole('merchant');
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName });
    }
  };

  const handleDemoFill = (type: 'fahad' | 'sara') => {
    if (type === 'fahad') {
      setFullName(isAr ? 'فهد الحربي' : 'Fahad Al-Harbi');
      setMobileNumber('501234567');
    } else {
      setFullName(isAr ? 'سارة الغامدي' : 'Sara Al-Ghamdi');
      setMobileNumber('559876543');
    }
  };

  return (
    <div className="w-full text-white flex flex-col select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'تسجيل دخول التاجر' : 'Merchant Sign In'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isAr ? 'إدارة نقاط البيع، المبيعات والتحصيلات اليومية' : 'Manage your SoftPOS, sales & instant daily settlements'}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleContinue} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-start">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {isAr ? 'اسم التاجر / المفوض' : 'Merchant / Manager Name'}
          </label>
          <div className="relative flex items-center">
            <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#00FF24] pointer-events-none`} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'فهد الحربي' : 'Fahad Al-Harbi'}
              required
              className={`w-full h-11 bg-[#10182A] border border-slate-800 rounded-xl text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Business Phone */}
        <div className="space-y-1.5 text-start">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {isAr ? 'رقم الجوال المعتمد' : 'Registered Mobile Number'}
          </label>
          <div className="flex items-center h-11 bg-[#10182A] border border-slate-800 rounded-xl px-3 focus-within:border-[#00FF24] transition-colors">
            <Phone className="h-4 w-4 text-[#00FF24] flex-shrink-0" />
            <div className={`text-xs font-bold text-slate-400 px-2 ${isRtl ? 'border-l border-slate-700' : 'border-r border-slate-700'}`}>
              +966
            </div>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="50 123 4567"
              maxLength={10}
              required
              className="w-full bg-transparent border-none outline-none text-sm font-bold text-white px-2 tracking-wider"
              dir="ltr"
            />
          </div>
        </div>

        {/* 1-Click Fast Demo Fill Buttons */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-start">
            {isAr ? 'حسابات تجريبية سريعة للمعاينة' : 'Quick Demo Profiles for QA'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('fahad')}
              className="px-2.5 py-2 rounded-lg bg-[#10182A] border border-slate-800 text-slate-300 hover:text-white hover:border-[#00FF24]/40 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-[#00FF24]" />
              <span>{isAr ? 'سوبرماركت المدينة' : 'Al-Madinah Supermarket'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('sara')}
              className="px-2.5 py-2 rounded-lg bg-[#10182A] border border-slate-800 text-slate-300 hover:text-white hover:border-[#00FF24]/40 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-[#00FF24]" />
              <span>{isAr ? 'مقهى الرياض' : 'Riyadh Retail Cafe'}</span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full h-11 mt-2 rounded-xl bg-[#00FF24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#00FF24]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00FF24]/20 cursor-pointer"
        >
          <span>{isAr ? 'متابعة وتسجيل الدخول' : 'Continue to Verification'}</span>
          <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>

        {/* Create Account Option */}
        <div className="pt-2 text-center">
          <div className="text-xs text-slate-400">
            {isAr ? 'ليس لديك حساب منشأة؟' : "Don't have a merchant account?"}{' '}
            <button
              type="button"
              onClick={() => navigateTo('MERCHANT_REGISTER')}
              className="text-[#00FF24] font-bold hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
            >
              <span>{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default MobileNumberScreen;
