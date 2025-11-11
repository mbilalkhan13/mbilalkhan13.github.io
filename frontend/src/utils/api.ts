const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async post(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async get(endpoint: string, token?: string) {
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return response.json();
  },

  async uploadImage(file: File, token: string, width?: number, height?: number, quality?: number) {
    const formData = new FormData();
    formData.append('image', file);
    
    if (width) formData.append('width', width.toString());
    if (height) formData.append('height', height.toString());
    if (quality) formData.append('quality', quality.toString());

    const response = await fetch(`${API_URL}/images/resize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },
};

export const getImageUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
};
