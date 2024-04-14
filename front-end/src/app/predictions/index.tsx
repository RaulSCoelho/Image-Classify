'use client'
import { useForm } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { ImageInput } from '@/components/input/image'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { AIModel } from '@/types/ai-models'
import { PredictInput, PredictOutput, Prediction as PredictionType, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete, AutocompleteItem, Button, Card } from '@nextui-org/react'

import { PredictionsList } from './predictions-list'

export function CarsClassify() {
  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const {
    state: predsState,
    post,
    remove,
    isLoading
  } = useSWRCustom<PredictionType[]>('predictions/', { fallbackData: [] })
  const { state: modelsState } = useSWRCustom<AIModel[]>('models/', {
    onFirstSuccess: models => onChangeModel(models[0].id)
  })
  const values = watch()

  function onChangeModel(id: string | number) {
    setValue('model_id', Number(id))
  }

  function onChangeImage(file?: File) {
    setValue('image', file as File)
  }

  async function onSubmit(formData: PredictOutput) {
    if (!formData) return
    await post<PredictionType>(formData, {
      mutate: res => {
        reset({ model_id: values.model_id })
        return [...(predsState.data || []), res.data]
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 p-5 sm:p-16">
      <form className="flex justify-center" onSubmit={handleSubmit(onSubmit as any)}>
        <Card className="max-w-xl space-y-2 bg-background/60 p-5 pb-2 text-center" isBlurred>
          <ImageInput image={values.image} setImage={onChangeImage} />
          <FlexWrap className="justify-center">
            <Autocomplete
              label="Select a model"
              size="sm"
              selectedKey={String(values.model_id)}
              onValueChange={onChangeModel}
            >
              {(modelsState.data || []).map(m => (
                <AutocompleteItem key={m.id} value={m.id}>
                  {m.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Button type="submit" color="secondary" className="h-auto min-h-unit-10" isLoading={isSubmitting}>
              Guess
            </Button>
          </FlexWrap>
        </Card>
      </form>
      <PredictionsList predictions={predsState.data} remove={remove} isLoading={isLoading} />
    </div>
  )
}
