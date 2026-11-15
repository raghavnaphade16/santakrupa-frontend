import type { Subscriber } from '../types.ts'

interface Props {
  items: Subscriber[]
}

const COLUMNS: { header: string; cell: (s: Subscriber) => string | number }[] = [
  { header: 'Reg. No', cell: (s) => s.regNo },
  { header: 'Name', cell: (s) => s.name },
  { header: 'Address 1', cell: (s) => s.address1 },
  { header: 'Address 2', cell: (s) => s.address2 },
  { header: 'City', cell: (s) => s.city },
  { header: 'District', cell: (s) => s.district },
  { header: 'Pincode', cell: (s) => s.pincode },
  { header: 'State', cell: (s) => s.state },
  { header: 'Mobile No', cell: (s) => s.mobileNo },
  { header: 'Year(s)', cell: (s) => s.years },
  { header: 'Period (yrs)', cell: (s) => s.periodYears },
  { header: 'Pratinidhi', cell: (s) => s.pratinidhi },
  { header: 'Remark', cell: (s) => s.remark },
]

/** Excel-style grid: numbered rows, bordered cells, sticky header. */
export default function SubscriberList({ items }: Props) {
  if (items.length === 0) return <p className="empty">No subscribers found.</p>
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
            <tr key={s.regNo}>
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
