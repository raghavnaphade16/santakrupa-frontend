import type { PostListRow } from '../types.ts'

const COLUMNS: { header: string; cell: (r: PostListRow) => string | number }[] = [
  { header: 'Barcode', cell: (r) => r.barcode },
  { header: 'Reg. No', cell: (r) => r.subscriber.regNo },
  { header: 'Name', cell: (r) => r.subscriber.name },
  { header: 'Address 1', cell: (r) => r.subscriber.address1 },
  { header: 'Address 2', cell: (r) => r.subscriber.address2 },
  { header: 'City', cell: (r) => r.subscriber.city },
  { header: 'District', cell: (r) => r.subscriber.district },
  { header: 'Pincode', cell: (r) => r.subscriber.pincode },
  { header: 'State', cell: (r) => r.subscriber.state },
  { header: 'Mobile No', cell: (r) => r.subscriber.mobileNo },
  { header: 'Year(s)', cell: (r) => r.subscriber.years },
  { header: 'Period (yrs)', cell: (r) => r.subscriber.periodYears },
  { header: 'Pratinidhi', cell: (r) => r.subscriber.pratinidhi },
  { header: 'Remark', cell: (r) => r.subscriber.remark },
]

/** Excel-style grid: Sr No, Barcode, then subscriber details. Null fields render blank. */
export default function PostListTable({ rows }: { rows: PostListRow[] }) {
  if (rows.length === 0) return <p className="empty">No rows in this postal list.</p>
  return (
    <div className="sheet-wrap">
      <table className="sheet">
        <thead>
          <tr>
            <th className="rownum">Sr No</th>
            {COLUMNS.map((c) => (
              <th key={c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.srNo}>
              <td className="rownum">{r.srNo}</td>
              {COLUMNS.map((c) => (
                <td key={c.header}>{c.cell(r) ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
