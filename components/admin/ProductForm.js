'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Upload, X, Star, Trash2,
  AlertCircle, Check, ChevronDown,
} from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { parseError, CATEGORIES, imageUrl, cn } from '@/lib/utils'

const unwrapList = (res) => Array.isArray(res?.data) ? res.data : res?.data?.results ?? res?.data

// ── Choice constants ────────────────────────────────────────────
const PATTERNS      = ['solid','stripe','geometric','floral','abstract','animal','check','damask','herringbone','jacquard','paisley','texture','plain']
const SCALES        = ['small','medium','large','extra_large']
const ABRASIONS     = ['lt_10000','10000_30000','30000_50000','50000_100000','gt_100000']
const TRAFFICS      = ['light','medium','heavy','extra_heavy']
const OPACITIES     = ['sheer','semi_sheer','semi_opaque','opaque','blackout']
const REGIONS       = ['usa','canada','mexico','uk','europe','italy','belgium','china','india','turkey','other']
const WEAVE_TYPES   = ['woven','nonwoven']
const PERFORMANCE   = ['antimicrobial','bleach_cleanable','fire_retardant','moisture_barrier','mold_mildew_resistant','stain_resistant','uv_resistant','water_repellent']
const CLEANERS      = ['water_based','solvent_based','dry_clean','mild_soap','bleach_solution','enzyme_cleaner']
const ENVIRONMENTAL = ['recycled_content','low_voc','greenguard','greenguard_gold','leed','cradle_to_cradle','oeko_tex','sustainable_source']
const WC_SUBS       = ['type_1','type_2','type_3','natural','coated','textile','digital_print']
const PANEL_SUBS    = ['acoustic','decorative','tackable','structural']
const RUGS_SUBS     = ['flat_weave','pile','hand_knotted','hand_tufted','machine_made','outdoor']

// ── Small helpers ────────────────────────────────────────────────
const humanize = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  )
}

function SelectField({ label, required, value, onChange, options, placeholder = 'Select…' }) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none input-base pr-8 text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
              {typeof o === 'string' ? humanize(o) : o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
      </div>
    </Field>
  )
}

function CheckboxGroup({ label, options, value = [], onChange }) {
  const toggle = (key) => {
    const next = value.includes(key) ? value.filter((v) => v !== key) : [...value, key]
    onChange(next)
  }
  return (
    <Field label={label}>
      <div className="grid grid-cols-2 gap-1">
        {options.map((o) => (
          <label key={o} onClick={() => toggle(o)} className="flex items-center gap-2 py-1 cursor-pointer group">
            <span className={cn(
              'h-4 w-4 border flex items-center justify-center flex-shrink-0 transition-colors',
              value.includes(o) ? 'border-ink bg-ink' : 'border-border group-hover:border-muted'
            )}>
              {value.includes(o) && <Check className="h-2.5 w-2.5 text-canvas" />}
            </span>
            <span className="text-xs text-muted group-hover:text-ink transition-colors">{humanize(o)}</span>
          </label>
        ))}
      </div>
    </Field>
  )
}

