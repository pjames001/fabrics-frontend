import { clsx } from 'clsx'

export const cn = (...inputs) => clsx(inputs)

export const CATEGORIES = [
  { value: 'upholstery',      label: { en: 'Upholstery',      ar: 'تنجيد' },        icon: '🪑' },
  { value: 'leather',         label: { en: 'Leather',         ar: 'جلود' },          icon: '🪶' },
  { value: 'wallcovering',    label: { en: 'Wall Covering',   ar: 'أغطية جدران' },   icon: '🏛️' },
  { value: 'panel',           label: { en: 'Panel',           ar: 'ألواح' },          icon: '▦' },
  { value: 'privacy_curtain', label: { en: 'Privacy Curtain', ar: 'ستائر خصوصية' },  icon: '🪟' },
  { value: 'window_covering', label: { en: 'Window Covering', ar: 'أغطية نوافذ' },   icon: '☀️' },
  { value: 'rugs',            label: { en: 'Rugs',            ar: 'سجاد' },           icon: '🟫' },
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
  // Flatten field errors
  const msgs = []
  Object.entries(data || {}).forEach(([field, errs]) => {
    const list = Array.isArray(errs) ? errs : [errs]
    list.forEach((e) => msgs.push(field === 'non_field_errors' ? e : `${field}: ${e}`))
  })
  return msgs.join(' • ') || 'An unexpected error occurred.'
}

