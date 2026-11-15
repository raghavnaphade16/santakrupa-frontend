export interface Subscriber {
  regNo: string
  name: string
  address1: string
  address2: string
  city: string
  district: string
  pincode: string
  state: string
  mobileNo: string
  remark: string
  /** Subscription year(s), e.g. "2025" or "2025-26" */
  years: string
  /** Subscription period length in years */
  periodYears: number
  /** Pratinidhi (representative) name, free text */
  pratinidhi: string
}

export type SubscriberInput = Subscriber

export const emptySubscriber: SubscriberInput = {
  regNo: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  district: '',
  pincode: '',
  state: '',
  mobileNo: '',
  remark: '',
  years: '',
  periodYears: 1,
  pratinidhi: '',
}

export type FormErrors = Partial<Record<keyof SubscriberInput, string>>

export interface PostSeries {
  /** e.g. MP30336601XIN */
  startNo: string
  /** e.g. MP30337800XIN */
  endNo: string
  quantity: number
  /** ISO date, yyyy-mm-dd */
  issuedDate: string
  bookingOffice: string
  /** yyyy-MM, e.g. 2026-11 */
  yearMonth: string
}

/** A saved series issue as returned by the backend. */
export interface SeriesIssue extends PostSeries {
  id: number
  publisherName: string
}

export interface PostListRow {
  srNo: number
  barcode: string
  subscriber: Subscriber
}

export interface PostListResult {
  series: SeriesIssue
  summary: {
    totalBarcodes: number
    assigned: number
    unusedBarcodes: number
    subscribersWithoutBarcode: number
  }
  rows: PostListRow[]
}
