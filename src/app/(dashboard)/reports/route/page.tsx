'use client';

import { useState } from 'react';
import {
  Route,
  Calendar,
  Download,
  Play,
  MapPin,
  Clock,
  Navigation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapView } from '@/components/dashboard/map-view';
import { useDevicesStore } from '@/store';

export default function RouteReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Report Percorso</h1>
            <p className="text-muted-foreground">
              Visualizza il percorso completo di un veicolo
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
                <Label>Data/ora inizio</Label>
                <Input
                  type="datetime-local"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data/ora fine</Label>
                <Input
                  type="datetime-local"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateReport}
                disabled={!selectedDevice || !dateFrom || !dateTo || isLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? 'Caricamento...' : 'Genera report'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Route className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold">-- km</p>
                <p className="text-xs text-muted-foreground">Distanza</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold">--:--</p>
                <p className="text-xs text-muted-foreground">Durata</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xl font-bold">-- km/h</p>
                <p className="text-xs text-muted-foreground">Velocità media</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Soste</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-6 mb-6 rounded-lg overflow-hidden border">
        <MapView />
      </div>
    </div>
  );
}

