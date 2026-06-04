import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export const metadata = {
  title: '404 — Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-up">
          <p className="font-display text-[12rem] font-light leading-none text-border select-none">
            404
          </p>
          <h1 className="font-display text-3xl font-light text-ink -mt-4 mb-4">
            Page Not Found
          </h1>
          <p className="text-muted mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
    </>
  )
}
