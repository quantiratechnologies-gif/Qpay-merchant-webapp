import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, User, Phone, Sparkles, ChevronDown, Search } from 'lucide-react';
import { useApp } from '../state/AppContext';

export interface CountryCodeOption {
  code: string;
  countryEn: string;
  countryAr: string;
  flag: string;
  placeholder: string;
  maxDigits: number;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: '+966', countryEn: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', flag: '🇸🇦', placeholder: '50 123 4567', maxDigits: 9 },
  { code: '+971', countryEn: 'UAE', countryAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', placeholder: '50 123 4567', maxDigits: 9 },
  { code: '+965', countryEn: 'Kuwait', countryAr: 'الكويت', flag: '🇰🇼', placeholder: '90 123 456', maxDigits: 8 },
  { code: '+973', countryEn: 'Bahrain', countryAr: 'البحرين', flag: '🇧🇭', placeholder: '36 123 456', maxDigits: 8 },
  { code: '+974', countryEn: 'Qatar', countryAr: 'قطر', flag: '🇶🇦', placeholder: '33 123 456', maxDigits: 8 },
  { code: '+968', countryEn: 'Oman', countryAr: 'عمان', flag: '🇴🇲', placeholder: '91 123 456', maxDigits: 8 },
  { code: '+20', countryEn: 'Egypt', countryAr: 'مصر', flag: '🇪🇬', placeholder: '10 1234 5678', maxDigits: 10 },
  { code: '+962', countryEn: 'Jordan', countryAr: 'الأردن', flag: '🇯🇴', placeholder: '79 123 4567', maxDigits: 9 },
  { code: '+91', countryEn: 'India', countryAr: 'الهند', flag: '🇮🇳', placeholder: '98765 43210', maxDigits: 10 },
  { code: '+1', countryEn: 'United States / Canada', countryAr: 'أمريكا / كندا', flag: '🇺🇸', placeholder: '555 123 4567', maxDigits: 10 },
  { code: '+44', countryEn: 'United Kingdom', countryAr: 'المملكة المتحدة', flag: '🇬🇧', placeholder: '7911 123456', maxDigits: 10 },
  { code: '+92', countryEn: 'Pakistan', countryAr: 'باكستان', flag: '🇵🇰', placeholder: '300 1234567', maxDigits: 10 },
  { code: '+880', countryEn: 'Bangladesh', countryAr: 'بنغلاديش', flag: '🇧🇩', placeholder: '1712 345678', maxDigits: 10 },
  { code: '+63', countryEn: 'Philippines', countryAr: 'الفلبين', flag: '🇵🇭', placeholder: '917 123 4567', maxDigits: 10 },
  { code: '+90', countryEn: 'Turkey', countryAr: 'تركيا', flag: '🇹🇷', placeholder: '532 123 4567', maxDigits: 10 },
  { code: '+60', countryEn: 'Malaysia', countryAr: 'ماليزيا', flag: '🇲🇾', placeholder: '12 345 6789', maxDigits: 10 },
  { code: '+62', countryEn: 'Indonesia', countryAr: 'إندونيسيا', flag: '🇮🇩', placeholder: '812 3456 7890', maxDigits: 11 },
];

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';

  // Empty by default for user to enter
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeOption>(COUNTRY_CODES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchCountry, setSearchCountry] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cleanDigits = mobileNumber.replace(/\D/g, '');
  const normalizedDigits = selectedCountry.code === '+966' && cleanDigits.startsWith('0')
    ? cleanDigits.slice(1)
    : cleanDigits;

