import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SSEHandler from './SSEHandler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prism Dashboard',
  description: 'Advanced container management and monitoring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SSEHandler />
        </body>
    </html>
  )
}

