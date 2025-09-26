import { useState } from 'react'

interface GebietsmanagementFragebogenProps {
  onBack?: () => void
}

export default function GebietsmanagementFragebogen({ onBack }: GebietsmanagementFragebogenProps) {
  const [selectedModule, setSelectedModule] = useState('Fragebögen')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const modules = [
    'Fragebögen',
    'POS Material',
    'Distributionsziel/Verfügbarkeit',
    'Allgemein',
    'Sonstige Platzierungen',
    'Spirits Jahreschallenge',
    'Verfügbarkeit'
  ]

  // Mock data for cards
  const fragebogenCards = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Fragebogen ${i + 1}`,
    description: 'Beschreibung des Fragebogens'
  }))

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f5', 
      padding: '20px'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px 20px',
        background: '#ffffff',
        borderRadius: '12px'
      }}>
        {/* Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              padding: '8px 16px',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '140px'
            }}
          >
            {selectedModule}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              background: '#ffffff',
              border: '1px solid #f3f4f6',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              zIndex: 10,
              minWidth: '220px',
              overflow: 'hidden'
            }}>
              {/* Fragebögen option (above header) */}
              <button
                onClick={() => {
                  setSelectedModule('Fragebögen')
                  setIsDropdownOpen(false)
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.02)'
                  e.currentTarget.style.color = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.color = '#374151'
                }}
              >
                Fragebögen
              </button>

              {/* Module Header */}
              <div style={{
                padding: '8px 16px',
                background: '#f9fafb',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Module
              </div>

              {/* Module options */}
              {modules.slice(1).map((module) => (
                <button
                  key={module}
                  onClick={() => {
                    setSelectedModule(module)
                    setIsDropdownOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.02)'
                    e.currentTarget.style.color = '#dc2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                    e.currentTarget.style.color = '#374151'
                  }}
                >
                  {module}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <svg 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 16px 8px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#ffffff',
              outline: 'none'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
            }}
            title="Hilfe"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
          
          <button
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
            }}
            title="Hinzufügen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '0 20px'
      }}>
        {fragebogenCards.map((card) => (
          <div
            key={card.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {card.title}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: 0
            }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Back Button */}
      {onBack && (
        <div style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '20px'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
            }}
          >
            ← Zurück
          </button>
        </div>
      )}
    </div>
  )
}
