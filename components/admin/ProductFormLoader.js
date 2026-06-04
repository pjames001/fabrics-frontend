'use client'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import ProductForm from './ProductForm'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductFormLoader({ slug }) {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => productsApi.detail(slug),
    select: (d) => d.data,
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-8">
        <p className="text-red-500 text-sm">Failed to load product. It may have been deleted.</p>
      </div>
    )
  }

  return <ProductForm key={product.updated_at} mode="edit" initialData={product} />
}
