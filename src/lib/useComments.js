import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useComments(questionId) {
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState({})
  const [loading, setLoading] = useState(true)

  async function loadLikes(commentIds) {
    if (!commentIds.length) return
    const { data } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in('comment_id', commentIds)
    const map = {}
    data?.forEach(({ comment_id, user_id }) => {
      if (!map[comment_id]) map[comment_id] = []
      map[comment_id].push(user_id)
    })
    setLikes(map)
  }

  async function load() {
    const { data } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
    if (data?.length) loadLikes(data.map(c => c.id))
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

  async function toggleLike(commentId, userId) {
    if (!userId) return
    const already = likes[commentId]?.includes(userId)
    if (already) {
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', userId)
      setLikes(prev => ({ ...prev, [commentId]: prev[commentId].filter(id => id !== userId) }))
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId })
      setLikes(prev => ({ ...prev, [commentId]: [...(prev[commentId] || []), userId] }))
    }
  }

  return { comments, likes, loading, addComment, deleteComment, toggleLike }
}
