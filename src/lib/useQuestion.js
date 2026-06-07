import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useQuestion() {
  const [question, setQuestion] = useState(null)
  const [votes, setVotes] = useState({})
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const d = new Date()
        const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        const { data: q, error: qErr } = await supabase
          .from('questions').select('*').eq('date', today).single()
        if (qErr) throw qErr
        setQuestion(q)
        await refreshVotes(q.id)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!question) return
    const channel = supabase
      .channel('votes-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes', filter: `question_id=eq.${question.id}` },
        () => refreshVotes(question.id)
      ).subscribe()
    return () => supabase.removeChannel(channel)
  }, [question])

  async function refreshVotes(questionId) {
    const { data, error } = await supabase.from('votes').select('option').eq('question_id', questionId)
    if (error) return
    const counts = {}
    data.forEach(({ option }) => { counts[option] = (counts[option] || 0) + 1 })
    setVotes(counts)
    setTotalVotes(data.length)
  }

  return { question, votes, totalVotes, loading, error }
}

export async function fetchTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const tomorrow = d.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' })
  const { data } = await supabase.from('questions').select('text').eq('date', tomorrow).single()
  return data?.text || null
}
