import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  ipp: number
  zweitplatzierung: number
  cooler: number
  promotions: number
}

export default function IPPLineChart() {
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  
  // Calculate start index based on actual data length to show newest values  
  const getDefaultStartIndex = (_intervalType: string, dataLength: number, visiblePoints: number) => {
    return Math.max(0, dataLength - visiblePoints) // Always show newest values
  }
  
  const [startIndex, setStartIndex] = useState(0) // Will be set properly once data is calculated
  
  // Set default position to show newest values only on mount
  useEffect(() => {
    const allData = weeklyData // Use default interval data
    const maxVisiblePoints = 30
    const defaultStart = Math.max(0, allData.length - maxVisiblePoints)
    setStartIndex(defaultStart)
  }, []) // Only run once on mount
  
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartIndex = useRef(0)
  
  // Hover state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Legend visibility state
  const [showZweitplatzierung, setShowZweitplatzierung] = useState(false)
  const [showCooler, setShowCooler] = useState(false)
  const [showPromotions, setShowPromotions] = useState(false)
  
  // Deterministic helpers
  const round1 = (n: number) => Math.round(n * 10) / 10
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const noise = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const generateWeeklyData = (): DataPoint[] => {
    const result: DataPoint[] = []
    for (let w = 1; w <= 53; w++) {
      const isPrevYear = w <= 19 // 2024 weeks
      let ippMin: number, ippMax: number
      if (isPrevYear) {
        // 2024: 4.7–5.1, winter (KW 1–8) slightly higher within range
        if (w <= 8) { ippMin = 5.0; ippMax = 5.1 } else { ippMin = 4.7; ippMax = 5.0 }
      } else {
        // 2025+: 5.1–5.5, winter (KW 46–53) higher
        if (w >= 46) { ippMin = 5.4; ippMax = 5.5 }
        else if (w >= 26 && w <= 35) { ippMin = 5.1; ippMax = 5.2 } // summer lower
        else { ippMin = 5.2; ippMax = 5.4 }
      }
      const ipp = round1(lerp(ippMin, ippMax, noise(w * 1.37)))
      // Zweitplatzierung and Cooler under IPP; Promotions = residual
      const zweitBase = Math.min(3.8, Math.max(2.4, round1(lerp(0.55 * ipp, 0.7 * ipp, noise(w * 2.11)))))
      const coolerMax = Math.min(2.4, ipp - zweitBase - 0.1)
      const coolerMin = Math.max(1.6, ipp - zweitBase - 0.8)
      const cooler = round1(Math.min(Math.max(lerp(coolerMin, coolerMax, noise(w * 3.03)), 1.6), 2.4))
      const promotions = round1(Math.max(0, ipp - zweitBase - cooler))
      result.push({ date: `KW ${w}`, ipp, zweitplatzierung: zweitBase, cooler, promotions })
    }
    return result
  }

  const weeklyData: DataPoint[] = useMemo(generateWeeklyData, [])
  
  const generateMonthlyData = (): DataPoint[] => {
    const months = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    const out: DataPoint[] = []
    // Previous year (2024): 4.7–5.1, winter higher
    months.forEach((m, idx) => {
      const isWinter = [0, 1, 10, 11].includes(idx) // Jan, Feb, Nov, Dez
      const [min, max] = isWinter ? [5.0, 5.1] : [4.7, 5.0]
      const ipp = round1(lerp(min, max, noise((idx + 1) * 4.17)))
      const zweit = round1(Math.min(3.8, Math.max(2.4, lerp(0.55 * ipp, 0.7 * ipp, noise((idx + 1) * 5.01)))))
      const coolMax = Math.min(2.4, ipp - zweit - 0.1)
      const coolMin = Math.max(1.6, ipp - zweit - 0.8)
      const cooler = round1(Math.min(Math.max(lerp(coolMin, coolMax, noise((idx + 1) * 5.77)), 1.6), 2.4))
      const promotions = round1(Math.max(0, ipp - zweit - cooler))
      out.push({ date: `${m} -1`, ipp, zweitplatzierung: zweit, cooler, promotions })
    })
    // Current year (2025): 5.1–5.5, winter higher
    months.forEach((m, idx) => {
      const isWinter = [0, 1, 10, 11].includes(idx)
      const isSummer = [5, 6, 7].includes(idx)
      let min = 5.2, max = 5.4
      if (isWinter) { min = 5.4; max = 5.5 }
      else if (isSummer) { min = 5.1; max = 5.2 }
      const ipp = round1(lerp(min, max, noise((idx + 13) * 4.17)))
      const zweit = round1(Math.min(3.8, Math.max(2.4, lerp(0.55 * ipp, 0.7 * ipp, noise((idx + 13) * 5.01)))))
      const coolMax = Math.min(2.4, ipp - zweit - 0.1)
      const coolMin = Math.max(1.6, ipp - zweit - 0.8)
      const cooler = round1(Math.min(Math.max(lerp(coolMin, coolMax, noise((idx + 13) * 5.77)), 1.6), 2.4))
      const promotions = round1(Math.max(0, ipp - zweit - cooler))
      out.push({ date: `${m}`, ipp, zweitplatzierung: zweit, cooler, promotions })
    })
    return out
  }

  const monthlyData: DataPoint[] = useMemo(generateMonthlyData, [])
  
  // Daily data (100 days) - Deterministic seasonal values
  const generateDailyData = (): DataPoint[] => {
    const data: DataPoint[] = []
    const today = new Date()
    for (let i = 99; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const year = date.getFullYear()
      const month = date.getMonth() // 0-11
      let min = 5.2, max = 5.4
      // 2024 window (if included)
      if (year === 2024) {
        const isWinter = [0,1,10,11].includes(month)
        ;[min, max] = isWinter ? [5.0, 5.1] : [4.7, 5.0]
      } else {
        const isWinter = [0,1,10,11].includes(month)
        const isSummer = [5,6,7].includes(month)
        if (isWinter) { [min, max] = [5.4, 5.5] }
        else if (isSummer) { [min, max] = [5.1, 5.3] }
        else { [min, max] = [5.2, 5.4] }
      }
      const seed = date.getTime() / (24*60*60*1000)
      const ipp = round1(lerp(min, max, noise(seed)))
      const zweit = round1(Math.min(3.8, Math.max(2.2, lerp(0.55 * ipp, 0.7 * ipp, noise(seed * 1.7)))))
      const coolMax = Math.min(2.4, ipp - zweit - 0.1)
      const coolMin = Math.max(1.6, ipp - zweit - 0.8)
      const cooler = round1(Math.min(Math.max(lerp(coolMin, coolMax, noise(seed * 2.3)), 1.6), 2.4))
      const promotions = round1(Math.max(0, ipp - zweit - cooler))
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`,
        ipp,
        zweitplatzierung: zweit,
        cooler,
        promotions
      })
    }
    return data
  }

  const dailyData = useMemo(generateDailyData, [])
  
  const allData = interval === 'daily' ? dailyData : interval === 'weekly' ? weeklyData : monthlyData
  const maxVisiblePoints = interval === 'daily' ? 20 : interval === 'weekly' ? 30 : 20
  
  // Apply scrolling to all intervals when data exceeds visible limit
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
  
  // Default to newest values if startIndex hasn't been properly set
  const defaultStart = getDefaultStartIndex(interval, allData.length, maxVisiblePoints)
  const visibleStartIndex = needsScrolling ? Math.max(0, Math.min(startIndex ?? defaultStart, allData.length - maxVisiblePoints)) : 0
  const visibleEndIndex = Math.min(visibleStartIndex + maxVisiblePoints, allData.length)
  const data = allData.slice(visibleStartIndex, visibleEndIndex)
  
  const maxValue = Math.max(...data.map(d => d.ipp))
  const minValue = Math.min(...data.map(d => {
    const values = [d.ipp]
    if (showZweitplatzierung) values.push(d.zweitplatzierung)
    if (showCooler) values.push(d.cooler)
    if (showPromotions) values.push(d.promotions)
    return Math.min(...values)
  }))
  
  // Add buffer of 0.5 to min/max for better visualization
  const yMin = Math.max(0, minValue - 0.5)
  const yMax = maxValue + 0.5
  const yRange = yMax - yMin
  
  const chartHeight = 240
  const chartWidth = 1100
  const padding = 30
  
  const xStep = (chartWidth - padding * 2) / (data.length - 1)
  const yScale = (chartHeight - padding) / yRange
  
  const centerOffset = 0
  
  const ippPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.ipp - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const zweitplatzierungPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.zweitplatzierung - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const coolerPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cooler - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const promotionsPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.promotions - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!needsScrolling) return
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragStartIndex.current = startIndex
  }
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && needsScrolling) {
      const deltaX = e.clientX - dragStartX.current
      const indexDelta = Math.round(-deltaX / 30) // Negative because dragging right should show earlier days
      const newIndex = Math.max(0, Math.min(dragStartIndex.current + indexDelta, allData.length - maxVisiblePoints))
      setStartIndex(newIndex)
    } else if (!isDragging && svgRef.current) {
      // Handle hover
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      
      // Convert to SVG coordinates
      const svgX = (x / rect.width) * chartWidth
      
      // Calculate which data point is closest
      if (svgX >= padding && svgX <= chartWidth - padding) {
        const dataX = svgX - padding - centerOffset
        const index = Math.round(dataX / xStep)
        
        if (index >= 0 && index < data.length) {
          setHoveredIndex(index)
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
  
  
  const handleIntervalChange = (newInterval: 'daily' | 'weekly' | 'monthly') => {
    setInterval(newInterval)
    // Calculate default start index for new interval
    const newData = newInterval === 'daily' ? dailyData : newInterval === 'weekly' ? weeklyData : monthlyData
    const newMaxVisiblePoints = newInterval === 'daily' ? 20 : newInterval === 'weekly' ? 30 : 20
    const defaultStart = getDefaultStartIndex(newInterval, newData.length, newMaxVisiblePoints)
    setStartIndex(defaultStart)
  }
  
  
  // Calculate y-axis labels
  const yAxisLabels = []
  const labelStep = yRange / 4
  for (let i = 0; i <= 4; i++) {
    const value = yMin + (i * labelStep)
    yAxisLabels.push({
      value: value.toFixed(1),
      y: chartHeight - (i * labelStep * yScale) - 40
    })
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
        <div className="line-chart-title">IPP-Werte im zeitverlauf</div>
        <div className="interval-switcher">
          <button 
            className={`interval-btn ${interval === 'daily' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('daily')}
          >
            Täglich
          </button>
          <button 
            className={`interval-btn ${interval === 'weekly' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('weekly')}
          >
            Wöchentlich
          </button>
          <button 
            className={`interval-btn ${interval === 'monthly' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('monthly')}
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
          style={{ cursor: needsScrolling ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <defs>
            <linearGradient id="ippFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#28a745" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#28a745" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="zweitplatzierungFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2196F3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2196F3" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="coolerFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc3545" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc3545" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="promotionsFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6f42c1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6f42c1" stopOpacity="0.1" />
            </linearGradient>
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
                  {value.toFixed(1)}
                </text>
              </g>
            )
          })}
          
          {/* Dynamic fill areas based on active lines */}
          {(() => {
            const activeLines: { path: string; data: number[]; gradient: string }[] = []
            if (true) activeLines.push({ path: ippPath, data: data.map(d => d.ipp), gradient: 'ippFillGradient' }) // IPP always active
            if (showZweitplatzierung) activeLines.push({ path: zweitplatzierungPath, data: data.map(d => d.zweitplatzierung), gradient: 'zweitplatzierungFillGradient' })
            if (showCooler) activeLines.push({ path: coolerPath, data: data.map(d => d.cooler), gradient: 'coolerFillGradient' })
            if (showPromotions) activeLines.push({ path: promotionsPath, data: data.map(d => d.promotions), gradient: 'promotionsFillGradient' })
            
            // Sort by highest values to determine stacking order
            activeLines.sort((a, b) => Math.max(...b.data) - Math.max(...a.data))
            
            return activeLines.map((line, index) => {
              let fillPath
              if (index === activeLines.length - 1) {
                // Bottom line fills to ground
                fillPath = `${line.path} L ${padding + (data.length - 1) * xStep + centerOffset} ${chartHeight - 40} L ${padding + centerOffset} ${chartHeight - 40} Z`
              } else {
                // Fill to next line below
                const nextLine = activeLines[index + 1]
                const reversePath = data.slice().reverse().map((_point, i) => {
                  const originalIndex = data.length - 1 - i
                  const x = padding + originalIndex * xStep + centerOffset
                  const y = chartHeight - ((nextLine.data[originalIndex] - yMin) * yScale) - 40
                  return `L ${x} ${y}`
                }).join(' ')
                fillPath = `${line.path} ${reversePath} Z`
              }
              
              return (
                <path 
                  key={index}
                  d={fillPath} 
                  fill={`url(#${line.gradient})`} 
                />
              )
            })
          })()}
          
          {/* IPP line */}
          <path d={ippPath} stroke="#28a745" strokeWidth="2" fill="none" />
          
          {/* Zweitplatzierung line (optional) */}
          {showZweitplatzierung && (
            <path d={zweitplatzierungPath} stroke="#2196F3" strokeWidth="2" fill="none" />
          )}
          
          {/* Cooler line (optional) */}
          {showCooler && (
            <path d={coolerPath} stroke="#dc3545" strokeWidth="2" fill="none" />
          )}
          
          {/* Promotions line (optional) */}
          {showPromotions && (
            <path d={promotionsPath} stroke="#6f42c1" strokeWidth="2" fill="none" />
          )}
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = padding + i * xStep + centerOffset
            const yIPP = chartHeight - ((point.ipp - yMin) * yScale) - 40
            const yZweitplatzierung = chartHeight - ((point.zweitplatzierung - yMin) * yScale) - 40
            const yCooler = chartHeight - ((point.cooler - yMin) * yScale) - 40
            const yPromotions = chartHeight - ((point.promotions - yMin) * yScale) - 40
            
            return (
              <g key={i}>
                <circle cx={x} cy={yIPP} r="3" fill="#28a745" />
                {showZweitplatzierung && (
                  <circle cx={x} cy={yZweitplatzierung} r="3" fill="#2196F3" />
                )}
                {showCooler && (
                  <circle cx={x} cy={yCooler} r="3" fill="#dc3545" />
                )}
                {showPromotions && (
                  <circle cx={x} cy={yPromotions} r="3" fill="#6f42c1" />
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
              x1={padding + hoveredIndex * xStep + centerOffset}
              y1={0}
              x2={padding + hoveredIndex * xStep + centerOffset}
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
            // Calculate exact position of the data point
            const rect = svgRef.current.getBoundingClientRect()
            const x = padding + hoveredIndex * xStep + centerOffset
            const yIPP = chartHeight - ((data[hoveredIndex].ipp - yMin) * yScale) - 40
            
            // Convert SVG coordinates to screen coordinates
            const screenX = rect.left + (x / chartWidth) * rect.width
            const screenY = rect.top + (yIPP / chartHeight) * rect.height
            
            // Check if there's space on the right (switch earlier)
            const tooltipWidth = 180
            const hasSpaceOnRight = screenX + tooltipWidth + 50 < window.innerWidth
            
            return (
              <div 
                className="line-chart-tooltip"
                style={{
                  position: 'fixed',
                  left: hasSpaceOnRight ? screenX + 15 : screenX - tooltipWidth - 15,
                  top: Math.max(10, Math.min(screenY - 50, window.innerHeight - 100)),
                  pointerEvents: 'none'
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
                        'Jän': 'Jänner', 'Feb': 'Februar', 'Mär': 'März', 'Apr': 'April',
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
                    <span className="tooltip-label">IPP-Wert:</span>
                    <span className="tooltip-value" style={{ color: '#28a745' }}>
                      {data[hoveredIndex].ipp.toFixed(1)}
                    </span>
                  </div>
                  {showZweitplatzierung && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Zweitplatzierung:</span>
                      <span className="tooltip-value" style={{ color: '#2196F3' }}>
                        {data[hoveredIndex].zweitplatzierung.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showCooler && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Schütte:</span>
                      <span className="tooltip-value" style={{ color: '#dc3545' }}>
                        {data[hoveredIndex].cooler.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showPromotions && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Display:</span>
                      <span className="tooltip-value" style={{ color: '#6f42c1' }}>
                        {data[hoveredIndex].promotions.toFixed(1)}
                      </span>
                    </div>
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
            <div className="legend-line" style={{ backgroundColor: '#28a745' }}></div>
            <span className="legend-text">IPP-Werte</span>
          </div>
          <div className="legend-item" onClick={() => setShowZweitplatzierung(!showZweitplatzierung)} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: showZweitplatzierung ? '#2196F3' : 'transparent',
                border: showZweitplatzierung ? 'none' : '1.5px solid #2196F3',
                textDecoration: showZweitplatzierung ? 'none' : 'line-through',
                position: 'relative'
              }}
            >
              {!showZweitplatzierung && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#2196F3',
                  transform: 'translateY(-50%)'
                }} />
              )}
            </div>
            <span 
              className="legend-text" 
              style={{ 
                textDecoration: showZweitplatzierung ? 'none' : 'line-through',
                opacity: showZweitplatzierung ? 1 : 0.6
              }}
            >
              Zweitplatzierung
            </span>
          </div>
          <div className="legend-item" onClick={() => setShowCooler(!showCooler)} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: showCooler ? '#dc3545' : 'transparent',
                border: showCooler ? 'none' : '1.5px solid #dc3545',
                textDecoration: showCooler ? 'none' : 'line-through',
                position: 'relative'
              }}
            >
              {!showCooler && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#dc3545',
                  transform: 'translateY(-50%)'
                }} />
              )}
            </div>
            <span 
              className="legend-text" 
              style={{ 
                textDecoration: showCooler ? 'none' : 'line-through',
                opacity: showCooler ? 1 : 0.6
              }}
            >
              Schütte
            </span>
          </div>
          <div className="legend-item" onClick={() => setShowPromotions(!showPromotions)} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: showPromotions ? '#6f42c1' : 'transparent',
                border: showPromotions ? 'none' : '1.5px solid #6f42c1',
                textDecoration: showPromotions ? 'none' : 'line-through',
                position: 'relative'
              }}
            >
              {!showPromotions && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#6f42c1',
                  transform: 'translateY(-50%)'
                }} />
              )}
            </div>
            <span 
              className="legend-text" 
              style={{ 
                textDecoration: showPromotions ? 'none' : 'line-through',
                opacity: showPromotions ? 1 : 0.6
              }}
            >
              Display
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
