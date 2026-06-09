import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsPage from '@/components/public/ProjectsPage'

export const metadata = {
  title: 'Projects | Fabric Store',
  description: 'Explore our portfolio of completed projects across hospitality, commercial, residential, and healthcare sectors.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense>
          <ProjectsPage />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
