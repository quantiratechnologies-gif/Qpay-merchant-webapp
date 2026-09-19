import React from 'react';
import { Smartphone, Monitor, LogOut, Lock } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber, translateText } from '../utils/i18n';
import { Card, StatusBadge } from '../components/ui';
import { colors } from '../design-system/tokens';

export const SecurityScreen: React.FC = () => {
  const { deviceSessions, terminateSession, navigateTo, language, isRtl } = useApp();
  const isAr = language === 'العربية';

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
          {isAr ? 'الأمان والأجهزة' : 'Security & Devices'}
        </h1>
        <p style={{ fontSize: '13px', color: '#A3A3A3', margin: '4px 0 0 0', fontWeight: 500 }}>
          {isAr ? 'إدارة الجلسات وإعدادات الأمان' : 'Active sessions and security'}
        </p>
      </div>

      {/* ── Main Layout: PIN & Active Devices ────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '100%' }}>
        {/* Manager Security PIN Card */}
        <Card
          variant="elevated"
          style={{
            padding: '18px 20px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backgroundColor: '#171717',
            background: 'linear-gradient(145deg, #171717 0%, #111111 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#FFFFFF' }}>
                {isAr ? 'رمز المدير السري (PIN)' : 'Manager PIN'}
              </div>
              <div style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '2px' }}>
                {isAr ? 'مطلوب للتسويات وعمليات الاسترداد' : 'Required for settlements & refunds'}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('MERCHANT_PIN_SETUP', { fromSettings: true })}
            className="interactive-tap cursor-pointer"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#D4AF37',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {isAr ? 'تغيير الرمز' : 'Change PIN'}
          </button>
        </Card>

        {/* Section Label */}
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isAr ? 'الأجهزة النشطة' : 'Active Devices'} ({formatLocalizedNumber(deviceSessions.length, language)})
        </div>

        <Card variant="elevated" style={{ padding: 0, overflow: 'hidden', background: '#171717', border: '1px solid #262626' }}>
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 90px',
              padding: '11px 20px',
              backgroundColor: '#121212',
              borderBottom: '1px solid #262626',
              gap: '12px',
            }}
          >
            {[
              isAr ? 'الجهاز' : 'Device',
              isAr ? 'الموقع' : 'Location',
              isAr ? 'آخر نشاط' : 'Last Active',
              isAr ? 'إجراء' : 'Action',
            ].map((col, i) => (
              <span
                key={i}
                style={{
                  fontSize: '10.5px', fontWeight: 700,
                  color: '#737373', textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  textAlign: i === 3 ? 'right' : 'left',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Table Rows */}
          {deviceSessions.map((session, index) => (
            <div
              key={session.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 90px',
                padding: '15px 20px',
                borderBottom: index < deviceSessions.length - 1 ? '1px solid #262626' : 'none',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: session.isCurrent ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
              }}
            >
              {/* Device col */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '12px',
                    backgroundColor: session.isCurrent ? 'rgba(212, 175, 55, 0.15)' : '#1E1E1E',
                    color: session.isCurrent ? '#D4AF37' : '#737373',
                    border: `1px solid ${session.isCurrent ? 'rgba(212, 175, 55, 0.35)' : '#262626'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {session.deviceType === 'mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#FFFFFF' }}>
                    {session.deviceName}
                  </div>
                  {session.isCurrent && (
                    <div style={{ marginTop: '2px' }}>
                      <StatusBadge status="success" size="sm" label={translateText('Current', language)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <span style={{ fontSize: '12.5px', color: '#A3A3A3' }}>{session.location}</span>

              {/* Last Active */}
              <span style={{ fontSize: '12.5px', color: '#A3A3A3' }}>
                {translateText(session.lastActive, language)}
              </span>

              {/* Action */}
              <div style={{ textAlign: 'right' }}>
                {session.isCurrent ? (
                  <span
                    style={{
                      fontSize: '10.5px', fontWeight: 800,
                      color: '#0B0B0B', backgroundColor: '#D4AF37',
                      padding: '4px 10px', borderRadius: '10px',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}
                  >
                    {translateText('Current', language)}
                  </span>
                ) : (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="interactive-tap cursor-pointer"
                    style={{
                      backgroundColor: '#1E1E1E',
                      border: '1px solid #3D1A1A',
                      color: '#EF4444',
                      padding: '5px 12px',
                      borderRadius: '10px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <LogOut size={11} />
                    {translateText('End', language)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
