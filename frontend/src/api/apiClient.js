// API client for frontend
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
}

export const userAPI = {
  addFavorite: (data) => apiClient.post('/user/favorites', data),
  removeFavorite: (songId) => apiClient.delete(`/user/favorites/${songId}`),
  getFavorites: () => apiClient.get('/user/favorites'),
  saveMoodHistory: (data) => apiClient.post('/user/mood-history', data),
  getMoodHistory: (limit = 10) => apiClient.get(`/user/mood-history?limit=${limit}`),
  getMoodStats: () => apiClient.get('/user/mood-stats'),
}

export default apiClient
