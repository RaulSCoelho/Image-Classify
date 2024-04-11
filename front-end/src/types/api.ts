import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiClientRequest<T> extends AxiosRequestConfig<any> {
  successMessage?:
    | string
    | {
        title?: string
        description?: string
      }
  errorMessage?:
    | string
    | {
        title?: string
        description?: string
      }
  successDataParam?: string
  successCallback?(res: AxiosResponse<T, any>): void
  errorCallback?(error: any): void
  raiseToast?: boolean
}

export interface ApiClientResponse<T> extends Omit<AxiosResponse<T, any>, 'headers' | 'config'> {
  ok: boolean
  headers?: AxiosResponse<T, any>['headers']
  config?: AxiosResponse<T, any>['config']
}
