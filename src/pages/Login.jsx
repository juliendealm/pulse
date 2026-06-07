import { useState } from 'react'

export default function Login({ onBack, sendMagicLink }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await sendMagicLink(email)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '4px', color: 'var(--red)', textAlign: 'center', marginBottom: 40 }}>PULSE</div>

        {sent ? (
          <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '32px 24px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 16, color: 'var(--muted)' }}>@</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Vérifie tes emails</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Un lien de connexion a été envoyé à <strong style={{ color: 'var(--text)' }}>{email}</strong>
            </p>
            <button onClick={onBack} style={{ marginTop: 24, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
              Retour
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '32px 24px', border: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Connexion</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Entre ton email — on t'envoie un lien magique, pas de mot de passe.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12,
                  padding: '13px 16px', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
              />
              {error && <p style={{ color: 'var(--red)', fontSize: 12 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{
                background: 'var(--red)', border: 'none', borderRadius: 12,
                padding: '13px', color: '#fff', fontSize: 14, fontWeight: 500,
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
                fontFamily: 'var(--font-body)',
              }}>
                {loading ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>
            <button onClick={onBack} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', display: 'block' }}>
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
