import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: string;
}

const SIZE_MAP: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-24 h-24 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  rounded = 'rounded-full',
}) => {
  const [failed, setFailed] = useState(false);
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  const showImage = src && src.trim() !== '' && !failed;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${SIZE_MAP[size]} ${rounded} object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`${SIZE_MAP[size]} ${rounded} flex items-center justify-center font-bold flex-shrink-0 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border border-neutral-950 dark:border-white ${className}`}
    >
      {initial}
    </div>
  );
};
