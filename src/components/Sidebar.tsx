export type PageId = 'subscribers' | 'post-series' | 'postal-list'

const ITEMS: { id: PageId; label: string }[] = [
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'post-series', label: 'Post Series' },
  { id: 'postal-list', label: 'Postal List' },
]

interface Props {
  active: PageId
  onSelect: (id: PageId) => void
}

export default function Sidebar({ active, onSelect }: Props) {
  return (
    <nav className="sidebar" aria-label="Main menu">
      <div className="brand">Santakrupa</div>
      <ul>
        {ITEMS.map((i) => (
          <li key={i.id}>
            <button
              className={i.id === active ? 'nav active' : 'nav'}
              aria-current={i.id === active ? 'page' : undefined}
              onClick={() => onSelect(i.id)}
            >
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
