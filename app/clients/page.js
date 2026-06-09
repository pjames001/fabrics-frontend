import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ClientsPage from '@/components/public/ClientsPage'

export const metadata = {
  title: 'Clients | Fabric Store',
  description: 'Meet the designers, developers, and contractors who trust Fabric Store across the GCC and MENA region.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <ClientsPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
