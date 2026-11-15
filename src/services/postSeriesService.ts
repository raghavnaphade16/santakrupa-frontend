import type { PostSeries, SeriesIssue } from '../types.ts'

// Proxied to http://localhost:8080 by vite.config.ts (dev server).
const BASE = '/api/series-issues'

export async function createPostSeries(input: PostSeries): Promise<void> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.text()).slice(0, 300)
    } catch {
      /* ignore */
    }
    throw new Error(`Request failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }
}

export async function listSeriesIssues(): Promise<SeriesIssue[]> {
  // size=0 returned the full list in the sample response.
  const res = await fetch(`${BASE}?page=0&size=0&direction=desc`)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const data = (await res.json()) as { content: SeriesIssue[] }
  return data.content
}
