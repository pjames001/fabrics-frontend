'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { parseError } from '@/lib/utils'

export default function AdminLoginClient() {
  const { login, user, loading } = useAuth()
  const router = useRouter()

  const [form,     setForm]     = useState({ username: '', password: '' })
  const [show,     setShow]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,    setError]    = useState('')

  // Already logged in → redirect
  useEffect(() => {
    if (!loading && user) router.replace('/admin')
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.username.trim(), form.password)
      router.push('/admin')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,#F8F5F0 0,transparent 1px,transparent 79px,#F8F5F0 80px),repeating-linear-gradient(90deg,#F8F5F0 0,transparent 1px,transparent 79px,#F8F5F0 80px)',
          }}
        />
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-gold to-transparent" />

        <div className="relative">
          <p className="font-display text-3xl text-canvas font-light">
            Fabric<span className="text-gold">·</span>Store
          </p>
        </div>

        <div className="relative space-y-4">
          <p className="section-label text-gold">Admin Portal</p>
          <h1 className="font-display text-5xl font-light text-canvas leading-tight">
            Manage Your<br />Collection
          </h1>
          <p className="text-canvas/50 text-sm leading-relaxed max-w-xs">
            Add, edit, and organise your full product catalog — upholstery, leather, wallcovering, panels, and more.
          </p>
        </div>

        <p className="relative text-canvas/30 text-xs">
          © {new Date().getFullYear()} Fabric Store
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <p className="lg:hidden font-display text-2xl text-ink mb-10">
            Fabric<span className="text-gold">·</span>Store
          </p>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-light text-ink mb-2">Sign In</h2>
            <p className="text-muted text-sm">Enter your admin credentials to continue.</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className="input-base"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="input-base pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
