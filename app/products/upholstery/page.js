import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryPage from '@/components/public/CategoryPage'

export const metadata = {
  title: 'Upholstery',
  description: 'Browse our upholstery fabrics for indoor and outdoor use.',
}

export default function UpholsteryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <CategoryPage categorySlug="upholstery" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
