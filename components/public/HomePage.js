'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CATEGORIES, imageUrl, getCategoryLabel } from '@/lib/utils'
import ProductCard from '@/components/public/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import heroSvg from '../../public/hero.svg'

export default function HomePage() {
  const { lang } = useLang()

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-products', lang],
    queryFn: () => productsApi.list({ is_featured: true, page_size: 4 }),
    select: (d) => d.data.results,
  })

  return (
    <>
      {/* ── Hero ───────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-canvas">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #1C1917 0px, transparent 1px, transparent 79px, #1C1917 80px), repeating-linear-gradient(90deg, #1C1917 0px, transparent 1px, transparent 79px, #1C1917 80px)',
            }}
          />
        </div>

        {/* Decorative gold bar */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-gold to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className={lang === 'ar' ? 'order-2' : 'order-1'}>
            <p className="section-label mb-6 animate-fade-up">{t(ui.hero.eyebrow, lang)}</p>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light leading-none text-ink mb-8 animate-fade-up animate-delay-100 whitespace-pre-line">
              {t(ui.hero.heading, lang)}
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-md mb-10 animate-fade-up animate-delay-200">
              {t(ui.hero.sub, lang)}
            </p>
            <div className="flex items-center gap-4 animate-fade-up animate-delay-300">
              <Link href="/products" className="btn-primary">
                {t(ui.hero.cta, lang)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Silk SVG — 3D floating */}
          <div
            className={`hidden lg:flex items-center justify-center ${lang === 'ar' ? 'order-1' : 'order-2'}`}
            style={{
              animation: 'sw-float 9s ease-in-out infinite',
              filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.22)) drop-shadow(0 6px 14px rgba(0,0,0,0.12))',
            }}
          >
            <Image src={heroSvg} alt="Decorative silk pattern" width={600} height={600} className="w-auto h-96 object-contain" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted animate-fade-in animate-delay-500">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted to-transparent" />
        </div>
      </section>

      {/* ── Categories strip ───────────────────────── */}
      <section className="py-24 bg-surface" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">{t(ui.categories.heading, lang)}</p>
              <h2 className="font-display text-4xl font-light text-ink">
                {t(ui.categories.browseBy, lang)}
              </h2>
            </div>
            <Link href="/products" className="btn-ghost hidden md:flex">
              {t(ui.product.viewAll, lang)} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className="group flex flex-col items-center gap-3 py-8 border border-border hover:border-gold hover:bg-canvas transition-all duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium tracking-wide text-center text-muted group-hover:text-ink transition-colors">
                  {lang === 'ar' ? cat.label.ar : cat.label.en}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ──────────────────────── */}
      <section className="py-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">{t(ui.home.handpicked, lang)}</p>
              <h2 className="font-display text-4xl font-light text-ink">
                {t(ui.home.featuredHead, lang)}
              </h2>
            </div>
            <Link href="/products?is_featured=true" className="btn-ghost hidden md:flex">
              {t(ui.product.viewAll, lang)} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured?.length > 0
                ? featured.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)
                : (
                  <div className="col-span-4 py-16 text-center text-muted">
                    <p className="font-display text-2xl mb-2">{t(ui.home.noFeatured, lang)}</p>
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ── Brand statement ────────────────────────── */}
      <section className="py-24 bg-ink" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-px bg-gold mx-auto mb-10" />
          <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-canvas leading-relaxed">
            {t(ui.home.brandStatement, lang)}
          </p>
          <div className="w-12 h-px bg-gold mx-auto mt-10" />
        </div>
      </section>
    </>
  )
}
