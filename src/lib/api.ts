// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('visla-auth-token', token);
  } else {
    localStorage.removeItem('visla-auth-token');
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('visla-auth-token');
  }
  return authToken;
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
      throw new Error('Unauthorized');
    }
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as unknown as T;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        const wwwAuth = response.headers.get('WWW-Authenticate');
        if (wwwAuth === 'TOTP') {
          throw new Error('TOTP_REQUIRED');
        }
      }
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },

  loginWithCode: async (email: string, password: string, code: string) => {
    const response = await fetch(`${API_URL}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password, code }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Invalid code');
    }
    
    return response.json();
  },

  loginWithToken: async (token: string) => {
    const response = await fetch(`${API_URL}/api/session?token=${encodeURIComponent(token)}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    
    return response.json();
  },

  getSession: async () => {
    return apiRequest('/api/session');
  },

  logout: async () => {
    await fetch(`${API_URL}/api/session`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setAuthToken(null);
  },

  register: async (data: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  },

  resetPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/api/password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
  },

  getOpenIdUrl: (provider: string, returnType: 'web' | 'app' = 'web') => {
    return `${API_URL}/api/session/openid/auth?provider=${provider}&return=${returnType}`;
  },
};

// Server API
export const serverApi = {
  getServer: async () => {
    return apiRequest('/api/server');
  },
};

// Devices API
export const devicesApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: number;
      name: string;
      uniqueId: string;
      status: string;
      lastUpdate: string;
      positionId: number;
      groupId: number;
      phone: string;
      model: string;
      contact: string;
      category: string;
      disabled: boolean;
      attributes: Record<string, unknown>;
    }>>('/api/devices');
  },

  get: async (id: number) => {
    return apiRequest(`/api/devices/${id}`);
  },

  create: async (device: Partial<unknown>) => {
    return apiRequest('/api/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  },

  update: async (id: number, device: Partial<unknown>) => {
    return apiRequest(`/api/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(device),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/api/devices/${id}`, {
      method: 'DELETE',
    });
  },
};

// Positions API
export const positionsApi = {
  getLatest: async (deviceId?: number) => {
    const query = deviceId ? `?deviceId=${deviceId}` : '';
    return apiRequest<Array<{
      id: number;
      deviceId: number;
      latitude: number;
      longitude: number;
      speed: number;
      course: number;
      altitude: number;
      accuracy: number;
      address: string;
      fixTime: string;
      deviceTime: string;
      serverTime: string;
      attributes: Record<string, unknown>;
    }>>(`/api/positions${query}`);
  },

  getRoute: async (deviceId: number, from: string, to: string) => {
    return apiRequest(`/api/positions?deviceId=${deviceId}&from=${from}&to=${to}`);
  },
};

// Groups API
export const groupsApi = {
  getAll: async () => {
    return apiRequest('/api/groups');
  },

  get: async (id: number) => {
    return apiRequest(`/api/groups/${id}`);
  },

  create: async (group: Partial<unknown>) => {
    return apiRequest('/api/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
  },

  update: async (id: number, group: Partial<unknown>) => {
    return apiRequest(`/api/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/api/groups/${id}`, {
      method: 'DELETE',
    });
  },
};

// Geofences API
export const geofencesApi = {
  getAll: async () => {
    return apiRequest('/api/geofences');
  },

  get: async (id: number) => {
    return apiRequest(`/api/geofences/${id}`);
  },

  create: async (geofence: Partial<unknown>) => {
    return apiRequest('/api/geofences', {
      method: 'POST',
      body: JSON.stringify(geofence),
    });
  },

  update: async (id: number, geofence: Partial<unknown>) => {
    return apiRequest(`/api/geofences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(geofence),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/api/geofences/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    return apiRequest('/api/users');
  },

  get: async (id: number) => {
    return apiRequest(`/api/users/${id}`);
  },

  update: async (id: number, user: Partial<unknown>) => {
    return apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },
};

// Reports API
export const reportsApi = {
  route: async (deviceId: number, from: string, to: string) => {
    return apiRequest(`/api/reports/route?deviceId=${deviceId}&from=${from}&to=${to}`);
  },

  events: async (deviceId: number, from: string, to: string, type?: string) => {
    const typeParam = type ? `&type=${type}` : '';
    return apiRequest(`/api/reports/events?deviceId=${deviceId}&from=${from}&to=${to}${typeParam}`);
  },

  trips: async (deviceId: number, from: string, to: string) => {
    return apiRequest(`/api/reports/trips?deviceId=${deviceId}&from=${from}&to=${to}`);
  },

  stops: async (deviceId: number, from: string, to: string) => {
    return apiRequest(`/api/reports/stops?deviceId=${deviceId}&from=${from}&to=${to}`);
  },

  summary: async (deviceId: number, from: string, to: string) => {
    return apiRequest(`/api/reports/summary?deviceId=${deviceId}&from=${from}&to=${to}`);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    return apiRequest('/api/notifications');
  },

  create: async (notification: Partial<unknown>) => {
    return apiRequest('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  },

  update: async (id: number, notification: Partial<unknown>) => {
    return apiRequest(`/api/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notification),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Commands API
export const commandsApi = {
  send: async (deviceId: number, type: string, attributes?: Record<string, unknown>) => {
    return apiRequest('/api/commands/send', {
      method: 'POST',
      body: JSON.stringify({
        deviceId,
        type,
        attributes: attributes || {},
      }),
    });
  },

  getSaved: async () => {
    return apiRequest('/api/commands');
  },
};

