import React, { useState, useEffect } from 'react';
import { Lock, Delete, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';

export const ManagerPinModal: React.FC = () => {
  const {
    isManagerPinModalOpen,
    managerPinModalData,
    closeManagerPinModal,
    verifyMerchantPin,
    merchantInfo,
    navigateTo,
    language,
    isRtl,
  } = useApp();

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isAr = language === 'العربية';
  const hasPin = Boolean((merchantInfo.merchantPin || localStorage.getItem('qpay_merchant_pin') || '').trim());

  const handleClose = () => {
    setPin('');
    setErrorMsg('');
    setIsSuccess(false);
    closeManagerPinModal();
  };

  const handleKeyPress = (digit: string) => {
    if (isSuccess || !hasPin) return;
    setErrorMsg('');

    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === 4) {
        if (verifyMerchantPin(nextPin)) {
          setIsSuccess(true);
          setTimeout(() => {
            if (managerPinModalData) {
              managerPinModalData.onSuccess();
            }
            handleClose();
          }, 600);
        } else {
          setErrorMsg(
            isAr
              ? 'رمز PIN غير صحيح. يرجى المحاولة مرة أخرى.'
              : 'Incorrect Security PIN. Please try again.'
          );
          setTimeout(() => {
            setPin('');
          }, 700);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isSuccess || !hasPin) return;
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  // Physical keyboard support for desktop web
  useEffect(() => {
    if (!isManagerPinModalOpen || !managerPinModalData || !hasPin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManagerPinModalOpen, managerPinModalData, pin, isSuccess, hasPin]);

  if (!isManagerPinModalOpen || !managerPinModalData) return null;

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        className="slide-up"
        style={{
          width: '100%',
          maxWidth: '360px',
          borderRadius: '24px',
          padding: '24px 20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#111726',
          border: '1px solid rgba(127, 232, 127, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(127, 232, 127, 0.14)',
          boxSizing: 'border-box',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSuccess}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            [isRtl ? 'left' : 'right']: '16px',
            color: '#A2A2BA',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            padding: '6px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Security Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            backgroundColor: isSuccess ? 'rgba(127, 232, 127, 0.2)' : '#1F1F1F',
            border: `1.5px solid ${isSuccess ? '#7FE87F' : 'rgba(127, 232, 127, 0.25)'}`,
            color: '#7FE87F',
          }}
        >
          {isSuccess ? <CheckCircle2 size={30} /> : <Lock size={26} />}
        </div>

        {/* Title & Subtitle */}
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', margin: '0 0 4px 0' }}>
          {managerPinModalData.title}
        </h3>
        <p style={{ fontSize: '12px', color: '#A2A2BA', textAlign: 'center', margin: '0 0 20px 0', padding: '0 8px', lineHeight: 1.4 }}>
          {managerPinModalData.subtitle ||
            (isAr
              ? 'أدخل رمز المدير السري المكون من ٤ أرقام للمتابعة'
              : 'Enter 4-digit Manager Security PIN to authorize')}
        </p>

        {!hasPin ? (
          /* When no PIN is set, prompt user to set MPIN first */
          <div style={{ width: '100%', textAlign: 'center', marginTop: '4px' }}>
            <div
              style={{
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '16px',
                color: '#FACC15',
                fontSize: '12.5px',
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <ShieldAlert size={16} />
                <span>{isAr ? 'يرجى تعيين رمز التاجر السري أولاً' : 'Please set your MPIN first'}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#E2E8F0', fontWeight: 500 }}>
                {isAr
                  ? 'لم يتم تعيين رمز أمان للمتجر بعد. يرجى إنشاء الرمز للمتابعة.'
                  : 'No manager PIN is configured yet. Please create your 4-digit PIN to authorize actions.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClose();
                navigateTo('MERCHANT_PIN_SETUP', { fromSettings: true });
              }}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7FE87F 0%, #00C853 100%)',
                color: '#080C14',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(127, 232, 127, 0.3)',
              }}
            >
              <span>{isAr ? 'تعيين الرمز السري' : 'Set MPIN Now'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* 4-digit Pin Dots */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }} dir="ltr">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isFilled ? '#7FE87F' : 'transparent',
                      border: isFilled ? '2px solid #7FE87F' : '2px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: isFilled ? '0 0 12px rgba(127, 232, 127, 0.6)' : 'none',
                      transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  color: '#FB7185',
                  fontWeight: 700,
                  marginBottom: '12px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                }}
              >
                <ShieldAlert size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Keypad */}
            <div
              style={{
                width: '100%',
                maxWidth: '260px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginTop: '8px',
              }}
            >
              {digits.map((d) => (
                <button
                  key={d}
                  type="button"
                  disabled={isSuccess}
                  onClick={() => handleKeyPress(d)}
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    backgroundColor: '#151524',
                    border: '1px solid #3A3A52',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {isAr ? toArabicNumerals(d) : d}
                </button>
              ))}

              {/* Empty slot */}
              <div />

              {/* Zero */}
              <button
                type="button"
                disabled={isSuccess}
                onClick={() => handleKeyPress('0')}
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  backgroundColor: '#151524',
                  border: '1px solid #3A3A52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {isAr ? toArabicNumerals('0') : '0'}
              </button>

              {/* Delete */}
              <button
                type="button"
                disabled={isSuccess}
                onClick={handleDelete}
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  color: '#A2A2BA',
                  backgroundColor: '#151524',
                  border: '1px solid #3A3A52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Delete size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerPinModal;
