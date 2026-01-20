import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Update this URL when deploying backend
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Cafes API
export const cafesAPI = {
  getAll: (params) => api.get('/cafes', { params }),
  getOne: (id) => api.get(`/cafes/${id}`),
  create: (data) => api.post('/cafes', data),
  update: (id, data) => api.put(`/cafes/${id}`, data),
  delete: (id) => api.delete(`/cafes/${id}`),
};

// Discover API
export const discoverAPI = {
  getPublicCafes: (params) => api.get('/discover', { params }),
  saveCafe: (id) => api.post(`/discover/${id}/save`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadBase64: (image) => api.post('/upload/base64', { image }),
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

export default api;
