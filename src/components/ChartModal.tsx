import { useState, useEffect } from 'react'
import DonutChart from './DonutChart'
import LegendPanel from './LegendPanel'
import CalendarFilter from './CalendarFilter'
import RegionFilter from './RegionFilter'
import HaFiFilter from './HaFiFilter'
import MarketFilter from './MarketFilter'
import LineChart from './LineChart'
import BesuchsFrequenzChart from './BesuchsFrequenzChart'

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  selectedHaFi: string
  onHaFiChange: (hafi: string) => void
}

export default function ChartModal({ isOpen, onClose, selectedHaFi, onHaFiChange }: ChartModalProps) {
  const [counters, setCounters] = useState({
    arbeitsstunden: 0,
    besuche: 0,
    oosAufgefunden: 0,
    oosBehoben: 0,
    oosBehobenPercent: 0
  })

  useEffect(() => {
    if (isOpen) {
      // Target values
      const targets = {
        arbeitsstunden: 530,
        besuche: 295,
        oosAufgefunden: 400,
        oosBehoben: 370,
        oosBehobenPercent: 92.5
      }

      // Animation duration
      const duration = 1000 // 1 second
      const frameRate = 60
      const totalFrames = duration / (1000 / frameRate)
      let currentFrame = 0

      const interval = setInterval(() => {
        currentFrame++
        const progress = Math.min(currentFrame / totalFrames, 1)
        
        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setCounters({
          arbeitsstunden: Math.round(targets.arbeitsstunden * easeOutQuart),
          besuche: Math.round(targets.besuche * easeOutQuart),
          oosAufgefunden: Math.round(targets.oosAufgefunden * easeOutQuart),
          oosBehoben: Math.round(targets.oosBehoben * easeOutQuart),
          oosBehobenPercent: Math.round(targets.oosBehobenPercent * easeOutQuart * 10) / 10
        })

        if (currentFrame >= totalFrames) {
          clearInterval(interval)
          setCounters(targets)
        }
      }, 1000 / frameRate)

      return () => clearInterval(interval)
    }
  }, [isOpen])

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
          <div className="modal-header">
            <div className="modal-filter-row">
              <div className="filter-flap">
                <div className="filter-flap-indicator"></div>
                <span className="filter-flap-text">Filter settings</span>
              </div>
              <CalendarFilter />
              <RegionFilter />
              <HaFiFilter selectedHaFi={selectedHaFi} onHaFiChange={onHaFiChange} />
              <MarketFilter selectedHaFi={selectedHaFi} />
            </div>
            
            <div className="modal-stats-container">
              <div className="stat-item">
                <div className="stat-value">{counters.arbeitsstunden}</div>
                <div className="stat-label">Arbeitsstunden</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{counters.besuche}</div>
                <div className="stat-label">Besuche</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{counters.oosAufgefunden}</div>
                <div className="stat-label">OOS Aufgefunden</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{counters.oosBehoben}</div>
                <div className="stat-label">OOS Behoben</div>
              </div>
              <div className="stat-item highlight">
                <div className="stat-value">{counters.oosBehobenPercent}%</div>
                <div className="stat-label">OOS Behoben %</div>
              </div>
            </div>
          </div>
          
          <div className="modal-content-section">
            <div className="modal-chart-container">
              <div className="modal-chart-header">
                <div className="modal-chart-title">Dashboard piechart</div>
              </div>
              <div className="modal-chart-content">
                <DonutChart />
                <LegendPanel />
              </div>
            </div>
            
            <div className="modal-line-chart-container">
              <LineChart />
            </div>
          </div>
          
          <div className="modal-bottom-section">
            <div className="modal-bottom-chart-container">
              <div className="modal-chart-header">
                <div className="modal-chart-title">Frequenz Marktbesuche</div>
              </div>
              <BesuchsFrequenzChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
