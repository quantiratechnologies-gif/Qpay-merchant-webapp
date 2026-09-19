import React, { useState } from 'react';
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

  const [businessName, setBusinessName] = useState(
    merchantInfo.businessName || (isAr ? 'تموينات القمة للتجارة' : 'GreenLeaf Markets LLC')
  );
  const [category, setCategory] = useState(merchantInfo.category || 'Grocery & Daily Essentials');
  const [city, setCity] = useState(merchantInfo.city || 'Riyadh');
  const [postalCode, setPostalCode] = useState(merchantInfo.postalCode || '12211');
  const [vatNumber] = useState(merchantInfo.vatNumber || '310948201900003');
  const [hasLogo, setHasLogo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantInfo({
      businessName,
      category,
      city,
      postalCode,
      vatNumber,
    });
    navigateTo('MERCHANT_BANK_LINK');
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100%',
        backgroundColor: '#0B0B0B',
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
              backgroundColor: '#171717',
              border: '1px solid #262626',
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
              color: '#A3A3A3',
              margin: 0,
            }}
          >
            {isAr ? 'بيانات المتجر والضريبة' : 'Store & tax details'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 1. Storefront & Brand Logo Inset Card */}
          <div
            style={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Dotted Upload Tile */}
              <div
                onClick={() => setHasLogo(!hasLogo)}
                className="interactive-tap"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1.5px dashed rgba(212, 175, 55, 0.6)',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  cursor: 'pointer',
                  color: '#D4AF37',
                  flexShrink: 0,
                }}
              >
                <Camera size={16} strokeWidth={2} />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  {isAr ? 'شعار المتجر' : 'Store Logo'}
                </div>
                <div style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '2px' }}>
                  {hasLogo
                    ? (isAr ? '✓ تم التحميل' : '✓ Uploaded')
                    : (isAr ? 'PNG أو JPG' : 'PNG, JPG')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasLogo(!hasLogo)}
              className="interactive-tap"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#212121',
                border: '1px solid #262626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A3A3A3',
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
                color: '#A3A3A3',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'اسم المنشأة' : 'Business Name'} <span style={{ color: '#D4AF37' }}>*</span>
            </label>
            <div
              style={{
                backgroundColor: '#171717',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Building2 size={17} color="#D4AF37" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={isAr ? 'أدخل اسم المنشأة' : 'Enter business name'}
                required
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
          </div>

          {/* 3. Business Category Selector */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#A3A3A3',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'النشاط التجاري' : 'Category'} <span style={{ color: '#D4AF37' }}>*</span>
            </label>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#171717',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Tag size={17} color="#D4AF37" style={{ flexShrink: 0 }} />
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
                  <option key={cat.en} value={cat.en} style={{ backgroundColor: '#171717', color: '#FFFFFF' }}>
                    {isAr ? cat.ar : cat.en}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                color="#A3A3A3"
                style={{
                  position: 'absolute',
                  right: isRtl ? 'auto' : '16px',
                  left: isRtl ? '16px' : 'auto',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* 4. ZATCA VAT ID */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#A3A3A3',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'الرقم الضريبي' : 'VAT ID'} <span style={{ color: '#D4AF37' }}>*</span>
            </label>

            <div
              style={{
                backgroundColor: '#171717',
                border: '1px solid #262626',
                borderRadius: '14px',
                padding: '0 16px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Hash size={17} color="#D4AF37" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={vatNumber}
                readOnly
                disabled
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
          </div>

          {/* 5. 2-Column Row: City & Postal Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {/* City */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#A3A3A3',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'المدينة' : 'City'} <span style={{ color: '#D4AF37' }}>*</span>
              </label>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <MapPin size={15} color="#D4AF37" style={{ flexShrink: 0 }} />
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
                    <option key={c.en} value={c.en} style={{ backgroundColor: '#171717', color: '#FFFFFF' }}>
                      {isAr ? c.ar : c.en}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  color="#A3A3A3"
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
                  color: '#A3A3A3',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'الرمز البريدي' : 'Postal Code'} <span style={{ color: '#D4AF37' }}>*</span>
              </label>
              <div
                style={{
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <Mail size={15} color="#D4AF37" style={{ flexShrink: 0 }} />
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
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
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
