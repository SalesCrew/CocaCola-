import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  found: number
  resolved: number
  percentage: number
}

export default function LineChart() {
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
  // Track mouse for possible future features (disabled to avoid unused var)
  // const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Rolling average interval state
  const [avgIntervals, setAvgIntervals] = useState<12 | 3 | 'All'>(12)
  
  // Function to cycle through interval options
  const cycleAvgIntervals = () => {
    setAvgIntervals(current => {
      if (current === 12) return 3
      if (current === 3) return 'All'
      return 12 // 'All' -> 12
    })
  }
  
  // Current week index (KW 40 is "this week" - centered in data)
  const currentWeekIndex = 39 // KW 40 is now at index 39 (after adding previous year)
  
  // Smooth seasonal weekly data - Realistic climb/decline pattern (divided by 4)
  const weeklyBaseData: DataPoint[] = [
    // 2024 Winter - Low baseline (45-75 range)
    { date: 'KW 1', found: 49, resolved: 47, percentage: 96.4 },
    { date: 'KW 2', found: 53, resolved: 51, percentage: 96.7 },
    { date: 'KW 3', found: 46, resolved: 45, percentage: 96.2 },
    { date: 'KW 4', found: 56, resolved: 55, percentage: 96.9 },
    { date: 'KW 5', found: 50, resolved: 48, percentage: 96.5 },
    { date: 'KW 6', found: 60, resolved: 58, percentage: 97.1 },
    { date: 'KW 7', found: 55, resolved: 52, percentage: 94.5 },
    { date: 'KW 8', found: 59, resolved: 56, percentage: 95.3 },
    // 2024 Spring - Gradual climb to summer spike
    { date: 'KW 9', found: 64, resolved: 61, percentage: 95.3 },
    { date: 'KW 10', found: 69, resolved: 66, percentage: 95.3 },
    { date: 'KW 11', found: 74, resolved: 70, percentage: 95.3 },
    { date: 'KW 12', found: 79, resolved: 75, percentage: 94.9 },
    { date: 'KW 13', found: 83, resolved: 78, percentage: 94.2 },
    { date: 'KW 14', found: 86, resolved: 81, percentage: 93.9 },
    { date: 'KW 15', found: 90, resolved: 85, percentage: 93.9 },
    { date: 'KW 16', found: 94, resolved: 88, percentage: 93.9 },
    { date: 'KW 17', found: 96, resolved: 90, percentage: 93.8 },
    { date: 'KW 18', found: 99, resolved: 93, percentage: 93.9 },
    { date: 'KW 19', found: 101, resolved: 95, percentage: 93.8 },
    // Flatter transition - minimal dip
    { date: 'KW 20', found: 98, resolved: 93, percentage: 94.9 },
    { date: 'KW 21', found: 95, resolved: 90, percentage: 94.7 },
    { date: 'KW 22', found: 92, resolved: 88, percentage: 95.7 },
    { date: 'KW 23', found: 89, resolved: 86, percentage: 96.6 },
    { date: 'KW 24', found: 85, resolved: 82, percentage: 96.5 },
    { date: 'KW 25', found: 82, resolved: 79, percentage: 96.3 },
    // Last 15 weeks: Only 5 red, 10 green - 2024 Summer with better recovery
    { date: 'KW 26', found: 105, resolved: 93, percentage: 88.6 }, // Red 1
    { date: 'KW 27', found: 110, resolved: 96, percentage: 87.3 }, // Red 2
    { date: 'KW 28', found: 113, resolved: 99, percentage: 87.6 }, // Red 3
    { date: 'KW 29', found: 108, resolved: 96, percentage: 88.9 }, // Red 4
    { date: 'KW 30', found: 112, resolved: 98, percentage: 87.5 }, // Red 5 (last red week)
    { date: 'KW 31', found: 109, resolved: 99, percentage: 90.8 }, // Green 1
    { date: 'KW 32', found: 106, resolved: 97, percentage: 91.5 }, // Green 2
    { date: 'KW 33', found: 104, resolved: 95, percentage: 91.3 }, // Green 3
    { date: 'KW 34', found: 101, resolved: 92, percentage: 91.1 }, // Green 4
    { date: 'KW 35', found: 98, resolved: 90, percentage: 91.8 }, // Green 5
    // 2025 Summer - All green (90%+)
    { date: 'KW 36', found: 95, resolved: 87, percentage: 91.6 }, // Green 6
    { date: 'KW 37', found: 100, resolved: 92, percentage: 92.0 }, // Green 7
    { date: 'KW 38', found: 105, resolved: 97, percentage: 92.4 }, // Green 8
    { date: 'KW 39', found: 103, resolved: 95, percentage: 92.2 }, // Green 9
    { date: 'KW 40', found: 96, resolved: 89, percentage: 92.7 } // Green 10 - September strong finish
  ]
  
  const weeklyData: DataPoint[] = useMemo(() => weeklyBaseData, [])
  
  // Fixed monthly data - Aligned with weekly seasonal pattern (divided by 4)
  const monthlyData: DataPoint[] = [
    // Previous year (2024) - Aggregated from weekly totals
    { date: 'Jan -1', found: 208, resolved: 200, percentage: 96.4 },
    { date: 'Feb -1', found: 223, resolved: 215, percentage: 96.5 },
    { date: 'Mär -1', found: 275, resolved: 262, percentage: 95.2 },
    { date: 'Apr -1', found: 320, resolved: 301, percentage: 94.1 },
    { date: 'Mai -1', found: 346, resolved: 325, percentage: 94.0 },
    // 2024 RED SUMMER - Summer spike to 350-450 range
    { date: 'Jun -1', found: 408, resolved: 352, percentage: 86.5 },
    { date: 'Jul -1', found: 430, resolved: 372, percentage: 86.5 },
    { date: 'Aug -1', found: 421, resolved: 371, percentage: 88.1 },
    { date: 'Sep -1', found: 390, resolved: 347, percentage: 89.0 },
    { date: 'Okt -1', found: 305, resolved: 283, percentage: 92.8 },
    { date: 'Nov -1', found: 230, resolved: 219, percentage: 95.3 },
    { date: 'Dez -1', found: 203, resolved: 196, percentage: 96.5 },
    // Current year (2025) - Back to winter baseline, then better summer handling
    { date: 'Jan', found: 195, resolved: 189, percentage: 97.1 },
    { date: 'Feb', found: 205, resolved: 199, percentage: 97.1 },
    { date: 'Mär', found: 263, resolved: 252, percentage: 96.0 },
    { date: 'Apr', found: 295, resolved: 282, percentage: 95.5 },
    { date: 'Mai', found: 310, resolved: 295, percentage: 95.2 },
    // 2025 BETTER SUMMER - Same spike pattern but much better resolution
    { date: 'Jun', found: 388, resolved: 353, percentage: 91.2 },
    { date: 'Jul', found: 408, resolved: 373, percentage: 91.5 },
    { date: 'Aug', found: 404, resolved: 371, percentage: 91.9 },
    { date: 'Sep', found: 398, resolved: 365, percentage: 91.9 } // Fading out from summer
  ]
  
  // Generate daily data ending around mid-September
  const generateDailyData = (): DataPoint[] => {
    const data: DataPoint[] = []
    const endDate = new Date(2025, 8, 15) // September 15, 2025
    
    for (let i = 99; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      
      const dayOfWeek = date.getDay()
      const isSunday = dayOfWeek === 0
      
      if (isSunday) {
        data.push({
          date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`,
          found: 0,
          resolved: 0,
          percentage: 0
        })
        continue
      }
      
      const month = date.getMonth() + 1 // 1-12
      const year = date.getFullYear()
      const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24))
      
      // Use deterministic values based on day of year to ensure consistency
      const seed = (dayOfYear * 137) % 1000
      const deterministic = seed / 1000 // 0-1
      
      let foundBase: number, resolvedRate: number
      if (month >= 6 && month <= 8) { // Summer
        if (year === 2024) {
          // 2024 RED SUMMER - High spike (350-450 weekly)
          foundBase = 12 + deterministic * 6 // 12-18 daily
          resolvedRate = 0.85 + deterministic * 0.04 // 85-89%
        } else {
          // 2025 BETTER SUMMER - Same spike but better handled
          foundBase = 11 + deterministic * 5 // 11-16 daily  
          resolvedRate = 0.91 + deterministic * 0.02 // 91-93%
        }
      } else if (month === 1 || month === 2) { // Winter months (180-300 weekly)
        foundBase = 4 + deterministic * 3 // 4-7 daily
        resolvedRate = 0.96 + deterministic * 0.02 // 96-98%
      } else if (month === 9) { // September - fading out from summer
        foundBase = 9 + deterministic * 4 // 9-13 daily (trending down)
        if (year === 2024) {
          resolvedRate = 0.89 + deterministic * 0.02 // 89-91%
        } else {
          resolvedRate = 0.91 + deterministic * 0.02 // 91-93%
        }
      } else { // Spring/Autumn (gradual climb/decline)
        foundBase = 7 + deterministic * 4 // 7-11 daily
        resolvedRate = 0.93 + deterministic * 0.03 // 93-96%
      }
      
      const found = Math.round(foundBase)
      const resolved = Math.round(found * resolvedRate)
      const percentage = found > 0 ? Math.round((resolved / found) * 1000) / 10 : 0
      
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        found,
        resolved,
        percentage
      })
    }
    
    return data
  }
  
  const dailyData: DataPoint[] = useMemo(() => generateDailyData(), [])
  
  const allData = interval === 'daily' ? dailyData : interval === 'weekly' ? weeklyData : monthlyData
  
  // Different display limits for each interval
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
  
  const maxValue = Math.max(...data.map(d => d.found))
  const minValue = Math.min(...data.map(d => Math.min(d.found, d.resolved)))
  
  // Add buffer of 5 to min/max for better visualization
  const yMin = Math.max(0, minValue - 5)
  const yMax = maxValue + 5
  const yRange = yMax - yMin
  
  const chartHeight = 240
  const chartWidth = 1100  // Increased to use more of the available container width
  const padding = 30
  
  const xStep = (chartWidth - padding * 2) / (data.length - 1)
  const yScale = (chartHeight - padding) / yRange
  
  // Use full width - no centering offset
  const centerOffset = 0
  
  const foundPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.found - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const resolvedPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.resolved - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  // Calculate rolling average path for found OOS situations
  const cumulativeAveragePath = data.map((_point, i) => {
    const x = padding + i * xStep + centerOffset
    // Calculate average based on selected interval count
    let startIndex: number
    if (avgIntervals === 'All') {
      startIndex = 0 // Use all data from beginning
    } else {
      startIndex = Math.max(0, i - (avgIntervals - 1)) // Use selected number of intervals
    }
    const foundSum = data.slice(startIndex, i + 1).reduce((sum, p) => sum + p.found, 0)
    const rollingAverage = foundSum / (i - startIndex + 1)
      const yVal = chartHeight - ((rollingAverage - yMin) * yScale) - 40
      return i === 0 ? `M ${x} ${yVal}` : `L ${x} ${yVal}`
  }).join(' ')
  
  // Create proper fill path between the two lines
  const fillPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const yFound = chartHeight - ((point.found - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${yFound}` : `L ${x} ${yFound}`
  }).join(' ')
  
  const fillPathReverse = data.slice().reverse().map((point, i) => {
    const originalIndex = data.length - 1 - i
    const x = padding + originalIndex * xStep + centerOffset
    const yResolved = chartHeight - ((point.resolved - yMin) * yScale) - 40
    return `L ${x} ${yResolved}`
  }).join(' ')
  
  const closedFillPath = `${fillPath} ${fillPathReverse} Z`
  
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
      const indexDelta = Math.round(-deltaX / 30) // Negative because dragging right should show earlier days
      const newIndex = Math.max(0, Math.min(dragStartIndex.current + indexDelta, allData.length - maxVisiblePoints))
      setStartIndex(newIndex)
    } else if (!isDragging && svgRef.current) {
      // Handle hover
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      // const y = e.clientY - rect.top
      
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
  
  const handleWheel = (_e: React.WheelEvent) => {
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
        <div className="line-chart-title">OOS-Situationen Verlauf</div>
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
            <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {data.map((point, i) => (
                <stop 
                  key={i} 
                  offset={`${(i / (data.length - 1)) * 100}%`} 
                  stopColor={point.percentage >= 90 ? '#4CAF50' : '#FF5252'} 
                  stopOpacity="0.15"
                />
              ))}
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
                  {Math.round(value)}
                </text>
              </g>
            )
          })}
          
          {/* Fill between lines */}
          <path d={closedFillPath} fill="url(#fillGradient)" />
          
          {/* Cumulative average line */}
          <path d={cumulativeAveragePath} stroke="#FF6B6B" strokeWidth="1.5" fill="none" strokeDasharray="4,4" opacity="0.4" />
          
          {/* Lines */}
          <path d={foundPath} stroke="#FF6B6B" strokeWidth="2" fill="none" />
          <path d={resolvedPath} stroke="#28a745" strokeWidth="2" fill="none" />
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = padding + i * xStep + centerOffset
            const yFound = chartHeight - ((point.found - yMin) * yScale) - 40
            const yResolved = chartHeight - ((point.resolved - yMin) * yScale) - 40
            const isCurrentWeek = interval === 'weekly' && i === currentWeekIndex
            
            // Show all points since we're using full width
            if (true) {
              return (
                <g key={i}>
                  <circle cx={x} cy={yFound} r="3" fill="#FF6B6B" />
                  <circle cx={x} cy={yResolved} r="3" fill="#28a745" />
                  {isCurrentWeek && (
                    <circle cx={x} cy={yFound} r="5" fill="none" stroke="#FF6B6B" strokeWidth="1" opacity="0.6" />
                  )}
                  {isCurrentWeek && (
                    <circle cx={x} cy={yResolved} r="5" fill="none" stroke="#28a745" strokeWidth="1" opacity="0.6" />
                  )}
                  <text 
                    x={x} 
                    y={chartHeight - 10} 
                    textAnchor="middle" 
                    fontSize="9" 
                    fill="rgba(0,0,0,0.5)"
                    fontWeight={isCurrentWeek ? "600" : "normal"}
                  >
                    {point.date}
                  </text>
                </g>
              )
            }
            return null
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
            const yFound = chartHeight - ((data[hoveredIndex].found - yMin) * yScale) - 40
            const yResolved = chartHeight - ((data[hoveredIndex].resolved - yMin) * yScale) - 40
            const avgY = (yFound + yResolved) / 2
            
            // Convert SVG coordinates to screen coordinates
            const screenX = rect.left + (x / chartWidth) * rect.width
            const screenY = rect.top + (avgY / chartHeight) * rect.height
            
            // Check if there's space on the right
            const tooltipWidth = 260
            const hasSpaceOnRight = screenX + tooltipWidth + 20 < window.innerWidth
            
            return (
              <div 
                className="line-chart-tooltip"
                style={{
                  position: 'fixed',
                  left: hasSpaceOnRight ? screenX + 15 : screenX - tooltipWidth - 15,
                  top: Math.max(10, Math.min(screenY - 50, window.innerHeight - 140)),
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
                        'Jan': 'Jänner', 'Feb': 'Februar', 'Mar': 'März', 'Apr': 'April',
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
                    <span className="tooltip-label">Vorgefundene OOS-Situationen:</span>
                    <span className="tooltip-value" style={{ color: '#FF6B6B' }}>
                      {data[hoveredIndex].found}
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Behobene OOS-Situationen:</span>
                    <span className="tooltip-value" style={{ color: '#28a745' }}>
                      {data[hoveredIndex].resolved}
                    </span>
                  </div>
                  <div className="tooltip-divider"></div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">OOS behoben:</span>
                    <span className="tooltip-value" style={{ color: Math.round((data[hoveredIndex].resolved / data[hoveredIndex].found) * 100) >= 90 ? '#28a745' : '#dc3545' }}>
                      {Math.round((data[hoveredIndex].resolved / data[hoveredIndex].found) * 100)}%
                    </span>
                  </div>
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
            <div className="legend-line" style={{ backgroundColor: '#FF6B6B' }}></div>
            <span className="legend-text">Vorgefundene OOS-Situationen</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ backgroundColor: '#28a745' }}></div>
            <span className="legend-text">Behobene OOS-Situationen</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ backgroundColor: 'transparent', borderTop: '1.5px dashed rgba(255, 107, 107, 0.4)' }}></div>
            <span className="legend-text">Durchschnitt Vorgefundene OOS</span>
            <span 
              className="legend-interval-selector" 
              onClick={cycleAvgIntervals}
              style={{ 
                color: 'rgba(230, 126, 34, 0.6)', 
                cursor: 'pointer', 
                fontSize: '9px', 
                fontWeight: '600',
                marginLeft: '4px'
              }}
            >
              ({avgIntervals})
            </span>
          </div>
          <div className="legend-item">
            <div className="legend-fill green"></div>
            <span className="legend-text">≥90% Behebungsrate</span>
          </div>
          <div className="legend-item">
            <div className="legend-fill red"></div>
            <span className="legend-text">&lt;90% Behebungsrate</span>
          </div>
          <div className="legend-item" style={{ marginLeft: 'auto', marginRight: '5px', opacity: 0.7 }}>
            <span className="legend-text">Bei jedem Besuch werden 4 OOS Kategorien abgefragt.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
