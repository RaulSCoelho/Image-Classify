import { useState } from 'react'

import { maybePromise } from '@/lib/promise'
import { MaybePromise } from '@/types/promise'

import { useFirstRenderEffect } from './use-first-render-effect'

export function useIsMounted(fn: MaybePromise = () => {}) {
  const [isMounted, setIsMounted] = useState(false)

  useFirstRenderEffect(() => {
    maybePromise(fn).finally(() => setIsMounted(true))
  })

  return isMounted
}
