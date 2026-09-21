import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Edit2,
  ChevronDown,
  Building2,
  Tag,
  Hash,
  MapPin,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../state/AppContext';

const CATEGORIES = [
  { en: 'Grocery & Daily Essentials', ar: 'بقالة وتموينات واحتياجات يومية' },
  { en: 'Food & Beverage / Cafes', ar: 'مطاعم ومقاهي ومشروبات' },
  { en: 'Retail & Fashion Boutique', ar: 'تجارة تجزئة وملابس وأزياء' },
  { en: 'Electronics & Smart Devices', ar: 'إلكترونيات وأجهزة ذكية' },
  { en: 'Pharmacy & Wellness', ar: 'صيدليات ورعاية صحية' },
  { en: 'Automotive & Fuel Stations', ar: 'محطات وقود وخدمات سيارات' },
  { en: 'Professional Services', ar: 'خدمات مهنية واستشارية' },
  { en: 'General Wholesale Trade', ar: 'تجارة جملة وتوريدات' },
];

const CITIES = [
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Khobar', ar: 'الخبر' },
  { en: 'Mecca', ar: 'مكة المكرمة' },
  { en: 'Medina', ar: 'المدينة المنورة' },
  { en: 'Tabuk', ar: 'تبوك' },
  { en: 'Abha', ar: 'أبها' },
];

