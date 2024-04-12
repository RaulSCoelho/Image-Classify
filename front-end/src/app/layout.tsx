import './globals.css'
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
    <html lang="en" className={`${inter.className} bg-app antialiased`}>
      <body className="overflow-auto scroll-smooth">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
