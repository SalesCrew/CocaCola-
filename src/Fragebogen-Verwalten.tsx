import { useState } from 'react'
import './fragebogen-verwalten.css'
import GebietsmanagementFragebogen from './Gebietsmanagement-Fragebogen'

interface FragebogenVerwaltenProps {
  onBack?: () => void
}

export default function FragebogenVerwalten({ onBack: _ }: FragebogenVerwaltenProps) {
  const [currentView, setCurrentView] = useState('overview')

  if (currentView === 'gebietsmanagement') {
    return <GebietsmanagementFragebogen onBack={() => setCurrentView('overview')} />
  }

  return (
    <div className="fragebogen-page">
      <div className="fragebogen-container">
        <div className="fragebogen-cards">
          {/* Gebietsmanagement Card */}
          <div 
            className="fragebogen-card gl-card"
            onClick={() => setCurrentView('gebietsmanagement')}
          >
            <div className="card-header">
              <div className="card-badge gl-badge">GL</div>
              <h2 className="card-title">Gebietsmanagement</h2>
              <p className="card-subtitle">Fragebogen Verwalten</p>
            </div>
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-number">24</span>
                <span className="stat-label">Aktive Fragebögen</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">156</span>
                <span className="stat-label">Antworten heute</span>
              </div>
            </div>
          </div>

          {/* Shelf Merchandizer Card */}
          <div className="fragebogen-card sm-card">
            <div className="card-header">
              <div className="card-badge sm-badge">SM</div>
              <h2 className="card-title">Shelf Merchandizer</h2>
              <p className="card-subtitle">Fragebögen verwalten</p>
            </div>
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-number">18</span>
                <span className="stat-label">Aktive Fragebögen</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">89</span>
                <span className="stat-label">Antworten heute</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
