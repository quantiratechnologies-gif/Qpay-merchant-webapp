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
  Sparkles,
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
    isRtl,
    language,
  } = useApp();

  const isAr = language === 'العربية';

  // 1. Mobile Number
  const [mobileNumber, setMobileNumber] = useState('501234567');

  // 2. Business Name & Type
  const [businessName, setBusinessName] = useState('Al-Madinah Supermarket Trading LLC');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0].en);

  // 3. Commercial Registration / Business Registration details
  const [crNumber, setCrNumber] = useState('1010894210');
  const [vatNumber, setVatNumber] = useState('310948201900003');

  // 4. Owner / Authorized Person identity details
  const [ownerName, setOwnerName] = useState('Fahad Al-Harbi');
  const [nationalId, setNationalId] = useState('1098472910');

  // 5. Business address & activity
  const [activity, setActivity] = useState(BUSINESS_ACTIVITIES[0].en);
  const [city, setCity] = useState('Riyadh');
  const [address, setAddress] = useState('Al-Olaya District, King Fahd Rd');

  // 6. Settlement bank account + IBAN
  const [bankName, setBankName] = useState(SAUDI_BANKS[0].nameEn);
  const [iban, setIban] = useState('SA03 8000 0451 9820 1849 2011');

  // 7. Required KYC/KYB documents & verification
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'CR_Commercial_Certificate_1010894210.pdf',
    size: '1.8 MB',
    type: 'application/pdf',
  });
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      }, 400);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Quick QA Auto-Fill
  const handleAutoFill = () => {
    setMobileNumber('501234567');
    setBusinessName(isAr ? 'شركة تموينات المدينة للتجارة' : 'Al-Madinah Supermarket Trading LLC');
    setBusinessType(BUSINESS_TYPES[0].en);
    setCrNumber('1010894210');
    setVatNumber('310948201900003');
    setOwnerName(isAr ? 'فهد الحربي' : 'Fahad Al-Harbi');
    setNationalId('1098472910');
    setActivity(BUSINESS_ACTIVITIES[0].en);
    setCity('Riyadh');
    setAddress('Al-Olaya District, King Fahd Rd');
    setBankName(SAUDI_BANKS[0].nameEn);
    setIban('SA03 8000 0451 9820 1849 2011');
    setUploadedFile({
      name: 'CR_Commercial_Certificate_1010894210.pdf',
      size: '1.8 MB',
      type: 'application/pdf',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      {/* Top Header Row with Back and Quick Fill */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <button
          type="button"
          onClick={() => navigateTo('MOBILE_NUMBER')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}</span>
        </button>

        {!isSubmitted && (
          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00FF24]/10 border border-[#00FF24]/30 text-[#00FF24] text-[11px] font-bold hover:bg-[#00FF24]/20 transition-all cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isAr ? 'تعبئة سريعة' : '1-Click QA Fill'}</span>
          </button>
        )}
      </div>

      {/* Main Title */}
      <div className="mb-5 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'إنشاء حساب تاجر جديد' : 'Create Merchant Account'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isAr
            ? 'يرجى إدخال بيانات المنشأة الأساسية لاعتماد الحساب الفوري'
            : 'Enter your business details to complete SAMA & ZATCA verified registration'}
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          {/* ======================================================== */}
          {/* 1. Mobile Number */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                  1
                </span>
                <label className="text-xs font-bold text-white">
                  {isAr ? 'رقم الجوال' : 'Mobile Number'}
                </label>
              </div>
              <span className="text-[10px] text-[#00FF24] font-semibold">{isAr ? 'مطلوب للتحقق' : 'Required'}</span>
            </div>

            <div className="flex items-center h-10 bg-[#0E1526] border border-slate-800 rounded-lg px-3 focus-within:border-[#00FF24] transition-colors">
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
                dir="ltr"
                className="w-full bg-transparent border-none outline-none text-xs font-bold text-white px-2 tracking-wider"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. Business Name & Type */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                2
              </span>
              <label className="text-xs font-bold text-white">
                {isAr ? 'اسم المنشأة والكيان التجاري' : 'Business Name & Type'}
              </label>
            </div>

            <div className="space-y-2">
              {/* Business Name */}
              <div className="relative flex items-center">
                <Store className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#00FF24] pointer-events-none`} />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={isAr ? 'اسم المنشأة / المتجر' : 'Business / Store Name'}
                  required
                  className={`w-full h-10 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>

              {/* Business Type */}
              <div className="relative flex items-center">
                <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#00FF24] pointer-events-none`} />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className={`w-full h-10 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00FF24] cursor-pointer ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t.en} value={t.en} className="bg-[#0E1526] text-white">
                      {isAr ? t.ar : t.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. Commercial Registration / Business Registration details */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                  3
                </span>
                <label className="text-xs font-bold text-white">
                  {isAr ? 'بيانات السجل التجاري والضريبي' : 'Commercial Registration Details'}
                </label>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#00FF24] font-bold">
                <ShieldCheck className="h-3 w-3" />
                <span>Wathq API</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* CR Number */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold">
                  {isAr ? 'رقم السجل التجاري (١٠ أرقام)' : 'CR Number (10 digits)'}
                </label>
                <div className="relative flex items-center">
                  <FileText className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#00FF24] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={10}
                    value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="1010894210"
                    required
                    dir="ltr"
                    className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-bold font-mono text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                      isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  />
                </div>
              </div>

              {/* ZATCA VAT Number */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold">
                  {isAr ? 'الرقم الضريبي (١٥ رقم)' : 'VAT ID (15 digits)'}
                </label>
                <div className="relative flex items-center">
                  <Hash className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#00FF24] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={15}
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="310948201900003"
                    required
                    dir="ltr"
                    className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-bold font-mono text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                      isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. Owner / Authorized Person identity details */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                  4
                </span>
                <label className="text-xs font-bold text-white">
                  {isAr ? 'بيانات المالك / المفوض المعتمد' : 'Owner / Authorized Person Identity'}
                </label>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{isAr ? 'نفاذ الوطني' : 'Nafath'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Owner Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div className="relative flex items-center">
                  <User className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#00FF24] pointer-events-none`} />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Fahad Al-Harbi"
                    required
                    className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                      isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  />
                </div>
              </div>

              {/* National ID / Iqama */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold">
                  {isAr ? 'الهوية الوطنية / الإقامة' : 'National ID / Iqama'}
                </label>
                <div className="relative flex items-center">
                  <ShieldCheck className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#00FF24] pointer-events-none`} />
                  <input
                    type="text"
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                    placeholder="1098472910"
                    required
                    dir="ltr"
                    className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-bold font-mono text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors ${
                      isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. Business address & activity */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                5
              </span>
              <label className="text-xs font-bold text-white">
                {isAr ? 'عنوان المنشأة والنشاط التجاري' : 'Business Address & Activity'}
              </label>
            </div>

            <div className="space-y-2">
              {/* Activity Dropdown */}
              <div className="relative flex items-center">
                <Tag className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#00FF24] pointer-events-none`} />
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00FF24] cursor-pointer ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                >
                  {BUSINESS_ACTIVITIES.map((a) => (
                    <option key={a.en} value={a.en} className="bg-[#0E1526] text-white">
                      {isAr ? a.ar : a.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* City and Address */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative flex items-center">
                  <MapPin className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-3.5 w-3.5 text-[#00FF24] pointer-events-none`} />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00FF24] cursor-pointer ${
                      isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'
                    }`}
                  >
                    {SAUDI_CITIES.map((c) => (
                      <option key={c.en} value={c.en} className="bg-[#0E1526] text-white">
                        {isAr ? c.ar : c.en}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? 'الحي / الشارع' : 'District / Street'}
                  required
                  className="w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg px-2.5 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 6. Settlement bank account + IBAN */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                  6
                </span>
                <label className="text-xs font-bold text-white">
                  {isAr ? 'حساب التسوية البنكي والآيبان' : 'Settlement Bank Account + IBAN'}
                </label>
              </div>
              <span className="text-[10px] text-[#00FF24] font-bold">{isAr ? 'سريع T+0' : 'Sarie IPS'}</span>
            </div>

            <div className="space-y-2">
              {/* Bank Selector */}
              <div className="relative flex items-center">
                <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} h-4 w-4 text-[#00FF24] pointer-events-none`} />
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg text-xs font-semibold text-white outline-none focus:border-[#00FF24] cursor-pointer ${
                    isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                >
                  {SAUDI_BANKS.map((b) => (
                    <option key={b.nameEn} value={b.nameEn} className="bg-[#0E1526] text-white">
                      {isAr ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* IBAN */}
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value.toUpperCase())}
                placeholder="SA03 8000 0451 9820 1849 2011"
                required
                dir="ltr"
                className="w-full h-9 bg-[#0E1526] border border-slate-800 rounded-lg px-3 text-xs font-bold font-mono text-white placeholder-slate-500 outline-none focus:border-[#00FF24] transition-colors"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 7. Required KYC/KYB documents & verification */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2.5">
            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00FF24]/10 text-[#00FF24] text-[11px] font-black flex items-center justify-center border border-[#00FF24]/30">
                  7
                </span>
                <label className="text-xs font-bold text-white">
                  {isAr ? 'توثيق مستندات المنشأة (KYC / KYB)' : 'Required KYC/KYB Documents & Verification'}
                </label>
              </div>
              <span className="text-[10px] text-[#00FF24] font-bold">
                {uploadedFile ? (isAr ? 'مرفق وموثق' : 'Verified') : (isAr ? 'مطلوب' : 'Required')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0E1526] border border-slate-800/80 rounded-lg">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-[#00FF24]/10 border border-[#00FF24]/30 flex items-center justify-center text-[#00FF24] flex-shrink-0">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  {isUploadingFile ? (
                    <div className="flex items-center gap-2 text-xs text-[#00FF24] font-semibold">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00FF24] border-t-transparent animate-spin" />
                      <span>{isAr ? 'جاري رفع وفحص المستند...' : 'Scanning & Uploading...'}</span>
                    </div>
                  ) : uploadedFile ? (
                    <>
                      <div className="text-xs font-bold text-white truncate" title={uploadedFile.name}>
                        {uploadedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#00FF24] font-semibold">✓ {isAr ? 'موثق عبر واثق' : 'Wathq & Nafath Verified'}</span>
                        <span>•</span>
                        <span>{uploadedFile.size}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-white">
                        {isAr ? 'شهادة السجل التجاري' : 'CR Commercial Certificate'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isAr ? 'PDF أو صورة بحد أقصى ١٠ ميجابايت' : 'PDF, PNG, JPG up to 10MB'}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerUpload}
                disabled={isUploadingFile}
                className="px-2.5 py-1.5 rounded-lg bg-[#10182A] border border-slate-700 text-[11px] font-bold text-slate-200 hover:text-white hover:border-[#00FF24] transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ml-2"
              >
                <Upload className="h-3.5 w-3.5 text-[#00FF24]" />
                <span>
                  {uploadedFile ? (isAr ? 'تغيير الملف' : 'Change') : (isAr ? 'رفع ملف' : 'Upload File')}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-12 mt-3 rounded-xl bg-[#00FF24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#00FF24]/90 disabled:opacity-50 transition-all shadow-lg shadow-[#00FF24]/20 cursor-pointer"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>{isAr ? 'جاري التحقق والاعتماد...' : 'Verifying & Provisioning...'}</span>
              </div>
            ) : (
              <>
                <span>{isAr ? 'تقديم طلب الحساب واعتماده فورياً' : 'Submit & Create Merchant Account'}</span>
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Instant Verification & Provisioning Result State */
        <div className="space-y-4 text-center py-4">
          <div className="w-14 h-14 rounded-full bg-[#00FF24]/10 border border-[#00FF24]/30 flex items-center justify-center text-[#00FF24] mx-auto shadow-lg shadow-[#00FF24]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              {isAr ? 'تم إنشاء واعتماد حساب المنشأة بنجاح!' : 'Merchant Account Successfully Created!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'تم التحقق من السجل التجاري والآيبان وتفعيل نقاط البيع والفوترة'
                : 'CR, IBAN & KYC verified. SoftPOS and Sarie instant payout are active.'}
            </p>
          </div>

          {/* Summary Confirmation Card */}
          <div className="p-3.5 bg-[#10182A] border border-slate-800 rounded-xl space-y-2 text-start text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'اسم المنشأة' : 'Business'}</span>
              <span className="font-bold text-white truncate max-w-[180px]">{businessName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'السجل التجاري' : 'CR Number'}</span>
              <span className="font-mono font-bold text-slate-200">{crNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
              <span className="text-slate-400">{isAr ? 'معرف التاجر (MID)' : 'Merchant ID (MID)'}</span>
              <span className="font-mono font-bold text-[#00FF24]">MID-966-20268491</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">{isAr ? 'بنك التسوية' : 'Settlement Bank'}</span>
              <span className="font-bold text-slate-300">{bankName}</span>
            </div>
          </div>

          {/* Launch Dashboard Button */}
          <button
            type="button"
            onClick={handleLaunchPortal}
            className="w-full h-12 rounded-xl bg-[#00FF24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#00FF24]/90 transition-all shadow-lg shadow-[#00FF24]/20 cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>{isAr ? 'الدخول إلى لوحة التحكم الرئيسية' : 'Launch Merchant Dashboard'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
