import Link from 'next/link'
import { useLang, t } from '@/contexts/LangContext'
import { CATEGORIES } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas/70 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-display text-2xl text-canvas font-light mb-4">
            Fabric<span className="text-gold">·</span>Store
          </p>
          <p className="text-sm leading-relaxed">
            Premium textiles and surfaces for discerning designers and specifiers worldwide.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">Collections</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.value}>
                <Link
                  href={`/products?category=${cat.value}`}
                  className="text-sm hover:text-canvas transition-colors"
                >
                  {cat.label.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-canvas transition-colors">All Products</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">Admin</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/admin/login" className="hover:text-canvas transition-colors">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-canvas/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-canvas/40">
          <p>© {new Date().getFullYear()} Fabric Store. All rights reserved.</p>
          <p>Crafted with care.</p>
        </div>
      </div>
    </footer>
  )
}
