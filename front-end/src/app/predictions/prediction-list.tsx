import { useNavSearch } from '@/hooks/use-nav-search'
import { SWRCustomRemove } from '@/hooks/use-swr-custom'
import { range } from '@/lib/numbers'
import { len } from '@/lib/object'
import { search } from '@/lib/string'
import { Prediction as PredictionType } from '@/types/prediction'
import { Skeleton } from '@nextui-org/react'

import { Prediction } from './prediction'

interface PredictionsProps {
  predictions?: PredictionType[]
  remove: SWRCustomRemove<PredictionType[]>
  isLoading: boolean
}

export function PredictionList({ predictions, remove, isLoading }: PredictionsProps) {
  const navSearch = useNavSearch()
  let preds = predictions?.slice().reverse()

  if (preds) {
    preds = search(predictions, ['label', 'prediction'], navSearch)
  }

  async function deletePrediction(id: number) {
    await remove<void>({
      url: `predictions/${id}/`,
      mutate: () => {
        return predictions?.filter(p => p.id !== id) || []
      }
    })
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
      {isLoading ? (
        range(10).map(i => <Skeleton className="h-48 w-full rounded-large" key={i} />)
      ) : len(preds) > 0 ? (
        preds?.map(p => <Prediction prediction={p} onDelete={deletePrediction} key={p.id} />)
      ) : (
        <div>No predictions found</div>
      )}
    </div>
  )
}
