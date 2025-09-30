import AustriaMap from '../components/AustriaMap'

const pins = [
  { 
    id: '1', 
    name: 'Billa+ Sägestraße 22-96', 
    lat: 47.0707, 
    lng: 15.4395, 
    manager: 'Mario Riedenbauer', 
    visitDate: '2025-09-30', 
    travelMin: 25, 
    durationMin: 36, 
    status: 'Halb voll' 
  },
  { 
    id: '2', 
    name: 'Salzburg Store', 
    lat: 47.8095, 
    lng: 13.0550 
  },
  {
    id: '3',
    name: 'Vienna Center',
    lat: 48.2082,
    lng: 16.3738,
    manager: 'Thomas Nobis',
    visitDate: '2025-09-28',
    travelMin: 15,
    durationMin: 45,
    status: 'Sehr voll'
  },
  {
    id: '4',
    name: 'Linz Market',
    lat: 48.3069,
    lng: 14.2858,
    manager: 'Eva Zausinger',
    visitDate: '2025-09-25',
    travelMin: 30,
    durationMin: 40,
    status: 'Leer'
  },
  {
    id: '5',
    name: 'Innsbruck Store',
    lat: 47.2692,
    lng: 11.4041,
    manager: 'Josef Schellhorn',
    visitDate: '2025-09-27',
    travelMin: 35,
    durationMin: 50,
    status: 'Halb voll'
  }
]

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
