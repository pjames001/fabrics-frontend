'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { parseError, cn } from '@/lib/utils'

const EMPTY_COLOR = { name_en: '', name_ar: '', hex_code: '#B5924C' }

function ColorRow({ color, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0 group">
      <div className="h-8 w-8 rounded-full border border-border flex-shrink-0 shadow-sm"
        style={{ backgroundColor: color.hex_code || '#ccc' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{color.name_en}</p>
        {color.name_ar && <p className="text-xs text-muted" dir="rtl">{color.name_ar}</p>}
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-muted">{color.name_en}</span>
        <span className="text-xs font-mono text-muted/60">{color.hex_code}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(color)} className="p-1.5 text-muted hover:text-gold transition-colors">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(color)} className="p-1.5 text-muted hover:text-red-500 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ColorForm({ initial, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState({
    ...EMPTY_COLOR,
    ...initial,
    name_en:  initial?.name_en  ?? '',
    name_ar:  initial?.name_ar  ?? '',
    hex_code: initial?.hex_code ?? '#B5924C',
  })
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="bg-surface-2 border border-border p-5 mb-4 animate-fade-up">
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs mb-3">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Name (English) *</label>
          <input value={form.name_en} onChange={(e) => set('name_en', e.target.value)} className="input-base text-sm" placeholder="Ivory" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Name (Arabic)</label>
          <input value={form.name_ar} onChange={(e) => set('name_ar', e.target.value)} className="input-base text-sm text-right" dir="rtl" placeholder="عاجي" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">HEX Code</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={form.hex_code || '#B5924C'}
              onChange={(e) => set('hex_code', e.target.value)}
              className="h-10 w-12 border border-border cursor-pointer p-0.5"
            />
            <input
              value={form.hex_code}
              onChange={(e) => set('hex_code', e.target.value)}
              className="input-base text-sm font-mono flex-1"
              placeholder="#B5924C"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.name_en}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {loading ? <span className="h-4 w-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" /> : <Check className="h-4 w-4" />}
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="btn-ghost text-sm"><X className="h-4 w-4" /> Cancel</button>
      </div>
    </div>
  )
}

export default function AdminColors() {
  const qc = useQueryClient()
  const [editing,  setEditing]  = useState(null)  // color object or 'new'
  const [error,    setError]    = useState('')
  const [confirm,  setConfirm]  = useState(null)

  const { data: colors, isLoading } = useQuery({
    queryKey: ['colors'],
    queryFn: () => productsApi.colors(),
    select: (d) => Array.isArray(d.data) ? d.data : (d.data?.results ?? []),
  })

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing === 'new'
        ? adminApi.createColor(data)
        : adminApi.updateColor(editing.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colors'] })
      setEditing(null)
      setError('')
    },
    onError: (err) => setError(parseError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteColor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['colors'] })
      setConfirm(null)
    },
    onError: (err) => setError(parseError(err)),
  })

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-2">Palette</p>
          <h1 className="font-display text-4xl font-light text-ink">Colors</h1>
          {colors && <p className="text-sm text-muted mt-1">{colors.length} colors</p>}
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-4 w-4" /> New Color
        </button>
      </div>

      {editing === 'new' && (
        <ColorForm
          onSave={(data) => saveMutation.mutate(data)}
          onCancel={() => { setEditing(null); setError('') }}
          loading={saveMutation.isPending}
          error={error}
        />
      )}

      <div className="bg-canvas border border-border px-5">
        {isLoading ? (
          <p className="py-8 text-center text-muted text-sm">Loading…</p>
        ) : colors?.length === 0 ? (
          <p className="py-8 text-center text-muted text-sm">No colors yet. Add one above.</p>
        ) : (
          colors?.map((color) => (
            <div key={color.id}>
              {editing?.id === color.id ? (
                <div className="py-2">
                  <ColorForm
                    initial={editing}
                    onSave={(data) => saveMutation.mutate(data)}
                    onCancel={() => { setEditing(null); setError('') }}
                    loading={saveMutation.isPending}
                    error={error}
                  />
                </div>
              ) : (
                <ColorRow
                  color={color}
                  onEdit={(c) => { setEditing(c); setError('') }}
                  onDelete={(c) => setConfirm(c)}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirm delete */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative bg-canvas border border-border p-8 w-full max-w-sm animate-fade-up">
            <p className="text-center text-sm text-muted mb-6">
              Delete color <strong>{confirm.name_en}</strong>? Products using it will lose this color tag.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(confirm.id)}
                disabled={deleteMutation.isPending}
                className="btn-primary flex-1 justify-center text-sm bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
