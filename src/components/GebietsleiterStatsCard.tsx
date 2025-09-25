import { useState } from 'react'

interface GebietsleiterStatsCardProps {
  data: {
    name: string
    region: string
    ipp: number
    personalGoals: number
    kuehlInventuren: { completed: number; total: number }
    q3Einsaetze: { completed: number; total: number }
    currentQuarter: string
  }
}

export default function GebietsleiterStatsCard({ data }: GebietsleiterStatsCardProps) {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [isIPPModalOpen, setIsIPPModalOpen] = useState(false)
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'excellent'
    if (percentage >= 85) return 'good'
    if (percentage >= 70) return 'warning'
    return 'critical'
  }

  const kuehlPercentage = Math.min((data.kuehlInventuren.completed / data.kuehlInventuren.total) * 100, 100)
  const einsaetzePercentage = (data.q3Einsaetze.completed / data.q3Einsaetze.total) * 100

  // Premium data that adds up mathematically - around 1000€ per Q with 90-100% rates
  const premiumData = {
    q1: { earned: 950, target: 1000, percentage: 95.0 },
    q2: { earned: 920, target: 1000, percentage: 92.0 },
    q3: { earned: 870, target: 1000, percentage: 87.0 }, // current quarter
    q4: { earned: 980, target: 1000, percentage: 98.0 },
    q5: { earned: 940, target: 1000, percentage: 94.0 },
    q6: { earned: 0, target: 1000, percentage: 0 }, // future quarter
  }
  
  const totalEarned = premiumData.q1.earned + premiumData.q2.earned + premiumData.q3.earned + premiumData.q4.earned + premiumData.q5.earned + premiumData.q6.earned
  // const totalTarget = premiumData.q1.target + premiumData.q2.target + premiumData.q3.target + premiumData.q4.target + premiumData.q5.target + premiumData.q6.target
  
  // Calculate average percentage from completed quarters only
  const completedQuarters = [premiumData.q1, premiumData.q2, premiumData.q3, premiumData.q4, premiumData.q5].filter(q => q.earned > 0)
  const averagePercentage = completedQuarters.reduce((sum, q) => sum + q.percentage, 0) / completedQuarters.length

  // IPP data for monthly tracking with percentage changes and Einsätze breakdown
  const ippData = {
    jan: { ipp: 4.8, change: 0, standardbesuche: 85, flexbesuche: 32, kuhlerinventuren: 8 }, // total: 125
    feb: { ipp: 5.1, change: 6.3, standardbesuche: 92, flexbesuche: 28, kuhlerinventuren: 12 }, // total: 132
    mar: { ipp: 5.3, change: 3.9, standardbesuche: 88, flexbesuche: 35, kuhlerinventuren: 9 }, // total: 132
    apr: { ipp: 5.0, change: -5.7, standardbesuche: 78, flexbesuche: 25, kuhlerinventuren: 7 }, // total: 110
    may: { ipp: 5.4, change: 8.0, standardbesuche: 95, flexbesuche: 38, kuhlerinventuren: 15 }, // total: 148
    jun: { ipp: 5.6, change: 3.7, standardbesuche: 102, flexbesuche: 42, kuhlerinventuren: 18 }, // total: 162 (current month)
    jul: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
    aug: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
    sep: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
    oct: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
    nov: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
    dec: { ipp: 0, change: 0, standardbesuche: 0, flexbesuche: 0, kuhlerinventuren: 0 }, // future month
  }
  
  const completedMonths = Object.values(ippData).filter(m => m.ipp > 0)
  const averageIPP = completedMonths.reduce((sum, m) => sum + m.ipp, 0) / completedMonths.length

  return (
    <>
      <div className="gebietsleiter-stats-card">
        <div className="stats-card-header">
          <h2 className="stats-card-title">Meine Leistung</h2>
          <div className="stats-card-period">{data.currentQuarter}</div>
        </div>
        
        <div className="stats-grid">
          {/* IPP and Premium Row */}
          <div className="top-stats-row">
            {/* IPP Stat */}
            <div 
              className="stat-item ipp-stat"
              onClick={() => setIsIPPModalOpen(true)}
            >
              <div className="stat-content">
                <div className="stat-value">{data.ipp.toFixed(1)}</div>
                <div className="stat-label">IPP</div>
              </div>
            </div>

            {/* Premium Stat - Clickable */}
            <div 
              className="stat-item premium-stat" 
              onClick={() => setIsPremiumModalOpen(true)}
            >
              <div className="premium-content">
                <div className="premium-numbers">
                  <div className="premium-current">870</div>
                  <div className="premium-separator">/</div>
                  <div className="premium-target">1000</div>
                  <div className="premium-currency">€</div>
                </div>
                <div className="premium-label">Prämie erreicht</div>
                <div className="premium-progress-mini">
                  <div className="premium-progress-track">
                    <div className="premium-progress-fill" style={{ width: '87%' }}></div>
                  </div>
                  <div className="premium-percentage">87%</div>
                </div>
              </div>
            </div>
          </div>

          {/* All Progress Bars in One Container */}
          <div className="all-progress-container">
          {/* Personal Goals */}
          <div className="stat-item goals-stat">
            <div className="stat-header">
              <div className="stat-label-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Persönliche Ziele</span>
              </div>
              <div className="stat-percentage">{data.personalGoals}%</div>
            </div>
            <div className="progress-bar">
              <div className="progress-track">
                <div 
                  className={`progress-fill ${getProgressColor(data.personalGoals)}`}
                  style={{ width: `${data.personalGoals}%` }}
                />
              </div>
            </div>
          </div>

          {/* Q3 Einsätze */}
          <div className="stat-item missions-stat">
            <div className="stat-header">
              <div className="stat-label-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Q3 Einsätze</span>
              </div>
              <div className="stat-fraction">
                {data.q3Einsaetze.completed}/{data.q3Einsaetze.total}
              </div>
            </div>
              <div className="progress-bar">
              <div className="progress-track">
                <div 
                  className={`progress-fill warning`}
                  style={{ width: `${Math.min(einsaetzePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Kühlinventuren - Last Position */}
          <div className="stat-item inventory-stat">
            <div className="stat-header">
              <div className="stat-label-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 11l-5-3-5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Kühlerinventuren</span>
              </div>
              <div className="stat-fraction">
                {data.kuehlInventuren.completed}/{data.kuehlInventuren.total}
              </div>
            </div>
            <div className="progress-bar kuhl-bar">
              <div className="progress-track">
                <div 
                  className="progress-fill kuhl-fill"
                  style={{ width: `${kuehlPercentage}%` }}
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {isPremiumModalOpen && (
        <div className="premium-modal-overlay" onClick={() => setIsPremiumModalOpen(false)}>
          <div className="premium-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="premium-modal-close" onClick={() => setIsPremiumModalOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="premium-modal-header">
              <div className="premium-header-content">
                <h2 className="premium-modal-title">Deine Prämien</h2>
                <div className="premium-total-section">
                  <div className="total-amount">{totalEarned.toLocaleString()}€</div>
                  <div className="total-badge">{averagePercentage.toFixed(1)}% erreicht</div>
                </div>
              </div>
            </div>
            
            <div className="premium-quarters-container">
              {([
                ['q3', premiumData.q3] as const,
                ['q2', premiumData.q2] as const, 
                ['q1', premiumData.q1] as const,
                ['q4', premiumData.q4] as const,
                ['q5', premiumData.q5] as const,
                ['q6', premiumData.q6] as const
              ]).map(([quarter, qdata]) => {
                const isCompleted = quarter === 'q1' || quarter === 'q2' || quarter === 'q4' || quarter === 'q5'
                const isCurrent = quarter === 'q3'
                const isFuture = quarter === 'q6'
                
                return (
                  <div key={quarter} className={`quarter-card ${isCurrent ? 'current' : isFuture ? 'future' : 'completed'}`}>
                    <div className="quarter-header">
                      <div className="quarter-name">{`${quarter.toUpperCase()} 2025`}</div>
                      {isCurrent && <div className="current-badge">Aktuell</div>}
                      {isCompleted && <div className="completed-badge">Abgeschlossen</div>}
                    </div>
                    
                    <div className="quarter-amount-container">
                      <div className="quarter-amount">{qdata.earned.toLocaleString()}</div>
                      <div className="quarter-target">/{qdata.target.toLocaleString()}€</div>
                    </div>
                    
                    <div className="quarter-progress">
                      <div className="quarter-progress-bar">
                        <div 
                          className="quarter-progress-fill" 
                          style={{ width: `${qdata.percentage}%` }}
                        />
                      </div>
                      <div className="quarter-progress-text">{qdata.percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* IPP Modal */}
      {isIPPModalOpen && (
        <div className="ipp-modal-overlay" onClick={() => setIsIPPModalOpen(false)}>
          <div className="ipp-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="ipp-modal-close" onClick={() => setIsIPPModalOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="ipp-modal-header">
              <div className="ipp-header-content">
                <h2 className="ipp-modal-title">Dein IPP</h2>
                <div className="ipp-total-section">
                  <div className="ipp-total-amount">{averageIPP.toFixed(1)}</div>
                  <div className="ipp-total-badge">Jahresschnitt</div>
                </div>
              </div>
            </div>
            
            <div className="ipp-months-container">
              {([
                ['jun', ippData.jun] as const,
                ['may', ippData.may] as const,
                ['apr', ippData.apr] as const,
                ['mar', ippData.mar] as const,
                ['feb', ippData.feb] as const,
                ['jan', ippData.jan] as const,
                ['jul', ippData.jul] as const,
                ['aug', ippData.aug] as const,
                ['sep', ippData.sep] as const,
                ['oct', ippData.oct] as const,
                ['nov', ippData.nov] as const,
                ['dec', ippData.dec] as const
              ]).map(([month, mdata]) => {
                const isCompleted = mdata.ipp > 0
                const isCurrent = month === 'jun'
                const isFuture = mdata.ipp === 0
                
                return (
                  <div key={month} className={`month-card ${isCurrent ? 'current' : isFuture ? 'future' : 'completed'}`}>
                    <div className="month-header">
                      <div className="month-name">{month.toUpperCase()} 2025</div>
                      {isCurrent && <div className="current-badge">Aktuell</div>}
                      {isCompleted && !isCurrent && <div className="completed-badge">Abgeschlossen</div>}
                    </div>
                    
                    <div className="month-ipp-container">
                      <div className="month-ipp-row">
                      <div className="month-ipp">{mdata.ipp > 0 ? mdata.ipp.toFixed(1) : '0.0'}</div>
                      {mdata.change !== 0 && (
                        <div className={`month-change ${mdata.change > 0 ? 'positive' : 'negative'}`}>
                          {mdata.change > 0 ? '+' : ''}{mdata.change.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {mdata.ipp > 0 && (
                      <div className="month-progress">
                        <div 
                          className="month-einsaetze-bar"
                          onMouseEnter={(e) => {
                            const tooltip = document.createElement('div')
                            tooltip.className = 'einsaetze-tooltip'
                            tooltip.innerHTML = `
                              <div class="tooltip-header">Einsätze Breakdown</div>
                              <div class="tooltip-content">
                                <div class="tooltip-row">
                                  <div class="tooltip-color" style="background: #1f77b4"></div>
                                  <span class="tooltip-label">Standardbesuche</span>
                                  <span class="tooltip-value" style="color: #1f77b4">${mdata.standardbesuche}</span>
                                </div>
                                <div class="tooltip-row">
                                  <div class="tooltip-color" style="background: #5bc0de"></div>
                                  <span class="tooltip-label">Flexbesuche</span>
                                  <span class="tooltip-value" style="color: #5bc0de">${mdata.flexbesuche}</span>
                                </div>
                                <div class="tooltip-row">
                                  <div class="tooltip-color" style="background: #ffd700"></div>
                                  <span class="tooltip-label">Kühlerinventuren</span>
                                  <span class="tooltip-value" style="color: #ffd700">${mdata.kuhlerinventuren}</span>
                                </div>
                                <div class="tooltip-divider"></div>
                                <div class="tooltip-total">
                                  <span class="tooltip-total-label">Gesamt Einsätze</span>
                                  <span class="tooltip-total-value">${mdata.standardbesuche + mdata.flexbesuche + mdata.kuhlerinventuren}</span>
                                </div>
                              </div>
                            `
                            tooltip.style.position = 'fixed'
                            tooltip.style.zIndex = '9999'
                            
                            // Smart positioning to stay within viewport
                            const tooltipWidth = 220
                            const tooltipHeight = 120
                            let left = e.pageX + 10
                            let top = e.pageY - 10
                            
                            // Check right edge
                            if (left + tooltipWidth > window.innerWidth) {
                              left = e.pageX - tooltipWidth - 10
                            }
                            
                            // Check bottom edge
                            if (top + tooltipHeight > window.innerHeight) {
                              top = e.pageY - tooltipHeight - 10
                            }
                            
                            // Check left edge
                            if (left < 10) {
                              left = 10
                            }
                            
                            // Check top edge
                            if (top < 10) {
                              top = 10
                            }
                            
                            tooltip.style.left = left + 'px'
                            tooltip.style.top = top + 'px'
                            document.body.appendChild(tooltip)
                          }}
                          onMouseLeave={() => {
                            const tooltip = document.querySelector('.einsaetze-tooltip')
                            if (tooltip) tooltip.remove()
                          }}
                        >
                          {(() => {
                            const total = mdata.standardbesuche + mdata.flexbesuche + mdata.kuhlerinventuren
                            const standardPercent = (mdata.standardbesuche / total) * 100
                            const flexPercent = (mdata.flexbesuche / total) * 100
                            const kuhlPercent = (mdata.kuhlerinventuren / total) * 100
                            
                            return (
                              <>
                                <div 
                                  className="einsaetze-segment standard"
                                  style={{ width: `${standardPercent}%` }}
                                />
                                <div 
                                  className="einsaetze-segment flex"
                                  style={{ width: `${flexPercent}%` }}
                                />
                                <div 
                                  className="einsaetze-segment kuhl"
                                  style={{ width: `${kuhlPercent}%` }}
                                />
                              </>
                            )
                          })()}
                        </div>
                        <div className="month-progress-text">
                          {mdata.standardbesuche + mdata.flexbesuche + mdata.kuhlerinventuren} Einsätze
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
