import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface GebietsmanagerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  gmData: {
    name: string
    regions: string[]
    ipp: number
    personalGoals: number
    kuehl: number
  } | null
}

// Generate random goals data
const generateGoalsData = () => {
  return {
    schuetteDisplays: Math.floor(Math.random() * 40) + 60,
    distributionsziel: Math.floor(Math.random() * 30) + 70,
    flexziel: Math.floor(Math.random() * 35) + 65,
    qualitaetsziele: Math.floor(Math.random() * 25) + 75
  }
}

// Generate random markets data
const generateMarketsData = () => {
  const markets = [
    'BILLA Wien Mitte', 'BILLA Plus Graz', 'Spar Innsbruck', 'Eurospar Salzburg',
    'Interspar Linz', 'ADEG Klagenfurt', 'Maxi Markt Eisenstadt', 'BILLA St. Pölten',
    'Merkur Wiener Neustadt', 'Hofer Villach', 'Lidl Steyr', 'Penny Wels'
  ]
  
  const weeks = []
  for (let week = 1; week <= 12; week++) {
    const weekMarkets = []
    const numMarkets = Math.floor(Math.random() * 4) + 2 // 2-5 markets per week
    
    for (let i = 0; i < numMarkets; i++) {
      const randomMarket = markets[Math.floor(Math.random() * markets.length)]
      const visits = Math.floor(Math.random() * 3) + 1 // 1-3 visits
      const oos = Math.floor(Math.random() * 2) // 0-1 OOS situations
      
      weekMarkets.push({
        name: randomMarket,
        visits,
        oos,
        date: `KW${week.toString().padStart(2, '0')}`
      })
    }
    
    weeks.push({
      week: `KW${week.toString().padStart(2, '0')}`,
      markets: weekMarkets,
      totalVisits: weekMarkets.reduce((sum, m) => sum + m.visits, 0),
      totalOOS: weekMarkets.reduce((sum, m) => sum + m.oos, 0)
    })
  }
  
  return weeks
}

