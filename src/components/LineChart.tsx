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
  
  // Realistic seasonal weekly data (KW = Kalenderwoche) - 2 years of data (base values)
  const weeklyBaseData: DataPoint[] = [
    // Previous year
    { date: 'KW 1', found: 28, resolved: 27, percentage: 96.4 },
    { date: 'KW 2', found: 30, resolved: 29, percentage: 96.7 },
    { date: 'KW 3', found: 26, resolved: 25, percentage: 96.2 },
    { date: 'KW 4', found: 32, resolved: 31, percentage: 96.9 },
    { date: 'KW 5', found: 29, resolved: 28, percentage: 96.6 },
    { date: 'KW 6', found: 35, resolved: 34, percentage: 97.1 },
    { date: 'KW 7', found: 38, resolved: 36, percentage: 94.7 },
    { date: 'KW 8', found: 42, resolved: 40, percentage: 95.2 },
    { date: 'KW 9', found: 41, resolved: 39, percentage: 95.1 },
    { date: 'KW 10', found: 45, resolved: 43, percentage: 95.6 },
    { date: 'KW 11', found: 48, resolved: 46, percentage: 95.8 },
    { date: 'KW 12', found: 44, resolved: 42, percentage: 95.5 },
    { date: 'KW 13', found: 51, resolved: 48, percentage: 94.1 },
    { date: 'KW 14', found: 49, resolved: 46, percentage: 93.9 },
    { date: 'KW 15', found: 46, resolved: 44, percentage: 95.7 },
    { date: 'KW 16', found: 52, resolved: 49, percentage: 94.2 },
    { date: 'KW 17', found: 48, resolved: 45, percentage: 93.8 },
    { date: 'KW 18', found: 43, resolved: 41, percentage: 95.3 },
    { date: 'KW 19', found: 47, resolved: 45, percentage: 95.7 },
    // Current year - Winter/Spring - Better performance
    { date: 'KW 20', found: 41, resolved: 39, percentage: 95.1 },
    { date: 'KW 21', found: 36, resolved: 34, percentage: 94.4 },
    { date: 'KW 22', found: 49, resolved: 46, percentage: 93.9 },
    { date: 'KW 23', found: 44, resolved: 42, percentage: 95.5 },
    { date: 'KW 24', found: 53, resolved: 50, percentage: 94.3 },
    { date: 'KW 25', found: 47, resolved: 44, percentage: 93.6 },
    // Summer start - Performance degrades
    { date: 'KW 26', found: 58, resolved: 51, percentage: 87.9 },
    { date: 'KW 27', found: 64, resolved: 55, percentage: 85.9 },
    { date: 'KW 28', found: 72, resolved: 62, percentage: 86.1 },
    { date: 'KW 29', found: 68, resolved: 59, percentage: 86.8 },
     { date: 'KW 30', found: 75, resolved: 68, percentage: 90.7 }, // Good summer week
    { date: 'KW 31', found: 71, resolved: 64, percentage: 90.1 },
    { date: 'KW 32', found: 69, resolved: 63, percentage: 91.3 },
    { date: 'KW 33', found: 74, resolved: 67, percentage: 90.5 },
    { date: 'KW 34', found: 67, resolved: 61, percentage: 91.0 },
     { date: 'KW 35', found: 73, resolved: 66, percentage: 90.4 }, // Good summer week
    // Peak summer - Worst performance
    { date: 'KW 36', found: 78, resolved: 66, percentage: 84.6 },
    { date: 'KW 37', found: 76, resolved: 63, percentage: 82.9 },
    { date: 'KW 38', found: 81, resolved: 67, percentage: 82.7 },
    { date: 'KW 39', found: 79, resolved: 65, percentage: 82.3 },
    { date: 'KW 40', found: 77, resolved: 64, percentage: 83.1 }, // This week
    { date: 'KW 41', found: 62, resolved: 55, percentage: 88.7 },
    // Fall recovery
    { date: 'KW 42', found: 55, resolved: 50, percentage: 90.9 },
    { date: 'KW 43', found: 48, resolved: 44, percentage: 91.7 },
    { date: 'KW 44', found: 52, resolved: 48, percentage: 92.3 },
    { date: 'KW 45', found: 46, resolved: 43, percentage: 93.5 },
    { date: 'KW 46', found: 41, resolved: 39, percentage: 95.1 },
    // Winter - Best performance
    { date: 'KW 47', found: 38, resolved: 36, percentage: 94.7 },
    { date: 'KW 48', found: 35, resolved: 34, percentage: 97.1 },
    { date: 'KW 49', found: 32, resolved: 31, percentage: 96.9 },
    { date: 'KW 50', found: 29, resolved: 28, percentage: 96.6 },
    { date: 'KW 51', found: 27, resolved: 26, percentage: 96.3 },
    { date: 'KW 52', found: 25, resolved: 24, percentage: 96.0 },
    // Next year projection
    { date: 'KW 1', found: 26, resolved: 25, percentage: 96.2 },
    { date: 'KW 2', found: 28, resolved: 27, percentage: 96.4 },
    { date: 'KW 3', found: 31, resolved: 30, percentage: 96.8 },
    { date: 'KW 4', found: 30, resolved: 29, percentage: 96.7 },
    { date: 'KW 5', found: 33, resolved: 32, percentage: 97.0 },
    { date: 'KW 6', found: 36, resolved: 35, percentage: 97.2 },
    { date: 'KW 7', found: 39, resolved: 37, percentage: 94.9 },
    { date: 'KW 8', found: 43, resolved: 41, percentage: 95.3 },
    { date: 'KW 9', found: 40, resolved: 38, percentage: 95.0 },
    { date: 'KW 10', found: 46, resolved: 44, percentage: 95.7 },
    { date: 'KW 11', found: 47, resolved: 45, percentage: 95.7 },
    { date: 'KW 12', found: 42, resolved: 40, percentage: 95.2 },
    { date: 'KW 13', found: 50, resolved: 47, percentage: 94.0 },
    { date: 'KW 14', found: 48, resolved: 45, percentage: 93.8 },
    { date: 'KW 15', found: 45, resolved: 43, percentage: 95.6 },
    { date: 'KW 16', found: 53, resolved: 50, percentage: 94.3 },
    { date: 'KW 17', found: 49, resolved: 46, percentage: 93.9 },
    { date: 'KW 18', found: 44, resolved: 42, percentage: 95.5 },
    { date: 'KW 19', found: 46, resolved: 44, percentage: 95.7 },
    { date: 'KW 20', found: 42, resolved: 40, percentage: 95.2 },
    { date: 'KW 21', found: 38, resolved: 36, percentage: 94.7 },
    { date: 'KW 22', found: 51, resolved: 48, percentage: 94.1 },
    { date: 'KW 23', found: 45, resolved: 43, percentage: 95.6 },
    { date: 'KW 24', found: 55, resolved: 52, percentage: 94.5 },
    { date: 'KW 25', found: 49, resolved: 46, percentage: 93.9 },
    { date: 'KW 26', found: 61, resolved: 53, percentage: 86.9 },
  ]

  // Scale weekly data to align with monthly totals (found between ~300-500 per month ⇒ ~70-130 per week)
  // Add seasonal variety + slight randomness while preserving original percentages
  const weeklyData: DataPoint[] = useMemo(() => {
    const minBase = Math.min(...weeklyBaseData.map(d => d.found))
    const maxBase = Math.max(...weeklyBaseData.map(d => d.found))
    return weeklyBaseData.map((d, i) => {
      const norm = (d.found - minBase) / Math.max(1, (maxBase - minBase)) // 0..1 seasonal index
      const sineBump = Math.sin(i * 0.35) * 6 // smooth oscillation
      const jitter = ((i * 137) % 11) - 5 // deterministic small jitter -5..5
      const targetFoundRaw = 70 + norm * 60 + sineBump + jitter
      const targetFound = Math.max(65, Math.min(140, Math.round(targetFoundRaw)))
      const resolved = Math.round(targetFound * (d.percentage / 100))
      return { date: d.date, found: targetFound, resolved, percentage: d.percentage }
    })
  }, [])
  
  const dailyData: DataPoint[] = Array.from({ length: 100 }, (_, i) => {
    const baseFound = 8 + Math.round(Math.random() * 12) // 8-20 range
    const variance = 0.85 + Math.random() * 0.15 // 85-100% range
    const resolved = Math.round(baseFound * variance)
    const percentage = (resolved / baseFound) * 100
    
    // Generate realistic dates starting from March 1st
    const startDate = new Date(2024, 2, 1) // March 1, 2024
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    
    return {
      date: `${day}.${month}`,
      found: baseFound,
      resolved: resolved,
      percentage: Math.round(percentage * 10) / 10
    }
  })
  
  const monthlyData: DataPoint[] = [
    // Previous year (scaled to 300-500 with same seasonal pattern)
    { date: 'Jan -1', found: 320, resolved: Math.round(320 * 0.961), percentage: 96.1 },
    { date: 'Feb -1', found: 315, resolved: Math.round(315 * 0.967), percentage: 96.7 },
    { date: 'Mar -1', found: 340, resolved: Math.round(340 * 0.959), percentage: 95.9 },
    { date: 'Apr -1', found: 360, resolved: Math.round(360 * 0.948), percentage: 94.8 },
    { date: 'Mai -1', found: 370, resolved: Math.round(370 * 0.931), percentage: 93.1 },
    { date: 'Jun -1', found: 420, resolved: Math.round(420 * 0.894), percentage: 89.4 },
    { date: 'Jul -1', found: 480, resolved: Math.round(480 * 0.849), percentage: 84.9 },
    { date: 'Aug -1', found: 500, resolved: Math.round(500 * 0.879), percentage: 87.9 },
    { date: 'Sep -1', found: 450, resolved: Math.round(450 * 0.848), percentage: 84.8 },
    { date: 'Okt -1', found: 360, resolved: Math.round(360 * 0.906), percentage: 90.6 },
    { date: 'Nov -1', found: 330, resolved: Math.round(330 * 0.932), percentage: 93.2 },
    { date: 'Dez -1', found: 310, resolved: Math.round(310 * 0.962), percentage: 96.2 },
    // Current year - Winter - Best performance (scaled)
    { date: 'Jan', found: 325, resolved: Math.round(325 * 0.960), percentage: 96.0 },
    { date: 'Feb', found: 315, resolved: Math.round(315 * 0.966), percentage: 96.6 },
    { date: 'Mär', found: 340, resolved: Math.round(340 * 0.958), percentage: 95.8 },
    // Spring - Good performance with occasional dips
    { date: 'Apr', found: 360, resolved: Math.round(360 * 0.946), percentage: 94.6 },
    { date: 'Mai', found: 380, resolved: Math.round(380 * 0.930), percentage: 93.0 },
    { date: 'Jun', found: 420, resolved: Math.round(420 * 0.897), percentage: 89.7 },
    // Summer - Worst performance
    { date: 'Jul', found: 490, resolved: Math.round(490 * 0.849), percentage: 84.9 },
    { date: 'Aug', found: 500, resolved: Math.round(500 * 0.913), percentage: 91.3 },
    { date: 'Sep', found: 460, resolved: Math.round(460 * 0.902), percentage: 90.2 },
    // Fall - Recovery
    { date: 'Okt', found: 360, resolved: Math.round(360 * 0.904), percentage: 90.4 },
    { date: 'Nov', found: 330, resolved: Math.round(330 * 0.930), percentage: 93.0 },
    { date: 'Dez', found: 310, resolved: Math.round(310 * 0.961), percentage: 96.1 },
  ]
  
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
