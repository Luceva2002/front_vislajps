'use client';

import { useState } from 'react';
import {
  Clock,
  Calendar,
  Download,
  Play,
  MapPin,
  ParkingCircle,
  Timer,
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

interface Stop {
  id: number;
  startTime: string;
  endTime: string;
  address: string;
  duration: number;
  latitude: number;
  longitude: number;
  engineOff: boolean;
}

// Mock data
const mockStops: Stop[] = [
  {
    id: 1,
    startTime: '2024-02-01T09:15:00',
    endTime: '2024-02-01T10:00:00',
    address: 'Via Torino 50, Milano',
    duration: 45,
    latitude: 45.4642,
    longitude: 9.1900,
    engineOff: true,
  },
  {
    id: 2,
    startTime: '2024-02-01T10:30:00',
    endTime: '2024-02-01T10:35:00',
    address: 'Via Dante 15, Milano',
    duration: 5,
    latitude: 45.4668,
    longitude: 9.1876,
    engineOff: false,
  },
  {
    id: 3,
    startTime: '2024-02-01T12:00:00',
    endTime: '2024-02-01T13:30:00',
    address: 'Piazza Duomo, Milano',
    duration: 90,
    latitude: 45.4641,
    longitude: 9.1919,
    engineOff: true,
  },
  {
    id: 4,
    startTime: '2024-02-01T15:30:00',
    endTime: '2024-02-01T15:45:00',
    address: 'Via Roma 1, Milano',
    duration: 15,
    latitude: 45.4654,
    longitude: 9.1859,
    engineOff: true,
  },
];

export default function StopsReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minDuration, setMinDuration] = useState('1');

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const filteredStops = mockStops.filter(
    (stop) => stop.duration >= parseInt(minDuration)
  );

  const totalStops = filteredStops.length;
  const totalDuration = filteredStops.reduce((sum, stop) => sum + stop.duration, 0);
  const avgDuration = totalStops > 0 ? totalDuration / totalStops : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Soste</h1>
          <p className="text-muted-foreground">
            Elenco delle soste e tempi di fermo
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
                  {deviceList.map((device) => (
                    <SelectItem key={device.id} value={device.id.toString()}>
                      {device.name}
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

            <div className="space-y-2">
              <Label>Durata minima (min)</Label>
              <Select value={minDuration} onValueChange={setMinDuration}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minuto</SelectItem>
                  <SelectItem value="5">5 minuti</SelectItem>
                  <SelectItem value="10">10 minuti</SelectItem>
                  <SelectItem value="30">30 minuti</SelectItem>
                  <SelectItem value="60">1 ora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button disabled={!selectedDevice}>
              <Play className="mr-2 h-4 w-4" />
              Genera report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ParkingCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalStops}</p>
              <p className="text-xs text-muted-foreground">Soste totali</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{formatDuration(totalDuration)}</p>
              <p className="text-xs text-muted-foreground">Tempo totale fermo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Timer className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{formatDuration(Math.round(avgDuration))}</p>
              <p className="text-xs text-muted-foreground">Durata media</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {filteredStops.filter((s) => s.engineOff).length}
              </p>
              <p className="text-xs text-muted-foreground">Motore spento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stops table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Elenco soste</CardTitle>
          <CardDescription>
            Tutte le soste nel periodo selezionato
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStops.length === 0 ? (
            <div className="text-center py-12">
              <ParkingCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Nessuna sosta trovata</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inizio</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Posizione</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead>Motore</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStops.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell>
                      <p className="font-medium">
                        {new Date(stop.startTime).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(stop.startTime).toLocaleDateString('it-IT')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {new Date(stop.endTime).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(stop.endTime).toLocaleDateString('it-IT')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-[250px]">{stop.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stop.duration > 30 ? 'default' : 'outline'}>
                        {formatDuration(stop.duration)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stop.engineOff ? 'secondary' : 'outline'}>
                        {stop.engineOff ? 'Spento' : 'Acceso'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

