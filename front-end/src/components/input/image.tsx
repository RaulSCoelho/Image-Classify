import { forwardRef, useRef } from 'react'
import { FaCamera, FaTrash } from 'react-icons/fa6'

import { Card, CardFooter, tv } from '@nextui-org/react'

import { Button } from '../button'
import { Image } from '../image'

interface ImageInputProps {
  image?: File
  setImage(file?: File): void
  className?: string
}

const imageInput = tv({
  base: 'aspect-video h-40'
})

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({ image, setImage, className }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const clearImage = () => {
    setImage()
  }

  return (
    <div className={imageInput({ className })}>
      {image ? (
        <Card radius="lg" className="h-full w-full" isFooterBlurred>
          <Image
            src={URL.createObjectURL(image)}
            alt={image.name}
            classNames={{ wrapper: 'h-full w-full', img: 'object-cover' }}
            radius="none"
            fill
          />
          <CardFooter className="absolute bottom-1 z-[11] ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
            <p className="text-sm text-white/80">{image.name}</p>
            <FaTrash className="cursor-pointer text-red-600 active:scale-95" onClick={clearImage} />
          </CardFooter>
        </Card>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-large border-2 border-dashed border-default-600">
          <input ref={inputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          <Button startContent={<FaCamera className="h-5 w-5 shrink-0" />} onPress={() => inputRef.current?.click()}>
            Select an image
          </Button>
        </div>
      )}
    </div>
  )
})

ImageInput.displayName = 'ImageInput'
