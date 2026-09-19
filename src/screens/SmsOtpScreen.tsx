import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../state/AppContext';
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
  } = useApp();

  const isAr = language === 'العربية';
  const mobile = screenParams.mobile || '501234567';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isOtpComplete = otp.every((d) => d.trim().length > 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg('');
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
    setErrorMsg('');
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

  const handleQuickFill = (codeToFill?: string) => {
    const targetCode = codeToFill || activeOtp || '589204';
    const digits = targetCode.slice(0, 6).split('');
    setOtp(digits);
    setErrorMsg('');
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    if (!isOtpComplete || isVerifying) return;
    setErrorMsg('');

    const enteredCode = otp.join('').trim();
    const isValid = verifyOtp(enteredCode);

    if (!isValid) {
      setErrorMsg(
        isAr
          ? `رمز التحقق غير صحيح. يرجى إدخال الرمز الصحيح (${activeOtp}) المستلم في الرسالة.`
          : `Invalid verification code. Please enter the OTP code (${activeOtp}) sent in the message.`
      );
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsVerifying(true);
    try {
      const { user: authedUser, merchantInfo: authedInfo } = await authenticateMerchantWithAnyOtp(mobile, enteredCode);
      updateUser(authedUser);
      if (authedInfo) updateMerchantInfo(authedInfo);
    } catch (e) {
      console.warn('Merchant auth notice:', e);
    } finally {
      setIsVerifying(false);
    }

    sessionStorage.setItem('qpay_merchant_authenticated', 'true');

    // Route to MERCHANT_PIN_SETUP flow
    navigateTo('MERCHANT_PIN_SETUP');
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setTimer(30);
    setIsResent(true);
    setShowSmsBanner(true);
    setTimeout(() => setIsResent(false), 3000);
  };

  return (
    <div className="w-full text-white flex flex-col select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Simulated SMS Notification Banner */}
      {showSmsBanner && (
        <div className="mb-4 bg-[#111726]/95 border border-[#7FE87F]/40 rounded-xl p-3 shadow-xl shadow-black/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💬</span>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] font-extrabold text-[#A2A2BA] uppercase tracking-wider">
                {isAr ? 'رسالة نصية • الآن' : 'SMS OTP • Messages'}
              </div>
              <div className="text-xs text-white font-semibold">
                {isAr ? 'رمز تحقق بوابة التاجر: ' : 'Merchant Portal Code: '}
                <strong className="text-[#7FE87F] text-sm font-mono tracking-wider">{activeOtp}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickFill(activeOtp)}
            className="bg-gradient-to-r from-[#7FE87F] to-[#98F598] text-[#080C14] font-extrabold text-xs px-3 py-1.5 rounded-lg hover:brightness-105 transition-all whitespace-nowrap cursor-pointer shadow-md shadow-[#7FE87F]/20"
          >
            {isAr ? 'تعبئة تلقائية' : 'Autofill'}
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="mb-3">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#A2A2BA] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'scale-x-[-1]' : ''}`} />
          <span>{isAr ? 'السابق' : 'Back'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-5 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'رمز التحقق' : 'Verify OTP'}
        </h2>
        <p className="text-xs text-[#A2A2BA] mt-1">
          {isAr ? 'أرسل إلى ' : 'Sent to '}
          <span className="text-[#7FE87F] font-bold" dir="ltr">
            +966 {mobile}
          </span>
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 animate-shake">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 6-Digit OTP Inputs */}
      <div className="grid grid-cols-6 gap-2 mb-4" dir="ltr">
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
            className={`w-full h-12 rounded-xl text-center text-lg font-black outline-none transition-all ${
              digit
                ? 'bg-[#7FE87F]/10 border-2 border-[#7FE87F] text-white shadow-sm shadow-[#7FE87F]/30'
                : errorMsg
                ? 'bg-rose-500/5 border border-rose-500/60 text-[#A2A2BA] focus:border-rose-400'
                : 'bg-[#151524] border border-[#2C2C44] text-[#A2A2BA] focus:border-[#7FE87F]'
            }`}
          />
        ))}
      </div>

      {/* Demo helper */}
      <div className="flex items-center justify-between text-xs text-[#A2A2BA] mb-5 bg-[#111726] border border-[#2C2C44] rounded-lg px-3 py-2">
        <button
          type="button"
          onClick={() => handleQuickFill(activeOtp)}
          className="flex items-center gap-1.5 text-[11px] hover:text-white transition-colors cursor-pointer text-left"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-[#7FE87F]" />
          <span>{isAr ? `الرمز: ${activeOtp}` : `OTP: ${activeOtp}`}</span>
        </button>
        <div>
          {timer > 0 ? (
            <span className="text-[#6E6E85] font-mono text-[11px]">{timer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#7FE87F] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{isAr ? 'إعادة الإرسال' : 'Resend'}</span>
            </button>
          )}
        </div>
      </div>

      {isResent && (
        <div className="text-center text-xs text-[#7FE87F] mb-3 font-semibold animate-pulse">
          {isAr ? 'تم إرسال رمز جديد' : 'New code sent!'}
        </div>
      )}

      {/* Verify Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!isOtpComplete || isVerifying}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7FE87F] via-[#98F598] to-[#5FBF5F] text-[#080C14] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7FE87F]/25 cursor-pointer"
      >
        <span>
          {isVerifying
            ? (isAr ? 'جاري التحقق...' : 'Verifying...')
            : (isAr ? 'تأكيد' : 'Verify')}
        </span>
        <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
export default SmsOtpScreen;
