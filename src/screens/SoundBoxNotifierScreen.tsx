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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
          {isAr ? 'مكبر الصوت الذكي للتحصيلات' : 'QTPay Smart SoundBox'}
        </h1>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr
            ? 'تكوين وإعداد جهاز الإعلان الصوتي الفوري للمدفوعات'
            : 'Configure instant payment audio announcements for your POS'}
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
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.07) 0%, #111726 70%)',
            }}
          >
            {/* 3D Speaker Graphic */}
            <div
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '40px',
                background: 'linear-gradient(145deg, #1C1C2E 0%, #111726 50%, #080C14 100%)',
                border: '2px solid #1E293B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 0 48px rgba(0, 200, 83, 0.18)',
              }}
            >
              {/* Status LED */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#00FF24',
                  boxShadow: '0 0 10px #00FF24',
                }}
              />

              {/* Speaker grille */}
              <div
                style={{
                  width: '112px',
                  height: '112px',
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  border: '2px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={50} color="#00FF24" />
              </div>

              <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginTop: '12px' }}>
                SoundBox Pro v2.4
              </span>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: <Wifi size={13} />, label: isAr ? 'متصل بالإنترنت' : 'Online', green: true },
                { icon: <Radio size={13} />, label: isAr ? 'يعمل بكفاءة' : 'Active', green: true },
                { icon: <Volume2 size={13} />, label: `${formatLocalizedNumber(soundBoxVolume, language)}%`, green: false },
              ].map(({ icon, label, green }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px',
                    borderRadius: radii.full,
                    backgroundColor: green ? 'rgba(0, 200, 83, 0.1)' : colors.bgInset,
                    border: `1px solid ${green ? 'rgba(0, 200, 83, 0.3)' : colors.border}`,
                    color: green ? colors.accentGreen : colors.textSecondary,
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
          <Card variant="elevated" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Info size={15} color={colors.accentGreen} />
              <span style={{ fontSize: '12px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {isAr ? 'معلومات الجهاز' : 'DEVICE DETAILS'}
              </span>
            </div>

            {[
              { label: isAr ? 'الموديل' : 'Model', value: 'QTPay SoundBox Pro' },
              { label: isAr ? 'الإصدار' : 'Firmware', value: 'v2.4.1-stable' },
              { label: isAr ? 'رقم التسلسل' : 'Serial', value: 'QSB-2026-SA-0041', mono: true },
              { label: isAr ? 'معيار' : 'Standard', value: 'SAMA Certified' },
              { label: isAr ? 'الشبكة' : 'Network', value: 'Wi-Fi 6 + 4G LTE' },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span style={{ fontSize: '12.5px', color: colors.textSecondary, fontWeight: 500 }}>{label}</span>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: colors.textPrimary,
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
          <Card variant="elevated" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: colors.textPrimary }}>
                  {isAr ? 'مستوى الصوت' : 'Announcement Volume'}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '3px' }}>
                  {isAr ? 'يطبق على جميع إعلانات الدفع' : 'Applied to all payment announcements'}
                </div>
              </div>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: colors.accentGreen,
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
              style={{ width: '100%', accentColor: '#00FF24', cursor: 'pointer', height: '6px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: colors.textMuted }}>0%</span>
              <span style={{ fontSize: '11px', color: colors.textMuted }}>100%</span>
            </div>
          </Card>

          {/* Voice Language Selector */}
          <Card variant="elevated" style={{ padding: '22px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: colors.textPrimary, marginBottom: '6px' }}>
              {isAr ? 'لغة النطق الصوتي' : 'Voice Announcement Language'}
            </div>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '16px' }}>
              {isAr ? 'اختر لغة المتحدث الافتراضية للإعلانات' : 'Choose the default voice language for announcements'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'ar', flag: '🇸🇦', label: 'العربية (Arabic)', sub: isAr ? 'صوت عربي فصيح' : 'Native Arabic TTS' },
                { id: 'en', flag: '🇬🇧', label: 'English', sub: isAr ? 'صوت إنجليزي' : 'English TTS' },
              ].map(({ id, flag, label, sub }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSoundBoxLanguage(id as 'ar' | 'en')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: soundBoxLanguage === id ? 'rgba(0, 200, 83, 0.08)' : colors.bgInset,
                    border: `1.5px solid ${soundBoxLanguage === id ? colors.accentGreen : colors.border}`,
                    borderRadius: radii.lg,
                    padding: '14px 16px',
                    color: colors.textPrimary,
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>{flag}</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: soundBoxLanguage === id ? colors.accentGreen : colors.textPrimary }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '2px' }}>{sub}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Audio Test Panel */}
          <Card variant="elevated" style={{ padding: '22px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: colors.textPrimary, marginBottom: '6px' }}>
              {isAr ? 'اختبار النطق الصوتي للمبالغ' : 'Trigger Audio Test Announcement'}
            </div>
            <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '16px' }}>
              {isAr
                ? 'اضغط على أي مبلغ لتشغيل الإعلان الصوتي الفوري'
                : 'Tap any amount to play an instant audio announcement'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[25, 150, 480, 1200, 5000, 9999].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePlayTest(amt)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: colors.bgInset,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.md,
                    padding: '12px 8px',
                    color: colors.textPrimary,
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    transition: 'border-color 0.12s ease',
                  }}
                >
                  <Play size={12} color="#00FF24" fill="#00FF24" />
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
