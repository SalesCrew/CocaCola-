import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  visits: number
  oos?: number
}

export default function BesuchsFrequenzChart() {
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [showOOSComparison, setShowOOSComparison] = useState(false)
  
  const [startIndex, setStartIndex] = useState(0)
  
  // Set default position to show newest values on mount and interval change
  useEffect(() => {
    const currentData = interval === 'daily' ? dailyData : interval === 'weekly' ? weeklyData : monthlyData
    const maxPoints = interval === 'daily' ? 40 : interval === 'weekly' ? 60 : 40
    const defaultStart = Math.max(0, currentData.length - maxPoints)
    setStartIndex(defaultStart)
  }, [interval])
  
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartIndex = useRef(0)
  
  // Hover state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  // Removed unused mouse position state
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use the same OOS data as in the OOS Verlauf chart (LineChart)
  // Reconstruct weekly OOS "found" counts with identical scaling/jitter
  const weeklyOOSBase = [
    28,30,26,32,29,35,38,42,41,45,48,44,51,49,46,52,48,43,47,41,36,49,44,53,47,58,64,72,68,75,71,69,74,67,73,78,76,81,79,77,62,55,48,52,46,41,38,35,32,29,27,25,
    26,28,31,30,33,36,39,43,40,46,47,42,50,48,45,53,49,44,46,42,38,51,45,55,49,61
  ]
  const weeklyOOS = (() => {
    const minBase = Math.min(...weeklyOOSBase)
    const maxBase = Math.max(...weeklyOOSBase)
    return weeklyOOSBase.map((v, i) => {
      const norm = (v - minBase) / Math.max(1, (maxBase - minBase))
      const sineBump = Math.sin(i * 0.35) * 6
      const jitter = ((i * 137) % 11) - 5
      const target = 70 + norm * 60 + sineBump + jitter
      return Math.max(65, Math.min(140, Math.round(target)))
    })
  })()

  const weeklyData: DataPoint[] = useMemo(() => {
    return weeklyOOS.map((oos, idx) => {
      // Target visits 230-270 with seasonal variation (deterministic jitter)
      const week = (idx % 52) + 1
      const detJitter = ((idx * 97) % 21) - 10 // -10..10 stable per idx
      let baseVisits = 250
      if (week >= 26 && week <= 36) { // summer
        baseVisits = 260 + detJitter // 250-270
      } else if (week <= 8 || week >= 47) { // winter
        baseVisits = 240 + detJitter // 230-250
      } else { // spring/fall
        baseVisits = 250 + detJitter // 240-260
      }
      const visits = Math.max(230, Math.min(270, baseVisits))
      return { date: `KW ${week}`, visits, oos }
    })
  }, [])
  
  const dailyData: DataPoint[] = Array.from({ length: 100 }, (_, i) => {
    // Every 7th day is Sunday (0 visits)
    const dayOfWeek = i % 7
    const isSunday = dayOfWeek === 0
    
    if (isSunday) {
      const startDate = new Date(2024, 2, 1)
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const day = currentDate.getDate().toString().padStart(2, '0')
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
      
      return {
        date: `${day}.${month}`,
        visits: 0,
        oos: 0
      }
    }
    
    // Calculate based on seasonal patterns and daily OOS (roughly 1/7 of weekly OOS)
    const startDate = new Date(2024, 2, 1) // March 1, 2024
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const month = currentDate.getMonth() + 1 // 1-12
    const day = currentDate.getDate().toString().padStart(2, '0')
    const monthStr = month.toString().padStart(2, '0')
    
    // Seasonal OOS percentage (what % of visits have OOS)
    let oosPercentage = 0.75 // default
    if (month >= 6 && month <= 8) { // Summer
      oosPercentage = 0.90 // High OOS rate in summer
    } else if (month >= 12 || month <= 2) { // Winter
      oosPercentage = 0.65 // Lower OOS rate in winter
    } else if (month === 3 || month === 4 || month === 9 || month === 10) { // Spring/Fall
      oosPercentage = 0.75
    } else { // Late spring, early fall
      oosPercentage = 0.80
    }
    
    // Daily OOS situations (roughly 1/7 of weekly, varies 1-15)
    const dailyOOS = 1 + Math.round(Math.random() * 14) // 1-15 OOS per day
    const dailyVisits = Math.round(dailyOOS / oosPercentage)
    
    return {
      date: `${day}.${monthStr}`,
      visits: dailyVisits,
      oos: dailyOOS
    }
  })
  
  const monthlyData: DataPoint[] = [
    // Previous year - target 950-1050 per month, seasonal (with OOS from Verlauf chart)
    { date: 'Jan -1', visits: 960, oos: 320 },
    { date: 'Feb -1', visits: 955, oos: 315 },
    { date: 'Mar -1', visits: 980, oos: 340 },
    { date: 'Apr -1', visits: 995, oos: 360 },
    { date: 'Mai -1', visits: 1010, oos: 370 },
    { date: 'Jun -1', visits: 1035, oos: 420 },
    { date: 'Jul -1', visits: 1050, oos: 480 },
    { date: 'Aug -1', visits: 1045, oos: 500 },
    { date: 'Sep -1', visits: 1015, oos: 450 },
    { date: 'Okt -1', visits: 990, oos: 360 },
    { date: 'Nov -1', visits: 965, oos: 330 },
    { date: 'Dez -1', visits: 950, oos: 310 },
    // Current year
    { date: 'Jan', visits: 960, oos: 325 },
    { date: 'Feb', visits: 955, oos: 315 },
    { date: 'Mär', visits: 985, oos: 340 },
    { date: 'Apr', visits: 1000, oos: 360 },
    { date: 'Mai', visits: 1015, oos: 380 },
    { date: 'Jun', visits: 1035, oos: 420 },
    { date: 'Jul', visits: 1050, oos: 490 },
    { date: 'Aug', visits: 1045, oos: 500 },
    { date: 'Sep', visits: 1010, oos: 460 },
    { date: 'Okt', visits: 990, oos: 360 },
    { date: 'Nov', visits: 965, oos: 330 },
    { date: 'Dez', visits: 950, oos: 310 },
  ]
  
  const allData = interval === 'daily' ? dailyData : interval === 'weekly' ? weeklyData : monthlyData
  
  const maxVisiblePoints = interval === 'daily' ? 40 : interval === 'weekly' ? 60 : 40
  const needsScrolling = allData.length > maxVisiblePoints
  
  // Add wheel event listener to handle scrolling and prevent bubbling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleNativeWheel = (e: WheelEvent) => {
      if (needsScrolling) {
        e.preventDefault()
        e.stopPropagation()
        
        // Handle the scrolling logic here
        const scrollDirection = e.deltaY > 0 ? 1 : -1
        const scrollAmount = 3
        const newIndex = Math.max(0, Math.min(
          startIndex + (scrollDirection * scrollAmount), 
          allData.length - maxVisiblePoints
        ))
        setStartIndex(newIndex)
      }
    }
    
    container.addEventListener('wheel', handleNativeWheel, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleNativeWheel)
    }
  }, [needsScrolling, startIndex, allData.length, maxVisiblePoints])
  
  const visibleStartIndex = needsScrolling ? Math.max(0, Math.min(startIndex ?? 0, allData.length - maxVisiblePoints)) : 0
  const visibleEndIndex = Math.min(visibleStartIndex + maxVisiblePoints, allData.length)
  const data = allData.slice(visibleStartIndex, visibleEndIndex)
  
  const maxValue = Math.max(...data.map(d => d.visits))
  // y-axis starts from 0; no need to track minValue separately
  
  const yMin = 0
  const yMax = maxValue + 5
  const yRange = yMax - yMin
  
  const chartHeight = 240
  const chartWidth = 2200
  const padding = 30
  
  const xStep = (chartWidth - padding * 2) / (data.length - 1)
  const yScale = (chartHeight - padding) / yRange
  
  // Create step path with data points in the middle of horizontal segments
  let stepPath = ''
  let fillPath = ''
  let oosPath = ''
   let gapFillPaths: { path: string; color: string; gradientId?: string; fromColor?: string; toColor?: string }[] = []
  const baseY = chartHeight - 40 // Bottom of chart
  
  // Start from left edge at first value height
  const firstY = data[0]?.visits === 0 ? baseY : chartHeight - ((data[0]?.visits - yMin) * yScale) - 40
  stepPath = `M ${padding} ${firstY}`
  fillPath = `M ${padding} ${baseY} L ${padding} ${firstY}`
  
  data.forEach((point, i) => {
    const x = padding + i * xStep
    const y = point.visits === 0 ? baseY : chartHeight - ((point.visits - yMin) * yScale) - 40
    const halfStep = xStep / 2
    
    if (i === 0) {
      // First point: horizontal line to center, then continue
      stepPath += ` L ${x + halfStep} ${y}`
      fillPath += ` L ${x + halfStep} ${y}`
    } else {
      // Middle points: connect from previous height
      const prevY = data[i - 1].visits === 0 ? baseY : chartHeight - ((data[i - 1].visits - yMin) * yScale) - 40
      stepPath += ` L ${x - halfStep} ${prevY}`
      stepPath += ` L ${x - halfStep} ${y}`
      stepPath += ` L ${x + halfStep} ${y}`
      
      fillPath += ` L ${x - halfStep} ${prevY}`
      fillPath += ` L ${x - halfStep} ${y}`
      fillPath += ` L ${x + halfStep} ${y}`
    }
    
    // If last point, just end the step path cleanly
    if (i === data.length - 1) {
      // Don't go down for step path - keep it open
      fillPath += ` L ${x + halfStep} ${baseY}`
      fillPath += ` L ${padding} ${baseY} Z` // Close the fill path properly
    }
  })
  
  // Generate OOS path and gap fills if comparison is enabled
  if (showOOSComparison) {
    // First generate the OOS step path
    const firstOosY = data[0]?.oos ? chartHeight - ((data[0].oos - yMin) * yScale) - 40 : baseY
    oosPath = `M ${padding} ${firstOosY}`
    
    data.forEach((point, i) => {
      if (point.oos !== undefined) {
        const x = padding + i * xStep
        const y = chartHeight - ((point.oos - yMin) * yScale) - 40
        const halfStep = xStep / 2
        
        if (i === 0) {
          oosPath += ` L ${x + halfStep} ${y}`
        } else {
          const prevPoint = data[i - 1]
          const prevOosY = (prevPoint && prevPoint.oos !== undefined)
            ? chartHeight - ((prevPoint.oos - yMin) * yScale) - 40
            : y
          oosPath += ` L ${x - halfStep} ${prevOosY}`
          oosPath += ` L ${x - halfStep} ${y}`
          oosPath += ` L ${x + halfStep} ${y}`
        }
      }
    })
    
    // Generate gap fill segments with appropriate colors
    data.forEach((point, i) => {
      if (point.oos !== undefined && point.visits > 0) {
        const x = padding + i * xStep
        const visitY = chartHeight - ((point.visits - yMin) * yScale) - 40
        const oosY = chartHeight - ((point.oos - yMin) * yScale) - 40
        const halfStep = xStep / 2
        
        // Calculate visit to OOS ratio and determine base color (red or green)
        const visitOOSRatio = point.visits / (point.oos || 1) // Avoid division by zero
        const isGreen = visitOOSRatio <= 3 // Green if visits ≤ 3 × OOS
        const baseColor = isGreen ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'
        
        // Create a fill path segment between visits and OOS lines
        let segmentPath = ''
        let segmentColor = baseColor
        
        if (i === 0) {
          // For first segment, start at chart boundary (padding) instead of extending beyond
          segmentPath = `M ${padding} ${visitY} L ${x + halfStep} ${visitY} L ${x + halfStep} ${oosY} L ${padding} ${oosY} Z`
        } else {
          const prevPoint2 = data[i - 1]
          const prevVisitY = (prevPoint2 && prevPoint2.visits !== undefined)
            ? chartHeight - ((prevPoint2.visits - yMin) * yScale) - 40
            : visitY
          const prevOosY = (prevPoint2 && prevPoint2.oos !== undefined)
            ? chartHeight - ((prevPoint2.oos - yMin) * yScale) - 40
            : oosY
          segmentPath = `M ${x - halfStep} ${prevVisitY} L ${x - halfStep} ${visitY} L ${x + halfStep} ${visitY} L ${x + halfStep} ${oosY} L ${x - halfStep} ${oosY} L ${x - halfStep} ${prevOosY} Z`
          
          // Check if previous segment has different color - create gradient if so
          if (data[i - 1]?.oos !== undefined) {
            const prevVisitOOSRatio = data[i - 1].visits / (data[i - 1].oos || 1)
            const prevIsGreen = prevVisitOOSRatio <= 3
            
            if (prevIsGreen !== isGreen) {
              // Colors are different - create gradient
              const gradientId = `gap-gradient-${i}`
              const fromColor = prevIsGreen ? '#28a745' : '#dc3545' // Green or Red
              const toColor = isGreen ? '#28a745' : '#dc3545'
              segmentColor = `url(#${gradientId})`
              
              gapFillPaths.push({ 
                path: segmentPath, 
                color: segmentColor,
                gradientId,
                fromColor,
                toColor
              })
              return
            }
          }
        }
        
        gapFillPaths.push({ path: segmentPath, color: segmentColor })
      }
    })
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (needsScrolling) {
      setIsDragging(true)
      dragStartX.current = e.clientX
      dragStartIndex.current = visibleStartIndex
      e.preventDefault()
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && needsScrolling) {
      const deltaX = e.clientX - dragStartX.current
      const indexDelta = Math.round(-deltaX / 30)
      const newIndex = Math.max(0, Math.min(dragStartIndex.current + indexDelta, allData.length - maxVisiblePoints))
      setStartIndex(newIndex)
    } else if (!isDragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const svgX = (x / rect.width) * chartWidth
      
      if (svgX >= padding && svgX <= chartWidth - padding) {
        const dataX = svgX - padding
        const index = Math.round(dataX / xStep)
        
        if (index >= 0 && index < data.length) {
          setHoveredIndex(index)
          // No-op: we don't need to store mouse position outside tooltip calculation
        } else {
          setHoveredIndex(null)
        }
      } else {
        setHoveredIndex(null)
      }
    }
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  const handleMouseLeave = () => {
    setIsDragging(false)
    setHoveredIndex(null)
  }
  
  const handleWheel = () => {
    // Handled by native event listener
  }
  
  const handleContainerWheel = (e: React.WheelEvent) => {
    if (needsScrolling) {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation() // Stop immediate propagation as well
    }
  }

  return (
    <div className="line-chart-container" ref={containerRef} onWheel={handleContainerWheel}>
      <div className="line-chart-header">
        <div className="line-chart-title"></div>
        <div className="interval-switcher">
          <button 
            className={`interval-btn ${interval === 'daily' ? 'active' : ''}`}
            onClick={() => setInterval('daily')}
          >
            Täglich
          </button>
          <button 
            className={`interval-btn ${interval === 'weekly' ? 'active' : ''}`}
            onClick={() => setInterval('weekly')}
          >
            Wöchentlich
          </button>
          <button 
            className={`interval-btn ${interval === 'monthly' ? 'active' : ''}`}
            onClick={() => setInterval('monthly')}
          >
            Monatlich
          </button>
        </div>
      </div>
      
      
      <div className="line-chart-content">
        <svg 
          ref={svgRef}
          width="100%" 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{ cursor: needsScrolling ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
           <defs>
             <linearGradient id="visitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#2196F3" stopOpacity="0.25" />
               <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
             </linearGradient>
             
             {/* Dynamic gradients for gap fill transitions */}
             {showOOSComparison && gapFillPaths.filter(fill => fill.gradientId).map((fill) => (
               <linearGradient key={fill.gradientId} id={fill.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor={fill.fromColor} stopOpacity="0.2" />
                 <stop offset="100%" stopColor={fill.toColor} stopOpacity="0.2" />
               </linearGradient>
             ))}
           </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const value = yMin + (yRange * pct)
            const y = chartHeight - (pct * (chartHeight - padding)) - 40
            return (
              <g key={i}>
                <line 
                  x1={0} 
                  y1={y} 
                  x2={chartWidth} 
                  y2={y} 
                  stroke="rgba(0,0,0,0.05)" 
                  strokeDasharray="2,2" 
                />
                <text 
                  x={15} 
                  y={y + 4} 
                  textAnchor="start" 
                  fontSize="12" 
                  fill="rgba(0,0,0,0.4)"
                >
                  {Math.round(value)}
                </text>
              </g>
            )
          })}
          
          {/* Fill area */}
          {!showOOSComparison && <path d={fillPath} fill="url(#visitGradient)" />}
          
          {/* Gap fills between visits and OOS */}
          {showOOSComparison && gapFillPaths.map((fillData, i) => (
            <path 
              key={`gap-fill-${i}`} 
              d={fillData.path} 
              fill={fillData.color} 
            />
          ))}
          
          {/* Step line */}
          <path d={stepPath} stroke="#2196F3" strokeWidth="2" fill="none" />
          
          {/* OOS line */}
          {showOOSComparison && oosPath && (
            <path d={oosPath} stroke="#ff6b6b" strokeWidth="2" fill="none" />
          )}
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = padding + i * xStep
            const y = chartHeight - ((point.visits - yMin) * yScale) - 40
            
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="#2196F3" />
                {showOOSComparison && point.oos !== undefined && (
                  <circle 
                    cx={x} 
                    cy={chartHeight - ((point.oos - yMin) * yScale) - 40} 
                    r="3" 
                    fill="#ff6b6b" 
                  />
                )}
                <text 
                  x={x} 
                  y={chartHeight - 10} 
                  textAnchor="middle" 
                  fontSize="9" 
                  fill="rgba(0,0,0,0.5)"
                >
                  {point.date}
                </text>
              </g>
            )
          })}
          
          {/* Hover line */}
          {hoveredIndex !== null && (
            <line
              x1={padding + hoveredIndex * xStep}
              y1={0}
              x2={padding + hoveredIndex * xStep}
              y2={chartHeight - 40}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
              strokeDasharray="3,3"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && svgRef.current && createPortal(
          (() => {
            const rect = svgRef.current.getBoundingClientRect()
            const x = padding + hoveredIndex * xStep
            const y = chartHeight - ((data[hoveredIndex].visits - yMin) * yScale) - 40
            
            const screenX = rect.left + (x / chartWidth) * rect.width
            const screenY = rect.top + (y / chartHeight) * rect.height
            
            const tooltipWidth = 200
            const hasSpaceOnRight = screenX + tooltipWidth + 20 < window.innerWidth
            
            return (
              <div 
                className="line-chart-tooltip"
                style={{
                  position: 'fixed',
                  left: hasSpaceOnRight ? screenX + 15 : screenX - tooltipWidth - 15,
                  top: Math.max(10, Math.min(screenY - 40, window.innerHeight - 100)),
                  pointerEvents: 'none',
                  minWidth: '200px'
                }}
              >
                <div className="tooltip-header">
                  {(() => {
                    const dateStr = data[hoveredIndex].date
                    if (interval === 'weekly') {
                      return `${dateStr} 2025`
                    } else if (interval === 'daily') {
                      return `${dateStr}.2025`
                    } else if (interval === 'monthly') {
                      const monthMap: { [key: string]: string } = {
                        'Jan': 'Jänner', 'Feb': 'Februar', 'Mär': 'März', 'Apr': 'April',
                        'Mai': 'Mai', 'Jun': 'Juni', 'Jul': 'Juli', 'Aug': 'August',
                        'Sep': 'September', 'Okt': 'Oktober', 'Nov': 'November', 'Dez': 'Dezember'
                      }
                      const year = dateStr.includes('-1') ? '2024' : '2025'
                      const cleanMonth = dateStr.replace(' -1', '')
                      return `${monthMap[cleanMonth] || cleanMonth} ${year}`
                    }
                    return dateStr
                  })()}
                </div>
                <div className="tooltip-content">
                  <div className="tooltip-row">
                    <span className="tooltip-label">Anzahl Besuche:</span>
                    <span className="tooltip-value" style={{ color: '#2196F3' }}>
                      {data[hoveredIndex].visits}
                    </span>
                  </div>
                  {showOOSComparison && data[hoveredIndex].oos !== undefined && (
                    <>
                      <div className="tooltip-row">
                        <span className="tooltip-label">Vorgefundene OOS-Situationen:</span>
                        <span className="tooltip-value" style={{ color: '#ff6b6b' }}>
                          {data[hoveredIndex].oos}
                        </span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label">Status:</span>
                        <span 
                          className="tooltip-value" 
                          style={{ 
                            color: (data[hoveredIndex].visits / (data[hoveredIndex].oos! || 1)) <= 3 
                              ? '#28a745' 
                              : '#dc3545',
                            fontWeight: 'bold'
                          }}
                        >
                          {(data[hoveredIndex].visits / (data[hoveredIndex].oos! || 1)) <= 3 
                            ? 'optimal besetzt' 
                            : 'überbesucht'
                          }
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })(),
          document.body
        )}
        
        {needsScrolling && (
          <div className="daily-scroll-indicator">
            <div className="scroll-track">
              <div 
                className="scroll-thumb" 
                style={{ 
                  left: `${(visibleStartIndex / (allData.length - maxVisiblePoints)) * (100 - (maxVisiblePoints / allData.length) * 100)}%`,
                  width: `${(maxVisiblePoints / allData.length) * 100}%`
                }}
              />
            </div>
            <span className="scroll-hint">
              {interval === 'daily' ? 'Ziehen Sie, um weitere Tage zu sehen' : 
               interval === 'weekly' ? 'Ziehen Sie, um weitere Wochen zu sehen' :
               'Ziehen Sie, um weitere Monate zu sehen'}
            </span>
          </div>
        )}
        
        <div className="line-chart-legend">
          <div className="legend-item">
            <div className="legend-line" style={{ backgroundColor: '#2196F3' }}></div>
            <span className="legend-text">Besuchsanzahl</span>
          </div>
          {showOOSComparison && (
            <>
              <div className="legend-item">
                <span className="legend-line" style={{ backgroundColor: '#ff6b6b' }}></span>
                <span className="legend-text">Vorgefundene OOS-Situationen</span>
              </div>
              <div className="legend-item">
                <span className="legend-fill" style={{ 
                  background: 'rgba(40, 167, 69, 0.2)' 
                }}></span>
                <span className="legend-text">Ratio ≤ 3x</span>
              </div>
              <div className="legend-item">
                <span className="legend-fill" style={{ 
                  background: 'rgba(220, 53, 69, 0.2)' 
                }}></span>
                <span className="legend-text">Ratio &gt; 3x</span>
              </div>
            </>
          )}
          <div className="legend-item" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setShowOOSComparison(!showOOSComparison)}>
            <span className="legend-text">Besuchsanzahl v Aufgefundene OOS Situationen</span>
            <span style={{ marginLeft: '8px', marginRight: '8px', fontSize: '11px', opacity: 0.7 }}>👁</span>
          </div>
        </div>
      </div>
    </div>
  )
}
