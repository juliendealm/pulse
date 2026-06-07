import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useArchives(userId = null) {
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

      const [{ data: votes }, { data: userVotes }] = await Promise.all([
        supabase.from('votes').select('question_id, option').in('question_id', ids),
        userId
          ? supabase.from('votes').select('question_id, option').in('question_id', ids).eq('user_id', userId)
          : Promise.resolve({ data: [] }),
      ])

      const voteMap = {}
      votes?.forEach(({ question_id, option }) => {
        if (!voteMap[question_id]) voteMap[question_id] = {}
        voteMap[question_id][option] = (voteMap[question_id][option] || 0) + 1
      })

      const userVoteMap = {}
      userVotes?.forEach(({ question_id, option }) => { userVoteMap[question_id] = option })

      setQuestions(qs.map(q => {
        const v = voteMap[q.id] || {}
        const total = Object.values(v).reduce((a, b) => a + b, 0)
        return { ...q, votes: v, total, userVote: userVoteMap[q.id] || null }
      }))
      setLoading(false)
    }
    load()
  }, [userId])

  return { questions, loading }
}
