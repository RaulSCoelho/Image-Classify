'use client'
import { useForm } from 'react-hook-form'

import { useSWRCustom } from '@/hooks/use-swr-custom'
import { PredictInput, PredictOutput, Prediction as PredictionType, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Input, ScrollShadow } from '@nextui-org/react'

import { Prediction } from './prediction'

export function CarsClassify() {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const { state, post, remove } = useSWRCustom<PredictionType[]>('predictions/', { fallbackData: [] })
  const image = watch('image')

  function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0]
      setValue('image', file)
    }
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
    <div className="flex max-h-[100dvh] flex-col gap-3 overflow-hidden p-5 sm:p-20">
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Card className="space-y-2 bg-background/60 p-5 pb-2 text-center" isBlurred>
          <p className="text-lg font-bold">{image?.name || 'No file selected'}</p>
          <Input type="file" onChange={onChangeImage} errorMessage={errors.image?.message} isInvalid={!!errors.image} />
          <Button type="submit" color="secondary" isLoading={isSubmitting}>
            Guess
          </Button>
        </Card>
      </form>
      <ScrollShadow className="-m-8 p-8" hideScrollBar>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
          {state.data?.reverse().map(p => <Prediction prediction={p} onDelete={deletePrediction} key={p.id} />)}
        </div>
      </ScrollShadow>
    </div>
  )
}
