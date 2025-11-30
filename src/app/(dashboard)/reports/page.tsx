'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Route,
  MapPin,
  Clock,
  BarChart3,
  Calendar,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDevicesStore } from '@/store';

const reportTypes = [
  {
    id: 'route',
    title: 'Percorso',
    description: 'Visualizza il percorso completo del veicolo',
    icon: Route,
    href: '/reports/route',
  },
  {
    id: 'trips',
    title: 'Viaggi',
    description: 'Analisi dettagliata dei viaggi effettuati',
    icon: MapPin,
    href: '/reports/trips',
  },
  {
    id: 'stops',
    title: 'Soste',
    description: 'Elenco delle soste e tempi di fermo',
    icon: Clock,
    href: '/reports/stops',
  },
  {
    id: 'summary',
    title: 'Riepilogo',
    description: 'Statistiche riassuntive del periodo',
    icon: BarChart3,
    href: '/reports/summary',
  },
  {
    id: 'events',
    title: 'Eventi',
    description: 'Tutti gli eventi registrati',
    icon: FileText,
    href: '/reports/events',
  },
  {
    id: 'chart',
    title: 'Grafici',
    description: 'Visualizzazione grafica dei dati',
    icon: BarChart3,
    href: '/reports/chart',
  },
];

export default function ReportsPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report</h1>
        <p className="text-muted-foreground">
          Genera report dettagliati sulla tua flotta
        </p>
      </div>

      {/* Quick filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parametri Report</CardTitle>
          <CardDescription>
            Seleziona il veicolo e il periodo per i report
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label>Periodo rapido</Label>
              <Select
                onValueChange={(value) => {
                  const now = new Date();
                  const from = new Date();
                  
                  switch (value) {
                    case 'today':
                      from.setHours(0, 0, 0, 0);
                      break;
                    case 'yesterday':
                      from.setDate(from.getDate() - 1);
                      from.setHours(0, 0, 0, 0);
                      now.setDate(now.getDate() - 1);
                      now.setHours(23, 59, 59, 999);
                      break;
                    case 'week':
                      from.setDate(from.getDate() - 7);
                      break;
                    case 'month':
                      from.setMonth(from.getMonth() - 1);
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
                  <SelectItem value="today">Oggi</SelectItem>
                  <SelectItem value="yesterday">Ieri</SelectItem>
                  <SelectItem value="week">Ultima settimana</SelectItem>
                  <SelectItem value="month">Ultimo mese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report types grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Link key={report.id} href={report.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <report.icon className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Recenti</CardTitle>
          <CardDescription>
            I tuoi ultimi report generati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nessun report recente</p>
            <p className="text-sm">I report generati appariranno qui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

