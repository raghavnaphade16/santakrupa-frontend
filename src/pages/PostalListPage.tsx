import { useCallback, useEffect, useState, type FormEvent } from 'react'
import PostListTable from '../components/PostListTable.tsx'
import { exportPostList, generatePostList } from '../services/postListService.ts'
import { listSeriesIssues } from '../services/postSeriesService.ts'
import type { PostListResult, SeriesIssue } from '../types.ts'

export default function PostalListPage() {
  const [series, setSeries] = useState<SeriesIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [result, setResult] = useState<PostListResult | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setSeries(await listSeriesIssues())
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

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    setGenerating(true)
    setGenError(null)
    setResult(null)
    try {
      setResult(await generatePostList(Number(selectedId)))
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate postal list')
    } finally {
      setGenerating(false)
    }
  }

  async function handleExport() {
    if (!selectedId) return
    const s = series.find((x) => String(x.id) === selectedId)
    setExporting(true)
    setGenError(null)
    try {
      await exportPostList(Number(selectedId), `list_${s?.yearMonth ?? selectedId}.xlsx`)
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to export')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="page">
      <header className="top">
        <h1>Postal List</h1>
      </header>

      <form className="card form inline-form" onSubmit={submit}>
        <label className="field">
          <span>Post series (year-month) *</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loading || series.length === 0}
          >
            <option value="">{loading ? 'Loading…' : 'Select year-month'}</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.yearMonth} ({s.startNo} – {s.endNo})
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!selectedId || generating}>
          {generating ? 'Generating…' : 'Generate'}
        </button>
        <button type="button" className="secondary" onClick={() => void handleExport()} disabled={!selectedId || exporting}>
          {exporting ? 'Exporting…' : 'Export Excel'}
        </button>
      </form>
      {loadError && (
        <p className="error">
          {loadError} <button className="secondary" onClick={() => void load()}>Retry</button>
        </p>
      )}
      {!loading && !loadError && series.length === 0 && (
        <p className="empty">No post series found. Create one under Post Series first.</p>
      )}
      {genError && <p className="error">{genError}</p>}

      {result && (
        <>
          <div className="summary">
            <span><b>{result.series.yearMonth}</b> · {result.series.startNo} – {result.series.endNo}</span>
            <span>Total barcodes: <b>{result.summary.totalBarcodes}</b></span>
            <span>Assigned: <b>{result.summary.assigned}</b></span>
            <span>Unused: <b>{result.summary.unusedBarcodes}</b></span>
            <span>Subscribers without barcode: <b>{result.summary.subscribersWithoutBarcode}</b></span>
          </div>
          <PostListTable rows={result.rows} />
        </>
      )}
    </div>
  )
}