// ── Bilingual choice label maps ───────────────────────────────────
export const CHOICE_LABELS = {
  pattern: {
    solid:       { en: 'Solid',       ar: 'سادة' },
    stripe:      { en: 'Stripe',      ar: 'مخطط' },
    geometric:   { en: 'Geometric',   ar: 'هندسي' },
    floral:      { en: 'Floral',      ar: 'زهري' },
    abstract:    { en: 'Abstract',    ar: 'تجريدي' },
    animal:      { en: 'Animal',      ar: 'حيواني' },
    check:       { en: 'Check',       ar: 'مربعات' },
    damask:      { en: 'Damask',      ar: 'داماسك' },
    herringbone: { en: 'Herringbone', ar: 'هيرينغبون' },
    jacquard:    { en: 'Jacquard',    ar: 'جاكار' },
    paisley:     { en: 'Paisley',     ar: 'بيزلي' },
    texture:     { en: 'Texture',     ar: 'ملمس' },
    plain:       { en: 'Plain',       ar: 'بدون نمط' },
  },
  scale: {
    small:       { en: 'Small',       ar: 'صغير' },
    medium:      { en: 'Medium',      ar: 'متوسط' },
    large:       { en: 'Large',       ar: 'كبير' },
    extra_large: { en: 'Extra Large', ar: 'كبير جداً' },
  },
  traffic: {
    light:       { en: 'Light',       ar: 'خفيف' },
    medium:      { en: 'Medium',      ar: 'متوسط' },
    heavy:       { en: 'Heavy',       ar: 'ثقيل' },
    extra_heavy: { en: 'Extra Heavy', ar: 'ثقيل جداً' },
  },
  abrasion: {
    lt_10000:        { en: 'Less than 10,000 rubs',  ar: 'أقل من 10,000 حكّة' },
    '10000_30000':   { en: '10,000 – 30,000 rubs',  ar: '10,000 – 30,000 حكّة' },
    '30000_50000':   { en: '30,000 – 50,000 rubs',  ar: '30,000 – 50,000 حكّة' },
    '50000_100000':  { en: '50,000 – 100,000 rubs', ar: '50,000 – 100,000 حكّة' },
    gt_100000:       { en: '100,000+ rubs',          ar: 'أكثر من 100,000 حكّة' },
  },
  opacity: {
    sheer:       { en: 'Sheer',       ar: 'شفاف' },
    semi_sheer:  { en: 'Semi-Sheer',  ar: 'شبه شفاف' },
    semi_opaque: { en: 'Semi-Opaque', ar: 'شبه معتم' },
    opaque:      { en: 'Opaque',      ar: 'معتم' },
    blackout:    { en: 'Blackout',    ar: 'حاجب للضوء' },
  },
  weave_type: {
    woven:    { en: 'Woven',     ar: 'منسوج' },
    nonwoven: { en: 'Non-woven', ar: 'غير منسوج' },
  },
  production_region: {
    usa:     { en: 'USA',            ar: 'الولايات المتحدة' },
    canada:  { en: 'Canada',         ar: 'كندا' },
    mexico:  { en: 'Mexico',         ar: 'المكسيك' },
    uk:      { en: 'United Kingdom', ar: 'المملكة المتحدة' },
    europe:  { en: 'Europe',         ar: 'أوروبا' },
    italy:   { en: 'Italy',          ar: 'إيطاليا' },
    belgium: { en: 'Belgium',        ar: 'بلجيكا' },
    china:   { en: 'China',          ar: 'الصين' },
    india:   { en: 'India',          ar: 'الهند' },
    turkey:  { en: 'Turkey',         ar: 'تركيا' },
    other:   { en: 'Other',          ar: 'أخرى' },
  },
  performance: {
    antimicrobial:         { en: 'Antimicrobial',           ar: 'مضاد للميكروبات' },
    bleach_cleanable:      { en: 'Bleach Cleanable',        ar: 'قابل للتنظيف بالكلور' },
    fire_retardant:        { en: 'Fire Retardant',          ar: 'مقاوم للحريق' },
    moisture_barrier:      { en: 'Moisture Barrier',        ar: 'حاجز رطوبة' },
    mold_mildew_resistant: { en: 'Mold & Mildew Resistant', ar: 'مقاوم للعفن والفطريات' },
    stain_resistant:       { en: 'Stain Resistant',         ar: 'مقاوم للبقع' },
    uv_resistant:          { en: 'UV Resistant',            ar: 'مقاوم للأشعة فوق البنفسجية' },
    water_repellent:       { en: 'Water Repellent',         ar: 'طارد للماء' },
  },
  cleaners: {
    water_based:     { en: 'Water Based',        ar: 'على أساس مائي' },
    solvent_based:   { en: 'Solvent Based',       ar: 'على أساس مذيب' },
    dry_clean:       { en: 'Dry Clean Only',      ar: 'تنظيف جاف فقط' },
    mild_soap:       { en: 'Mild Soap & Water',   ar: 'صابون خفيف وماء' },
    bleach_solution: { en: 'Bleach Solution',     ar: 'محلول الكلور' },
    enzyme_cleaner:  { en: 'Enzyme Cleaner',      ar: 'منظف إنزيمي' },
  },
  environmental: {
    recycled_content:  { en: 'Recycled Content',      ar: 'محتوى معاد تدويره' },
    low_voc:           { en: 'Low VOC',               ar: 'منخفض المركبات المتطايرة' },
    greenguard:        { en: 'GREENGUARD Certified',  ar: 'معتمد GREENGUARD' },
    greenguard_gold:   { en: 'GREENGUARD Gold',       ar: 'GREENGUARD ذهبي' },
    leed:              { en: 'LEED Credit Eligible',  ar: 'مؤهل لنقاط LEED' },
    cradle_to_cradle:  { en: 'Cradle to Cradle',      ar: 'من المهد إلى المهد' },
    oeko_tex:          { en: 'OEKO-TEX Certified',    ar: 'معتمد OEKO-TEX' },
    sustainable_source:{ en: 'Sustainably Sourced',   ar: 'مصدر مستدام' },
  },
  wallcovering_subcategory: {
    type_1:        { en: 'Type I',        ar: 'النوع الأول' },
    type_2:        { en: 'Type II',       ar: 'النوع الثاني' },
    type_3:        { en: 'Type III',      ar: 'النوع الثالث' },
    natural:       { en: 'Natural',       ar: 'طبيعي' },
    coated:        { en: 'Coated',        ar: 'مطلي' },
    textile:       { en: 'Textile',       ar: 'نسيجي' },
    digital_print: { en: 'Digital Print', ar: 'طباعة رقمية' },
  },
  panel_subcategory: {
    acoustic:   { en: 'Acoustic',   ar: 'عازل صوت' },
    decorative: { en: 'Decorative', ar: 'زخرفي' },
    tackable:   { en: 'Tackable',   ar: 'قابل للتثبيت' },
    structural: { en: 'Structural', ar: 'هيكلي' },
  },
  rugs_subcategory: {
    flat_weave:   { en: 'Flat Weave',   ar: 'نسيج مسطح' },
    pile:         { en: 'Pile',         ar: 'بايل' },
    hand_knotted: { en: 'Hand Knotted', ar: 'معقود يدوياً' },
    hand_tufted:  { en: 'Hand Tufted',  ar: 'مخيوط يدوياً' },
    machine_made: { en: 'Machine Made', ar: 'مصنوع آلياً' },
    outdoor:      { en: 'Outdoor',      ar: 'للاستخدام الخارجي' },
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

export const imageUrl = (img) => {
  const src = img?.image_url || img?.image
  if (!src) return '/placeholder-fabric.jpg'
  if (src.startsWith('/media/')) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:8000'
    return `${apiBase}${src}`
  }
  return src
}
