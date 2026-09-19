import React from 'react';
import { Volume2, Radio, Play, Wifi, Info } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { Card } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const SoundBoxNotifierScreen: React.FC = () => {
  const {
    soundBoxLanguage,
    setSoundBoxLanguage,
    soundBoxVolume,
    setSoundBoxVolume,
    speakSoundBox,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  const handlePlayTest = (amount: number) => {
    speakSoundBox(amount);
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
          {isAr ? 'صندوق الصوت' : 'SoundBox'}
        </h1>
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '4px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'إعداد الإشعارات الصوتية الفورية للمدفوعات' : 'Instant audio payment notifications'}
        </p>
      </div>

      {/* ── 2-Column Desktop Layout ──────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT PANEL: Device Visual + Status ──────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Device Card */}
          <Card
            variant="elevated"
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              background: 'radial-gradient(ellipse at top, rgba(127, 232, 127, 0.08) 0%, #111726 70%)',
              border: '1px solid #2C2C44',
            }}
          >
            {/* 3D Speaker Graphic */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '36px',
                background: 'linear-gradient(145deg, #182236 0%, #111726 50%, #080C14 100%)',
                border: '2px solid rgba(127, 232, 127, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 0 36px rgba(127, 232, 127, 0.14)',
              }}
            >
              {/* Status LED */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#7FE87F',
                  boxShadow: '0 0 8px #7FE87F',
                }}
              />

              {/* Speaker grille */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#111111',
                  border: '2px solid #2C2C44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={44} color="#7FE87F" />
              </div>

              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#A2A2BA', marginTop: '10px' }}>
                SoundBox Pro
              </span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: <Wifi size={13} />, label: isAr ? 'متصل' : 'Online', gold: true },
                { icon: <Radio size={13} />, label: isAr ? 'نشط' : 'Active', gold: true },
                { icon: <Volume2 size={13} />, label: `${formatLocalizedNumber(soundBoxVolume, language)}%`, gold: false },
              ].map(({ icon, label, gold }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 12px',
                    borderRadius: radii.full,
                    backgroundColor: gold ? 'rgba(127, 232, 127, 0.12)' : '#151524',
                    border: `1px solid ${gold ? 'rgba(127, 232, 127, 0.3)' : '#2C2C44'}`,
                    color: gold ? '#7FE87F' : '#A2A2BA',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </Card>

          {/* Hardware Info Card */}
          <Card variant="elevated" style={{ padding: '18px 20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Info size={14} color="#7FE87F" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#A2A2BA', letterSpacing: '0.04em' }}>
                {isAr ? 'تفاصيل الجهاز' : 'Device Info'}
              </span>
            </div>

            {[
              { label: isAr ? 'الموديل' : 'Model', value: 'QTPay SoundBox Pro' },
              { label: isAr ? 'الإصدار' : 'Firmware', value: 'v2.4.1' },
              { label: isAr ? 'الرقم التسلسلي' : 'Serial', value: 'QSB-2026-0041', mono: true },
              { label: isAr ? 'الاعتماد' : 'Certification', value: 'SAMA Certified' },
              { label: isAr ? 'الاتصال' : 'Network', value: 'Wi-Fi + 4G LTE' },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #2C2C44',
                }}
              >
                <span style={{ fontSize: '12px', color: '#A2A2BA', fontWeight: 500 }}>{label}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: mono ? 'monospace' : undefined,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* ─── RIGHT PANEL: Controls ───────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Volume Control */}
          <Card variant="elevated" style={{ padding: '20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'مستوى الصوت' : 'Volume'}
                </div>
                <div style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '2px' }}>
                  {isAr ? 'التحكم في شدة الصوت' : 'Adjust speaker volume'}
                </div>
              </div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#7FE87F',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatLocalizedNumber(soundBoxVolume, language)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={soundBoxVolume}
              onChange={(e) => setSoundBoxVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#7FE87F', cursor: 'pointer', height: '6px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#6E6E85' }}>{formatLocalizedNumber(0, language)}%</span>
              <span style={{ fontSize: '11px', color: '#6E6E85' }}>{formatLocalizedNumber(100, language)}%</span>
            </div>
          </Card>

          {/* Voice Language Selector */}
          <Card variant="elevated" style={{ padding: '20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {isAr ? 'لغة الصوت' : 'Voice Language'}
            </div>
            <div style={{ fontSize: '12px', color: '#A2A2BA', marginBottom: '14px' }}>
              {isAr ? 'لغة الإعلانات الصوتية' : 'Default voice for alerts'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'ar', flag: '🇸🇦', label: isAr ? 'العربية' : 'Arabic' },
                { id: 'en', flag: '🇬🇧', label: isAr ? 'الإنجليزية' : 'English' },
              ].map(({ id, flag, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSoundBoxLanguage(id as 'ar' | 'en')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: soundBoxLanguage === id ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                    border: `1.5px solid ${soundBoxLanguage === id ? '#7FE87F' : '#2C2C44'}`,
                    borderRadius: radii.lg,
                    padding: '12px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{flag}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: soundBoxLanguage === id ? '#7FE87F' : '#FFFFFF' }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Audio Test Panel */}
          <Card variant="elevated" style={{ padding: '20px', background: '#111726', border: '1px solid #2C2C44' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {isAr ? 'اختبار الصوت' : 'Audio Test'}
            </div>
            <div style={{ fontSize: '12px', color: '#A2A2BA', marginBottom: '14px' }}>
              {isAr ? 'تجربة إعلان المبالغ' : 'Test voice announcements'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[25, 150, 480, 1200, 5000, 9999].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePlayTest(amt)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#151524',
                    border: '1px solid #2C2C44',
                    borderRadius: radii.md,
                    padding: '10px 8px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    transition: 'border-color 0.12s ease',
                  }}
                >
                  <Play size={11} color="#7FE87F" fill="#7FE87F" />
                  {formatSaudiCurrency(amt, language)}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
