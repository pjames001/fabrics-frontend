'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Palette, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, imageUrl, getCategoryLabel } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

function StatCard({ label, value, sub, icon: Icon, color = 'gold', loading }) {
  return (
    <div className="bg-canvas border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted">{label}</p>
        <div className={`h-9 w-9 flex items-center justify-center ${color === 'gold' ? 'bg-gold/10' : 'bg-ink/5'}`}>
          <Icon className={`h-4 w-4 ${color === 'gold' ? 'text-gold' : 'text-muted'}`} />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <p className="font-display text-4xl font-light text-ink mb-1">{value}</p>
      )}
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
    select: (d) => d.data,
    refetchInterval: 60_000,
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Overview</p>
        <h1 className="font-display text-4xl font-light text-ink">
          {greeting()}, {user?.first_name || user?.username || 'Admin'} 👋
        </h1>
        <p className="text-muted text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Products"
          value={stats?.products.total ?? '—'}
          sub={`${stats?.products.active ?? 0} active · ${stats?.products.inactive ?? 0} inactive`}
          icon={Package}
          loading={isLoading}
        />
        <StatCard
          label="Featured"
          value={stats?.products.featured ?? '—'}
          sub="Featured products"
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Colors"
          value={stats?.colors_total ?? '—'}
          sub="In palette"
          icon={Palette}
          color="ink"
          loading={isLoading}
        />
        <StatCard
          label="Collaborators"
          value={stats?.collaborators_total ?? '—'}
          sub="Design partners"
          icon={Users}
          color="ink"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="lg:col-span-1 bg-canvas border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium tracking-wide">By Category</h2>
            <Link href="/admin/products" className="text-xs text-gold hover:text-ink transition-colors">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {stats?.by_category.map((cat) => {
                const pct = stats.products.total ? Math.round((cat.total / stats.products.total) * 100) : 0
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted capitalize">{getCategoryLabel(cat.category)}</span>
                      <span className="text-ink font-medium">{cat.total}</span>
                    </div>
                    <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent products */}
        <div className="lg:col-span-2 bg-canvas border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium tracking-wide">Recently Added</h2>
            <Link href="/admin/products/new" className="flex items-center gap-1 text-xs text-gold hover:text-ink transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Product
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {stats?.recently_added.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center gap-4 p-2 hover:bg-surface-2 transition-colors group rounded-sm"
                >
                  {/* Thumbnail */}
                  <div className="h-10 w-10 bg-surface-2 flex-shrink-0 overflow-hidden">
                    {product.primary_image ? (
                      <Image
                        src={imageUrl(product.primary_image)}
                        alt={product.name_en}
                        width={40} height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted">▦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium truncate group-hover:text-gold transition-colors">
                      {product.name_en}
                    </p>
                    <p className="text-xs text-muted">{product.sku} · {getCategoryLabel(product.category)}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider ${product.is_active ? 'bg-green-50 text-green-700' : 'bg-surface-2 text-muted'}`}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                    <span className="text-xs text-muted hidden sm:block">{formatDate(product.created_at)}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/products/new',  label: 'Add Product',     icon: Package },
          { href: '/admin/products',       label: 'Manage Products', icon: Package },
          { href: '/admin/colors',         label: 'Manage Colors',   icon: Palette },
          { href: '/admin/collaborators',  label: 'Collaborators',   icon: Users },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 p-4 bg-canvas border border-border hover:border-gold hover:bg-surface-2 transition-all group"
          >
            <a.icon className="h-4 w-4 text-muted group-hover:text-gold transition-colors" />
            <span className="text-sm text-muted group-hover:text-ink transition-colors">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
