import { useEffect, useState } from 'react'

import { api } from '@/lib/api'
import { joinPaths } from '@/lib/url'
import { ApiClientRequest, ApiClientResponse } from '@/types/api'

import { useArrayState } from './use-array-state'
// import useSWR from 'swr'
// import { fetcher } from '@/lib/fetcher'
// import useSWRMutation from 'swr/mutation'

interface UseApiStateProps<T> {
  url: string
  initialState?: T
  config?: ApiClientRequest<T>
  makeFirstRequest?: boolean
}

// interface UseSWRCustomProps<T> {
//   url: string
//   config?: SWRConfiguration<T>
// }

// type SWRConfiguration<T> = Parameters<typeof useSWR<T>>[2]

// export function useSWRCustom<T>(url: string, config?: SWRConfiguration<T>){
//   const state = useSWR(url, fetcher.get<T>(), config)
//   const {trigger } = useSWRMutation()
// }

export function useApiState<T>({ url, config = {}, initialState, makeFirstRequest = true }: UseApiStateProps<T>) {
  const [state, setState] = useState<T | undefined>(initialState)
  const [response, setResponse] = useState<ApiClientResponse<T>>()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  if (config.raiseToast === undefined) config.raiseToast = false

  useEffect(() => {
    refresh(!makeFirstRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  async function refresh(bypass = false, remount = true) {
    remount && isMounted && setIsMounted(false)
    if (bypass) {
      remount && setIsMounted(true)
      return
    }
    get().then(() => remount && setIsMounted(true))
  }

  async function get() {
    setIsLoading(true)
    const res = await api.get<T>(url, config)
    res.ok && setState(res.data)
    setResponse(res)
    setIsLoading(false)
  }

  async function update<RES extends T>(
    body: any,
    { updateState = true, url: otherUrl, ...config }: ApiClientRequest<T> & { updateState?: boolean } = {}
  ) {
    setIsLoading(true)
    const res = await api.put<RES>(otherUrl || url, body, config)
    updateState && res.ok && res.data && setState(res.data)
    setIsLoading(false)
    return res
  }

  return { state: [state, setState] as const, actions: { update, refresh }, response, isMounted, isLoading }
}

export function useApiArrayState<T>({
  url,
  config = {},
  initialState,
  makeFirstRequest = true
}: UseApiStateProps<T[]>) {
  const [arrayState, arrayStateActions, setArrayState] = useArrayState<T>(initialState)
  const [response, setResponse] = useState<ApiClientResponse<T[]>>()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  if (config.raiseToast === undefined) config.raiseToast = false

  useEffect(() => {
    refresh(!makeFirstRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  async function refresh(bypass = false, remount = true) {
    remount && isMounted && setIsMounted(false)
    if (bypass) {
      remount && setIsMounted(true)
      return
    }
    get().then(() => remount && setIsMounted(true))
  }

  async function get() {
    setIsLoading(true)
    const res = await api.get<T[]>(url, config)
    res.ok && setArrayState(res.data || [])
    setResponse(res)
    setIsLoading(false)
  }

  async function add<RES extends T>(body: any, { url: otherUrl, ...config }: ApiClientRequest<T> = {}) {
    setIsLoading(true)
    const res = await api.post<RES>(otherUrl || url, body, config)
    res.ok && res.data && arrayStateActions.add(res.data)
    setIsLoading(false)
    return res
  }

  async function update<RES extends T>(
    body: any,
    param: keyof T,
    { url: otherUrl, ...config }: ApiClientRequest<T> = {}
  ) {
    setIsLoading(true)
    const index = arrayState.findIndex(s => s[param] === body[param])
    const fullURL = joinPaths(otherUrl || url, body[param] as string)
    const res = await api.put<RES>(fullURL, body, config)
    res.ok && res.data && arrayStateActions.update(index, res.data)
    setIsLoading(false)
    return res
  }

  async function remove<RES, K extends keyof T = keyof T>(
    param: K,
    value: T[K],
    { url: otherUrl, ...config }: ApiClientRequest<RES> = {}
  ) {
    setIsLoading(true)
    const fullURL = joinPaths(otherUrl || url, String(value))
    const res = await api.delete<RES>(fullURL, config)
    res.ok && arrayStateActions.remove(arrayState.findIndex(s => s[param] === value))
    setIsLoading(false)
    return res
  }

  return {
    state: [arrayState, setArrayState] as const,
    actions: { add, update, remove, refresh },
    noRequestActions: arrayStateActions,
    response,
    isMounted,
    isLoading
  }
}
