import { useState } from 'react'
import { useProfile } from '../lib/useProfile'
import { useUsername } from '../lib/useUsername'

const COLORS = {
  a: '#ff4d6a',
  b: '#4d9fff',
  c: '#a78bfa',
}
const LABELS = { a: 'A', b: 'B', c: 'C' }

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function Profile({ user, onBack, signOut }) {
  const { history, streak, loading } = useProfile(user?.id)
  const { username, saveUsername } = useUsername(user?.id)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState(null)

  async function handleSaveName() {
    if (newName.trim().length < 2) { setNameError('2 caractères minimum.'); return }
    const err = await saveUsername(newName.trim())
    if (err) setNameError(err.includes('unique') || err.includes('duplicate') ? 'Ce pseudo est déjà pris.' : err)
    else { setEditingName(false); setNameError(null) }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '48px 20px 60px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <button onClick={onBack} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--muted)', padding: '6px 12px', fontSize: 12, cursor: 'pointer',
          }}>← Retour</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '4px', color: 'var(--red)' }}>PROFIL</span>
          <button onClick={signOut} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--muted)', padding: '6px 12px', fontSize: 12, cursor: 'pointer',
          }}>Déconnexion</button>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '20px 18px', border: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Pseudo</div>
              {editingName ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input autoFocus value={newName} onChange={e => { setNewName(e.target.value.slice(0, 20)); setNameError(null) }}
                    style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }} />
                  {nameError && <span style={{ fontSize: 11, color: 'var(--red)' }}>{nameError}</span>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSaveName} style={{ background: 'var(--red)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>Sauvegarder</button>
                    <button onClick={() => { setEditingName(false); setNameError(null) }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{username || '—'}</div>
              )}
            </div>
            {!editingName && (
              <button onClick={() => { setNewName(username || ''); setEditingName(true) }}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
                Modifier
              </button>
            )}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)' }}>{user?.email}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '18px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, letterSpacing: '1px' }}>JOURS DE SUITE</div>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '18px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{history.length}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, letterSpacing: '1px' }}>VOTES TOTAL</div>
          </div>
        </div>

        {loading && <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>Chargement…</p>}

        {!loading && history.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>Aucun vote enregistré.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((entry, i) => {
            const color = COLORS[entry.option]
            return (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 14, padding: '14px 16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{formatDate(entry.question.date)}</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.question.text}</div>
                </div>
                <div style={{ flexShrink: 0, background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color, letterSpacing: '1px' }}>
                  {entry.question.options?.[['a','b','c'].indexOf(entry.option)] || LABELS[entry.option]}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
