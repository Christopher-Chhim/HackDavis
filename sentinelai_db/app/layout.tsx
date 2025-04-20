import DeployButton from '@/components/deploy-button'
import {EnvVarWarning} from '@/components/env-var-warning'
import HeaderAuth from '@/components/header-auth'
import {ThemeSwitcher} from '@/components/theme-switcher'
import {Geist} from 'next/font/google'
import {ThemeProvider} from 'next-themes'
import Link from 'next/link'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Supabase AI',
  description: 'Real-time Public Safety AI. Always listening, Always Ready.',
}

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
