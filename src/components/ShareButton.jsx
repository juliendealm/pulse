import { useState } from 'react'
export default function ShareButton({ questionText }) {
  const [copied, setCopied] = useState(false)
  function share() {
    const text = `"${questionText}" — Vote sur Pulse 👉 ${window.location.href}`
    if (navigator.share) {
      navigator.share({ title: 'Pulse', text })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }
  return (
    <button onClick={share} style={{
      width:'100%', padding:'13px', borderRadius:14,
      border:'1px solid var(--border)', background:'transparent',
      color:'var(--muted)', fontSize:13, fontWeight:500, letterSpacing:'0.5px',
    }}>
      {copied ? '✓ Lien copié' : '↑ Partager'}
    </button>
  )
}
