'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CATEGORIES, PAGE_SIZE_OPTIONS, cn, getCategoryBySlug } from '@/lib/utils'
import ProductCard from './ProductCard'
import CategoryFilterSidebar from './CategoryFilterSidebar'
import Pagination from '@/components/ui/Pagination'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export default function CategoryPage({ categorySlug }) {
  const { lang } = useLang()
  const router       = useRouter()
  const searchParams = useSearchParams()

  const categoryDef = getCategoryBySlug(categorySlug)
  const categoryValue = categoryDef?.value || categorySlug

  // Active subcategory
  const [activeSubcategory, setActiveSubcategory] = useState(
    searchParams.get('subcategory') || ''
  )

  // Build subcategory filter key from category value
  const subcategoryKey = categoryValue === 'wall_covering' ? 'wall_covering_subcategory'
    : categoryValue === 'upholstery' ? 'upholstery_subcategory'
    : categoryValue === 'curtains' ? 'curtains_subcategory'
    : null

  // Filters state (category-specific)
  const [filters, setFilters] = useState(() => {
    const base = {}
    if (subcategoryKey && searchParams.get('subcategory')) {
      base[subcategoryKey] = searchParams.get('subcategory')
    }
    // Shared & category-specific filter params from URL
    ;[
      'colors', 'background', 'match', 'remove_type', 'order_type',
      'maintenance', 'light_fastness', 'wall_covering_material',
      'upholstery_usage', 'upholstery_material',
      'curtain_usage', 'curtain_material', 'width',
    ].forEach((k) => {
      const v = searchParams.get(k)
      if (v) base[k] = v
    })
    return base
  })

  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1)
  const [pageSize, setPageSize] = useState(Number(searchParams.get('page_size')) || 12)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (activeSubcategory) params.set('subcategory', activeSubcategory)
    if (searchInput)        params.set('search', searchInput)
    if (page > 1)           params.set('page', page)
    if (pageSize !== 12)    params.set('page_size', pageSize)
    Object.entries(filters).forEach(([k, v]) => {
      if (!v || (Array.isArray(v) && !v.length)) return
      params.set(k, v)
    })
    router.replace(`/products/${categorySlug}?${params.toString()}`, { scroll: false })
  }, [filters, page, pageSize, activeSubcategory, searchInput])

  // Build API params
  const apiParams = {
    category: categoryValue,
    page,
    page_size: pageSize,
    is_active: true,
    search: searchInput || undefined,
    ...filters,
  }
  if (activeSubcategory && subcategoryKey) {
    apiParams[subcategoryKey] = activeSubcategory
  }
  Object.keys(apiParams).forEach((k) => {
    if (apiParams[k] === undefined || apiParams[k] === '') delete apiParams[k]
  })

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', apiParams, lang],
    queryFn:  () => productsApi.list(apiParams),
    select:   (d) => d.data,
    keepPreviousData: true,
  })

  // Fetch filter metadata (re-fetches when subcategory changes for wall_covering material filter)
  const { data: filtersData } = useQuery({
    queryKey: ['filters-meta', categoryValue, activeSubcategory],
    queryFn:  () => productsApi.filtersMeta({
      category: categoryValue,
      ...(activeSubcategory ? { subcategory: activeSubcategory } : {}),
    }),
    select: (d) => d.data,
  })

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const handleClearAll = useCallback(() => {
    setFilters({})
    setPage(1)
  }, [])

  const handleSubcategoryChange = useCallback((sub) => {
    setActiveSubcategory(sub)
    setFilters({})
    setPage(1)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const products   = productsData?.results    || []
  const totalCount = productsData?.count      || 0
  const totalPages = productsData?.total_pages || 1
  const subcategories = categoryDef?.subcategories || []
  const hasFilters = categoryValue !== 'tassels'

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="border-b border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="section-label mb-3">{t(ui.categories.theCollection, lang)}</p>
          <h1 className="font-display text-5xl font-light text-ink">
            {lang === 'ar' ? categoryDef?.label.ar : categoryDef?.label.en}
          </h1>
          {totalCount > 0 && (
            <p className="text-muted text-sm mt-2">
              {lang === 'ar' ? `${totalCount} منتج` : `${totalCount} products`}
            </p>
          )}
        </div>

        {/* Subcategory tabs */}
        {subcategories.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleSubcategoryChange('')}
              className={cn(
                'flex-shrink-0 px-5 py-3 text-sm tracking-wide border-b-2 transition-colors',
                !activeSubcategory
                  ? 'border-gold text-ink font-medium'
                  : 'border-transparent text-muted hover:text-ink'
              )}
            >
              {t(ui.categories.all, lang)}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.value}
                onClick={() => handleSubcategoryChange(sub.value)}
                className={cn(
                  'flex-shrink-0 px-5 py-3 text-sm tracking-wide border-b-2 transition-colors',
                  activeSubcategory === sub.value
                    ? 'border-gold text-ink font-medium'
                    : 'border-transparent text-muted hover:text-ink'
                )}
              >
                {lang === 'ar' ? sub.label.ar : sub.label.en}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t(ui.filters.searchShort, lang)}
              className="input-base pl-10 pr-4"
            />
          </div>

          {/* Mobile filter toggle */}
          {hasFilters && (
            <button
              onClick={() => setMobileFilterOpen((o) => !o)}
              className="lg:hidden flex items-center gap-2 btn-secondary text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t(ui.filters.filters, lang)}
            </button>
          )}

          {/* Per page */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted whitespace-nowrap">
              {t(ui.filters.perPage, lang)}:
            </span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="appearance-none input-base py-2 pr-8 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* ── Filter sidebar (desktop) ─────────────────────── */}
          {hasFilters && filtersData && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <CategoryFilterSidebar
                category={categoryValue}
                activeSubcategory={activeSubcategory}
                filtersData={filtersData}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            </aside>
          )}

          {/* ── Mobile filter drawer ─────────────────────────── */}
          {mobileFilterOpen && hasFilters && filtersData && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="relative ml-auto w-72 h-full bg-canvas overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-xl">{t(ui.filters.filters, lang)}</span>
                  <button onClick={() => setMobileFilterOpen(false)}><X className="h-5 w-5" /></button>
                </div>
                <CategoryFilterSidebar
                  category={categoryValue}
                  activeSubcategory={activeSubcategory}
                  filtersData={filtersData}
                  activeFilters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>
          )}

          {/* ── Product grid ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: Math.min(pageSize, 12) }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center">
                <p className="font-display text-3xl text-muted mb-3">
                  {t(ui.filters.noResultsShort, lang)}
                </p>
                <button onClick={handleClearAll} className="btn-ghost mt-2">
                  {t(ui.filters.clearAll, lang)}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} priority={i < 4} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-16">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
