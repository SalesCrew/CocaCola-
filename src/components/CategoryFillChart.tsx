import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  cooler: number
  singleServe: number
  multiServe: number
  promos: number
  warehouse: number
}

interface VotingDataPoint {
  date: string
  cooler: { sehrVoll: number; halbVoll: number; leer: number }
  singleServe: { sehrVoll: number; halbVoll: number; leer: number }
  multiServe: { sehrVoll: number; halbVoll: number; leer: number }
  promos: { sehrVoll: number; halbVoll: number; leer: number }
  warehouse: { sehrVoll: number; halbVoll: number; leer: number }
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
  
  // Toggle between fill level % and voting distribution %
  const [showVotingDistribution, setShowVotingDistribution] = useState(false)
  
  // Generate weekly data with seasonal realism (ending at KW40)
  const generateWeeklyData = (): DataPoint[] => {
    const weeks: DataPoint[] = []
    for (let w = 1; w <= 40; w++) {
      const isSummer = w >= 22 && w <= 38
      const isWinter = w <= 8 // Only early winter since we end at week 40
      const isShoulder = !isSummer && !isWinter

      // Helper to get integer in range
      const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

      let cooler: number
      let singleServe: number
      let multiServe: number
      let promos: number
      let warehouse: number

      if (isSummer) {
        // Summer: shelves emptier (0-50) for cooler/single/multi/promo, some exceptions
        cooler = rand(10, 50)
        singleServe = rand(10, 55)
        multiServe = rand(0, 45)
        promos = rand(30, 65)
        warehouse = rand(20, 60)
        // Rare exceptions to show outliers
        if (Math.random() < 0.1) cooler = rand(55, 70)
        if (Math.random() < 0.1) singleServe = rand(55, 70)
      } else if (isWinter) {
        // Winter: moderate-high, but warehouse notably emptier than cooler
        cooler = rand(70, 100)
        singleServe = rand(60, 95)
        multiServe = rand(20, 70)
        promos = rand(5, 35)
        warehouse = rand(15, 45)
      } else if (isShoulder) {
        // Spring/Autumn: moderate ranges
        cooler = rand(55, 90)
        singleServe = rand(50, 85)
        multiServe = rand(15, 60)
        promos = rand(20, 55)
        warehouse = rand(25, 70)
      } else {
        cooler = 80
        singleServe = 70
        multiServe = 40
        promos = 40
        warehouse = 50
      }

      weeks.push({
        date: `KW ${w}`,
        cooler,
        singleServe,
        multiServe,
        promos,
        warehouse
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
        let singleServe: number
        let multiServe: number
        let promos: number
        let warehouse: number
        if (isSummer) {
          cooler = rand(10, 50)
          singleServe = rand(10, 55)
          multiServe = rand(0, 45)
          promos = rand(30, 65)
          warehouse = rand(20, 60)
        } else if (isWinter) {
          cooler = rand(70, 100)
          singleServe = rand(60, 95)
          multiServe = rand(20, 70)
          promos = rand(5, 35)
          warehouse = rand(15, 45) // much emptier than cooler in winter
        } else {
          cooler = rand(55, 90)
          singleServe = rand(50, 85)
          multiServe = rand(15, 60)
          promos = rand(20, 55)
          warehouse = rand(25, 70)
        }
        all.push({
          date: `${m}${suffix}`,
          cooler,
          singleServe,
          multiServe,
          promos,
          warehouse
        })
      })
    }

    buildForYear(' -1')
    // Current year 2025 - only up to September
    monthsOrder.slice(0, 9).forEach((m) => {
      const isSummer = m === 'Jun' || m === 'Jul' || m === 'Aug'
      const isWinter = m === 'Jän' || m === 'Feb'
      let cooler: number
      let singleServe: number
      let multiServe: number
      let promos: number
      let warehouse: number
      if (isSummer) {
        cooler = rand(10, 50)
        singleServe = rand(10, 55)
        multiServe = rand(0, 45)
        promos = rand(30, 65)
        warehouse = rand(20, 60)
      } else if (isWinter) {
        cooler = rand(70, 100)
        singleServe = rand(60, 95)
        multiServe = rand(20, 70)
        promos = rand(5, 35)
        warehouse = rand(15, 45) // much emptier than cooler in winter
      } else {
        cooler = rand(55, 90)
        singleServe = rand(50, 85)
        multiServe = rand(15, 60)
        promos = rand(20, 55)
        warehouse = rand(25, 70)
      }
      all.push({
        date: `${m}`,
        cooler,
        singleServe,
        multiServe,
        promos,
        warehouse
      })
    })

    return all
  }
  const monthlyData: DataPoint[] = useMemo(() => generateMonthlyData(), [])
  
