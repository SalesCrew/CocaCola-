import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

export interface HaFiFilterProps {
  selectedHaFi: string
  onHaFiChange: (hafi: string) => void
}

export default function HaFiFilter({ selectedHaFi, onHaFiChange }: HaFiFilterProps) {
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

  const hafis = ['Alle', 'BILLA', 'BILLA Plus', 'Spar', 'Eurospar', 'Interspar', 'Maxi Markt', 'ADEG']

  const handleHaFiSelect = (hafi: string) => {
    onHaFiChange(hafi)
    setIsOpen(false)
  }

  return (
    <div className="hafi-filter">
            <button
              ref={buttonRef}
              className={`hafi-button ${selectedHaFi !== 'Alle' ? 'has-custom-selection' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
        <svg className="hafi-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M3 4h14v2H3zM3 8h14v2H3zM3 12h14v2H3zM3 16h14v2H3z" fill="currentColor"/>
        </svg>
        <span className="hafi-text">{selectedHaFi}</span>
        <svg className={`hafi-arrow ${isOpen ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="hafi-dropdown">
        <div ref={dropdownRef}>
          {hafis.map((hafi) => (
            <button
              key={hafi}
              className={`hafi-option ${selectedHaFi === hafi ? 'active' : ''}`}
              onClick={() => handleHaFiSelect(hafi)}
            >
              {hafi}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  )
}
