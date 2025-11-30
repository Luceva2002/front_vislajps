'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserRole = 'admin' | 'manager' | 'user' | 'readonly';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  lastLogin?: string;
}

const roleConfig: Record<UserRole, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  admin: { label: 'Amministratore', variant: 'default' },
  manager: { label: 'Manager', variant: 'secondary' },
  user: { label: 'Utente', variant: 'outline' },
  readonly: { label: 'Solo lettura', variant: 'outline' },
};

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    phone: '+39 333 1234567',
    role: 'admin',
    active: true,
    lastLogin: '2024-02-01T10:30:00Z',
  },
  {
    id: 2,
    name: 'Laura Bianchi',
    email: 'laura.bianchi@example.com',
    phone: '+39 339 7654321',
    role: 'manager',
    active: true,
    lastLogin: '2024-01-31T15:45:00Z',
  },
  {
    id: 3,
    name: 'Giuseppe Verdi',
    email: 'giuseppe.verdi@example.com',
    role: 'user',
    active: true,
    lastLogin: '2024-01-30T09:15:00Z',
  },
  {
    id: 4,
    name: 'Anna Neri',
    email: 'anna.neri@example.com',
    role: 'readonly',
    active: false,
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utenti</h1>
          <p className="text-muted-foreground">
            Gestisci gli utenti e i loro permessi
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo utente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi utente</DialogTitle>
              <DialogDescription>
                Crea un nuovo account utente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome completo</Label>
                <Input id="user-name" placeholder="Es: Mario Rossi" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="email@esempio.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-phone">Telefono (opzionale)</Label>
                <Input id="user-phone" placeholder="+39 123 456 7890" />
              </div>
              
              <div className="space-y-2">
                <Label>Ruolo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Amministratore</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Utente</SelectItem>
                    <SelectItem value="readonly">Solo lettura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Crea utente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
                <p className="text-sm text-muted-foreground">Utenti totali</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers.filter((u) => u.active).length}
                </p>
                <p className="text-sm text-muted-foreground">Attivi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers.filter((u) => !u.active).length}
                </p>
                <p className="text-sm text-muted-foreground">Disattivati</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers.filter((u) => u.role === 'admin').length}
                </p>
                <p className="text-sm text-muted-foreground">Amministratori</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca utenti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tutti i ruoli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i ruoli</SelectItem>
                <SelectItem value="admin">Amministratori</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">Utenti</SelectItem>
                <SelectItem value="readonly">Solo lettura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nessun utente trovato</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Non ci sono utenti che corrispondono ai criteri di ricerca.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utente</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Contatti</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = roleConfig[user.role];
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.lastLogin && (
                              <p className="text-xs text-muted-foreground">
                                Ultimo accesso: {new Date(user.lastLogin).toLocaleDateString('it-IT')}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.variant}>{role.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? 'default' : 'secondary'}>
                          {user.active ? 'Attivo' : 'Disattivato'}
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
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Cambia ruolo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.active ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Disattiva
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Riattiva
                                </>
                              )}
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

