import { useState } from 'react'
import CalendarFilter from './CalendarFilter'
import RegionFilter from './RegionFilter'
import HaFiFilter from './HaFiFilter'
import MarketFilter from './MarketFilter'

interface FilterCustomizerProps {
  selectedHaFi: string
  onHaFiChange: (hafi: string) => void
}

export default function FilterCustomizer({ selectedHaFi, onHaFiChange }: FilterCustomizerProps) {
  return (
    <div className="filter-customizer">
      <div className="customizer-header">
        <div className="terminal-indicator"></div>
        <span className="customizer-title">Filter Settings</span>
      </div>
      
      <div className="customizer-body">
        <div className="filter-section">
          <label className="filter-label">Period</label>
          <CalendarFilter />
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Region</label>
          <RegionFilter />
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Chain</label>
          <HaFiFilter selectedHaFi={selectedHaFi} onHaFiChange={onHaFiChange} />
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Market</label>
          <MarketFilter selectedHaFi={selectedHaFi} />
        </div>
      </div>
    </div>
  )
}

