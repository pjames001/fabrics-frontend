/**
 * SEO helpers — generates Next.js Metadata objects.
 * Used in every page's generateMetadata() or static metadata export.
 */

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Fabric Store'
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  || 'https://fabricstore.com'

export const defaultMeta = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  `${SITE_NAME} — Premium Textiles & Surfaces`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Curated upholstery, leather, wallcovering, panel, privacy curtain, window covering and rugs — sourced from the world\'s finest ateliers.',
  keywords: [
    'upholstery fabric', 'leather fabric', 'wallcovering', 'wall fabric',
    'acoustic panel', 'privacy curtain', 'window covering', 'rugs', 'textiles',
    'interior fabric', 'contract fabric', 'designer fabric',
  ],
  openGraph: {
    type:      'website',
    siteName:  SITE_NAME,
    locale:    'en_US',
    alternateLocale: ['ar_SA'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': `${SITE_URL}`,
      'ar': `${SITE_URL}`,
    },
  },
}

export function buildProductMeta(product) {
  const name        = product.name_en
  const description = product.description_en || `${name} — ${product.category} fabric`
  const image       = product.images?.[0]?.image_url

  return {
    title:       name,
    description: description.slice(0, 160),
    keywords:    [
      name, product.category, product.pattern,
      product.production_region, 'fabric', 'textile',
    ].filter(Boolean),
    openGraph: {
      title:       `${name} | ${SITE_NAME}`,
      description: description.slice(0, 160),
      images:      image ? [{ url: image, alt: name }] : [],
      type:        'website',
    },
    alternates: {
      canonical:  `${SITE_URL}/products/${product.slug}`,
      languages:  {
        'en': `${SITE_URL}/products/${product.slug}`,
        'ar': `${SITE_URL}/products/${product.slug}`,
      },
    },
  }
}

export function buildCategoryMeta(category) {
  const labels = {
    upholstery:      'Upholstery Fabrics',
    leather:         'Leather Fabrics',
    wallcovering:    'Wall Covering',
    panel:           'Panel Fabrics',
    privacy_curtain: 'Privacy Curtains',
    window_covering: 'Window Covering',
    rugs:            'Rugs & Carpets',
  }
  const label = labels[category] || 'Products'
  return {
    title:       label,
    description: `Browse our premium ${label.toLowerCase()} collection — contract-grade, sustainably sourced, globally inspired.`,
    openGraph: {
      title: `${label} | ${SITE_NAME}`,
    },
    alternates: {
      canonical: `${SITE_URL}/products?category=${category}`,
    },
  }
}
