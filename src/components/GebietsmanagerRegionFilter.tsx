import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'
import { gmData } from './GebietsmanagerGMFilter'

interface GebietsmanagerRegionFilterProps {
  selectedGM: string
}

export default function GebietsmanagerRegionFilter({ selectedGM }: GebietsmanagerRegionFilterProps) {
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

  // Get available regions based on selected GM
  const getAvailableRegions = () => {
    if (selectedGM === 'Alle') {
      return ['Alle', 'Nord', 'Süd', 'Ost', 'West']
    }
    
    const gm = gmData.find(g => g.name === selectedGM)
    if (gm && gm.regions.length > 0) {
      return ['Alle', ...gm.regions]
    }
    
    return ['Alle']
  }

  const regions = getAvailableRegions()

  // Reset selection if current selection is not available
  useEffect(() => {
    if (!regions.includes(selectedRegion)) {
      setSelectedRegion('Alle')
    }
  }, [selectedGM, regions, selectedRegion])

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    setIsOpen(false)
  }

  return (
    <div className="gm-region-filter">
      <button
        ref={buttonRef}
        className={`gm-region-button ${selectedRegion !== 'Alle' ? 'has-custom-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="gm-button-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" fill="currentColor"/>
        </svg>
        <span className="gm-button-text">{selectedRegion}</span>
        <svg className={`gm-button-arrow ${isOpen ? 'open' : ''}`} width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="gm-dropdown">
        <div ref={dropdownRef}>
          <div className="gm-dropdown-list">
            {regions.map(region => (
              <button
                key={region}
                className={`gm-dropdown-item ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => handleRegionSelect(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}
