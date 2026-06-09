'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { cn, CATEGORIES } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const { lang, setLang } = useLang()
  const [open,    setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/',         label: t(ui.nav.home, lang) },
    { href: '/products', label: t(ui.nav.products, lang), hasDrop: true },
    { href: '/about',    label: t(ui.nav.about, lang) },
    { href: '/services', label: t(ui.nav.services, lang) },
    { href: '/projects', label: t(ui.nav.projects, lang) },
    { href: '/clients',  label: t(ui.nav.clients, lang) },
    { href: '/contact',  label: t(ui.nav.contact, lang) },
  ]

  const isProductsActive = pathname.startsWith('/products')

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-canvas/95 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-light tracking-wide text-gold hover:text-ink transition-colors"
        >
          ARTIA DESIGN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label, hasDrop }) =>
            hasDrop ? (
              <div key={href} className="relative group flex items-center">
                <Link
                  href={href}
                  className={cn(
                    'text-sm tracking-wide transition-colors pb-1',
                    isProductsActive ? 'text-ink border-b border-gold' : 'text-muted hover:text-ink'
                  )}
                >
                  {label}
                </Link>
                {/* Mega-dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-surface border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="p-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        href={`/products/${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-ink hover:bg-surface-2 transition-colors"
                      >
                        <span className="text-base">{cat.icon}</span>
                        {lang === 'ar' ? cat.label.ar : cat.label.en}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm tracking-wide transition-colors pb-1',
                  pathname === href
                    ? 'text-ink border-b border-gold'
                    : 'text-muted hover:text-ink'
                )}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t(ui.nav.langToggle, lang)}</span>
          </button>

          <button
            className="md:hidden p-1 text-ink"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-canvas border-b border-border',
          open ? 'max-h-screen' : 'max-h-0'
        )}
      >
        <div className="px-6 py-4 space-y-1">
          <Link href="/" className="block py-2 text-sm text-muted hover:text-ink" onClick={() => setOpen(false)}>
            {t(ui.nav.home, lang)}
          </Link>
          <Link href="/products" className="block py-2 text-sm text-muted hover:text-ink" onClick={() => setOpen(false)}>
            {t(ui.nav.products, lang)}
          </Link>
          <div className="pl-4 border-l border-border mt-1 space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/products/${cat.slug}`}
                className="block py-1.5 text-xs text-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                <span className="mr-2">{cat.icon}</span>
                {lang === 'ar' ? cat.label.ar : cat.label.en}
              </Link>
            ))}
          </div>
          {[
            { href: '/about',    label: t(ui.nav.about, lang) },
            { href: '/services', label: t(ui.nav.services, lang) },
            { href: '/projects', label: t(ui.nav.projects, lang) },
            { href: '/clients',  label: t(ui.nav.clients, lang) },
            { href: '/contact',  label: t(ui.nav.contact, lang) },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block py-2 text-sm text-muted hover:text-ink" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
