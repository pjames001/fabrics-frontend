import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutPage from '@/components/public/AboutPage'

export const metadata = {
  title: 'About Us | Fabric Store',
  description: 'Learn about Fabric Store — our story, mission, values, and the journey that brought us to where we are today.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <AboutPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
