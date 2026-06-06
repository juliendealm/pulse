import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Accept-Encoding': 'identity',
}

const __dir = dirname(fileURLToPath(import.meta.url))
const allQuestions = JSON.parse(readFileSync(join(__dir, '../questions.json'), 'utf8'))

const OPTIONS_POOL = [
  ['Oui, clairement', 'Non, pas du tout', 'Ça dépend'],
  ['Plutôt oui', 'Plutôt non', 'Je ne sais pas encore'],
  ['Toujours', 'Jamais', 'Parfois'],
  ['La liberté', 'La stabilité', 'L\'équilibre entre les deux'],
  ['Le travail', 'Les relations', 'La santé'],
  ['Créer', 'Optimiser', 'Explorer'],
  ['L\'instinct', 'La logique', 'Les deux selon le contexte'],
  ['Seul', 'En équipe', 'Ça dépend du projet'],
]

async function getUsedQuestions() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/questions?select=text`, { headers })
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`)
  const data = await res.json()
  return new Set(data.map(q => q.text))
}

async function insertQuestion(text, options, date) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, options, date }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Insert failed: ${err}`)
  }
}

async function run() {
  const today = new Date().toLocaleDateString('en-CA')
  console.log(`Inserting question for ${today}`)

  const used = await getUsedQuestions()
  const next = allQuestions.find(q => !used.has(q))

  if (!next) {
    console.error('No more questions available in questions.json')
    process.exit(1)
  }

  const options = OPTIONS_POOL[Math.floor(Math.random() * OPTIONS_POOL.length)]
  await insertQuestion(next, options, today)
  console.log(`Inserted: "${next}"`)
}

run().catch(err => {
  console.error(err.message)
  process.exit(1)
})
