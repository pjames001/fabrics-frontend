import { clsx } from 'clsx'

export const cn = (...inputs) => clsx(inputs)

export const CATEGORIES = [
  {
    value: 'wall_covering',
    slug:  'wall-covering',
    label: { en: 'Wall Covering', ar: 'أغطية الجدران' },
    icon:  '🏛️',
    subcategories: [
      { value: 'natural',  label: { en: 'Natural',  ar: 'طبيعي' } },
      { value: 'vinyl',    label: { en: 'Vinyl',    ar: 'فينيل' } },
      { value: 'prints',   label: { en: 'Prints',   ar: 'مطبوعات' } },
      { value: 'fabric',   label: { en: 'Fabric',   ar: 'قماش' } },
      { value: 'murals',   label: { en: 'Murals',   ar: 'جداريات' } },
      { value: 'acoustic', label: { en: 'Acoustic', ar: 'عازل صوت' } },
    ],
  },
  {
    value: 'upholstery',
    slug:  'upholstery',
    label: { en: 'Upholstery', ar: 'تنجيد' },
    icon:  '🪑',
    subcategories: [
      { value: 'indoor',  label: { en: 'Indoor',  ar: 'داخلي' } },
      { value: 'outdoor', label: { en: 'Outdoor', ar: 'خارجي' } },
    ],
  },
  {
    value: 'curtains',
    slug:  'curtains',
    label: { en: 'Curtains', ar: 'ستائر' },
    icon:  '🪟',
    subcategories: [
      { value: 'sheer',     label: { en: 'Sheer',     ar: 'شفاف' } },
      { value: 'blackout',  label: { en: 'Blackout',  ar: 'حاجب للضوء' } },
      { value: 'dim_out',   label: { en: 'Dim Out',   ar: 'خافت' } },
      { value: 'sunscreen', label: { en: 'Sunscreen', ar: 'واقي شمس' } },
      { value: 'vintage',   label: { en: 'Vintage',   ar: 'كلاسيكي' } },
    ],
  },
  {
    value: 'tassels',
    slug:  'tassels',
    label: { en: 'Tassels', ar: 'شراريب' },
    icon:  '✨',
    subcategories: [],
  },
]

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96]

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

export const truncate = (str, n) =>
  str && str.length > n ? str.slice(0, n - 1) + '…' : str

export const buildQueryString = (params) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      if (Array.isArray(v)) v.forEach((vi) => q.append(k, vi))
      else q.set(k, v)
    }
  })
  return q.toString()
}

export const parseError = (err) => {
  if (!err?.response) return 'Network error — please try again.'
  const data = err.response.data
  if (typeof data === 'string') {
    if (data.trimStart().startsWith('<')) return `Server error (${err.response.status}) — please try again.`
    return data
  }
  if (data?.detail) return data.detail
  const msgs = []
  Object.entries(data || {}).forEach(([field, errs]) => {
    const list = Array.isArray(errs) ? errs : [errs]
    list.forEach((e) => msgs.push(field === 'non_field_errors' ? e : `${field}: ${e}`))
  })
  return msgs.join(' • ') || 'An unexpected error occurred.'
}

// ── Bilingual choice label maps ───────────────────────────────────

