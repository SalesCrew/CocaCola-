import { useState } from 'react'
import GebietsleiterHeader from './components/GebietsleiterHeader'
import GebietsleiterStatsCard from './components/GebietsleiterStatsCard'
import GebietsleiterMarketSelector from './components/GebietsleiterMarketSelector.tsx'
import './gebietsleiter.css'

interface GebietsleiterDashboardProps {
  onSwitchPage?: () => void
}

export default function GebietsleiterDashboard({ onSwitchPage }: GebietsleiterDashboardProps) {
  const [selectedMarket, setSelectedMarket] = useState<string>('')

  // Sample data - in real app this would come from props/context/API
  const gebietsleiterData = {
    name: 'Thomas Nobis',
    region: 'West',
    ipp: 5.6,
    personalGoals: 98, // percentage
    kuehlInventuren: { completed: 46, total: 50 }, // can be over 100%
    q3Einsaetze: { completed: 867, total: 912 },
    currentQuarter: 'Q3 2025'
  }

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market)
  }

  const handleFragebogenStart = () => {
    if (!selectedMarket) {
      // Show some feedback that market needs to be selected
      return
    }
    // Navigate to questionnaire or open modal
    console.log(`Starting questionnaire for ${selectedMarket}`)
  }

  return (
    <div className="gebietsleiter-dashboard">
      <GebietsleiterHeader userData={gebietsleiterData} onSwitchPage={onSwitchPage} />
      
      <main className="gebietsleiter-main">
        <div className="gebietsleiter-container">
          {/* Personal Stats Card */}
          <GebietsleiterStatsCard data={gebietsleiterData} />
          
          {/* Market Selection & Action Section */}
          <div className="gebietsleiter-action-section">
            <div className="action-section-header">
              <h2 className="action-title">Marktbesuch durchführen</h2>
              <p className="action-subtitle">Wählen Sie einen Markt aus und starten Sie den Fragebogen</p>
            </div>
            
            <GebietsleiterMarketSelector 
              selectedMarket={selectedMarket}
              onMarketSelect={handleMarketSelect}
            />
            
            <button 
              className="fragebogen-button"
              onClick={handleFragebogenStart}
              style={{ opacity: selectedMarket ? 1 : 0.5 }}
            >
              <div className="fragebogen-button-content">
                <svg className="fragebogen-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="fragebogen-text">Fragebogen ausfüllen</span>
              </div>
            </button>
          </div>

          {/* Personal Goals Carousel */}
          <div className="personal-goals-carousel">
            <div className="carousel-container">
              <div className="carousel-track">
                {/* Duplicate the goals array for infinite scroll */}
                {[
                  { name: 'Verkaufsziele', percentage: 92, current: 32, target: 35, color: '#28a745' },
                  { name: 'Kundenzufriedenheit', percentage: 87, current: 24, target: 28, color: '#17a2b8' },
                  { name: 'Produktplatzierung', percentage: 94, current: 38, target: 40, color: '#ffc107' },
                  { name: 'Marktanalyse', percentage: 78, current: 17, target: 22, color: '#6f42c1' },
                  { name: 'Teamführung', percentage: 89, current: 28, target: 31, color: '#e83e8c' },
                  { name: 'Umsatzsteigerung', percentage: 96, current: 36, target: 38, color: '#fd7e14' },
                  { name: 'Verkaufsziele', percentage: 92, current: 32, target: 35, color: '#28a745' },
                  { name: 'Kundenzufriedenheit', percentage: 87, current: 24, target: 28, color: '#17a2b8' },
                  { name: 'Produktplatzierung', percentage: 94, current: 38, target: 40, color: '#ffc107' },
                  { name: 'Marktanalyse', percentage: 78, current: 17, target: 22, color: '#6f42c1' },
                  { name: 'Teamführung', percentage: 89, current: 28, target: 31, color: '#e83e8c' },
                  { name: 'Umsatzsteigerung', percentage: 96, current: 36, target: 38, color: '#fd7e14' }
                ].map((goal, index) => (
                  <div key={index} className="goal-card">
                    <div className="goal-card-header">
                      <h3 className="goal-title">{goal.name}</h3>
                      <div 
                        className="goal-percentage"
                        style={{
                          color: goal.percentage < 50 
                            ? '#dc2626'
                            : goal.percentage < 80 
                            ? '#d97706'
                            : '#059669'
                        }}
                      >{goal.percentage}%</div>
                    </div>
                    <div className="goal-progress-container">
                      <div className="goal-progress-background">
                        <div className="goal-progress-header">
                          <div className="goal-progress-label">Fortschritt</div>
                          <div className="goal-target-number">{goal.current}/{goal.target}</div>
                        </div>
                        <div className="goal-progress-track">
                          <div 
                            className="goal-progress-fill"
                            style={{ 
                              width: `${goal.percentage}%`,
                              background: goal.percentage < 50 
                                ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                : goal.percentage < 80 
                                ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                                : 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
