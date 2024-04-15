import { FormEvent } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
  ModalProps as NextUIModalProps,
  tv
} from '@nextui-org/react'

export interface ModalProps extends NextUIModalProps {
  fullScreen?: boolean
  onFormSubmit?: (e: FormEvent<HTMLFormElement>) => void
}

const modal = tv({
  variants: {
    fullScreen: {
      true: 'm-0 max-h-full'
    }
  }
})

export function Modal({
  children,
  title,
  size,
  placement = 'center',
  scrollBehavior = 'inside',
  fullScreen = true,
  classNames,
  className,
  onFormSubmit,
  ...rest
}: ModalProps) {
  const { matches: isSmallScreen } = useMediaQuery({ size: 'sm' })

  return (
    <NextUIModal
      size={fullScreen && isSmallScreen ? 'full' : size}
      placement={placement}
      scrollBehavior={scrollBehavior}
      classNames={{
        ...classNames,
        wrapper: ['overflow-hidden', classNames?.wrapper]
      }}
      className={modal({ fullScreen, className })}
      {...rest}
    >
      <ModalContent as={onFormSubmit ? 'form' : undefined} onSubmit={onFormSubmit as any}>
        <ModalHeader>{title}</ModalHeader>
        {children}
      </ModalContent>
    </NextUIModal>
  )
}

Modal.Body = ModalBody
Modal.Footer = ModalFooter
