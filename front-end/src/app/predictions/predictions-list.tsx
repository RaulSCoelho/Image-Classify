import { useNavSearch } from '@/hooks/use-nav-search'
import { SWRCustomRemove } from '@/hooks/use-swr-custom'
import { range } from '@/lib/numbers'
import { len } from '@/lib/object'
import { search } from '@/lib/string'
import { Prediction as PredictionType } from '@/types/prediction'
import { Skeleton } from '@nextui-org/react'

import { Prediction } from './prediction'

interface PredictionsListProps {
  predictions?: PredictionType[]
  remove: SWRCustomRemove<PredictionType[]>
  isLoading: boolean
}

export function PredictionsList({ predictions, remove, isLoading }: PredictionsListProps) {
  const navSearch = useNavSearch()
  let preds = predictions?.slice().reverse()

  if (preds) {
    preds = search(preds, ['label', 'prediction'], navSearch)
  }
  const hasPreds = len(preds) > 0

  async function deletePrediction(id: number) {
    await remove<void>({
      url: `predictions/${id}/`,
      mutate: () => {
        return predictions?.filter(p => p.id !== id) || []
      }
    })
  }

  if (!isLoading && !hasPreds) {
    return <p className="my-8 text-center text-xl font-semibold text-default-800">No predictions found</p>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
      {isLoading
        ? range(10).map(i => <Skeleton className="h-48 w-full rounded-large" key={i} />)
        : hasPreds && preds?.map(p => <Prediction prediction={p} onDelete={deletePrediction} key={p.id} />)}
    </div>
  )
}
