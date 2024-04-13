import { z } from 'zod'

export interface AIModel {
  id: number
  name: string
  model_file: string
  classes_file: string
  resize: string
  mean: string
  std: string
}

export const aiModelSchema = z.object({
  name: z.string(),
  model_file: z.string(),
  classes_file: z.string(),
  resize: z.string().optional(),
  mean: z.string().optional(),
  std: z.string().optional()
})

export type AIModelInput = z.input<typeof aiModelSchema>
