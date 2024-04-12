import { apiClient } from '@/services/axios'
import { AxiosRequestConfig } from 'axios'

export const fetcher = {
  get:
    <T>(config?: AxiosRequestConfig<any>) =>
    (url: string) =>
      apiClient.get<T>(url, config).then(res => res.data),
  post:
    <T, R = any>(config?: AxiosRequestConfig<any>) =>
    (url: string, { arg }: { arg: T }) =>
      apiClient.post<R>(url, arg, config).then(res => res.data),
  put:
    <T, R = any>(config?: AxiosRequestConfig<any>) =>
    (url: string, { arg }: { arg: T }) =>
      apiClient.put<R>(url, arg, config).then(res => res.data),
  delete:
    <T>(config?: AxiosRequestConfig<any>) =>
    (url: string) =>
      apiClient.delete<T>(url, config).then(res => res.data)
}
