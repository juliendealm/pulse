import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function calcStreak(dates) {
  if (!dates.length) return 0
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
  const sorted = [...new Set(dates)].sort().reverse()
  if (sorted[0] !== today) return 0
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (prev - curr) / (1000 * 60 * 60 * 24)
    if (diff === 1) streak++
    else break
  }
  return streak
}

export function useProfile(userId) {
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    async function load() {
      const { data: votes } = await supabase
        .from('votes')
        .select('option, question_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!votes?.length) { setLoading(false); return }

      const ids = votes.map(v => v.question_id)
      const { data: questions } = await supabase
        .from('questions')
        .select('id, text, options, date')
        .in('id', ids)

      const qMap = {}
      questions?.forEach(q => { qMap[q.id] = q })

      const entries = votes.map(v => ({
        ...v,
        question: qMap[v.question_id],
      })).filter(v => v.question)

      const dates = entries.map(v => v.question.date)
      setStreak(calcStreak(dates))
      setHistory(entries)
      setLoading(false)
    }

    load()
  }, [userId])

  return { history, streak, loading }
}
