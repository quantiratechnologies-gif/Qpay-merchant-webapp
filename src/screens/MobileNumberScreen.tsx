import React, { useState } from 'react';
import { ArrowRight, User, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>(user.name || (isAr ? 'فهد العتيبي' : 'Fahad Al-Otaibi'));
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

  const handleDemoFill = (type: 'cafe' | 'retail') => {
    if (type === 'cafe') {
      setFullName(isAr ? 'فهد العتيبي' : 'Fahad Al-Otaibi');
      setMobileNumber('501234567');
    } else {
      setFullName(isAr ? 'سارة الغامدي' : 'Sara Al-Ghamdi');
      setMobileNumber('559876543');
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
      {/* Minimal Header */}
      <div style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '20px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {isAr ? 'تسجيل الدخول' : 'Merchant Sign In'}
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          {isAr ? 'الوصول إلى لوحة تحكم التاجر' : 'Access your merchant dashboard'}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Full Name */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            height: '46px',
            boxSizing: 'border-box',
          }}
        >
          <User size={16} color="#00C853" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isAr ? 'اسم التاجر / المفوض' : 'Merchant Name / Manager'}
            required
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#FFFFFF',
              width: '100%',
              textAlign: isRtl ? 'right' : 'left',
            }}
          />
        </div>

        {/* Business Phone */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            height: '46px',
            boxSizing: 'border-box',
          }}
        >
          <Phone size={16} color="#00C853" style={{ flexShrink: 0 }} />
          <div
            style={{
              color: '#94A3B8',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRight: isRtl ? 'none' : '1px solid #334155',
              borderLeft: isRtl ? '1px solid #334155' : 'none',
              paddingRight: isRtl ? '0' : '8px',
              paddingLeft: isRtl ? '8px' : '0',
            }}
          >
            +966
          </div>
          <input
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
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              width: '100%',
              letterSpacing: '0.03em',
              textAlign: isRtl ? 'right' : 'left',
            }}
          />
        </div>

        {/* 1-Click Fast Demo Fill */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
          <button
            type="button"
            onClick={() => handleDemoFill('cafe')}
            style={{
              padding: '7px 8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={11} color="#00C853" />
            <span>{isAr ? 'مقهى كوانتيرا' : 'Quantira Cafe'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoFill('retail')}
            style={{
              padding: '7px 8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={11} color="#00C853" />
            <span>{isAr ? 'سوبرماركت الرياض' : 'Riyadh Retail'}</span>
          </button>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? '#00C853' : '#1E293B',
            color: isFormValid ? '#000000' : '#64748B',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            borderRadius: '10px',
            height: '44px',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            marginTop: '6px',
            boxShadow: isFormValid ? '0 4px 16px rgba(0, 200, 83, 0.3)' : 'none',
          }}
        >
          <span>{isAr ? 'متابعة' : 'Continue'}</span>
          <ArrowRight size={15} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
        </button>
      </form>
    </div>
  );
};
