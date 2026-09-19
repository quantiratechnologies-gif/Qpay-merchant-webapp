import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useApp } from '../state/AppContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية';
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in session
    if (sessionStorage.getItem('pwa_prompt_dismissed') === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also detect standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div
      style={{
        margin: '10px 20px 0 20px',
        backgroundColor: '#171717',
        border: '1px solid #262626',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: '#212121',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D4AF37',
            flexShrink: 0,
          }}
        >
          <Download size={18} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            {isAr ? 'تثبيت تطبيق QTPay' : 'Install QTPay'}
          </div>
          <div style={{ fontSize: '11px', color: '#A3A3A3' }}>
            {isAr ? 'تشغيل فوري ووصول مباشر لنقاط البيع' : 'Fast launch & instant access'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleInstallClick}
          className="interactive-tap gold-gradient-btn"
          style={{
            color: '#0B0B0B',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {isAr ? 'تثبيت' : 'Install'}
        </button>
        <button
          onClick={handleDismiss}
          aria-label={isAr ? 'إغلاق إشعار التثبيت' : 'Dismiss install prompt'}
          style={{
            background: 'none',
            border: 'none',
            color: '#737373',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
