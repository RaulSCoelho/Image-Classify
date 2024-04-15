import { ApiRequestConfig } from '@/types/api'

import { api } from './api'

export const fetcher = {
  get:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string) =>
      api.get<T>(url, config).then(res => res.data),
  post:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string, { arg }: { arg: any }) =>
      api.post<T>(url, arg, config).then(res => res.data),
  put:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string, { arg }: { arg: any }) =>
      api.put<T>(url, arg, config).then(res => res.data),
  delete:
    <T = any>(config?: ApiRequestConfig<T>) =>
    (url: string) =>
      api.delete<T>(url, config).then(res => res.data)
}
