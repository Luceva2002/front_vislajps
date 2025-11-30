'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Car,
  Edit,
  Trash2,
  MapPin,
  History,
  Settings,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useDevicesStore, useSessionStore } from '@/store';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  online: { label: 'Online', variant: 'default' },
  offline: { label: 'Offline', variant: 'secondary' },
  unknown: { label: 'Sconosciuto', variant: 'outline' },
};

export default function VehiclesPage() {
  const devices = useDevicesStore((state) => state.items);
  const positions = useSessionStore((state) => state.positions);
  const selectDevice = useDevicesStore((state) => state.selectDevice);
  
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const deviceList = Object.values(devices);
  
  const filteredDevices = deviceList.filter((device) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      device.name.toLowerCase().includes(searchLower) ||
      device.uniqueId.toLowerCase().includes(searchLower) ||
      device.model?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Veicoli</h1>
          <p className="text-muted-foreground">
            Gestisci i veicoli della tua flotta
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi veicolo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi nuovo veicolo</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli del nuovo veicolo da monitorare
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome veicolo</Label>
                <Input id="name" placeholder="Es: Auto aziendale 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniqueId">ID Dispositivo</Label>
                <Input id="uniqueId" placeholder="Es: 123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numero SIM</Label>
                <Input id="phone" placeholder="Es: +39 123 456 7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modello</Label>
                <Input id="model" placeholder="Es: GT06N" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Aggiungi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca veicoli..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veicolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Ultima posizione</TableHead>
                <TableHead>Ultimo aggiornamento</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Car className="h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">Nessun veicolo trovato</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((device) => {
                  const position = positions[device.id];
                  const status = statusLabels[device.status] || statusLabels.unknown;
                  
                  return (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.model || device.uniqueId}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {position?.address ? (
                          <span className="text-sm">{position.address}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {device.lastUpdate ? (
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(device.lastUpdate), {
                              addSuffix: true,
                              locale: it,
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Mai</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => selectDevice(device.id)}>
                              <MapPin className="mr-2 h-4 w-4" />
                              Mostra su mappa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" />
                              Cronologia
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Impostazioni
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

