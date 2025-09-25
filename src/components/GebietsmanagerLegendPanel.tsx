export default function GebietsmanagerLegendPanel() {
  return (
    <div className="legend-container">
      <div className="legend-body">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot dot-blue"></div>
            <span className="legend-label">Standardbesuche</span>
            <span className="legend-number num-blue">680</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot dot-lightblue"></div>
            <span className="legend-label">Flexbesuche</span>
            <span className="legend-number num-lightblue">270</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot dot-yellow"></div>
            <span className="legend-label">Kühlerinventuren</span>
            <span className="legend-number num-yellow">73</span>
          </div>
        </div>
        <div className="legend-divider"></div>
        <div className="legend-visits">
          <div className="legend-visits-dot"></div>
          <span className="legend-visits-text">1023 Visits</span>
        </div>
      </div>
    </div>
  )
}