'use client'
import { useState } from 'react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'all',         en: 'All Projects',   ar: 'جميع المشاريع' },
  { value: 'hospitality', en: 'Hospitality',     ar: 'الضيافة' },
  { value: 'commercial',  en: 'Commercial',      ar: 'التجاري' },
  { value: 'residential', en: 'Residential',     ar: 'السكني' },
  { value: 'healthcare',  en: 'Healthcare',      ar: 'الرعاية الصحية' },
]

const projects = [
  {
    id: 1, category: 'hospitality', year: '2024',
    location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    en: { title: 'Luxury Hotel Lobby', client: 'A 5-star property in Downtown Dubai', body: 'Full upholstery and drapery specification for 200+ guest rooms and public areas, featuring our signature bespoke velvet collection in deep jewel tones.' },
    ar: { title: 'لوبي فندق فاخر', client: 'فندق خمس نجوم في وسط مدينة دبي', body: 'مواصفات التنجيد والستائر الكاملة لأكثر من 200 غرفة ضيوف ومناطق عامة، تتميز بمجموعة المخمل المخصصة بألوان جواهر غنية.' },
    gradient: 'from-gold/20 to-ink/10', icon: '🏨',
  },
  {
    id: 2, category: 'commercial', year: '2024',
    location: { en: 'Riyadh, KSA', ar: 'الرياض، المملكة العربية السعودية' },
    en: { title: 'Corporate Headquarters', client: 'Financial services firm, King Abdullah District', body: 'Acoustic panel fabrics and contract-grade seating upholstery for 15 floors, balancing brand identity with ISO-certified fire performance.' },
    ar: { title: 'مقر الشركة الرئيسي', client: 'شركة خدمات مالية، حي الملك عبدالله', body: 'أقمشة ألواح عازلة للصوت وتنجيد مقاعد للمشاريع لـ15 طابقاً، تجمع بين هوية العلامة التجارية والأداء المعتمد ISO لمقاومة الحريق.' },
    gradient: 'from-ink/10 to-gold/20', icon: '🏢',
  },
  {
    id: 3, category: 'residential', year: '2023',
    location: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' },
    en: { title: 'Private Villa — Saadiyat Island', client: 'Private residential commission', body: 'Curated a bespoke material palette of hand-woven silks, Italian leathers, and Belgian linen for an 8,000 sqft villa, working closely with the lead interior designer.' },
    ar: { title: 'فيلا خاصة — جزيرة السعديات', client: 'مشروع سكني خاص', body: 'اخترنا لوحة مواد مخصصة من الحرير المنسوج يدوياً والجلود الإيطالية والكتان البلجيكي لفيلا بمساحة 8000 قدم مربع.' },
    gradient: 'from-surface-2 to-canvas', icon: '🏡',
  },
  {
    id: 4, category: 'hospitality', year: '2023',
    location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    en: { title: 'Boutique Resort Spa', client: 'Luxury resort, The Pearl', body: 'Water-resistant performance fabrics for pool-adjacent lounging, treatment room upholstery, and humidity-controlled wall panels throughout the spa complex.' },
    ar: { title: 'منتجع سبا بوتيك', client: 'منتجع فاخر، لؤلؤة قطر', body: 'أقمشة مقاومة للماء لمناطق الاسترخاء بجانب المسبح وتنجيد غرف العلاج وألواح الجدران المتحكم فيها بالرطوبة عبر مجمع السبا.' },
    gradient: 'from-gold/10 to-surface', icon: '🌊',
  },
  {
    id: 5, category: 'healthcare', year: '2023',
    location: { en: 'Kuwait City, Kuwait', ar: 'مدينة الكويت، الكويت' },
    en: { title: 'Private Medical Centre', client: 'Specialist clinic, Salmiya', body: 'Antimicrobial, cleanable upholstery fabrics for patient seating and consultation rooms, all meeting EN ISO 16373 healthcare specification requirements.' },
    ar: { title: 'مركز طبي خاص', client: 'عيادة متخصصة، السالمية', body: 'أقمشة تنجيد مضادة للميكروبات وقابلة للتنظيف لمقاعد المرضى وغرف الاستشارة، تستوفي جميع متطلبات مواصفات الرعاية الصحية EN ISO 16373.' },
    gradient: 'from-surface to-surface-2', icon: '🏥',
  },
  {
    id: 6, category: 'commercial', year: '2022',
    location: { en: 'Manama, Bahrain', ar: 'المنامة، البحرين' },
    en: { title: 'Mixed-Use Tower — Lobby', client: 'Real estate developer, Diplomatic Area', body: 'Statement wall covering and feature seating for the 3-storey atrium lobby. Custom-coloured grasscloth panels and hand-tufted area rugs anchoring the space.' },
    ar: { title: 'برج متعدد الاستخدامات — لوبي', client: 'مطور عقاري، المنطقة الدبلوماسية', body: 'أغطية جدران بارزة ومقاعد مميزة للوبي الضخم من 3 طوابق. ألواح grasscloth بألوان مخصصة وسجاد مناطق منسوج يدوياً.' },
    gradient: 'from-ink/5 to-gold/15', icon: '🌆',
  },
]

export default function ProjectsPage() {
  const { lang } = useLang()
  const rtl = lang === 'ar'
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-canvas">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#1C1917 0,transparent 1px,transparent 79px,#1C1917 80px),repeating-linear-gradient(90deg,#1C1917 0,transparent 1px,transparent 79px,#1C1917 80px)' }}
          />
        </div>
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-gold to-transparent opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="section-label mb-6 animate-fade-up">{t(ui.projects.eyebrow, lang)}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-ink leading-none mb-8 animate-fade-up animate-delay-100 whitespace-pre-line">
            {t(ui.projects.heading, lang)}
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl animate-fade-up animate-delay-200">
            {t(ui.projects.sub, lang)}
          </p>
        </div>
      </section>

      {/* Filter tabs + grid */}
      <section className="py-16 bg-surface" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'text-xs font-medium tracking-widest uppercase px-4 py-2 border transition-colors duration-200',
                  activeCategory === cat.value
                    ? 'bg-ink text-canvas border-ink'
                    : 'border-border text-muted hover:border-gold hover:text-ink'
                )}
              >
                {rtl ? cat.ar : cat.en}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => {
              const content = rtl ? project.ar : project.en
              const loc = rtl ? project.location.ar : project.location.en
              return (
                <div key={project.id} className="group border border-border hover:border-gold transition-all duration-300 overflow-hidden bg-canvas">
                  <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                    <span className="text-5xl">{project.icon}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-medium tracking-widest uppercase text-gold">
                        {rtl
                          ? categories.find((c) => c.value === project.category)?.ar
                          : categories.find((c) => c.value === project.category)?.en}
                      </span>
                      <span className="text-xs text-muted">{project.year}</span>
                    </div>
                    <h3 className="font-display text-xl font-light text-ink mb-1 group-hover:text-gold transition-colors">
                      {content.title}
                    </h3>
                    <p className="text-xs text-muted mb-3">{loc}</p>
                    <p className="text-sm text-muted leading-relaxed">{content.body}</p>
                    <p className="text-xs text-muted/60 mt-4 italic">{content.client}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
