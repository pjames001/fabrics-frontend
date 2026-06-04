'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext({ lang: 'en', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('fs_lang') || 'en'
    setLangState(stored)
    document.documentElement.lang = stored
    document.documentElement.dir  = stored === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const setLang = (l) => {
    setLangState(l)
    localStorage.setItem('fs_lang', l)
    document.documentElement.lang = l
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

// Translation helper — t(translations, lang)
export const t = (obj, lang) =>
  (lang === 'ar' && obj?.ar) ? obj.ar : (obj?.en ?? obj ?? '')

// Static UI translations
export const ui = {
  nav: {
    home:         { en: 'Home',          ar: 'الرئيسية' },
    products:     { en: 'Products',      ar: 'المنتجات' },
    upholstery:   { en: 'Upholstery',    ar: 'التنجيد' },
    leather:      { en: 'Leather',       ar: 'الجلود' },
    wallcovering: { en: 'Wall Covering', ar: 'أغطية الجدران' },
    panel:        { en: 'Panel',         ar: 'الألواح' },
    privacy:      { en: 'Privacy Curtain', ar: 'ستائر الخصوصية' },
    window:       { en: 'Window Covering', ar: 'أغطية النوافذ' },
    rugs:         { en: 'Rugs',          ar: 'السجاد' },
  },
  filters: {
    filters:     { en: 'Filters',     ar: 'الفلاتر' },
    clearAll:    { en: 'Clear all',   ar: 'مسح الكل' },
    search:      { en: 'Search products…', ar: 'البحث في المنتجات…' },
    perPage:     { en: 'Per page',    ar: 'في الصفحة' },
    noResults:   { en: 'No products found.', ar: 'لا توجد منتجات.' },
    loading:     { en: 'Loading…',    ar: 'جارٍ التحميل…' },
  },
  product: {
    sku:         { en: 'SKU',         ar: 'رمز المنتج' },
    content:     { en: 'Content',     ar: 'المحتوى' },
    pattern:     { en: 'Pattern',     ar: 'النمط' },
    colors:      { en: 'Colors',      ar: 'الألوان' },
    performance: { en: 'Performance', ar: 'الأداء' },
    cleaners:    { en: 'Cleaners',    ar: 'منظفات' },
    environmental: { en: 'Environmental', ar: 'البيئة' },
    region:      { en: 'Production Region', ar: 'منطقة الإنتاج' },
    collaborators: { en: 'Collaborators', ar: 'المتعاونون' },
    viewAll:     { en: 'View All Products', ar: 'عرض جميع المنتجات' },
    featured:    { en: 'Featured',    ar: 'مميز' },
  },
  hero: {
    eyebrow: { en: 'Premium Textiles & Surfaces', ar: 'منسوجات ومساطح راقية' },
    heading: { en: 'Where Craft Meets\nMaterial Excellence', ar: 'حيث تلتقي الحرفية\nبتميز المواد' },
    sub:     { en: 'Curated upholstery, leather, wallcovering, and more — sourced from the world\'s finest ateliers.', ar: 'تنجيد وجلود وأغطية جدران منتقاة بعناية — من أرقى مراسم العالم.' },
    cta:     { en: 'Explore Collection', ar: 'استكشف المجموعة' },
  },
  categories: {
    heading: { en: 'Our Collections', ar: 'مجموعاتنا' },
  },
}
