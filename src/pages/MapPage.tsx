import AustriaMap from '../components/AustriaMap'
import { generateAll35Pins } from '../components/GebietsmanagerDetailModal'

const pins = generateAll35Pins().map((market, index) => ({
  id: `market-${index}`,
  name: market.name,
  lat: market.lat,
  lng: market.lng,
  manager: market.manager,
  visitDate: market.visitDate,
  travelMin: market.travelMin,
  durationMin: market.durationMin,
  status: market.status
}))

export default function MapPage() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
        }}>
          Austria Market Map
        </h2>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '12px',
          color: '#666',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
        }}>
          {pins.length} locations • Hover for details
        </p>
      </div>
      
      <AustriaMap pins={pins} fitToPins={true} />
    </div>
  )
}
