export default function LegendPanel() {
  return (
    <div className="legend-container">
      <div className="legend-body">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot dot-lightgreen"></div>
            <span className="legend-label">Visits ohne OOS-Situation</span>
            <span className="legend-number num-lightgreen">800</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot dot-green"></div>
            <span className="legend-label">Visits mit behobener OOS-Situationen</span>
            <span className="legend-number num-green">370</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot dot-red"></div>
            <span className="legend-label">Visits mit nicht behebbarer OOS-Situationen</span>
            <span className="legend-number num-red">30</span>
          </div>
        </div>
        <div className="legend-divider"></div>
        <div className="legend-visits">
          <div className="legend-visits-dot"></div>
          <span className="legend-visits-text">1200 Visits</span>
        </div>
      </div>
    </div>
  )
}
