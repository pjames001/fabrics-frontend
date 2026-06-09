'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { imageUrl, getCategoryLabel, getCategorySlug, getLabel, cn } from '@/lib/utils'

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

function WallCoveringSpecs({ product, lang }) {
  return (
    <>
      {product.composition         && <SpecRow label={t(ui.specs.composition,   lang)} value={product.composition} />}
      {product.background          && <SpecRow label={t(ui.specs.background,    lang)} value={getLabel('background', product.background, lang)} />}
      {product.width               && <SpecRow label={t(ui.specs.width,         lang)} value={product.width} />}
      {product.oz                  && <SpecRow label={t(ui.specs.oz,            lang)} value={product.oz} />}
      {product.match               && <SpecRow label={t(ui.specs.match,         lang)} value={getLabel('match', product.match, lang)} />}
      {product.remove_type         && <SpecRow label={t(ui.specs.removeType,    lang)} value={getLabel('remove_type', product.remove_type, lang)} />}
      {product.order_type          && <SpecRow label={t(ui.specs.orderType,     lang)} value={getLabel('order_type', product.order_type, lang)} />}
      {product.maintenance         && <SpecRow label={t(ui.specs.maintenance,   lang)} value={getLabel('maintenance', product.maintenance, lang)} />}
      {product.light_fastness      && <SpecRow label={t(ui.specs.lightFastness, lang)} value={getLabel('light_fastness', product.light_fastness, lang)} />}
      {product.wall_covering_material && <SpecRow label={t(ui.specs.material,  lang)} value={getLabel('wall_covering_material', product.wall_covering_material, lang)} />}
      {product.notes               && <SpecRow label={t(ui.specs.notes,        lang)} value={product.notes} />}
    </>
  )
}

function UpholsterySpecs({ product, lang }) {
  return (
    <>
      {product.composition         && <SpecRow label={t(ui.specs.composition,      lang)} value={product.composition} />}
      {product.weight              && <SpecRow label={t(ui.specs.weight,           lang)} value={product.weight} />}
      {product.upholstery_usage    && <SpecRow label={t(ui.specs.usage,            lang)} value={getLabel('upholstery_usage', product.upholstery_usage, lang)} />}
      {product.width               && <SpecRow label={t(ui.specs.width,            lang)} value={product.width} />}
      {product.horizontal_repeat   && <SpecRow label={t(ui.specs.horizontalRepeat, lang)} value={product.horizontal_repeat} />}
      {product.vertical_repeat     && <SpecRow label={t(ui.specs.verticalRepeat,   lang)} value={product.vertical_repeat} />}
      {product.light_fastness      && <SpecRow label={t(ui.specs.lightFastness,    lang)} value={getLabel('light_fastness', product.light_fastness, lang)} />}
      {product.upholstery_material && <SpecRow label={t(ui.specs.material,         lang)} value={getLabel('upholstery_material', product.upholstery_material, lang)} />}
    </>
  )
}

function CurtainsSpecs({ product, lang }) {
  return (
    <>
      {product.composition       && <SpecRow label={t(ui.specs.composition,      lang)} value={product.composition} />}
      {product.weight            && <SpecRow label={t(ui.specs.weight,           lang)} value={product.weight} />}
      {product.curtain_usage     && <SpecRow label={t(ui.specs.usage,            lang)} value={getLabel('curtain_usage', product.curtain_usage, lang)} />}
      {product.width             && <SpecRow label={t(ui.specs.width,            lang)} value={product.width} />}
      {product.horizontal_repeat && <SpecRow label={t(ui.specs.horizontalRepeat, lang)} value={product.horizontal_repeat} />}
      {product.vertical_repeat   && <SpecRow label={t(ui.specs.verticalRepeat,   lang)} value={product.vertical_repeat} />}
      {product.light_fastness    && <SpecRow label={t(ui.specs.lightFastness,    lang)} value={getLabel('light_fastness', product.light_fastness, lang)} />}
      {product.curtain_material  && <SpecRow label={t(ui.specs.material,         lang)} value={getLabel('curtain_material', product.curtain_material, lang)} />}
    </>
  )
}

function TasselsSpecs({ product, lang }) {
  return (
    <>
      {product.composition && <SpecRow label={t(ui.specs.composition, lang)} value={product.composition} />}
      {product.width       && <SpecRow label={t(ui.specs.width,       lang)} value={product.width} />}
    </>
  )
}

