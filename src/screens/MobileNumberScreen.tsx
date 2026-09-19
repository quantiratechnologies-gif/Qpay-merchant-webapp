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
      <div className="mb-5 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'تسجيل الدخول' : 'Sign In'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isAr ? 'أدخل بياناتك للمتابعة' : 'Enter your details to continue'}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleContinue} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-start">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            {isAr ? 'اسم التاجر' : 'Name'}
          </label>
          <div className="relative flex items-center">
            <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#7FE87F] pointer-events-none`} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'فهد الحربي' : 'Fahad Al-Harbi'}
              required
              className={`w-full h-11 bg-[#151524] border border-[#2C2C44] rounded-xl text-sm font-semibold text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Business Phone */}
        <div className="space-y-1.5 text-start">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            {isAr ? 'رقم الجوال' : 'Mobile Number'}
          </label>
          <div className="flex items-center h-11 bg-[#151524] border border-[#2C2C44] rounded-xl px-3 focus-within:border-[#7FE87F] transition-colors">
            <Phone className="h-4 w-4 text-[#7FE87F] flex-shrink-0" />
            <div className={`text-xs font-bold text-[#A2A2BA] px-2 ${isRtl ? 'border-l border-[#3A3A52]' : 'border-r border-[#3A3A52]'}`}>
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
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('fahad')}
              className="px-2.5 py-2 rounded-lg bg-[#151524] border border-[#2C2C44] text-neutral-300 hover:text-white hover:border-[#7FE87F]/40 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-[#7FE87F]" />
              <span>{isAr ? 'متجر المدينة' : 'Store 1'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('sara')}
              className="px-2.5 py-2 rounded-lg bg-[#151524] border border-[#2C2C44] text-neutral-300 hover:text-white hover:border-[#7FE87F]/40 transition-colors text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-[#7FE87F]" />
              <span>{isAr ? 'مقهى الرياض' : 'Store 2'}</span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#7FE87F] via-[#98F598] to-[#5FBF5F] text-[#080C14] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7FE87F]/25 cursor-pointer"
        >
          <span>{isAr ? 'متابعة' : 'Continue'}</span>
          <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>

        {/* Create Account Option */}
        <div className="pt-2 text-center">
          <div className="text-xs text-[#A2A2BA]">
            {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => navigateTo('MERCHANT_REGISTER')}
              className="text-[#7FE87F] font-bold hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
            >
              <span>{isAr ? 'تسجيل جديد' : 'Sign Up'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default MobileNumberScreen;
