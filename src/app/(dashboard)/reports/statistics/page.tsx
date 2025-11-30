'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Car,
  Route,
  Clock,
  Fuel,
  Calendar,
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

const stats = [
  {
    title: 'Distanza totale',
    value: '12.450 km',
    change: '+12%',
    trend: 'up',
    icon: Route,
  },
  {
    title: 'Tempo di guida',
    value: '324 ore',
    change: '+8%',
    trend: 'up',
    icon: Clock,
  },
  {
    title: 'Consumo medio',
    value: '7.2 L/100km',
    change: '-5%',
    trend: 'down',
    icon: Fuel,
  },
  {
    title: 'Viaggi completati',
    value: '1.245',
    change: '+15%',
    trend: 'up',
    icon: Car,
  },
];

export default function StatisticsPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistiche</h1>
        <p className="text-muted-foreground">
          Analisi dettagliata delle performance della flotta
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
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
            
            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select
                onValueChange={(value) => {
                  const now = new Date();
                  const from = new Date();
                  
                  switch (value) {
                    case 'week':
                      from.setDate(from.getDate() - 7);
                      break;
                    case 'month':
                      from.setMonth(from.getMonth() - 1);
                      break;
                    case 'quarter':
                      from.setMonth(from.getMonth() - 3);
                      break;
                    case 'year':
                      from.setFullYear(from.getFullYear() - 1);
                      break;
                  }
                  
                  setDateFrom(from.toISOString().split('T')[0]);
                  setDateTo(now.toISOString().split('T')[0]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Ultima settimana</SelectItem>
                  <SelectItem value="month">Ultimo mese</SelectItem>
                  <SelectItem value="quarter">Ultimo trimestre</SelectItem>
                  <SelectItem value="year">Ultimo anno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distanza per veicolo</CardTitle>
            <CardDescription>
              Chilometri percorsi nel periodo selezionato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Seleziona un periodo per visualizzare i dati
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tempo di utilizzo</CardTitle>
            <CardDescription>
              Ore di guida nel periodo selezionato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Seleziona un periodo per visualizzare i dati
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riepilogo attività</CardTitle>
          <CardDescription>
            Panoramica dell'attività della flotta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nessun dato disponibile per il periodo selezionato
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

