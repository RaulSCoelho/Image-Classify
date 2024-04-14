import { useState } from 'react'
import { FaTrash } from 'react-icons/fa6'

import { Image } from '@/components/image'
import { maybePromise } from '@/lib/promise'
import { Prediction as PredictionType } from '@/types/prediction'
import { MaybePromise } from '@/types/promise'
import { Card, CardFooter, Spinner } from '@nextui-org/react'

interface PredictionProps {
  prediction: PredictionType
  onDelete?: MaybePromise<(id: number) => void>
}

export function Prediction({ prediction, onDelete }: PredictionProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    await maybePromise(onDelete, prediction.id)
    setIsLoading(false)
  }

  return (
    <Card radius="lg" isFooterBlurred>
      {isLoading && <Spinner classNames={{ base: 'absolute inset-0 z-[12] bg-white/30', wrapper: 'h-10 w-10' }} />}
      <Image
        src={prediction.image}
        alt={prediction.label}
        classNames={{ wrapper: 'h-48 w-full', img: 'object-cover' }}
        radius="none"
        fill
      />
      <CardFooter className="absolute bottom-1 z-[11] ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
        <p className="text-sm text-white/80">{prediction.prediction}</p>
        <FaTrash className="cursor-pointer text-red-600 active:scale-95" onClick={handleDelete} />
      </CardFooter>
    </Card>
  )
}
