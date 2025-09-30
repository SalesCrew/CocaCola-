import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

interface DataPoint {
  date: string
  ipp: number
  schuetten: number
  displays: number
  platzierungenOhneMaterial: number
  platzierungenMitMaterial: number
  grossplatzierungen: number
  permanentRacks: number
  flexziel: number
  zweitplatzierungen: number
  e3: number
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
  
  // Legend visibility state for all lines
  const [showSchuetten, setShowSchuetten] = useState(false)
  const [showDisplays, setShowDisplays] = useState(false)
  const [showPlatzierungenOhneMaterial, setShowPlatzierungenOhneMaterial] = useState(false)
  const [showPlatzierungenMitMaterial, setShowPlatzierungenMitMaterial] = useState(false)
  const [showGrossplatzierungen, setShowGrossplatzierungen] = useState(false)
  const [showPermanentRacks, setShowPermanentRacks] = useState(false)
  const [showFlexziel, setShowFlexziel] = useState(false)
  const [showZweitplatzierungen, setShowZweitplatzierungen] = useState(false)
  const [showE3, setShowE3] = useState(false)
  
  // Deterministic helpers
  const round1 = (n: number) => Math.round(n * 10) / 10
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const noise = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  const generateWeeklyData = (): DataPoint[] => {
    const result: DataPoint[] = []
    for (let w = 1; w <= 40; w++) {
      const isPrevYear = w <= 19 // 2024 weeks
      let ippMin: number, ippMax: number
      if (isPrevYear) {
        // 2024: 4.5–5.2, winter (KW 1–8) slightly higher within range
        if (w <= 8) { ippMin = 4.9; ippMax = 5.2 } else { ippMin = 4.5; ippMax = 5.0 }
      } else {
        // 2025: steadily climb from 5.2 to 6.1 with slight pullbacks (weeks 20-40)
        const progressInYear = (w - 20) / 20 // 0 to 1 over weeks 20-40
        const baseMin = 5.2 + (progressInYear * 0.7) // Climb from 5.2 to 5.9
        const baseMax = 5.2 + (progressInYear * 0.9) // Climb from 5.2 to 6.1
        
        // Add slight pullbacks (every ~6 weeks)
        const pullbackFactor = Math.sin((w - 20) * 0.3) * 0.1 // Slight dips
        ippMin = Math.max(5.2, baseMin + pullbackFactor - 0.1)
        ippMax = Math.min(6.1, baseMax + pullbackFactor + 0.1)
      }
      // Add more variation for small gains and losses
      const baseIpp = lerp(ippMin, ippMax, noise(w * 1.37))
      const volatility = (noise(w * 3.47) - 0.5) * 0.3 // ±0.15 variation
      const ipp = round1(Math.max(ippMin - 0.1, Math.min(ippMax + 0.1, baseIpp + volatility)))
      
      // All components add up to IPP - distribute proportionally
      const schuetten = round1(ipp * 0.15 + noise(w * 2.11) * 0.1) // ~15% of IPP
      const displays = round1(ipp * 0.12 + noise(w * 2.22) * 0.08) // ~12% of IPP
      const platzierungenOhneMaterial = round1(ipp * 0.08 + noise(w * 2.33) * 0.05) // ~8% of IPP
      const platzierungenMitMaterial = round1(ipp * 0.10 + noise(w * 2.44) * 0.06) // ~10% of IPP
      const grossplatzierungen = round1(ipp * 0.06 + noise(w * 2.55) * 0.04) // ~6% of IPP
      const permanentRacks = round1(ipp * 0.05 + noise(w * 2.66) * 0.03) // ~5% of IPP
      const flexziel = round1(ipp * 0.07 + noise(w * 2.77) * 0.04) // ~7% of IPP
      const zweitplatzierungen = round1(ipp * 0.25 + noise(w * 2.88) * 0.15) // ~25% of IPP
      const e3 = round1(ipp * 0.04 + noise(w * 2.99) * 0.02) // ~4% of IPP
      
      // Ensure they don't exceed IPP total (adjust proportionally if needed)
      const total = schuetten + displays + platzierungenOhneMaterial + platzierungenMitMaterial + grossplatzierungen + permanentRacks + flexziel + zweitplatzierungen + e3
      const factor = total > ipp ? ipp / total : 1
      
      result.push({ 
        date: `KW ${w}`, 
        ipp, 
        schuetten: round1(schuetten * factor),
        displays: round1(displays * factor),
        platzierungenOhneMaterial: round1(platzierungenOhneMaterial * factor),
        platzierungenMitMaterial: round1(platzierungenMitMaterial * factor),
        grossplatzierungen: round1(grossplatzierungen * factor),
        permanentRacks: round1(permanentRacks * factor),
        flexziel: round1(flexziel * factor),
        zweitplatzierungen: round1(zweitplatzierungen * factor),
        e3: round1(e3 * factor)
      })
    }
    return result
  }

