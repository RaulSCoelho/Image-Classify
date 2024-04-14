import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { MaybePromise } from './promise'

type Message = string | { title?: string; description?: string }

export interface ApiRequestConfig<T = any> extends AxiosRequestConfig<T> {
  successMessage?: Message | ((res: AxiosResponse<T>) => Message)
  errorMessage?: Message | ((error: any) => Message)
  successDataParam?: string
  raiseToast?: boolean
  onSuccess?: MaybePromise<(res: AxiosResponse<T>) => void>
  onError?: MaybePromise<(error: any) => void>
}

export interface ApiResponse<T = any> extends Omit<AxiosResponse<T>, 'headers' | 'config'> {
  ok: boolean
  headers?: AxiosResponse<T>['headers']
  config?: AxiosResponse<T>['config']
}

type ApiRequestConfigField =
  | 'successMessage'
  | 'errorMessage'
  | 'successDataParam'
  | 'raiseToast'
  | 'onSuccess'
  | 'onError'

export const apiRequestConfigKeys: ApiRequestConfigField[] = [
  'successMessage',
  'errorMessage',
  'successDataParam',
  'raiseToast',
  'onSuccess',
  'onError'
]
