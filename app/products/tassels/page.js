import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryPage from '@/components/public/CategoryPage'

export const metadata = {
  title: 'Tassels',
  description: 'Browse our decorative tassels and trimmings collection.',
}

export default function TasselsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <CategoryPage categorySlug="tassels" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
