import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useArchives() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })

      const { data: qs } = await supabase
        .from('questions')
        .select('*')
        .lt('date', today)
        .order('date', { ascending: false })

      if (!qs?.length) { setLoading(false); return }

      const ids = qs.map(q => q.id)
      const { data: votes } = await supabase
        .from('votes')
        .select('question_id, option')
        .in('question_id', ids)

      const voteMap = {}
      votes?.forEach(({ question_id, option }) => {
        if (!voteMap[question_id]) voteMap[question_id] = {}
        voteMap[question_id][option] = (voteMap[question_id][option] || 0) + 1
      })

      setQuestions(qs.map(q => {
        const v = voteMap[q.id] || {}
        const total = Object.values(v).reduce((a, b) => a + b, 0)
        return { ...q, votes: v, total }
      }))
      setLoading(false)
    }
    load()
  }, [])

  return { questions, loading }
}
