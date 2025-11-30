'use client';

import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { useSessionStore, useDevicesStore } from '@/store';

// Demo data per testing
const DEMO_DEVICES = [
  { id: 1, name: 'Furgone Milano', uniqueId: 'GPS001', status: 'online' as const, lastUpdate: new Date().toISOString(), positionId: 1, groupId: null, phone: '+39 333 1234567', model: 'GT06N', contact: 'Mario Rossi', category: 'truck', disabled: false, attributes: {} },
  { id: 2, name: 'Auto Commerciale', uniqueId: 'GPS002', status: 'online' as const, lastUpdate: new Date().toISOString(), positionId: 2, groupId: null, phone: '+39 333 7654321', model: 'TK103', contact: 'Luigi Verdi', category: 'car', disabled: false, attributes: {} },
  { id: 3, name: 'Moto Corriere', uniqueId: 'GPS003', status: 'offline' as const, lastUpdate: new Date(Date.now() - 3600000).toISOString(), positionId: 3, groupId: null, phone: '+39 333 9876543', model: 'GT02', contact: 'Paolo Bianchi', category: 'motorcycle', disabled: false, attributes: {} },
  { id: 4, name: 'Camion Torino', uniqueId: 'GPS004', status: 'online' as const, lastUpdate: new Date().toISOString(), positionId: 4, groupId: null, phone: '+39 333 1111111', model: 'GT06N', contact: 'Franco Neri', category: 'truck', disabled: false, attributes: {} },
];

const DEMO_POSITIONS = [
  { id: 1, deviceId: 1, protocol: 'gt06', serverTime: new Date().toISOString(), deviceTime: new Date().toISOString(), fixTime: new Date().toISOString(), outdated: false, valid: true, latitude: 45.4642, longitude: 9.1900, altitude: 120, speed: 45, course: 180, address: 'Via Dante 15, Milano', accuracy: 10, network: null, attributes: { ignition: true, batteryLevel: 85 } },
  { id: 2, deviceId: 2, protocol: 'tk103', serverTime: new Date().toISOString(), deviceTime: new Date().toISOString(), fixTime: new Date().toISOString(), outdated: false, valid: true, latitude: 41.9028, longitude: 12.4964, altitude: 50, speed: 0, course: 0, address: 'Piazza del Colosseo, Roma', accuracy: 5, network: null, attributes: { ignition: false, batteryLevel: 92 } },
  { id: 3, deviceId: 3, protocol: 'gt02', serverTime: new Date(Date.now() - 3600000).toISOString(), deviceTime: new Date(Date.now() - 3600000).toISOString(), fixTime: new Date(Date.now() - 3600000).toISOString(), outdated: true, valid: true, latitude: 43.7696, longitude: 11.2558, altitude: 80, speed: 0, course: 90, address: 'Piazza della Signoria, Firenze', accuracy: 8, network: null, attributes: { batteryLevel: 45 } },
  { id: 4, deviceId: 4, protocol: 'gt06', serverTime: new Date().toISOString(), deviceTime: new Date().toISOString(), fixTime: new Date().toISOString(), outdated: false, valid: true, latitude: 45.0703, longitude: 7.6869, altitude: 240, speed: 72, course: 270, address: 'Corso Francia 250, Torino', accuracy: 12, network: null, attributes: { ignition: true, batteryLevel: 78 } },
];

const DEMO_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@vislagps.com',
  phone: '+39 333 0000000',
  readonly: false,
  administrator: true,
  disabled: false,
  expirationTime: null,
  deviceLimit: -1,
  userLimit: -1,
  deviceReadonly: false,
  limitCommands: false,
  fixedEmail: false,
  poiLayer: null,
  attributes: {},
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);
  
  const setUser = useSessionStore((state) => state.setUser);
  const updatePositions = useSessionStore((state) => state.updatePositions);
  const setDevices = useDevicesStore((state) => state.setDevices);

  useEffect(() => {
    // Set demo data immediately
    setUser(DEMO_USER);
    setDevices(DEMO_DEVICES);
    updatePositions(DEMO_POSITIONS);
    setIsReady(true);
  }, [setUser, setDevices, updatePositions]);

  if (!isReady) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

