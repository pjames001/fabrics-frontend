/**
 * API client — centralises all HTTP calls to the Django backend.
 * - Automatically attaches Bearer token for admin requests.
 * - Silently refreshes expired access tokens.
 * - Sends Accept-Language header from the active locale.
 */
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Token helpers (browser-only)
const getTokens = () => {
  if (typeof window === 'undefined') return {}
  try {
    return {
      access:  localStorage.getItem('fs_access'),
      refresh: localStorage.getItem('fs_refresh'),
    }
  } catch { return {} }
}

const setTokens = (access, refresh) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('fs_access',  access)
  if (refresh) localStorage.setItem('fs_refresh', refresh)
}

const clearTokens = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('fs_access')
  localStorage.removeItem('fs_refresh')
}

export { getTokens, setTokens, clearTokens }

// ── Axios instance ────────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL })

// Request interceptor — attach token + language
api.interceptors.request.use((config) => {
  const { access } = getTokens()
  if (access) config.headers.Authorization = `Bearer ${access}`
  // Language header
  const lang = typeof window !== 'undefined'
    ? (localStorage.getItem('fs_lang') || 'en')
    : 'en'
  config.headers['Accept-Language'] = lang
  return config
})

// Response interceptor — silent token refresh
let refreshing = false
let queue = []

const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  )
  queue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
      original._retry = true
      refreshing = true
      const { refresh } = getTokens()
      if (!refresh) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/admin/login'
        return Promise.reject(err)
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
        setTokens(data.access, data.refresh)
        processQueue(null, data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr)
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/admin/login'
        return Promise.reject(refreshErr)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  login:          (credentials) => api.post('/auth/token/', credentials),
  refresh:        (refresh)     => api.post('/auth/token/refresh/', { refresh }),
  logout:         (refresh)     => api.post('/auth/logout/', { refresh }),
  me:             ()            => api.get('/auth/me/'),
  updateProfile:  (data)        => api.patch('/auth/me/', data),
  changePassword: (data)        => api.post('/auth/change-password/', data),
}

// ── Public products ───────────────────────────────────────────────
export const productsApi = {
  list:        (params)  => api.get('/products/', { params }),
  detail:      (slug)    => api.get(`/products/${slug}/`),
  filtersMeta: (params)  => api.get('/products/filters-meta/', { params }),
  colors: () => api.get('/colors/'),
}

// ── Admin products ────────────────────────────────────────────────
export const adminApi = {
  dashboard:       ()             => api.get('/admin/dashboard/'),
  productList:     (params)       => api.get('/admin/products/', { params }),
  createProduct:   (data)         => api.post('/products/', data),
  updateProduct:   (slug, data)   => api.patch(`/products/${slug}/`, data),
  deleteProduct:   (slug)         => api.delete(`/products/${slug}/`),
  bulkAction:      (data)         => api.post('/admin/products/bulk-action/', data),

  uploadImage:     (slug, form)   =>
    api.post(`/products/${slug}/images/`, form),
  deleteImage:     (pk)           => api.delete(`/products/images/${pk}/`),
  setPrimary:      (pk)           => api.patch(`/products/images/${pk}/set-primary/`),
  reorderImages:   (slug, order)  => api.patch(`/products/${slug}/images/reorder/`, { order }),

  createColor:  (data)       => api.post('/colors/', data),
  updateColor:  (pk, data)   => api.patch(`/colors/${pk}/`, data),
  deleteColor:  (pk)         => api.delete(`/colors/${pk}/`),
}

export default api
