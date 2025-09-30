import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

// GM data with their regions and markets - using real GL names from cards
export const gmData = [
  { name: 'Alle', regions: [], markets: [] },
  { name: 'Christoph Leitner', regions: ['Nord'], markets: ['BILLA', 'BILLA Plus'] },
  { name: 'Christoph Zauner', regions: ['Nord'], markets: ['Spar', 'Eurospar'] },
  { name: 'Irene Traxler', regions: ['Nord'], markets: ['Interspar', 'ADEG'] },
  { name: 'Doris Stockinger', regions: ['Ost'], markets: ['BILLA', 'Spar'] },
  { name: 'Rainer Perzl', regions: ['Ost'], markets: ['BILLA Plus', 'Eurospar'] },
  { name: 'Georg Stockreiter', regions: ['Ost'], markets: ['Interspar', 'Maxi Markt'] },
  { name: 'Arthur Neuhold', regions: ['Ost'], markets: ['ADEG', 'Spar'] },
  { name: 'Alexander Felsberger', regions: ['Süd'], markets: ['BILLA', 'BILLA Plus'] },
  { name: 'Mario Riedenbauer', regions: ['Süd'], markets: ['Spar', 'Eurospar'] },
  { name: 'Michael Wilhelmi', regions: ['Süd'], markets: ['Interspar', 'ADEG'] },
  { name: 'Eva Zausinger', regions: ['Süd'], markets: ['Maxi Markt', 'BILLA'] },
  { name: 'Thomas Nobis', regions: ['West'], markets: ['BILLA', 'BILLA Plus'] },
  { name: 'Josef Schellhorn', regions: ['West'], markets: ['Spar', 'Eurospar'] },
  { name: 'Benjamin Spiegel', regions: ['West'], markets: ['Interspar', 'ADEG'] }
]

interface GebietsmanagerGMFilterProps {
  selectedGM: string
  onGMChange: (gm: string) => void
}

export default function GebietsmanagerGMFilter({ selectedGM, onGMChange }: GebietsmanagerGMFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const gms = gmData.map(gm => gm.name)

  const handleGMSelect = (gm: string) => {
    onGMChange(gm)
    setIsOpen(false)
  }

  // Truncate long names for display
  const getDisplayName = (name: string) => {
    if (name.length > 12) {
      return name.substring(0, 11) + '...'
    }
    return name
  }

  return (
    <div className="gm-gm-filter">
      <button
        ref={buttonRef}
        className={`gm-gm-button ${selectedGM !== 'Alle' ? 'has-custom-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="gm-button-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M10 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>
        <span className="gm-button-text">{getDisplayName(selectedGM)}</span>
        <svg className={`gm-button-arrow ${isOpen ? 'open' : ''}`} width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="gm-dropdown">
        <div ref={dropdownRef}>
          <div className="gm-dropdown-list">
            {gms.map(gm => (
              <button
                key={gm}
                className={`gm-dropdown-item ${selectedGM === gm ? 'active' : ''}`}
                onClick={() => handleGMSelect(gm)}
              >
                {gm}
              </button>
            ))}
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}
