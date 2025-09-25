import { useState, useEffect, useRef } from 'react'
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
    schuette: Math.floor(Math.random() * 40) + 60,
    display: Math.floor(Math.random() * 30) + 70,
    platzierungOhneMaterial: Math.floor(Math.random() * 35) + 55,
    platzierungMitMaterial: Math.floor(Math.random() * 45) + 45,
    zweitplatzierungen: Math.floor(Math.random() * 50) + 50,
    e3: Math.floor(Math.random() * 30) + 40,
    grossplatzierungen: Math.floor(Math.random() * 40) + 60,
    permanentRags: Math.floor(Math.random() * 35) + 65,
    flexziel: Math.floor(Math.random() * 40) + 50
  }
}

// Generate random markets data
const generateMarketsData = () => {
  const markets = [
    'BILLA Wien Mitte', 'BILLA Plus Graz', 'Spar Innsbruck', 'Eurospar Salzburg',
    'Interspar Linz', 'ADEG Klagenfurt', 'Maxi Markt Eisenstadt', 'BILLA St. Pölten',
    'Spar Bregenz', 'BILLA Plus Villach', 'Interspar Wels', 'Eurospar Steyr'
  ]
  
  return markets.map(market => ({
    name: market,
    progress: Math.floor(Math.random() * 40) + 60
  }))
}

// Generate progressive weekly data for charts
const generateWeeklyProgress = () => {
  const currentWeek = Math.floor(Math.random() * 45) + 1
  const weeks: { week: string; value: number }[] = []
  let cumulative = 0
  
  for (let i = 4; i >= 0; i--) {
    const weekNum = currentWeek - i
    const added = i === 4 ? 0 : Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 2 : 0
    cumulative += added
    
    weeks.push({
      week: `KW${weekNum}`,
      value: cumulative
    })
  }
  
  return weeks
}

