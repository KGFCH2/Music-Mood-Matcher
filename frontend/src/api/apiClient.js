// API client for frontend
import axios from 'axios'
import { secureStorage } from '../utils/secureStorage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token if present
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await secureStorage.getAuthToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (err) {
    // silent
  }
  return config
})

// Global response handler for auth errors
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try { await secureStorage.clearAuthToken() } catch (e) { }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  getProfile: () => apiClient.get('/auth/profile')
}

export const userAPI = {
  addFavorite: (data) => apiClient.post('/user/favorites', data),
  removeFavorite: (songId) => apiClient.delete(`/user/favorites/${songId}`),
  getFavorites: () => apiClient.get('/user/favorites'),
  saveMoodHistory: (data) => apiClient.post('/user/mood-history', data),
  getMoodHistory: (limit = 10) => apiClient.get(`/user/mood-history?limit=${limit}`),
  getMoodStats: () => apiClient.get('/user/mood-stats')
}

export default apiClient