export default function ProductDetailClient({ initialProduct }) {
  const { lang } = useLang()
  const product = initialProduct
  const images  = product.images || []
  const name    = (lang === 'ar' && product.name_ar ? product.name_ar : product.name_en) || product.sku
  const desc    = lang === 'ar' && product.description_ar ? product.description_ar : product.description_en

  const [activeImg, setActiveImg] = useState(() => Math.max(images.findIndex((i) => i.is_primary), 0))

  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1))

  const img = images[activeImg]
  const categorySlug = getCategorySlug(product.category)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:       product.name_en || product.sku,
    description: product.description_en,
    sku:        product.sku,
    image:      images.map((i) => imageUrl(i)).filter(Boolean),
    brand:      { '@type': 'Organization', name: 'Fabric Store' },
    category:   product.category,
  }

  const subcategoryDisplay = (() => {
    if (product.wall_covering_subcategory)
      return getLabel('wall_covering_subcategory', product.wall_covering_subcategory, lang)
    if (product.upholstery_subcategory)
      return getLabel('upholstery_subcategory', product.upholstery_subcategory, lang)
    if (product.curtains_subcategory)
      return getLabel('curtains_subcategory', product.curtains_subcategory, lang)
    return ''
  })()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-10 flex-wrap">
        <Link href="/products" className="hover:text-ink transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t(ui.product.backToProducts, lang)}
        </Link>
        <span>/</span>
        <Link href={`/products/${categorySlug}`} className="hover:text-ink transition-colors capitalize">
          {getCategoryLabel(product.category, lang)}
        </Link>
        {subcategoryDisplay && (
          <>
            <span>/</span>
            <span className="text-muted capitalize">{subcategoryDisplay}</span>
          </>
        )}
        <span>/</span>
        <span className="text-ink">{product.sku}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ── Image panel ──────────────────────────────────────── */}
        <div>
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

            {images.length > 1 && (
              <>
                <button onClick={prevImg} aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-canvas/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-canvas">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={nextImg} aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-canvas/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-canvas">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 bg-canvas/90 text-ink text-xs px-2 py-1">
                {activeImg + 1} / {images.length}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all',
                    i === activeImg ? 'border-gold' : 'border-transparent hover:border-border'
                  )}>
                  {imageUrl(img) !== '/placeholder-fabric.jpg' ? (
                    <Image src={imageUrl(img)} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-surface-2 flex items-center justify-center text-xs text-muted">▦</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {img?.variant_label_en && (
            <p className="mt-3 text-xs text-muted tracking-wide">
              {lang === 'ar' && img.variant_label_ar ? img.variant_label_ar : img.variant_label_en}
            </p>
          )}
        </div>

        {/* ── Info panel ───────────────────────────────────────── */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="section-label">{getCategoryLabel(product.category, lang)}</span>
            {subcategoryDisplay && (
              <span className="text-[10px] tracking-[0.12em] uppercase text-muted border border-border px-2 py-0.5">
                {subcategoryDisplay}
              </span>
            )}
            {product.is_featured && (
              <span className="text-[10px] bg-gold text-white px-2 py-0.5 font-medium tracking-wider uppercase">
                {t(ui.product.featured, lang)}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight text-ink mb-2">
            {name}
          </h1>
          <p className="text-xs text-muted tracking-[0.15em] uppercase mb-6">
            {t(ui.product.itemCode, lang)} {product.sku}
          </p>

          {desc && (
            <p className="text-muted leading-relaxed mb-8 text-sm border-l-2 border-gold pl-4">
              {desc}
            </p>
          )}

          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted mb-3">
                {t(ui.specs.colors, lang)}
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

          {/* Category-specific specifications */}
          <div className="border-t border-border">
            {product.category === 'wall_covering' && <WallCoveringSpecs product={product} lang={lang} />}
            {product.category === 'upholstery'    && <UpholsterySpecs   product={product} lang={lang} />}
            {product.category === 'curtains'      && <CurtainsSpecs     product={product} lang={lang} />}
            {product.category === 'tassels'       && <TasselsSpecs      product={product} lang={lang} />}
          </div>
        </div>
      </div>
    </div>
  )
}
