import { Image as NextUIImage, ImageProps as NextUIImageProps } from '@nextui-org/react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

export function Image({ as = NextImage, ...props }: NextUIImageProps & NextImageProps) {
  return <NextUIImage as={as} {...props} />
}
