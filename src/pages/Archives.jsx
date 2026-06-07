import { useArchives } from '../lib/useArchives'

const COLORS = {
  a: { fill: '#ff4d6a', bg: 'rgba(255,77,106,0.12)' },
  b: { fill: '#4d9fff', bg: 'rgba(77,159,255,0.12)' },
  c: { fill: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
}
const KEYS = ['a', 'b', 'c']

function pct(votes, key, total) {
  if (!total) return 0
  return Math.round(((votes[key] || 0) / total) * 100)
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Archives({ onBack }) {
  const { questions, loading } = useArchives()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: '48px 20px 60px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--muted)', padding: '6px 12px', fontSize: 12, cursor: 'pointer',
          }}>← Retour</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '4px', color: 'var(--red)' }}>ARCHIVES</span>
        </div>

        {loading && <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>Chargement…</p>}

        {!loading && questions.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>Aucune question passée pour l'instant.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map(q => (
            <div key={q.id} style={{ background: 'var(--surface)', borderRadius: 18, padding: '18px 16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 8 }}>
                {formatDate(q.date)} · {q.total.toLocaleString('fr-FR')} vote{q.total !== 1 ? 's' : ''}
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14, lineHeight: 1.35 }}>
                {q.text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(q.options || []).map((label, i) => {
                  const key = KEYS[i]
                  const color = COLORS[key]
                  const p = pct(q.votes, key, q.total)
                  const isWinner = p === Math.max(...KEYS.map(k => pct(q.votes, k, q.total)))
                  return (
                    <div key={key} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)', height: 36 }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p}%`, background: color.bg, transition: 'width 0.6s ease' }} />
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', height: '100%' }}>
                        <span style={{ fontSize: 12, color: isWinner ? '#fff' : 'var(--muted)', fontWeight: isWinner ? 500 : 400 }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', color: isWinner ? color.fill : 'var(--muted)' }}>{p}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
