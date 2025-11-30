'use client';

import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Play,
  Route,
  Clock,
  MapPin,
  Fuel,
  TrendingUp,
  Car,
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
import { useDevicesStore } from '@/store';

export default function SummaryReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Riepilogo</h1>
          <p className="text-muted-foreground">
            Statistiche riassuntive del periodo
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

            <Button>
              <Play className="mr-2 h-4 w-4" />
              Genera report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Route className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.245 km</p>
                <p className="text-sm text-muted-foreground">Distanza totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">48h 32m</p>
                <p className="text-sm text-muted-foreground">Tempo di guida</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Viaggi completati</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Fuel className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">89.5 L</p>
                <p className="text-sm text-muted-foreground">Consumo stimato</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Metriche di guida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Velocità media</span>
              <span className="font-semibold">42 km/h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Velocità massima</span>
              <span className="font-semibold">125 km/h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Distanza media per viaggio</span>
              <span className="font-semibold">8.2 km</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Tempo medio per viaggio</span>
              <span className="font-semibold">18 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Consumo medio</span>
              <span className="font-semibold">7.2 L/100km</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tempi di utilizzo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Tempo in movimento</span>
              <span className="font-semibold">48h 32m</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Tempo in sosta</span>
              <span className="font-semibold">12h 45m</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Soste totali</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Durata media sosta</span>
              <span className="font-semibold">8.6 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Motore acceso fermo</span>
              <span className="font-semibold">2h 15m</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attività giornaliera</CardTitle>
          <CardDescription>
            Distribuzione dell'attività nel periodo selezionato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Seleziona un periodo per visualizzare il grafico
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

