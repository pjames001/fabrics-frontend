import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryPage from '@/components/public/CategoryPage'

export const metadata = {
  title: 'Curtains',
  description: 'Browse our curtain collection: sheer, blackout, dim-out, sunscreen, and vintage.',
}

export default function CurtainsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <CategoryPage categorySlug="curtains" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
