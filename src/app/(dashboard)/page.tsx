'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { VehicleList } from '@/components/dashboard/vehicle-list';
import { MapView } from '@/components/dashboard/map-view';
import { useDevicesStore, useSessionStore } from '@/store';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, List } from 'lucide-react';

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  
  const devices = useDevicesStore((state) => state.items);
  const positions = useSessionStore((state) => state.positions);
  const selectedId = useDevicesStore((state) => state.selectedId);

  const deviceList = Object.values(devices);
  const hasDevices = deviceList.length > 0;

  if (isMobile) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'map' | 'list')} className="flex flex-col flex-1">
          <div className="p-4 pb-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Mappa
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                Veicoli
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="map" className="flex-1 m-0 p-4 pt-4">
            <div className="h-full rounded-lg overflow-hidden border">
              <MapView />
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="flex-1 m-0 overflow-hidden">
            <VehicleList />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Panoramica della tua flotta in tempo reale
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Mappa Live</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] rounded-b-lg overflow-hidden">
              <MapView />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle list */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0 h-[564px]">
            <VehicleList />
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {!hasDevices && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nessun veicolo configurato</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Aggiungi il tuo primo veicolo per iniziare a monitorare la tua flotta in tempo reale.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

