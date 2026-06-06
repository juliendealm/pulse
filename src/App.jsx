import Countdown from './components/Countdown'
import VoteOption from './components/VoteOption'
import ShareButton from './components/ShareButton'
import { useQuestion } from './lib/useQuestion'
import { useVote } from './lib/useVote'

function getPct(votes, key, total) {
  if (!total) return 0
  return Math.round(((votes[key] || 0) / total) * 100)
}

export default function App() {
  const { question, votes, totalVotes, loading, error } = useQuestion()
  const { userVote, castVote } = useVote(question?.id)

  if (loading) return <Screen><p style={{ color:'var(--muted)', fontSize:14 }}>Chargement...</p></Screen>
  if (error) return <Screen><p style={{ color:'var(--red)', fontSize:14 }}>Erreur : {error}</p></Screen>
  if (!question) return <Screen><p style={{ color:'var(--muted)', fontSize:14 }}>Aucune question aujourd'hui.</p></Screen>

  const options = question.options || []
  const keys = ['a', 'b', 'c']

  return (
    <Screen>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:800, letterSpacing:'4px', color:'var(--red)', textAlign:'center', marginBottom:8 }}>PULSE</div>
      <Countdown />
      <div style={{ background:'var(--surface)', borderRadius:18, padding:'20px 18px', border:'1px solid var(--border)', marginBottom:16 }}>
        <div style={{ fontSize:10, letterSpacing:'2px', color:'var(--red)', fontWeight:600, textTransform:'uppercase', marginBottom:10 }}>Question du jour</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--text)', lineHeight:1.35 }}>{question.text}</h1>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {options.map((label, i) => {
          const key = keys[i]
          return (
            <VoteOption key={key} optionKey={key} label={label}
              pct={getPct(votes, key, totalVotes)}
              isVoted={userVote === key} hasVoted={!!userVote}
              onClick={() => castVote(key)} />
          )
        })}
      </div>
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
      {userVote && (
        <div style={{ marginTop:12, animation:'fadeUp 0.4s ease' }}>
          <ShareButton questionText={question.text} />
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
