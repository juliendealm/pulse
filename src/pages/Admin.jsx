import { useState } from 'react'
import { useAdmin } from '../lib/useAdmin'

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })

function formatDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const field = {
  background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10,
  padding: '10px 14px', color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-body)',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function Admin({ onBack }) {
  const { questions, loading, addQuestion, deleteQuestion } = useAdmin()
  const [form, setForm] = useState({ date: '', text: '', optionA: '', optionB: '', optionC: '' })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const upcoming = questions.filter(q => q.date >= today()).sort((a, b) => a.date.localeCompare(b.date))
  const past = questions.filter(q => q.date < today())

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.date || !form.text || !form.optionA || !form.optionB || !form.optionC) return
    setSaving(true)
    setError(null)
    const err = await addQuestion(form)
    if (err) setError(err)
    else setForm({ date: '', text: '', optionA: '', optionB: '', optionC: '' })
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '48px 20px 60px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>← Retour</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '4px', color: 'var(--red)' }}>ADMIN</span>
        </div>

        {/* Add form */}
        <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '20px 18px', border: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '2px', color: 'var(--red)', fontWeight: 600, marginBottom: 16 }}>NOUVELLE QUESTION</div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={field} />
            <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Question…" rows={2}
              style={{ ...field, resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {['optionA', 'optionB', 'optionC'].map((key, i) => (
                <input key={key} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={`Option ${['A', 'B', 'C'][i]}`} style={field} />
              ))}
            </div>
            {error && <p style={{ color: 'var(--red)', fontSize: 12 }}>{error}</p>}
            <button type="submit" disabled={saving} style={{
              background: 'var(--red)', border: 'none', borderRadius: 10, padding: '11px',
              color: '#fff', fontSize: 13, fontWeight: 500, cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Enregistrement…' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Upcoming */}
        <div style={{ fontSize: 11, letterSpacing: '2px', color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>
          A VENIR — {upcoming.length} question{upcoming.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {loading && <p style={{ color: 'var(--muted)', fontSize: 13 }}>Chargement…</p>}
          {upcoming.map(q => (
            <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--red)', marginBottom: 3 }}>{formatDate(q.date)}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.3 }}>{q.text}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{q.options?.join(' · ')}</div>
              </div>
              {q.date > today() && (
                <button onClick={() => deleteQuestion(q.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 11, padding: '3px 8px', cursor: 'pointer', flexShrink: 0 }}>
                  Suppr.
                </button>
              )}
            </div>
          ))}
          {!loading && upcoming.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>Aucune question programmée.</p>}
        </div>

        {/* Past */}
        <div style={{ fontSize: 11, letterSpacing: '2px', color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>
          PASSEES — {past.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {past.map(q => (
            <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', opacity: 0.6 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 3 }}>{formatDate(q.date)}</div>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{q.text}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
