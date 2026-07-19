import axios from 'axios'
import { notifyError } from '../context/ToastContext.tsx'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}

export const TOKEN_KEY = 'authToken'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 403) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = '/'
      } else if (!err.config?.skipErrorToast) {
        notifyError('Niečo sa pokazilo.')
      }
      return Promise.reject(err)
    })