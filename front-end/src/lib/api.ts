import { toast } from '@/hooks/use-toast'
import { apiClient } from '@/services/axios'
import { ApiClientRequest, ApiClientResponse } from '@/types/api'
import { AxiosResponse } from 'axios'

import { isObject } from './assertions'

interface RaiseToastProps {
  title?: string
  description?: string
  error?: boolean
  raiseToast?: boolean
}

interface OnSuccess<T>
  extends Pick<ApiClientRequest<T>, 'successDataParam' | 'successMessage' | 'successCallback' | 'raiseToast'> {}

interface OnError<T> extends Pick<ApiClientRequest<T>, 'errorMessage' | 'errorCallback' | 'raiseToast'> {}

export const api = { get, post, put, delete: remove }

function raiseToastFeedback({ title, description, error, raiseToast = true }: RaiseToastProps) {
  if (raiseToast && description) {
    toast({ title, message: description, type: error ? 'error' : 'success' })
  }
}

function onSuccess<T>(
  res: AxiosResponse<T, any>,
  { successDataParam, successMessage, successCallback, raiseToast }: OnSuccess<T>
) {
  const title = typeof successMessage !== 'string' ? successMessage?.title : undefined
  const description = typeof successMessage === 'string' ? successMessage : successMessage?.description
  raiseToastFeedback({ title, description: description || getSuccessMessage(res, successDataParam), raiseToast })
  successCallback?.(res)
  return { ...res, ok: true }
}

function onError<T>(error: any, { errorMessage: customErrorMessage, errorCallback, raiseToast }: OnError<T>) {
  const title = typeof customErrorMessage !== 'string' ? customErrorMessage?.title : undefined
  const description = typeof customErrorMessage === 'string' ? customErrorMessage : customErrorMessage?.description
  const status = error.response?.status || 400
  const errorMessage = getErrorMessage(error)

  raiseToastFeedback({ title, description: description || errorMessage, error: true, raiseToast })
  errorCallback?.(error)

  return { data: error, statusText: errorMessage, status, ok: false }
}

async function get<T>(
  url: string,
  {
    successMessage,
    errorMessage,
    successDataParam,
    successCallback,
    errorCallback,
    raiseToast = true,
    ...config
  }: ApiClientRequest<T> = {}
): Promise<ApiClientResponse<T>> {
  try {
    const res = await apiClient.get<T>(url, config)
    return onSuccess<T>(res, { successDataParam, successMessage, successCallback, raiseToast })
  } catch (error: any) {
    return onError(error, { errorMessage, errorCallback, raiseToast })
  }
}

async function post<T>(
  url: string,
  data: any,
  {
    successMessage,
    errorMessage,
    successDataParam,
    successCallback,
    errorCallback,
    raiseToast = true,
    ...config
  }: ApiClientRequest<T> = {}
): Promise<ApiClientResponse<T>> {
  try {
    const res = await apiClient.post<T>(url, data, config)
    return onSuccess<T>(res, { successDataParam, successMessage, successCallback, raiseToast })
  } catch (error: any) {
    return onError(error, { errorMessage, errorCallback, raiseToast })
  }
}

async function put<T>(
  url: string,
  data?: any,
  {
    successMessage,
    errorMessage,
    successDataParam,
    successCallback,
    errorCallback,
    raiseToast = true,
    ...config
  }: ApiClientRequest<T> = {}
): Promise<ApiClientResponse<T>> {
  try {
    const res = await apiClient.put<T>(url, data, config)
    return onSuccess<T>(res, { successDataParam, successMessage, successCallback, raiseToast })
  } catch (error: any) {
    return onError(error, { errorMessage, errorCallback, raiseToast })
  }
}

async function remove<T>(
  url: string,
  {
    successMessage,
    errorMessage,
    successDataParam,
    successCallback,
    errorCallback,
    raiseToast = true,
    ...config
  }: ApiClientRequest<T> = {}
): Promise<ApiClientResponse<T>> {
  try {
    const res = await apiClient.delete<T>(url, config)
    return onSuccess<T>(res, { successDataParam, successMessage, successCallback, raiseToast })
  } catch (error: any) {
    return onError(error, { errorMessage, errorCallback, raiseToast })
  }
}

function getSuccessMessage(res: any = {}, successDataParam?: string | number | symbol) {
  if (!successDataParam) return
  return res.data?.[successDataParam]
}

function getErrorMessage(error: any) {
  const resData = error.response?.data
  const status = error.response?.status || 400
  let errorMessage = resData || error.message
  errorMessage = isObject(errorMessage) ? errorMessage.message || errorMessage.error : String(errorMessage)
  return errorMessage || `[${status}]: Algo deu errado ao realizar a chamada`
}