  const isSaudiPhoneValid = /^5\d{8}$/.test(normalizedDigits);
  const isPhoneValid = selectedCountry.code === '+966' ? isSaudiPhoneValid : cleanDigits.length >= 7;
  const isFormValid = isPhoneValid && fullName.trim().length >= 2;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isFormValid) {
      setUserRole('merchant');
      const formattedPhone = `${selectedCountry.code} ${normalizedDigits}`;
      updateUser({ name: fullName.trim(), mobile: formattedPhone });
      navigateTo('SMS_OTP', {
        mobile: normalizedDigits,
        countryCode: selectedCountry.code,
        fullMobile: formattedPhone,
        name: fullName.trim(),
      });
    }
  };

  const handleDemoFill = (type: 'fahad' | 'sara') => {
    const saudiOption = COUNTRY_CODES.find((c) => c.code === '+966') || COUNTRY_CODES[0];
    setSelectedCountry(saudiOption);
    if (type === 'fahad') {
      setFullName(isAr ? 'فهد الحربي' : 'Fahad Al-Harbi');
      setMobileNumber('501234567');
    } else {
      setFullName(isAr ? 'سارة الغامدي' : 'Sara Al-Ghamdi');
      setMobileNumber('559876543');
    }
  };

  const filteredCountries = COUNTRY_CODES.filter((c) => {
    const q = searchCountry.toLowerCase();
    return (
      c.countryEn.toLowerCase().includes(q) ||
      c.countryAr.includes(q) ||
      c.code.includes(q)
    );
  });

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
              placeholder={isAr ? 'مثال: فهد الحربي' : 'e.g. Fahad Al-Harbi'}
              required
              className={`w-full h-11 bg-[#151524] border border-[#2C2C44] rounded-xl text-sm font-semibold text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'
              }`}
            />
          </div>
        </div>

        {/* Business Phone with Country Code Picker */}
        <div className="space-y-1.5 text-start">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            {isAr ? 'رقم الجوال' : 'Mobile Number'}
          </label>
          <div className="relative flex items-center h-11 bg-[#151524] border border-[#2C2C44] rounded-xl px-2 focus-within:border-[#7FE87F] transition-colors">
            <Phone className="h-4 w-4 text-[#7FE87F] flex-shrink-0 ml-1 mr-1" />

            {/* Country Selector Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 h-8 px-2 rounded-lg bg-[#111726]/80 hover:bg-[#2C2C44]/80 text-xs font-bold text-white transition-colors cursor-pointer ${
                  isRtl ? 'border-l border-[#3A3A52] ml-1' : 'border-r border-[#3A3A52] mr-1'
                }`}
              >
                <span className="text-sm leading-none">{selectedCountry.flag}</span>
                <span className="text-[#7FE87F] font-mono font-bold" dir="ltr">
                  {selectedCountry.code}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-[#A2A2BA] transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Popover Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 ${
                    isRtl ? 'right-0' : 'left-0'
                  } w-72 bg-[#111726] border border-[#2C2C44] rounded-xl shadow-2xl shadow-black/95 p-2 z-50 text-start animate-fadeIn`}
                >
                  <div className="relative mb-2">
                    <Search
                      className={`absolute ${
                        isRtl ? 'right-2.5' : 'left-2.5'
                      } top-2.5 h-3.5 w-3.5 text-[#6E6E85]`}
                    />
                    <input
                      type="text"
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      placeholder={isAr ? 'بحث عن دولة أو رمز...' : 'Search country or code...'}
                      className={`w-full h-8 bg-[#151524] border border-[#2C2C44] rounded-lg text-xs text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] ${
                        isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                      }`}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code + country.countryEn}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsDropdownOpen(false);
                          setSearchCountry('');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          selectedCountry.code === country.code
                            ? 'bg-[#7FE87F]/15 text-[#7FE87F] font-bold border border-[#7FE87F]/30'
                            : 'text-neutral-300 hover:bg-[#151524] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base leading-none">{country.flag}</span>
                          <span className="truncate">
                            {isAr ? country.countryAr : country.countryEn}
                          </span>
                        </div>
                        <span className="font-mono text-[#A2A2BA] text-[11px] ml-2 shrink-0" dir="ltr">
                          {country.code}
                        </span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="text-[11px] text-[#6E6E85] text-center py-3">
                        {isAr ? 'لم يتم العثور على نتائج' : 'No country found'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder={selectedCountry.placeholder}
              maxLength={selectedCountry.code === '+966' ? 10 : selectedCountry.maxDigits}
              required
              className="w-full bg-transparent border-none outline-none text-sm font-bold text-white px-2 tracking-wider placeholder-[#6E6E85]"
              dir="ltr"
            />
          </div>
        </div>

        {/* 1-Click Fast Demo Fill Buttons (DEV & Mock Auth only) */}
        {import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true' && (
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
        )}

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

