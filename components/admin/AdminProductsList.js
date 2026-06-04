'use client'
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus, Search, ChevronDown, Edit2, Trash2,
  Eye, EyeOff, Star, StarOff, AlertCircle, CheckSquare, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { adminApi } from '@/lib/api'
import { CATEGORIES, PAGE_SIZE_OPTIONS, getCategoryLabel, imageUrl, formatDate, parseError, cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-canvas border border-border shadow-xl p-8 w-full max-w-sm animate-fade-up">
        <AlertCircle className="h-8 w-8 text-gold mx-auto mb-4" />
        <p className="text-center text-sm text-muted mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
          <button onClick={onConfirm} className="btn-primary flex-1 justify-center text-sm bg-red-600 hover:bg-red-700">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 shadow-lg text-sm animate-fade-up',
      type === 'success' ? 'bg-ink text-canvas' : 'bg-red-600 text-white'
    )}>
      {message}
      <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

export default function AdminProductsList() {
  const qc = useQueryClient()

  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [page,      setPage]      = useState(1)
  const [pageSize,  setPageSize]  = useState(20)
  const [selected,  setSelected]  = useState(new Set())
  const [confirm,   setConfirm]   = useState(null)  // { message, onConfirm }
  const [toast,     setToast]     = useState(null)   // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const params = {
    search:   search || undefined,
    category: category || undefined,
    page,
    page_size: pageSize,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', params],
    queryFn: () => adminApi.productList(params),
    select: (d) => d.data,
    keepPreviousData: true,
  })

  const products   = data?.results    || []
  const totalPages = data?.total_pages || 1
  const totalCount = data?.count       || 0

  // Bulk action mutation
  const bulkMutation = useMutation({
    mutationFn: ({ action, ids }) => adminApi.bulkAction({ action, ids }),
    onSuccess: (_, { action }) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setSelected(new Set())
      showToast(`Bulk action "${action}" applied successfully.`)
    },
    onError: (err) => showToast(parseError(err), 'error'),
  })

  // Single hard-delete mutation (uses bulk-action endpoint with one ID)
  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.bulkAction({ action: 'delete', ids: [id] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      showToast('Product permanently deleted.')
    },
    onError: (err) => showToast(parseError(err), 'error'),
  })

  // Toggle active/inactive mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }) =>
      adminApi.bulkAction({ action: is_active ? 'deactivate' : 'activate', ids: [id] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      showToast('Product status updated.')
    },
    onError: (err) => showToast(parseError(err), 'error'),
  })

  // Selection helpers
  const toggleOne = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    if (selected.size === products.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(products.map((p) => p.id)))
    }
  }, [selected.size, products])

  const selectedIds = Array.from(selected)

  const handleBulk = (action) => {
    if (!selectedIds.length) return
    const label = action === 'delete' ? 'hard-delete' : action
    setConfirm({
      message: `${label.charAt(0).toUpperCase() + label.slice(1)} ${selectedIds.length} selected product(s)?`,
      onConfirm: () => {
        bulkMutation.mutate({ action, ids: selectedIds })
        setConfirm(null)
      },
    })
  }

  const handleDelete = (id, name) => {
    setConfirm({
      message: `Permanently delete "${name}"? This cannot be undone and will remove all its images.`,
      onConfirm: () => {
        deleteMutation.mutate(id)
        setConfirm(null)
      },
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-2">Catalog</p>
          <h1 className="font-display text-4xl font-light text-ink">Products</h1>
          {!isLoading && (
            <p className="text-sm text-muted mt-1">{totalCount} products total</p>
          )}
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or SKU…"
            className="input-base pl-10 py-2 text-sm"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="appearance-none input-base py-2 pr-8 text-sm min-w-40"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label.en}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
        </div>

        {/* Page size */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="appearance-none input-base py-2 pr-8 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-gold/10 border border-gold/30 px-4 py-2.5 mb-4 text-sm">
          <span className="text-ink font-medium">{selected.size} selected</span>
          <div className="h-4 w-px bg-border" />
          <button onClick={() => handleBulk('activate')}   className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"><Eye className="h-3.5 w-3.5" /> Activate</button>
          <button onClick={() => handleBulk('deactivate')} className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"><EyeOff className="h-3.5 w-3.5" /> Deactivate</button>
          <button onClick={() => handleBulk('feature')}    className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"><Star className="h-3.5 w-3.5" /> Feature</button>
          <button onClick={() => handleBulk('unfeature')}  className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors"><StarOff className="h-3.5 w-3.5" /> Unfeature</button>
          <button onClick={() => handleBulk('delete')}     className="flex items-center gap-1.5 text-red-500 hover:text-red-700 transition-colors ml-auto"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-canvas border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="w-10 px-4 py-3 text-left">
                  <button onClick={toggleAll} aria-label="Select all" className="text-muted hover:text-ink transition-colors">
                    <CheckSquare className={cn('h-4 w-4', selected.size === products.length && products.length > 0 ? 'text-gold' : '')} />
                  </button>
                </th>
                <th className="w-12 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-medium tracking-[0.1em] uppercase text-muted">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-[0.1em] uppercase text-muted hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-[0.1em] uppercase text-muted hidden lg:table-cell">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-[0.1em] uppercase text-muted hidden xl:table-cell">Added</th>
                <th className="px-4 py-3 text-center text-xs font-medium tracking-[0.1em] uppercase text-muted">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium tracking-[0.1em] uppercase text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                    <td className="px-2 py-3"><Skeleton className="h-10 w-10" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3 hidden xl:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-14 mx-auto" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-muted">
                    <p className="font-display text-2xl mb-2">No products found</p>
                    <Link href="/admin/products/new" className="text-gold text-sm hover:underline">
                      Add your first product →
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className={cn(
                      'border-b border-border hover:bg-surface-2/50 transition-colors',
                      selected.has(product.id) && 'bg-gold/5'
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <button onClick={() => toggleOne(product.id)} className="text-muted hover:text-ink">
                        <div className={cn(
                          'h-4 w-4 border flex items-center justify-center transition-colors',
                          selected.has(product.id) ? 'border-gold bg-gold' : 'border-border'
                        )}>
                          {selected.has(product.id) && <span className="block h-2 w-2 bg-white" />}
                        </div>
                      </button>
                    </td>

                    {/* Thumbnail */}
                    <td className="px-2 py-3">
                      <div className="h-10 w-10 bg-surface-2 overflow-hidden flex-shrink-0">
                        {product.primary_image ? (
                          <Image
                            src={imageUrl(product.primary_image)}
                            alt={product.name_en}
                            width={40} height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted">▦</div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.slug}/edit`} className="font-medium text-ink hover:text-gold transition-colors">
                        {product.name_en}
                      </Link>
                      {product.name_ar && (
                        <p className="text-xs text-muted mt-0.5 font-arabic" dir="rtl">{product.name_ar}</p>
                      )}
                      {product.is_featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gold mt-0.5">
                          <Star className="h-2.5 w-2.5 fill-gold" /> Featured
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted capitalize">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs font-mono text-muted">{product.sku}</span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-xs text-muted">{formatDate(product.created_at)}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        'inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5',
                        product.is_active
                          ? 'bg-green-50 text-green-700'
                          : 'bg-surface-2 text-muted'
                      )}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-muted hover:text-ink transition-colors"
                          title="View on site"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="p-1.5 text-muted hover:text-gold transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => toggleActiveMutation.mutate({ id: product.id, is_active: product.is_active })}
                          className={cn('p-1.5 transition-colors', product.is_active ? 'text-green-600 hover:text-muted' : 'text-muted hover:text-green-600')}
                          title={product.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {product.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name_en)}
                          className="p-1.5 text-muted hover:text-red-500 transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
