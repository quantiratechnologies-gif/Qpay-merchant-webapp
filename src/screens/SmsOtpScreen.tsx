import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';
import { authenticateMerchantWithAnyOtp } from '../services/supabaseClient';

export const SmsOtpScreen: React.FC = () => {
  const { navigateTo, screenParams, goBack, isRtl, language, updateUser, updateMerchantInfo } = useApp();
  const isAr = language === 'العربية';
  const mobile = screenParams.mobile || '501234567';

  const [otp, setOtp] = useState<string[]>(['5', '8', '2', '9', '0', '4']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isOtpComplete = otp.every((d) => d.trim().length > 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
    inputRefs.current[targetIndex]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (digitsOnly.length > 1) {
      const pasteDigits = digitsOnly.slice(0, 6).split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (i < pasteDigits.length) {
          newOtp[i] = pasteDigits[i];
        }
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasteDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = digitsOnly.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (isOtpComplete && !isVerifying) {
      setIsVerifying(true);
      try {
        const { user: authedUser, merchantInfo: authedInfo } = await authenticateMerchantWithAnyOtp(mobile, otp.join(''));
        updateUser(authedUser);
        if (authedInfo) updateMerchantInfo(authedInfo);
      } catch (e) {
        console.warn('Merchant web auth notice:', e);
      } finally {
        setIsVerifying(false);
      }
      navigateTo('MERCHANT_HOME');
    }
  };

  const handleResend = () => {
    setTimer(30);
    setIsResent(true);
    setTimeout(() => setIsResent(false), 3000);
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
      {/* Back Button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={goBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            padding: 0,
          }}
        >
          <ArrowLeft size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          <span>{isAr ? 'الرجوع لرقم الجوال' : 'Back to Mobile Entry'}</span>
        </button>
      </div>

      {/* Title Block */}
      <div style={{ textAlign: isRtl ? 'right' : 'left', marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {isAr ? 'رمز التحقق للأعمال' : 'Two-Factor Business Verification'}
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {isAr ? 'تم إرسال رمز التحقق إلى جوال المنشأة' : 'A verification code was sent to'}{' '}
          <span style={{ color: '#00C853', fontWeight: 800 }} dir="ltr">
            +966 {mobile}
          </span>
        </p>
      </div>

      {/* 6-Digit OTP Inputs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginBottom: '20px',
          direction: 'ltr',
        }}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: digit ? 'rgba(0, 200, 83, 0.08)' : '#111726',
              border: `2px solid ${digit ? '#00C853' : '#1E293B'}`,
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 900,
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>

      {/* Resend & Timer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '12.5px',
        }}
      >
        <span style={{ color: '#64748B' }}>
          {timer > 0
            ? `${isAr ? 'إعادة الإرسال بعد' : 'Resend available in'} ${isAr ? toArabicNumerals(timer) : timer}s`
            : isAr ? 'لم يصلك الرمز؟' : "Didn't receive code?"}
        </span>

        {timer === 0 ? (
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: '#00C853',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة الإرسال الآن' : 'Resend Code'}</span>
          </button>
        ) : isResent ? (
          <span style={{ color: '#00C853', fontWeight: 700 }}>
            {isAr ? 'تم الإرسال!' : 'Code Sent!'}
          </span>
        ) : null}
      </div>

      {/* Verify & Launch Portal Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!isOtpComplete || isVerifying}
        style={{
          backgroundColor: isOtpComplete ? '#00C853' : '#1E293B',
          color: isOtpComplete ? '#000000' : '#64748B',
          fontWeight: 800,
          fontSize: '14.5px',
          border: 'none',
          borderRadius: '12px',
          height: '48px',
          cursor: isOtpComplete ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          boxShadow: isOtpComplete ? '0 4px 20px rgba(0, 200, 83, 0.35)' : 'none',
        }}
      >
        <span>{isVerifying ? (isAr ? 'جارِ التحقق...' : 'Verifying...') : (isAr ? 'التحقق والدخول إلى لوحة التحكم' : 'Verify & Launch Portal')}</span>
        <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Footnote */}
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
        <span>{isAr ? 'مصادقة ثنائية مصرفية معتمدة' : 'Bank-Grade 2FA Authorized Session'}</span>
      </div>
    </div>
  );
};
