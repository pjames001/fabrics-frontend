'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang, ui, t } from '@/contexts/LangContext'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { lang } = useLang()
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left  = currentPage - delta
  const right = currentPage + delta + 1

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i)
    }
  }

  // Insert ellipsis markers
  const withEllipsis = []
  let prev = null
  for (const p of pages) {
    if (prev && p - prev > 1) withEllipsis.push('…')
    withEllipsis.push(p)
    prev = p
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          'p-2 border border-border transition-colors',
          currentPage === 1
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-ink hover:bg-ink hover:text-canvas'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {withEllipsis.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-muted select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'min-w-[2.25rem] h-9 text-sm border transition-colors',
              p === currentPage
                ? 'bg-ink text-canvas border-ink font-medium'
                : 'border-border hover:border-ink'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(
          'p-2 border border-border transition-colors',
          currentPage === totalPages
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:border-ink hover:bg-ink hover:text-canvas'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
