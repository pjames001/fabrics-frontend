import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductDetailClient from '@/components/public/ProductDetail'
import { buildProductMeta } from '@/lib/seo'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

async function getProduct(slug) {
  try {
    const res = await fetch(`${API}/products/${slug}/`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return buildProductMeta(product)
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        <Suspense>
          <ProductDetailClient initialProduct={product} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
