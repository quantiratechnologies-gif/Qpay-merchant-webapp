import React, { useState } from 'react';
import { Wifi, Camera, MapPin, Radio, Bell, ShieldCheck, ArrowRight, Landmark, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';

export const PermissionsScreen: React.FC = () => {
  const { navigateTo, goBack, t, isRtl, language } = useApp();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    nfc: true,
    camera: true,
    location: true,
    bluetooth: true,
    notifications: true,
  });
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [discoveryStep, setDiscoveryStep] = useState<number>(0);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const permissions = [
    {
      key: 'nfc',
      icon: <Wifi size={19} />,
      name: language === 'العربية' ? 'الدفع باللمس (NFC)' : 'NFC SoftPOS',
      required: true,
    },
    {
      key: 'camera',
      icon: <Camera size={19} />,
      name: language === 'العربية' ? 'كاميرا مسح الرمز' : 'QR Scanner',
      required: true,
    },
    {
      key: 'location',
      icon: <MapPin size={19} />,
      name: language === 'العربية' ? 'الموقع الجغرافي' : 'Location',
      required: true,
    },
    {
      key: 'bluetooth',
      icon: <Radio size={19} />,
      name: language === 'العربية' ? 'مكبر الصوت (SoundBox)' : 'SoundBox Bluetooth',
      required: false,
    },
    {
      key: 'notifications',
      icon: <Bell size={19} />,
      name: language === 'العربية' ? 'إشعارات التحصيل' : 'Notifications',
      required: false,
    },
  ];

  const handleGrantPermissions = () => {
    try {
      localStorage.setItem('hasGrantedPermissions', 'true');
      localStorage.setItem('hasCompletedOnboarding', 'true');
    } catch {
      // Ignore
    }

    setIsDiscovering(true);
    setDiscoveryStep(1);

    setTimeout(() => {
      setDiscoveryStep(2);
    }, 700);

    setTimeout(() => {
      navigateTo('MERCHANT_SETUP');
    }, 1400);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B0B', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '32px', color: '#FFFFFF' }}>
      <div>
        <AppHeader title={language === 'العربية' ? 'الصلاحيات' : 'Permissions'} showBack={true} onBack={goBack} showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Header Card */}
          <div
            style={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {language === 'العربية' ? 'صلاحيات نقطة البيع' : 'Device Permissions'}
                </div>
                <div style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '2px' }}>
                  {language === 'العربية' ? 'لتفعيل الدفع عبر NFC ومسح الرمز' : 'Enable NFC & QR payments'}
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Permissions Card */}
          <div
            style={{
              backgroundColor: '#171717',
              borderRadius: '16px',
              border: '1px solid #262626',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            {permissions.map((perm, index) => {
              const isOn = toggles[perm.key];
              return (
                <React.Fragment key={perm.key}>
                  {index > 0 && <div style={{ height: '1px', backgroundColor: '#262626', margin: '0 16px' }} />}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: isOn ? 'rgba(212, 175, 55, 0.12)' : '#1F1F1F',
                          color: isOn ? '#D4AF37' : '#737373',
                          border: isOn ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid #262626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {perm.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#FFFFFF' }}>
                          {perm.name}
                        </span>
                        {perm.required && (
                          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(212, 175, 55, 0.12)', color: '#D4AF37', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                            {language === 'العربية' ? 'إلزامي' : 'REQUIRED'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <div
                      role="switch"
                      aria-checked={isOn}
                      aria-label={perm.name}
                      tabIndex={0}
                      onClick={() => handleToggle(perm.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggle(perm.key);
                        }
                      }}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '9999px',
                        backgroundColor: isOn ? '#D4AF37' : '#1F1F1F',
                        border: isOn ? 'none' : '1px solid #262626',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0,
                        direction: 'ltr',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: isOn ? '#0B0B0B' : '#737373',
                          transform: isOn ? 'translateX(20px)' : 'translateX(0px)',
                          transition: 'transform 0.2s ease',
                          boxShadow: 'none',
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <PrimaryButton onClick={handleGrantPermissions}>
          {language === 'العربية' ? 'تفعيل ومتابعة' : 'Enable & Continue'}{' '}
          <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
        <SecondaryButton onClick={handleGrantPermissions}>
          {language === 'العربية' ? 'تخطي' : 'Skip'}
        </SecondaryButton>
      </div>

      {/* Interactive Terminal Initialization Modal */}
      {isDiscovering && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#171717',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '24px 20px',
              width: '100%',
              maxWidth: '320px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              {discoveryStep === 1 ? <Loader2 size={26} className="animate-spin" /> : <CheckCircle2 size={30} color="#D4AF37" />}
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
              {discoveryStep === 1 ? (language === 'العربية' ? 'تهيئة نقطة البيع...' : 'Setting up POS...') : (language === 'العربية' ? 'جاهز!' : 'Ready!')}
            </h3>

            <p style={{ fontSize: '12px', color: '#A3A3A3', margin: 0 }}>
              {discoveryStep === 1 ? (language === 'العربية' ? 'تأمين الاتصال' : 'Securing NFC connection') : (language === 'العربية' ? 'تم تفعيل الخدمة' : 'POS ready')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
