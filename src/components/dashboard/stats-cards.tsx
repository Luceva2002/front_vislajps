'use client';

import { Car, Wifi, WifiOff, Navigation, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDevicesStore, useSessionStore, useEventsStore } from '@/store';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function StatCard({ title, value, icon, description, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-muted/50',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${variantStyles[variant]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const devices = useDevicesStore((state) => state.items);
  const positions = useSessionStore((state) => state.positions);
  const events = useEventsStore((state) => state.items);

  const deviceList = Object.values(devices);
  const positionList = Object.values(positions);

  const totalDevices = deviceList.length;
  const onlineDevices = deviceList.filter((d) => d.status === 'online').length;
  const offlineDevices = deviceList.filter((d) => d.status === 'offline').length;
  const movingDevices = positionList.filter((p) => p.speed > 2).length;
  const recentAlerts = events.filter((e) => {
    const eventTime = new Date(e.eventTime);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return eventTime > oneHourAgo;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Veicoli Totali"
        value={totalDevices}
        icon={<Car className="w-6 h-6 text-primary" />}
        description={`${onlineDevices} online`}
      />
      <StatCard
        title="Online"
        value={onlineDevices}
        icon={<Wifi className="w-6 h-6" />}
        description={`${Math.round((onlineDevices / totalDevices) * 100) || 0}% della flotta`}
        variant="success"
      />
      <StatCard
        title="In Movimento"
        value={movingDevices}
        icon={<Navigation className="w-6 h-6" />}
        description="Veicoli attivi"
        variant="default"
      />
      <StatCard
        title="Alert Recenti"
        value={recentAlerts}
        icon={<AlertTriangle className="w-6 h-6" />}
        description="Ultima ora"
        variant={recentAlerts > 0 ? 'warning' : 'default'}
      />
    </div>
  );
}

