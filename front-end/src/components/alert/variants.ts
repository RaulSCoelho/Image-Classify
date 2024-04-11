import { VariantProps, tv } from '@nextui-org/react'

const alert = tv({
  slots: {
    collapse: 'rounded-medium',
    base: 'rounded-medium flex items-center gap-3 p-4',
    icon: 'shrink-0',
    messageWrapper: 'break-word grow text-left',
    title: 'text-small line-clamp-1 font-semibold',
    message: 'hyphens-auto',
    close: 'shrink-0 cursor-pointer text-inherit'
  },
  variants: {
    type: {
      success: { base: 'bg-success-200 text-success-foreground', icon: 'text-green-500 dark:text-green-300' },
      error: { base: 'bg-danger-200 dark:text-danger-foreground text-red-900', icon: 'text-red-500 dark:text-inherit' },
      alert: { base: 'bg-warning-200 text-warning-foreground', icon: 'text-yellow-500 dark:text-yellow-300' },
      info: { base: 'bg-info-light dark:bg-info-dark text-black', icon: 'text-blue-500 dark:text-blue-100' }
    }
  }
})

export type AlertVariantProps = VariantProps<typeof alert>
export type AlertSlots = keyof ReturnType<typeof alert>

export { alert }
