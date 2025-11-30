import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: 'online' | 'offline' | 'unknown';
  lastUpdate: string | null;
  positionId: number | null;
  groupId: number | null;
  phone: string | null;
  model: string | null;
  contact: string | null;
  category: string | null;
  disabled: boolean;
  attributes: Record<string, unknown>;
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  outdated: boolean;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  course: number;
  address: string | null;
  accuracy: number;
  network: Record<string, unknown> | null;
  attributes: Record<string, unknown>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  readonly: boolean;
  administrator: boolean;
  disabled: boolean;
  expirationTime: string | null;
  deviceLimit: number;
  userLimit: number;
  deviceReadonly: boolean;
  limitCommands: boolean;
  fixedEmail: boolean;
  poiLayer: string | null;
  attributes: Record<string, unknown>;
}

export interface Group {
  id: number;
  name: string;
  groupId: number | null;
  attributes: Record<string, unknown>;
}

export interface Geofence {
  id: number;
  name: string;
  description: string | null;
  area: string;
  calendarId: number | null;
  attributes: Record<string, unknown>;
}

export interface Event {
  id: number;
  type: string;
  eventTime: string;
  deviceId: number;
  positionId: number | null;
  geofenceId: number | null;
  maintenanceId: number | null;
  attributes: Record<string, unknown>;
}

export interface ServerInfo {
  version: string;
  registration: boolean;
  emailEnabled: boolean;
  openIdEnabled: boolean;
  openIdGoogleEnabled: boolean;
  openIdFacebookEnabled: boolean;
  openIdAppleEnabled: boolean;
  openIdForce: boolean;
  attributes: Record<string, unknown>;
  announcement: string | null;
}

// Session Store
interface SessionState {
  user: User | null;
  server: ServerInfo | null;
  positions: Record<number, Position>;
  setUser: (user: User | null) => void;
  setServer: (server: ServerInfo | null) => void;
  updatePositions: (positions: Position[]) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      server: null,
      positions: {},
      setUser: (user) => set({ user }),
      setServer: (server) => set({ server }),
      updatePositions: (positions) =>
        set((state) => {
          const newPositions = { ...state.positions };
          positions.forEach((pos) => {
            newPositions[pos.deviceId] = pos;
          });
          return { positions: newPositions };
        }),
      clearSession: () => set({ user: null, positions: {} }),
    }),
    {
      name: 'visla-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Devices Store
interface DevicesState {
  items: Record<number, Device>;
  selectedId: number | null;
  setDevices: (devices: Device[]) => void;
  updateDevice: (device: Device) => void;
  removeDevice: (id: number) => void;
  selectDevice: (id: number | null) => void;
}

export const useDevicesStore = create<DevicesState>()((set) => ({
  items: {},
  selectedId: null,
  setDevices: (devices) =>
    set({
      items: devices.reduce((acc, device) => {
        acc[device.id] = device;
        return acc;
      }, {} as Record<number, Device>),
    }),
  updateDevice: (device) =>
    set((state) => ({
      items: { ...state.items, [device.id]: device },
    })),
  removeDevice: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.items;
      return { items: rest };
    }),
  selectDevice: (id) => set({ selectedId: id }),
}));

// Groups Store
interface GroupsState {
  items: Record<number, Group>;
  setGroups: (groups: Group[]) => void;
}

export const useGroupsStore = create<GroupsState>()((set) => ({
  items: {},
  setGroups: (groups) =>
    set({
      items: groups.reduce((acc, group) => {
        acc[group.id] = group;
        return acc;
      }, {} as Record<number, Group>),
    }),
}));

// Events Store
interface EventsState {
  items: Event[];
  addEvents: (events: Event[]) => void;
  clearEvents: () => void;
}

export const useEventsStore = create<EventsState>()((set) => ({
  items: [],
  addEvents: (events) =>
    set((state) => ({
      items: [...events, ...state.items].slice(0, 100),
    })),
  clearEvents: () => set({ items: [] }),
}));

// Geofences Store
interface GeofencesState {
  items: Record<number, Geofence>;
  setGeofences: (geofences: Geofence[]) => void;
}

export const useGeofencesStore = create<GeofencesState>()((set) => ({
  items: {},
  setGeofences: (geofences) =>
    set({
      items: geofences.reduce((acc, geofence) => {
        acc[geofence.id] = geofence;
        return acc;
      }, {} as Record<number, Geofence>),
    }),
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  eventsDrawerOpen: boolean;
  filterKeyword: string;
  filterStatus: string[];
  filterGroups: number[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setEventsDrawerOpen: (open: boolean) => void;
  setFilterKeyword: (keyword: string) => void;
  setFilterStatus: (status: string[]) => void;
  setFilterGroups: (groups: number[]) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      eventsDrawerOpen: false,
      filterKeyword: '',
      filterStatus: [],
      filterGroups: [],
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setEventsDrawerOpen: (open) => set({ eventsDrawerOpen: open }),
      setFilterKeyword: (keyword) => set({ filterKeyword: keyword }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterGroups: (groups) => set({ filterGroups: groups }),
    }),
    {
      name: 'visla-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);

