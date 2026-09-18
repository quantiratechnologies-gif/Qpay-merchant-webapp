import React, { useState } from 'react';
import { Lock, Delete, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';

export const MerchantPinSetupScreen: React.FC = () => {
  const {
    updateMerchantInfo,
    setUserRole,
    setIsAuthenticated,
    navigateTo,
    goBack,
    screenParams,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const fromSettings = screenParams?.fromSettings === true;

  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'create' | 'confirm' | 'success'>('create');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    if (step === 'create') {
      if (pin.length < 4) {
        const next = pin + digit;
        setPin(next);
        if (next.length === 4) {
          setTimeout(() => {
            setStep('confirm');
          }, 250);
        }
      }
    } else if (step === 'confirm') {
      if (confirmPin.length < 4) {
        const next = confirmPin + digit;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === pin) {
            // Save PIN
            updateMerchantInfo({ merchantPin: pin });
            setUserRole('merchant');
            try {
              localStorage.setItem('qpay_merchant_pin', pin);
            } catch {
              // Ignore localStorage errors
            }
            setTimeout(() => {
              setStep('success');
            }, 250);
          } else {
            setErrorMsg(
              isAr
                ? 'الرمز غير متطابق. يرجى إعادة الإدخال.'
                : 'PINs do not match. Please re-enter.'
            );
            setTimeout(() => {
              setConfirmPin('');
            }, 500);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg('');
    if (step === 'create') {
      setPin((prev) => prev.slice(0, -1));
    } else if (step === 'confirm') {
      if (confirmPin.length > 0) {
        setConfirmPin((prev) => prev.slice(0, -1));
      } else {
        setStep('create');
        setPin('');
      }
    }
  };

  const handleResetPin = () => {
    setPin('');
    setConfirmPin('');
    setErrorMsg('');
    setStep('create');
  };

  const handleOkProceed = () => {
    setIsAuthenticated(true);
    if (fromSettings) {
      goBack();
    } else {
      navigateTo('MERCHANT_HOME');
    }
  };

  // Physical keyboard support
  React.useEffect(() => {
    if (step === 'success') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, pin, confirmPin]);

  const currentPin = step === 'create' ? pin : confirmPin;
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full text-white flex flex-col select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header / Back Navigation */}
      {step !== 'success' && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => {
              if (step === 'confirm') {
                setStep('create');
                setConfirmPin('');
              } else if (fromSettings) {
                goBack();
              } else {
                navigateTo('SMS_OTP');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>
              {step === 'confirm'
                ? isAr
                  ? 'العودة لإدخال الرمز'
                  : 'Back to Enter PIN'
                : isAr
                ? 'السابق'
                : 'Back'}
            </span>
          </button>
        </div>
      )}

      {/* Main Container */}
      {step === 'success' ? (
        /* ======================================================== */
        /* STEP 3: CREATED SUCCESSFULLY MESSAGE SCREEN */
        /* ======================================================== */
        <div className="space-y-5 text-center py-4">
          {/* Animated Success Icon */}
          <div className="w-16 h-16 rounded-full bg-[#00FF24]/10 border border-[#00FF24]/30 flex items-center justify-center text-[#00FF24] mx-auto shadow-xl shadow-[#00FF24]/20">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          {/* Success Heading & Subtitle */}
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {isAr ? 'تم إنشاء الرمز السري بنجاح!' : 'PIN Created Successfully!'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
              {isAr
                ? 'تم تعيين رمز الأمان المكون من ٤ أرقام وتفعيله لعمليات نقاط البيع والتسويات.'
                : 'Your 4-digit Manager Security PIN is now active for SoftPOS transactions, settlements & manager overrides.'}
            </p>
          </div>

          {/* PIN Confirmation Badge */}
          <div className="p-3 bg-[#10182A] border border-slate-800 rounded-xl flex items-center justify-between max-w-xs mx-auto text-xs">
            <span className="text-slate-400">{isAr ? 'حالة الرمز السري' : 'Security PIN Status'}</span>
            <span className="font-bold text-[#00FF24] flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isAr ? 'مفعل ومشفر' : 'Active & Encrypted'}</span>
            </span>
          </div>

          {/* Two Action Buttons: OK and Reset PIN */}
          <div className="space-y-2.5 pt-2 max-w-xs mx-auto w-full">
            {/* 1. OK Button -> Opens Dashboard */}
            <button
              type="button"
              onClick={handleOkProceed}
              className="w-full h-12 rounded-xl bg-[#00FF24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#00FF24]/90 transition-all shadow-lg shadow-[#00FF24]/20 cursor-pointer"
            >
              <span>{isAr ? 'موافق — الدخول للوحة التحكم' : 'OK — Go to Dashboard'}</span>
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            {/* 2. Reset PIN Button -> Opens PIN Reset Flow */}
            <button
              type="button"
              onClick={handleResetPin}
              className="w-full h-11 rounded-xl bg-[#10182A] border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 hover:text-white hover:border-[#00FF24]/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#00FF24]" />
              <span>{isAr ? 'إعادة تعيين الرمز السري' : 'Reset PIN'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* STEPS 1 & 2: ENTER PIN & CONFIRM PIN */
        /* ======================================================== */
        <div className="space-y-4 text-center">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#10182A] border border-slate-800 flex items-center justify-center mx-auto text-[#00FF24]">
            <Lock className="h-6 w-6" />
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {step === 'create'
                ? isAr
                  ? 'تعيين الرمز السري للتاجر'
                  : 'Create Merchant PIN'
                : isAr
                ? 'تأكيد الرمز السري للتاجر'
                : 'Confirm Merchant PIN'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {step === 'create'
                ? isAr
                  ? 'عيّن رمزاً سرياً مكوناً من ٤ أرقام لعمليات نقاط البيع والتسويات'
                  : 'Set a 4-digit security PIN for SoftPOS terminal and settlements'
                : isAr
                ? 'أعد إدخال الرمز المكون من ٤ أرقام للتأكيد'
                : 'Re-enter your 4-digit security PIN to confirm'}
            </p>
          </div>

          {/* PIN Dots Indicator */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="flex items-center gap-4 mb-2">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = idx < currentPin.length;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-150 ${
                      isFilled
                        ? 'bg-[#00FF24] border-2 border-[#00FF24] scale-125 shadow-md shadow-[#00FF24]/40'
                        : 'bg-[#10182A] border-2 border-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {errorMsg && (
              <div className="text-xs font-bold text-rose-400 mt-1 animate-pulse">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Keypad */}
          <div className="w-full max-w-[280px] mx-auto pt-1">
            <div className="grid grid-cols-3 gap-2.5">
              {digits.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleKeyPress(d)}
                  className="h-12 rounded-xl bg-[#10182A] border border-slate-800 text-white font-extrabold text-lg hover:bg-slate-800 hover:border-[#00FF24]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {isAr ? toArabicNumerals(d) : d}
                </button>
              ))}

              <div />

              {/* Zero */}
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-xl bg-[#10182A] border border-slate-800 text-white font-extrabold text-lg hover:bg-slate-800 hover:border-[#00FF24]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                {isAr ? '٠' : '0'}
              </button>

              {/* Delete / Backspace */}
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-xl bg-[#10182A] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-[#00FF24]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <Delete className={`h-5 w-5 ${isRtl ? 'scale-x-[-1]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MerchantPinSetupScreen;
