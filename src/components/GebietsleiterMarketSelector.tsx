import { useMemo, useState } from 'react'

interface GebietsleiterMarketSelectorProps {
  selectedMarket: string
  onMarketSelect: (market: string) => void
}

export default function GebietsleiterMarketSelector({ selectedMarket, onMarketSelect }: GebietsleiterMarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const markets = useMemo(
    () => [
      'BILLA 1010',
      'BILLA Plus 1110',
      'Spar 1210',
      'Eurospar 2170',
      'Interspar 3100',
      'Maxi Markt 4010',
      'ADEG 5010'
    ],
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return markets
    return markets.filter((m) => m.toLowerCase().includes(q))
  }, [markets, query])

  return (
    <div className="gebietsleiter-market-selector">
      <div className="market-selector-header">
        <div className="market-selector-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 5h18M8 5v14m8-14v14M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Markt auswählen
        </div>
      </div>

      <button
        type="button"
        className={`market-selector-button ${selectedMarket ? 'has-selection' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="market-selector-content">
          <span className="market-selector-text">{selectedMarket || 'Bitte auswählen'}</span>
          <svg className={`market-selector-arrow ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="market-selector-dropdown">
          <div className="market-search-container">
            <svg className="market-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              className="market-search-input"
              placeholder="Suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="market-options-container">
            {filtered.length === 0 && (
              <div className="no-markets-found">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Keine Märkte gefunden</span>
              </div>
            )}
            {filtered.map((market) => (
              <button
                key={market}
                type="button"
                className={`market-option ${selectedMarket === market ? 'selected' : ''}`}
                onClick={() => {
                  onMarketSelect(market)
                  setIsOpen(false)
                }}
              >
                <div className="market-option-content">
                  <span className="market-name">{market}</span>
                  {selectedMarket === market && (
                    <svg className="market-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


