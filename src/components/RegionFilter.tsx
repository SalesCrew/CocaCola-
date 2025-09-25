import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

export default function RegionFilter() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('Alle')
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

  const regions = ['Alle', 'Nord', 'Süd', 'Ost', 'West']

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    setIsOpen(false)
  }

  return (
    <div className="region-filter">
            <button
              ref={buttonRef}
              className={`region-button ${selectedRegion !== 'Alle' ? 'has-custom-selection' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
        <svg className="region-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" fill="currentColor"/>
        </svg>
        <span className="region-text">{selectedRegion}</span>
        <svg className={`region-arrow ${isOpen ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="region-dropdown">
        <div ref={dropdownRef}>
          {regions.map((region) => (
            <button
              key={region}
              className={`region-option ${selectedRegion === region ? 'active' : ''}`}
              onClick={() => handleRegionSelect(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  )
}


