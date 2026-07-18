import axios from 'axios'

export const TOKEN_KEY = 'authToken'

export const client = axios.create({
  baseURL: 'http://localhost:8080/api',
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
      if (err.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = '/'
      }
      return Promise.reject(err)
    })