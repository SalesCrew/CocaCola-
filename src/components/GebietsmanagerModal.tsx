import { useState, useEffect } from 'react'
import GebietsmanagerModalFilters from './GebietsmanagerModalFilters'
import GebietsmanagerDonutChart from './GebietsmanagerDonutChart'
import GebietsmanagerLegendPanel from './GebietsmanagerLegendPanel'
import IPPLineChart from './IPPLineChart'
import CategoryFillChart from './CategoryFillChart'
import AustriaMap from './AustriaMap'
import { generateAll35Pins } from './GebietsmanagerDetailModal'

interface GebietsmanagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GebietsmanagerModal({ isOpen, onClose }: GebietsmanagerModalProps) {
  const [selectedGM, setSelectedGM] = useState('Alle')
  const [selectedChain, setSelectedChain] = useState('Alle')
    const progressTarget = Math.round((1567 / 1750) * 100)
    const [progressWidth, setProgressWidth] = useState(0)
  
  // Animate progress bar on open/refesh
  useEffect(() => {
    if (!isOpen) return
    // Reset to 0 immediately
    setProgressWidth(0)
    // Use double rAF to ensure the browser paints 0% before animating to target
    let raf1: number | null = null
    let raf2: number | null = null
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setProgressWidth(progressTarget)
      })
    })
    return () => {
      if (raf1) cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [isOpen, progressTarget])
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-body">
          <div className="modal-header" style={{ display: 'flex', gap: '24px' }}>
            <GebietsmanagerModalFilters
              selectedGM={selectedGM}
              onGMChange={setSelectedGM}
              selectedChain={selectedChain}
              onChainChange={setSelectedChain}
            />
            
            <div className="modal-progress-container" style={{
              background: 'rgba(0, 0, 0, 0.02)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '12px',
              padding: '13px 20px',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '52px',
              flex: 1,
              marginTop: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '9px', fontWeight: '500', color: 'rgba(51, 51, 51, 0.6)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Kühlerinventur Fortschritt
                </div>
                <div style={{ fontSize: '8px', fontWeight: '400', color: 'rgba(51, 51, 51, 0.5)' }}>
                  Ende: 31.09.2025
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  flex: 1, 
                  height: '8px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.06)', 
                  borderRadius: '4px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${progressWidth}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #f0c000 100%)',
                    borderRadius: '4px',
                    transition: 'width 1s ease'
                  }} />
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(51, 51, 51, 0.8)',
                  minWidth: '60px',
                  textAlign: 'right'
                }}>
                  1567/1750
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-content-section">
            <div className="modal-chart-container">
              <div className="modal-chart-header">
                <div className="modal-chart-title">Dashboard piechart</div>
              </div>
              <div className="modal-chart-content">
                <GebietsmanagerDonutChart />
                <GebietsmanagerLegendPanel />
              </div>
            </div>
            
            <div className="modal-line-chart-container">
              <IPPLineChart />
            </div>
          </div>
          
          <div className="modal-bottom-section">
            <div className="modal-bottom-chart-container" style={{ flex: 0.5 }}>
              <CategoryFillChart />
            </div>
            <div className="modal-bottom-chart-container" style={{ flex: 0.5, overflow: 'hidden' }}>
              <AustriaMap 
                pins={generateAll35Pins().map((market, index) => ({
                  id: `market-${index}`,
                  name: market.name,
                  lat: market.lat,
                  lng: market.lng,
                  manager: market.manager,
                  visitDate: market.visitDate,
                  travelMin: market.travelMin,
                  durationMin: market.durationMin,
                  status: market.status
                }))}
                fitToPins={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


