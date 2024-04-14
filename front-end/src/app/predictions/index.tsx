'use client'
import { useForm } from 'react-hook-form'

import { FlexWrap } from '@/components/flex-wrap'
import { ImageInput } from '@/components/input/image'
import { useNavSearch } from '@/hooks/use-nav-search'
import { useSWRCustom } from '@/hooks/use-swr-custom'
import { search } from '@/lib/string'
import { AIModel } from '@/types/ai-models'
import { PredictInput, PredictOutput, Prediction as PredictionType, predictSchema } from '@/types/prediction'
import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete, AutocompleteItem, Button, Card } from '@nextui-org/react'

import { Prediction } from './prediction'

export function CarsClassify() {
  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PredictInput>({ resolver: zodResolver(predictSchema) })
  const { state: predsState, post, remove } = useSWRCustom<PredictionType[]>('predictions/', { fallbackData: [] })
  const { state: modelsState } = useSWRCustom<AIModel[]>('models/', {
    onFirstSuccess: models => onChangeModel(models[0].id)
  })
  const values = watch()
  const navSearch = useNavSearch()
  let predictions = predsState.data?.slice().reverse()

  if (navSearch) {
    predictions = search(predictions || [], ['label', 'prediction'], navSearch)
  }

  function onChangeModel(id: string | number) {
    setValue('model_id', Number(id))
  }

  function onChangeImage(file?: File) {
    setValue('image', file as File)
  }

  async function deletePrediction(id: number) {
    await remove<void>({
      url: `predictions/${id}/`,
      mutate: () => {
        return predsState.data?.filter(p => p.id !== id) || []
      }
    })
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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
        {predictions?.map(p => <Prediction prediction={p} onDelete={deletePrediction} key={p.id} />)}
      </div>
    </div>
  )
}
