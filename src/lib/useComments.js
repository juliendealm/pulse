import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useComments(questionId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!questionId) return
    load()

    const channel = supabase
      .channel('comments-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `question_id=eq.${questionId}` },
        load
      ).subscribe()

    return () => supabase.removeChannel(channel)
  }, [questionId])

  async function addComment(content, userId) {
    if (!content.trim() || !userId) return null
    const { error } = await supabase.from('comments').insert({
      question_id: questionId,
      user_id: userId,
      content: content.trim(),
    })
    return error?.message || null
  }

  async function deleteComment(id) {
    await supabase.from('comments').delete().eq('id', id)
  }

  return { comments, loading, addComment, deleteComment }
}
