import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'
import { gmData } from './GebietsmanagerGMFilter'

interface GebietsmanagerMarketFilterProps {
  selectedChain: string
  selectedGM: string
}

export default function GebietsmanagerMarketFilter({ selectedChain, selectedGM }: GebietsmanagerMarketFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState('Alle')
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

  // Market structure based on chains and regions like shelf merchandising
  const allMarkets = {
    'Alle': ['Alle'],
    'BILLA': ['Alle', 'BILLA Wien 1010', 'BILLA Wien 1020', 'BILLA Graz 8010', 'BILLA Linz 4020', 'BILLA Salzburg 5020', 'BILLA Innsbruck 6020'],
    'BILLA Plus': ['Alle', 'BILLA Plus Wien 1030', 'BILLA Plus Wien 1040', 'BILLA Plus Graz 8020', 'BILLA Plus Linz 4030', 'BILLA Plus Salzburg 5030'],
    'Spar': ['Alle', 'Spar Wien 1050', 'Spar Graz 8030', 'Spar Linz 4040', 'Spar Salzburg 5040', 'Spar Innsbruck 6030'],
    'Eurospar': ['Alle', 'Eurospar Wien 1060', 'Eurospar Graz 8040', 'Eurospar Linz 4050', 'Eurospar Salzburg 5050', 'Eurospar Innsbruck 6040'],
    'Interspar': ['Alle', 'Interspar Wien 1070', 'Interspar Graz 8050', 'Interspar Linz 4060'],
    'Maxi Markt': ['Alle', 'Maxi Markt Wien 1080', 'Maxi Markt Graz 8060', 'Maxi Markt Linz 4070'],
    'ADEG': ['Alle', 'ADEG Wien 1090', 'ADEG Salzburg 5060', 'ADEG Innsbruck 6050']
  }

  // Get markets based on GM regions and selected chain
  const getMarkets = () => {
    if (selectedGM === 'Alle' && selectedChain === 'Alle') {
      return [
        'Alle',
        ...allMarkets['BILLA'].slice(1),
        ...allMarkets['BILLA Plus'].slice(1),
        ...allMarkets['Spar'].slice(1),
        ...allMarkets['Eurospar'].slice(1),
        ...allMarkets['Interspar'].slice(1),
        ...allMarkets['Maxi Markt'].slice(1),
        ...allMarkets['ADEG'].slice(1)
      ]
    }

    if (selectedChain === 'Alle') {
      // Get all markets for GM's regions
      const gm = gmData.find(g => g.name === selectedGM)
      if (gm && gm.regions.length > 0) {
        const regionBasedMarkets = ['Alle']
        gm.regions.forEach(region => {
          Object.values(allMarkets).forEach(marketList => {
            marketList.slice(1).forEach(market => {
              if (market.includes(getRegionCity(region))) {
                regionBasedMarkets.push(market)
              }
            })
          })
        })
        return regionBasedMarkets
      }
      return ['Alle']
    }

    // Get markets for specific chain
    const chainMarkets = allMarkets[selectedChain as keyof typeof allMarkets] || ['Alle']
    
    // Filter by GM regions if GM is selected
    if (selectedGM !== 'Alle') {
      const gm = gmData.find(g => g.name === selectedGM)
      if (gm && gm.regions.length > 0) {
        return ['Alle', ...chainMarkets.slice(1).filter(market => 
          gm.regions.some(region => market.includes(getRegionCity(region)))
        )]
      }
    }
    
    return chainMarkets
  }

  // Helper function to map regions to cities
  const getRegionCity = (region: string) => {
    switch(region) {
      case 'Nord': return 'Wien'
      case 'Süd': return 'Graz'
      case 'Ost': return 'Linz'
      case 'West': return 'Salzburg'
      default: return 'Wien'
    }
  }

  const markets = getMarkets()

  // Reset selection if current selection is not available
  useEffect(() => {
    if (!markets.includes(selectedMarket)) {
      setSelectedMarket('Alle')
    }
  }, [selectedChain, selectedGM, markets, selectedMarket])

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market)
    setIsOpen(false)
  }

  return (
    <div className="gm-market-filter">
      <button
        ref={buttonRef}
        className={`gm-market-button ${selectedMarket !== 'Alle' ? 'has-custom-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="gm-button-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M2 5v12h16V5H2zm2 2h12v8H4V7zm1 2v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2zM5 13v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2zM3 3h14v2H3V3z" fill="currentColor"/>
        </svg>
        <span className="gm-button-text">{selectedMarket}</span>
        <svg className={`gm-button-arrow ${isOpen ? 'open' : ''}`} width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetRef={buttonRef as React.RefObject<HTMLElement>} isOpen={isOpen} className="gm-dropdown">
        <div ref={dropdownRef}>
          <div className="gm-dropdown-list">
            {markets.map(market => (
              <button
                key={market}
                className={`gm-dropdown-item ${selectedMarket === market ? 'active' : ''}`}
                onClick={() => handleMarketSelect(market)}
              >
                {market}
              </button>
            ))}
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}
