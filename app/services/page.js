import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ServicesPage from '@/components/public/ServicesPage'

export const metadata = {
  title: 'Services | Fabric Store',
  description: 'Discover the full range of services we offer — material specification, contract supply, design consultation, sample service, and more.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <ServicesPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
