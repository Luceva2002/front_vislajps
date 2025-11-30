'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl' },
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg',
          sizes[size].icon
        )}
      >
        {/* GPS Marker Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[60%] h-[60%] text-white"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" fill="currentColor" />
        </svg>
        {/* Signal waves */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
              sizes[size].text
            )}
          >
            Visla GPS
          </span>
          {size === 'lg' && (
            <span className="text-xs text-muted-foreground">
              Vehicle Tracking System
            </span>
          )}
        </div>
      )}
    </div>
  );
}

