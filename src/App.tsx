import { useCallback, useState } from 'react'
import KundenDashboard from './Kunden-Dashboard'
import GebietsleiterDashboard from './Gebietsleiter-Dashboard'
import SalescrewDashboard from './Salescrew-Dashboard'

type ActivePage = 'kunden' | 'gebietsleiter' | 'settings'

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('kunden')

  const handleSwitchPage = useCallback(() => {
    setActivePage((prev) => {
      if (prev === 'kunden') return 'gebietsleiter'
      if (prev === 'gebietsleiter') return 'settings'
      return 'kunden'
    })
  }, [])

  const handleSettingsPage = useCallback(() => {
    setActivePage('settings')
  }, [])

  if (activePage === 'settings') {
    return <SalescrewDashboard onSwitchPage={handleSwitchPage} />
  }

  return activePage === 'kunden' ? (
    <KundenDashboard onSwitchPage={handleSwitchPage} />
  ) : (
    <GebietsleiterDashboard onSwitchPage={handleSwitchPage} onSettingsPage={handleSettingsPage} />
  )
}
