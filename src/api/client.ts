import axios from 'axios'

export const TOKEN_KEY = 'token'

export const api = axios.create({
  baseURL: 'https://aulasoporte-api.aaron-navarro.workers.dev/api',
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? ''
    if (error.response?.status === 401 && !url.startsWith('/auth')) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export function errorCode(err: unknown): string | undefined {
  if (axios.isAxiosError<{ code: string }>(err)) return err.response?.data?.code
  return undefined
}