  // Daily data (100 days ending around mid-September)
  const generateDailyData = (): DataPoint[] => {
    const data: DataPoint[] = []
    const endDate = new Date(2025, 8, 15) // September 15, 2025
    
    for (let i = 99; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      
      // Simulate realistic daily patterns
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Seasonal daily behavior
      const month = date.getMonth() // 0-11
      const isSummerMonth = month >= 5 && month <= 7 // Jun-Aug
      const isWinterMonth = month === 10 || month === 11 || month === 0 || month === 1 // Nov-Feb

      let cooler: number
      let singleServe: number
      let multiServe: number
      let promos: number
      let warehouse: number

      if (isSummerMonth) {
        // Summer: emptier shelves
        cooler = Math.round(10 + Math.random() * 40) // 10-50
        singleServe = Math.round(10 + Math.random() * 45) // 10-55
        multiServe = Math.round(Math.random() * 45) // 0-45
        promos = Math.round(30 + Math.random() * 35) // 30-65
        warehouse = Math.round(20 + Math.random() * 40) // 20-60
        // small weekend bump for singleServe only
        if (isWeekend) singleServe = Math.min(60, singleServe + 5)
      } else if (isWinterMonth) {
        // Winter: moderate-high; warehouse much emptier than cooler
        cooler = Math.round(70 + Math.random() * 30) // 70-100
        singleServe = Math.round(60 + Math.random() * 35) // 60-95
        multiServe = Math.round(20 + Math.random() * 50) // 20-70
        promos = Math.round(Math.random() * 35) // 0-35
        warehouse = Math.round(15 + Math.random() * 30) // 15-45
      } else {
        // Shoulder seasons
        cooler = Math.round(55 + Math.random() * 35) // 55-90
        singleServe = Math.round(50 + Math.random() * 35) // 50-85
        multiServe = Math.round(15 + Math.random() * 45) // 15-60
        promos = Math.round(20 + Math.random() * 35) // 20-55
        warehouse = Math.round(25 + Math.random() * 45) // 25-70
      }
      
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`,
        cooler,
        singleServe,
        multiServe,
        promos,
        warehouse
      })
    }
    
    return data
  }
  
  const dailyData = useMemo(() => generateDailyData(), [])
  
  // Generate voting data with seasonal variations
  const generateVotingData = (fillData: DataPoint[]): VotingDataPoint[] => {
    return fillData.map((point) => {
      // Determine season based on date
      const isSummer = () => {
        if (interval === 'weekly') {
          const week = parseInt(point.date.replace('KW ', ''))
          return week >= 22 && week <= 38
        } else if (interval === 'monthly') {
          const month = point.date.replace(' -1', '')
          return month === 'Jun' || month === 'Jul' || month === 'Aug'
        } else { // daily
          const [, month] = point.date.split('.').map(n => parseInt(n))
          return month >= 6 && month <= 8
        }
      }
      
      const isWinter = () => {
        if (interval === 'weekly') {
          const week = parseInt(point.date.replace('KW ', ''))
          return week <= 8 // Only early winter since we end at week 40
        } else if (interval === 'monthly') {
          const month = point.date.replace(' -1', '')
          return month === 'Nov' || month === 'Dez' || month === 'Jän' || month === 'Feb'
        } else { // daily (ending in Sept, so only early months can be winter)
          const [, month] = point.date.split('.').map(n => parseInt(n))
          return month === 1 || month === 2 // Only Jan/Feb since we end in September
        }
      }
      
      const generateVoting = (category: 'cooler' | 'singleServe' | 'multiServe' | 'promos' | 'warehouse') => {
        let sehrVoll: number, halbVoll: number, leer: number
        
        if (isSummer()) {
          // Summer: More "leer" and "halb voll" votes
          if (category === 'cooler') {
            sehrVoll = 75 + Math.random() * 15 // 75-90%
            halbVoll = 5 + Math.random() * 10 // 5-15%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'singleServe') {
            sehrVoll = 70 + Math.random() * 15 // 70-85%
            halbVoll = 8 + Math.random() * 12 // 8-20%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'multiServe') {
            sehrVoll = 65 + Math.random() * 20 // 65-85%
            halbVoll = 8 + Math.random() * 15 // 8-23%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'promos') {
            sehrVoll = 60 + Math.random() * 20 // 60-80%
            halbVoll = 10 + Math.random() * 15 // 10-25%
            leer = 100 - sehrVoll - halbVoll
          } else { // warehouse
            sehrVoll = 55 + Math.random() * 25 // 55-80%
            halbVoll = 10 + Math.random() * 20 // 10-30%
            leer = 100 - sehrVoll - halbVoll
          }
        } else if (isWinter()) {
          // Winter: More "sehr voll" votes
          if (category === 'cooler') {
            sehrVoll = 88 + Math.random() * 10 // 88-98%
            halbVoll = 1 + Math.random() * 8 // 1-9%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'singleServe') {
            sehrVoll = 85 + Math.random() * 12 // 85-97%
            halbVoll = 2 + Math.random() * 8 // 2-10%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'multiServe') {
            sehrVoll = 80 + Math.random() * 15 // 80-95%
            halbVoll = 2 + Math.random() * 12 // 2-14%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'promos') {
            sehrVoll = 75 + Math.random() * 20 // 75-95%
            halbVoll = 2 + Math.random() * 15 // 2-17%
            leer = 100 - sehrVoll - halbVoll
          } else { // warehouse
            sehrVoll = 70 + Math.random() * 25 // 70-95%
            halbVoll = 2 + Math.random() * 18 // 2-20%
            leer = 100 - sehrVoll - halbVoll
          }
        } else {
          // Spring/Autumn: Normal distribution
          if (category === 'cooler') {
            sehrVoll = 85 + Math.random() * 10 // 85-95%
            halbVoll = 3 + Math.random() * 8 // 3-11%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'singleServe') {
            sehrVoll = 82 + Math.random() * 13 // 82-95%
            halbVoll = 3 + Math.random() * 10 // 3-13%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'multiServe') {
            sehrVoll = 78 + Math.random() * 17 // 78-95%
            halbVoll = 3 + Math.random() * 12 // 3-15%
            leer = 100 - sehrVoll - halbVoll
          } else if (category === 'promos') {
            sehrVoll = 75 + Math.random() * 20 // 75-95%
            halbVoll = 3 + Math.random() * 15 // 3-18%
            leer = 100 - sehrVoll - halbVoll
          } else { // warehouse
            sehrVoll = 72 + Math.random() * 23 // 72-95%
            halbVoll = 3 + Math.random() * 18 // 3-21%
            leer = 100 - sehrVoll - halbVoll
          }
        }
        
        // Ensure they add up to 100% and round to 1 decimal
        const total = sehrVoll + halbVoll + leer
        sehrVoll = Math.round((sehrVoll / total * 100) * 10) / 10
        halbVoll = Math.round((halbVoll / total * 100) * 10) / 10
        leer = Math.round((100 - sehrVoll - halbVoll) * 10) / 10
        
        return { sehrVoll, halbVoll, leer }
      }
      
      return {
        date: point.date,
        cooler: generateVoting('cooler'),
        singleServe: generateVoting('singleServe'),
        multiServe: generateVoting('multiServe'),
        promos: generateVoting('promos'),
        warehouse: generateVoting('warehouse')
      }
    })
  }
  
  const allData = interval === 'daily' ? dailyData : interval === 'weekly' ? weeklyData : monthlyData
  const votingData = useMemo(() => generateVotingData(allData), [allData, interval])
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
  const visibleVotingData = votingData.slice(visibleStartIndex, visibleEndIndex)
  
  const yMin = 0
  const yMax = 100
  const yRange = yMax - yMin
  
  const chartHeight = 240
  const chartWidth = 1100
  const padding = 30
  
  const xStep = (chartWidth - padding * 2) / (data.length - 1)
  const yScale = (chartHeight - padding) / yRange
  
  const centerOffset = 0
  
  // Create paths based on toggle state
  let chartPaths: any = {}
  
  if (showVotingDistribution && selectedLine) {
    // Show voting distribution for selected category only
    const categoryData = selectedLine as keyof VotingDataPoint
    if (categoryData !== 'date') {
      chartPaths = {
        sehrVoll: visibleVotingData.map((point, i) => {
          const x = padding + i * xStep + centerOffset
          const y = chartHeight - ((point[categoryData].sehrVoll - yMin) * yScale) - 40
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        }).join(' '),
        halbVoll: visibleVotingData.map((point, i) => {
          const x = padding + i * xStep + centerOffset
          const y = chartHeight - ((point[categoryData].halbVoll - yMin) * yScale) - 40
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        }).join(' '),
        leer: visibleVotingData.map((point, i) => {
          const x = padding + i * xStep + centerOffset
          const y = chartHeight - ((point[categoryData].leer - yMin) * yScale) - 40
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        }).join(' ')
      }
    }
  } else {
    // Show normal fill level data
    chartPaths = {
      cooler: data.map((point, i) => {
        const x = padding + i * xStep + centerOffset
        const y = chartHeight - ((point.cooler - yMin) * yScale) - 40
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      }).join(' '),
      singleServe: data.map((point, i) => {
        const x = padding + i * xStep + centerOffset
        const y = chartHeight - ((point.singleServe - yMin) * yScale) - 40
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      }).join(' '),
      multiServe: data.map((point, i) => {
        const x = padding + i * xStep + centerOffset
        const y = chartHeight - ((point.multiServe - yMin) * yScale) - 40
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      }).join(' '),
      promos: data.map((point, i) => {
        const x = padding + i * xStep + centerOffset
        const y = chartHeight - ((point.promos - yMin) * yScale) - 40
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      }).join(' '),
      warehouse: data.map((point, i) => {
        const x = padding + i * xStep + centerOffset
        const y = chartHeight - ((point.warehouse - yMin) * yScale) - 40
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      }).join(' ')
    }
  }
  
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
    if (showVotingDistribution) {
      // In voting mode, always show voting distribution for clicked category
      setSelectedLine(lineType)
    } else {
      // Normal mode - filter lines
      if (selectedLine === lineType) {
        setSelectedLine(null)
      } else {
        setSelectedLine(lineType)
      }
    }
  }

  return (
    <>
      <style>{`
        .voting-toggle-btn:focus,
        .voting-toggle-btn:active {
          background: ${showVotingDistribution ? '#28a745' : '#e9ecef'} !important;
          border: 1px solid ${showVotingDistribution ? '#28a745' : '#ced4da'} !important;
          color: ${showVotingDistribution ? '#ffffff' : '#495057'} !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
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
          
          {/* Lines - Conditional rendering based on toggle state */}
          {showVotingDistribution && selectedLine ? (
            // Show voting distribution lines for selected category
            <>
              <path 
                d={chartPaths.sehrVoll} 
                stroke="#28a745" 
                strokeWidth="3" 
                fill="none" 
              />
              <path 
                d={chartPaths.halbVoll} 
                stroke="#fd7e14" 
                strokeWidth="3" 
                fill="none" 
              />
              <path 
                d={chartPaths.leer} 
                stroke="#dc3545" 
                strokeWidth="3" 
                fill="none" 
              />
            </>
          ) : (
            // Show normal fill level lines
            <>
              <path 
                d={chartPaths.cooler} 
                stroke="#dc3545" 
                strokeWidth={selectedLine === 'cooler' ? "3" : "2"} 
                strokeOpacity={selectedLine && selectedLine !== 'cooler' ? 0.2 : 1}
                fill="none" 
              />
              <path 
                d={chartPaths.singleServe} 
                stroke="#2196F3" 
                strokeWidth={selectedLine === 'singleServe' ? "3" : "2"} 
                strokeOpacity={selectedLine && selectedLine !== 'singleServe' ? 0.2 : 1}
                fill="none" 
              />
              <path 
                d={chartPaths.multiServe} 
                stroke="#6f42c1" 
                strokeWidth={selectedLine === 'multiServe' ? "3" : "2"} 
                strokeOpacity={selectedLine && selectedLine !== 'multiServe' ? 0.2 : 1}
                fill="none" 
              />
              <path 
                d={chartPaths.promos} 
                stroke="#fd7e14" 
                strokeWidth={selectedLine === 'promos' ? "3" : "2"} 
                strokeOpacity={selectedLine && selectedLine !== 'promos' ? 0.2 : 1}
                fill="none" 
              />
              <path 
                d={chartPaths.warehouse} 
                stroke="#28a745" 
                strokeWidth={selectedLine === 'warehouse' ? "3" : "2"} 
                strokeOpacity={selectedLine && selectedLine !== 'warehouse' ? 0.2 : 1}
                fill="none" 
              />
            </>
          )}
          
          {/* Data points */}
          {showVotingDistribution && selectedLine ? (
            // Show voting distribution points for selected category
            visibleVotingData.map((point, i) => {
              const x = padding + i * xStep + centerOffset
              const categoryData = selectedLine as keyof VotingDataPoint
              if (categoryData === 'date') return null
              
              const ySehrVoll = chartHeight - ((point[categoryData].sehrVoll - yMin) * yScale) - 40
              const yHalbVoll = chartHeight - ((point[categoryData].halbVoll - yMin) * yScale) - 40
              const yLeer = chartHeight - ((point[categoryData].leer - yMin) * yScale) - 40
              
              return (
                <g key={i}>
                  <circle cx={x} cy={ySehrVoll} r="3" fill="#28a745" />
                  <circle cx={x} cy={yHalbVoll} r="3" fill="#fd7e14" />
                  <circle cx={x} cy={yLeer} r="3" fill="#dc3545" />
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
            })
          ) : (
            // Show normal fill level points
            data.map((point, i) => {
              const x = padding + i * xStep + centerOffset
              const yCooler = chartHeight - ((point.cooler - yMin) * yScale) - 40
              const ySingleServe = chartHeight - ((point.singleServe - yMin) * yScale) - 40
              const yMultiServe = chartHeight - ((point.multiServe - yMin) * yScale) - 40
              const yPromos = chartHeight - ((point.promos - yMin) * yScale) - 40
              const yWarehouse = chartHeight - ((point.warehouse - yMin) * yScale) - 40
              
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
                    cy={ySingleServe} 
                    r="3" 
                    fill="#2196F3" 
                    fillOpacity={selectedLine && selectedLine !== 'singleServe' ? 0.2 : 1}
                  />
                  <circle 
                    cx={x} 
                    cy={yMultiServe} 
                    r="3" 
                    fill="#6f42c1" 
                    fillOpacity={selectedLine && selectedLine !== 'multiServe' ? 0.2 : 1}
                  />
                  <circle 
                    cx={x} 
                    cy={yPromos} 
                    r="3" 
                    fill="#fd7e14" 
                    fillOpacity={selectedLine && selectedLine !== 'promos' ? 0.2 : 1}
                  />
                  <circle 
                    cx={x} 
                    cy={yWarehouse} 
                    r="3" 
                    fill="#28a745" 
                    fillOpacity={selectedLine && selectedLine !== 'warehouse' ? 0.2 : 1}
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
            })
          )}
          
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
                  {showVotingDistribution && selectedLine ? (
                    // Show voting distribution for selected category
                    (() => {
                      const categoryData = selectedLine as keyof VotingDataPoint
                      if (categoryData === 'date') return null
                      const votingPoint = visibleVotingData[hoveredIndex]
                      return (
                        <>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: '#495057', marginBottom: '4px' }}>
                            {selectedLine} Bewertungsverteilung:
                          </div>
                          <div className="tooltip-row">
                            <span className="tooltip-label">Sehr voll:</span>
                            <span className="tooltip-value" style={{ color: '#28a745' }}>
                              {votingPoint[categoryData].sehrVoll}%
                            </span>
                          </div>
                          <div className="tooltip-row">
                            <span className="tooltip-label">Halb voll:</span>
                            <span className="tooltip-value" style={{ color: '#fd7e14' }}>
                              {votingPoint[categoryData].halbVoll}%
                            </span>
                          </div>
                          <div className="tooltip-row">
                            <span className="tooltip-label">Leer:</span>
                            <span className="tooltip-value" style={{ color: '#dc3545' }}>
                              {votingPoint[categoryData].leer}%
                            </span>
                          </div>
                        </>
                      )
                    })()
                  ) : (
                    // Show normal fill level data
                    <>
                      <div className="tooltip-row">
                        <span className="tooltip-label">Cooler:</span>
                        <span className="tooltip-value" style={{ color: '#dc3545' }}>
                          {data[hoveredIndex].cooler}%
                        </span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label">SingleServe:</span>
                        <span className="tooltip-value" style={{ color: '#2196F3' }}>
                          {data[hoveredIndex].singleServe}%
                        </span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label">MultiServe:</span>
                        <span className="tooltip-value" style={{ color: '#6f42c1' }}>
                          {data[hoveredIndex].multiServe}%
                        </span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label">Promos:</span>
                        <span className="tooltip-value" style={{ color: '#fd7e14' }}>
                          {data[hoveredIndex].promos}%
                        </span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label">Warehouse:</span>
                        <span className="tooltip-value" style={{ color: '#28a745' }}>
                          {data[hoveredIndex].warehouse}%
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
        
        <div className="line-chart-legend" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
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
            <div className="legend-item" onClick={() => handleLegendClick('singleServe')} style={{ cursor: 'pointer' }}>
              <div 
                className="legend-line" 
                style={{ 
                  backgroundColor: '#2196F3',
                  opacity: selectedLine && selectedLine !== 'singleServe' ? 0.2 : 1
                }}
              ></div>
              <span 
                className="legend-text"
                style={{ opacity: selectedLine && selectedLine !== 'singleServe' ? 0.2 : 1 }}
              >
                SingleServe
              </span>
            </div>
            <div className="legend-item" onClick={() => handleLegendClick('multiServe')} style={{ cursor: 'pointer' }}>
              <div 
                className="legend-line" 
                style={{ 
                  backgroundColor: '#6f42c1',
                  opacity: selectedLine && selectedLine !== 'multiServe' ? 0.2 : 1
                }}
              ></div>
              <span 
                className="legend-text"
                style={{ opacity: selectedLine && selectedLine !== 'multiServe' ? 0.2 : 1 }}
              >
                MultiServe
              </span>
            </div>
            <div className="legend-item" onClick={() => handleLegendClick('promos')} style={{ cursor: 'pointer' }}>
              <div 
                className="legend-line" 
                style={{ 
                  backgroundColor: '#fd7e14',
                  opacity: selectedLine && selectedLine !== 'promos' ? 0.2 : 1
                }}
              ></div>
              <span 
                className="legend-text"
                style={{ opacity: selectedLine && selectedLine !== 'promos' ? 0.2 : 1 }}
              >
                Promos
              </span>
            </div>
            <div className="legend-item" onClick={() => handleLegendClick('warehouse')} style={{ cursor: 'pointer' }}>
              <div 
                className="legend-line" 
                style={{ 
                  backgroundColor: '#28a745',
                  opacity: selectedLine && selectedLine !== 'warehouse' ? 0.2 : 1
                }}
              ></div>
              <span 
                className="legend-text"
                style={{ opacity: selectedLine && selectedLine !== 'warehouse' ? 0.2 : 1 }}
              >
                Warehouse
              </span>
            </div>
          </div>
          
          <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
            <button 
              className="voting-toggle-btn"
              onClick={() => {
                if (!showVotingDistribution) {
                  // Entering voting mode - automatically select cooler
                  setShowVotingDistribution(true)
                  setSelectedLine('cooler')
                } else {
                  // Exiting voting mode
                  setShowVotingDistribution(false)
                  setSelectedLine(null)
                }
              }}
              style={{
                padding: '6px 12px',
                background: showVotingDistribution ? '#28a745' : '#e9ecef',
                border: `1px solid ${showVotingDistribution ? '#28a745' : '#ced4da'}`,
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '500',
                color: showVotingDistribution ? '#ffffff' : '#495057',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              title={showVotingDistribution ? 'Zeige Füllstand %' : 'Zeige Bewertungsverteilung %'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              {showVotingDistribution ? 'Bewertung %' : 'Füllstand %'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
