import Sidebar from './components/Sidebar'

interface SalescrewDashboardProps {
  onSwitchPage?: () => void
}

export default function SalescrewDashboard({ onSwitchPage }: SalescrewDashboardProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      <Sidebar onSwitchPage={onSwitchPage} />
      <main style={{ flex: 1, background: '#ffffff', padding: 0 }}>
        <div style={{ width: '100%', height: '100vh', background: '#ffffff' }}>
          {/* Empty white page content area */}
        </div>
      </main>
    </div>
  )
}
