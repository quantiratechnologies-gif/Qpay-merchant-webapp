import React from 'react';
import { Logo } from './Logo';

interface AlphPayLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'splash' | 'header';
  size?: number;
  themeMode?: 'light' | 'dark';
  className?: string;
}

export const AlphPayLogo: React.FC<AlphPayLogoProps> = ({
  variant = 'full',
  size,
  themeMode = 'dark',
  className = '',
}) => {
  const height = size || (variant === 'splash' ? 44 : variant === 'header' ? 24 : 32);
  const showText = variant !== 'icon';

  return (
    <Logo
      height={height}
      showText={showText}
      textColor={themeMode === 'dark' ? '#FFFFFF' : '#0B0B14'}
      accentColor="#00FF24"
      className={className}
    />
  );
};
export default AlphPayLogo;
