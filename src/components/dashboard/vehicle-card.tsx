'use client';

import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Car,
  Truck,
  Bike,
  MapPin,
  Clock,
  Gauge,
  Battery,
  Signal,
  MoreVertical,
  Navigation,
  Power,
  History,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Device, Position } from '@/store';

interface VehicleCardProps {
  device: Device;
  position?: Position;
  isSelected?: boolean;
  onClick?: () => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  truck: Truck,
  motorcycle: Bike,
  default: Car,
};

const statusColors: Record<string, string> = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  unknown: 'bg-warning',
};

const statusLabels: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  unknown: 'Sconosciuto',
};

export function VehicleCard({ device, position, isSelected, onClick }: VehicleCardProps) {
  const Icon = categoryIcons[device.category || 'default'] || categoryIcons.default;
  
  const speed = position?.speed ? Math.round(position.speed * 1.852) : 0; // knots to km/h
  const isMoving = speed > 3;
  
  const lastUpdate = device.lastUpdate
    ? formatDistanceToNow(new Date(device.lastUpdate), { addSuffix: true, locale: it })
    : 'Mai';

  const batteryLevel = position?.attributes?.batteryLevel as number | undefined;
  const ignition = position?.attributes?.ignition as boolean | undefined;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary shadow-md',
        device.disabled && 'opacity-60'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Icon and status */}
          <div className="relative">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                isMoving ? 'bg-accent/20' : 'bg-muted'
              )}
            >
              <Icon className={cn('w-6 h-6', isMoving ? 'text-accent' : 'text-muted-foreground')} />
            </div>
            <div
              className={cn(
                'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card',
                statusColors[device.status]
              )}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{device.name}</h3>
              {isMoving && (
                <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-0">
                  In movimento
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {device.model || device.uniqueId}
            </p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Navigation className="mr-2 h-4 w-4" />
                Traccia
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                Cronologia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Impostazioni
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Position info */}
        {position && (
          <div className="mt-4 space-y-2">
            {/* Address */}
            {position.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground line-clamp-2">{position.address}</span>
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm">
              {/* Speed */}
              <div className="flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className={cn('font-medium', isMoving && 'text-accent')}>
                  {speed} km/h
                </span>
              </div>

              {/* Last update */}
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{lastUpdate}</span>
              </div>

              {/* Ignition */}
              {ignition !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Power
                    className={cn(
                      'h-4 w-4',
                      ignition ? 'text-success' : 'text-muted-foreground'
                    )}
                  />
                </div>
              )}

              {/* Battery */}
              {batteryLevel !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Battery
                    className={cn(
                      'h-4 w-4',
                      batteryLevel > 50
                        ? 'text-success'
                        : batteryLevel > 20
                        ? 'text-warning'
                        : 'text-destructive'
                    )}
                  />
                  <span className="text-muted-foreground">{batteryLevel}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No position */}
        {!position && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Signal className="h-4 w-4" />
            <span>Nessuna posizione disponibile</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

