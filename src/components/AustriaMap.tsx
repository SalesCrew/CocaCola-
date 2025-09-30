import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, CircleMarker, useMap } from 'react-leaflet'
import { LatLngBounds } from 'leaflet'

interface Pin {
  id: string
  name: string
  lat: number
  lng: number
  manager?: string
  visitDate?: string
  travelMin?: number
  durationMin?: number
  status?: string
}

interface AustriaMapProps {
  pins: Pin[]
  fitToPins?: boolean
}

// Austria bounds approximately
const AUSTRIA_BOUNDS: [[number, number], [number, number]] = [
  [46.372, 9.530],  // SW corner
  [49.021, 17.160]  // NE corner
]

// Component to handle fitting bounds after map loads
function FitBounds({ pins, fitToPins }: { pins: Pin[], fitToPins: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (fitToPins && pins.length > 0) {
      const bounds = new LatLngBounds(pins.map(pin => [pin.lat, pin.lng]))
      map.fitBounds(bounds, { padding: [20, 20] }) // pad(0.2) equivalent
    }
  }, [pins, fitToPins, map])

  return null
}

export default function AustriaMap({ pins, fitToPins = true }: AustriaMapProps) {
  // Austria center coordinates
  const austriaCenter: [number, number] = [47.5162, 14.5501]

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <MapContainer
        center={austriaCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        maxBounds={AUSTRIA_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={6}
        maxZoom={18}
      >
        {/* OSM TileLayer with attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds component */}
        <FitBounds pins={pins} fitToPins={fitToPins} />

        {/* Render pins */}
        {pins.map((pin) => (
          <div key={pin.id}>
            {/* Highlight circle (transparent) */}
            <CircleMarker
              center={[pin.lat, pin.lng]}
              radius={15}
              color="#007bff"
              weight={2}
              opacity={0.3}
              fillColor="#007bff"
              fillOpacity={0.1}
            />

            {/* Main marker */}
            <Marker
              position={[pin.lat, pin.lng]}
              eventHandlers={{
                mouseover: (e: any) => {
                  e.target.openTooltip()
                },
                mouseout: (e: any) => {
                  e.target.closeTooltip()
                },
                click: (e: any) => {
                  // For touch devices
                  e.target.openTooltip()
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div style={{ 
                  fontSize: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {pin.name}
                  </div>
                  {pin.manager && (
                    <div style={{ color: '#666', marginBottom: '2px' }}>
                      Manager: {pin.manager}
                    </div>
                  )}
                  {pin.visitDate && (
                    <div style={{ color: '#666', marginBottom: '2px' }}>
                      Visit: {pin.visitDate}
                    </div>
                  )}
                  {pin.travelMin && (
                    <div style={{ color: '#666', marginBottom: '2px' }}>
                      Travel: {pin.travelMin}min
                    </div>
                  )}
                  {pin.durationMin && (
                    <div style={{ color: '#666', marginBottom: '2px' }}>
                      Duration: {pin.durationMin}min
                    </div>
                  )}
                  {pin.status && (
                    <div style={{ 
                      color: pin.status === 'Sehr voll' ? '#28a745' : 
                            pin.status === 'Halb voll' ? '#fd7e14' : 
                            pin.status === 'Leer' ? '#dc3545' : '#666',
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      Status: {pin.status}
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  )
}