export default function GebietsmanagerDetailModal({ isOpen, onClose, gmData }: GebietsmanagerDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState<'goals' | 'markets' | 'mhd'>('goals')
  const [goals] = useState(generateGoalsData())
  const [markets] = useState(generateMarketsData())
  const bonusAverage = Math.round((goals.schuetteDisplays + goals.distributionsziel + goals.flexziel + goals.qualitaetsziele) / 4)
  const praemie = Math.round((bonusAverage / 100) * 1050)
  const [mhdData] = useState(() => Array.from({ length: 7 }, (_, i) => ({
    label: `MHD ${i + 1}`,
    value: Math.floor(Math.random() * 40) + 60
  })))
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen || !gmData) return null

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
    if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
    return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
  }

  const goalItems = [
    { label: 'Schütten/Displays', value: goals.schuetteDisplays },
    { label: 'Distributionsziel', value: goals.distributionsziel },
    { label: 'Flexziel', value: goals.flexziel },
    { label: 'Qualitätsziele', value: goals.qualitaetsziele }
  ]

  return createPortal(
    <>
      <style>{`
        .modal-tab-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}>
      <div 
        ref={modalRef}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '98vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            color: 'rgba(51, 51, 51, 0.6)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
              <h2 style={{
                fontSize: '20px',
            fontWeight: '700',
                color: 'rgba(51, 51, 51, 0.9)',
            margin: '0 0 4px 0'
              }}>
                {gmData.name}
              </h2>
              <div style={{
                fontSize: '12px',
            color: 'rgba(51, 51, 51, 0.5)',
            fontWeight: '500',
                textTransform: 'uppercase',
            letterSpacing: '0.5px'
              }}>
                {gmData.regions.join(', ')}
              </div>
          </div>

        {/* Stats Row */}
        <div className="modal-stats-container" style={{ margin: '20px 20px 0 20px' }}>
          <div className="stat-item" style={{ 
            background: 'rgba(16, 185, 129, 0.08)',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
          }}>
            <div className="stat-value" style={{ color: '#10b981' }}>{gmData.ipp}</div>
            <div className="stat-label" style={{ color: '#10b981' }}>IPP</div>
          </div>
          <div className="stat-item" style={{ 
            background: 'rgba(0, 123, 255, 0.08)',
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)'
          }}>
            <div className="stat-value" style={{ color: '#007bff' }}>{praemie}€</div>
            <div className="stat-label" style={{ color: '#007bff' }}>
              Prämie <span style={{ fontSize: '7px', opacity: '0.6' }}>QTD</span>
            </div>
          </div>
          <div className="stat-item" style={{ 
            background: 'rgba(108, 117, 125, 0.08)',
            border: '2px solid #6c757d',
            borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(108, 117, 125, 0.15)'
          }}>
            <div className="stat-value" style={{ color: '#6c757d' }}>34/70</div>
            <div className="stat-label" style={{ color: '#6c757d' }}>
              Märkte <span style={{ fontSize: '7px', opacity: '0.6' }}>QTD</span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div style={{ padding: '16px 24px' }}>
            {/* Personal Goals */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                PERSÖNLICHE BONI ZIELE
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#28a745' }}>
                  {bonusAverage}%
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${bonusAverage}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)',
                borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Kühlerinventur */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                KÜHLERINVENTUR
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffc107' }}>
                  60/120
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                width: `${Math.min((60 / 120) * 100, 100)}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #ffe4a3 0%, #ffc107 100%)',
                borderRadius: '4px'
                }} />
            </div>
          </div>

            {/* MHD */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                MHD
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#007bff' }}>
                  {Math.round(mhdData.reduce((sum, item) => sum + item.value, 0) / mhdData.length)}%
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                width: `${Math.round(mhdData.reduce((sum, item) => sum + item.value, 0) / mhdData.length)}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #a3c7ff 0%, #007bff 100%)',
                borderRadius: '4px'
                }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'rgba(0, 0, 0, 0.01)'
        }}>
          {(['goals', 'mhd', 'markets'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: 'none',
                fontSize: '12px',
                fontWeight: selectedTab === tab ? '600' : '500',
                color: selectedTab === tab ? 'rgba(51, 51, 51, 0.9)' : 'rgba(51, 51, 51, 0.5)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              {tab === 'goals' ? 'Meine Bonus Ziele' : tab === 'markets' ? 'Meine Märkte' : 'MHD'}
              {selectedTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: '#dc2626',
                  borderRadius: '1px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modal-tab-content" style={{
          padding: '20px 24px',
          maxHeight: '350px',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {selectedTab === 'goals' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
              {goalItems.map((goal, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    marginBottom: '6px'
                      }}>
                        <span style={{
                      fontSize: '13px', 
                          fontWeight: '500',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {goal.label}
                        </span>
                        <span style={{
                      fontSize: '13px', 
                      fontWeight: '700',
                      color: goal.value >= 90 ? '#28a745' : goal.value >= 75 ? '#fd7e14' : '#dc3545'
                        }}>
                          {goal.value}%
                        </span>
                      </div>
                      <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${goal.value}%`,
                          height: '100%',
                      background: getProgressColor(goal.value),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
              ))}
            </div>
          ) : selectedTab === 'markets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {markets.slice(0, 8).map((week, index) => (
                <div key={index} style={{
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.01)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.8)' }}>
                      {week.week}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#007bff' }}>
                        {week.totalVisits} Besuche
                      </span>
                      <span style={{ fontSize: '11px', color: '#dc3545' }}>
                        {week.totalOOS} OOS
                    </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {week.markets.slice(0, 3).map((market, mIndex) => (
                      <div key={mIndex} style={{
                        fontSize: '11px',
                        color: 'rgba(51, 51, 51, 0.6)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>{market.name}</span>
                        <span>{market.visits}x Besuche</span>
                      </div>
                    ))}
                    {week.markets.length > 3 && (
                      <div style={{ fontSize: '10px', color: 'rgba(51, 51, 51, 0.4)' }}>
                        +{week.markets.length - 3} weitere Märkte
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '500px' }}>
              {mhdData.map((mhd, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    marginBottom: '6px'
                      }}>
                        <span style={{
                      fontSize: '13px', 
                          fontWeight: '500',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {mhd.label}
                        </span>
                        <span style={{
                      fontSize: '13px', 
                      fontWeight: '700',
                      color: mhd.value >= 90 ? '#28a745' : mhd.value >= 75 ? '#fd7e14' : '#dc3545'
                        }}>
                          {mhd.value}%
                        </span>
                      </div>
                      <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${mhd.value}%`,
                          height: '100%',
                      background: getProgressColor(mhd.value),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>,
    document.body
  )
}