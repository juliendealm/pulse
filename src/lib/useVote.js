import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useVote(questionId) {
  const storageKey = `pulse_vote_${questionId}`
  const [userVote, setUserVote] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!questionId) return
    const saved = localStorage.getItem(storageKey)
    if (saved) setUserVote(saved)
  }, [questionId])

  async function castVote(option, userId = null) {
    if (userVote || submitting || !questionId) return
    setSubmitting(true)
    setUserVote(option)
    localStorage.setItem(storageKey, option)
    const payload = { question_id: questionId, option }
    if (userId) payload.user_id = userId
    const { error } = await supabase.from('votes').insert(payload)
    if (error) {
      setUserVote(null)
      localStorage.removeItem(storageKey)
      console.error('Vote error:', error.message)
    }
    setSubmitting(false)
  }

  return { userVote, castVote, submitting }
}
