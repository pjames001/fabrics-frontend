'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'

const services = [
  {
    icon: '🎯',
    en: { title: 'Material Specification', body: 'Expert guidance on selecting the right fabric for every application — performance, aesthetics, and budget all considered. We provide comprehensive specification sheets and sample boards.', tags: ['Upholstery', 'Drapery', 'Wall Covering'] },
    ar: { title: 'تخصيص المواد', body: 'توجيه خبير في اختيار القماش المناسب لكل تطبيق — مع مراعاة الأداء والجماليات والميزانية. نقدم أوراق مواصفات شاملة ولوحات عينات.', tags: ['تنجيد', 'ستائر', 'أغطية جدران'] },
  },
  {
    icon: '📦',
    en: { title: 'Contract Supply', body: 'Reliable large-scale supply for hospitality, commercial, and residential projects. Consistent dye lots, assured lead times, and dedicated project management.', tags: ['Hospitality', 'Commercial', 'Residential'] },
    ar: { title: 'التوريد للمشاريع', body: 'توريد موثوق بكميات كبيرة للضيافة والمشاريع التجارية والسكنية. أصباغ متسقة وأوقات تسليم محددة وإدارة مشاريع مخصصة.', tags: ['الضيافة', 'التجاري', 'السكني'] },
  },
  {
    icon: '🎨',
    en: { title: 'Design Consultation', body: "One-on-one sessions with our in-house textile specialists. Bring your mood board — we'll help you discover the perfect palette and texture story for your project.", tags: ['Colour Matching', 'Trend Advice', 'Mood Boards'] },
    ar: { title: 'استشارة التصميم', body: 'جلسات فردية مع متخصصي المنسوجات لدينا. أحضر لوحة مزاجك — سنساعدك على اكتشاف قصة الألوان والملمس المثالية لمشروعك.', tags: ['مطابقة الألوان', 'نصائح الترندات', 'لوحات المزاج'] },
  },
  {
    icon: '🔬',
    en: { title: 'Sample Service', body: 'Receive physical samples and memo cuttings dispatched within 48 hours anywhere in the GCC. Full sample library access available at our showroom.', tags: ['48h Dispatch', 'Full Library', 'GCC Delivery'] },
    ar: { title: 'خدمة العينات', body: 'استلم عينات فعلية وقصاصات في غضون 48 ساعة في أي مكان في منطقة الخليج. إمكانية الوصول الكامل لمكتبة العينات في صالة العرض.', tags: ['شحن 48 ساعة', 'مكتبة كاملة', 'توصيل للخليج'] },
  },
  {
    icon: '🌍',
    en: { title: 'Custom Import', body: "Can't find what you're looking for? We leverage our global mill network to source bespoke quantities, custom colourways, and exclusive weaves for your project.", tags: ['Custom Colour', 'Exclusive Weaves', 'MOQ Flexibility'] },
    ar: { title: 'الاستيراد المخصص', body: 'لا تجد ما تبحث عنه؟ نستغل شبكة المصانع العالمية لدينا للحصول على كميات مخصصة وألوان فريدة ونسيج حصري لمشروعك.', tags: ['لون مخصص', 'نسيج حصري', 'مرونة الكميات'] },
  },
  {
    icon: '📐',
    en: { title: 'Technical Support', body: 'Fire-rating certifications, cleaning codes, durability test reports, and installation guides — we provide full technical documentation for every product we supply.', tags: ['Fire Rating', 'Rub Tests', 'Install Guides'] },
    ar: { title: 'الدعم التقني', body: 'شهادات مقاومة الحريق وأكواد التنظيف وتقارير اختبارات المتانة وأدلة التركيب — نوفر الوثائق التقنية الكاملة لكل منتج نوفره.', tags: ['تقييم الحريق', 'اختبارات الاحتكاك', 'أدلة التركيب'] },
  },
]

export default function ServicesPage() {
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
          <p className="section-label mb-6 animate-fade-up">{t(ui.services.eyebrow, lang)}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-ink leading-none mb-8 animate-fade-up animate-delay-100 whitespace-pre-line">
            {t(ui.services.heading, lang)}
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl animate-fade-up animate-delay-200">
            {t(ui.services.sub, lang)}
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 bg-surface" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const content = rtl ? svc.ar : svc.en
              return (
                <div key={svc.en.title} className="border border-border p-8 hover:border-gold transition-all duration-300 group bg-canvas">
                  <span className="text-3xl mb-5 block">{svc.icon}</span>
                  <h3 className="font-display text-2xl font-light text-ink mb-4 group-hover:text-gold transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6">{content.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 border border-border text-muted group-hover:border-gold/50 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-ink" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="section-label text-gold mb-4">{t(ui.services.ctaLabel, lang)}</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-canvas mb-6">
            {t(ui.services.ctaHead, lang)}
          </h2>
          <p className="text-canvas/60 max-w-lg mx-auto mb-10 leading-relaxed">
            {t(ui.services.ctaBody, lang)}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contact" className="btn-primary">
              {t(ui.services.ctaContact, lang)} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products" className="btn-secondary border-canvas/30 text-canvas hover:bg-canvas hover:text-ink">
              {t(ui.services.ctaBrowse, lang)}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
