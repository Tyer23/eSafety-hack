import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'KindNet - Parent Dashboard',
  description: 'AI-powered digital literacy companion for families',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
