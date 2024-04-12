'use client'

import { useForm } from 'react-hook-form'

import { useApiArrayState } from '@/hooks/use-api-state'
import { PredictInput, PredictOutput, Prediction, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, ScrollShadow } from '@nextui-org/react'
import Image from 'next/image'

export default function Home() {
  const {
    state: [predictions],
    actions: { add }
  } = useApiArrayState<Prediction>({ url: 'predictions/' })
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const image = watch('image')

  function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0]
      setValue('image', file)
    }
  }

  async function onSubmit(image: PredictOutput) {
    if (!image) return
    await add(image, {
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
          {predictions?.map((p: Prediction) => (
            <div className="overflow-hidden rounded-medium bg-white/60" key={p.id}>
              <div className="relative h-40">
                <Image src={p.image} alt={p.label} objectFit="cover" fill />
              </div>
              <div className="p-3">
                <p>{p.label}</p>
                <p>{p.prediction}</p>
                <p>{p.updated_at}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </div>
  )
}
