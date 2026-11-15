import { useCallback, useEffect, useMemo, useState } from 'react'
import SubscriberForm from '../components/SubscriberForm.tsx'
import SubscriberList from '../components/SubscriberList.tsx'
import { createSubscriber, listSubscribers } from '../services/subscriberService.ts'
import type { Subscriber, SubscriberInput } from '../types.ts'

export default function SubscribersPage() {
  const [items, setItems] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setItems(await listSubscribers())
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((s) =>
      [s.regNo, s.name, s.city, s.district, s.mobileNo, s.pratinidhi].some((f) =>
        f.toLowerCase().includes(q),
      ),
    )
  }, [items, query])

  async function handleSave(input: SubscriberInput) {
    setSaving(true)
    setSaveError(null)
    try {
      await createSubscriber(input)
      setAdding(false)
      await load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <header className="top">
        <h1>Magazine Subscribers</h1>
        {!adding && (
          <button
            onClick={() => {
              setSaveError(null)
              setAdding(true)
            }}
          >
            + Add subscriber
          </button>
        )}
      </header>

      {adding ? (
        <SubscriberForm
          existing={items}
          saving={saving}
          serverError={saveError}
          onSave={handleSave}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <>
          <input
            className="search"
            placeholder="Search by reg. no, name, city, district, mobile, pratinidhi…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <p className="empty">Loading…</p>}
          {loadError && (
            <p className="error empty">
              {loadError} <button className="secondary" onClick={() => void load()}>Retry</button>
            </p>
          )}
          {!loading && !loadError && <SubscriberList items={filtered} />}
        </>
      )}
    </div>
  )
}
