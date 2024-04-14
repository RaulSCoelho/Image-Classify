import { useState } from 'react'

import { runPotentialPromise } from '@/lib/promise'
import { PotentialPromise } from '@/types/promise'

import { useFirstRenderEffect } from './use-first-render-effect'

export function useIsMounted(fn: PotentialPromise = () => {}) {
  const [isMounted, setIsMounted] = useState(false)

  useFirstRenderEffect(() => {
    runPotentialPromise(fn).then(() => setIsMounted(true))
  })

  return isMounted
}
