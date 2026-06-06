const COLORS = {
  a: { fill: '#ff4d6a', bg: 'rgba(255,77,106,0.10)' },
  b: { fill: '#4d9fff', bg: 'rgba(77,159,255,0.10)' },
  c: { fill: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
}
export default function VoteOption({ optionKey, label, pct, isVoted, hasVoted, onClick }) {
  const color = COLORS[optionKey] || COLORS.a
  const dimmed = hasVoted && !isVoted
  return (
    <button onClick={onClick} disabled={hasVoted} style={{
      position:'relative', width:'100%', padding:'14px 16px', borderRadius:14,
      border:`1px solid ${isVoted ? color.fill+'55' : 'var(--border)'}`,
      background:'var(--surface)', cursor: hasVoted ? 'default' : 'pointer',
      overflow:'hidden', opacity: dimmed ? 0.6 : 1,
      transition:'opacity 0.3s, border-color 0.3s', textAlign:'left',
    }}>
      <div style={{
        position:'absolute', left:0, top:0, bottom:0,
        width: hasVoted ? `${pct}%` : '0%',
        background: color.bg, borderRadius:14,
        transition:'width 0.9s cubic-bezier(0.34,1.2,0.64,1)',
      }} />
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:14, fontWeight: isVoted ? 500 : 400, color: isVoted ? '#fff' : 'var(--text)', transition:'color 0.3s' }}>
          {label}
        </span>
        {hasVoted && (
          <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color: isVoted ? color.fill : 'var(--muted)', transition:'color 0.3s' }}>
            {pct}%
          </span>
        )}
      </div>
    </button>
  )
}
