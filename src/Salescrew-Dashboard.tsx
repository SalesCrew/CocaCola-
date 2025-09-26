import { useState } from 'react'
import Sidebar from './components/Sidebar'
import FragebogenVerwalten from './Fragebogen-Verwalten'

interface SalescrewDashboardProps {
  onSwitchPage?: () => void
}

export default function SalescrewDashboard({ onSwitchPage }: SalescrewDashboardProps) {
  const [currentPage, setCurrentPage] = useState('overview')

  const handleMenuChange = (menuIndex: number) => {
    const pages = ['overview', 'fragebogen', 'promotoren', 'nachrichten', 'statistiken', 'schulungen', 'challenge', 'demotool', 'settings']
    setCurrentPage(pages[menuIndex] || 'overview')
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'fragebogen':
        return <FragebogenVerwalten onBack={() => setCurrentPage('overview')} />
      default:
        return (
          <div style={{ width: '100%', height: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>SalesCrew Dashboard</h1>
              <p>Wählen Sie eine Option aus der Seitenleiste</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      <Sidebar onSwitchPage={onSwitchPage} onMenuChange={handleMenuChange} />
      <main style={{ flex: 1, background: '#ffffff', padding: 0 }}>
        {renderContent()}
      </main>
    </div>
  )
}
