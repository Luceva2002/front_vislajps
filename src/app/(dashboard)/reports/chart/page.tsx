'use client';

import { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Play,
  Route,
  Clock,
  Fuel,
  Gauge,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDevicesStore } from '@/store';

const chartTypes = [
  { id: 'distance', label: 'Distanza', icon: Route },
  { id: 'speed', label: 'Velocità', icon: Gauge },
  { id: 'time', label: 'Tempo guida', icon: Clock },
  { id: 'fuel', label: 'Consumo', icon: Fuel },
];

export default function ChartReportPage() {
  const devices = useDevicesStore((state) => state.items);
  const deviceList = Object.values(devices);
  
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [chartType, setChartType] = useState('distance');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report Grafici</h1>
          <p className="text-muted-foreground">
            Visualizzazione grafica dei dati
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
              Genera grafici
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all ${
              chartType === type.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setChartType(type.id)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                chartType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <type.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{type.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Barre
          </TabsTrigger>
          <TabsTrigger value="line" className="gap-2">
            <LineChart className="h-4 w-4" />
            Linee
          </TabsTrigger>
          <TabsTrigger value="pie" className="gap-2">
            <PieChart className="h-4 w-4" />
            Torta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grafico a barre</CardTitle>
              <CardDescription>
                Visualizzazione dei dati in formato barre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Seleziona un veicolo e un periodo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per visualizzare il grafico a barre
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grafico a linee</CardTitle>
              <CardDescription>
                Andamento temporale dei dati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Seleziona un veicolo e un periodo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per visualizzare il grafico a linee
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grafico a torta</CardTitle>
              <CardDescription>
                Distribuzione percentuale dei dati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Seleziona un veicolo e un periodo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per visualizzare il grafico a torta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riepilogo dati</CardTitle>
          <CardDescription>
            Statistiche del periodo selezionato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Valore minimo</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Valore massimo</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Media</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Totale</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

