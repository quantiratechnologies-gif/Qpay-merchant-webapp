import React, { useState } from 'react';
import { ArrowRight, User, Phone, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>(user.name || (isAr ? 'فهد العتيبي' : 'Fahad Al-Otaibi'));
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');
  const [crNumber, setCrNumber] = useState<string>('1010789234');

  const isFormValid = mobileNumber.length >= 9 && fullName.trim().length > 0;

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isFormValid) {
      setUserRole('merchant');
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName, crNumber });
    }
  };

  const handleDemoFill = (type: 'cafe' | 'retail') => {
    if (type === 'cafe') {
      setFullName(isAr ? 'فهد العتيبي' : 'Fahad Al-Otaibi');
      setMobileNumber('501234567');
      setCrNumber('1010789234');
    } else {
      setFullName(isAr ? 'سارة الغامدي' : 'Sara Al-Ghamdi');
      setMobileNumber('559876543');
      setCrNumber('1010884920');
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Title Block */}
      <div style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '16px',
            backgroundColor: 'rgba(0, 200, 83, 0.1)',
            border: '1px solid rgba(0, 200, 83, 0.25)',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#00C853',
            marginBottom: '12px',
          }}
        >
          <Building2 size={13} />
          {isAr ? 'بوابة التجار المعتمدة' : 'Verified Merchant Portal'}
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {isAr ? 'تسجيل الدخول إلى لوحة الأعمال' : 'Sign in to Merchant Hub'}
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {isAr
            ? 'أدخل رقم جوال المنشأة أو السجل التجاري للوصول إلى لوحة التحكم'
            : 'Enter your business mobile or CR number to access operations'}
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Owner / Authorized Manager Name */}
        <div>
          <label
            htmlFor="owner-name-input"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '6px',
              display: 'block',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {isAr ? 'اسم المدير المفوض / المالك' : 'Authorized Manager / Owner'} <span style={{ color: '#00C853' }}>*</span>
          </label>
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '48px',
              boxSizing: 'border-box',
            }}
          >
            <User size={16} color="#00C853" style={{ flexShrink: 0 }} />
            <input
              id="owner-name-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'أدخل اسم المدير' : 'Enter manager name'}
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

        {/* Commercial Registration (CR) Number */}
        <div>
          <label
            htmlFor="cr-number-input"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '6px',
              display: 'block',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {isAr ? 'رقم السجل التجاري (CR)' : 'Commercial Registration (CR)'}
          </label>
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '48px',
              boxSizing: 'border-box',
            }}
          >
            <Building2 size={16} color="#64748B" style={{ flexShrink: 0 }} />
            <input
              id="cr-number-input"
              type="text"
              value={crNumber}
              onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="1010XXXXXX"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                width: '100%',
                fontFamily: 'monospace',
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
          </div>
        </div>

        {/* Business Mobile Number */}
        <div>
          <label
            htmlFor="merchant-phone-input"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#CBD5E1',
              marginBottom: '6px',
              display: 'block',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {isAr ? 'رقم جوال الحساب' : 'Business Mobile Number'} <span style={{ color: '#00C853' }}>*</span>
          </label>
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '48px',
              boxSizing: 'border-box',
            }}
          >
            <Phone size={16} color="#00C853" style={{ flexShrink: 0 }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94A3B8',
                fontSize: '13px',
                fontWeight: 700,
                borderRight: isRtl ? 'none' : '1px solid #334155',
                borderLeft: isRtl ? '1px solid #334155' : 'none',
                paddingRight: isRtl ? '0' : '10px',
                paddingLeft: isRtl ? '10px' : '0',
                userSelect: 'none',
              }}
            >
              <span>🇸🇦</span>
              <span>+966</span>
            </div>
            <input
              id="merchant-phone-input"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="50 123 4567"
              maxLength={10}
              required
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                width: '100%',
                letterSpacing: '0.04em',
                textAlign: isRtl ? 'right' : 'left',
              }}
            />
          </div>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>
            {isAr ? 'حسابات تجريبية سريعة:' : 'Quick Demo Accounts:'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('cafe')}
              style={{
                padding: '8px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#CBD5E1',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={12} color="#00C853" />
              {isAr ? 'مقهى كوانتيرا' : 'Quantira Cafe'}
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('retail')}
              style={{
                padding: '8px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#CBD5E1',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={12} color="#00C853" />
              {isAr ? 'سوبرماركت الرياض' : 'Riyadh Retail'}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? '#00C853' : '#1E293B',
            color: isFormValid ? '#000000' : '#64748B',
            fontWeight: 800,
            fontSize: '14.5px',
            border: 'none',
            borderRadius: '12px',
            height: '48px',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            marginTop: '8px',
            boxShadow: isFormValid ? '0 4px 20px rgba(0, 200, 83, 0.35)' : 'none',
          }}
        >
          <span>{isAr ? 'متابعة إلى بوابة الأعمال' : 'Continue to Portal'}</span>
          <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
        </button>
      </form>

      {/* Security Footnote */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '20px',
          color: '#64748B',
          fontSize: '11.5px',
          fontWeight: 600,
        }}
      >
        <ShieldCheck size={13} color="#00C853" />
        <span>{isAr ? 'بوابة آمنة ومشفرة وفق معايير البنك المركزي السعودي' : 'SAMA & ZATCA Enterprise Compliant Portal'}</span>
      </div>
    </div>
  );
};
