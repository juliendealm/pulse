import { useState } from 'react'

export default function UsernameModal({ onSave }) {
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) { setError('2 caractères minimum.'); return }
    setSaving(true)
    const err = await onSave(trimmed)
    if (err) setError(err)
    setSaving(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, zIndex: 100,
    }}>
      <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 360, border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          Comment tu t'appelles ?
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.5 }}>
          Ton prénom ou un pseudo — visible dans les discussions.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value.slice(0, 20)); setError(null) }}
            placeholder="Ton prénom ou pseudo"
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12,
              padding: '12px 14px', color: 'var(--text)', fontSize: 14,
              fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
          {error && <p style={{ fontSize: 12, color: 'var(--red)' }}>{error}</p>}
          <button type="submit" disabled={saving || name.trim().length < 2} style={{
            background: 'var(--red)', border: 'none', borderRadius: 12,
            padding: '12px', color: '#fff', fontSize: 14, fontWeight: 500,
            cursor: saving || name.trim().length < 2 ? 'default' : 'pointer',
            opacity: saving || name.trim().length < 2 ? 0.6 : 1,
            fontFamily: 'var(--font-body)',
          }}>
            {saving ? 'Enregistrement…' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
