'use client';

import { useMemo, useState } from 'react';
import { Search, Filter, SortAsc, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VehicleCard } from './vehicle-card';
import { useDevicesStore, useSessionStore, useUIStore } from '@/store';
import type { Device } from '@/store';

const statusOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'unknown', label: 'Sconosciuto' },
];

const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'status', label: 'Stato' },
  { value: 'lastUpdate', label: 'Ultimo aggiornamento' },
];

export function VehicleList() {
  const devices = useDevicesStore((state) => state.items);
  const selectedId = useDevicesStore((state) => state.selectedId);
  const selectDevice = useDevicesStore((state) => state.selectDevice);
  const positions = useSessionStore((state) => state.positions);
  
  const filterKeyword = useUIStore((state) => state.filterKeyword);
  const setFilterKeyword = useUIStore((state) => state.setFilterKeyword);
  const filterStatus = useUIStore((state) => state.filterStatus);
  const setFilterStatus = useUIStore((state) => state.setFilterStatus);
  
  const [sortBy, setSortBy] = useState('name');

  const deviceList = Object.values(devices);

  const filteredDevices = useMemo(() => {
    let result = deviceList;

    // Filter by keyword
    if (filterKeyword) {
      const keyword = filterKeyword.toLowerCase();
      result = result.filter(
        (device) =>
          device.name.toLowerCase().includes(keyword) ||
          device.uniqueId.toLowerCase().includes(keyword) ||
          device.model?.toLowerCase().includes(keyword) ||
          device.phone?.toLowerCase().includes(keyword)
      );
    }

    // Filter by status
    if (filterStatus.length > 0) {
      result = result.filter((device) => filterStatus.includes(device.status));
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          const statusOrder = { online: 0, unknown: 1, offline: 2 };
          return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
        case 'lastUpdate':
          if (!a.lastUpdate) return 1;
          if (!b.lastUpdate) return -1;
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [deviceList, filterKeyword, filterStatus, sortBy]);

  const onlineCount = deviceList.filter((d) => d.status === 'online').length;
  const hasFilters = filterKeyword || filterStatus.length > 0;

  const handleStatusToggle = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const clearFilters = () => {
    setFilterKeyword('');
    setFilterStatus([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Veicoli</h2>
            <p className="text-sm text-muted-foreground">
              {onlineCount} online su {deviceList.length}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca veicoli..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="pl-9 pr-9"
            />
            {filterKeyword && (
              <button
                onClick={() => setFilterKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filtra per stato</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filterStatus.includes(option.value)}
                  onCheckedChange={() => handleStatusToggle(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SortAsc className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ordina per</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={sortBy === option.value}
                  onCheckedChange={() => setSortBy(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {filterStatus.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleStatusToggle(status)}
              >
                {statusOptions.find((o) => o.value === status)?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Cancella filtri
            </Button>
          </div>
        )}
      </div>

      {/* Vehicle list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun veicolo trovato</p>
              {hasFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Cancella filtri
                </Button>
              )}
            </div>
          ) : (
            filteredDevices.map((device) => (
              <VehicleCard
                key={device.id}
                device={device}
                position={positions[device.id]}
                isSelected={selectedId === device.id}
                onClick={() => selectDevice(device.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

