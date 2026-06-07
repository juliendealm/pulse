import { useState, useEffect } from 'react'
import Countdown from './components/Countdown'
import VoteOption from './components/VoteOption'
import Archives from './pages/Archives'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { useQuestion, fetchTomorrow } from './lib/useQuestion'
import { useVote } from './lib/useVote'
import { useAuth } from './lib/useAuth'
import { useProfile } from './lib/useProfile'

const COLORS = { a: '#ff4d6a', b: '#4d9fff', c: '#a78bfa' }
const KEYS = ['a', 'b', 'c']

function getPct(votes, key, total) {
  if (!total) return 0
  return Math.round(((votes[key] || 0) / total) * 100)
}

function buildShareText(questionText, votes, totalVotes, userVote, options) {
  const bars = KEYS.map((k, i) => {
    const p = getPct(votes, k, totalVotes)
    const blocks = Math.round(p / 10)
    const bar = ('█'.repeat(blocks) + '░'.repeat(10 - blocks))
    const marker = userVote === k ? ' <' : ''
    return `${bar} ${p}%${marker}`
  })
  return `PULSE — ${questionText}\n\n${bars.join('\n')}\n\n${totalVotes} participants\npulse-eight-roan.vercel.app`
}

export default function App() {
  const [page, setPage] = useState('home')
  const [tomorrow, setTomorrow] = useState(null)
  const { question, votes, totalVotes, loading, error } = useQuestion()
  const { userVote, castVote } = useVote(question?.id)
  const { user, sendMagicLink, signOut } = useAuth()
  const { streak } = useProfile(user?.id)

  useEffect(() => {
    if (userVote) fetchTomorrow().then(setTomorrow)
  }, [userVote])

  const isAdmin = user?.email === 'juliendealmeida91@me.com'

  if (page === 'archives') return <Archives onBack={() => setPage('home')} />
  if (page === 'login') return <Login onBack={() => setPage('home')} sendMagicLink={sendMagicLink} />
  if (page === 'profile') return <Profile user={user} onBack={() => setPage('home')} signOut={signOut} />
  if (page === 'admin' && isAdmin) return <Admin onBack={() => setPage('home')} signOut={signOut} />

  if (loading) return <Screen><p style={{ color:'var(--muted)', fontSize:14 }}>Chargement...</p></Screen>
  if (error) return <Screen><p style={{ color:'var(--red)', fontSize:14 }}>Erreur : {error}</p></Screen>
  if (!question) return <Screen><p style={{ color:'var(--muted)', fontSize:14 }}>Aucune question aujourd'hui.</p></Screen>

  const options = question.options || []

  function handleShare() {
    const text = buildShareText(question.text, votes, totalVotes, userVote, options)
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Résultats copiés !')
    }
  }

  return (
    <Screen>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <button onClick={() => setPage('archives')} style={{
          background:'none', border:'1px solid var(--border)', borderRadius:8,
          color:'var(--muted)', fontSize:11, padding:'4px 10px', cursor:'pointer', letterSpacing:'0.5px',
        }}>Archives</button>
        <div style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:800, letterSpacing:'4px', color:'var(--red)' }}>PULSE</div>
        {user ? (
          <button onClick={() => setPage(isAdmin ? 'admin' : 'profile')} style={{
            background:'none', border:'1px solid var(--border)', borderRadius:8,
            color:'var(--muted)', fontSize:11, padding:'4px 10px', cursor:'pointer', letterSpacing:'0.5px',
          }}>{isAdmin ? 'Admin' : 'Profil'}</button>
        ) : (
          <button onClick={() => setPage('login')} style={{
            background:'none', border:'1px solid var(--border)', borderRadius:8,
            color:'var(--muted)', fontSize:11, padding:'4px 10px', cursor:'pointer', letterSpacing:'0.5px',
          }}>Connexion</button>
        )}
      </div>

      {/* Streak badge */}
      {user && streak > 0 && (
        <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
          <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:'1px' }}>
            {streak} jour{streak > 1 ? 's' : ''} de suite
          </div>
        </div>
      )}

      <Countdown />

      {/* Question */}
      <div style={{ background:'var(--surface)', borderRadius:18, padding:'20px 18px', border:'1px solid var(--border)', marginBottom:16 }}>
        <div style={{ fontSize:10, letterSpacing:'2px', color:'var(--red)', fontWeight:600, textTransform:'uppercase', marginBottom:10 }}>Question du jour</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--text)', lineHeight:1.35 }}>{question.text}</h1>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {options.map((label, i) => {
          const key = KEYS[i]
          return (
            <VoteOption key={key} optionKey={key} label={label}
              pct={getPct(votes, key, totalVotes)}
              isVoted={userVote === key} hasVoted={!!userVote}
              onClick={() => castVote(key, user?.id)} />
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:4 }}>
        <span style={{ fontSize:11, color:'var(--muted)', letterSpacing:'0.5px' }}>
          {totalVotes > 0 ? `${totalVotes.toLocaleString('fr-FR')} participants` : userVote ? '1 participant' : 'Sois le premier à voter'}
        </span>
        {userVote && (
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,77,106,0.1)', border:'1px solid rgba(255,77,106,0.25)', borderRadius:20, padding:'3px 10px', fontSize:9, fontWeight:700, letterSpacing:'1.5px', color:'var(--red)' }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--red)', display:'inline-block', animation:'blink 1.2s ease-in-out infinite' }} />
            LIVE
          </div>
        )}
      </div>

      {/* Post-vote */}
      {userVote && (
        <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:10, animation:'fadeUp 0.4s ease' }}>

          {/* Share */}
          <button onClick={handleShare} style={{
            background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14,
            color:'var(--text)', fontSize:13, padding:'13px', cursor:'pointer',
            fontFamily:'var(--font-body)', fontWeight:500, letterSpacing:'0.3px',
          }}>
            Partager mes résultats
          </button>

          {/* Teaser demain */}
          {tomorrow && (
            <div style={{ background:'var(--surface)', borderRadius:14, padding:'14px 16px', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, letterSpacing:'2px', color:'var(--muted)', fontWeight:600, marginBottom:6 }}>DEMAIN</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:15, color:'var(--text)', lineHeight:1.35, opacity:0.7 }}>{tomorrow}</div>
            </div>
          )}

        </div>
      )}
    </Screen>
  )
}

function Screen({ children }) {
  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'48px 20px 40px', background:'var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:420, display:'flex', flexDirection:'column', gap:0 }}>
        {children}
      </div>
    </div>
  )
}
