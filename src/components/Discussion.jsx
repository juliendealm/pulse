import { useState } from 'react'
import { useComments } from '../lib/useComments'

const OPTION_COLORS = { a: '#ff4d6a', b: '#4d9fff', c: '#a78bfa' }

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'maintenant'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

function avatar(userId) {
  const colors = ['#ff4d6a', '#4d9fff', '#a78bfa', '#4dffb4', '#ffb74d']
  const i = userId?.charCodeAt(0) % colors.length || 0
  return colors[i]
}

export default function Discussion({ questionId, user, userVote }) {
  const { comments, loading, addComment, deleteComment } = useComments(questionId)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || !user) return
    setSending(true)
    await addComment(text, user.id)
    setText('')
    setSending(false)
  }

  const voteColor = userVote ? OPTION_COLORS[userVote] : 'var(--muted)'

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', fontWeight: 600, marginBottom: 12 }}>
        DISCUSSION · {comments.length}
      </div>

      {/* Comments list */}
      {!loading && comments.length === 0 && (
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Sois le premier à donner ton avis.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: avatar(c.user_id), opacity: 0.8,
            }} />
            <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 12, padding: '8px 12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.45 }}>{c.content}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{timeAgo(c.created_at)}</span>
                {user?.id === c.user_id && (
                  <button onClick={() => deleteComment(c.id)} style={{
                    background: 'none', border: 'none', color: 'var(--muted)',
                    fontSize: 10, cursor: 'pointer', padding: 0,
                  }}>suppr.</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: voteColor, opacity: 0.8, alignSelf: 'center',
          }} />
          <input
            value={text}
            onChange={e => setText(e.target.value.slice(0, 280))}
            placeholder="Ton avis…"
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '8px 12px', color: 'var(--text)',
              fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
          <button type="submit" disabled={sending || !text.trim()} style={{
            background: 'var(--red)', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 12, fontWeight: 600, padding: '0 14px',
            cursor: sending || !text.trim() ? 'default' : 'pointer',
            opacity: sending || !text.trim() ? 0.5 : 1,
          }}>→</button>
        </form>
      ) : (
        <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
          Connecte-toi pour participer à la discussion.
        </p>
      )}
    </div>
  )
}
