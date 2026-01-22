// API client for frontend
import axios from 'axios'
import { secureStorage } from '../utils/secureStorage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests - Token stored securely, never in localStorage
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await secureStorage.getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (error) {
    // Silent fail - don't expose storage errors
  }
  return config
})

// Handle auth errors securely
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    // If 401 (Unauthorized), clear auth data
    if (error.response?.status === 401) {
      await secureStorage.clearAuthToken()
      secureStorage.clearAllStorage()
      // Could trigger logout action here
    }
    return Promise.reject(error)
  }
)
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
