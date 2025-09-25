import { useState } from 'react'
import GebietsmanagerCalendarFilter from './GebietsmanagerCalendarFilter'
import GebietsmanagerGMFilter from './GebietsmanagerGMFilter'
import GebietsmanagerRegionFilter from './GebietsmanagerRegionFilter'
import GebietsmanagerChainFilter from './GebietsmanagerChainFilter'
import GebietsmanagerMarketFilter from './GebietsmanagerMarketFilter'

export default function GebietsmanagerFilter() {
  const [selectedGM, setSelectedGM] = useState('Alle')
  const [selectedChain, setSelectedChain] = useState('Alle')

  return (
    <div className="gebietsmanager-filter-container">
      <div className="gm-filter-header">
        <span className="gm-filter-title">Filter Settings</span>
        <div className="gm-terminal-indicator"></div>
      </div>
      <div className="gm-filter-body">
        <div className="gm-filter-section">
          <label className="gm-filter-label">Period</label>
          <GebietsmanagerCalendarFilter />
        </div>
        
        <div className="gm-filter-section">
          <label className="gm-filter-label">GM</label>
          <GebietsmanagerGMFilter selectedGM={selectedGM} onGMChange={setSelectedGM} />
        </div>
        
        <div className="gm-filter-section">
          <label className="gm-filter-label">Region</label>
          <GebietsmanagerRegionFilter selectedGM={selectedGM} />
        </div>
        
        <div className="gm-filter-section">
          <label className="gm-filter-label">Chain</label>
          <GebietsmanagerChainFilter 
            selectedChain={selectedChain} 
            onChainChange={setSelectedChain}
            selectedGM={selectedGM}
          />
        </div>
        
        <div className="gm-filter-section">
          <label className="gm-filter-label">Market</label>
          <GebietsmanagerMarketFilter selectedChain={selectedChain} selectedGM={selectedGM} />
        </div>
      </div>
    </div>
  )
}
