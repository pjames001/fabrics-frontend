'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import {
  ArrowLeft, Upload, X, Star, Trash2,
  AlertCircle, Check, ChevronDown,
} from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { parseError, CATEGORIES, imageUrl, cn } from '@/lib/utils'

const unwrapList = (res) => Array.isArray(res?.data) ? res.data : res?.data?.results ?? res?.data

// ── Choice constants ────────────────────────────────────────────────
const WC_SUBS       = ['natural','vinyl','prints','fabric','murals','acoustic']
const UPH_SUBS      = ['indoor','outdoor']
const CUR_SUBS      = ['sheer','blackout','dim_out','sunscreen','vintage']
const BACKGROUNDS   = ['paper','fabric']
const MATCHES       = ['random','straight','repeat']
const REMOVE_TYPES  = ['wet','dry']
const ORDER_TYPES   = ['wet','dry']
const MAINTENANCES  = ['wipe_gently','soft_vac']
const LIGHT_FASTNESS = ['hard','medium','normal']
const WC_MATERIALS_NATURAL = ['wood','veneer','seashell','metal','raffias','grasscloth']
const WC_MATERIALS_FABRIC  = ['silk','satean','line','fur']
const WC_MATERIALS_ALL     = [...WC_MATERIALS_NATURAL, ...WC_MATERIALS_FABRIC]
const UPH_USAGES    = ['curtain','light_upholstery','heavy_upholstery','wall_covering','drapery','blinds','cushions']
const UPH_MATERIALS = ['leather','velvet','linen','satean','silk']
const CUR_USAGES    = ['curtains','light_upholstery','blinds','cushions']
const CUR_MATERIALS = ['leather','velvet','linen','satean','silk']

const humanize = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

// ── Form field helpers ───────────────────────────────────────────────
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

function TextField({ label, required, value, onChange, placeholder, hint }) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-base text-sm"
        placeholder={placeholder}
        required={required}
      />
    </Field>
  )
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <Field label={label}>
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-base text-sm resize-none"
        placeholder={placeholder}
      />
    </Field>
  )
}

// ── Image Manager ─────────────────────────────────────────────────────
function ImageManager({ slug, images = [], onImagesChange }) {
  const fileRef    = useRef()
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')

  const uploadMutation = useMutation({
    mutationFn: (formData) => adminApi.uploadImage(slug, formData),
    onSuccess:  (res) => { onImagesChange(res.data); setError('') },
    onError:    (err) => setError(parseError(err)),
    onSettled:  () => setUploading(false),
  })
  const deleteMutation = useMutation({
    mutationFn: (pk) => adminApi.deleteImage(pk),
    onSuccess:  (_, pk) => onImagesChange(images.filter((i) => i.id !== pk)),
    onError:    (err) => setError(parseError(err)),
  })
  const primaryMutation = useMutation({
    mutationFn: (pk) => adminApi.setPrimary(pk),
    onSuccess:  (res) => onImagesChange(images.map((i) => ({ ...i, is_primary: i.id === res.data.id }))),
    onError:    (err) => setError(parseError(err)),
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
      <div
        className="border-2 border-dashed border-border hover:border-gold transition-colors p-6 text-center cursor-pointer mb-4"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      >
        <Upload className="h-6 w-6 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">{uploading ? 'Uploading…' : 'Click or drag & drop images here'}</p>
        <p className="text-xs text-muted/60 mt-1">JPG, PNG, WebP — multiple allowed</p>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {images.length === 0 ? (
        <p className="text-xs text-muted text-center py-4">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className={cn('border-2 overflow-hidden transition-all', img.is_primary ? 'border-gold' : 'border-border')}>
              {/* Thumbnail */}
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(img)}
                  alt={img.alt_text_en || 'Product image'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-gold text-white text-[9px] px-1.5 py-0.5 font-medium leading-tight">
                    Main
                  </span>
                )}
              </div>
              {/* Actions — always visible */}
              <div className="flex border-t border-border">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => primaryMutation.mutate(img.id)}
                    disabled={primaryMutation.isPending}
                    title="Set as main image"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-muted hover:text-gold hover:bg-surface-2 transition-colors border-r border-border disabled:opacity-40"
                  >
                    <Star className="h-3 w-3" /> Main
                  </button>
                )}
                {img.is_primary && (
                  <div className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gold border-r border-border">
                    <Star className="h-3 w-3 fill-gold" /> Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this image?')) deleteMutation.mutate(img.id)
                  }}
                  disabled={deleteMutation.isPending}
                  title="Delete image"
                  className="flex items-center justify-center px-3 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Product Form ──────────────────────────────────────────────────────
