'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/contexts/LangContext'
import { getCategoryLabel, imageUrl, cn } from '@/lib/utils'

export default function ProductCard({ product, priority = false }) {
  const { lang } = useLang()
  const name     = (lang === 'ar' && product.name_ar) ? product.name_ar : (product.name_en || product.name || product.sku || '')
  const img      = product.primary_image
  const imgUrl   = imageUrl(img)
  const colors   = product.colors?.slice(0, 5) || []

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block animate-fade-up"
      aria-label={name}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2 mb-4">
        {imgUrl && imgUrl !== '/placeholder-fabric.jpg' ? (
          <Image
            src={imgUrl}
            alt={img?.alt_text_en || name || 'Product image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border border-border flex items-center justify-center text-2xl opacity-30">
              ▦
            </div>
          </div>
        )}

        {/* Featured badge */}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-medium tracking-widest uppercase px-2 py-1">
            Featured
          </span>
        )}

        {/* Category tag */}
        <span className="absolute bottom-3 right-3 bg-canvas/90 backdrop-blur-sm text-ink text-[10px] font-medium tracking-[0.15em] uppercase px-2 py-1">
          {getCategoryLabel(product.category, lang)}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted">
          {product.sku}
        </p>
        <h3 className="font-display text-lg font-light leading-tight text-ink group-hover:text-gold transition-colors duration-300">
          {name}
        </h3>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {colors.map((color) => (
              <span
                key={color.id || color.slug}
                className="h-3.5 w-3.5 rounded-full border border-border/60 ring-offset-canvas transition-transform hover:scale-125"
                style={{ backgroundColor: color.hex_code || '#ccc' }}
                title={lang === 'ar' ? color.name_ar || color.name_en : color.name_en}
                aria-label={color.name_en}
              />
            ))}
            {product.colors?.length > 5 && (
              <span className="text-[10px] text-muted">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
