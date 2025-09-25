interface DonutChartProps {
  onClick?: () => void
}

export default function DonutChart({ onClick }: DonutChartProps) {
  // Data from screenshot: Green segments with red accent
  const data = [
    { value: 370, color: '#28a745' }, // Dark green - behobene OOS
    { value: 800, color: '#6fc96f' }, // Light green - ohne OOS
    { value: 30, color: '#dc3545' }   // Red - nicht behebbar
  ]
  
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90 // Start at top
  
  const radius = 110
  const strokeWidth = 32
  const center = 140
  
  return (
    <div className="donut-chart" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <svg width="280" height="280" viewBox="0 0 280 280">
        <defs>
          <filter id="donutShadow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="objectBoundingBox">
            {/* Outer shadow (even stronger) */}
            <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000000" floodOpacity="0.42" result="outerShadow" />
            {/* Inner shadow (deeper) */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="blur" />
            <feOffset dx="0" dy="1.5" in="blur" result="offsetBlur" />
            <feComposite in="offsetBlur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
            <feColorMatrix in="innerShadow" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="innerShadowColor" />
            <feMerge>
              <feMergeNode in="outerShadow" />
              <feMergeNode in="innerShadowColor" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#donutShadow)">
        {data.map((segment, index) => {
          const angle = (segment.value / total) * 360
          const gapSize = 2 // degrees gap between segments
          const startAngle = currentAngle
          const endAngle = currentAngle + angle - gapSize
          
          const outerRadius = radius
          const innerRadius = radius - strokeWidth
          
          const x1 = center + outerRadius * Math.cos((startAngle * Math.PI) / 180)
          const y1 = center + outerRadius * Math.sin((startAngle * Math.PI) / 180)
          const x2 = center + outerRadius * Math.cos((endAngle * Math.PI) / 180)
          const y2 = center + outerRadius * Math.sin((endAngle * Math.PI) / 180)
          
          const x3 = center + innerRadius * Math.cos((endAngle * Math.PI) / 180)
          const y3 = center + innerRadius * Math.sin((endAngle * Math.PI) / 180)
          const x4 = center + innerRadius * Math.cos((startAngle * Math.PI) / 180)
          const y4 = center + innerRadius * Math.sin((startAngle * Math.PI) / 180)
          
          const largeArc = angle > 180 ? 1 : 0
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ')
          
          currentAngle += angle
          
          return (
            <path
              key={index}
              d={pathData}
              fill={segment.color}
              fillOpacity={0.3}
              stroke={segment.color}
              strokeOpacity={0.6}
              strokeWidth="2"
            />
          )
        })}
        </g>
        
        {/* Center text */}
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          className="chart-center-label"
        >
          OOS behoben
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="chart-center-percentage"
        >
          92,3%
        </text>
      </svg>
    </div>
  )
}