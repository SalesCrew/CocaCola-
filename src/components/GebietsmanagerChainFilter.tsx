import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'
import { gmData } from './GebietsmanagerGMFilter'

interface GebietsmanagerChainFilterProps {
  selectedChain: string
  onChainChange: (chain: string) => void
  selectedGM: string
}

export default function GebietsmanagerChainFilter({ selectedChain, onChainChange, selectedGM }: GebietsmanagerChainFilterProps) {
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

  // Get available chains based on selected GM
  const getAvailableChains = () => {
    if (selectedGM === 'Alle') {
      return ['Alle', 'BILLA', 'BILLA Plus', 'Spar', 'Eurospar', 'Interspar', 'Maxi Markt', 'ADEG']
    }
    
    const gm = gmData.find(g => g.name === selectedGM)
    if (gm && gm.markets.length > 0) {
      return ['Alle', ...gm.markets]
    }
    
    return ['Alle']
  }

  const chains = getAvailableChains()

  // Reset selection if current selection is not available
  useEffect(() => {
    if (!chains.includes(selectedChain)) {
      onChainChange('Alle')
    }
  }, [selectedGM, chains, selectedChain, onChainChange])

  const handleChainSelect = (chain: string) => {
    onChainChange(chain)
    setIsOpen(false)
  }

  return (
    <div className="gm-chain-filter">
      <button
        ref={buttonRef}
        className={`gm-chain-button ${selectedChain !== 'Alle' ? 'has-custom-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="gm-button-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M3 4h14v2H3zM3 8h14v2H3zM3 12h14v2H3zM3 16h14v2H3z" fill="currentColor"/>
        </svg>
        <span className="gm-button-text">{selectedChain}</span>
        <svg className={`gm-button-arrow ${isOpen ? 'open' : ''}`} width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="gm-dropdown">
        <div ref={dropdownRef}>
          <div className="gm-dropdown-list">
            {chains.map(chain => (
              <button
                key={chain}
                className={`gm-dropdown-item ${selectedChain === chain ? 'active' : ''}`}
                onClick={() => handleChainSelect(chain)}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}
