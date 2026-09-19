import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileText,
  Hash,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Tag,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import { useApp } from '../state/AppContext';

const BUSINESS_TYPES = [
  { en: 'Sole Proprietorship (Establishment)', ar: 'مؤسسة فردية' },
  { en: 'Limited Liability Company (LLC)', ar: 'شركة ذات مسؤولية محدودة (ش.ذ.م.م)' },
  { en: 'Joint Stock Corporation', ar: 'شركة مساهمة' },
  { en: 'Freelancer / Self-Employed Document', ar: 'وثيقة عمل حر' },
];

const BUSINESS_ACTIVITIES = [
  { en: 'Retail Trade & Supermarket', ar: 'تجارة تجزئة وتموينات' },
  { en: 'Food & Beverage / Restaurants & Cafes', ar: 'مطاعم ومقاهي' },
  { en: 'Electronics & Smart Appliances', ar: 'إلكترونيات وأجهزة ذكية' },
  { en: 'Health, Pharmacy & Medical', ar: 'صيدليات ورعاية صحية' },
  { en: 'Professional & Corporate Services', ar: 'خدمات مهنية وتجارية' },
  { en: 'Automotive & Logistics', ar: 'خدمات سيارات ونقليات' },
];

const SAUDI_CITIES = [
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Khobar', ar: 'الخبر' },
  { en: 'Mecca', ar: 'مكة المكرمة' },
  { en: 'Medina', ar: 'المدينة المنورة' },
  { en: 'Tabuk', ar: 'تبوك' },
  { en: 'Abha', ar: 'أبها' },
];

const SAUDI_BANKS = [
  { nameEn: 'Al Rajhi Bank', nameAr: 'مصرف الراجحي' },
  { nameEn: 'SNB AlAhli', nameAr: 'البنك الأهلي السعودي' },
  { nameEn: 'Riyad Bank', nameAr: 'بنك الرياض' },
  { nameEn: 'Alinma Bank', nameAr: 'مصرف الإنماء' },
  { nameEn: 'Arab National Bank (anb)', nameAr: 'البنك العربي الوطني' },
  { nameEn: 'SAB (Saudi Awwal Bank)', nameAr: 'البنك السعودي الأول' },
  { nameEn: 'Bank AlJazira', nameAr: 'بنك الجزيرة' },
];

