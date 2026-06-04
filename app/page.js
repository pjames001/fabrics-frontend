import { Suspense } from 'react'
import { defaultMeta } from '@/lib/seo'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/components/public/HomePage'

export const metadata = defaultMeta
export const revalidate = 60

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <HomePage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
