'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { imageUrl, getCategoryLabel, getLabel, getLabels, cn } from '@/lib/utils'

function SpecRow({ label, value }) {
  if (!value || (Array.isArray(value) && !value.length)) return null
  const display = Array.isArray(value)
    ? value.map((v) => (typeof v === 'object' ? v.label : v)).join(', ')
    : typeof value === 'object' ? value.label : value
  return (
    <div className="flex items-start py-3 border-b border-border last:border-0 gap-4">
      <span className="text-xs font-medium tracking-[0.1em] uppercase text-muted w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-ink">{display}</span>
    </div>
  )
}

export default function ProductDetailClient({ initialProduct }) {
  const { lang } = useLang()
  const product = initialProduct
  const images = product.images || []
  const name   = lang === 'ar' && product.name_ar ? product.name_ar : product.name_en
  const desc   = lang === 'ar' && product.description_ar ? product.description_ar : product.description_en
  const content = lang === 'ar' && product.content_ar ? product.content_ar : product.content_en

  const [activeImg, setActiveImg] = useState(() => Math.max(images.findIndex((i) => i.is_primary), 0))

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1))

  const img = images[activeImg]

  // Build structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_en,
    description: product.description_en,
    sku: product.sku,
    image: images.map((i) => imageUrl(i)).filter(Boolean),
    brand: { '@type': 'Organization', name: 'Fabric Store' },
    category: product.category,
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-10">
        <Link href="/products" className="hover:text-ink transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          {lang === 'ar' ? 'المنتجات' : 'Products'}
        </Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-ink transition-colors capitalize">
          {getCategoryLabel(product.category, lang)}
        </Link>
        <span>/</span>
        <span className="text-ink">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ── Image panel ──────────────────── */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square bg-surface-2 mb-4 overflow-hidden group">
            {img && imageUrl(img) !== '/placeholder-fabric.jpg' ? (
              <Image
                src={imageUrl(img)}
                alt={img.alt_text_en || name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">▦</div>
            )}

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-canvas/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-canvas"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-canvas/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-canvas"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 bg-canvas/90 text-ink text-xs px-2 py-1">
                {activeImg + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  aria-label={img.variant_label_en || `Image ${i + 1}`}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all',
                    i === activeImg ? 'border-gold' : 'border-transparent hover:border-border'
                  )}
                >
                  {imageUrl(img) !== '/placeholder-fabric.jpg' ? (
                    <Image src={imageUrl(img)} alt={img.alt_text_en || ''} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-surface-2 flex items-center justify-center text-xs text-muted">▦</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Variant label */}
          {img?.variant_label_en && (
            <p className="mt-3 text-xs text-muted tracking-wide">
              {lang === 'ar' && img.variant_label_ar ? img.variant_label_ar : img.variant_label_en}
            </p>
          )}
        </div>

        {/* ── Info panel ───────────────────── */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="section-label">{getCategoryLabel(product.category, lang)}</span>
            {product.is_featured && (
              <span className="text-[10px] bg-gold text-white px-2 py-0.5 font-medium tracking-wider uppercase">
                {t(ui.product.featured, lang)}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight text-ink mb-2">
            {name}
          </h1>
          <p className="text-xs text-muted tracking-[0.15em] uppercase mb-6">{product.sku}</p>

          {desc && (
            <p className="text-muted leading-relaxed mb-8 text-sm border-l-2 border-gold pl-4">
              {desc}
            </p>
          )}

          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted mb-3">
                {t(ui.product.colors, lang)}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color.id || color.slug}
                    className="h-7 w-7 rounded-full border-2 border-border hover:border-gold transition-colors cursor-default"
                    style={{ backgroundColor: color.hex_code || '#ccc' }}
                    title={lang === 'ar' && color.name_ar ? color.name_ar : color.name_en}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="border-t border-border">
            <SpecRow label={t(ui.product.content, lang)} value={content} />
            <SpecRow label={t(ui.product.pattern, lang)} value={getLabel('pattern', product.pattern, lang)} />
            {product.scale && <SpecRow label={lang === 'ar' ? 'الحجم' : 'Scale'} value={getLabel('scale', product.scale, lang)} />}
            {product.weave_type && <SpecRow label={lang === 'ar' ? 'النسيج' : 'Weave'} value={getLabel('weave_type', product.weave_type, lang)} />}
            {product.abrasion && <SpecRow label={lang === 'ar' ? 'التآكل' : 'Abrasion'} value={getLabel('abrasion', product.abrasion, lang)} />}
            {product.traffic && <SpecRow label={lang === 'ar' ? 'الاستخدام' : 'Traffic'} value={getLabel('traffic', product.traffic, lang)} />}
            {product.opacity && <SpecRow label={lang === 'ar' ? 'التعتيم' : 'Opacity'} value={getLabel('opacity', product.opacity, lang)} />}
            {product.wallcovering_subcategory && <SpecRow label={lang === 'ar' ? 'النوع' : 'Type'} value={getLabel('wallcovering_subcategory', product.wallcovering_subcategory, lang)} />}
            {product.panel_subcategory && <SpecRow label={lang === 'ar' ? 'النوع' : 'Type'} value={getLabel('panel_subcategory', product.panel_subcategory, lang)} />}
            {product.rugs_subcategory && <SpecRow label={lang === 'ar' ? 'النوع' : 'Type'} value={getLabel('rugs_subcategory', product.rugs_subcategory, lang)} />}
            <SpecRow label={t(ui.product.performance, lang)} value={getLabels('performance', product.performance, lang)} />
            <SpecRow label={t(ui.product.cleaners, lang)} value={getLabels('cleaners', product.cleaners, lang)} />
            <SpecRow label={t(ui.product.environmental, lang)} value={getLabels('environmental', product.environmental, lang)} />
            <SpecRow label={t(ui.product.region, lang)} value={getLabel('production_region', product.production_region, lang)} />
            {product.collaborators?.length > 0 && (
              <SpecRow label={t(ui.product.collaborators, lang)} value={product.collaborators.map((c) => c.name).join(', ')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
