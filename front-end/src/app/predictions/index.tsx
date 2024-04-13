'use client'
import { useForm } from 'react-hook-form'

import { ImageInput } from '@/components/input/image'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { PredictInput, PredictOutput, Prediction as PredictionType, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, ScrollShadow } from '@nextui-org/react'

import { Prediction } from './prediction'

export function CarsClassify() {
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const { state, post, remove } = useSWRCustom<PredictionType[]>('predictions/', { fallbackData: [] })

  function onChangeImage(file?: File) {
    setValue('image', file as File)
  }

  async function deletePrediction(id: number) {
    await remove({ url: `predictions/${id}/` })
  }

  async function onSubmit(image: PredictOutput) {
    if (!image) return
    await post<PredictionType>(image, {
      mutate: res => [...(state.data || []), res.data],
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  }

  return (
    <div className="max-h-[calc(100dvh-64px)] space-y-3 overflow-hidden p-5 sm:p-16">
      <form className="flex justify-center" onSubmit={handleSubmit(onSubmit as any)}>
        <Card className="max-w-xl space-y-2 bg-background/60 p-5 pb-2 text-center" isBlurred>
          <ImageInput onChange={onChangeImage} />
          <Button type="submit" color="secondary" className="mx-auto w-fit" isLoading={isSubmitting}>
            Guess
          </Button>
        </Card>
      </form>
      <ScrollShadow className="-m-8 -mt-0 p-8" hideScrollBar>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
          {state.data?.reverse().map(p => <Prediction prediction={p} onDelete={deletePrediction} key={p.id} />)}
        </div>
      </ScrollShadow>
    </div>
  )
}
