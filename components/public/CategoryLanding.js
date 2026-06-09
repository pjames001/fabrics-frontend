'use client'
import Link from 'next/link'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CATEGORIES, cn } from '@/lib/utils'

const CATEGORY_DESCRIPTIONS = {
  wall_covering: {
    en: 'Natural, vinyl, prints, fabric, murals & acoustic solutions',
    ar: 'طبيعي، فينيل، مطبوعات، قماش، جداريات وحلول عازلة للصوت',
  },
  upholstery: {
    en: 'Premium indoor & outdoor upholstery fabrics',
    ar: 'أقمشة تنجيد فاخرة للاستخدام الداخلي والخارجي',
  },
  curtains: {
    en: 'Sheer, blackout, dim-out, sunscreen & vintage styles',
    ar: 'شفاف، حاجب للضوء، خافت، واقي شمس وأنماط كلاسيكية',
  },
  tassels: {
    en: 'Decorative tassels and trimmings',
    ar: 'شراريب وزخارف ديكورية',
  },
}

export default function CategoryLanding() {
  const { lang } = useLang()

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b border-border bg-canvas">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="section-label mb-3">{t(ui.categories.theCollection, lang)}</p>
          <h1 className="font-display text-5xl font-light text-ink">{t(ui.categories.ourProducts, lang)}</h1>
          <p className="text-muted mt-4 max-w-xl">{t(ui.categories.exploreRange, lang)}</p>
        </div>
      </div>

      {/* Category grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/products/${cat.slug}`}
              className="group block border border-border hover:border-gold transition-colors duration-300 bg-surface hover:bg-surface-2"
            >
              <div className="aspect-[4/3] flex items-center justify-center bg-surface-2 group-hover:bg-canvas transition-colors duration-300">
                <span className="text-6xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {cat.icon}
                </span>
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-light text-ink group-hover:text-gold transition-colors duration-300 mb-2">
                  {lang === 'ar' ? cat.label.ar : cat.label.en}
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[cat.value]?.[lang] || ''}
                </p>
                {cat.subcategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <span key={sub.value} className="text-[10px] tracking-[0.12em] uppercase text-muted border border-border px-2 py-0.5">
                        {lang === 'ar' ? sub.label.ar : sub.label.en}
                      </span>
                    ))}
                    {cat.subcategories.length > 4 && (
                      <span className="text-[10px] tracking-[0.12em] uppercase text-muted border border-border px-2 py-0.5">
                        +{cat.subcategories.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
