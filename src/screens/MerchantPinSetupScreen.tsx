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
        <div className="space-y-4 text-center py-4">
          {/* Animated Success Icon */}
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mx-auto shadow-lg shadow-[#D4AF37]/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          {/* Success Heading & Subtitle */}
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {isAr ? 'تم تفعيل الرمز السري!' : 'PIN Set Successfully!'}
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              {isAr
                ? 'تم حفظ رمز الأمان لنقاط البيع والتسويات'
                : 'Your 4-digit PIN is active for SoftPOS & settlements'}
            </p>
          </div>

          {/* Action Buttons: OK and Reset PIN */}
          <div className="space-y-2 pt-2 max-w-xs mx-auto w-full">
            <button
              type="button"
              onClick={handleOkProceed}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F1D77A] to-[#B8972E] text-[#0B0B0B] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-lg shadow-[#D4AF37]/25 cursor-pointer"
            >
              <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleResetPin}
              className="w-full h-10 rounded-xl bg-[#1E1E1E] border border-[#333333] text-neutral-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:text-white hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'إعادة التعيين' : 'Reset PIN'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* STEPS 1 & 2: ENTER PIN & CONFIRM PIN */
        /* ======================================================== */
        <div className="space-y-4 text-center">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#262626] flex items-center justify-center mx-auto text-[#D4AF37]">
            <Lock className="h-6 w-6" />
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {step === 'create'
                ? isAr
                  ? 'تعيين الرمز السري'
                  : 'Set 4-Digit PIN'
                : isAr
                ? 'تأكيد الرمز السري'
                : 'Confirm PIN'}
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              {step === 'create'
                ? isAr
                  ? 'لعمليات نقاط البيع والتسويات'
                  : 'For SoftPOS and settlements'
                : isAr
                ? 'أعد إدخال الرمز للتأكيد'
                : 'Re-enter your 4-digit PIN'}
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
                        ? 'bg-[#D4AF37] border-2 border-[#D4AF37] scale-125 shadow-md shadow-[#D4AF37]/40'
                        : 'bg-[#1E1E1E] border-2 border-[#333333]'
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
                  className="h-12 rounded-xl bg-[#1E1E1E] border border-[#262626] text-white font-extrabold text-lg hover:bg-white/10 hover:border-[#D4AF37]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {isAr ? toArabicNumerals(d) : d}
                </button>
              ))}

              <div />

              {/* Zero */}
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-xl bg-[#1E1E1E] border border-[#262626] text-white font-extrabold text-lg hover:bg-white/10 hover:border-[#D4AF37]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                {isAr ? '٠' : '0'}
              </button>

              {/* Delete / Backspace */}
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 rounded-xl bg-[#1E1E1E] border border-[#262626] text-[#A3A3A3] hover:text-white hover:bg-white/10 hover:border-[#D4AF37]/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
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
