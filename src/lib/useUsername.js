import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useUsername(userId) {
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase.from('profiles').select('username').eq('user_id', userId).single()
      .then(({ data }) => {
        setUsername(data?.username || null)
        setLoading(false)
      })
  }, [userId])

  async function saveUsername(name) {
    const { error } = await supabase.from('profiles').upsert({ user_id: userId, username: name.trim() })
    if (!error) setUsername(name.trim())
    return error?.message || null
  }

  return { username, loading, saveUsername }
}

export async function fetchUsernames(userIds) {
  if (!userIds.length) return {}
  const { data } = await supabase.from('profiles').select('user_id, username').in('user_id', userIds)
  const map = {}
  data?.forEach(p => { map[p.user_id] = p.username })
  return map
}
