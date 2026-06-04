'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, getTokens, setTokens, clearTokens } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const { access } = getTokens()
    if (!access) { setLoading(false); return }
    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login({ username, password })
    setTokens(data.access, data.refresh)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    const { refresh } = getTokens()
    try { await authApi.logout(refresh) } catch { /* already invalid */ }
    clearTokens()
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
