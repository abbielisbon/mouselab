import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

type Drop = {
  id: string
  created_at: string
  group_code: string
  created_by: string
  title: string
  note: string | null
  url: string | null
}

type DropFormState = {
  group_code: string
  created_by: string
  title: string
  note: string
  url: string
}

const initialForm: DropFormState = {
  group_code: '',
  created_by: '',
  title: '',
  note: '',
  url: '',
}

function App() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [filterGroupCode, setFilterGroupCode] = useState('')
  const [form, setForm] = useState<DropFormState>(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeGroupFilter = useMemo(() => filterGroupCode.trim(), [filterGroupCode])

  const loadDrops = async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('drops')
      .select('id, created_at, group_code, created_by, title, note, url')
      .order('created_at', { ascending: false })
      .limit(100)

    if (activeGroupFilter) {
      query = query.eq('group_code', activeGroupFilter)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setDrops([])
      setLoading(false)
      return
    }

    setDrops(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadDrops()
  }, [activeGroupFilter])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      group_code: form.group_code.trim(),
      created_by: form.created_by.trim(),
      title: form.title.trim(),
      note: form.note.trim() || null,
      url: form.url.trim() || null,
    }

    if (!payload.group_code || !payload.created_by || !payload.title) {
      setError('group_code, created_by, and title are required.')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('drops').insert(payload)

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setForm((current) => ({ ...initialForm, group_code: current.group_code }))
    setFilterGroupCode(payload.group_code)
    await loadDrops()
    setSubmitting(false)
  }

  return (
    <main className="app">
      <header>
        <h1>Culture Piggybank</h1>
        <p>Share links and notes with your group.</p>
      </header>

      <section className="panel">
        <h2>Group Feed Filter</h2>
        <div className="row">
          <input
            value={filterGroupCode}
            onChange={(event) => setFilterGroupCode(event.target.value)}
            placeholder="Enter group code to filter"
            aria-label="Group code filter"
          />
          <button type="button" onClick={() => void loadDrops()} disabled={loading}>
            Refresh
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>New Drop</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            value={form.group_code}
            onChange={(event) => setForm((current) => ({ ...current, group_code: event.target.value }))}
            placeholder="group_code"
          />
          <input
            required
            value={form.created_by}
            onChange={(event) => setForm((current) => ({ ...current, created_by: event.target.value }))}
            placeholder="created_by"
          />
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="title"
          />
          <textarea
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            placeholder="note"
            rows={3}
          />
          <input
            value={form.url}
            onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
            placeholder="url"
            type="url"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Drop'}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Latest Drops</h2>
        {loading ? <p>Loading drops...</p> : null}
        {!loading && drops.length === 0 ? <p>No drops found.</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <ul className="drop-list">
          {drops.map((drop) => (
            <li key={drop.id} className="drop-item">
              <h3>{drop.title}</h3>
              <p className="meta">
                group: {drop.group_code} | by: {drop.created_by} |{' '}
                {new Date(drop.created_at).toLocaleString()}
              </p>
              {drop.note ? <p>{drop.note}</p> : null}
              {drop.url ? (
                <a href={drop.url} target="_blank" rel="noreferrer">
                  {drop.url}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
