'use client'

import { Toaster } from '@/components/toast/toaster'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push} className="h-full">
      {children}
      <Toaster />
    </NextUIProvider>
  )
}
