import { forwardRef } from 'react'

import { tv } from '@nextui-org/react'

const inputGroup = tv({
  base: 'flex w-full flex-wrap gap-6 md:flex-nowrap'
})

export const InputGroup = forwardRef<HTMLInputElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={inputGroup({ className })} {...props} />
})

InputGroup.displayName = 'InputGroup'
