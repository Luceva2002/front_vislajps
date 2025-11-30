'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSessionStore } from '@/store';
import { toast } from 'sonner';

export function ProfileView() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useSessionStore((state) => state.user);
  const clearSession = useSessionStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
    toast.success('Disconnesso con successo');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Informazioni personali', href: '/settings/profile' },
        { icon: Shield, label: 'Sicurezza', href: '/settings/security' },
        { icon: Bell, label: 'Notifiche', href: '/settings/notifications' },
      ],
    },
    {
      title: 'Preferenze',
      items: [
        { icon: Palette, label: 'Aspetto', href: '/settings/appearance' },
      ],
    },
    {
      title: 'Supporto',
      items: [
        { icon: HelpCircle, label: 'Centro assistenza', href: '/support' },
        { icon: FileText, label: 'Termini e Privacy', href: '/terms' },
      ],
    },
  ];

  return (
    <div className="pb-6 space-y-6">
      {/* Profile card */}
      <Card className="mx-4 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user?.name || 'Utente'}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            {user?.administrator && (
              <span className="mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Amministratore
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 px-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">4</p>
            <p className="text-xs text-muted-foreground">Veicoli</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">3</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Alert</p>
          </CardContent>
        </Card>
      </div>

      {/* Dark mode toggle */}
      <Card className="mx-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Sun className="h-5 w-5 text-warning" />
                </div>
              )}
              <div>
                <p className="font-medium">Tema scuro</p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Attivo' : 'Disattivo'}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu sections */}
      {menuSections.map((section, idx) => (
        <div key={section.title} className="px-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {section.title}
          </p>
          <Card>
            <CardContent className="p-0 divide-y">
              {section.items.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex items-center justify-between w-full p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Logout */}
      <div className="px-4">
        <Button
          variant="outline"
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Esci dall'account
        </Button>
      </div>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        Visla GPS v1.0.0
      </p>
    </div>
  );
}

