import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gmData } from './GebietsmanagerGMFilter'

interface MarketDetailModalProps {
  isOpen: boolean
  onClose: () => void
  marketData: {
    name: string
    chain: string
    region: string
    ipp: number
    marktZiele: number
    kuehlInventur: number
    address: string
  } | null
}


// Find which GM manages this market
const findMarketGM = (marketName: string, marketChain: string) => {
  // Extract chain from market name if it contains chain info
  const chain = marketChain || marketName.split(' ')[0]
  
  // Find all GMs that manage this chain
  const gms = gmData.filter(gm => 
    gm.name !== 'Alle' && gm.markets.includes(chain)
  )
  
  // Return the first GM found (in real app, this would be more specific)
  return gms.length > 0 ? gms[0] : null
}

// Generate realistic visit dates based on frequency
const generateVisitDates = (frequency: number, glName: string) => {
  const visits = []
  const currentDate = new Date(2025, 8, 23) // September 23, 2025
  const daysPerVisit = Math.round(365 / frequency)
  
  // Generate last 5 visits working backwards  
  for (let i = 0; i < 5; i++) {
    const visitDate = new Date(currentDate)
    visitDate.setDate(currentDate.getDate() - (i * daysPerVisit))
    
    const dateStr = `${visitDate.getDate().toString().padStart(2, '0')}.${(visitDate.getMonth() + 1).toString().padStart(2, '0')}.${visitDate.getFullYear()}`
    
    // Deterministic but varied activity data
    const seed = visitDate.getTime() + glName.length
    const rand = (min: number, max: number) => min + (seed % (max - min + 1))
    
    visits.push({
      date: dateStr,
      gl: glName,
      anfahrtszeit: rand(15, 35),
      arbeitszeit: rand(35, 60),
      activities: {
        schuetten: rand(0, 3),
        displays: rand(0, 2),
        distributionsziel: rand(0, 2),
        flexziel: rand(0, 2)
      }
    })
  }
  
  return visits.reverse() // Show chronologically (oldest first)
}

