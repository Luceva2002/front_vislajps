'use client';

import { useState } from 'react';
import { MapView } from '@/components/dashboard/map-view';
import { VehicleList } from '@/components/dashboard/vehicle-list';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MapPage() {
  const isMobile = useIsMobile();
  const [showList, setShowList] = useState(!isMobile);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex relative">
      {/* Map */}
      <div className="flex-1 relative">
        <MapView />
        
        {/* Mobile: Vehicle list toggle */}
        {isMobile && (
          <Sheet open={showList} onOpenChange={setShowList}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] shadow-lg h-12 w-12 rounded-full"
              >
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] p-0 rounded-t-xl">
              <VehicleList />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Desktop: Side panel */}
      {!isMobile && (
        <div
          className={cn(
            'w-[400px] border-l bg-card transition-all duration-300 overflow-hidden',
            !showList && 'w-0'
          )}
        >
          {showList && <VehicleList />}
        </div>
      )}

      {/* Desktop: Toggle button */}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 z-[1000] bg-card shadow-lg"
          onClick={() => setShowList(!showList)}
        >
          {showList ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}

