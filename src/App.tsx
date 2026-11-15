import { useState } from 'react'
import Sidebar, { type PageId } from './components/Sidebar.tsx'
import PostalListPage from './pages/PostalListPage.tsx'
import PostSeriesPage from './pages/PostSeriesPage.tsx'
import SubscribersPage from './pages/SubscribersPage.tsx'
import './App.css'

export default function App() {
  const [page, setPage] = useState<PageId>('subscribers')
  return (
    <div className="layout">
      <Sidebar active={page} onSelect={setPage} />
      <main className="content">
        {page === 'subscribers' && <SubscribersPage />}
        {page === 'post-series' && <PostSeriesPage />}
        {page === 'postal-list' && <PostalListPage />}
      </main>
    </div>
  )
}
