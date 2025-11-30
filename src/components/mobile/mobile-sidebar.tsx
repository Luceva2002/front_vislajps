'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Map,
  Car,
  FileText,
  MapPin,
  Bell,
  Settings,
  Users,
  BarChart3,
  History,
  Wrench,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useSessionStore } from '@/store';
import { toast } from 'sonner';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Map, label: 'Mappa', href: '/' },
  { icon: Car, label: 'Veicoli', href: '/vehicles' },
  { icon: History, label: 'Replay', href: '/replay' },
  { icon: FileText, label: 'Report', href: '/reports' },
  { icon: BarChart3, label: 'Statistiche', href: '/reports/statistics' },
  { icon: MapPin, label: 'Geofence', href: '/geofences' },
  { icon: Bell, label: 'Notifiche', href: '/notifications' },
  { icon: Wrench, label: 'Manutenzioni', href: '/maintenances' },
];

const settingsItems = [
  { icon: Settings, label: 'Impostazioni', href: '/settings' },
  { icon: HelpCircle, label: 'Supporto', href: '/support' },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useSessionStore((state) => state.user);
  const clearSession = useSessionStore((state) => state.clearSession);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    clearSession();
    onClose();
    router.push('/login');
    toast.success('Disconnesso con successo');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-[101] h-full w-[85%] max-w-[320px] bg-card shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b safe-area-top">
          <Logo size="sm" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name || 'Utente'}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Navigazione
            </p>
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Impostazioni
            </p>
            {settingsItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-4 safe-area-bottom">
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-medium">Tema scuro</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Esci
          </Button>
        </div>
      </aside>
    </>
  );
}