const EMPTY = {
  sku: '', name_en: '', name_ar: '', description_en: '', description_ar: '',
  category: '', is_active: true, is_featured: false, colors: [],
  composition: '', width: '', light_fastness: '',
  // subcategories
  wall_covering_subcategory: '', upholstery_subcategory: '', curtains_subcategory: '',
  // wall covering
  background: '', oz: '', match: '', remove_type: '', order_type: '',
  maintenance: '', notes: '', wall_covering_material: '',
  // upholstery
  weight: '', upholstery_usage: '', upholstery_material: '',
  horizontal_repeat: '', vertical_repeat: '',
  // curtains
  curtain_usage: '', curtain_material: '',
}

export default function ProductForm({ mode, initialData }) {
  const router = useRouter()
  const qc     = useQueryClient()

  const [form,   setForm]   = useState(() => initialData ? { ...EMPTY, ...initialData } : EMPTY)
  const [images, setImages] = useState(initialData?.images || [])
  const [error,  setError]  = useState('')

  const { data: colorsData } = useQuery({
    queryKey: ['colors'],
    queryFn:  () => productsApi.colors(),
    select:   unwrapList,
  })

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
      colors: (form.colors || []).map((c) => (typeof c === 'object' ? c.id : c)),
    }
    mutation.mutate(payload)
  }

  const cat = form.category

  // Determine which wall covering material options to show based on subcategory
  const wcMaterialOptions =
    form.wall_covering_subcategory === 'natural' ? WC_MATERIALS_NATURAL
    : form.wall_covering_subcategory === 'fabric' ? WC_MATERIALS_FABRIC
    : WC_MATERIALS_ALL

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
            {mode === 'create' ? 'Create Product' : (initialData?.name_en || initialData?.sku || 'Edit Product')}
          </h1>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ── Identity ──────────────────────────────────────────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Item Code" required>
              <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-base text-sm" placeholder="WC-001" required />
            </Field>
            <SelectField
              label="Category" required
              value={form.category}
              onChange={(v) => { set('category', v); set('wall_covering_subcategory', ''); set('upholstery_subcategory', ''); set('curtains_subcategory', '') }}
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

        {/* ── Name & Description (optional display name) ─────────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Display Name & Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Name (English)" value={form.name_en} onChange={(v) => set('name_en', v)} placeholder="Optional display name" />
            <Field label="Name (Arabic)">
              <input value={form.name_ar || ''} onChange={(e) => set('name_ar', e.target.value)} className="input-base text-sm text-right" dir="rtl" placeholder="الاسم العربي (اختياري)" />
            </Field>
            <TextAreaField label="Description (English)" value={form.description_en} onChange={(v) => set('description_en', v)} placeholder="Product description…" />
            <Field label="Description (Arabic)">
              <textarea rows={3} value={form.description_ar || ''} onChange={(e) => set('description_ar', e.target.value)} className="input-base text-sm resize-none text-right" dir="rtl" placeholder="وصف المنتج…" />
            </Field>
          </div>
        </section>

        {/* ── Shared specifications ──────────────────────────────── */}
        {cat && (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <TextAreaField label="Composition" value={form.composition} onChange={(v) => set('composition', v)} placeholder="e.g. 100% Polyester" rows={2} />
              <TextField label="Width" value={form.width} onChange={(v) => set('width', v)} placeholder="e.g. 140 cm" />
              <SelectField label="Light Fastness" value={form.light_fastness} onChange={(v) => set('light_fastness', v)} options={LIGHT_FASTNESS} />
            </div>
          </section>
        )}

        {/* ── WALL COVERING fields ───────────────────────────────── */}
        {cat === 'wall_covering' && (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Wall Covering Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SelectField label="Subcategory" value={form.wall_covering_subcategory} onChange={(v) => set('wall_covering_subcategory', v)} options={WC_SUBS} />
              <SelectField label="Background" value={form.background} onChange={(v) => set('background', v)} options={BACKGROUNDS} />
              <TextField label="OZ" value={form.oz} onChange={(v) => set('oz', v)} placeholder="e.g. 20 oz" />
              <SelectField label="Match" value={form.match} onChange={(v) => set('match', v)} options={MATCHES} />
              <SelectField label="Remove Type" value={form.remove_type} onChange={(v) => set('remove_type', v)} options={REMOVE_TYPES} />
              <SelectField label="Order Type" value={form.order_type} onChange={(v) => set('order_type', v)} options={ORDER_TYPES} />
              <SelectField label="Maintenance" value={form.maintenance} onChange={(v) => set('maintenance', v)} options={MAINTENANCES} />
              {/* Material only for natural/fabric subcategories */}
              {(form.wall_covering_subcategory === 'natural' || form.wall_covering_subcategory === 'fabric') && (
                <SelectField label="Material" value={form.wall_covering_material} onChange={(v) => set('wall_covering_material', v)} options={wcMaterialOptions} />
              )}
              <div className="md:col-span-2 lg:col-span-3">
                <TextAreaField label="Notes (optional)" value={form.notes} onChange={(v) => set('notes', v)} placeholder="Any additional notes…" rows={2} />
              </div>
            </div>
          </section>
        )}

        {/* ── UPHOLSTERY fields ──────────────────────────────────── */}
        {cat === 'upholstery' && (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Upholstery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SelectField label="Subcategory" value={form.upholstery_subcategory} onChange={(v) => set('upholstery_subcategory', v)} options={UPH_SUBS} />
              <TextField label="Weight" value={form.weight} onChange={(v) => set('weight', v)} placeholder="e.g. 350 g/m²" />
              <SelectField label="Usage" value={form.upholstery_usage} onChange={(v) => set('upholstery_usage', v)} options={UPH_USAGES} />
              <TextField label="Horizontal Repeat" value={form.horizontal_repeat} onChange={(v) => set('horizontal_repeat', v)} placeholder="e.g. 64 cm" />
              <TextField label="Vertical Repeat" value={form.vertical_repeat} onChange={(v) => set('vertical_repeat', v)} placeholder="e.g. 64 cm" />
              <SelectField label="Material" value={form.upholstery_material} onChange={(v) => set('upholstery_material', v)} options={UPH_MATERIALS} />
            </div>
          </section>
        )}

        {/* ── CURTAINS fields ────────────────────────────────────── */}
        {cat === 'curtains' && (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Curtains Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SelectField label="Subcategory" value={form.curtains_subcategory} onChange={(v) => set('curtains_subcategory', v)} options={CUR_SUBS} />
              <TextField label="Weight" value={form.weight} onChange={(v) => set('weight', v)} placeholder="e.g. 250 g/m²" />
              <SelectField label="Usage" value={form.curtain_usage} onChange={(v) => set('curtain_usage', v)} options={CUR_USAGES} />
              <TextField label="Horizontal Repeat" value={form.horizontal_repeat} onChange={(v) => set('horizontal_repeat', v)} placeholder="e.g. 32 cm" />
              <TextField label="Vertical Repeat" value={form.vertical_repeat} onChange={(v) => set('vertical_repeat', v)} placeholder="e.g. 32 cm" />
              <SelectField label="Material" value={form.curtain_material} onChange={(v) => set('curtain_material', v)} options={CUR_MATERIALS} />
            </div>
          </section>
        )}

        {/* ── Colors ────────────────────────────────────────────── */}
        <section className="bg-canvas border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Colors</h2>
          <Field label="Select colors">
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
                      type="checkbox" className="sr-only" checked={selected}
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
        </section>

        {/* ── Images ────────────────────────────────────────────── */}
        {mode === 'edit' ? (
          <section className="bg-canvas border border-border p-6">
            <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-6">Images</h2>
            <ImageManager slug={initialData?.slug} images={images} onImagesChange={setImages} />
          </section>
        ) : (
          <div className="text-xs text-muted bg-surface-2 border border-border px-4 py-3">
            💡 Save the product first, then upload images from the edit page.
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pb-8">
          <button type="submit" disabled={mutation.isPending} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {mutation.isPending
              ? <span className="h-4 w-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
              : <Check className="h-4 w-4" />}
            {mutation.isPending ? 'Saving…' : (mode === 'create' ? 'Create Product' : 'Save Changes')}
          </button>
          <Link href="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
