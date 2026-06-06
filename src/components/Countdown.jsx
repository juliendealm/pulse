import { useState, useEffect } from 'react'
function getSecondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight - now) / 1000)
}
function format(secs) {
  const h = Math.floor(secs / 3600).toString().padStart(2, '0')
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}
export default function Countdown() {
  const [secs, setSecs] = useState(getSecondsUntilMidnight)
  useEffect(() => {
    const id = setInterval(() => setSecs(getSecondsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:24 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--red)', display:'inline-block', animation:'blink 1.2s ease-in-out infinite' }} />
      <span style={{ fontSize:11, letterSpacing:'1.5px', color:'var(--muted)', fontWeight:500 }}>
        EXPIRE DANS {format(secs)}
      </span>
    </div>
  )
}
