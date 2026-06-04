import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductsPage from '@/components/public/ProductsPage'

export const metadata = {
  title: 'Products',
  description: 'Browse our full collection of premium upholstery, leather, wallcovering, panel, privacy curtain, window covering and rugs.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <ProductsPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
