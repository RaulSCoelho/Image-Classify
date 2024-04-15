import { forwardRef } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

import { Input, InputProps } from '.'

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'sm', type = 'text', placeholder = 'Type to search...', classNames, startContent, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        size={size}
        type={type}
        placeholder={placeholder}
        classNames={{
          ...classNames,
          base: ['max-w-full sm:max-w-[10rem] h-10', classNames?.base],
          mainWrapper: ['h-full', classNames?.mainWrapper],
          input: ['text-small', classNames?.input],
          inputWrapper: [
            'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            classNames?.inputWrapper
          ]
        }}
        startContent={startContent || <IoSearchOutline className="shrink-0" size={18} />}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
