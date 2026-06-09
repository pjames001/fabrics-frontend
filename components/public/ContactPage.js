'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'

const contactInfo = [
  {
    icon: MapPin,
    en: { label: 'Showroom', value: 'Dubai Design District (d3), Building 5, Unit 201\nDubai, United Arab Emirates' },
    ar: { label: 'صالة العرض', value: 'دبي ديزاين ديستريكت (d3)، مبنى 5، وحدة 201\nدبي، الإمارات العربية المتحدة' },
  },
  {
    icon: Phone,
    en: { label: 'Phone', value: '+971 4 XXX XXXX' },
    ar: { label: 'الهاتف', value: '+971 4 XXX XXXX' },
  },
  {
    icon: Mail,
    en: { label: 'Email', value: 'hello@fabricstore.ae' },
    ar: { label: 'البريد الإلكتروني', value: 'hello@fabricstore.ae' },
  },
  {
    icon: Clock,
    en: { label: 'Showroom Hours', value: 'Sun – Thu: 9:00 AM – 6:00 PM\nFri: 9:00 AM – 1:00 PM' },
    ar: { label: 'ساعات صالة العرض', value: 'الأحد – الخميس: 9:00 ص – 6:00 م\nالجمعة: 9:00 ص – 1:00 م' },
  },
]

const subjects = {
  en: ['Product Enquiry', 'Sample Request', 'Project Consultation', 'Trade Account', 'Other'],
  ar: ['استفسار عن منتج', 'طلب عينة', 'استشارة مشروع', 'حساب تجاري', 'أخرى'],
}

export default function ContactPage() {
  const { lang } = useLang()
  const rtl = lang === 'ar'

  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

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
          <p className="section-label mb-6 animate-fade-up">{t(ui.contact.eyebrow, lang)}</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-ink leading-none mb-8 animate-fade-up animate-delay-100 whitespace-pre-line">
            {t(ui.contact.heading, lang)}
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl animate-fade-up animate-delay-200">
            {t(ui.contact.sub, lang)}
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-24 bg-surface" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Info panel */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="section-label mb-4">{t(ui.contact.infoLabel, lang)}</p>
              <h2 className="font-display text-3xl font-light text-ink">
                {t(ui.contact.infoHead, lang)}
              </h2>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item) => {
                const Icon = item.icon
                const content = rtl ? item.ar : item.en
                return (
                  <div key={item.en.label} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 border border-border flex items-center justify-center">
                      <Icon className="h-4 w-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted mb-1">{content.label}</p>
                      <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{content.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border border-border p-6 bg-canvas">
              <p className="text-xs font-medium tracking-widest uppercase text-gold mb-3">
                {t(ui.contact.tradeLabel, lang)}
              </p>
              <p className="text-sm text-muted leading-relaxed">
                {t(ui.contact.tradeBody, lang)}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="border border-gold p-12 text-center">
                <span className="text-4xl mb-4 block">✓</span>
                <h3 className="font-display text-3xl font-light text-ink mb-3">
                  {t(ui.contact.thankHead, lang)}
                </h3>
                <p className="text-muted text-sm">
                  {t(ui.contact.thankBody, lang)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium tracking-widest uppercase text-muted block mb-2">
                      {t(ui.contact.fieldName, lang)}
                    </label>
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t(ui.contact.phName, lang)}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-widest uppercase text-muted block mb-2">
                      {t(ui.contact.fieldEmail, lang)}
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t(ui.contact.phEmail, lang)}
                      className="input-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-widest uppercase text-muted block mb-2">
                    {t(ui.contact.fieldCompany, lang)}
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder={t(ui.contact.phCompany, lang)}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-widest uppercase text-muted block mb-2">
                    {t(ui.contact.fieldSubject, lang)}
                  </label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="input-base"
                  >
                    <option value="">{t(ui.contact.phSubject, lang)}</option>
                    {(rtl ? subjects.ar : subjects.en).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium tracking-widest uppercase text-muted block mb-2">
                    {t(ui.contact.fieldMessage, lang)}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t(ui.contact.phMessage, lang)}
                    className="input-base resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  {t(ui.contact.sendBtn, lang)}
                </button>
                <p className="text-xs text-muted text-center">
                  {t(ui.contact.privacy, lang)}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
