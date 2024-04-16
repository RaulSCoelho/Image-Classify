import { z } from 'zod'

import { AIModel } from './ai-model'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface Prediction {
  id: number
  model: AIModel
  image: string
  label: string
  prediction: string
  updated_at: string
}

export const predictSchema = z
  .object({
    model_id: z.number().int(),
    image: z
      .custom<File>()
      .refine(file => file instanceof File, 'Image is required.')
      .refine(
        file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      )
  })
  .transform(data => {
    const formData = new FormData()
    formData.append('model', String(data.model_id))
    formData.append('image', data.image)
    return formData
  })

export type PredictInput = z.input<typeof predictSchema>
export type PredictOutput = z.output<typeof predictSchema>
