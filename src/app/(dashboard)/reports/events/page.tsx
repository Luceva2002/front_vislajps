'use client';

import { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Play,
  AlertTriangle,
  Bell,
  MapPin,
  Key,
  Gauge,
  Battery,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevicesStore } from '@/store';

type EventType = 'alarm' | 'geofence' | 'ignition' | 'speed' | 'battery' | 'other';

interface Event {
  id: number;
  type: EventType;
  eventTime: string;
  deviceName: string;
  description: string;
  address?: string;
}

const eventTypeConfig: Record<EventType, { label: string; icon: typeof AlertTriangle; color: string }> = {
  alarm: { label: 'Allarme', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
  geofence: { label: 'Geofence', icon: MapPin, color: 'text-blue-500 bg-blue-500/10' },
  ignition: { label: 'Accensione', icon: Key, color: 'text-green-500 bg-green-500/10' },
  speed: { label: 'Velocità', icon: Gauge, color: 'text-yellow-500 bg-yellow-500/10' },
  battery: { label: 'Batteria', icon: Battery, color: 'text-purple-500 bg-purple-500/10' },
  other: { label: 'Altro', icon: Bell, color: 'text-gray-500 bg-gray-500/10' },
};

// Mock data
const mockEvents: Event[] = [
  {
    id: 1,
    type: 'speed',
    eventTime: '2024-02-01T14:32:00',
    deviceName: 'Auto Aziendale 1',
    description: 'Superamento limite velocità: 85 km/h (limite: 50 km/h)',
    address: 'Via Milano 123, Roma',
  },
  {
    id: 2,
    type: 'geofence',
    eventTime: '2024-02-01T13:15:00',
    deviceName: 'Furgone Consegne',
    description: 'Uscita dalla zona: Magazzino centrale',
    address: 'Via Roma 1, Milano',
  },
  {
    id: 3,
    type: 'ignition',
    eventTime: '2024-02-01T12:00:00',
    deviceName: 'Auto Aziendale 1',
    description: 'Motore acceso',
    address: 'Piazza Duomo, Milano',
  },
  {
    id: 4,
    type: 'alarm',
    eventTime: '2024-02-01T10:45:00',
    deviceName: 'Auto Aziendale 2',
    description: 'Allarme SOS attivato',
    address: 'Via Torino 50, Roma',
  },
  {
    id: 5,
    type: 'battery',
    eventTime: '2024-02-01T09:30:00',
    deviceName: 'Furgone Consegne',
    description: 'Batteria dispositivo scarica (15%)',
  },
  {
    id: 6,
    type: 'geofence',
    eventTime: '2024-02-01T08:00:00',
    deviceName: 'Auto Aziendale 1',
    description: 'Ingresso nella zona: Sede principale',
    address: 'Via Roma 1, Milano',
  },
];

export default function EventsReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredEvents = mockEvents.filter((event) => {
    const matchesDevice = selectedDevice === 'all' || event.deviceName === selectedDevice;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesDevice && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Eventi</h1>
          <p className="text-muted-foreground">
            Tutti gli eventi registrati
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Esporta
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[200px]">
              <Label>Veicolo</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona veicolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i veicoli</SelectItem>
                  {deviceList.map((device) => (
                    <SelectItem key={device.id} value={device.name}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[180px]">
              <Label>Tipo evento</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  {Object.entries(eventTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data inizio</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data fine</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <Button>
              <Play className="mr-2 h-4 w-4" />
              Genera report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(eventTypeConfig).map(([key, config]) => {
          const count = mockEvents.filter((e) => e.type === key).length;
          const Icon = config.icon;
          return (
            <Card key={key}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Events table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Elenco eventi</CardTitle>
          <CardDescription>
            {filteredEvents.length} eventi trovati
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Nessun evento trovato</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Ora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Veicolo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Posizione</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;
                  
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <p className="font-medium">
                          {new Date(event.eventTime).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.eventTime).toLocaleDateString('it-IT')}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Icon className={`w-3 h-3 ${config.color.split(' ')[0]}`} />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {event.deviceName}
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[300px]">{event.description}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {event.address || '-'}
                        </p>
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

