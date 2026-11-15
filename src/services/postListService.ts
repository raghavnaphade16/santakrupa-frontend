import type { PostListResult } from '../types.ts'

// Proxied to http://localhost:8080 by vite.config.ts (dev server).
// NOTE: HTTP method assumed to be POST — change here if the backend uses GET.
export async function generatePostList(seriesIssueId: number): Promise<PostListResult> {
  const res = await fetch(`/api/post-lists/${seriesIssueId}/generate`, { method: 'POST' })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.text()).slice(0, 300)
    } catch {
      /* ignore */
    }
    throw new Error(`Request failed (${res.status})${detail ? `: ${detail}` : ''}`)
  }
  return (await res.json()) as PostListResult
}

/** Downloads the postal list as an Excel file. HTTP method assumed GET. */
export async function exportPostList(seriesIssueId: number, fallbackName: string): Promise<void> {
  const res = await fetch(`/api/post-lists/${seriesIssueId}/export`)
  if (!res.ok) throw new Error(`Export failed (${res.status})`)
  const disposition = res.headers.get('Content-Disposition') ?? ''
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)
  const filename = match ? decodeURIComponent(match[1]) : fallbackName

  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
