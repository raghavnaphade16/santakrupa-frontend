import type { Subscriber, SubscriberInput } from '../types.ts'

// Proxied to http://localhost:8080 by vite.config.ts (dev server).
const BASE = '/api/subscribers'

interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

type ApiSubscriber = { [K in keyof Subscriber]: Subscriber[K] | null }

async function failure(res: Response): Promise<Error> {
  let detail = ''
  try {
    detail = (await res.text()).slice(0, 300)
  } catch {
    /* ignore */
  }
  return new Error(`Request failed (${res.status})${detail ? `: ${detail}` : ''}`)
}

/** Backend returns null for empty fields; the UI works with strings. */
function normalise(s: ApiSubscriber): Subscriber {
  return {
    regNo: s.regNo ?? '',
    name: s.name ?? '',
    address1: s.address1 ?? '',
    address2: s.address2 ?? '',
    city: s.city ?? '',
    district: s.district ?? '',
    pincode: s.pincode ?? '',
    state: s.state ?? '',
    mobileNo: s.mobileNo ?? '',
    remark: s.remark ?? '',
    years: s.years ?? '',
    periodYears: s.periodYears ?? 0,
    pratinidhi: s.pratinidhi ?? '',
  }
}

export async function listSubscribers(): Promise<Subscriber[]> {
  // size=0 returned the full list in the sample response.
  const res = await fetch(`${BASE}?page=0&size=0&sortBy=regNo&direction=asc`)
  if (!res.ok) throw await failure(res)
  const data = (await res.json()) as Page<ApiSubscriber>
  return data.content.map(normalise)
}

export async function createSubscriber(input: SubscriberInput): Promise<void> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw await failure(res)
}