  const weeklyData: DataPoint[] = useMemo(generateWeeklyData, [])
  
  const generateMonthlyData = (): DataPoint[] => {
    const months = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    const out: DataPoint[] = []
    // Previous year (2024): 4.5–5.2, winter higher
    months.forEach((m, idx) => {
      const isWinter = [0, 1, 10, 11].includes(idx) // Jan, Feb, Nov, Dez
      const [min, max] = isWinter ? [4.9, 5.2] : [4.5, 5.0]
      // Add more variation for small gains and losses
      const baseIpp = lerp(min, max, noise((idx + 1) * 4.17))
      const volatility = (noise((idx + 1) * 6.23) - 0.5) * 0.3 // ±0.15 variation
      const ipp = round1(Math.max(min - 0.1, Math.min(max + 0.1, baseIpp + volatility)))
      
      // Generate all components that add up to IPP
      const schuetten = round1(ipp * 0.15 + noise((idx + 1) * 3.11) * 0.1)
      const displays = round1(ipp * 0.12 + noise((idx + 1) * 3.22) * 0.08)
      const platzierungenOhneMaterial = round1(ipp * 0.08 + noise((idx + 1) * 3.33) * 0.05)
      const platzierungenMitMaterial = round1(ipp * 0.10 + noise((idx + 1) * 3.44) * 0.06)
      const grossplatzierungen = round1(ipp * 0.06 + noise((idx + 1) * 3.55) * 0.04)
      const permanentRacks = round1(ipp * 0.05 + noise((idx + 1) * 3.66) * 0.03)
      const flexziel = round1(ipp * 0.07 + noise((idx + 1) * 3.77) * 0.04)
      const zweitplatzierungen = round1(ipp * 0.25 + noise((idx + 1) * 3.88) * 0.15)
      const e3 = round1(ipp * 0.04 + noise((idx + 1) * 3.99) * 0.02)
      
      const total = schuetten + displays + platzierungenOhneMaterial + platzierungenMitMaterial + grossplatzierungen + permanentRacks + flexziel + zweitplatzierungen + e3
      const factor = total > ipp ? ipp / total : 1
      
      out.push({ 
        date: `${m} -1`, 
        ipp, 
        schuetten: round1(schuetten * factor),
        displays: round1(displays * factor),
        platzierungenOhneMaterial: round1(platzierungenOhneMaterial * factor),
        platzierungenMitMaterial: round1(platzierungenMitMaterial * factor),
        grossplatzierungen: round1(grossplatzierungen * factor),
        permanentRacks: round1(permanentRacks * factor),
        flexziel: round1(flexziel * factor),
        zweitplatzierungen: round1(zweitplatzierungen * factor),
        e3: round1(e3 * factor)
      })
    })
    // Current year (2025): steadily climb from 5.2 to 6.1, only up to September
    months.slice(0, 9).forEach((m, idx) => {
      // Progressive climb from 5.2 (Jan) to 6.1 (Sep) with slight pullbacks
      const progressInYear = idx / 8 // 0 to 1 over Jan-Sep (9 months)
      const baseMin = 5.2 + (progressInYear * 0.7) // Climb from 5.2 to 5.9
      const baseMax = 5.2 + (progressInYear * 0.9) // Climb from 5.2 to 6.1
      
      // Add slight pullbacks (every ~3 months)
      const pullbackFactor = Math.sin(idx * 0.8) * 0.08 // Slight monthly dips
      let min = Math.max(5.2, baseMin + pullbackFactor - 0.05)
      let max = Math.min(6.1, baseMax + pullbackFactor + 0.05)
      // Add more variation for small gains and losses
      const baseIpp = lerp(min, max, noise((idx + 13) * 4.17))
      const volatility = (noise((idx + 13) * 7.41) - 0.5) * 0.3 // ±0.15 variation
      const ipp = round1(Math.max(min - 0.1, Math.min(max + 0.1, baseIpp + volatility)))
      
      // Generate all components that add up to IPP for 2025
      const schuetten = round1(ipp * 0.15 + noise((idx + 13) * 4.11) * 0.1)
      const displays = round1(ipp * 0.12 + noise((idx + 13) * 4.22) * 0.08)
      const platzierungenOhneMaterial = round1(ipp * 0.08 + noise((idx + 13) * 4.33) * 0.05)
      const platzierungenMitMaterial = round1(ipp * 0.10 + noise((idx + 13) * 4.44) * 0.06)
      const grossplatzierungen = round1(ipp * 0.06 + noise((idx + 13) * 4.55) * 0.04)
      const permanentRacks = round1(ipp * 0.05 + noise((idx + 13) * 4.66) * 0.03)
      const flexziel = round1(ipp * 0.07 + noise((idx + 13) * 4.77) * 0.04)
      const zweitplatzierungen = round1(ipp * 0.25 + noise((idx + 13) * 4.88) * 0.15)
      const e3 = round1(ipp * 0.04 + noise((idx + 13) * 4.99) * 0.02)
      
      const total = schuetten + displays + platzierungenOhneMaterial + platzierungenMitMaterial + grossplatzierungen + permanentRacks + flexziel + zweitplatzierungen + e3
      const factor = total > ipp ? ipp / total : 1
      
      out.push({ 
        date: `${m}`, 
        ipp, 
        schuetten: round1(schuetten * factor),
        displays: round1(displays * factor),
        platzierungenOhneMaterial: round1(platzierungenOhneMaterial * factor),
        platzierungenMitMaterial: round1(platzierungenMitMaterial * factor),
        grossplatzierungen: round1(grossplatzierungen * factor),
        permanentRacks: round1(permanentRacks * factor),
        flexziel: round1(flexziel * factor),
        zweitplatzierungen: round1(zweitplatzierungen * factor),
        e3: round1(e3 * factor)
      })
    })
    return out
  }

