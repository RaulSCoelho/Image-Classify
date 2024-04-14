import { useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { fetcher } from '@/lib/fetcher'
import { runPotentialPromise } from '@/lib/promise'
import { ApiClientRequest, ApiClientResponse } from '@/types/api'
import { PotentialPromise } from '@/types/promise'
import useSWR from 'swr'

export type SWRConfiguration<T> = Parameters<typeof useSWR<T>>[2] & {
  onFirstSuccess?: PotentialPromise<(data: T) => void>
}
export type SWRRequestMutate<T, RES> = (res: ApiClientResponse<RES>) => T
export type SWRRequestProps<T, REQ> = ApiClientRequest<REQ> & { mutate?: SWRRequestMutate<T, REQ> }
export type SWRCustomGet<T> = ReturnType<typeof useSWRCustom<T>>['get']
export type SWRCustomPost<T> = ReturnType<typeof useSWRCustom<T>>['post']
export type SWRCustomPut<T> = ReturnType<typeof useSWRCustom<T>>['put']
export type SWRCustomRemove<T> = ReturnType<typeof useSWRCustom<T>>['remove']

export function useSWRCustom<T>(url: string, { onFirstSuccess, ...config }: SWRConfiguration<T> = {}) {
  const state = useSWR(url, fetcher.get<T>(), config)
  const [isLoading, setIsLoading] = useState(false)
  const [firstSuccess, setFirstSuccess] = useState(true)

  useEffect(() => {
    if (firstSuccess && state.data) {
      runPotentialPromise(onFirstSuccess, state.data).finally(() => setFirstSuccess(false))
    }
  }, [firstSuccess, onFirstSuccess, state.data])

  async function baseRequest<REQ = T>(promise: Promise<ApiClientResponse<REQ>>, mutate?: SWRRequestMutate<T, REQ>) {
    setIsLoading(true)

    const res = await promise
    res.ok && mutate && state.mutate(mutate(res))

    setIsLoading(false)
    return res
  }

  async function get<REQ = T>(props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.get<REQ>(otherUrl || url, config), mutate)
  }
  get.isLoading = isLoading

  async function post<REQ = T>(body: any, props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.post<REQ>(otherUrl || url, body, config), mutate)
  }
  post.isLoading = isLoading

  async function put<REQ = T>(body: any, props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.put<REQ>(otherUrl || url, body, config), mutate)
  }
  put.isLoading = isLoading

  async function remove<REQ = T>(props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.delete<REQ>(otherUrl || url, config), mutate)
  }
  remove.isLoading = isLoading

  return { state, isAnyLoading: isLoading || state.isLoading, get, post, put, remove }
}
