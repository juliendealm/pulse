import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export function useAdmin() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .order('date', { ascending: false })
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addQuestion({ date, text, optionA, optionB, optionC }) {
    const { error } = await supabase.from('questions').insert({
      date,
      text,
      options: [optionA, optionB, optionC],
    })
    if (error) return error.message
    await load()
    return null
  }

  async function deleteQuestion(id) {
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (!error) setQuestions(prev => prev.filter(q => q.id !== id))
  }

  return { questions, loading, addQuestion, deleteQuestion }
}
