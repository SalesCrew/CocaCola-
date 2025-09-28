import { useState, useRef, useEffect } from 'react'
import ModulErstellen from './ModulErstellen'

interface GebietsmanagementFragebogenProps {
  onBack?: () => void
}

export default function GebietsmanagementFragebogen({ onBack }: GebietsmanagementFragebogenProps) {
  const [selectedModule, setSelectedModule] = useState('Fragebögen')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSlideOut, setIsSlideOut] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [fragebogenName, setFragebogenName] = useState('')
  const [isNameSubmitted, setIsNameSubmitted] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [isCreatingModule, setIsCreatingModule] = useState(false)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)

  const modules = [
    'Fragebögen',
    'POS Material',
    'Distributionsziel/Verfügbarkeit',
    'Allgemein',
    'Sonstige Platzierungen',
    'Spirits Jahreschallenge',
    'Verfügbarkeit'
  ]

  // Categories for selection (excluding Fragebögen)
  const categories = modules.slice(1)

  // Update dropdown position when it opens
  useEffect(() => {
    if (isDropdownOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      })
    }
  }, [isDropdownOpen])

  // Mock data for cards
  const fragebogenCards = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Fragebogen ${i + 1}`,
    description: 'Beschreibung des Fragebogens'
  }))

  // Show module creation interface when creating a module
  if (isCreatingModule) {
    return (
      <ModulErstellen 
        moduleName={selectedModule}
        onBack={() => {
          setIsCreatingModule(false)
        }}
      />
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isCleared ? '#ffffff' : '#f5f5f5', 
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
        borderRadius: '12px',
        transition: 'transform 500ms ease, opacity 500ms ease',
        transform: isSlideOut ? 'translateX(120%)' : 'translateX(0)',
        opacity: isSlideOut ? 0 : 1
      }}>
        {/* Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            ref={dropdownButtonRef}
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.228 9c.349-1.054 1.366-2 3.022-2 1.852 0 3.25 1.186 3.25 2.75 0 1.531-1.261 2.238-2.167 2.76-.836.482-1.333.871-1.333 1.74v.25" />
              <path d="M12 17h.01" />
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75z" />
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
            onClick={() => {
              alert('Selected module: ' + selectedModule)
              if (isSlideOut) return
              
              // Simple logic: if not "Fragebögen", show module creation
              if (selectedModule !== 'Fragebögen') {
                alert('Opening module creation for: ' + selectedModule)
                setIsCreatingModule(true)
              } else {
                alert('Opening questionnaire creation')
                setIsSlideOut(true)
                window.setTimeout(() => setIsCleared(true), 600)
              }
            }}
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
        padding: '0 20px',
        transition: 'transform 500ms ease, opacity 500ms ease',
        transform: isSlideOut ? 'translateX(-120%)' : 'translateX(0)',
        opacity: isSlideOut ? 0 : 1
      }}>
        {selectedModule === 'Fragebögen' ? (
          // Show questionnaire cards
          fragebogenCards.map((card) => (
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
          ))
        ) : (
          // Show empty state for modules (since they don't exist yet)
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '2px dashed #d1d5db',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Keine Module für "{selectedModule}" vorhanden
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 20px 0',
              maxWidth: '400px'
            }}>
              Erstellen Sie Ihr erstes Modul für diese Kategorie, indem Sie auf den + Button klicken.
            </p>
            <button
              onClick={() => setIsCreatingModule(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Modul erstellen
            </button>
          </div>
        )}
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

      {/* Dropdown Menu - Outside header to avoid transform stacking context */}
      {isDropdownOpen && (
        <div style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          background: '#ffffff',
          border: '1px solid #f3f4f6',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
          zIndex: 10000,
          width: '140px',
          overflow: 'hidden'
        }}>
          {/* Fragebögen option (above header) */}
          <button
            onClick={() => {
              setSelectedModule('Fragebögen')
              setIsDropdownOpen(false)
              // Reset all creation states when switching to Fragebögen
              setIsCleared(false)
              setIsSlideOut(false)
              setIsCreatingModule(false)
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
                // Reset all creation states when switching modules
                setIsCleared(false)
                setIsSlideOut(false)
                setIsCreatingModule(false)
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

      {/* New Fragebogen Creation UI */}
      {isCleared && !isCreatingModule && selectedModule === 'Fragebögen' && (
        <div style={{
          opacity: isCleared ? 1 : 0,
          transition: 'opacity 300ms ease',
          padding: '20px 20px 0 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 500
        }}>
          {/* Top Section - Category Selection and Cards */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Category Selection Card */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '16px',
                width: '450px',
                maxHeight: '200px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  Kategorie auswählen
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  flex: 1,
                  overflowY: 'auto'
                }}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: '8px 12px',
                        border: selectedCategory === category ? '2px solid #dc2626' : '1px solid #e5e7eb',
                        borderRadius: '6px',
                        background: selectedCategory === category ? '#fef2f2' : '#ffffff',
                        color: selectedCategory === category ? '#dc2626' : '#374151',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== category) {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                          e.currentTarget.style.borderColor = '#d1d5db'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== category) {
                          e.currentTarget.style.backgroundColor = '#ffffff'
                          e.currentTarget.style.borderColor = '#e5e7eb'
                        }
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0'
              }}>
                <button
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}
                >
                  ←
                </button>
                <button
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}
                >
                  →
                </button>
              </div>

              {/* Empty Cards Grid */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                maxWidth: '600px'
              }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: '#fafafa'
                    }}
                  >
                    Position {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Name Input and Action Buttons */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                display: 'block',
                marginBottom: '8px'
              }}>
                Name des Fragebogens
              </label>
              <input
                type="text"
                placeholder="Fragebogen Name eingeben..."
                value={fragebogenName}
                onChange={(e) => setFragebogenName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
              }}>
                + Märkte hinzufügen
              </button>
              
              <button 
                onClick={() => {
                  if (fragebogenName.trim() && selectedCategory) {
                    setIsNameSubmitted(true)
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: fragebogenName.trim() && selectedCategory 
                    ? 'linear-gradient(135deg, #10b981, #047857)' 
                    : '#e5e7eb',
                  color: fragebogenName.trim() && selectedCategory ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: fragebogenName.trim() && selectedCategory ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: fragebogenName.trim() && selectedCategory 
                    ? '0 2px 8px rgba(16, 185, 129, 0.2)' 
                    : 'none'
                }}
              >
                ✓ Fragebogen erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}