import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../state/AppContext';

interface ListRowProps {
  icon?: React.ReactNode;
  label: string;
  subLabel?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export const ListRow: React.FC<ListRowProps> = ({
  icon,
  label,
  subLabel,
  rightElement,
  onClick,
  danger = false,
}) => {
  const { t, isRtl } = useApp();
  const displayLabel = t(label, label);
  const displaySubLabel = subLabel ? t(subLabel, subLabel) : undefined;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      className={onClick ? 'interactive-tap' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        backgroundColor: '#111726',
        border: '1px solid #2C2C44',
        borderRadius: '12px',
        marginBottom: '10px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        boxShadow: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: danger ? 'rgba(239, 68, 68, 0.12)' : '#182236',
              color: danger ? '#EF4444' : '#7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${danger ? '#EF4444' : '#2C2C44'}`,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: '14.5px',
              fontWeight: 700,
              color: danger ? '#EF4444' : '#FFFFFF',
            }}
          >
            {displayLabel}
          </div>
          {displaySubLabel && (
            <div style={{ fontSize: '11.5px', color: '#A2A2BA', marginTop: '2px' }}>
              {displaySubLabel}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {rightElement}
        {onClick && !rightElement && (
          <ChevronRight size={18} color="#6E6E85" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        )}
      </div>
    </div>
  );
};
