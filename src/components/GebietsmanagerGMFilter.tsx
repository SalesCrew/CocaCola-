import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

// GM data with their regions and markets - moved outside component for export
export const gmData = [
  { name: 'Alle', regions: [], markets: [] },
  { name: 'Thomas Müller', regions: ['Nord'], markets: ['BILLA', 'BILLA Plus'] },
  { name: 'Anna Schmidt', regions: ['Nord', 'Ost'], markets: ['Spar', 'Eurospar'] },
  { name: 'Michael Wagner', regions: ['Süd'], markets: ['Interspar', 'Maxi Markt'] },
  { name: 'Julia Fischer', regions: ['West'], markets: ['BILLA', 'ADEG'] },
  { name: 'Stefan Bauer', regions: ['Ost'], markets: ['Spar', 'BILLA Plus'] },
  { name: 'Maria Weber', regions: ['Nord', 'West'], markets: ['Eurospar', 'Interspar'] },
  { name: 'Christian Meyer', regions: ['Süd', 'Ost'], markets: ['ADEG', 'Maxi Markt'] },
  { name: 'Sandra Huber', regions: ['West'], markets: ['BILLA', 'Spar'] },
  { name: 'Martin Gruber', regions: ['Nord'], markets: ['Interspar', 'BILLA Plus'] },
  { name: 'Lisa Zimmermann', regions: ['Süd', 'West'], markets: ['Eurospar', 'ADEG'] },
  { name: 'Daniel Hoffmann', regions: ['Ost'], markets: ['Maxi Markt', 'Spar'] },
  { name: 'Eva Schwarz', regions: ['Nord', 'Süd'], markets: ['BILLA', 'Interspar'] },
  { name: 'Robert König', regions: ['West', 'Ost'], markets: ['BILLA Plus', 'Eurospar'] },
  { name: 'Nina Braun', regions: ['Süd'], markets: ['ADEG', 'Spar'] }
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
