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

// Generate different data for the secondary map - 60 pins spread across Austria using actual market names
const generateSecondaryPins = (): PinSecondary[] => {
  // Use actual market names from Universumsmärkte - spread across Austria
  const actualMarkets = [
    // Vienna area - 12 pins
    { name: 'BILLA 1010', lat: 48.2082, lng: 16.3738 },
    { name: 'BILLA 1020', lat: 48.2169, lng: 16.3959 },
    { name: 'BILLA 1030', lat: 48.1951, lng: 16.3870 },
    { name: 'BILLA 1040', lat: 48.1936, lng: 16.3669 },
    { name: 'BILLA Plus 1090', lat: 48.2236, lng: 16.3545 },
    { name: 'BILLA Plus 1100', lat: 48.1741, lng: 16.3767 },
    { name: 'BILLA Plus 1110', lat: 48.1853, lng: 16.4215 },
    { name: 'BILLA Plus 1160', lat: 48.2142, lng: 16.3004 },
    { name: 'Spar 1210', lat: 48.2797, lng: 16.3962 },
    { name: 'Spar 1220', lat: 48.2388, lng: 16.4475 },
    { name: 'Spar 1230', lat: 48.1364, lng: 16.2993 },
    { name: 'Eurospar 2220', lat: 48.2005, lng: 16.5612 },
    // Lower Austria - 10 pins
    { name: 'BILLA 1050', lat: 48.4089, lng: 15.8233 },
    { name: 'BILLA 1060', lat: 47.9336, lng: 15.5956 },
    { name: 'Spar 2100', lat: 48.3479, lng: 16.3336 },
    { name: 'Spar 2140', lat: 48.5879, lng: 16.4983 },
    { name: 'Interspar 3100', lat: 48.2062, lng: 15.6256 },
    { name: 'Interspar 3110', lat: 48.2956, lng: 15.6689 },
    { name: 'Interspar 3150', lat: 47.9669, lng: 15.8089 },
    { name: 'Interspar 3180', lat: 48.0089, lng: 15.6669 },
    { name: 'Eurospar 2170', lat: 48.6789, lng: 16.6336 },
    { name: 'Eurospar 2200', lat: 48.1478, lng: 16.8974 },
    // Upper Austria - 8 pins  
    { name: 'Maxi Markt 4010', lat: 48.3064, lng: 14.2858 },
    { name: 'Maxi Markt 4020', lat: 48.3269, lng: 14.3189 },
    { name: 'Maxi Markt 4070', lat: 48.3169, lng: 13.9589 },
    { name: 'Maxi Markt 4080', lat: 48.2336, lng: 13.8256 },
    { name: 'Maxi Markt 4090', lat: 48.4556, lng: 13.7789 },
    { name: 'Maxi Markt 4100', lat: 48.3789, lng: 14.1336 },
    { name: 'BILLA 1070', lat: 48.1597, lng: 14.0289 },
    { name: 'BILLA Plus 1120', lat: 47.9556, lng: 14.1889 },
    // Styria - 8 pins
    { name: 'BILLA 1080', lat: 47.0707, lng: 15.4395 },
    { name: 'BILLA Plus 1130', lat: 47.1924, lng: 15.2869 },
    { name: 'BILLA Plus 1140', lat: 47.3772, lng: 15.0946 },
    { name: 'Spar 2110', lat: 46.9236, lng: 15.5574 },
    { name: 'Spar 2120', lat: 47.2669, lng: 15.1096 },
    { name: 'Interspar 3120', lat: 47.0669, lng: 15.6589 },
    { name: 'Interspar 3160', lat: 46.8956, lng: 15.7336 },
    { name: 'Eurospar 2180', lat: 47.1436, lng: 15.3782 },
    // Salzburg - 6 pins
    { name: 'ADEG 5010', lat: 47.8095, lng: 13.0550 },
    { name: 'ADEG 5020', lat: 47.7889, lng: 13.0669 },
    { name: 'ADEG 5030', lat: 47.8236, lng: 13.0336 },
    { name: 'ADEG 5040', lat: 47.7669, lng: 13.0789 },
    { name: 'Spar 2150', lat: 47.5879, lng: 13.2983 },
    { name: 'Eurospar 2190', lat: 47.9089, lng: 12.8233 },
    // Tyrol - 6 pins
    { name: 'BILLA Plus 1150', lat: 47.2692, lng: 11.4041 },
    { name: 'BILLA Plus 1170', lat: 47.3244, lng: 11.3249 },
    { name: 'BILLA Plus 1180', lat: 47.2315, lng: 11.4824 },
    { name: 'Interspar 3130', lat: 47.1589, lng: 11.2089 },
    { name: 'Interspar 3140', lat: 47.3789, lng: 11.5336 },
    { name: 'Eurospar 2210', lat: 47.0447, lng: 11.6589 },
    // Carinthia - 5 pins
    { name: 'BILLA Plus 1190', lat: 46.6244, lng: 14.3055 },
    { name: 'Spar 2130', lat: 46.5708, lng: 14.1767 },
    { name: 'Spar 2160', lat: 46.7951, lng: 14.0426 },
    { name: 'Eurospar 2230', lat: 46.5367, lng: 14.4089 },
    { name: 'Eurospar 2240', lat: 46.7869, lng: 13.9547 },
    // Vorarlberg - 3 pins
    { name: 'BILLA Plus 1200', lat: 47.5058, lng: 9.7490 },
    { name: 'ADEG 5050', lat: 47.4089, lng: 9.8089 },
    { name: 'Eurospar 2250', lat: 47.3669, lng: 9.6589 },
    // Burgenland - 2 pins
    { name: 'ADEG 5060', lat: 47.8456, lng: 16.5256 },
    { name: 'Eurospar 2260', lat: 47.0956, lng: 16.2547 }
  ]

  const glNames = [
    'Mario Riedenbauer', 'Michael Wilhelmi', 'Eva Zausinger', 'Thomas Nobis', 
    'Josef Schellhorn', 'Benjamin Spiegel', 'Christoph Leitner', 'Christoph Zauner',
    'Irene Traxler', 'Doris Stockinger', 'Rainer Perzl', 'Georg Stockreiter'
  ]

  let allMarkets: any[] = []
  
  // Take 60 markets and spread them with geographic diversity
  actualMarkets.slice(0, 60).forEach((market, idx) => {
    // Add significant geographic variation to spread pins out
    const seed1 = (market.name.charCodeAt(0) + idx) * 0.0123
    const seed2 = (market.name.charCodeAt(0) + idx) * 0.0456  
    const seed3 = (market.name.charCodeAt(0) + idx) * 0.0789
    const latVariation = (Math.sin(seed1) * 0.08) + (Math.cos(seed3) * 0.05) // Much larger spread
    const lngVariation = (Math.cos(seed2) * 0.12) + (Math.sin(seed1 * 1.7) * 0.07) // Much larger spread
    
    allMarkets.push({
      name: market.name,
      lat: market.lat + latVariation,
      lng: market.lng + lngVariation,
      category: 'Discount'
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
                         {oosFixed ? 'Ja' : 'NEIN'}
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
