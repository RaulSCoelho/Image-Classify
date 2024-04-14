'use client'

import { Toaster } from '@/components/toast/toaster'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { RecoilRoot } from 'recoil'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push} className="h-full">
      <RecoilRoot>
        {children}
        <Toaster />
      </RecoilRoot>
    </NextUIProvider>
  )
}
