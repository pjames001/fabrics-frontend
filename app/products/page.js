import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryLanding from '@/components/public/CategoryLanding'

export const metadata = {
  title: 'Products',
  description: 'Browse our collection of wall covering, upholstery, curtains, and tassels.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <CategoryLanding />
      </main>
      <Footer />
    </>
  )
}
