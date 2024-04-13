import { forwardRef } from 'react'

import { Input as NextUIInput, InputProps as NextUIInputProps } from '@nextui-org/react'

export interface InputProps extends NextUIInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ isInvalid, ...rest }, ref) => {
  return <NextUIInput ref={ref} isInvalid={isInvalid ?? !!rest.errorMessage} {...rest} />
})

Input.displayName = 'Input'
