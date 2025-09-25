import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

export interface MarketFilterProps {
  selectedHaFi: string
}

export default function MarketFilter({ selectedHaFi }: MarketFilterProps) {
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

  // Reset market selection when HaFi changes
  useEffect(() => {
    setSelectedMarket('Alle')
  }, [selectedHaFi])

  const allMarkets = {
    'Alle': ['Alle'],
    'BILLA': ['Alle', 'BILLA 1010', 'BILLA 1020', 'BILLA 1030', 'BILLA 1040', 'BILLA 1050', 'BILLA 1060', 'BILLA 1070', 'BILLA 1080', 'BILLA 1090', 'BILLA 1100'],
    'BILLA Plus': ['Alle', 'BILLA Plus 1110', 'BILLA Plus 1120', 'BILLA Plus 1130', 'BILLA Plus 1140', 'BILLA Plus 1150', 'BILLA Plus 1160', 'BILLA Plus 1170', 'BILLA Plus 1180', 'BILLA Plus 1190', 'BILLA Plus 1200'],
    'Spar': ['Alle', 'Spar 1210', 'Spar 1220', 'Spar 1230', 'Spar 2100', 'Spar 2110', 'Spar 2120', 'Spar 2130', 'Spar 2140', 'Spar 2150', 'Spar 2160'],
    'Eurospar': ['Alle', 'Eurospar 2170', 'Eurospar 2180', 'Eurospar 2190', 'Eurospar 2200', 'Eurospar 2210', 'Eurospar 2220', 'Eurospar 2230', 'Eurospar 2240', 'Eurospar 2250', 'Eurospar 2260'],
    'Interspar': ['Alle', 'Interspar 3100', 'Interspar 3110', 'Interspar 3120', 'Interspar 3130', 'Interspar 3140', 'Interspar 3150', 'Interspar 3160', 'Interspar 3170', 'Interspar 3180', 'Interspar 3190'],
    'Maxi Markt': ['Alle', 'Maxi Markt 4010', 'Maxi Markt 4020', 'Maxi Markt 4030', 'Maxi Markt 4040', 'Maxi Markt 4050', 'Maxi Markt 4060', 'Maxi Markt 4070', 'Maxi Markt 4080', 'Maxi Markt 4090', 'Maxi Markt 4100'],
    'ADEG': ['Alle', 'ADEG 5010', 'ADEG 5020', 'ADEG 5030', 'ADEG 5040', 'ADEG 5050', 'ADEG 5060', 'ADEG 5070', 'ADEG 5080', 'ADEG 5090', 'ADEG 6010']
  }

  const markets = selectedHaFi === 'Alle' 
    ? [
        'Alle',
        ...allMarkets['BILLA'].slice(1),
        ...allMarkets['BILLA Plus'].slice(1), 
        ...allMarkets['Spar'].slice(1),
        ...allMarkets['Eurospar'].slice(1),
        ...allMarkets['Interspar'].slice(1),
        ...allMarkets['Maxi Markt'].slice(1),
        ...allMarkets['ADEG'].slice(1)
      ]
    : allMarkets[selectedHaFi as keyof typeof allMarkets] || ['Alle']

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market)
    setIsOpen(false)
  }

  return (
    <div className="market-filter">
            <button
              ref={buttonRef}
              className={`market-button ${selectedMarket !== 'Alle' ? 'has-custom-selection' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
        <svg className="market-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M2 5v12h16V5H2zm2 2h12v8H4V7zm1 2v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2zM5 13v2h2v-2H5zm4 0v2h2v-2H9zm4 0v2h2v-2h-2zM3 3h14v2H3V3z" fill="currentColor"/>
        </svg>
        <span className="market-text">{selectedMarket}</span>
        <svg className={`market-arrow ${isOpen ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="market-dropdown">
        <div ref={dropdownRef}>
          {markets.map((market) => (
            <button
              key={market}
              className={`market-option ${selectedMarket === market ? 'active' : ''}`}
              onClick={() => handleMarketSelect(market)}
            >
              {market}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  )
}