// ── Image Manager ────────────────────────────────────────────────
function ImageManager({ slug, images = [], onImagesChange }) {
  const qc      = useQueryClient()
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')

  const uploadMutation = useMutation({
    mutationFn: (formData) => adminApi.uploadImage(slug, formData),
    onSuccess: (res) => {
      onImagesChange(res.data)
      setError('')
    },
    onError: (err) => setError(parseError(err)),
    onSettled: () => setUploading(false),
  })

  const deleteMutation = useMutation({
    mutationFn: (pk) => adminApi.deleteImage(pk),
    onSuccess: (_, pk) => onImagesChange(images.filter((i) => i.id !== pk)),
    onError: (err) => setError(parseError(err)),
  })

  const primaryMutation = useMutation({
    mutationFn: (pk) => adminApi.setPrimary(pk),
    onSuccess: (res) => {
      onImagesChange(images.map((i) => ({ ...i, is_primary: i.id === res.data.id })))
    },
    onError: (err) => setError(parseError(err)),
  })

  const handleFiles = useCallback(async (files) => {
    if (!slug) { setError('Save the product first before uploading images.'); return }
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('is_primary', images.length === 0 ? 'true' : 'false')
      await uploadMutation.mutateAsync(fd).catch(() => {})
    }
  }, [slug, images.length])

  return (
    <div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs mb-3">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-border hover:border-gold transition-colors p-6 text-center cursor-pointer mb-4"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      >
        <Upload className="h-6 w-6 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">
          {uploading ? 'Uploading…' : 'Click or drag & drop images here'}
        </p>
        <p className="text-xs text-muted/60 mt-1">JPG, PNG, WebP — multiple allowed</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={cn(
                'relative group aspect-square border-2 overflow-hidden transition-all',
                img.is_primary ? 'border-gold' : 'border-transparent hover:border-border'
              )}
            >
              <Image
                src={imageUrl(img)}
                alt={img.alt_text_en || 'Product image'}
                fill
                sizes="128px"
                className="object-cover"
              />

              {/* Primary badge */}
              {img.is_primary && (
                <span className="absolute top-1 left-1 bg-gold text-white text-[9px] px-1.5 py-0.5 font-medium">
                  Main
                </span>
              )}

              {/* Hover controls */}
              <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_primary && (
                  <button
                    onClick={() => primaryMutation.mutate(img.id)}
                    className="h-7 w-7 bg-gold text-white flex items-center justify-center hover:bg-gold-light transition-colors"
                    title="Set as primary"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(img.id)}
                  className="h-7 w-7 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Product Form ─────────────────────────────────────────────────
const EMPTY = {
  sku: '', name_en: '', name_ar: '', description_en: '', description_ar: '',
  content_en: '', content_ar: '', category: '', is_active: true, is_featured: false,
  colors: [], collaborators: [],
  pattern: '', scale: '', abrasion: '', traffic: '', opacity: '',
  production_region: '', weave_type: '',
  wallcovering_subcategory: '', panel_subcategory: '', rugs_subcategory: '',
  performance: [], cleaners: [], environmental: [],
}

export default function ProductForm({ mode, initialData }) {
  const router = useRouter()
  const qc     = useQueryClient()

  const [form,   setForm]   = useState(() => initialData ? { ...EMPTY, ...initialData } : EMPTY)
  const [images, setImages] = useState(initialData?.images || [])
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)

  // Colors & collaborators for multi-select
  const { data: colorsData }  = useQuery({ queryKey: ['colors'],        queryFn: () => productsApi.colors(),        select: unwrapList })
  const { data: collabsData } = useQuery({ queryKey: ['collaborators'], queryFn: () => productsApi.collaborators(), select: unwrapList })

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const mutation = useMutation({
    mutationFn: (data) =>
      mode === 'create'
        ? adminApi.createProduct(data)
        : adminApi.updateProduct(initialData.slug, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] })
      qc.invalidateQueries({ queryKey: ['product-detail', res.data.slug] })
      router.push('/admin/products')
    },
    onError: (err) => setError(parseError(err)),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      colors:        (form.colors || []).map((c) => (typeof c === 'object' ? c.id : c)),
      collaborators: (form.collaborators || []).map((c) => (typeof c === 'object' ? c.id : c)),
    }
    mutation.mutate(payload)
  }

  const cat = form.category

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="section-label mb-1">{mode === 'create' ? 'New Product' : 'Edit Product'}</p>
          <h1 className="font-display text-3xl font-light text-ink">
            {mode === 'create' ? 'Create Product' : (initialData?.name_en || 'Edit Product')}
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 text-sm">
          <Check className="h-4 w-4" />
          Product saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ── Section: Identity ──────────────────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="SKU" required>
              <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-base text-sm" placeholder="UPH-001" required />
            </Field>
            <SelectField
              label="Category" required
              value={form.category}
              onChange={(v) => set('category', v)}
              options={CATEGORIES.map((c) => ({ value: c.value, label: c.label.en }))}
            />
            <div className="md:col-span-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="sr-only" />
                <span className={cn('h-5 w-5 border flex items-center justify-center transition-colors', form.is_active ? 'border-ink bg-ink' : 'border-border')}>
                  {form.is_active && <Check className="h-3 w-3 text-canvas" />}
                </span>
                <span className="text-sm text-muted">Active (visible on store)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="sr-only" />
                <span className={cn('h-5 w-5 border flex items-center justify-center transition-colors', form.is_featured ? 'border-gold bg-gold' : 'border-border')}>
                  {form.is_featured && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="text-sm text-muted">Featured (shown on homepage)</span>
              </label>
            </div>
          </div>
        </section>

        {/* ── Section: Names & Descriptions ───────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Names & Descriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name (English)" required>
              <input value={form.name_en} onChange={(e) => set('name_en', e.target.value)} className="input-base text-sm" placeholder="Classic Linen Blend" required />
            </Field>
            <Field label="Name (Arabic)">
              <input value={form.name_ar} onChange={(e) => set('name_ar', e.target.value)} className="input-base text-sm text-right" dir="rtl" placeholder="خلطة الكتان الكلاسيكية" />
            </Field>
            <Field label="Description (English)">
              <textarea rows={3} value={form.description_en} onChange={(e) => set('description_en', e.target.value)} className="input-base text-sm resize-none" placeholder="A timeless fabric…" />
            </Field>
            <Field label="Description (Arabic)">
              <textarea rows={3} value={form.description_ar} onChange={(e) => set('description_ar', e.target.value)} className="input-base text-sm resize-none text-right" dir="rtl" placeholder="قماش خالد…" />
            </Field>
            <Field label="Content (English)" hint="e.g. 55% Linen, 45% Cotton">
              <input value={form.content_en} onChange={(e) => set('content_en', e.target.value)} className="input-base text-sm" placeholder="100% Wool" />
            </Field>
            <Field label="Content (Arabic)">
              <input value={form.content_ar} onChange={(e) => set('content_ar', e.target.value)} className="input-base text-sm text-right" dir="rtl" placeholder="100% صوف" />
            </Field>
          </div>
        </section>

        {/* ── Section: Filters ────────────────────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Filters & Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <SelectField label="Pattern" value={form.pattern} onChange={(v) => set('pattern', v)} options={PATTERNS} />
            <SelectField label="Production Region" value={form.production_region} onChange={(v) => set('production_region', v)} options={REGIONS} />
            <SelectField label="Scale" value={form.scale} onChange={(v) => set('scale', v)} options={SCALES} />

            {/* Category-specific */}
            {(cat === 'upholstery') && (
              <>
                <SelectField label="Weave Type *" value={form.weave_type} onChange={(v) => set('weave_type', v)} options={WEAVE_TYPES} />
                <SelectField label="Abrasion" value={form.abrasion} onChange={(v) => set('abrasion', v)} options={ABRASIONS} />
              </>
            )}
            {(cat === 'panel' || cat === 'rugs') && (
              <SelectField label="Abrasion" value={form.abrasion} onChange={(v) => set('abrasion', v)} options={ABRASIONS} />
            )}
            {(cat === 'wallcovering' || cat === 'rugs') && (
              <SelectField label="Traffic" value={form.traffic} onChange={(v) => set('traffic', v)} options={TRAFFICS} />
            )}
            {cat === 'window_covering' && (
              <SelectField label="Opacity *" value={form.opacity} onChange={(v) => set('opacity', v)} options={OPACITIES} />
            )}
            {cat === 'wallcovering' && (
              <SelectField label="Subcategory" value={form.wallcovering_subcategory} onChange={(v) => set('wallcovering_subcategory', v)} options={WC_SUBS} />
            )}
            {cat === 'panel' && (
              <SelectField label="Subcategory" value={form.panel_subcategory} onChange={(v) => set('panel_subcategory', v)} options={PANEL_SUBS} />
            )}
            {cat === 'rugs' && (
              <SelectField label="Subcategory" value={form.rugs_subcategory} onChange={(v) => set('rugs_subcategory', v)} options={RUGS_SUBS} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 pt-5 border-t border-border">
            <CheckboxGroup label="Performance" options={PERFORMANCE} value={form.performance} onChange={(v) => set('performance', v)} />
            <CheckboxGroup label="Cleaners" options={CLEANERS} value={form.cleaners} onChange={(v) => set('cleaners', v)} />
            <CheckboxGroup label="Environmental" options={ENVIRONMENTAL} value={form.environmental} onChange={(v) => set('environmental', v)} />
          </div>
        </section>

        {/* ── Section: Colors & Collaborators ──────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Colors & Collaborators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <Field label="Colors">
              <div className="border border-border p-3 max-h-48 overflow-y-auto space-y-1">
                {colorsData?.map((color) => {
                  const selected = (form.colors || []).some((c) => (typeof c === 'object' ? c.id : c) === color.id)
                  return (
                    <label key={color.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <span className={cn('h-4 w-4 border flex items-center justify-center transition-colors', selected ? 'border-ink bg-ink' : 'border-border')}>
                        {selected && <Check className="h-2.5 w-2.5 text-canvas" />}
                      </span>
                      <span className="h-4 w-4 rounded-full border border-border/60" style={{ backgroundColor: color.hex_code || '#ccc' }} />
                      <span className="text-sm text-muted group-hover:text-ink transition-colors">{color.name_en}</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => {
                          const cur = (form.colors || []).map((c) => (typeof c === 'object' ? c.id : c))
                          set('colors', selected ? cur.filter((id) => id !== color.id) : [...cur, color.id])
                        }}
                      />
                    </label>
                  )
                })}
              </div>
            </Field>

            {/* Collaborators */}
            <Field label="Collaborators">
              <div className="border border-border p-3 max-h-48 overflow-y-auto space-y-1">
                {collabsData?.map((c) => {
                  const selected = (form.collaborators || []).some((co) => (typeof co === 'object' ? co.id : co) === c.id)
                  return (
                    <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <span className={cn('h-4 w-4 border flex items-center justify-center transition-colors', selected ? 'border-ink bg-ink' : 'border-border')}>
                        {selected && <Check className="h-2.5 w-2.5 text-canvas" />}
                      </span>
                      <span className="text-sm text-muted group-hover:text-ink transition-colors">{c.name}</span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => {
                          const cur = (form.collaborators || []).map((co) => (typeof co === 'object' ? co.id : co))
                          set('collaborators', selected ? cur.filter((id) => id !== c.id) : [...cur, c.id])
                        }}
                      />
                    </label>
                  )
                })}
              </div>
            </Field>
          </div>
        </section>

        {/* ── Section: Images ──────────────────────── */}
        {mode === 'edit' && (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Images</h2>
            <ImageManager slug={initialData?.slug} images={images} onImagesChange={setImages} />
          </section>
        )}
        {mode === 'create' && (
          <div className="text-xs text-muted bg-surface-2 border border-border px-4 py-3">
            💡 Save the product first, then you can upload images from the edit page.
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <span className="h-4 w-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {mutation.isPending ? 'Saving…' : (mode === 'create' ? 'Create Product' : 'Save Changes')}
          </button>
          <Link href="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
