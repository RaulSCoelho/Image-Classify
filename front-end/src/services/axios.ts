import { env } from '@/env'
import axios from 'axios'

export const apiClient = axios.create({ baseURL: env.NEXT_PUBLIC_API_BASE_URL })

export function setApiToken(token?: string) {
  if (token) {
    apiClient.defaults.headers.Authorization = `Bearer ${token}`
  }
}
