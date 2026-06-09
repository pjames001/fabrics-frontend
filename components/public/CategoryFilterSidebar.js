'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useLang, t, ui } from '@/contexts/LangContext'
import { CHOICE_LABELS, cn } from '@/lib/utils'

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
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
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

function ChoiceSection({ title, filterKey, options = [], activeFilters, onFilterChange, defaultOpen = false }) {
  if (!options?.length) return null
  const current = activeFilters[filterKey]
  const toggle = (key) => onFilterChange(filterKey, current === key ? undefined : key)
  return (
    <FilterSection title={title} defaultOpen={defaultOpen}>
      {options.map(({ key, label }) => (
        <CheckboxOption key={key} label={label} checked={current === key} onChange={() => toggle(key)} />
      ))}
    </FilterSection>
  )
}

export default function CategoryFilterSidebar({
  category, activeSubcategory, filtersData, activeFilters, onFilterChange, onClearAll,
}) {
  const { lang } = useLang()

  if (!filtersData) return null

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

      {/* Colors (all categories) */}
      {filtersData.colors?.length > 0 && (
        <FilterSection title={t(ui.specs.colors, lang)}>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
            {filtersData.colors.map((color) => (
              <CheckboxOption
                key={color.slug}
                label={lang === 'ar' && color.name_ar ? color.name_ar : color.name_en}
                checked={activeFilters.colors === color.slug}
                onChange={() => onFilterChange('colors', activeFilters.colors === color.slug ? undefined : color.slug)}
                hexCode={color.hex_code}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Wall covering filters */}
      {category === 'wall_covering' && (
        <>
          <ChoiceSection title={t(ui.specs.background,    lang)} filterKey="background"             options={filtersData.background}             activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          <ChoiceSection title={t(ui.specs.match,         lang)} filterKey="match"                  options={filtersData.match}                  activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <ChoiceSection title={t(ui.specs.removeType,    lang)} filterKey="remove_type"            options={filtersData.remove_type}            activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <ChoiceSection title={t(ui.specs.orderType,     lang)} filterKey="order_type"             options={filtersData.order_type}             activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <ChoiceSection title={t(ui.specs.maintenance,   lang)} filterKey="maintenance"            options={filtersData.maintenance}            activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <ChoiceSection title={t(ui.specs.lightFastness, lang)} filterKey="light_fastness"         options={filtersData.light_fastness}         activeFilters={activeFilters} onFilterChange={onFilterChange} />
          {filtersData.wall_covering_material?.length > 0 && (
            <ChoiceSection title={t(ui.specs.material, lang)} filterKey="wall_covering_material" options={filtersData.wall_covering_material} activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          )}
        </>
      )}

      {/* Upholstery filters */}
      {category === 'upholstery' && (
        <>
          <ChoiceSection title={t(ui.specs.usage,         lang)} filterKey="upholstery_usage"    options={filtersData.upholstery_usage}    activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          <ChoiceSection title={t(ui.specs.material,      lang)} filterKey="upholstery_material" options={filtersData.upholstery_material} activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          <ChoiceSection title={t(ui.specs.lightFastness, lang)} filterKey="light_fastness"      options={filtersData.light_fastness}      activeFilters={activeFilters} onFilterChange={onFilterChange} />
        </>
      )}

      {/* Curtains filters */}
      {category === 'curtains' && (
        <>
          <ChoiceSection title={t(ui.specs.material,      lang)} filterKey="curtain_material" options={filtersData.curtain_material} activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          <ChoiceSection title={t(ui.specs.usage,         lang)} filterKey="curtain_usage"    options={filtersData.curtain_usage}    activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen />
          <ChoiceSection title={t(ui.specs.lightFastness, lang)} filterKey="light_fastness"   options={filtersData.light_fastness}   activeFilters={activeFilters} onFilterChange={onFilterChange} />
          {filtersData.width?.length > 0 && (
            <FilterSection title={t(ui.specs.width, lang)} defaultOpen={false}>
              {filtersData.width.map((w) => (
                <CheckboxOption key={w} label={w} checked={activeFilters.width === w}
                  onChange={() => onFilterChange('width', activeFilters.width === w ? undefined : w)} />
              ))}
            </FilterSection>
          )}
        </>
      )}
    </aside>
  )
}
