'use client'

import { Toaster } from '@/components/toast/toaster'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { RecoilRoot } from 'recoil'

import { ThemeProvider } from './theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider>
      <NextUIProvider navigate={router.push} className="h-full">
        <RecoilRoot>
          {children}
          <Toaster />
        </RecoilRoot>
      </NextUIProvider>
    </ThemeProvider>
  )
}
