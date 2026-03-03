const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.fetch(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.fetch(endpoint, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    apiClient.post('/api/auth/register', { name, email, password }),
  
  logout: () => apiClient.post('/api/auth/logout', {}),
  
  getCurrentUser: () => apiClient.get('/api/auth/me'),
};

// Room API
export const roomAPI = {
  getUserRooms: () => apiClient.get('/api/rooms'),
  
  createRoom: (name: string, description?: string, isPrivate?: boolean) =>
    apiClient.post('/api/rooms', { name, description, isPrivate }),
  
  getRoomDetails: (roomId: string) => apiClient.get(`/api/rooms/${roomId}`),
  
  joinRoom: (roomId: string) => apiClient.post(`/api/rooms/${roomId}/join`, {}),
};

// Chat API
export const chatAPI = {
  getRoomMessages: (roomId: string, limit = 50, cursor?: string) =>
    apiClient.get(`/api/chat/${roomId}?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`),
};
