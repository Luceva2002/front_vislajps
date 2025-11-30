'use client';

import { Map, Car, User, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'map' | 'vehicles' | 'notifications' | 'profile';

interface BottomDockProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  notificationCount?: number;
}

const tabs = [
  { id: 'map' as TabId, label: 'Mappa', icon: Map },
  { id: 'vehicles' as TabId, label: 'Veicoli', icon: Car },
  { id: 'notifications' as TabId, label: 'Notifiche', icon: Bell },
  { id: 'profile' as TabId, label: 'Profilo', icon: User },
];

export function BottomDock({ activeTab, onTabChange, notificationCount = 0 }: BottomDockProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 relative',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className={cn(
                'relative p-1.5 rounded-xl transition-all duration-200',
                isActive && 'bg-primary/10'
              )}>
                <Icon className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} />
                {tab.id === 'notifications' && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-1">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-70'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

