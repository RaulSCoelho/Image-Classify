import { forwardRef } from 'react'

import { Button as NextUIButton, ButtonProps as NextUIButtonProps } from '@nextui-org/react'

export interface ButtonProps extends NextUIButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', color = 'primary', ...rest }, ref) => {
    return <NextUIButton ref={ref} type={type} color={color} {...rest} />
  }
)

Button.displayName = 'Button'
