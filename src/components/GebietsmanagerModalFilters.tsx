import GebietsmanagerCalendarFilter from './GebietsmanagerCalendarFilter'
import GebietsmanagerGMFilter from './GebietsmanagerGMFilter'
import GebietsmanagerRegionFilter from './GebietsmanagerRegionFilter'
import GebietsmanagerChainFilter from './GebietsmanagerChainFilter'
import GebietsmanagerMarketFilter from './GebietsmanagerMarketFilter'

interface GebietsmanagerModalFiltersProps {
  selectedGM: string
  onGMChange: (gm: string) => void
  selectedChain: string
  onChainChange: (chain: string) => void
}

export default function GebietsmanagerModalFilters({ selectedGM, onGMChange, selectedChain, onChainChange }: GebietsmanagerModalFiltersProps) {
  return (
    <div className="modal-filter-row">
      <div className="filter-flap">
        <div className="filter-flap-indicator"></div>
        <span className="filter-flap-text">Filter settings</span>
      </div>

      <GebietsmanagerCalendarFilter />
      <GebietsmanagerGMFilter selectedGM={selectedGM} onGMChange={onGMChange} />
      <GebietsmanagerRegionFilter selectedGM={selectedGM} />
      <GebietsmanagerChainFilter selectedChain={selectedChain} onChainChange={onChainChange} selectedGM={selectedGM} />
      <GebietsmanagerMarketFilter selectedChain={selectedChain} selectedGM={selectedGM} />
    </div>
  )
}


