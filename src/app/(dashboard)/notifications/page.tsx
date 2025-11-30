'use client';

import { useState } from 'react';
import {
  Plus,
  Bell,
  BellOff,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const notificationTypes = [
  { value: 'geofenceEnter', label: 'Ingresso geofence' },
  { value: 'geofenceExit', label: 'Uscita geofence' },
  { value: 'deviceOnline', label: 'Dispositivo online' },
  { value: 'deviceOffline', label: 'Dispositivo offline' },
  { value: 'deviceMoving', label: 'Dispositivo in movimento' },
  { value: 'deviceStopped', label: 'Dispositivo fermo' },
  { value: 'alarm', label: 'Allarme' },
  { value: 'ignitionOn', label: 'Accensione' },
  { value: 'ignitionOff', label: 'Spegnimento' },
  { value: 'speedLimit', label: 'Superamento velocità' },
];

// Mock data for demo
const mockNotifications = [
  {
    id: 1,
    type: 'geofenceEnter',
    always: true,
    notificators: ['web', 'mail'],
  },
  {
    id: 2,
    type: 'speedLimit',
    always: true,
    notificators: ['web', 'sms'],
  },
  {
    id: 3,
    type: 'deviceOffline',
    always: false,
    notificators: ['mail'],
  },
];

export default function NotificationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [notificators, setNotificators] = useState<string[]>(['web']);

  const getTypeLabel = (type: string) => {
    return notificationTypes.find((t) => t.value === type)?.label || type;
  };

  const getNotificatorIcon = (notificator: string) => {
    switch (notificator) {
      case 'mail':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'web':
        return Smartphone;
      default:
        return Bell;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifiche</h1>
          <p className="text-muted-foreground">
            Configura le notifiche per i tuoi veicoli
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuova notifica
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea nuova notifica</DialogTitle>
              <DialogDescription>
                Configura quando e come vuoi essere notificato
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo di evento</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Canali di notifica</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="web"
                      checked={notificators.includes('web')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNotificators([...notificators, 'web']);
                        } else {
                          setNotificators(notificators.filter((n) => n !== 'web'));
                        }
                      }}
                    />
                    <Label htmlFor="web" className="font-normal">
                      Notifica web/push
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mail"
                      checked={notificators.includes('mail')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNotificators([...notificators, 'mail']);
                        } else {
                          setNotificators(notificators.filter((n) => n !== 'mail'));
                        }
                      }}
                    />
                    <Label htmlFor="mail" className="font-normal">
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={notificators.includes('sms')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNotificators([...notificators, 'sms']);
                        } else {
                          setNotificators(notificators.filter((n) => n !== 'sms'));
                        }
                      }}
                    />
                    <Label htmlFor="sms" className="font-normal">
                      SMS
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Crea notifica
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {mockNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nessuna notifica configurata</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Configura le notifiche per essere avvisato su eventi importanti della tua flotta.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crea notifica
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Canali</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {notification.notificators.map((notificator) => {
                          const Icon = getNotificatorIcon(notificator);
                          return (
                            <Badge key={notificator} variant="outline">
                              <Icon className="w-3 h-3 mr-1" />
                              {notificator}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.always ? 'default' : 'secondary'}>
                        {notification.always ? 'Attiva' : 'Disattiva'}
                      </Badge>
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

