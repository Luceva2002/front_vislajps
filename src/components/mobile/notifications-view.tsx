'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Bell,
  MapPin,
  AlertTriangle,
  Zap,
  Car,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  type: 'geofence' | 'speed' | 'ignition' | 'alarm' | 'offline';
  title: string;
  message: string;
  deviceName: string;
  time: Date;
  read: boolean;
}

// Demo notifications
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'geofence',
    title: 'Ingresso geofence',
    message: 'Il veicolo è entrato nell\'area "Sede Milano"',
    deviceName: 'Furgone Milano',
    time: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: 'speed',
    title: 'Velocità eccessiva',
    message: 'Superamento limite: 95 km/h (limite: 80 km/h)',
    deviceName: 'Camion Torino',
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: 'ignition',
    title: 'Accensione veicolo',
    message: 'Il veicolo è stato acceso',
    deviceName: 'Auto Commerciale',
    time: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
  },
  {
    id: 4,
    type: 'offline',
    title: 'Veicolo offline',
    message: 'Connessione persa da più di 30 minuti',
    deviceName: 'Moto Corriere',
    time: new Date(Date.now() - 60 * 60 * 1000),
    read: true,
  },
  {
    id: 5,
    type: 'geofence',
    title: 'Uscita geofence',
    message: 'Il veicolo è uscito dall\'area "Deposito"',
    deviceName: 'Furgone Milano',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
  },
];

const typeConfig = {
  geofence: { icon: MapPin, color: 'text-primary', bg: 'bg-primary/10' },
  speed: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  ignition: { icon: Zap, color: 'text-success', bg: 'bg-success/10' },
  alarm: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  offline: { icon: Car, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function NotificationsView() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-14 bg-background/95 backdrop-blur z-10">
        <div>
          <h2 className="font-semibold">Notifiche</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} non lette</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Segna tutte
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="px-4 space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Nessuna notifica</h3>
              <p className="text-sm text-muted-foreground">
                Le notifiche appariranno qui
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            
            return (
              <Card
                key={notification.id}
                className={cn(
                  'overflow-hidden transition-all',
                  !notification.read && 'border-l-4 border-l-primary'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.bg)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.deviceName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.time, { addSuffix: true, locale: it })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Segna come letta
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

