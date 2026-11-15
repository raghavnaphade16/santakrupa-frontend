import { useCallback, useEffect, useState, type FormEvent } from 'react'
import SeriesList from '../components/SeriesList.tsx'
import { createPostSeries, listSeriesIssues } from '../services/postSeriesService.ts'
import type { PostSeries, SeriesIssue } from '../types.ts'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface FormState {
  startNo: string
  endNo: string
  quantity: string
  issuedDate: string
  bookingOffice: string
  year: string
  month: string
}

const initial: FormState = {
  startNo: '',
  endNo: '',
  quantity: '',
  issuedDate: '',
  bookingOffice: '',
  year: String(new Date().getFullYear()),
  month: String(new Date().getMonth() + 1),
}

type Errors = Partial<Record<keyof FormState, string>>

// MP30336601XIN -> prefix "MP", digits "30336601", suffix "XIN"
function parseSeries(v: string) {
  const m = /^([A-Z]+)(\d+)([A-Z]+)$/.exec(v.trim().toUpperCase())
  return m ? { prefix: m[1], digits: m[2], suffix: m[3] } : null
}

function validate(v: FormState): Errors {
  const e: Errors = {}
  if (!parseSeries(v.startNo)) e.startNo = 'Format like MP30336601XIN'
  if (!parseSeries(v.endNo)) e.endNo = 'Format like MP30337800XIN'
  const a = parseSeries(v.startNo)
  const b = parseSeries(v.endNo)
  if (a && b && (a.prefix !== b.prefix || a.suffix !== b.suffix || Number(b.digits) < Number(a.digits)))
    e.endNo = 'End no must match start no prefix/suffix and not be lower than it'
  if (!/^[1-9]\d*$/.test(v.quantity)) e.quantity = 'Enter a whole number (at least 1)'
  if (!v.issuedDate) e.issuedDate = 'Issued date is required'
  if (!v.bookingOffice.trim()) e.bookingOffice = 'Booking office is required'
  if (!/^\d{4}$/.test(v.year)) e.year = 'Enter a 4-digit year'
  return e
}

export default function PostSeriesPage() {
  const [values, setValues] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [issues, setIssues] = useState<SeriesIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setIssues(await listSeriesIssues())
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load series')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const set = (key: keyof FormState, value: string) => {
    setSuccess(false)
    setValues((v) => ({ ...v, [key]: value }))
  }

  const field = (key: keyof FormState, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="field">
      <span>{label}</span>
      <input
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        {...props}
      />
      {errors[key] && <small className="error">{errors[key]}</small>}
    </label>
  )

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setServerError(null)
    setSuccess(false)
    if (Object.keys(errs).length > 0) return

    const payload: PostSeries = {
      startNo: values.startNo.trim().toUpperCase(),
      endNo: values.endNo.trim().toUpperCase(),
      quantity: Number(values.quantity),
      issuedDate: values.issuedDate,
      bookingOffice: values.bookingOffice.trim(),
      yearMonth: `${values.year}-${values.month.padStart(2, '0')}`,
    }
    setSaving(true)
    try {
      await createPostSeries(payload)
      setSuccess(true)
      setValues({ ...initial })
      await load()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <header className="top">
        <h1>Create Post Series</h1>
      </header>
      <form className="card form" onSubmit={submit} noValidate>
        <div className="grid">
          {field('startNo', 'Start no *', { placeholder: 'MP30336601XIN', autoCapitalize: 'characters' })}
          {field('endNo', 'End no *', { placeholder: 'MP30337800XIN', autoCapitalize: 'characters' })}
          {field('quantity', 'Quantity *', { inputMode: 'numeric' })}
          {field('issuedDate', 'Issued date *', { type: 'date' })}
          {field('bookingOffice', 'Booking office *')}
          {field('year', 'Year *', { inputMode: 'numeric', maxLength: 4 })}
          <label className="field">
            <span>Month *</span>
            <select value={values.month} onChange={(e) => set('month', e.target.value)}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
        </div>
        {serverError && <p className="error">{serverError}</p>}
        {success && <p className="success">Post series saved.</p>}
        <div className="actions">
          <button type="button" className="secondary" disabled={saving} onClick={() => { setValues({ ...initial }); setErrors({}); setServerError(null); setSuccess(false) }}>
            Reset
          </button>
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Submit'}</button>
        </div>
      </form>

      <h2 className="section-title">Issued series</h2>
      {loading && <p className="empty">Loading…</p>}
      {loadError && (
        <p className="error empty">
          {loadError} <button className="secondary" onClick={() => void load()}>Retry</button>
        </p>
      )}
      {!loading && !loadError && <SeriesList items={issues} />}
    </div>
  )
}
