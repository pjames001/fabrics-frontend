import ProductFormLoader from '@/components/admin/ProductFormLoader'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return { title: `Edit — ${slug}` }
}

export default async function EditProductPage({ params }) {
  const { slug } = await params
  return <ProductFormLoader slug={slug} />
}