export default function MarketDetailModal({ isOpen, onClose, marketData }: MarketDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !marketData) return null

  const getGoalColor = (percentage: number) => {
    if (percentage >= 90) return '#28a745'
    if (percentage >= 75) return '#fd7e14'
    return '#dc3545'
  }

  const getGoalGradient = (percentage: number) => {
    if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
    if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
    return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
  }


  const marketGM = findMarketGM(marketData.name, marketData.chain)

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div 
        ref={modalRef}
        style={{
          width: '450px',
          maxHeight: '85vh',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          {/* Title Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '600',
                color: 'rgba(51, 51, 51, 0.9)',
                marginBottom: '6px'
              }}>
                {marketData.name}
              </h2>
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(marketData.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: '#007bff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  padding: '2px 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0056b3'
                  e.currentTarget.style.transform = 'translateX(2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#007bff'
                  e.currentTarget.style.transform = 'translateX(0px)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                {marketData.address}
              </a>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: 'rgba(51, 51, 51, 0.4)',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)'
                e.currentTarget.style.color = 'rgba(51, 51, 51, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'rgba(51, 51, 51, 0.4)'
              }}
            >
              ×
            </button>
          </div>

          {/* Pills Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* GM Badge - Left (for Universumsmärkte) or Regular markets with GM */}
            {(marketData.kuehlInventur === null || (marketData.kuehlInventur !== null && marketGM)) && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(51, 51, 51, 0.05) 0%, rgba(51, 51, 51, 0.08) 100%)',
                border: '1px solid rgba(51, 51, 51, 0.15)',
                borderRadius: '10px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'rgba(51, 51, 51, 0.6)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  GM
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: 'rgba(51, 51, 51, 0.8)'
                }}>
                  {marketGM ? marketGM.name : 'Thomas Nobis'}
                </span>
              </div>
            )}

            {/* GM Badge - Not Assigned (only for regular markets) */}
            {marketData.kuehlInventur !== null && !marketGM && (
              <div style={{
                background: 'rgba(220, 53, 69, 0.08)',
                border: '1px solid rgba(220, 53, 69, 0.2)',
                borderRadius: '10px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'rgba(220, 53, 69, 0.8)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  GM
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#dc3545',
                  fontStyle: 'italic'
                }}>
                  Nicht zugeordnet
                </span>
              </div>
            )}

            {/* Frequency Badge - Only for Universumsmärkte */}
            {marketData.kuehlInventur === null && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(253, 126, 20, 0.08) 0%, rgba(253, 126, 20, 0.12) 100%)',
                border: '1px solid rgba(253, 126, 20, 0.25)',
                borderRadius: '10px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'rgba(253, 126, 20, 0.8)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Frequenz
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#fd7e14'
                }}>
                  {(() => {
                    // Use same frequency logic as einzelne besuche
                    const seed = (marketData.name + marketData.chain).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                    return [6, 8, 10, 12, 24][seed % 5]
                  })()}/Jahr
                </span>
              </div>
            )}

            {/* IPP Badge - Right for regular markets, Left for flex markets */}
            {marketData.ipp && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(40, 167, 69, 0.12) 100%)',
                border: '1px solid rgba(40, 167, 69, 0.25)',
                borderRadius: '10px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'rgba(40, 167, 69, 0.8)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  IPP
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#28a745'
                }}>
                  {marketData.ipp.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Market Info Container - Full Width */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: 'rgba(51, 51, 51, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '2px'
            }}>
              Markt Info
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(51, 51, 51, 0.8)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: '500' }}>Region:</span>
              <span style={{ fontWeight: '600' }}>{marketData.region}</span>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(51, 51, 51, 0.8)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: '500' }}>Kette:</span>
              <span style={{ fontWeight: '600' }}>{marketData.chain}</span>
            </div>
          </div>

          {/* Main Progress Bars */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            {/* Besuchsfrequenz / Marktbesuche YTD */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(51, 51, 51, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  {(marketData as any).isFlexMarket ? 'Marktbesuche YTD' : `Besuchsfrequenz ${marketGM ? marketGM.name : 'Thomas Nobis'}`}
                </span>
                {(marketData as any).isFlexMarket ? (
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#28a745',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                  }}>
                    {Math.floor(Math.random() * 21)}
                  </span>
                ) : (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: getGoalColor(marketData.marktZiele)
                  }}>
                    {marketData.marktZiele}%
                  </span>
                )}
              </div>
              {!(marketData as any).isFlexMarket && (
                <div style={{
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '6px'
                }}>
                  <div style={{
                    width: `${marketData.marktZiele}%`,
                    height: '100%',
                    background: getGoalGradient(marketData.marktZiele),
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              )}
            </div>

            {/* Kühlerinventur - Only for Flex markets */}
            {marketData.kuehlInventur !== null && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'rgba(51, 51, 51, 0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Kühlerinventur
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: marketData.kuehlInventur === 100 ? '#28a745' : '#dc3545'
                  }}>
                    {marketData.kuehlInventur === 100 ? 'Abgeschlossen' : 'Ausstehend'}
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${marketData.kuehlInventur}%`,
                    height: '100%',
                    background: marketData.kuehlInventur === 100 
                      ? 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
                      : 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Einzelne Besuche */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px 20px 32px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        } as any}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'rgba(51, 51, 51, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            Einzelne Besuche
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(() => {
              // Get consistent frequency for this market (deterministic)
              const seed = (marketData.name + marketData.chain).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
              const frequency = marketData.kuehlInventur === null 
                ? [6, 8, 10, 12, 24][seed % 5]  // Same deterministic frequency as badge
                : 12
              
              // Use the GM name from the GM pill, or Thomas Nobis as fallback
              const glName = marketGM ? marketGM.name : 'Thomas Nobis'
              
              return generateVisitDates(frequency, glName)
            })().map((visit, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: '10px',
                  padding: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'rgba(51, 51, 51, 0.9)',
                  marginBottom: '8px'
                }}>
                  Besuch {visit.date}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(51, 51, 51, 0.7)',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {visit.gl}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(51, 51, 51, 0.6)',
                  marginBottom: '8px',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <span>Anfahrtszeit {visit.anfahrtszeit}min</span>
                  <span>Arbeitszeit {visit.arbeitszeit}min</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {visit.activities.schuetten > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#28a745',
                      background: '#28a74515',
                      padding: '3px 6px',
                      borderRadius: '4px'
                    }}>
                      Schütten +{visit.activities.schuetten}
                    </span>
                  )}
                  {visit.activities.displays > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#007bff',
                      background: '#007bff15',
                      padding: '3px 6px',
                      borderRadius: '4px'
                    }}>
                      Displays +{visit.activities.displays}
                    </span>
                  )}
                  {visit.activities.distributionsziel > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#fd7e14',
                      background: '#fd7e1415',
                      padding: '3px 6px',
                      borderRadius: '4px'
                    }}>
                      Distributionsziel +{visit.activities.distributionsziel}
                    </span>
                  )}
                  {visit.activities.flexziel > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#6f42c1',
                      background: '#6f42c115',
                      padding: '3px 6px',
                      borderRadius: '4px'
                    }}>
                      Flexziel +{visit.activities.flexziel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
