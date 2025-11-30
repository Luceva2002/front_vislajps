'use client';

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
  notificationCount?: number;
}

export function MobileHeader({ onMenuClick, title, notificationCount = 0 }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {title ? (
          <h1 className="font-semibold text-lg">{title}</h1>
        ) : (
          <Logo size="sm" />
        )}
        
        <Button variant="ghost" size="icon" className="h-10 w-10 relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold bg-destructive text-destructive-foreground rounded-full px-1">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

