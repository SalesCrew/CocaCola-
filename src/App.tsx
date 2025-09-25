import { useCallback, useState } from 'react'
import KundenDashboard from './Kunden-Dashboard'
import GebietsleiterDashboard from './Gebietsleiter-Dashboard'

type ActivePage = 'kunden' | 'gebietsleiter'

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('kunden')

  const handleSwitchPage = useCallback(() => {
    setActivePage((prev) => (prev === 'kunden' ? 'gebietsleiter' : 'kunden'))
  }, [])

  return activePage === 'kunden' ? (
    <KundenDashboard onSwitchPage={handleSwitchPage} />
  ) : (
    <GebietsleiterDashboard onSwitchPage={handleSwitchPage} />
  )
}
