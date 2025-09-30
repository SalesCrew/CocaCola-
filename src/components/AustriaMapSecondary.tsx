import { useState } from 'react'
import { MapContainer, TileLayer, Marker, CircleMarker } from 'react-leaflet'
import { createPortal } from 'react-dom'

interface PinSecondary {
  id: string
  name: string
  lat: number
  lng: number
  manager?: string
  visitDate?: string
  travelMin?: number
  durationMin?: number
  status?: string
  category?: string
}

interface AustriaMapSecondaryProps {
  pins: PinSecondary[]
}

// Generate different data for the secondary map - 60 pins spread across Austria
const generateSecondaryPins = (): PinSecondary[] => {
  const chains = ['HOFER', 'LIDL', 'PENNY', 'NETTO', 'NORMA']
  const cities = [
    // Vienna area (15 pins)
    { city: 'Wien', lat: 48.2082, lng: 16.3738, codes: ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150'] },
    // Lower Austria (10 pins)  
    { city: 'Korneuburg', lat: 48.3477, lng: 16.3307, codes: ['2100', '2110', '2120', '2130', '2140'] },
    { city: 'St. Pölten', lat: 48.2066, lng: 15.6254, codes: ['3100', '3110', '3120', '3130', '3140'] },
    // Upper Austria (8 pins)
    { city: 'Linz', lat: 48.3069, lng: 14.2858, codes: ['4010', '4020', '4030', '4040'] },
    { city: 'Wels', lat: 48.1597, lng: 14.0289, codes: ['4600', '4610', '4620', '4630'] },
    // Salzburg (6 pins)
    { city: 'Salzburg', lat: 47.8095, lng: 13.0550, codes: ['5010', '5020', '5030', '5040', '5050', '5060'] },
    // Styria (8 pins)
    { city: 'Graz', lat: 47.0707, lng: 15.4395, codes: ['8010', '8020', '8030', '8040'] },
    { city: 'Leoben', lat: 47.3772, lng: 15.0946, codes: ['8700', '8710', '8720', '8730'] },
    // Carinthia (6 pins)
    { city: 'Klagenfurt', lat: 46.6244, lng: 14.3055, codes: ['9010', '9020', '9030', '9040', '9050', '9060'] },
    // Tyrol (4 pins)
    { city: 'Innsbruck', lat: 47.2692, lng: 11.4041, codes: ['6010', '6020', '6030', '6040'] },
    // Vorarlberg (3 pins)
    { city: 'Bregenz', lat: 47.5058, lng: 9.7490, codes: ['6900', '6910', '6920'] }
  ]

  const glNames = [
    'Mario Riedenbauer', 'Michael Wilhelmi', 'Eva Zausinger', 'Thomas Nobis', 
    'Josef Schellhorn', 'Benjamin Spiegel', 'Christoph Leitner', 'Christoph Zauner',
    'Irene Traxler', 'Doris Stockinger', 'Rainer Perzl', 'Georg Stockreiter'
  ]

  let allMarkets: any[] = []
  
  // Generate markets for each city
  cities.forEach((cityData) => {
    cityData.codes.forEach((code, idx) => {
      const chainIndex = Math.abs((code.charCodeAt(0) + idx) % chains.length)
      const chain = chains[chainIndex]
      
      // Add significant geographic variation within city to spread pins out
      const seed1 = parseInt(code) * 0.0123
      const seed2 = parseInt(code) * 0.0456  
      const seed3 = parseInt(code) * 0.0789
      const latVariation = (Math.sin(seed1) * 0.08) + (Math.cos(seed3) * 0.05) // Much larger spread
      const lngVariation = (Math.cos(seed2) * 0.12) + (Math.sin(seed1 * 1.7) * 0.07) // Much larger spread
      
      allMarkets.push({
        name: `${chain} ${code}`,
        lat: cityData.lat + latVariation,
        lng: cityData.lng + lngVariation,
        category: 'Discount'
      })
    })
  })

  return allMarkets.map((market, index) => ({
    ...market,
    id: `secondary-${index}`,
    manager: glNames[index % glNames.length],
    travelMin: 15 + (index % 8) * 6, // 15-57 minutes
    durationMin: 90 + (index % 31), // 90-120 minutes range
    visitDate: '2025-09-30',
    status: ['Sehr voll', 'Halb voll', 'Leer'][index % 3]
  }))
}

export default function AustriaMapSecondary({ pins }: AustriaMapSecondaryProps) {
  // Austria center coordinates
  const austriaCenter: [number, number] = [48.386124, 13.695549]
  
  // Custom tooltip state
  const [hoveredPin, setHoveredPin] = useState<PinSecondary | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  return (
    <>
      <style>{`
        .secondary-map .leaflet-container {
          background: transparent !important;
        }
        .secondary-map .leaflet-pane {
          top: -50px !important;
          bottom: -50px !important;
          height: calc(100% + 100px) !important;
        }
        .secondary-map .leaflet-control-zoom {
          margin-left: 30px !important;
          margin-top: 20px !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }
        .secondary-map .leaflet-control-zoom-in,
        .secondary-map .leaflet-control-zoom-out {
          background: white !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          color: rgba(0, 0, 0, 0.6) !important;
          font-weight: 400 !important;
        }
        .secondary-map .leaflet-control-zoom-in:hover,
        .secondary-map .leaflet-control-zoom-out:hover {
          border: none !important;
          outline: none !important;
        }
        .secondary-map .leaflet-marker-icon {
          filter: hue-rotate(-210deg) saturate(2.2) brightness(0.9) !important;
        }
      `}</style>
      <div className="secondary-map" style={{ height: '100%', width: '115%', marginLeft: '-7.5%', position: 'relative' }}>
        {/* Top right interval switcher - matches chart tabs exactly */}
        <div style={{
          position: 'absolute',
          top: '-24px',
          right: '36px',
          zIndex: 1000
        }}>
          {/* Grey background container */}
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            background: 'rgba(128, 128, 128, 0.4)',
            borderRadius: '6px',
            zIndex: -1
          }}></div>
          
          <div className="interval-switcher">
            <button className="interval-btn active">
              heute
            </button>
          </div>
        </div>

        <MapContainer
          center={austriaCenter}
          zoom={7}
          style={{ height: 'calc(100% + 100px)', width: '100%', marginTop: '-50px', position: 'relative', outline: 'none' }}
          minZoom={6}
          maxZoom={18}
        >
        {/* OSM TileLayer with attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render pins */}
        {pins.map((pin) => (
          <div key={pin.id}>
            {/* Highlight circle (transparent) */}
            <CircleMarker
              center={[pin.lat, pin.lng]}
              radius={15}
              color="#dc2626"
              weight={2}
              opacity={0.3}
              fillColor="#dc2626"
              fillOpacity={0.1}
            />

            {/* Main marker */}
            <Marker
              position={[pin.lat, pin.lng]}
              eventHandlers={{
                mouseover: (e: any) => {
                  setTooltipPos({
                    x: e.originalEvent.clientX,
                    y: e.originalEvent.clientY
                  })
                  setHoveredPin(pin)
                },
                mouseout: () => {
                  setHoveredPin(null)
                },
                click: (e: any) => {
                  setTooltipPos({
                    x: e.originalEvent.clientX,
                    y: e.originalEvent.clientY
                  })
                  setHoveredPin(pin)
                }
              }}
            />
          </div>
        ))}

        {/* Custom tooltip */}
        {hoveredPin && createPortal(
          <div style={{
            position: 'fixed',
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 200,
            zIndex: 2147483647,
            pointerEvents: 'none',
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            border: '1px solid #ccc',
            maxWidth: '200px'
          }}>
            {/* Market Name */}
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {hoveredPin.name}
            </div>
            
            {/* Shelf Merchandizer name */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              {(() => {
                const merchandizers = ['Sarah Weber', 'Michael Huber', 'Lisa Mayer', 'Thomas Fischer', 'Anna Bauer', 'David Müller', 'Petra Schmidt', 'Stefan Wagner']
                const index = Math.abs(hoveredPin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % merchandizers.length
                return merchandizers[index]
              })()}
            </div>
            
            {/* Besuchsdatum */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Besuchsdatum: {hoveredPin.visitDate || '30.09.2025'}
            </div>
            
            {/* Einsatzdauer - varies 90-120 minutes */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Einsatzdauer: ca. {(() => {
                const seed = Math.abs(hoveredPin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))
                return 90 + (seed % 31) // 90-120 minutes range
              })()}min
            </div>
            
            {/* OOS gefunden */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>OOS gefunden:</span>
              {(() => {
                const pinIndex = parseInt(hoveredPin.id.replace('secondary-', ''))
                const oosFound = (pinIndex % 3) === 0 // Every third pin has OOS found
                return (
                  <span style={{
                    background: oosFound ? '#28a745' : '#dc3545', // Ja = GREEN, Nein = RED
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {oosFound ? 'Ja' : 'Nein'}
                  </span>
                )
              })()}
            </div>
            
            {/* OOS behoben - only show if OOS gefunden is Ja */}
            {(() => {
              const pinIndex = parseInt(hoveredPin.id.replace('secondary-', ''))
              const oosFound = (pinIndex % 3) === 0 // Every third pin has OOS found
              if (oosFound) {
                const seed = Math.abs(hoveredPin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))
                const oosFixed = (seed % 10) >= 1 // 90% chance of being fixed (9 out of 10)
                return (
                  <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>OOS behoben:</span>
                    <span style={{
                      background: oosFixed ? '#28a745' : '#dc3545', // JA = GREEN, NEIN = RED
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {oosFixed ? 'JA' : 'NEIN'}
                    </span>
                  </div>
                )
              }
              return null
            })()}
          </div>,
          document.body
        )}
        </MapContainer>
      </div>
    </>
  )
}

// Export the generator function for external use
export { generateSecondaryPins }
