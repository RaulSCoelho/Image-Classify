import { useEffect } from 'react'

import { maybePromise } from '@/lib/promise'
import { MaybePromise } from '@/types/promise'

import { useArrayState } from './use-array-state'

export function useQueue<T>(action: MaybePromise<(item: T) => void>, disable?: boolean) {
  const queueState = useArrayState<T>([])
  const queue = queueState[0]
  const remove = queueState[1].remove

  useEffect(() => {
    if (!disable) {
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        maybePromise(action, item).finally(() => remove(i))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, disable])

  return queueState
}
