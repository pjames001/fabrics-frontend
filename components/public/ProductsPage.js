'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CATEGORIES, PAGE_SIZE_OPTIONS, getCategoryLabel, cn } from '@/lib/utils'
import ProductCard from './ProductCard'
import FilterSidebar from './FilterSidebar'
import Pagination from '@/components/ui/Pagination'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export default function ProductsPage() {
  const { lang } = useLang()
  const router       = useRouter()
  const searchParams = useSearchParams()

  // Read initial state from URL
  const [filters, setFilters] = useState(() => ({
    category:                   searchParams.get('category')                   || '',
    search:                     searchParams.get('search')                     || '',
    colors:                     searchParams.get('colors')                     || undefined,
    pattern:                    searchParams.get('pattern')                    || undefined,
    production_region:          searchParams.get('production_region')          || undefined,
    weave_type:                 searchParams.get('weave_type')                 || undefined,
    abrasion:                   searchParams.get('abrasion')                   || undefined,
    traffic:                    searchParams.get('traffic')                    || undefined,
    scale:                      searchParams.get('scale')                      || undefined,
    opacity:                    searchParams.get('opacity')                    || undefined,
    wallcovering_subcategory:   searchParams.get('wallcovering_subcategory')   || undefined,
    panel_subcategory:          searchParams.get('panel_subcategory')          || undefined,
    rugs_subcategory:           searchParams.get('rugs_subcategory')           || undefined,
    performance:                searchParams.getAll('performance')             || [],
    cleaners:                   searchParams.getAll('cleaners')                || [],
    environmental:              searchParams.getAll('environmental')           || [],
    collaborators:              searchParams.get('collaborators')              || undefined,
  }))
  const [page,      setPage]      = useState(Number(searchParams.get('page')) || 1)
  const [pageSize,  setPageSize]  = useState(Number(searchParams.get('page_size')) || 12)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search)

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search)   params.set('search', filters.search)
    if (page > 1)         params.set('page', page)
    if (pageSize !== 12)  params.set('page_size', pageSize)
    Object.entries(filters).forEach(([k, v]) => {
      if (!v || k === 'category' || k === 'search') return
      if (Array.isArray(v)) v.forEach((vi) => params.append(k, vi))
      else params.set(k, v)
    })
    router.replace(`/products?${params.toString()}`, { scroll: false })
  }, [filters, page, pageSize])

  // Build API params
  const apiParams = {
    ...filters,
    page,
    page_size: pageSize,
    is_active: true,
  }
  // Clean undefined
  Object.keys(apiParams).forEach((k) => {
    if (apiParams[k] === undefined || apiParams[k] === '' || (Array.isArray(apiParams[k]) && !apiParams[k].length))
      delete apiParams[k]
  })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', apiParams, lang],
    queryFn: () => productsApi.list(apiParams),
    select: (d) => d.data,
    keepPreviousData: true,
  })

  const { data: filtersData } = useQuery({
    queryKey: ['filters-meta', filters.category],
    queryFn: () => productsApi.filtersMeta(filters.category ? { category: filters.category } : {}),
    select: (d) => filters.category ? d.data : null,
    enabled: !!filters.category,
  })

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const handleClearAll = useCallback(() => {
    setFilters((prev) => ({
      category: prev.category,
      search: '', performance: [], cleaners: [], environmental: [],
    }))
    setSearchInput('')
    setPage(1)
  }, [])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }))
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const products    = productsData?.results || []
  const totalCount  = productsData?.count   || 0
  const totalPages  = productsData?.total_pages || 1
  const activeCategory = filters.category

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* ── Page header ─────────────────────── */}
      <div className="border-b border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="section-label mb-3">
            {lang === 'ar' ? 'المجموعة' : 'The Collection'}
          </p>
          <h1 className="font-display text-5xl font-light text-ink">
            {activeCategory
              ? getCategoryLabel(activeCategory, lang)
              : (lang === 'ar' ? 'جميع المنتجات' : 'All Products')}
          </h1>
          {totalCount > 0 && (
            <p className="text-muted text-sm mt-2">
              {lang === 'ar' ? `${totalCount} منتج` : `${totalCount} products`}
            </p>
          )}
        </div>

        {/* Category tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { setFilters((p) => ({ ...p, category: '' })); setPage(1) }}
            className={cn(
              'flex-shrink-0 px-5 py-3 text-sm tracking-wide border-b-2 transition-colors',
              !activeCategory ? 'border-gold text-ink font-medium' : 'border-transparent text-muted hover:text-ink'
            )}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setFilters((p) => ({ ...p, category: cat.value })); setPage(1) }}
              className={cn(
                'flex-shrink-0 px-5 py-3 text-sm tracking-wide border-b-2 transition-colors',
                activeCategory === cat.value ? 'border-gold text-ink font-medium' : 'border-transparent text-muted hover:text-ink'
              )}
            >
              {lang === 'ar' ? cat.label.ar : cat.label.en}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Toolbar ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t(ui.filters.search, lang)}
              className="input-base pl-10 pr-4"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen((o) => !o)}
            className="lg:hidden flex items-center gap-2 btn-secondary text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t(ui.filters.filters, lang)}
          </button>

          {/* Per page */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted whitespace-nowrap">{t(ui.filters.perPage, lang)}:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="appearance-none input-base py-2 pr-8 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* ── Filter sidebar (desktop) ──────── */}
          {activeCategory && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <FilterSidebar
                filtersData={filtersData}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                category={activeCategory}
              />
            </aside>
          )}

          {/* ── Mobile filter drawer ──────────── */}
          {mobileFilterOpen && activeCategory && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="relative ml-auto w-72 h-full bg-canvas overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-xl">{t(ui.filters.filters, lang)}</span>
                  <button onClick={() => setMobileFilterOpen(false)}><X className="h-5 w-5" /></button>
                </div>
                <FilterSidebar
                  filtersData={filtersData}
                  activeFilters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                  category={activeCategory}
                />
              </div>
            </div>
          )}

          {/* ── Product grid ──────────────────── */}
          <div className="flex-1 min-w-0">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: pageSize > 12 ? 12 : pageSize }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center">
                <p className="font-display text-3xl text-muted mb-3">
                  {t(ui.filters.noResults, lang)}
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