export default function GebietsmanagerDetailModal({ isOpen, onClose, gmData }: GebietsmanagerDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState<'goals' | 'markets'>('goals')
  const [goals] = useState(generateGoalsData())
  const [markets] = useState(generateMarketsData())
  const [praemie] = useState(Math.floor(Math.random() * 700) + 300)
  const [zugeteilteMarkte] = useState(Math.floor(Math.random() * 40) + 40)
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null)
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

  if (!isOpen || !gmData) return null

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

  const goalItems = [
    { label: 'Schütte', value: goals.schuette },
    { label: 'Display', value: goals.display },
    { label: 'Platzierung ohne Material', value: goals.platzierungOhneMaterial },
    { label: 'Platzierung mit Material', value: goals.platzierungMitMaterial },
    { label: 'Zweitplatzierungen', value: goals.zweitplatzierungen },
    { label: 'E3', value: goals.e3 },
    { label: 'Großplatzierungen', value: goals.grossplatzierungen },
    { label: 'Permanent Rags', value: goals.permanentRags },
    { label: 'Flexziel', value: goals.flexziel }
  ]

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
          width: '400px',
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: 'rgba(51, 51, 51, 0.9)',
                marginBottom: '4px'
              }}>
                {gmData.name}
              </h2>
              <div style={{
                fontSize: '12px',
                color: 'rgba(51, 51, 51, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                {gmData.regions.join(', ')}
              </div>
            </div>
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

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(40, 167, 69, 0.08)',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#28a745', marginBottom: '2px' }}>{gmData.ipp.toFixed(1)}</div>
              <div style={{ fontSize: '10px', color: 'rgba(51, 51, 51, 0.6)' }}>IPP</div>
            </div>
            <div style={{
              background: 'rgba(0, 123, 255, 0.08)',
              border: '1px solid rgba(0, 123, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#007bff', marginBottom: '2px' }}>{praemie}€</div>
              <div style={{ fontSize: '10px', color: 'rgba(51, 51, 51, 0.6)' }}>Prämie</div>
            </div>
            <div style={{
              background: 'rgba(108, 117, 125, 0.08)',
              border: '1px solid rgba(108, 117, 125, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#6c757d', marginBottom: '2px' }}>{zugeteilteMarkte}</div>
              <div style={{ fontSize: '10px', color: 'rgba(51, 51, 51, 0.6)' }}>Märkte</div>
            </div>
          </div>

          {/* Main Progress Bars */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            {/* Personal Goals */}
            <div style={{ marginBottom: '14px' }}>
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
                  Persönliche Ziele
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: getGoalColor(gmData.personalGoals)
                }}>
                  {gmData.personalGoals}%
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${gmData.personalGoals}%`,
                  height: '100%',
                  background: getGoalGradient(gmData.personalGoals),
                  borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>

            {/* Kühlerinventur */}
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
                  color: 'rgba(51, 51, 51, 0.8)'
                }}>
                  {gmData.kuehl}/50
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(gmData.kuehl / 50) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #f0c000 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div style={{
          display: 'flex',
          padding: '0 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'rgba(0, 0, 0, 0.01)'
        }}>
          {(['goals', 'markets'] as const).map((tab) => (
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
              {tab === 'goals' ? 'Meine Ziele' : 'Meine Märkte'}
              {selectedTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: '#28a745',
                  borderRadius: '2px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        } as any}>
          {selectedTab === 'goals' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {goalItems.map((goal, index) => {
                const isExpanded = expandedGoal === index
                const weeklyData = generateWeeklyProgress()
                const maxValue = Math.max(...weeklyData.map(w => w.value))
                
                return (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '10px',
                      padding: '14px',
                      height: isExpanded ? '240px' : '52px',
                      transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedGoal(null)
                      } else {
                        setExpandedGoal(index)
                      }
                    }}
                  >
                    {/* Progress Bar Content */}
                    <div style={{
                      opacity: isExpanded ? 0 : 1,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: isExpanded ? 'none' : 'auto'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {goal.label}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: getGoalColor(goal.value)
                        }}>
                          {goal.value}%
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${goal.value}%`,
                          height: '100%',
                          background: getGoalGradient(goal.value),
                          borderRadius: '3px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>

                    {/* Chart Content */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: '14px',
                      opacity: isExpanded ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      transitionDelay: '0.4s',
                      display: 'flex',
                      flexDirection: 'column',
                      pointerEvents: isExpanded ? 'auto' : 'none'
                    }}>
                      {/* Chart Title */}
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'rgba(51, 51, 51, 0.8)',
                        marginBottom: '12px'
                      }}>
                        {goal.label} - Progressiv
                      </div>

                      {/* Simple Line Chart */}
                      <div style={{ flex: 1, position: 'relative' }}>
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 320 150"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Grid Lines */}
                          {[0, 1, 2, 3, 4].map(i => (
                            <line
                              key={i}
                              x1={20}
                              y1={i * 26 + 20}
                              x2={300}
                              y2={i * 26 + 20}
                              stroke="rgba(0, 0, 0, 0.04)"
                              strokeWidth="1"
                            />
                          ))}

                          {/* Line */}
                          <path
                            d={weeklyData.map((d, i) => {
                              const x = 20 + (i / 4) * 280
                              const y = 120 - (d.value / maxValue) * 80
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
                            }).join(' ')}
                            fill="none"
                            stroke="#28a745"
                            strokeWidth="2"
                          />

                          {/* Dots */}
                          {weeklyData.map((d, i) => {
                            const x = 20 + (i / 4) * 280
                            const y = 120 - (d.value / maxValue) * 80
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#28a745"
                              />
                            )
                          })}

                          {/* Value Labels */}
                          {weeklyData.map((d, i) => {
                            const x = 20 + (i / 4) * 280
                            const y = 120 - (d.value / maxValue) * 80
                            return (
                              <text
                                key={i}
                                x={x}
                                y={y - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fill="rgba(51, 51, 51, 0.7)"
                              >
                                {d.value}
                              </text>
                            )
                          })}
                        </svg>

                        {/* Week Labels */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingTop: '8px'
                        }}>
                          {weeklyData.map((d, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '10px',
                                color: 'rgba(51, 51, 51, 0.6)',
                                fontWeight: '500'
                              }}
                            >
                              {d.week}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {markets.map((market, index) => (
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'rgba(51, 51, 51, 0.8)'
                    }}>
                      {market.name}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getGoalColor(market.progress)
                    }}>
                      {market.progress}%
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${market.progress}%`,
                      height: '100%',
                      background: getGoalGradient(market.progress),
                      borderRadius: '3px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
