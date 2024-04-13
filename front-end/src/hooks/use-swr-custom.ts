import { useState } from 'react'

import { api } from '@/lib/api'
import { fetcher } from '@/lib/fetcher'
import { ApiClientRequest, ApiClientResponse } from '@/types/api'
import useSWR from 'swr'

export type SWRConfiguration<T> = Parameters<typeof useSWR<T>>[2]
export type SWRRequestMutate<T, RES> = (res: ApiClientResponse<RES>) => T
export type SWRRequestProps<T, REQ> = ApiClientRequest<REQ> & { mutate?: SWRRequestMutate<T, REQ> }

export function useSWRCustom<T>(url: string, config?: SWRConfiguration<T>) {
  const state = useSWR(url, fetcher.get<T>(), config)
  const [isLoading, setIsLoading] = useState(false)

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

  async function post<REQ = T>(body: any, props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.post<REQ>(otherUrl || url, body, config), mutate)
  }

  async function put<REQ = T>(body: any, props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.put<REQ>(otherUrl || url, body, config), mutate)
  }

  async function remove<REQ = T>(props: SWRRequestProps<T, REQ> = {}) {
    const { url: otherUrl, mutate, ...config } = props
    return await baseRequest(api.delete<REQ>(otherUrl || url, config), mutate)
  }

  return { state, isLoading, get, post, put, remove }
}
