'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaTrash } from 'react-icons/fa6'

import { useSWRCustom } from '@/hooks/use-swr-custom'
import { PredictInput, PredictOutput, Prediction, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, ScrollShadow, Spinner } from '@nextui-org/react'
import Image from 'next/image'

export function CarsClassify() {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const { state, post, remove } = useSWRCustom<Prediction[]>('predictions/', { fallbackData: [] })
  const [removeQueue, setRemoveQueue] = useState<number[]>([])
  const image = watch('image')

  function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0]
      setValue('image', file)
    }
  }

  async function deletePrediction(id: number) {
    setRemoveQueue(prev => [...prev, id])
    await remove({ url: `predictions/${id}/` })
    setRemoveQueue(prev => prev.filter(i => i !== id))
  }

  async function onSubmit(image: PredictOutput) {
    if (!image) return
    await post<Prediction>(image, {
      mutate: res => [...(state.data || []), res.data],
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
  }

  return (
    <div className="flex max-h-[100dvh] flex-col gap-3 p-5 sm:p-20">
      <form
        className="space-y-2 rounded-medium bg-white/60 p-5 pb-2 text-center"
        onSubmit={handleSubmit(onSubmit as any)}
      >
        <p className="text-lg font-bold">{image?.name || 'No file selected'}</p>
        <Input type="file" onChange={onChangeImage} errorMessage={errors.image?.message} isInvalid={!!errors.image} />
        <Button type="submit" color="secondary" isLoading={isSubmitting}>
          Guess
        </Button>
      </form>
      <ScrollShadow hideScrollBar>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
          {state.data?.reverse().map(p => (
            <div className="relative flex flex-col overflow-hidden rounded-medium bg-white/60" key={p.id}>
              {removeQueue.includes(p.id) && (
                <Spinner classNames={{ base: 'absolute inset-0 z-[1] bg-white/30', wrapper: 'h-10 w-10' }} />
              )}
              <div className="relative h-40">
                <Image src={p.image} alt={p.label} objectFit="cover" fill />
              </div>
              <div className="flex grow gap-1 p-3">
                <div className="grow">
                  <p>{p.label}</p>
                  <p>{p.prediction}</p>
                  <p>{p.updated_at}</p>
                </div>
                <div className="flex items-end">
                  <FaTrash
                    className="cursor-pointer text-red-600 active:scale-95"
                    onClick={() => deletePrediction(p.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </div>
  )
}
