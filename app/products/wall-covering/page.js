import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryPage from '@/components/public/CategoryPage'

export const metadata = {
  title: 'Wall Covering',
  description: 'Browse our wall covering collection: natural, vinyl, prints, fabric, murals, and acoustic.',
}

export default function WallCoveringPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <CategoryPage categorySlug="wall-covering" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
