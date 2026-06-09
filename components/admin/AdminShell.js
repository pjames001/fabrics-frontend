'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, Palette, Users,
  LogOut, ChevronRight, Settings,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',              label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { href: '/admin/products',     label: 'Products',       icon: Package },
  { href: '/admin/colors',       label: 'Colors',         icon: Palette },
]

function SidebarLink({ href, label, icon: Icon, exact }) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={cn(
        'admin-sidebar-link',
        active && 'active'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
      {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-gold" />}
    </Link>
  )
}

export default function AdminShell({ children }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginRoute = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !user && !isLoginRoute) router.replace('/admin/login')
  }, [user, loading, router, isLoginRoute])

  if (isLoginRoute) return <>{children}</>

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface-2 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-canvas border-r border-border flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/admin" className="font-display text-xl text-ink">
            Fabric<span className="text-gold">·</span>Admin
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-muted/60">Management</p>
          {NAV.map((item) => <SidebarLink key={item.href} {...item} />)}
        </nav>

        {/* User info */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 bg-gold/20 rounded-full flex items-center justify-center">
              <span className="text-gold text-sm font-medium">
                {user.first_name?.[0] || user.username?.[0] || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {user.full_name || user.username}
              </p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
          </div>
          <Link href="/" target="_blank" className="admin-sidebar-link text-xs mb-1">
            View Store ↗
          </Link>
          <button
            onClick={() => { logout(); router.push('/admin/login') }}
            className="admin-sidebar-link w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-56 min-h-screen">
        {children}
      </div>
    </div>
  )
}
