import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';
import { authenticateMerchantWithAnyOtp } from '../services/supabaseClient';

export const SmsOtpScreen: React.FC = () => {
  const {
    navigateTo,
    screenParams,
    goBack,
    isRtl,
    language,
    updateUser,
    updateMerchantInfo,
    activeOtp,
    setActiveOtp,
    verifyOtp,
    setIsAuthenticated,
  } = useApp();

  const mobile = screenParams?.mobile || '501234567';
  const isAr = language === 'العربية';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRefs[0]?.current?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    setErrorMsg('');
    const cleanVal = value.replace(/\D/g, '');

    if (cleanVal.length > 1) {
      const pasteDigits = cleanVal.slice(0, 6).split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (i < pasteDigits.length) {
          newOtp[i] = pasteDigits[i];
        }
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasteDigits.length, 5);
      inputRefs[nextIndex]?.current?.focus();
      if (pasteDigits.length === 6) {
        triggerVerifyWithCode(newOtp.join(''));
      }
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    if (singleDigit && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    } else if (singleDigit && index === 5) {
      if (newOtp.every((d) => d.trim().length > 0)) {
        triggerVerifyWithCode(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1]?.current?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit.length > 0);

  const isMockMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

  const triggerVerifyWithCode = async (enteredCode: string) => {
    if (isVerifying) return;
    setErrorMsg('');

    // In mock mode, accept any 6-digit code; in production, verify against the real OTP
    const isValid = isMockMode ? enteredCode.length === 6 : verifyOtp(enteredCode);

    if (!isValid) {
      setErrorMsg(
        isAr
          ? 'رمز التحقق غير صحيح. يرجى إدخال الرمز الصحيح المستلم في الرسالة.'
          : 'Invalid verification code. Please enter the correct OTP sent to your phone.'
      );
      setOtp(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();
      return;
    }

    setIsVerifying(true);
    try {
      const { user: authedUser, merchantInfo: authedInfo } = await authenticateMerchantWithAnyOtp(mobile, enteredCode);
      updateUser(authedUser);
      if (authedInfo) updateMerchantInfo(authedInfo);

      try {
        localStorage.removeItem('qpay_merchant_explicit_logout');
        localStorage.setItem('qpay_merchant_authenticated', 'true');
        sessionStorage.setItem('qpay_merchant_authenticated', 'true');
      } catch {
        // ignore storage errors
      }
      setIsAuthenticated(true);

      // Navigate to 4-digit Security PIN Setup screen
      navigateTo('MERCHANT_PIN_SETUP');
    } catch (e: any) {
      console.error('Merchant auth failure:', e);
      const isConfigErr = e?.message?.includes('Supabase service is unavailable') || e?.message?.includes('environment configuration');
      const isNotFoundErr = e?.message?.includes('profile not found');

      if (isConfigErr) {
        setErrorMsg(
          isAr
            ? 'خدمة النظام غير متوفرة حالياً. يرجى التحقق من إعدادات الاتصال.'
            : 'Service temporarily unavailable. Please verify backend environment configuration.'
        );
      } else if (isNotFoundErr) {
        setErrorMsg(
          isAr
            ? 'لم يتم العثور على حساب تاجر مسجل بهذا الرقم. يرجى إنشاء حساب جديد.'
            : 'No merchant profile found for this mobile number. Please sign up first.'
        );
      } else {
        setErrorMsg(
          isAr
            ? 'فشل التحقق من الحساب. يرجى المحاولة مرة أخرى.'
            : 'Authentication failed. Please verify your details and try again.'
        );
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    await triggerVerifyWithCode(otp.join(''));
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setTimer(30);
    setIsResent(true);
    setTimeout(() => setIsResent(false), 3000);
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

      {/* Top Center: App Brand Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <AlphPayLogo variant="horizontal" size={30} themeMode="dark" />
      </div>

      {/* Main OTP Verification Form Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: '#111726',
          border: '1px solid #1E293B',
          borderRadius: '24px',
          padding: '28px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isAr ? 'رمز التحقق السريع' : 'Enter Verification Code'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 10px 0' }}>
            {isAr ? 'تم إرسال رمز التحقق عبر SMS إلى' : 'Sent via SMS OTP to'}{' '}
            <span style={{ color: '#00C853', fontWeight: 700 }} dir="ltr">
              +966 {mobile}
            </span>
          </p>
          <button
            onClick={goBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={13} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            <span>{isAr ? 'تغيير رقم الجوال' : 'Change Mobile Number'}</span>
          </button>
        </div>

        {/* DEV MODE: OTP Hint Banner */}
        {isMockMode && (
          <div
            style={{
              backgroundColor: 'rgba(127, 232, 127, 0.08)',
              border: '1px solid rgba(127, 232, 127, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 800 }}>
              🧪 MOCK MODE — Enter any 6-digit code
            </span>
          </div>
        )}
        {import.meta.env.DEV && !isMockMode && (
          <div
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', color: '#FBBF24', fontWeight: 800 }}>
              🔑 DEV OTP: {activeOtp}
            </span>
          </div>
        )}

        {/* Error Alert if incorrect OTP */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 6-Digit Clean OTP Boxes */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '22px',
            direction: 'ltr',
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="tabular-nums"
              style={{
                width: '46px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#182236',
                border: digit ? '2px solid #00C853' : '1px solid #1E293B',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxShadow: digit ? '0 0 10px rgba(0, 200, 83, 0.2)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Resend SMS Counter */}
        <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
          {isAr ? 'لم تستلم الرمز؟ ' : "Didn't receive SMS? "}
          <button
            disabled={timer > 0}
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: timer > 0 ? '#64748B' : '#00C853',
              fontWeight: 800,
              cursor: timer > 0 ? 'not-allowed' : 'pointer',
              padding: 0,
            }}
          >
            {isAr
              ? timer > 0
                ? `إعادة الإرسال بعد (${toArabicNumerals(timer < 10 ? `0${timer}` : timer)} ثانية)`
                : 'إعادة إرسال الرمز'
              : `Resend Code ${timer > 0 ? `(00:${timer < 10 ? `0${timer}` : timer}s)` : ''}`}
          </button>
        </div>

        {isResent && (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#00C853', fontWeight: 700, marginBottom: '14px' }}>
            {isAr ? 'تم إعادة إرسال رمز التحقق بنجاح' : 'New code sent successfully!'}
          </div>
        )}

        <PrimaryButton onClick={handleVerify} disabled={!isComplete || isVerifying}>
          {isVerifying ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'تأكيد ودخول البوابة' : 'Verify & Enter Dashboard')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
      </div>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default SmsOtpScreen;
