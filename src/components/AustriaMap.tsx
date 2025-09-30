import { useState } from 'react'
import { MapContainer, TileLayer, Marker, CircleMarker } from 'react-leaflet'
import { createPortal } from 'react-dom'

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

export default function AustriaMap({ pins }: AustriaMapProps) {
  // Austria center coordinates
  const austriaCenter: [number, number] = [48.386124, 13.695549]
  
  // Custom tooltip state
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  return (
    <>
      <style>{`
        .leaflet-container {
          background: transparent !important;
        }
        .leaflet-pane {
          top: -50px !important;
          bottom: -50px !important;
          height: calc(100% + 100px) !important;
        }
        .leaflet-control-zoom {
          margin-left: 30px !important;
          margin-top: 35px !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background: white !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          color: rgba(0, 0, 0, 0.6) !important;
          font-weight: 400 !important;
        }
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          border: none !important;
          outline: none !important;
        }
        .leaflet-marker-icon {
          filter: hue-rotate(-210deg) saturate(2.2) brightness(0.9) !important;
        }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          z-index: 10001 !important;
          position: fixed !important;
        }
        .leaflet-tooltip-pane {
          z-index: 10001 !important;
        }
      `}</style>
      <div style={{ height: '100%', width: '115%', marginLeft: '-7.5%' }}>
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

        {/* Simple tooltip that WILL show */}
        {hoveredPin && createPortal(
          <div style={{
            position: 'fixed',
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 200,
            zIndex: 2147483647, // Maximum z-index value
            pointerEvents: 'none',
            background: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            border: '1px solid #ccc',
            maxWidth: '200px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              {hoveredPin.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Georg Stockreiter
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Anfahrtszeit: 40 Minuten
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              Einsatz Dauer: 48 Minuten
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '8px', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>Einsatz Info</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Schütten: <span style={{ color: '#28a745', fontWeight: '600' }}>+1</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Displays: <span style={{ color: '#28a745', fontWeight: '600' }}>+1</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Cooler:</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#28a745' }}>
                Sehr voll
              </div>
            </div>
          </div>,
          document.body
        )}
        </MapContainer>
      </div>
    </>
  )
}
