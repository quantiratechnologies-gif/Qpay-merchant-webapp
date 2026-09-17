import React from 'react';
import { Logo } from './Logo';

interface QtPayLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'splash' | 'header';
  size?: number;
  showTagline?: boolean;
  themeMode?: 'light' | 'dark' | 'green';
  className?: string;
  style?: React.CSSProperties;
}

export const QtPayLogo: React.FC<QtPayLogoProps> = ({
  variant = 'full',
  size,
  showTagline = false,
  themeMode = 'dark',
  className = '',
  style = {},
}) => {
  const height = size || (variant === 'splash' ? 52 : variant === 'header' ? 26 : 34);
  const showText = variant !== 'icon';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        ...style,
      }}
      className={className}
    >
      <Logo
        height={height}
        showText={showText}
        textColor={themeMode === 'light' ? '#0B0B14' : '#FFFFFF'}
        accentColor="#00FF24"
      />
      {showTagline && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            color: '#00FF24',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginTop: '4px',
          }}
        >
          QUICK. TRUSTED. PAYMENTS.
        </span>
      )}
    </div>
  );
};
export default QtPayLogo;
