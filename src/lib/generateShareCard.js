const OPTION_COLORS = {
  a: { fill: '#ff4d6a', bg: 'rgba(255,77,106,0.25)' },
  b: { fill: '#4d9fff', bg: 'rgba(77,159,255,0.25)' },
  c: { fill: '#a78bfa', bg: 'rgba(167,139,250,0.25)' },
}
const KEYS = ['a', 'b', 'c']

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let lines = []
  for (let word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line = test
    }
  }
  if (line.trim()) lines.push(line.trim())
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight))
  return lines.length
}

export async function generateShareCard({ questionText, options, votes, totalVotes, userVote }) {
  const W = 540
  const H = 960
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  // Subtle grid pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 1
  for (let i = 0; i < W; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke()
  }
  for (let i = 0; i < H; i += 40) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke()
  }

  // Top accent line
  ctx.fillStyle = '#ff4d6a'
  ctx.fillRect(0, 0, W, 3)

  // PULSE logo
  ctx.fillStyle = '#ff4d6a'
  ctx.font = 'bold 22px -apple-system, sans-serif'
  ctx.letterSpacing = '8px'
  ctx.textAlign = 'center'
  ctx.fillText('PULSE', W / 2, 80)

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(60, 100); ctx.lineTo(W - 60, 100); ctx.stroke()

  // "Question du jour" label
  ctx.fillStyle = '#ff4d6a'
  ctx.font = '500 11px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('QUESTION DU JOUR', W / 2, 140)

  // Question text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  const lineCount = wrapText(ctx, questionText, W / 2, 190, W - 80, 40)

  // Options bars
  const barY = 200 + lineCount * 40 + 40
  const barH = 64
  const barGap = 16
  const barX = 50
  const barW = W - 100

  options.forEach((label, i) => {
    const key = KEYS[i]
    const color = OPTION_COLORS[key]
    const p = totalVotes > 0 ? Math.round(((votes[key] || 0) / totalVotes) * 100) : 0
    const isMyVote = userVote === key
    const y = barY + i * (barH + barGap)

    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.beginPath()
    ctx.roundRect(barX, y, barW, barH, 12)
    ctx.fill()

    // Bar fill
    if (p > 0) {
      ctx.fillStyle = color.bg
      ctx.beginPath()
      ctx.roundRect(barX, y, barW * (p / 100), barH, 12)
      ctx.fill()
    }

    // My vote highlight
    if (isMyVote) {
      ctx.strokeStyle = color.fill
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(barX, y, barW, barH, 12)
      ctx.stroke()
    }

    // Label
    ctx.fillStyle = isMyVote ? '#ffffff' : 'rgba(255,255,255,0.6)'
    ctx.font = `${isMyVote ? 'bold' : '500'} 15px -apple-system, sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText((isMyVote ? '→ ' : '') + label, barX + 16, y + barH / 2 + 6)

    // Percentage
    ctx.fillStyle = isMyVote ? color.fill : 'rgba(255,255,255,0.4)'
    ctx.font = `bold 18px -apple-system, sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText(`${p}%`, barX + barW - 16, y + barH / 2 + 7)
  })

  // Participants
  const statsY = barY + 3 * (barH + barGap) + 30
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '500 13px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${totalVotes.toLocaleString('fr-FR')} participants`, W / 2, statsY)

  // Bottom URL
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.font = '500 13px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('pulse-eight-roan.vercel.app', W / 2, H - 50)

  return canvas
}

export async function shareCard(cardData) {
  const canvas = await generateShareCard(cardData)

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'pulse.png', { type: 'image/png' })

      // Try Web Share API with file (works on iOS Safari + Android Chrome)
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Pulse — La question du jour' })
          resolve('shared')
          return
        } catch {}
      }

      // Fallback: open image in new tab
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      resolve('opened')
    }, 'image/png')
  })
}
