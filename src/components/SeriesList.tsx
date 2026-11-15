import type { SeriesIssue } from '../types.ts'

const COLUMNS: { header: string; cell: (s: SeriesIssue) => string | number }[] = [
  { header: 'Publisher', cell: (s) => s.publisherName ?? '' },
  { header: 'Start No', cell: (s) => s.startNo },
  { header: 'End No', cell: (s) => s.endNo },
  { header: 'Quantity', cell: (s) => s.quantity },
  { header: 'Issued Date', cell: (s) => s.issuedDate },
  { header: 'Booking Office', cell: (s) => s.bookingOffice ?? '' },
  { header: 'Year-Month', cell: (s) => s.yearMonth },
]

/** Excel-style grid, same look as the subscribers table. */
export default function SeriesList({ items }: { items: SeriesIssue[] }) {
  if (items.length === 0) return <p className="empty">No series issued yet.</p>
  return (
    <div className="sheet-wrap">
      <table className="sheet">
        <thead>
          <tr>
            <th className="rownum">#</th>
            {COLUMNS.map((c) => (
              <th key={c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((s, i) => (
            <tr key={s.id}>
              <td className="rownum">{i + 1}</td>
              {COLUMNS.map((c) => (
                <td key={c.header}>{c.cell(s)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
