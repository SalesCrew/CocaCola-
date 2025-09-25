import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  cooler: number
  zweitplatzierung: number
  promotion: number
  sonderplatz: number
}

export default function CategoryFillChart() {
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
  
  // Legend selection state
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  
  // Generate weekly data with seasonal realism
  const generateWeeklyData = (): DataPoint[] => {
    const weeks: DataPoint[] = []
    for (let w = 1; w <= 53; w++) {
      const isSummer = w >= 22 && w <= 38
      const isWinter = w >= 47 || w <= 8
      const isShoulder = !isSummer && !isWinter

      // Helper to get integer in range
      const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

      let cooler: number
      let zweitplatzierung: number
      let promotion: number
      let sonderplatz: number

      if (isSummer) {
        // Summer: shelves emptier (0-50) for cooler/zweit/promo, some exceptions
        cooler = rand(10, 50)
        zweitplatzierung = rand(10, 55)
        promotion = rand(0, 45)
        sonderplatz = rand(30, 65)
        // Rare exceptions to show outliers
        if (Math.random() < 0.1) cooler = rand(55, 70)
        if (Math.random() < 0.1) zweitplatzierung = rand(55, 70)
      } else if (isWinter) {
        // Winter: moderate-high, but Sonderplatz notably emptier than cooler
        cooler = rand(70, 100)
        zweitplatzierung = rand(60, 95)
        promotion = rand(20, 70)
        sonderplatz = rand(5, 35)
      } else if (isShoulder) {
        // Spring/Autumn: moderate ranges
        cooler = rand(55, 90)
        zweitplatzierung = rand(50, 85)
        promotion = rand(15, 60)
        sonderplatz = rand(20, 55)
      } else {
        cooler = 80
        zweitplatzierung = 70
        promotion = 40
        sonderplatz = 40
      }

      weeks.push({
        date: `KW ${w}`,
        cooler,
        zweitplatzierung,
        promotion,
        sonderplatz
      })
    }
    return weeks
  }
  const weeklyData: DataPoint[] = useMemo(() => generateWeeklyData(), [])
  
  // Generate monthly data with seasonal realism
  const generateMonthlyData = (): DataPoint[] => {
    const monthsOrder = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    const all: DataPoint[] = []
    const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

    const buildForYear = (suffix: string) => {
      monthsOrder.forEach((m) => {
        const isSummer = m === 'Jun' || m === 'Jul' || m === 'Aug'
        const isWinter = m === 'Nov' || m === 'Dez' || m === 'Jän' || m === 'Feb'
        let cooler: number
        let zweitplatzierung: number
        let promotion: number
        let sonderplatz: number
        if (isSummer) {
          cooler = rand(10, 50)
          zweitplatzierung = rand(10, 55)
          promotion = rand(0, 45)
          sonderplatz = rand(30, 65)
        } else if (isWinter) {
          cooler = rand(70, 100)
          zweitplatzierung = rand(60, 95)
          promotion = rand(20, 70)
          sonderplatz = rand(5, 35) // much emptier than cooler in winter
        } else {
          cooler = rand(55, 90)
          zweitplatzierung = rand(50, 85)
          promotion = rand(15, 60)
          sonderplatz = rand(20, 55)
        }
        all.push({
          date: `${m}${suffix}`,
          cooler,
          zweitplatzierung,
          promotion,
          sonderplatz
        })
      })
    }

    buildForYear(' -1')
    buildForYear('')

    return all
  }
  const monthlyData: DataPoint[] = useMemo(() => generateMonthlyData(), [])
  
  // Daily data (100 days)
  const generateDailyData = (): DataPoint[] => {
    const data: DataPoint[] = []
    const today = new Date()
    
    for (let i = 99; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Simulate realistic daily patterns
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Seasonal daily behavior
      const month = date.getMonth() // 0-11
      const isSummerMonth = month >= 5 && month <= 7 // Jun-Aug
      const isWinterMonth = month === 10 || month === 11 || month === 0 || month === 1 // Nov-Feb

      let cooler: number
      let zweitplatzierung: number
      let promotion: number
      let sonderplatz: number

      if (isSummerMonth) {
        // Summer: emptier shelves
        cooler = Math.round(10 + Math.random() * 40) // 10-50
        zweitplatzierung = Math.round(10 + Math.random() * 45) // 10-55
        promotion = Math.round(Math.random() * 45) // 0-45
        sonderplatz = Math.round(30 + Math.random() * 35) // 30-65
        // small weekend bump for zweitplatzierung only
        if (isWeekend) zweitplatzierung = Math.min(60, zweitplatzierung + 5)
      } else if (isWinterMonth) {
        // Winter: moderate-high; Sonderplatz much emptier than cooler
        cooler = Math.round(70 + Math.random() * 30) // 70-100
        zweitplatzierung = Math.round(60 + Math.random() * 35) // 60-95
        promotion = Math.round(20 + Math.random() * 50) // 20-70
        sonderplatz = Math.round(Math.random() * 35) // 0-35
      } else {
        // Shoulder seasons
        cooler = Math.round(55 + Math.random() * 35) // 55-90
        zweitplatzierung = Math.round(50 + Math.random() * 35) // 50-85
        promotion = Math.round(15 + Math.random() * 45) // 15-60
        sonderplatz = Math.round(20 + Math.random() * 35) // 20-55
      }
      
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`,
        cooler,
        zweitplatzierung,
        promotion,
        sonderplatz
      })
    }
    
    return data
  }
  
  const dailyData = useMemo(() => generateDailyData(), [])
  
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
  
  const yMin = 0
  const yMax = 100
  const yRange = yMax - yMin
  
  const chartHeight = 240
  const chartWidth = 1100
  const padding = 30
  
  const xStep = (chartWidth - padding * 2) / (data.length - 1)
  const yScale = (chartHeight - padding) / yRange
  
  const centerOffset = 0
  
  // Create paths for each category
  const coolerPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cooler - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const zweitplatzierungPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.zweitplatzierung - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const promotionPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.promotion - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const sonderplatzPath = data.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.sonderplatz - yMin) * yScale) - 40
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
  
  const handleContainerWheel = (e: React.WheelEvent) => {
    if (needsScrolling) {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation() // Stop immediate propagation as well
    }
  }
  
  const handleLegendClick = (lineType: string) => {
    if (selectedLine === lineType) {
      // Clicking same line again - reset to normal
      setSelectedLine(null)
    } else {
      // Select new line
      setSelectedLine(lineType)
    }
  }

  return (
    <div className="line-chart-container" ref={containerRef} onWheel={handleContainerWheel}>
      <div className="line-chart-header">
        <div className="line-chart-title">Kategorie-Füllstand</div>
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
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = chartHeight - ((value / 100) * (chartHeight - padding)) - 40
            return (
              <g key={value}>
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
                  {value}%
                </text>
              </g>
            )
          })}
          
          {/* Lines */}
          <path 
            d={coolerPath} 
            stroke="#dc3545" 
            strokeWidth={selectedLine === 'cooler' ? "3" : "2"} 
            strokeOpacity={selectedLine && selectedLine !== 'cooler' ? 0.2 : 1}
            fill="none" 
          />
          <path 
            d={zweitplatzierungPath} 
            stroke="#2196F3" 
            strokeWidth={selectedLine === 'zweitplatzierung' ? "3" : "2"} 
            strokeOpacity={selectedLine && selectedLine !== 'zweitplatzierung' ? 0.2 : 1}
            fill="none" 
          />
          <path 
            d={promotionPath} 
            stroke="#6f42c1" 
            strokeWidth={selectedLine === 'promotion' ? "3" : "2"} 
            strokeOpacity={selectedLine && selectedLine !== 'promotion' ? 0.2 : 1}
            fill="none" 
          />
          <path 
            d={sonderplatzPath} 
            stroke="#fd7e14" 
            strokeWidth={selectedLine === 'sonderplatz' ? "3" : "2"} 
            strokeOpacity={selectedLine && selectedLine !== 'sonderplatz' ? 0.2 : 1}
            fill="none" 
          />
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = padding + i * xStep + centerOffset
            const yCooler = chartHeight - ((point.cooler - yMin) * yScale) - 40
            const yZweitplatzierung = chartHeight - ((point.zweitplatzierung - yMin) * yScale) - 40
            const yPromotion = chartHeight - ((point.promotion - yMin) * yScale) - 40
            const ySonderplatz = chartHeight - ((point.sonderplatz - yMin) * yScale) - 40
            
            return (
              <g key={i}>
                <circle 
                  cx={x} 
                  cy={yCooler} 
                  r="3" 
                  fill="#dc3545" 
                  fillOpacity={selectedLine && selectedLine !== 'cooler' ? 0.2 : 1}
                />
                <circle 
                  cx={x} 
                  cy={yZweitplatzierung} 
                  r="3" 
                  fill="#2196F3" 
                  fillOpacity={selectedLine && selectedLine !== 'zweitplatzierung' ? 0.2 : 1}
                />
                <circle 
                  cx={x} 
                  cy={yPromotion} 
                  r="3" 
                  fill="#6f42c1" 
                  fillOpacity={selectedLine && selectedLine !== 'promotion' ? 0.2 : 1}
                />
                <circle 
                  cx={x} 
                  cy={ySonderplatz} 
                  r="3" 
                  fill="#fd7e14" 
                  fillOpacity={selectedLine && selectedLine !== 'sonderplatz' ? 0.2 : 1}
                />
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
            const yCooler = chartHeight - ((data[hoveredIndex].cooler - yMin) * yScale) - 40
            
            // Convert SVG coordinates to screen coordinates
            const screenX = rect.left + (x / chartWidth) * rect.width
            const screenY = rect.top + (yCooler / chartHeight) * rect.height
            
            // Check if there's space on the right (switch earlier)
            const tooltipWidth = 180
            const hasSpaceOnRight = screenX + tooltipWidth + 50 < window.innerWidth
            
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
                      return `${dateStr}`
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
                    <span className="tooltip-label">Cooler:</span>
                    <span className="tooltip-value" style={{ color: '#dc3545' }}>
                      {data[hoveredIndex].cooler}%
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Zweitplatzierung:</span>
                    <span className="tooltip-value" style={{ color: '#2196F3' }}>
                      {data[hoveredIndex].zweitplatzierung}%
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Promotion:</span>
                    <span className="tooltip-value" style={{ color: '#6f42c1' }}>
                      {data[hoveredIndex].promotion}%
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Sonderplatz:</span>
                    <span className="tooltip-value" style={{ color: '#fd7e14' }}>
                      {data[hoveredIndex].sonderplatz}%
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
          <div className="legend-item" onClick={() => handleLegendClick('cooler')} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: '#dc3545',
                opacity: selectedLine && selectedLine !== 'cooler' ? 0.2 : 1
              }}
            ></div>
            <span 
              className="legend-text"
              style={{ opacity: selectedLine && selectedLine !== 'cooler' ? 0.2 : 1 }}
            >
              Cooler
            </span>
          </div>
          <div className="legend-item" onClick={() => handleLegendClick('zweitplatzierung')} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: '#2196F3',
                opacity: selectedLine && selectedLine !== 'zweitplatzierung' ? 0.2 : 1
              }}
            ></div>
            <span 
              className="legend-text"
              style={{ opacity: selectedLine && selectedLine !== 'zweitplatzierung' ? 0.2 : 1 }}
            >
              Zweitplatzierung
            </span>
          </div>
          <div className="legend-item" onClick={() => handleLegendClick('promotion')} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: '#6f42c1',
                opacity: selectedLine && selectedLine !== 'promotion' ? 0.2 : 1
              }}
            ></div>
            <span 
              className="legend-text"
              style={{ opacity: selectedLine && selectedLine !== 'promotion' ? 0.2 : 1 }}
            >
              Promotion
            </span>
          </div>
          <div className="legend-item" onClick={() => handleLegendClick('sonderplatz')} style={{ cursor: 'pointer' }}>
            <div 
              className="legend-line" 
              style={{ 
                backgroundColor: '#fd7e14',
                opacity: selectedLine && selectedLine !== 'sonderplatz' ? 0.2 : 1
              }}
            ></div>
            <span 
              className="legend-text"
              style={{ opacity: selectedLine && selectedLine !== 'sonderplatz' ? 0.2 : 1 }}
            >
              Sonderplatz
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