  const monthlyData: DataPoint[] = useMemo(generateMonthlyData, [])
  
  // Daily data (100 days ending around mid-September) - Deterministic seasonal values
  const generateDailyData = (): DataPoint[] => {
    const data: DataPoint[] = []
    const endDate = new Date(2025, 8, 15) // September 15, 2025
    for (let i = 99; i >= 0; i--) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)
      const year = date.getFullYear()
      const month = date.getMonth() // 0-11
      let min = 5.2, max = 5.4
      // 2024 window (if included)
      if (year === 2024) {
        const isWinter = [0,1,10,11].includes(month)
        ;[min, max] = isWinter ? [4.9, 5.2] : [4.5, 5.0]
      } else {
        // 2025: steadily climb from 5.2 to 6.1 with slight pullbacks
        const progressInYear = month / 8 // 0 to 1 over Jan-Sep
        const baseMin = 5.2 + (progressInYear * 0.7) // Climb from 5.2 to 5.9
        const baseMax = 5.2 + (progressInYear * 0.9) // Climb from 5.2 to 6.1
        
        // Add slight pullbacks
        const pullbackFactor = Math.sin(month * 0.8) * 0.08
        min = Math.max(5.2, baseMin + pullbackFactor - 0.05)
        max = Math.min(6.1, baseMax + pullbackFactor + 0.05)
      }
      const seed = date.getTime() / (24*60*60*1000)
      // Add more variation for small gains and losses
      const baseIpp = lerp(min, max, noise(seed))
      const volatility = (noise(seed * 8.91) - 0.5) * 0.3 // ±0.15 variation
      const ipp = round1(Math.max(min - 0.1, Math.min(max + 0.1, baseIpp + volatility)))
      
