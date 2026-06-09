import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactPage from '@/components/public/ContactPage'

export const metadata = {
  title: 'Contact | Fabric Store',
  description: 'Get in touch with the Fabric Store team for product enquiries, sample requests, and project consultations.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <ContactPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
