import './globals.css'
import { Navbar } from '@/components/navbar'
import { Providers } from '@/providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Image Classify - Home',
    template: 'Image Classify - %s'
  },
  description: 'Image Classification App',
  icons: {
    icon: '/logo.png'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-[100dvh] overflow-auto scroll-smooth bg-app dark:bg-app-dark">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
