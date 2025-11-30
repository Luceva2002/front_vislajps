'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Circle,
  Square,
  Pentagon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useGeofencesStore } from '@/store';

export default function GeofencesPage() {
  const geofences = useGeofencesStore((state) => state.items);
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const geofenceList = Object.values(geofences);
  
  const filteredGeofences = geofenceList.filter((geofence) => {
    if (!search) return true;
    return geofence.name.toLowerCase().includes(search.toLowerCase());
  });

  const getGeofenceIcon = (area: string) => {
    if (area.startsWith('CIRCLE')) return Circle;
    if (area.startsWith('POLYGON')) return Pentagon;
    return Square;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geofence</h1>
          <p className="text-muted-foreground">
            Gestisci le aree geografiche di interesse
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo geofence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea nuovo geofence</DialogTitle>
              <DialogDescription>
                Definisci una nuova area geografica da monitorare
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="geofence-name">Nome</Label>
                <Input id="geofence-name" placeholder="Es: Sede principale" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="geofence-description">Descrizione</Label>
                <Input id="geofence-description" placeholder="Descrizione opzionale" />
              </div>
              <div className="space-y-2">
                <Label>Tipo di area</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-20 flex-col">
                    <Circle className="h-6 w-6 mb-2" />
                    <span className="text-xs">Cerchio</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Square className="h-6 w-6 mb-2" />
                    <span className="text-xs">Rettangolo</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Pentagon className="h-6 w-6 mb-2" />
                    <span className="text-xs">Poligono</span>
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Continua su mappa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca geofence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGeofences.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nessun geofence</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Crea il tuo primo geofence per ricevere notifiche quando i veicoli entrano o escono da aree specifiche.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crea geofence
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGeofences.map((geofence) => {
                  const Icon = getGeofenceIcon(geofence.area);
                  return (
                    <TableRow key={geofence.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{geofence.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {geofence.area.split('(')[0]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {geofence.description || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifica
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