export const MerchantSetupScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, goBack, language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [businessName, setBusinessName] = useState(
    merchantInfo.businessName || (isAr ? 'تموينات القمة للتجارة' : 'GreenLeaf Markets LLC')
  );
  const [businessNameError, setBusinessNameError] = useState<string>('');
  const [category, setCategory] = useState(merchantInfo.category || 'Grocery & Daily Essentials');
  const [city, setCity] = useState(merchantInfo.city || 'Riyadh');
  const [postalCode, setPostalCode] = useState(merchantInfo.postalCode || '12211');
  const [vatNumber, setVatNumber] = useState(merchantInfo.vatNumber || '310948201900003');
  const [vatError, setVatError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(merchantInfo.logoUrl || null);
  const [logoFileName, setLogoFileName] = useState<string>('');

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    logoInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (businessName.trim().length < 2) {
      setBusinessNameError(
        isAr ? 'يرجى إدخال اسم منشأة صحيح (حرفين على الأقل)' : 'Please enter a valid business name (at least 2 characters)'
      );
      hasError = true;
    } else {
      setBusinessNameError('');
    }

    const cleanVat = vatNumber.replace(/\D/g, '');
    if (!/^3\d{13}3$/.test(cleanVat)) {
      setVatError(
        isAr
          ? 'الرقم الضريبي يجب أن يتكون من ١٥ رقماً يبدأ وينتهي بالرقم ٣'
          : 'VAT ID must be exactly 15 digits starting and ending with 3'
      );
      hasError = true;
    } else {
      setVatError('');
    }

    if (hasError) return;

    updateMerchantInfo({
      businessName: businessName.trim(),
      category,
      city,
      postalCode,
      vatNumber: cleanVat,
      logoUrl: logoUrl || undefined,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      navigateTo('MERCHANT_BANK_LINK');
    }, 900);
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100%',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Section */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {/* Top Navigation Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '40px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={goBack}
            aria-label="Go Back"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#111726',
              border: '1px solid #2C2C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Title Block */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'ملف المنشأة' : 'Business Profile'}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#A2A2BA',
              margin: 0,
            }}
          >
            {isAr ? 'بيانات المتجر والضريبة' : 'Store & tax details'}
          </p>
        </div>

        {/* Form Container */}
        <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Hidden File Input */}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            onChange={handleLogoSelect}
            style={{ display: 'none' }}
          />

          {/* 1. Storefront & Brand Logo Inset Card */}
          <div
            onClick={triggerLogoUpload}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: logoUrl ? '1.5px solid rgba(127, 232, 127, 0.5)' : '1px solid #2C2C44',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              {/* Upload Tile / Image Preview */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border: logoUrl ? '1.5px solid #7FE87F' : '1.5px dashed rgba(127, 232, 127, 0.6)',
                  backgroundColor: 'rgba(127, 232, 127, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  color: '#7FE87F',
                  flexShrink: 0,
                  boxShadow: logoUrl ? '0 0 12px rgba(127, 232, 127, 0.25)' : 'none',
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Store Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Camera size={18} strokeWidth={2} />
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  {isAr ? 'شعار المتجر' : 'Store Logo'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: logoUrl ? '#7FE87F' : '#A2A2BA',
                    marginTop: '2px',
                    fontWeight: logoUrl ? 700 : 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {logoUrl
                    ? (logoFileName ? `✓ ${logoFileName}` : (isAr ? '✓ تم إرفاق الشعار' : '✓ Logo Uploaded'))
                    : (isAr ? 'اضغط لرفع صورة (PNG أو JPG)' : 'Click to upload (PNG, JPG)')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerLogoUpload();
              }}
              className="interactive-tap"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#182236',
                border: '1px solid #2C2C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: logoUrl ? '#7FE87F' : '#A2A2BA',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Edit2 size={13} />
            </button>
          </div>

          {/* 2. Registered Business Name */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#A2A2BA',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'اسم المنشأة' : 'Business Name'} <span style={{ color: '#7FE87F' }}>*</span>
            </label>
            <div
              style={{
                backgroundColor: '#111726',
                border: businessNameError ? '1.5px solid #EF4444' : '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Building2 size={17} color={businessNameError ? '#EF4444' : '#7FE87F'} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (businessNameError) setBusinessNameError('');
                }}
                placeholder={isAr ? 'أدخل اسم المنشأة' : 'Enter business name'}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
            {businessNameError && (
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#EF4444',
                  marginTop: '5px',
                  fontWeight: 600,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {businessNameError}
              </div>
            )}
          </div>

          {/* 3. Business Category Selector */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#A2A2BA',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'النشاط التجاري' : 'Category'} <span style={{ color: '#7FE87F' }}>*</span>
            </label>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#111726',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Tag size={17} color="#7FE87F" style={{ flexShrink: 0 }} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: isRtl ? '0' : '24px',
                  paddingLeft: isRtl ? '24px' : '0',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.en} value={cat.en} style={{ backgroundColor: '#111726', color: '#FFFFFF' }}>
                    {isAr ? cat.ar : cat.en}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                color="#A2A2BA"
                style={{
                  position: 'absolute',
                  right: isRtl ? 'auto' : '16px',
                  left: isRtl ? '16px' : 'auto',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Success Toast */}
          {showSuccessToast && (
            <div
              className="fade-in"
              style={{
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '1px solid rgba(0, 200, 83, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0, 200, 83, 0.25)',
              }}
            >
              <CheckCircle2 size={18} color="#7FE87F" />
              <span>
                {isAr ? 'تم حفظ بيانات المنشأة بنجاح' : 'Business details saved successfully'}
              </span>
            </div>
          )}

          {/* 4. ZATCA VAT ID */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#A2A2BA',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'الرقم الضريبي' : 'VAT ID'} <span style={{ color: '#7FE87F' }}>*</span>
            </label>

            <div
              style={{
                backgroundColor: '#111726',
                border: vatError ? '1.5px solid #EF4444' : '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Hash size={17} color={vatError ? '#EF4444' : '#7FE87F'} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={vatNumber}
                maxLength={15}
                onChange={(e) => {
                  setVatNumber(e.target.value.replace(/\D/g, '').slice(0, 15));
                  if (vatError) setVatError('');
                }}
                placeholder="310948201900003"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  width: '100%',
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
            {vatError && (
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#EF4444',
                  marginTop: '5px',
                  fontWeight: 600,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {vatError}
              </div>
            )}
          </div>

          {/* 5. 2-Column Row: City & Postal Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {/* City */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#A2A2BA',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'المدينة' : 'City'} <span style={{ color: '#7FE87F' }}>*</span>
              </label>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <MapPin size={15} color="#7FE87F" style={{ flexShrink: 0 }} />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    width: '100%',
                    cursor: 'pointer',
                    appearance: 'none',
                    textAlign: isRtl ? 'right' : 'left',
                    paddingRight: isRtl ? '0' : '16px',
                    paddingLeft: isRtl ? '16px' : '0',
                  }}
                >
                  {CITIES.map((c) => (
                    <option key={c.en} value={c.en} style={{ backgroundColor: '#111726', color: '#FFFFFF' }}>
                      {isAr ? c.ar : c.en}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  color="#A2A2BA"
                  style={{
                    position: 'absolute',
                    right: isRtl ? 'auto' : '10px',
                    left: isRtl ? '10px' : 'auto',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#A2A2BA',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'الرمز البريدي' : 'Postal Code'} <span style={{ color: '#7FE87F' }}>*</span>
              </label>
              <div
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #2C2C44',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <Mail size={15} color="#7FE87F" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  maxLength={5}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="12211"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontVariantNumeric: 'tabular-nums',
                    width: '100%',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="interactive-tap gold-gradient-btn"
            style={{
              marginTop: '6px',
              height: '50px',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(127, 232, 127, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isAr ? 'حفظ ومتابعة' : 'Save & Continue'}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
