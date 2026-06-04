const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabricstore.com'

export const revalidate = 3600

export default async function sitemap() {
  const staticPages = [
    { url: SITE_URL,             lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  // Dynamic product pages
  let productPages = []
  try {
    const res = await fetch(`${API}/products/?page_size=1000`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      productPages = (data.results || []).map((p) => ({
        url:             `${SITE_URL}/products/${p.slug}`,
        lastModified:    new Date(p.updated_at || p.created_at),
        changeFrequency: 'weekly',
        priority:        0.7,
      }))
    }
  } catch { /* silently skip */ }

  return [...staticPages, ...productPages]
}
