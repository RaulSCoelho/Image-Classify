import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { fetcher } from '@/lib/fetcher'
import { maybePromise } from '@/lib/promise'
import { ApiRequestConfig, ApiResponse } from '@/types/api'
import { MaybePromise } from '@/types/promise'
import useSWR from 'swr'

export type SWRConfiguration<T> = Parameters<typeof useSWR<T>>[2] & {
  fetcherConfig?: ApiRequestConfig<T>
  onFirstSuccess?: MaybePromise<(data: T) => void>
}
export type SWRRequestMutate<T, RES> = (res: ApiResponse<RES>) => T
export type SWRCustomRequestConfig<T, REQ> = ApiRequestConfig<REQ> & { mutate?: SWRRequestMutate<T, REQ> }
export type SWRCustomGet<T> = ReturnType<typeof useSWRCustom<T>>['get']
export type SWRCustomPost<T> = ReturnType<typeof useSWRCustom<T>>['post']
export type SWRCustomPut<T> = ReturnType<typeof useSWRCustom<T>>['put']
export type SWRCustomRemove<T> = ReturnType<typeof useSWRCustom<T>>['remove']

export function useSWRCustom<T>(url: string, { fetcherConfig, onFirstSuccess, ...config }: SWRConfiguration<T> = {}) {
  const state = useSWR(url, fetcher.get<T>(fetcherConfig), config)
  const [isGetLoading, setIsGetLoading] = useState(false)
  const [isPostLoading, setIsPostLoading] = useState(false)
  const [isPutLoading, setIsPutLoading] = useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = useState(false)
  const [firstSuccess, setFirstSuccess] = useState(true)

  useEffect(() => {
    if (firstSuccess && state.data) {
      maybePromise(onFirstSuccess, state.data).finally(() => setFirstSuccess(false))
    }
  }, [firstSuccess, onFirstSuccess, state.data])

  async function baseRequest<RES = T>(
    promise: Promise<ApiResponse<RES>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    mutate?: SWRRequestMutate<T, RES>
  ) {
    setIsLoading(true)

    const res = await promise
    res.ok && mutate && state.mutate(mutate(res))

    setIsLoading(false)
    return res
  }

  async function get<RES = T>(configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.get<RES>(otherUrl || url, restConfigs), setIsGetLoading, mutate)
  }
  get.isLoading = isGetLoading

  async function post<RES = T>(body: any, configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.post<RES>(otherUrl || url, body, restConfigs), setIsPostLoading, mutate)
  }
  post.isLoading = isPostLoading

  async function put<RES = T>(body: any, configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.put<RES>(otherUrl || url, body, restConfigs), setIsPutLoading, mutate)
  }
  put.isLoading = isPutLoading

  async function remove<RES = T>(configs: SWRCustomRequestConfig<T, RES> = {}) {
    const { url: otherUrl, mutate, ...restConfigs } = configs
    return await baseRequest(api.delete<RES>(otherUrl || url, restConfigs), setIsRemoveLoading, mutate)
  }
  remove.isLoading = isRemoveLoading

  return {
    state,
    get,
    post,
    put,
    remove,
    isAnyLoading: state.isLoading || isGetLoading || isPostLoading || isPutLoading || isRemoveLoading
  }
}