export const CHOICE_LABELS = {
  // Wall Covering
  background: {
    paper:  { en: 'Paper',  ar: 'ورق' },
    fabric: { en: 'Fabric', ar: 'قماش' },
  },
  match: {
    random:   { en: 'Random',   ar: 'عشوائي' },
    straight: { en: 'Straight', ar: 'مستقيم' },
    repeat:   { en: 'Repeat',   ar: 'متكرر' },
  },
  remove_type: {
    wet: { en: 'Wet', ar: 'رطب' },
    dry: { en: 'Dry', ar: 'جاف' },
  },
  order_type: {
    wet: { en: 'Wet', ar: 'رطب' },
    dry: { en: 'Dry', ar: 'جاف' },
  },
  maintenance: {
    wipe_gently: { en: 'Wipe Gently', ar: 'امسح برفق' },
    soft_vac:    { en: 'Soft Vac',    ar: 'مكنسة لطيفة' },
  },
  light_fastness: {
    hard:   { en: 'Hard',   ar: 'قوي' },
    medium: { en: 'Medium', ar: 'متوسط' },
    normal: { en: 'Normal', ar: 'عادي' },
  },
  wall_covering_material: {
    wood:       { en: 'Wood',       ar: 'خشب' },
    veneer:     { en: 'Veneer',     ar: 'قشرة خشب' },
    seashell:   { en: 'Seashell',   ar: 'صدف' },
    metal:      { en: 'Metal',      ar: 'معدن' },
    raffias:    { en: 'Raffias',    ar: 'رافيا' },
    grasscloth: { en: 'Grasscloth', ar: 'قماش العشب' },
    silk:       { en: 'Silk',       ar: 'حرير' },
    satean:     { en: 'Satean',     ar: 'ساتان' },
    line:       { en: 'Line',       ar: 'كتان' },
    fur:        { en: 'Fur',        ar: 'فراء' },
  },
  wall_covering_subcategory: {
    natural:  { en: 'Natural',  ar: 'طبيعي' },
    vinyl:    { en: 'Vinyl',    ar: 'فينيل' },
    prints:   { en: 'Prints',   ar: 'مطبوعات' },
    fabric:   { en: 'Fabric',   ar: 'قماش' },
    murals:   { en: 'Murals',   ar: 'جداريات' },
    acoustic: { en: 'Acoustic', ar: 'عازل صوت' },
  },
  // Upholstery
  upholstery_usage: {
    curtain:          { en: 'Curtain',          ar: 'ستارة' },
    light_upholstery: { en: 'Light Upholstery', ar: 'تنجيد خفيف' },
    heavy_upholstery: { en: 'Heavy Upholstery', ar: 'تنجيد ثقيل' },
    wall_covering:    { en: 'Wall Covering',    ar: 'غطاء جدار' },
    drapery:          { en: 'Drapery',          ar: 'ستائر' },
    blinds:           { en: 'Blinds',           ar: 'مراتع' },
    cushions:         { en: 'Cushions',         ar: 'وسائد' },
  },
  upholstery_material: {
    leather: { en: 'Leather', ar: 'جلد' },
    velvet:  { en: 'Velvet',  ar: 'مخمل' },
    linen:   { en: 'Linen',   ar: 'كتان' },
    satean:  { en: 'Satean',  ar: 'ساتان' },
    silk:    { en: 'Silk',    ar: 'حرير' },
  },
  upholstery_subcategory: {
    indoor:  { en: 'Indoor',  ar: 'داخلي' },
    outdoor: { en: 'Outdoor', ar: 'خارجي' },
  },
  // Curtains
  curtain_usage: {
    curtains:         { en: 'Curtains',         ar: 'ستائر' },
    light_upholstery: { en: 'Light Upholstery', ar: 'تنجيد خفيف' },
    blinds:           { en: 'Blinds',           ar: 'مراتع' },
    cushions:         { en: 'Cushions',         ar: 'وسائد' },
  },
  curtain_material: {
    leather: { en: 'Leather', ar: 'جلد' },
    velvet:  { en: 'Velvet',  ar: 'مخمل' },
    linen:   { en: 'Linen',   ar: 'كتان' },
    satean:  { en: 'Satean',  ar: 'ساتان' },
    silk:    { en: 'Silk',    ar: 'حرير' },
  },
  curtains_subcategory: {
    sheer:     { en: 'Sheer',     ar: 'شفاف' },
    blackout:  { en: 'Blackout',  ar: 'حاجب للضوء' },
    dim_out:   { en: 'Dim Out',   ar: 'خافت' },
    sunscreen: { en: 'Sunscreen', ar: 'واقي شمس' },
    vintage:   { en: 'Vintage',   ar: 'كلاسيكي' },
  },
}

export const getLabel = (mapKey, value, lang = 'en') => {
  if (!value) return ''
  const entry = CHOICE_LABELS[mapKey]?.[value]
  return entry ? (lang === 'ar' ? entry.ar : entry.en) : value
}

export const getLabels = (mapKey, values, lang = 'en') => {
  if (!values?.length) return ''
  return values.map((v) => getLabel(mapKey, v, lang)).join('، ')
}

export const getCategoryLabel = (value, lang = 'en') => {
  const cat = CATEGORIES.find((c) => c.value === value)
  return cat ? (lang === 'ar' ? cat.label.ar : cat.label.en) : value
}

export const getCategorySlug = (value) => {
  const cat = CATEGORIES.find((c) => c.value === value)
  return cat ? cat.slug : value
}

export const getCategoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)

export const imageUrl = (img) => {
  const src = img?.image_url || img?.image
  if (!src) return '/placeholder-fabric.jpg'
  if (src.startsWith('/media/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:8000'
    return `${apiBase}${src}`
  }
  return src
}
