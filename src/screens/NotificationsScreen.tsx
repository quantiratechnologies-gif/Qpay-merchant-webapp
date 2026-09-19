import React, { useState } from 'react';
import { CheckCircle2, Info, BellRing, Bell, Check } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { translateText, formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const NotificationsScreen: React.FC = () => {
  const { notifications, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';

  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [allMarkedRead, setAllMarkedRead] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const unreadCount = allMarkedRead
    ? 0
    : notifications.filter((n) => !readIds.has(n.id) && !n.read).length;

  const handleToggleUnread = () => {
    if (allMarkedRead || unreadCount === 0) {
      setAllMarkedRead(false);
      setReadIds(new Set());
      setToastMessage(isAr ? 'تم تحديد الإشعارات كغير مقروءة' : 'Notifications marked as unread');
    } else {
      setAllMarkedRead(true);
      const allIds = new Set(notifications.map((n) => n.id));
      setReadIds(allIds);
      setToastMessage(isAr ? 'تم تحديد جميع الإشعارات كمقروءة بنجاح' : 'All notifications marked as read');
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleNotificationClick = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

        {/* Interactive Unread / Mark Read Button */}
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={handleToggleUnread}
            className="interactive-tap"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px',
              backgroundColor: unreadCount === 0 ? 'rgba(127, 232, 127, 0.22)' : 'rgba(127, 232, 127, 0.14)',
              border: unreadCount === 0 ? '1.5px solid #7FE87F' : '1px solid rgba(127, 232, 127, 0.3)',
              borderRadius: radii.full,
              color: '#7FE87F',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={unreadCount === 0 ? (isAr ? 'تم قراءة الكل' : 'All read') : (isAr ? 'اضغط لتحديد الكل كمقروء' : 'Click to mark all as read')}
          >
            {unreadCount === 0 ? <Check size={14} strokeWidth={3} /> : <Bell size={13} />}
            <span>
              {unreadCount === 0
                ? (isAr ? 'تم قراءة الكل' : 'All Read')
                : `${formatLocalizedNumber(unreadCount, language)} ${isAr ? 'غير مقروء' : 'Unread'}`}
            </span>
          </button>
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
            const isItemRead = allMarkedRead || readIds.has(notif.id) || notif.read;
            const { icon, color, bg, badge } = getTypeConfig(notif.type);
            return (
              <Card
                key={notif.id}
                variant="elevated"
                style={{
                  padding: '16px 20px',
                  background: isItemRead ? '#0D1424' : '#111726',
                  border: isItemRead ? '1px solid #1E293B' : '1px solid #2C2C44',
                  opacity: isItemRead ? 0.78 : 1,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                className="interactive-tap"
                onClick={() => handleNotificationClick(notif.id)}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isItemRead && (
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#7FE87F',
                            }}
                          />
                        )}
                        <span style={{ fontWeight: 800, fontSize: '14px', color: isItemRead ? '#94A3B8' : '#FFFFFF' }}>
                          {translateText(notif.title, language)}
                        </span>
                      </div>
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#00C853',
            color: '#080C14',
            padding: '12px 24px',
            borderRadius: '30px',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 200, 83, 0.4)',
            zIndex: 9999,
          }}
        >
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default NotificationsScreen;
