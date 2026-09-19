import React from 'react';
import { CheckCircle2, Info, BellRing, Bell } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { translateText, formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const NotificationsScreen: React.FC = () => {
  const { notifications, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';

  const getTypeConfig = (type: string) => {
    if (type === 'success') return { icon: <CheckCircle2 size={18} />, color: '#7FE87F', bg: 'rgba(127, 232, 127, 0.14)', badge: 'success' as const };
    if (type === 'alert') return { icon: <BellRing size={18} />, color: '#98F598', bg: 'rgba(241, 215, 122, 0.1)', badge: 'warning' as const };
    return { icon: <Info size={18} />, color: '#A2A2BA', bg: 'rgba(163, 163, 163, 0.1)', badge: 'info' as const };
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            {t('notifications', isAr ? 'الإشعارات' : 'Notifications')}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A2A2BA', margin: '6px 0 0 0', fontWeight: 500 }}>
            {isAr ? 'آخر التنبيهات والنشاطات الفورية' : 'Latest alerts and real-time activity feed'}
          </p>
        </div>

        {notifications.length > 0 && (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px',
              backgroundColor: 'rgba(127, 232, 127, 0.14)',
              border: '1px solid rgba(127, 232, 127, 0.3)',
              borderRadius: radii.full,
              color: '#7FE87F',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            <Bell size={13} />
            {formatLocalizedNumber(notifications.length, language)} {isAr ? 'إشعار' : 'Unread'}
          </div>
        )}
      </div>

      {/* ── Notification Feed ────────────────────────────────── */}
      {notifications.length === 0 ? (
        <Card
          variant="elevated"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            background: '#111726',
            border: '1px solid #2C2C44',
          }}
        >
          <div
            style={{
              width: '56px', height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(127, 232, 127, 0.14)',
              color: '#7FE87F',
              border: '1px solid rgba(127, 232, 127, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BellRing size={24} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
            {translateText('No notifications', language)}
          </div>
          <p style={{ fontSize: '13px', color: '#6E6E85', margin: 0 }}>
            {translateText("You're all caught up.", language)}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((notif) => {
            const { icon, color, bg, badge } = getTypeConfig(notif.type);
            return (
              <Card
                key={notif.id}
                variant="elevated"
                style={{ padding: '16px 20px', background: '#111726', border: '1px solid #2C2C44' }}
                className="interactive-tap"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '44px', height: '44px',
                      borderRadius: '12px',
                      backgroundColor: bg,
                      color,
                      border: `1px solid ${color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF' }}>
                        {translateText(notif.title, language)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <StatusBadge status={badge} size="sm" label={notif.type === 'success' ? (isAr ? 'نجاح' : 'Success') : notif.type === 'alert' ? (isAr ? 'تنبيه' : 'Alert') : (isAr ? 'معلومة' : 'Info')} />
                        <span style={{ fontSize: '11px', color: '#6E6E85', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {translateText(notif.timestamp, language)}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#A2A2BA', lineHeight: '1.5' }}>
                      {translateText(notif.description, language)}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