      // Generate all components for daily data
      const schuetten = round1(ipp * 0.15 + noise(seed * 5.11) * 0.1)
      const displays = round1(ipp * 0.12 + noise(seed * 5.22) * 0.08)
      const platzierungenOhneMaterial = round1(ipp * 0.08 + noise(seed * 5.33) * 0.05)
      const platzierungenMitMaterial = round1(ipp * 0.10 + noise(seed * 5.44) * 0.06)
      const grossplatzierungen = round1(ipp * 0.06 + noise(seed * 5.55) * 0.04)
      const permanentRacks = round1(ipp * 0.05 + noise(seed * 5.66) * 0.03)
      const flexziel = round1(ipp * 0.07 + noise(seed * 5.77) * 0.04)
      const zweitplatzierungen = round1(ipp * 0.25 + noise(seed * 5.88) * 0.15)
      const e3 = round1(ipp * 0.04 + noise(seed * 5.99) * 0.02)
      
      const total = schuetten + displays + platzierungenOhneMaterial + platzierungenMitMaterial + grossplatzierungen + permanentRacks + flexziel + zweitplatzierungen + e3
      const factor = total > ipp ? ipp / total : 1
      
      data.push({
        date: `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`,
        ipp,
        schuetten: round1(schuetten * factor),
        displays: round1(displays * factor),
        platzierungenOhneMaterial: round1(platzierungenOhneMaterial * factor),
        platzierungenMitMaterial: round1(platzierungenMitMaterial * factor),
        grossplatzierungen: round1(grossplatzierungen * factor),
        permanentRacks: round1(permanentRacks * factor),
        flexziel: round1(flexziel * factor),
        zweitplatzierungen: round1(zweitplatzierungen * factor),
        e3: round1(e3 * factor)
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
  
  // Calculate cumulative data for display
  const cumulativeData = data.map(point => {
    const activeComponents: { key: keyof DataPoint; show: boolean; value: number }[] = [
      { key: 'schuetten', show: showSchuetten, value: point.schuetten },
      { key: 'displays', show: showDisplays, value: point.displays },
      { key: 'platzierungenOhneMaterial', show: showPlatzierungenOhneMaterial, value: point.platzierungenOhneMaterial },
      { key: 'platzierungenMitMaterial', show: showPlatzierungenMitMaterial, value: point.platzierungenMitMaterial },
      { key: 'grossplatzierungen', show: showGrossplatzierungen, value: point.grossplatzierungen },
      { key: 'permanentRacks', show: showPermanentRacks, value: point.permanentRacks },
      { key: 'flexziel', show: showFlexziel, value: point.flexziel },
      { key: 'zweitplatzierungen', show: showZweitplatzierungen, value: point.zweitplatzierungen },
      { key: 'e3', show: showE3, value: point.e3 }
    ]
    
    // Calculate cumulative values for active components
    let cumulative = 0
    const cumulativeValues: { [key: string]: number } = {}
    
    activeComponents.forEach(comp => {
      if (comp.show) {
        cumulative += comp.value
        cumulativeValues[comp.key] = cumulative
      }
    })
    
    return {
      ...point,
      cumulative: cumulativeValues
    }
  })
  
  // Calculate actual min/max from all visible data including cumulative values
  const allValues = data.flatMap(d => {
    const values = [d.ipp]
    if (showSchuetten) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.schuetten || 0)
    if (showDisplays) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.displays || 0)
    if (showPlatzierungenOhneMaterial) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.platzierungenOhneMaterial || 0)
    if (showPlatzierungenMitMaterial) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.platzierungenMitMaterial || 0)
    if (showGrossplatzierungen) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.grossplatzierungen || 0)
    if (showPermanentRacks) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.permanentRacks || 0)
    if (showFlexziel) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.flexziel || 0)
    if (showZweitplatzierungen) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.zweitplatzierungen || 0)
    if (showE3) values.push(cumulativeData[data.indexOf(d)]?.cumulative?.e3 || 0)
    return values
  })
  
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  
  // Add buffer of 0.6 to min/max for better visualization, never go below 0
  const yMin = Math.max(0, minValue - 0.6)
  const yMax = maxValue + 0.6
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
  
  // Generate cumulative paths for all lines
  const schuettenPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.schuetten || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const displaysPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.displays || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const platzierungenOhneMaterialPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.platzierungenOhneMaterial || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const platzierungenMitMaterialPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.platzierungenMitMaterial || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const grossplatzierungenPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.grossplatzierungen || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const permanentRacksPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.permanentRacks || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const flexzielPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.flexziel || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const zweitplatzierungenPath = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.zweitplatzierungen || 0 - yMin) * yScale) - 40
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')
  
  const e3Path = cumulativeData.map((point, i) => {
    const x = padding + i * xStep + centerOffset
    const y = chartHeight - ((point.cumulative.e3 || 0 - yMin) * yScale) - 40
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
            <linearGradient id="schuettenFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc3545" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc3545" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="displaysFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6f42c1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6f42c1" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="platzierungenOhneMaterialFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="platzierungenMitMaterialFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#17a2b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#17a2b8" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="grossplatzierungenFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffc107" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffc107" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="permanentRacksFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6c757d" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6c757d" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="flexzielFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#20c997" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#20c997" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="zweitplatzierungenFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2196F3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2196F3" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="e3FillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e83e8c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e83e8c" stopOpacity="0.1" />
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
          
          {/* Dynamic fill areas for cumulative chart */}
          {(() => {
            const activeLines: { path: string; cumulativeData: number[]; gradient: string }[] = []
            if (true) activeLines.push({ path: ippPath, cumulativeData: data.map(d => d.ipp), gradient: 'ippFillGradient' }) // IPP always active
            if (showSchuetten) activeLines.push({ path: schuettenPath, cumulativeData: cumulativeData.map(d => d.cumulative.schuetten || 0), gradient: 'schuettenFillGradient' })
            if (showDisplays) activeLines.push({ path: displaysPath, cumulativeData: cumulativeData.map(d => d.cumulative.displays || 0), gradient: 'displaysFillGradient' })
            if (showPlatzierungenOhneMaterial) activeLines.push({ path: platzierungenOhneMaterialPath, cumulativeData: cumulativeData.map(d => d.cumulative.platzierungenOhneMaterial || 0), gradient: 'platzierungenOhneMaterialFillGradient' })
            if (showPlatzierungenMitMaterial) activeLines.push({ path: platzierungenMitMaterialPath, cumulativeData: cumulativeData.map(d => d.cumulative.platzierungenMitMaterial || 0), gradient: 'platzierungenMitMaterialFillGradient' })
            if (showGrossplatzierungen) activeLines.push({ path: grossplatzierungenPath, cumulativeData: cumulativeData.map(d => d.cumulative.grossplatzierungen || 0), gradient: 'grossplatzierungenFillGradient' })
            if (showPermanentRacks) activeLines.push({ path: permanentRacksPath, cumulativeData: cumulativeData.map(d => d.cumulative.permanentRacks || 0), gradient: 'permanentRacksFillGradient' })
            if (showFlexziel) activeLines.push({ path: flexzielPath, cumulativeData: cumulativeData.map(d => d.cumulative.flexziel || 0), gradient: 'flexzielFillGradient' })
            if (showZweitplatzierungen) activeLines.push({ path: zweitplatzierungenPath, cumulativeData: cumulativeData.map(d => d.cumulative.zweitplatzierungen || 0), gradient: 'zweitplatzierungenFillGradient' })
            if (showE3) activeLines.push({ path: e3Path, cumulativeData: cumulativeData.map(d => d.cumulative.e3 || 0), gradient: 'e3FillGradient' })
            
            // Sort by highest cumulative values (reverse order for stacking)
            activeLines.sort((a, b) => Math.max(...a.cumulativeData) - Math.max(...b.cumulativeData))
            
            return activeLines.map((line, index) => {
              let fillPath
              if (index === 0) {
                // First (lowest) line fills to ground
                fillPath = `${line.path} L ${padding + (data.length - 1) * xStep + centerOffset} ${chartHeight - 40} L ${padding + centerOffset} ${chartHeight - 40} Z`
              } else {
                // Fill to previous (lower) line
                const prevLine = activeLines[index - 1]
                const reversePath = cumulativeData.slice().reverse().map((_point, i) => {
                  const originalIndex = data.length - 1 - i
                  const x = padding + originalIndex * xStep + centerOffset
                  const y = chartHeight - ((prevLine.cumulativeData[originalIndex] - yMin) * yScale) - 40
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
          
          {/* IPP line - always visible */}
          <path d={ippPath} stroke="#28a745" strokeWidth="2" fill="none" />
          
          {/* All optional lines */}
          {showSchuetten && (
            <path d={schuettenPath} stroke="#dc3545" strokeWidth="2" fill="none" />
          )}
          {showDisplays && (
            <path d={displaysPath} stroke="#6f42c1" strokeWidth="2" fill="none" />
          )}
          {showPlatzierungenOhneMaterial && (
            <path d={platzierungenOhneMaterialPath} stroke="#ff6b35" strokeWidth="2" fill="none" />
          )}
          {showPlatzierungenMitMaterial && (
            <path d={platzierungenMitMaterialPath} stroke="#17a2b8" strokeWidth="2" fill="none" />
          )}
          {showGrossplatzierungen && (
            <path d={grossplatzierungenPath} stroke="#ffc107" strokeWidth="2" fill="none" />
          )}
          {showPermanentRacks && (
            <path d={permanentRacksPath} stroke="#6c757d" strokeWidth="2" fill="none" />
          )}
          {showFlexziel && (
            <path d={flexzielPath} stroke="#20c997" strokeWidth="2" fill="none" />
          )}
          {showZweitplatzierungen && (
            <path d={zweitplatzierungenPath} stroke="#2196F3" strokeWidth="2" fill="none" />
          )}
          {showE3 && (
            <path d={e3Path} stroke="#e83e8c" strokeWidth="2" fill="none" />
          )}
          
          {/* Data points - using cumulative positions */}
          {cumulativeData.map((point, i) => {
            const x = padding + i * xStep + centerOffset
            const yIPP = chartHeight - ((point.ipp - yMin) * yScale) - 40
            
            return (
              <g key={i}>
                <circle cx={x} cy={yIPP} r="3" fill="#28a745" />
                {showSchuetten && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.schuetten || 0 - yMin) * yScale) - 40} r="3" fill="#dc3545" />
                )}
                {showDisplays && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.displays || 0 - yMin) * yScale) - 40} r="3" fill="#6f42c1" />
                )}
                {showPlatzierungenOhneMaterial && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.platzierungenOhneMaterial || 0 - yMin) * yScale) - 40} r="3" fill="#ff6b35" />
                )}
                {showPlatzierungenMitMaterial && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.platzierungenMitMaterial || 0 - yMin) * yScale) - 40} r="3" fill="#17a2b8" />
                )}
                {showGrossplatzierungen && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.grossplatzierungen || 0 - yMin) * yScale) - 40} r="3" fill="#ffc107" />
                )}
                {showPermanentRacks && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.permanentRacks || 0 - yMin) * yScale) - 40} r="3" fill="#6c757d" />
                )}
                {showFlexziel && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.flexziel || 0 - yMin) * yScale) - 40} r="3" fill="#20c997" />
                )}
                {showZweitplatzierungen && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.zweitplatzierungen || 0 - yMin) * yScale) - 40} r="3" fill="#2196F3" />
                )}
                {showE3 && (
                  <circle cx={x} cy={chartHeight - ((point.cumulative.e3 || 0 - yMin) * yScale) - 40} r="3" fill="#e83e8c" />
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
        
        {/* Tooltip - shows original individual values, not cumulative */}
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
                  {showSchuetten && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Schütten:</span>
                      <span className="tooltip-value" style={{ color: '#dc3545' }}>
                        {data[hoveredIndex].schuetten.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showDisplays && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Displays:</span>
                      <span className="tooltip-value" style={{ color: '#6f42c1' }}>
                        {data[hoveredIndex].displays.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showPlatzierungenOhneMaterial && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Platzierungen ohne Material:</span>
                      <span className="tooltip-value" style={{ color: '#ff6b35' }}>
                        {data[hoveredIndex].platzierungenOhneMaterial.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showPlatzierungenMitMaterial && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Platzierungen mit Material:</span>
                      <span className="tooltip-value" style={{ color: '#17a2b8' }}>
                        {data[hoveredIndex].platzierungenMitMaterial.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showGrossplatzierungen && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Großplatzierungen:</span>
                      <span className="tooltip-value" style={{ color: '#ffc107' }}>
                        {data[hoveredIndex].grossplatzierungen.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showPermanentRacks && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">permanent Racks:</span>
                      <span className="tooltip-value" style={{ color: '#6c757d' }}>
                        {data[hoveredIndex].permanentRacks.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showFlexziel && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Flexziel:</span>
                      <span className="tooltip-value" style={{ color: '#20c997' }}>
                        {data[hoveredIndex].flexziel.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showZweitplatzierungen && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">Zweitplatzierungen:</span>
                      <span className="tooltip-value" style={{ color: '#2196F3' }}>
                        {data[hoveredIndex].zweitplatzierungen.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showE3 && (
                    <div className="tooltip-row">
                      <span className="tooltip-label">E3:</span>
                      <span className="tooltip-value" style={{ color: '#e83e8c' }}>
                        {data[hoveredIndex].e3.toFixed(1)}
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
          {/* IPP-Werte - always active */}
          <div className="legend-item">
            <div className="legend-line" style={{ backgroundColor: '#28a745' }}></div>
            <span className="legend-text">IPP-Werte</span>
          </div>
          
          {/* Schütten */}
          <div className="legend-item" onClick={() => setShowSchuetten(!showSchuetten)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showSchuetten ? '#dc3545' : 'transparent',
              border: showSchuetten ? 'none' : '1.5px solid #dc3545',
              position: 'relative'
            }}>
              {!showSchuetten && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#dc3545', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showSchuetten ? 'none' : 'line-through', opacity: showSchuetten ? 1 : 0.6 }}>Schütten</span>
          </div>
          
          {/* Displays */}
          <div className="legend-item" onClick={() => setShowDisplays(!showDisplays)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showDisplays ? '#6f42c1' : 'transparent',
              border: showDisplays ? 'none' : '1.5px solid #6f42c1',
              position: 'relative'
            }}>
              {!showDisplays && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#6f42c1', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showDisplays ? 'none' : 'line-through', opacity: showDisplays ? 1 : 0.6 }}>Displays</span>
          </div>
          
          {/* Platzierungen ohne Material */}
          <div className="legend-item" onClick={() => setShowPlatzierungenOhneMaterial(!showPlatzierungenOhneMaterial)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showPlatzierungenOhneMaterial ? '#ff6b35' : 'transparent',
              border: showPlatzierungenOhneMaterial ? 'none' : '1.5px solid #ff6b35',
              position: 'relative'
            }}>
              {!showPlatzierungenOhneMaterial && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#ff6b35', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showPlatzierungenOhneMaterial ? 'none' : 'line-through', opacity: showPlatzierungenOhneMaterial ? 1 : 0.6 }}>Platzierungen ohne Material</span>
          </div>
          
          {/* Platzierungen mit Material */}
          <div className="legend-item" onClick={() => setShowPlatzierungenMitMaterial(!showPlatzierungenMitMaterial)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showPlatzierungenMitMaterial ? '#17a2b8' : 'transparent',
              border: showPlatzierungenMitMaterial ? 'none' : '1.5px solid #17a2b8',
              position: 'relative'
            }}>
              {!showPlatzierungenMitMaterial && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#17a2b8', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showPlatzierungenMitMaterial ? 'none' : 'line-through', opacity: showPlatzierungenMitMaterial ? 1 : 0.6 }}>Platzierungen mit Material</span>
          </div>
          
          {/* Großplatzierungen */}
          <div className="legend-item" onClick={() => setShowGrossplatzierungen(!showGrossplatzierungen)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showGrossplatzierungen ? '#ffc107' : 'transparent',
              border: showGrossplatzierungen ? 'none' : '1.5px solid #ffc107',
              position: 'relative'
            }}>
              {!showGrossplatzierungen && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#ffc107', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showGrossplatzierungen ? 'none' : 'line-through', opacity: showGrossplatzierungen ? 1 : 0.6 }}>Großplatzierungen</span>
          </div>
          
          {/* permanent Racks */}
          <div className="legend-item" onClick={() => setShowPermanentRacks(!showPermanentRacks)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showPermanentRacks ? '#6c757d' : 'transparent',
              border: showPermanentRacks ? 'none' : '1.5px solid #6c757d',
              position: 'relative'
            }}>
              {!showPermanentRacks && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#6c757d', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showPermanentRacks ? 'none' : 'line-through', opacity: showPermanentRacks ? 1 : 0.6 }}>permanent Racks</span>
          </div>
          
          {/* Flexziel */}
          <div className="legend-item" onClick={() => setShowFlexziel(!showFlexziel)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showFlexziel ? '#20c997' : 'transparent',
              border: showFlexziel ? 'none' : '1.5px solid #20c997',
              position: 'relative'
            }}>
              {!showFlexziel && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#20c997', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showFlexziel ? 'none' : 'line-through', opacity: showFlexziel ? 1 : 0.6 }}>Flexziel</span>
          </div>
          
          {/* Zweitplatzierungen */}
          <div className="legend-item" onClick={() => setShowZweitplatzierungen(!showZweitplatzierungen)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showZweitplatzierungen ? '#2196F3' : 'transparent',
              border: showZweitplatzierungen ? 'none' : '1.5px solid #2196F3',
              position: 'relative'
            }}>
              {!showZweitplatzierungen && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#2196F3', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showZweitplatzierungen ? 'none' : 'line-through', opacity: showZweitplatzierungen ? 1 : 0.6 }}>Zweitplatzierungen</span>
          </div>
          
          {/* E3 */}
          <div className="legend-item" onClick={() => setShowE3(!showE3)} style={{ cursor: 'pointer' }}>
            <div className="legend-line" style={{ 
              backgroundColor: showE3 ? '#e83e8c' : 'transparent',
              border: showE3 ? 'none' : '1.5px solid #e83e8c',
              position: 'relative'
            }}>
              {!showE3 && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#e83e8c', transform: 'translateY(-50%)' }} />}
            </div>
            <span className="legend-text" style={{ textDecoration: showE3 ? 'none' : 'line-through', opacity: showE3 ? 1 : 0.6 }}>E3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
