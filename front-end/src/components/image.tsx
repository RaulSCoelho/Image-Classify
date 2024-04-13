import { Image as NextUIImage, ImageProps as NextUIImageProps } from '@nextui-org/react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

export function Image({ as = NextImage, classNames, ...props }: NextUIImageProps & NextImageProps) {
  return (
    <NextUIImage
      as={as}
      classNames={{
        ...classNames,
        wrapper: ['select-none !max-w-none', classNames?.wrapper],
        img: ['object-contain', classNames?.img]
      }}
      {...props}
    />
  )
}
