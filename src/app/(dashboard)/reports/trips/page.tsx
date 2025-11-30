'use client';

import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Download,
  Play,
  Clock,
  Route,
  Navigation,
  ArrowRight,
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

interface Trip {
  id: number;
  startTime: string;
  endTime: string;
  startAddress: string;
  endAddress: string;
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
}

// Mock data
const mockTrips: Trip[] = [
  {
    id: 1,
    startTime: '2024-02-01T08:30:00',
    endTime: '2024-02-01T09:15:00',
    startAddress: 'Via Roma 1, Milano',
    endAddress: 'Via Torino 50, Milano',
    distance: 12.5,
    duration: 45,
    avgSpeed: 28,
    maxSpeed: 65,
  },
  {
    id: 2,
    startTime: '2024-02-01T10:00:00',
    endTime: '2024-02-01T10:30:00',
    startAddress: 'Via Torino 50, Milano',
    endAddress: 'Piazza Duomo, Milano',
    distance: 5.2,
    duration: 30,
    avgSpeed: 22,
    maxSpeed: 50,
  },
  {
    id: 3,
    startTime: '2024-02-01T14:00:00',
    endTime: '2024-02-01T15:30:00',
    startAddress: 'Piazza Duomo, Milano',
    endAddress: 'Via Roma 1, Milano',
    distance: 18.3,
    duration: 90,
    avgSpeed: 32,
    maxSpeed: 70,
  },
];

export default function TripsReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDistance = mockTrips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalDuration = mockTrips.reduce((sum, trip) => sum + trip.duration, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Viaggi</h1>
          <p className="text-muted-foreground">
            Analisi dettagliata dei viaggi effettuati
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
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{mockTrips.length}</p>
              <p className="text-xs text-muted-foreground">Viaggi totali</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Route className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalDistance.toFixed(1)} km</p>
              <p className="text-xs text-muted-foreground">Distanza totale</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{formatDuration(totalDuration)}</p>
              <p className="text-xs text-muted-foreground">Tempo totale</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {(totalDistance / (totalDuration / 60)).toFixed(0)} km/h
              </p>
              <p className="text-xs text-muted-foreground">Velocità media</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trips table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Elenco viaggi</CardTitle>
          <CardDescription>
            Tutti i viaggi nel periodo selezionato
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockTrips.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Nessun viaggio trovato</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenza</TableHead>
                  <TableHead>Arrivo</TableHead>
                  <TableHead>Distanza</TableHead>
                  <TableHead>Durata</TableHead>
                  <TableHead>Vel. media</TableHead>
                  <TableHead>Vel. max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {new Date(trip.startTime).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {trip.startAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {new Date(trip.endTime).toLocaleTimeString('it-IT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {trip.endAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{trip.distance} km</Badge>
                    </TableCell>
                    <TableCell>{formatDuration(trip.duration)}</TableCell>
                    <TableCell>{trip.avgSpeed} km/h</TableCell>
                    <TableCell>
                      <span className={trip.maxSpeed > 60 ? 'text-red-500 font-medium' : ''}>
                        {trip.maxSpeed} km/h
                      </span>
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

