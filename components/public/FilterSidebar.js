'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { cn } from '@/lib/utils'

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-ink">{title}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-muted" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function CheckboxOption({ label, checked, onChange, hexCode }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className={cn(
        'h-4 w-4 border flex items-center justify-center flex-shrink-0 transition-colors',
        checked ? 'border-ink bg-ink' : 'border-border group-hover:border-muted'
      )}>
        {checked && <span className="block h-2 w-2 bg-canvas" />}
      </span>
      {hexCode && (
        <span className="h-3.5 w-3.5 rounded-full border border-border/60 flex-shrink-0"
          style={{ backgroundColor: hexCode }} />
      )}
      <span className="text-sm text-muted group-hover:text-ink transition-colors">{label}</span>
    </label>
  )
}

export default function FilterSidebar({ filtersData, activeFilters, onFilterChange, onClearAll, category }) {
  const { lang } = useLang()
  if (!filtersData) return null

  const toggle = (key, value) => {
    const current = activeFilters[key]
    if (Array.isArray(current)) {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      onFilterChange(key, next.length ? next : undefined)
    } else {
      onFilterChange(key, current === value ? undefined : value)
    }
  }

  const isChecked = (key, value) => {
    const v = activeFilters[key]
    return Array.isArray(v) ? v.includes(value) : v === value
  }

  const hasActive = Object.values(activeFilters).some(
    (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  )

  return (
    <aside className="w-full space-y-0">
      <div className="flex items-center justify-between py-3 border-b border-border mb-1">
        <span className="section-label">{t(ui.filters.filters, lang)}</span>
        {hasActive && (
          <button onClick={onClearAll} className="flex items-center gap-1 text-xs text-gold hover:text-ink transition-colors">
            <X className="h-3 w-3" />
            {t(ui.filters.clearAll, lang)}
          </button>
        )}
      </div>

      {/* Colors */}
      {filtersData.colors?.length > 0 && (
        <FilterSection title={lang === 'ar' ? 'الألوان' : 'Colors'}>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
            {filtersData.colors.map((color) => (
              <CheckboxOption
                key={color.slug}
                label={lang === 'ar' && color.name_ar ? color.name_ar : color.name_en}
                checked={isChecked('colors', color.slug)}
                onChange={() => {
                  const cur = activeFilters.colors || []
                  const next = cur.includes(color.slug)
                    ? cur.filter((v) => v !== color.slug)
                    : [...cur, color.slug]
                  onFilterChange('colors', next.length ? next.join(',') : undefined)
                }}
                hexCode={color.hex_code}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Weave type (upholstery) */}
      {filtersData.weave_type && (
        <FilterSection title={lang === 'ar' ? 'نوع النسيج' : 'Weave Type'}>
          {filtersData.weave_type.map(({ key, label }) => (
            <CheckboxOption
              key={key}
              label={label}
              checked={isChecked('weave_type', key)}
              onChange={() => toggle('weave_type', key)}
            />
          ))}
        </FilterSection>
      )}

      {/* Pattern */}
      {filtersData.pattern && (
        <FilterSection title={lang === 'ar' ? 'النمط' : 'Pattern'} defaultOpen={false}>
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {filtersData.pattern.map(({ key, label }) => (
              <CheckboxOption
                key={key}
                label={label}
                checked={isChecked('pattern', key)}
                onChange={() => toggle('pattern', key)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Scale */}
      {filtersData.scale && (
        <FilterSection title={lang === 'ar' ? 'الحجم' : 'Scale'} defaultOpen={false}>
          {filtersData.scale.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('scale', key)} onChange={() => toggle('scale', key)} />
          ))}
        </FilterSection>
      )}

      {/* Abrasion */}
      {filtersData.abrasion && (
        <FilterSection title={lang === 'ar' ? 'مقاومة التآكل' : 'Abrasion'} defaultOpen={false}>
          {filtersData.abrasion.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('abrasion', key)} onChange={() => toggle('abrasion', key)} />
          ))}
        </FilterSection>
      )}

      {/* Traffic */}
      {filtersData.traffic && (
        <FilterSection title={lang === 'ar' ? 'حركة المرور' : 'Traffic'} defaultOpen={false}>
          {filtersData.traffic.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('traffic', key)} onChange={() => toggle('traffic', key)} />
          ))}
        </FilterSection>
      )}

      {/* Opacity */}
      {filtersData.opacity && (
        <FilterSection title={lang === 'ar' ? 'التعتيم' : 'Opacity'} defaultOpen={false}>
          {filtersData.opacity.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('opacity', key)} onChange={() => toggle('opacity', key)} />
          ))}
        </FilterSection>
      )}

      {/* Performance */}
      {filtersData.performance && (
        <FilterSection title={lang === 'ar' ? 'الأداء' : 'Performance'} defaultOpen={false}>
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {filtersData.performance.map(({ key, label }) => (
              <CheckboxOption
                key={key}
                label={label}
                checked={(activeFilters.performance || []).includes(key)}
                onChange={() => {
                  const cur = activeFilters.performance || []
                  const next = cur.includes(key) ? cur.filter((v) => v !== key) : [...cur, key]
                  onFilterChange('performance', next.length ? next : undefined)
                }}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Environmental */}
      {filtersData.environmental && (
        <FilterSection title={lang === 'ar' ? 'البيئة' : 'Environmental'} defaultOpen={false}>
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {filtersData.environmental.map(({ key, label }) => (
              <CheckboxOption
                key={key}
                label={label}
                checked={(activeFilters.environmental || []).includes(key)}
                onChange={() => {
                  const cur = activeFilters.environmental || []
                  const next = cur.includes(key) ? cur.filter((v) => v !== key) : [...cur, key]
                  onFilterChange('environmental', next.length ? next : undefined)
                }}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Cleaners */}
      {filtersData.cleaners && (
        <FilterSection title={lang === 'ar' ? 'المنظفات' : 'Cleaners'} defaultOpen={false}>
          {filtersData.cleaners.map(({ key, label }) => (
            <CheckboxOption key={key} label={label}
              checked={(activeFilters.cleaners || []).includes(key)}
              onChange={() => {
                const cur = activeFilters.cleaners || []
                const next = cur.includes(key) ? cur.filter((v) => v !== key) : [...cur, key]
                onFilterChange('cleaners', next.length ? next : undefined)
              }}
            />
          ))}
        </FilterSection>
      )}

      {/* Production Region */}
      {filtersData.production_region && (
        <FilterSection title={lang === 'ar' ? 'منطقة الإنتاج' : 'Production Region'} defaultOpen={false}>
          {filtersData.production_region.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('production_region', key)} onChange={() => toggle('production_region', key)} />
          ))}
        </FilterSection>
      )}

      {/* Subcategories */}
      {filtersData.wallcovering_subcategory && (
        <FilterSection title={lang === 'ar' ? 'النوع' : 'Type'} defaultOpen={false}>
          {filtersData.wallcovering_subcategory.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('wallcovering_subcategory', key)} onChange={() => toggle('wallcovering_subcategory', key)} />
          ))}
        </FilterSection>
      )}
      {filtersData.panel_subcategory && (
        <FilterSection title={lang === 'ar' ? 'النوع' : 'Type'} defaultOpen={false}>
          {filtersData.panel_subcategory.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('panel_subcategory', key)} onChange={() => toggle('panel_subcategory', key)} />
          ))}
        </FilterSection>
      )}
      {filtersData.rugs_subcategory && (
        <FilterSection title={lang === 'ar' ? 'النوع' : 'Type'} defaultOpen={false}>
          {filtersData.rugs_subcategory.map(({ key, label }) => (
            <CheckboxOption key={key} label={label} checked={isChecked('rugs_subcategory', key)} onChange={() => toggle('rugs_subcategory', key)} />
          ))}
        </FilterSection>
      )}

      {/* Collaborators */}
      {filtersData.collaborators?.length > 0 && (
        <FilterSection title={lang === 'ar' ? 'المتعاونون' : 'Collaborators'} defaultOpen={false}>
          {filtersData.collaborators.map((c) => (
            <CheckboxOption
              key={c.slug}
              label={c.name}
              checked={isChecked('collaborators', c.slug)}
              onChange={() => toggle('collaborators', c.slug)}
            />
          ))}
        </FilterSection>
      )}
    </aside>
  )
}
