'use client'
import Link from 'next/link'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CATEGORIES } from '@/lib/utils'

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="bg-ink text-canvas/70" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-display text-2xl text-canvas font-light mb-4">ARTIA DESIGN</p>
          <p className="text-sm leading-relaxed">{t(ui.footer.description, lang)}</p>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">
            {t(ui.footer.collections, lang)}
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.value}>
                <Link href={`/products/${cat.slug}`} className="text-sm hover:text-canvas transition-colors">
                  {lang === 'ar' ? cat.label.ar : cat.label.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">
            {t(ui.footer.company, lang)}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about"    className="hover:text-canvas transition-colors">{t(ui.footer.aboutUs,   lang)}</Link></li>
            <li><Link href="/services" className="hover:text-canvas transition-colors">{t(ui.footer.services,  lang)}</Link></li>
            <li><Link href="/projects" className="hover:text-canvas transition-colors">{t(ui.footer.projects,  lang)}</Link></li>
            <li><Link href="/clients"  className="hover:text-canvas transition-colors">{t(ui.footer.clients,   lang)}</Link></li>
            <li><Link href="/contact"  className="hover:text-canvas transition-colors">{t(ui.footer.contact,   lang)}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-canvas/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-canvas/40">
          <p>© {new Date().getFullYear()} ARTIA DESIGN. {t(ui.footer.rights, lang)}</p>
          <p>{t(ui.footer.crafted, lang)}</p>
        </div>
      </div>
    </footer>
  )
}
