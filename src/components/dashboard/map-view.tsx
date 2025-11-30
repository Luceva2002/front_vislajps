'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Layers, Maximize2, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDevicesStore, useSessionStore } from '@/store';

const MAP_STYLES = {
  streets: {
    name: 'Strade',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  dark: {
    name: 'Scuro',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
  },
  light: {
    name: 'Chiaro',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
  },
};

type MapStyle = keyof typeof MAP_STYLES;

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
  onFullscreen: () => void;
  mapStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
}

function MapControls({
  onZoomIn,
  onZoomOut,
  onCenter,
  onFullscreen,
  mapStyle,
  onStyleChange,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="flex flex-col bg-card rounded-lg shadow-lg border overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-9 w-9"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-9 w-9 border-t"
          onClick={onZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-card shadow-lg"
        onClick={onCenter}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-card shadow-lg"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={mapStyle} onValueChange={(v) => onStyleChange(v as MapStyle)}>
            {Object.entries(MAP_STYLES).map(([key, style]) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {style.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-card shadow-lg"
        onClick={onFullscreen}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MapView() {
  const [isClient, setIsClient] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<any>;
    TileLayer: React.ComponentType<any>;
    Marker: React.ComponentType<any>;
    Popup: React.ComponentType<any>;
  } | null>(null);
  const mapRef = useRef<any>(null);
  
  const devices = useDevicesStore((state) => state.items);
  const selectedId = useDevicesStore((state) => state.selectedId);
  const selectDevice = useDevicesStore((state) => state.selectDevice);
  const positions = useSessionStore((state) => state.positions);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamic import of react-leaflet components
    import('react-leaflet').then((mod) => {
      setMapComponents({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        Marker: mod.Marker,
        Popup: mod.Popup,
      });
    });

    // Import leaflet CSS
    import('leaflet/dist/leaflet.css');
  }, []);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleCenter = () => {
    const positionList = Object.values(positions);
    if (positionList.length > 0) {
      const bounds = positionList.map((p) => [p.latitude, p.longitude] as [number, number]);
      mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleFullscreen = () => {
    const container = mapRef.current?.getContainer();
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  // Center on selected device
  useEffect(() => {
    if (selectedId && positions[selectedId]) {
      const pos = positions[selectedId];
      mapRef.current?.setView([pos.latitude, pos.longitude], 16, { animate: true });
    }
  }, [selectedId, positions]);

  if (!isClient || !MapComponents) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/50">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentStyle = MAP_STYLES[mapStyle];
  const deviceList = Object.values(devices);
  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[41.9028, 12.4964]} // Rome, Italy
        zoom={6}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution={currentStyle.attribution}
          url={currentStyle.url}
        />
        
        {deviceList.map((device) => {
          const position = positions[device.id];
          if (!position) return null;
          
          return (
            <Marker
              key={device.id}
              position={[position.latitude, position.longitude]}
              eventHandlers={{
                click: () => selectDevice(device.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">{device.name}</h3>
                  <p className="text-sm text-muted-foreground">{device.model || device.uniqueId}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Velocità: {Math.round(position.speed * 1.852)} km/h</p>
                    {position.address && <p>📍 {position.address}</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCenter={handleCenter}
        onFullscreen={handleFullscreen}
        mapStyle={mapStyle}
        onStyleChange={setMapStyle}
      />
    </div>
  );
}