export const MerchantRegistrationScreen: React.FC = () => {
  const {
    navigateTo,
    updateMerchantInfo,
    updateUser,
    setUserRole,
    setIsAuthenticated,
    user,
    isRtl,
    language,
  } = useApp();

  const isAr = language === 'العربية';

  // 1. Mobile Number (empty or from user.mobile if exists)
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobile ? user.mobile.replace(/^\+966\s*/, '').replace(/\D/g, '') : ''
  );

  // 2. Business Name & Type
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0].en);

  // 3. Commercial Registration / Business Registration details
  const [crNumber, setCrNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');

  // 4. Owner / Authorized Person identity details
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [nationalId, setNationalId] = useState('');

  // 5. Business address & activity
  const [activity, setActivity] = useState(BUSINESS_ACTIVITIES[0].en);
  const [city, setCity] = useState(SAUDI_CITIES[0].en);
  const [address, setAddress] = useState('');

  // 6. Settlement bank account + IBAN
  const [bankName, setBankName] = useState(SAUDI_BANKS[0].nameEn);
  const [iban, setIban] = useState('');

  // 7. Required KYC/KYB documents & verification
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Real File Upload Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFile(true);
      setTimeout(() => {
        setIsUploadingFile(false);
        const formattedSize =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        setUploadedFile({
          name: file.name,
          size: formattedSize,
          type: file.type || 'application/pdf',
        });
        if (errors.uploadedFile) {
          setErrors((prev) => ({ ...prev, uploadedFile: '' }));
        }
      }, 400);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!mobileNumber.trim()) {
      errs.mobileNumber = isAr ? 'رقم الجوال مطلوب' : 'Mobile number is required';
    } else if (mobileNumber.trim().length < 9) {
      errs.mobileNumber = isAr
        ? 'رقم الجوال يجب أن يتكون من 9 أرقام على الأقل'
        : 'Mobile number must be at least 9 digits';
    }

    if (!businessName.trim()) {
      errs.businessName = isAr ? 'اسم المنشأة مطلوب' : 'Business name is required';
    } else if (businessName.trim().length < 2) {
      errs.businessName = isAr ? 'اسم المنشأة قصير جداً' : 'Business name is too short';
    }

    if (!crNumber.trim()) {
      errs.crNumber = isAr ? 'رقم السجل التجاري مطلوب' : 'CR number is required';
    } else if (crNumber.trim().length !== 10) {
      errs.crNumber = isAr
        ? 'رقم السجل التجاري يجب أن يتكون من 10 أرقام'
        : 'CR number must be exactly 10 digits';
    }

    if (!vatNumber.trim()) {
      errs.vatNumber = isAr ? 'الرقم الضريبي مطلوب' : 'VAT ID is required';
    } else if (vatNumber.trim().length !== 15) {
      errs.vatNumber = isAr
        ? 'الرقم الضريبي يجب أن يتكون من 15 رقم'
        : 'VAT ID must be exactly 15 digits';
    }

    if (!ownerName.trim()) {
      errs.ownerName = isAr ? 'اسم المالك مطلوب' : 'Owner name is required';
    } else if (ownerName.trim().length < 2) {
      errs.ownerName = isAr ? 'اسم المالك قصير جداً' : 'Owner name is too short';
    }

    if (!nationalId.trim()) {
      errs.nationalId = isAr ? 'رقم الهوية الوطنية / الإقامة مطلوب' : 'National ID / Iqama is required';
    } else if (nationalId.trim().length !== 10) {
      errs.nationalId = isAr
        ? 'رقم الهوية يجب أن يتكون من 10 أرقام'
        : 'National ID must be exactly 10 digits';
    }

    if (!address.trim()) {
      errs.address = isAr ? 'الحي / العنوان مطلوب' : 'District / Address is required';
    }

    if (!iban.trim()) {
      errs.iban = isAr ? 'رقم الآيبان مطلوب' : 'IBAN is required';
    } else if (iban.replace(/\s/g, '').length < 15) {
      errs.iban = isAr ? 'رقم الآيبان غير مكتمل' : 'IBAN is incomplete';
    }

    if (!uploadedFile) {
      errs.uploadedFile = isAr ? 'يرجى إرفاق مستند السجل التجاري' : 'CR certificate document is required';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setFormError(
        isAr
          ? 'يرجى تعبئة جميع الحقول المطلوبة بالبيانات الصحيحة قبل المتابعة'
          : 'Please fill in all mandatory fields with valid information before proceeding'
      );
      return;
    }

    setFormError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleLaunchPortal = () => {
    setUserRole('merchant');
    updateUser({
      name: ownerName,
      mobile: `+966 ${mobileNumber}`,
      upiId: `${mobileNumber}@sarie`,
    });

    updateMerchantInfo({
      businessName: businessName,
      category: activity,
      city: city,
      crNumber: crNumber,
      vatNumber: vatNumber,
      nationalId: nationalId,
      isKycVerified: true,
      settlementBank: bankName,
      settlementIban: iban,
      merchantPin: '1234',
      terminalId: 'TID-SAMA-77412',
      storePhone: `+966 ${mobileNumber}`,
    });

    setIsAuthenticated(true);
    navigateTo('MERCHANT_HOME');
  };

  return (
    <div className="w-full text-white flex flex-col select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header Row with Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2C2C44] mb-4">
        <button
          type="button"
          onClick={() => navigateTo('MOBILE_NUMBER')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#A2A2BA] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}</span>
        </button>
      </div>

      {/* Main Title */}
      <div className="mb-4 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'تسجيل المنشأة' : 'Store Registration'}
        </h2>
        <p className="text-xs text-[#A2A2BA] mt-0.5">
          {isAr ? 'أدخل البيانات للاعتماد الفوري' : 'Enter details for instant setup'}
        </p>
      </div>

      {/* General Validation Error Banner */}
      {formError && !isSubmitted && (
        <div className="mb-3.5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 flex items-center gap-2 animate-shake">
          <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-ping" />
          <span>{formError}</span>
        </div>
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5 text-start">
          {/* 1. Mobile */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-1.5 transition-colors ${errors.mobileNumber ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
              <span>{isAr ? 'رقم الجوال' : 'Mobile Number'}</span>
              <span className="text-red-400 font-bold">*</span>
            </label>
            <div className={`flex items-center h-9 bg-[#151524] border rounded-lg px-2.5 focus-within:border-[#7FE87F] transition-colors ${errors.mobileNumber ? 'border-red-500/70' : 'border-[#2C2C44]'}`}>
              <Phone className="h-3.5 w-3.5 text-[#7FE87F] flex-shrink-0" />
              <div className={`text-xs font-bold text-[#A2A2BA] px-2 ${isRtl ? 'border-l border-[#3A3A52]' : 'border-r border-[#3A3A52]'}`}>
                +966
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, ''));
                  if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                }}
                placeholder="50 123 4567"
                maxLength={10}
                dir="ltr"
                className="w-full bg-transparent border-none outline-none text-xs font-bold text-white px-2 tracking-wider placeholder-[#6E6E85]"
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-[10.5px] font-semibold text-red-400 mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          {/* 2. Business Name & Type */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.businessName ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
              <span>{isAr ? 'اسم المنشأة والكيان' : 'Business Name & Type'}</span>
              <span className="text-red-400 font-bold">*</span>
            </label>
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Store className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: '' }));
                  }}
                  placeholder={isAr ? 'اسم المنشأة' : 'Store Name'}
                  className={`w-full h-9 bg-[#151524] border rounded-lg text-xs font-semibold text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                    errors.businessName ? 'border-red-500/70' : 'border-[#2C2C44]'
                  } ${isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'}`}
                />
              </div>
              {errors.businessName && (
                <p className="text-[10.5px] font-semibold text-red-400">{errors.businessName}</p>
              )}

              <div className="relative flex items-center">
                <Building2 className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className={`w-full h-9 bg-[#151524] border border-[#2C2C44] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#7FE87F] cursor-pointer ${
                    isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'
                  }`}
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t.en} value={t.en} className="bg-[#111726] text-white">
                      {isAr ? t.ar : t.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. CR & VAT ID */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.crNumber || errors.vatNumber ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                <span>{isAr ? 'السجل والضريبة' : 'CR & VAT Number'}</span>
                <span className="text-red-400 font-bold">*</span>
              </label>
              <span className="text-[10px] text-[#7FE87F] font-bold">Wathq Verified</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="relative flex items-center">
                  <FileText className={`absolute ${isRtl ? 'right-2' : 'left-2'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={10}
                    value={crNumber}
                    onChange={(e) => {
                      setCrNumber(e.target.value.replace(/\D/g, ''));
                      if (errors.crNumber) setErrors((prev) => ({ ...prev, crNumber: '' }));
                    }}
                    placeholder={isAr ? 'السجل (10 أرقام)' : 'CR (10 digits)'}
                    dir="ltr"
                    className={`w-full h-9 bg-[#151524] border rounded-lg text-xs font-bold font-mono text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                      errors.crNumber ? 'border-red-500/70' : 'border-[#2C2C44]'
                    } ${isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'}`}
                  />
                </div>
                {errors.crNumber && (
                  <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.crNumber}</p>
                )}
              </div>

              <div>
                <div className="relative flex items-center">
                  <Hash className={`absolute ${isRtl ? 'right-2' : 'left-2'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={15}
                    value={vatNumber}
                    onChange={(e) => {
                      setVatNumber(e.target.value.replace(/\D/g, ''));
                      if (errors.vatNumber) setErrors((prev) => ({ ...prev, vatNumber: '' }));
                    }}
                    placeholder={isAr ? 'الضريبة (15 رقم)' : 'VAT (15 digits)'}
                    dir="ltr"
                    className={`w-full h-9 bg-[#151524] border rounded-lg text-xs font-bold font-mono text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                      errors.vatNumber ? 'border-red-500/70' : 'border-[#2C2C44]'
                    } ${isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'}`}
                  />
                </div>
                {errors.vatNumber && (
                  <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.vatNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Owner Details */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.ownerName || errors.nationalId ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
              <span>{isAr ? 'بيانات المالك' : 'Owner Details'}</span>
              <span className="text-red-400 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="relative flex items-center">
                  <User className={`absolute ${isRtl ? 'right-2' : 'left-2'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: '' }));
                    }}
                    placeholder={isAr ? 'اسم المالك' : 'Full Name'}
                    className={`w-full h-9 bg-[#151524] border rounded-lg text-xs font-semibold text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                      errors.ownerName ? 'border-red-500/70' : 'border-[#2C2C44]'
                    } ${isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'}`}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.ownerName}</p>
                )}
              </div>

              <div>
                <div className="relative flex items-center">
                  <ShieldCheck className={`absolute ${isRtl ? 'right-2' : 'left-2'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => {
                      setNationalId(e.target.value.replace(/\D/g, ''));
                      if (errors.nationalId) setErrors((prev) => ({ ...prev, nationalId: '' }));
                    }}
                    placeholder={isAr ? 'الهوية (10 أرقام)' : 'National ID (10)'}
                    dir="ltr"
                    className={`w-full h-9 bg-[#151524] border rounded-lg text-xs font-bold font-mono text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                      errors.nationalId ? 'border-red-500/70' : 'border-[#2C2C44]'
                    } ${isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'}`}
                  />
                </div>
                {errors.nationalId && (
                  <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.nationalId}</p>
                )}
              </div>
            </div>
          </div>

          {/* 5. Address & Activity */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.address ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
              <span>{isAr ? 'النشاط والموقع' : 'Activity & Location'}</span>
              <span className="text-red-400 font-bold">*</span>
            </label>
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Tag className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={`w-full h-9 bg-[#151524] border border-[#2C2C44] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#7FE87F] cursor-pointer ${
                    isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'
                  }`}
                >
                  {BUSINESS_ACTIVITIES.map((a) => (
                    <option key={a.en} value={a.en} className="bg-[#111726] text-white">
                      {isAr ? a.ar : a.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative flex items-center">
                  <MapPin className={`absolute ${isRtl ? 'right-2' : 'left-2'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full h-9 bg-[#151524] border border-[#2C2C44] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#7FE87F] cursor-pointer ${
                      isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'
                    }`}
                  >
                    {SAUDI_CITIES.map((c) => (
                      <option key={c.en} value={c.en} className="bg-[#111726] text-white">
                        {isAr ? c.ar : c.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder={isAr ? 'الحي / الشارع' : 'District / Street'}
                    className={`w-full h-9 bg-[#151524] border rounded-lg px-2.5 text-xs font-semibold text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                      errors.address ? 'border-red-500/70' : 'border-[#2C2C44]'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Settlement Bank */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.iban ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                <span>{isAr ? 'حساب التسوية' : 'Settlement Account'}</span>
                <span className="text-red-400 font-bold">*</span>
              </label>
              <span className="text-[10px] text-[#7FE87F] font-bold">Sarie T+0</span>
            </div>
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Building2 className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#7FE87F] pointer-events-none`} />
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`w-full h-9 bg-[#151524] border border-[#2C2C44] rounded-lg text-xs font-semibold text-white outline-none focus:border-[#7FE87F] cursor-pointer ${
                    isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'
                  }`}
                >
                  {SAUDI_BANKS.map((b) => (
                    <option key={b.nameEn} value={b.nameEn} className="bg-[#111726] text-white">
                      {isAr ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => {
                    setIban(e.target.value.toUpperCase());
                    if (errors.iban) setErrors((prev) => ({ ...prev, iban: '' }));
                  }}
                  placeholder="SA03 8000 0451 9820 1849 2011"
                  dir="ltr"
                  className={`w-full h-9 bg-[#151524] border rounded-lg px-2.5 text-xs font-bold font-mono text-white placeholder-[#6E6E85] outline-none focus:border-[#7FE87F] transition-colors ${
                    errors.iban ? 'border-red-500/70' : 'border-[#2C2C44]'
                  }`}
                />
                {errors.iban && (
                  <p className="text-[10px] font-semibold text-red-400 mt-1">{errors.iban}</p>
                )}
              </div>
            </div>
          </div>

          {/* 7. Document */}
          <div className={`p-3 bg-[#111726] border rounded-xl space-y-2 transition-colors ${errors.uploadedFile ? 'border-red-500/60 bg-red-500/5' : 'border-[#2C2C44]'}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                <span>{isAr ? 'مستند السجل' : 'CR Document'}</span>
                <span className="text-red-400 font-bold">*</span>
              </label>
              <span className="text-[10px] text-[#7FE87F] font-bold">
                {uploadedFile ? (isAr ? 'مرفق' : 'Uploaded') : (isAr ? 'مطلوب' : 'Required')}
              </span>
            </div>

            <div className={`flex items-center justify-between p-2 bg-[#151524] border rounded-lg ${errors.uploadedFile ? 'border-red-500/70' : 'border-[#2C2C44]'}`}>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileCheck2 className={`h-4 w-4 flex-shrink-0 ${uploadedFile ? 'text-[#7FE87F]' : 'text-neutral-500'}`} />
                <span className="text-xs font-bold text-white truncate">
                  {uploadedFile ? uploadedFile.name : (isAr ? 'لم يتم إرفاق ملف بعد' : 'No file chosen yet')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleTriggerUpload}
                disabled={isUploadingFile}
                className="px-2.5 py-1 rounded-lg bg-[#111726] border border-[#3A3A52] text-[11px] font-bold text-neutral-200 hover:text-white hover:border-[#7FE87F] transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0 ml-2"
              >
                <Upload className="h-3 w-3 text-[#7FE87F]" />
                <span>{uploadedFile ? (isAr ? 'تغيير' : 'Change') : (isAr ? 'رفع ملف' : 'Upload')}</span>
              </button>
            </div>
            {errors.uploadedFile && (
              <p className="text-[10.5px] font-semibold text-red-400 mt-1">{errors.uploadedFile}</p>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#7FE87F] via-[#98F598] to-[#5FBF5F] text-[#080C14] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50 transition-all shadow-lg shadow-[#7FE87F]/25 cursor-pointer"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>{isAr ? 'جاري الاعتماد...' : 'Verifying...'}</span>
              </div>
            ) : (
              <>
                <span>{isAr ? 'تسجيل المنشأة' : 'Register Store'}</span>
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Result State */
        <div className="space-y-4 text-center py-4">
          <div className="w-14 h-14 rounded-full bg-[#7FE87F]/10 border border-[#7FE87F]/30 flex items-center justify-center text-[#7FE87F] mx-auto shadow-lg shadow-[#7FE87F]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              {isAr ? 'تم تسجيل المنشأة بنجاح!' : 'Registration Complete!'}
            </h3>
            <p className="text-xs text-[#A2A2BA] mt-1">
              {isAr ? 'تم تفعيل نقاط البيع والتسويات' : 'SoftPOS & instant settlements active'}
            </p>
          </div>

          {/* Summary Confirmation Card */}
          <div className="p-3 bg-[#111726] border border-[#2C2C44] rounded-xl space-y-2 text-start text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-[#2C2C44]">
              <span className="text-[#A2A2BA]">{isAr ? 'المنشأة' : 'Business'}</span>
              <span className="font-bold text-white truncate max-w-[180px]">{businessName}</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-[#2C2C44]">
              <span className="text-[#A2A2BA]">{isAr ? 'السجل' : 'CR'}</span>
              <span className="font-mono font-bold text-neutral-200">{crNumber}</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-[#2C2C44]">
              <span className="text-[#A2A2BA]">MID</span>
              <span className="font-mono font-bold text-[#7FE87F]">MID-966-20268491</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#A2A2BA]">{isAr ? 'البنك' : 'Bank'}</span>
              <span className="font-bold text-neutral-300">{bankName}</span>
            </div>
          </div>

          {/* Launch Dashboard Button */}
          <button
            type="button"
            onClick={handleLaunchPortal}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7FE87F] via-[#98F598] to-[#5FBF5F] text-[#080C14] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg shadow-[#7FE87F]/25 cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

