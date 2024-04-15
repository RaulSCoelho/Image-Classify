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

export const aiModelUploadSchema = z
  .object({
    name: z.string().min(3).max(255),
    model_file: z.custom<File>().refine(file => file instanceof File, 'Model file is required.'),
    classes_file: z.custom<File>().refine(file => file instanceof File, 'Classes file is required.'),
    resize: z.string().optional(),
    mean: z.string().optional(),
    std: z.string().optional()
  })
  .transform(data => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('model_file', data.model_file)
    formData.append('classes_file', data.classes_file)
    data.resize && formData.append('resize', data.resize)
    data.mean && formData.append('mean', data.mean)
    data.std && formData.append('std', data.std)
    return formData
  })

export type AIModelUploadInput = z.input<typeof aiModelUploadSchema>
export type AIModelUploadOutput = z.output<typeof aiModelUploadSchema>
