'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Car,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevicesStore } from '@/store';

type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

interface Maintenance {
  id: number;
  deviceId: number;
  deviceName: string;
  type: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
}

const maintenanceTypes = [
  'Cambio olio',
  'Tagliando',
  'Sostituzione pneumatici',
  'Revisione',
  'Controllo freni',
  'Cambio filtri',
  'Altro',
];

const statusConfig: Record<MaintenanceStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle2 }> = {
  scheduled: { label: 'Programmata', variant: 'outline', icon: Calendar },
  in_progress: { label: 'In corso', variant: 'default', icon: Clock },
  completed: { label: 'Completata', variant: 'secondary', icon: CheckCircle2 },
  overdue: { label: 'Scaduta', variant: 'destructive', icon: AlertTriangle },
};

// Mock data
const mockMaintenances: Maintenance[] = [
  {
    id: 1,
    deviceId: 1,
    deviceName: 'Auto Aziendale 1',
    type: 'Cambio olio',
    status: 'scheduled',
    scheduledDate: '2024-02-15',
    notes: 'Olio sintetico 5W-30',
  },
  {
    id: 2,
    deviceId: 2,
    deviceName: 'Furgone Consegne',
    type: 'Tagliando',
    status: 'overdue',
    scheduledDate: '2024-01-20',
  },
  {
    id: 3,
    deviceId: 1,
    deviceName: 'Auto Aziendale 1',
    type: 'Revisione',
    status: 'completed',
    scheduledDate: '2024-01-10',
    completedDate: '2024-01-10',
  },
];

export default function MaintenancesPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredMaintenances = mockMaintenances.filter((maintenance) => {
    const matchesSearch = !search || 
      maintenance.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      maintenance.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || maintenance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manutenzioni</h1>
          <p className="text-muted-foreground">
            Gestisci le manutenzioni programmate dei veicoli
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuova manutenzione
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programma manutenzione</DialogTitle>
              <DialogDescription>
                Aggiungi una nuova manutenzione programmata
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Veicolo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona veicolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceList.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tipo manutenzione</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data programmata</Label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <Label>Note</Label>
                <Input placeholder="Note aggiuntive (opzionale)" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Programma
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Programmate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">In corso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Scadute</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Completate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca manutenzioni..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tutti gli stati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="scheduled">Programmate</SelectItem>
                <SelectItem value="in_progress">In corso</SelectItem>
                <SelectItem value="overdue">Scadute</SelectItem>
                <SelectItem value="completed">Completate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMaintenances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Wrench className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nessuna manutenzione</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Non ci sono manutenzioni da visualizzare. Programma la prima manutenzione per i tuoi veicoli.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Programma manutenzione
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veicolo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data programmata</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaintenances.map((maintenance) => {
                  const status = statusConfig[maintenance.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={maintenance.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Car className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{maintenance.deviceName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-muted-foreground" />
                          {maintenance.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(maintenance.scheduledDate).toLocaleDateString('it-IT')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Segna completata
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
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
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

