import { useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { fetcher } from '@/lib/fetcher'
import { maybePromise } from '@/lib/promise'
import { ApiRequestConfig, ApiResponse } from '@/types/api'
import { MaybePromise } from '@/types/promise'
import useSWR from 'swr'

import { useQueue } from './use-queue'

export type SWRCustom<T = any> = ReturnType<typeof useSWRCustom<T>>
export type SWRRequestMutate<T, RES> = (props: { res: ApiResponse<RES>; state?: T }) => T
export type SWRCustomRequestConfig<T, RES> = ApiRequestConfig<RES> & { mutate?: SWRRequestMutate<T, RES> }

export type SWRCustomConfigs<T> = Parameters<typeof useSWR<T>>[2] & {
  fetcherConfig?: ApiRequestConfig<T>
  onFirstSuccess?: MaybePromise<(data: T) => void>
}

export type MutationQueue<T, RES = any> = {
  mutate: SWRRequestMutate<T, RES>
  res: ApiResponse<RES>
}

export function useSWRCustom<T>(url: string, { fetcherConfig, onFirstSuccess, ...config }: SWRCustomConfigs<T> = {}) {
  const state = useSWR(url, fetcher.get<T>(fetcherConfig), config)
  const [isGetLoading, setIsGetLoading] = useState(false)
  const [isPostLoading, setIsPostLoading] = useState(false)
  const [isPutLoading, setIsPutLoading] = useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = useState(false)
  const [firstSuccess, setFirstSuccess] = useState(true)
  const [, { add: addMutation }] = useQueue<MutationQueue<T>>(({ res, mutate }) => {
    state.mutate(mutate({ res, state: state.data }))
  })

  useEffect(() => {
    if (state.isLoading || !firstSuccess) return

    if (state.data) {
      maybePromise(onFirstSuccess, state.data).finally(() => setFirstSuccess(false))
    }
  }, [firstSuccess, onFirstSuccess, state.data, state.isLoading])

  async function baseRequest<RES = T>(
    promise: Promise<ApiResponse<RES>>,
    setIsLoading: (isLoading: boolean) => void,
    mutate?: SWRRequestMutate<T, RES>
  ) {
    setIsLoading(true)

    const res = await promise
    res.ok && mutate && addMutation({ mutate, res })

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
