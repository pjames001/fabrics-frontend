import './globals.css'
import { defaultMeta } from '@/lib/seo'
import { AuthProvider } from '@/contexts/AuthContext'
import { LangProvider } from '@/contexts/LangContext'
import QueryProvider from '@/components/QueryProvider'

export const metadata = defaultMeta

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#F8F5F0" />
      </head>
      <body className="bg-canvas text-ink font-body antialiased">
        <QueryProvider>
          <AuthProvider>
            <LangProvider>
              {children}
            </LangProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
