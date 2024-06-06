'use client'

import { Toaster } from '@yomu/ui/components/sonner'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default Providers
