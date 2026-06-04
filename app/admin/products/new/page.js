import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'New Product' }

export default function NewProductPage() {
  return <ProductForm mode="create" />
}
