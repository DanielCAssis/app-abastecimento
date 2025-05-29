import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/auth/login', credentials)
        const { token, user } = response.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return response
      } catch (error) {
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('/api/auth/register', userData)
        return response
      } catch (error) {
        throw error
      }
    },

    async fetchProfile() {
      if (!this.token) return null
      try {
        const response = await axios.get('/api/auth/profile')
        this.user = response.data
        return response.data
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }
}) 