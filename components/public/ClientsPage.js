'use client'
import { useLang, t, ui } from '@/contexts/LangContext'

const industries = [
  { icon: '🏨', en: 'Hospitality',  ar: 'الضيافة',          count: '80+' },
  { icon: '🏢', en: 'Commercial',   ar: 'التجاري',           count: '150+' },
  { icon: '🏡', en: 'Residential',  ar: 'السكني',            count: '200+' },
  { icon: '🏥', en: 'Healthcare',   ar: 'الرعاية الصحية',    count: '40+' },
  { icon: '🛍️', en: 'Retail',       ar: 'التجزئة',           count: '30+' },
  { icon: '🎓', en: 'Education',    ar: 'التعليم',           count: '20+' },
]

const testimonials = [
  {
    id: 1, name: 'Sarah Al-Mansouri',
    en: { role: 'Principal Designer, Al-Mansouri Interiors', location: 'Dubai, UAE', quote: "Fabric Store has been our go-to partner for over six years. Their product knowledge is unmatched and the quality is consistently exceptional. They've never let a project down." },
    ar: { role: 'المصممة الرئيسية، المنصوري للديكور الداخلي', location: 'دبي، الإمارات', quote: 'كانت Fabric Store شريكنا المفضل لأكثر من ست سنوات. معرفتهم بالمنتجات لا مثيل لها والجودة استثنائية باستمرار. لم يخذلوا أي مشروع قط.' },
  },
  {
    id: 2, name: 'Khalid Al-Rashidi',
    en: { role: 'Head of Procurement, Landmark Hotels Group', location: 'Riyadh, KSA', quote: 'What sets them apart is the combination of a vast product range and genuine technical expertise. Their team helped us navigate complex fire-rating requirements across three properties simultaneously.' },
    ar: { role: 'رئيس المشتريات، مجموعة فنادق لاندمارك', location: 'الرياض، المملكة العربية السعودية', quote: 'ما يميزهم هو الجمع بين مجموعة منتجات واسعة وخبرة تقنية حقيقية. ساعدنا فريقهم في التنقل عبر متطلبات معقدة لمقاومة الحريق في ثلاث عقارات في آنٍ واحد.' },
  },
  {
    id: 3, name: 'Layla Hassan',
    en: { role: 'Studio Director, Form & Function Design Studio', location: 'Kuwait City, Kuwait', quote: "The sample service is a game-changer — materials arrive within 48 hours, which keeps our client presentations on schedule. I can't imagine specifying without them." },
    ar: { role: 'مديرة الاستوديو، استوديو Form & Function للتصميم', location: 'مدينة الكويت، الكويت', quote: 'خدمة العينات تغيّر قواعد اللعبة — تصل المواد في غضون 48 ساعة مما يبقي عروض العملاء في الجدول الزمني. لا أستطيع تخيل تخصيص المواد بدونهم.' },
  },
  {
    id: 4, name: 'Fatima Al-Qassimi',
    en: { role: 'Senior Interior Architect, Fusion Interiors', location: 'Abu Dhabi, UAE', quote: 'I particularly value their custom import service. For a recent palace project we needed specific hand-woven textiles in exact Pantone references — they delivered on every requirement.' },
    ar: { role: 'المهندسة المعمارية الداخلية الأولى، Fusion Interiors', location: 'أبوظبي، الإمارات', quote: 'أقدّر بشكل خاص خدمة الاستيراد المخصص. لمشروع قصر حديث احتجنا لمنسوجات منسوجة يدوياً بألوان Pantone محددة — استوفوا كل متطلب.' },
  },
]

const clientLogos = [
  { name: 'Emirates Group', icon: '✈️' },
  { name: 'DAMAC Properties', icon: '🏗️' },
  { name: 'Rotana Hotels', icon: '🌟' },
  { name: 'Aldar Properties', icon: '🏙️' },
  { name: 'IHG', icon: '🏨' },
  { name: 'Majid Al Futtaim', icon: '🛒' },
  { name: 'NEOM', icon: '🌅' },
  { name: 'Emaar', icon: '🌆' },
]

export default function ClientsPage() {
  const { lang } = useLang()
  const rtl = lang === 'ar'

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
          <p className="section-label mb-6 animate-fade-up">{t(ui.clients.eyebrow, lang)}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-ink leading-none mb-8 animate-fade-up animate-delay-100 whitespace-pre-line">
            {t(ui.clients.heading, lang)}
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl animate-fade-up animate-delay-200">
            {t(ui.clients.sub, lang)}
          </p>
        </div>
      </section>

      {/* Trusted by logos */}
      <section className="py-16 bg-ink" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-medium tracking-widest uppercase text-canvas/40 text-center mb-10">
            {t(ui.clients.trustedBy, lang)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-canvas/10">
            {clientLogos.map((client) => (
              <div key={client.name} className="bg-ink flex flex-col items-center justify-center py-8 gap-2 hover:bg-canvas/5 transition-colors">
                <span className="text-2xl">{client.icon}</span>
                <span className="text-[10px] tracking-wider text-canvas/40 text-center">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-surface" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">{t(ui.clients.industriesLabel, lang)}</p>
          <h2 className="font-display text-4xl font-light text-ink mb-16">{t(ui.clients.industriesHead, lang)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind) => (
              <div key={ind.en} className="border border-border p-6 text-center hover:border-gold transition-colors group">
                <span className="text-3xl mb-3 block">{ind.icon}</span>
                <p className="font-display text-2xl text-gold mb-1">{ind.count}</p>
                <p className="text-xs font-medium tracking-wide text-muted group-hover:text-ink transition-colors">
                  {rtl ? ind.ar : ind.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-4">{t(ui.clients.testimonialsLabel, lang)}</p>
          <h2 className="font-display text-4xl font-light text-ink mb-16">{t(ui.clients.testimonialsHead, lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((item) => {
              const content = rtl ? item.ar : item.en
              return (
                <div key={item.id} className="border border-border p-8 hover:border-gold transition-colors duration-300 group">
                  <div className="mb-6">
                    <span className="font-display text-5xl text-gold leading-none">"</span>
                  </div>
                  <p className="text-muted leading-relaxed mb-6 text-sm">{content.quote}</p>
                  <div className="border-t border-border pt-6">
                    <p className="font-medium text-ink text-sm">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">{content.role}</p>
                    <p className="text-xs text-gold mt-1">{content.location}</p>
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
