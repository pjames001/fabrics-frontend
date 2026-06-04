'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Check, X, AlertCircle, ExternalLink } from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { parseError } from '@/lib/utils'

const EMPTY = { name: '', slug: '', bio_en: '', bio_ar: '', website: '' }

function CollaboratorForm({ initial, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState(initial || EMPTY)
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
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Name *</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input-base text-sm" placeholder="Studio Linen Co." />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Website</label>
          <input value={form.website} onChange={(e) => set('website', e.target.value)} className="input-base text-sm" placeholder="https://…" type="url" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Bio (English)</label>
          <textarea rows={3} value={form.bio_en} onChange={(e) => set('bio_en', e.target.value)} className="input-base text-sm resize-none" placeholder="About this collaborator…" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Bio (Arabic)</label>
          <textarea rows={3} value={form.bio_ar} onChange={(e) => set('bio_ar', e.target.value)} className="input-base text-sm resize-none text-right" dir="rtl" placeholder="نبذة عن المتعاون…" />
        </div>
        <div>
          <label className="block text-xs font-medium tracking-[0.1em] uppercase text-muted mb-1.5">Slug</label>
          <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="input-base text-sm font-mono" placeholder="auto-generated if empty" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={loading || !form.name} className="btn-primary text-sm disabled:opacity-50">
          {loading ? <span className="h-4 w-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" /> : <Check className="h-4 w-4" />}
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="btn-ghost text-sm"><X className="h-4 w-4" /> Cancel</button>
      </div>
    </div>
  )
}

export default function AdminCollaborators() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [error,   setError]   = useState('')
  const [confirm, setConfirm] = useState(null)

  const { data: collabs, isLoading } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => productsApi.collaborators(),
    select: (d) => Array.isArray(d.data) ? d.data : (d.data?.results ?? []),
  })

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing === 'new'
        ? adminApi.createCollaborator(data)
        : adminApi.updateCollaborator(editing.slug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['collaborators'] })
      setEditing(null); setError('')
    },
    onError: (err) => setError(parseError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (slug) => adminApi.deleteCollaborator(slug),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['collaborators'] }); setConfirm(null) },
    onError: (err) => setError(parseError(err)),
  })

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label mb-2">Partners</p>
          <h1 className="font-display text-4xl font-light text-ink">Collaborators</h1>
          {collabs && <p className="text-sm text-muted mt-1">{collabs.length} collaborators</p>}
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-4 w-4" /> New Collaborator
        </button>
      </div>

      {editing === 'new' && (
        <CollaboratorForm
          onSave={(data) => saveMutation.mutate(data)}
          onCancel={() => { setEditing(null); setError('') }}
          loading={saveMutation.isPending}
          error={error}
        />
      )}

      <div className="bg-canvas border border-border">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading…</p>
        ) : collabs?.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No collaborators yet.</p>
        ) : (
          collabs?.map((c) => (
            <div key={c.id} className="border-b border-border last:border-0">
              {editing?.slug === c.slug ? (
                <div className="p-4">
                  <CollaboratorForm
                    initial={editing}
                    onSave={(data) => saveMutation.mutate(data)}
                    onCancel={() => { setEditing(null); setError('') }}
                    loading={saveMutation.isPending}
                    error={error}
                  />
                </div>
              ) : (
                <div className="flex items-start gap-4 p-4 group hover:bg-surface-2/50 transition-colors">
                  <div className="h-10 w-10 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-sm font-medium">{c.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{c.name}</p>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-gold transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {c.bio && <p className="text-xs text-muted mt-0.5 line-clamp-1">{c.bio}</p>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(c); setError('') }} className="p-1.5 text-muted hover:text-gold transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirm(c)} className="p-1.5 text-muted hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative bg-canvas border border-border p-8 w-full max-w-sm animate-fade-up">
            <p className="text-center text-sm text-muted mb-6">
              Delete collaborator <strong>{confirm.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirm.slug)} disabled={deleteMutation.isPending} className="btn-primary flex-1 justify-center text-sm bg-red-600 hover:bg-red-700">
                {deleteMutation.isPending ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
