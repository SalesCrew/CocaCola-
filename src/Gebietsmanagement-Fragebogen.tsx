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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [isCreatingModule, setIsCreatingModule] = useState(false)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)
  const helpButtonRef = useRef<HTMLButtonElement>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [helpPanelPosition, setHelpPanelPosition] = useState({ top: 0, left: 0 })
  const [helpSearchQuery, setHelpSearchQuery] = useState('')

  const modules = [
    'Fragebögen',
    'POS Material',
    'Distributionsziel/Verfügbarkeit',
    'Allgemein',
    'Sonstige Platzierungen',
    'Spirits Jahreschallenge',
    'Verfügbarkeit'
  ]

  // Help catalog: question type labels and demo questions (temp data)
  type QuestionType = 'yes-no' | 'multiple-choice' | 'scale' | 'text'
  interface HelpQuestion {
    id: number
    module: string
    type: QuestionType
    title: string
    requiresPhoto?: boolean
  }

  const questionTypeLabel: Record<QuestionType, string> = {
    'yes-no': 'Ja/Nein',
    'multiple-choice': 'Multiple Choice',
    'scale': 'Skala',
    'text': 'Text'
  }

  const helpQuestions: HelpQuestion[] = [
    { id: 1, module: 'Allgemein', type: 'yes-no', title: 'Wurde die RED Survey ausgefüllt? (nur in RED-Märkten)' },
    { id: 2, module: 'Allgemein', type: 'text', title: 'ZUSATZTASK Mitbewerber - Ist ein markeneigener Kühler vorhanden? (+ Kommentar wie viele, wenn mehr als 1)', requiresPhoto: true },
    { id: 3, module: 'Allgemein', type: 'text', title: 'ZUSATZTASK Mitbewerber - Sind Großplatzierungen bzw. Aufbauten vom Mitbewerb vorhanden? (+ Kommentar wie viele, wenn mehr als 1)', requiresPhoto: true },
    { id: 4, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die Powerade MB 4-Pack im Markt verfügbar?', requiresPhoto: true },
    { id: 5, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die CR, CZ, F - 4 Pack 0,33L CAN im Markt verfügbar?', requiresPhoto: true },
    { id: 6, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die Jack & Coke 330ml CAN im Markt verfügbar?', requiresPhoto: true },
    { id: 7, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die BACARDI Coca-Cola 0,25L CAN im Markt verfügbar?', requiresPhoto: true },
    { id: 8, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die Mezzo Mix 0,5L PET im Markt verfügbar?', requiresPhoto: true },
    { id: 9, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist die Finlandia Classic 700ml im Markt verfügbar?', requiresPhoto: true },
    { id: 10, module: 'Distributionsziel/Verfügbarkeit', type: 'yes-no', title: 'Ist der Limoncetta 0,5L NRGB im Markt verfügbar?', requiresPhoto: true },
    { id: 11, module: 'POS Material', type: 'yes-no', title: 'Monster Schütte 0,5L MIT CROWNER in richtiger Zone platziert (Incidence Zone, Kassa, Brot/Gebäck, Milch/Käse, Pasta, Fertiggerichte, Tiefkühlprodukte)' },
    { id: 12, module: 'POS Material', type: 'yes-no', title: 'Monster Schütte 0,5L MIT CROWNER in sonstiger Zone platziert' },
    { id: 13, module: 'POS Material', type: 'yes-no', title: 'Monster Display 0,5L MIT HEADER in richtiger Zone platziert (Incidence, Kassa, Brot/Gebäck, Milch/Käse, Pasta, Fertiggerichte, Tiefkühlprodukte)' },
    { id: 14, module: 'POS Material', type: 'yes-no', title: 'Monster Display 0,5L MIT HEADER in sonstiger Zone platziert' },
    { id: 15, module: 'POS Material', type: 'yes-no', title: 'Coke Schütte (SSD 0,5L) in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 16, module: 'POS Material', type: 'yes-no', title: 'Coke Schütte (SSD 0,5L) in sonstiger Zone platziert' },
    { id: 17, module: 'POS Material', type: 'yes-no', title: 'Coke Display (0,5L) in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 18, module: 'POS Material', type: 'yes-no', title: 'Coke Display (0,5L) in sonstiger Zone platziert' },
    { id: 19, module: 'POS Material', type: 'yes-no', title: 'Coke Schütte (0,33L) in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 20, module: 'POS Material', type: 'yes-no', title: 'Coke Schütte (0,33L) in sonstiger Zone platziert' },
    { id: 21, module: 'POS Material', type: 'yes-no', title: 'Coke Display (0,33L) in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 22, module: 'POS Material', type: 'yes-no', title: 'Coke Display (0,33L) in sonstiger Zone platziert' },
    { id: 23, module: 'POS Material', type: 'yes-no', title: 'Coke LIME Schütte 0,33L CAN in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 24, module: 'POS Material', type: 'yes-no', title: 'Coke LIME Schütte 0,33L CAN in sonstiger Zone platziert' },
    { id: 25, module: 'POS Material', type: 'yes-no', title: 'Coke Cherry 0,33L CAN Schütte - in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 26, module: 'POS Material', type: 'yes-no', title: 'Coke Cherry Schütte 0,33L CAN - in sonstiger Zone platziert?' },
    { id: 27, module: 'POS Material', type: 'yes-no', title: 'Coke Cherry 0,5L PET Schütte - in richtiger Zone platziert? (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 28, module: 'POS Material', type: 'yes-no', title: 'Coke Cherry Schütte 0,5L PET - in sonstiger Zone platziert?' },
    { id: 29, module: 'POS Material', type: 'yes-no', title: 'Coke Flavors 0,33L CAN Schütte - in richtiger Zone platziert? (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 30, module: 'POS Material', type: 'yes-no', title: 'Coke Flavors 0,33L CAN Schütte - in sonstiger Zone platziert?' },
    { id: 31, module: 'POS Material', type: 'yes-no', title: 'Fanta Schütte (SSD 0,5L) in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 32, module: 'POS Material', type: 'yes-no', title: 'Fanta Schütte (SSD 0,5L) in sonstiger Zone platziert' },
    { id: 33, module: 'POS Material', type: 'yes-no', title: 'Fanta Display in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 34, module: 'POS Material', type: 'yes-no', title: 'Fanta Display in sonstiger Zone platziert?' },
    { id: 35, module: 'POS Material', type: 'yes-no', title: 'Fuzetea Schütte (0,5L) - in richtiger Zone platziert (Frequency, Feinkost/Sandwiches/frisches Fleisch, Obst/Gemüse, Healthy Snacks)' },
    { id: 36, module: 'POS Material', type: 'yes-no', title: 'Fuzetea Schütte (0,5L) - in sonstiger Zone platziert' },
    { id: 37, module: 'POS Material', type: 'yes-no', title: 'Fuzetea Display (0,5L) - in richtiger Zone platziert (Frequency, Feinkost/Sandwiches/Frisches Fleisch, Obst/Gemüse, Healthy Snacks)' },
    { id: 38, module: 'POS Material', type: 'yes-no', title: 'Fuzetea Display (0,5L) - in sonstiger Zone platziert' },
    { id: 39, module: 'POS Material', type: 'yes-no', title: 'Sprite 0,5L PET Schütte - in richtiger Zone platziert (Frequency, Chips/Salziges, Feinkost/Sandwiches/Frischfleisch)' },
    { id: 40, module: 'POS Material', type: 'yes-no', title: 'Sprite 0,5L PET Schütte - in sonstiger Zone platziert?' }
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
    <>
      <style>{`
        .category-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div style={{ 
        height: '100vh',
        overflow: 'hidden',
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
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
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
            ref={helpButtonRef}
            onClick={() => {
              const rect = helpButtonRef.current?.getBoundingClientRect()
              if (rect) {
                const panelWidth = 880
                let left = rect.right + window.scrollX - panelWidth
                if (left < 20) left = 20
                setHelpPanelPosition({ top: rect.bottom + window.scrollY + 8, left })
              }
              setIsHelpOpen((prev) => !prev)
            }}
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
              if (isSlideOut) return
              
              // Simple logic: if not "Fragebögen", show module creation
              if (selectedModule !== 'Fragebögen') {
                setIsCreatingModule(true)
              } else {
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

          {/* Fragebogen Action Buttons - Only show when in fragebogen creation mode */}
          {selectedModule === 'Fragebögen' && isCleared && (
            <>
              <button style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                whiteSpace: 'nowrap'
              }}>
                + Märkte hinzufügen
              </button>
              
              <button 
                onClick={() => {
                  if (fragebogenName.trim() && selectedCategory) {
                    console.log('Creating fragebogen:', fragebogenName, selectedCategory)
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: fragebogenName.trim() && selectedCategory 
                    ? 'linear-gradient(135deg, #10b981, #047857)' 
                    : '#e5e7eb',
                  color: fragebogenName.trim() && selectedCategory ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: fragebogenName.trim() && selectedCategory ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: fragebogenName.trim() && selectedCategory 
                    ? '0 2px 8px rgba(16, 185, 129, 0.2)' 
                    : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                ✓ Fragebogen erstellen
              </button>
            </>
          )}

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

      {/* Help Panel - Questions catalog */}
      {isHelpOpen && (
        <div style={{
          position: 'absolute',
          top: `${helpPanelPosition.top}px`,
          left: `${helpPanelPosition.left}px`,
          width: '880px',
          maxHeight: '520px',
          background: '#ffffff',
          border: '1px solid #f3f4f6',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          zIndex: 11000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>Fragenkatalog (alle Module)</div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ position: 'absolute', left: 8, top: 7 }}>
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                  placeholder="Fragen suchen..."
                  style={{
                    width: '260px',
                    padding: '6px 12px 6px 28px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                title="Schließen"
                style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: '#f3f4f6', border: '1px solid #e5e7eb', cursor: 'pointer', color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
          </div>

          <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: '40px 140px 120px 1fr 90px', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
            <div>#</div>
            <div>Modul</div>
            <div>Typ</div>
            <div>Frage</div>
            <div>Optionen</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px 12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="category-scroll">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {helpQuestions
                .filter(q => {
                  const s = helpSearchQuery.trim().toLowerCase()
                  if (!s) return true
                  return (
                    q.title.toLowerCase().includes(s) ||
                    q.module.toLowerCase().includes(s) ||
                    questionTypeLabel[q.type].toLowerCase().includes(s)
                  )
                })
                .map((q) => (
                <div key={q.id} style={{
                  display: 'grid', gridTemplateColumns: '40px 140px 120px 1fr 90px', gap: '8px',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px',
                  padding: '8px 10px'
                }}>
                  <div style={{ fontWeight: 700, color: '#dc2626', textAlign: 'center' }}>{q.id}</div>
                  <div>
                    <span style={{
                      padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: '#f3f4f6', color: '#374151', whiteSpace: 'nowrap'
                    }}>{q.module}</span>
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: q.type === 'yes-no' ? '#ecfdf5' : q.type === 'scale' ? '#eff6ff' : q.type === 'text' ? '#f3f4f6' : '#f5f3ff',
                      color: q.type === 'yes-no' ? '#065f46' : q.type === 'scale' ? '#1d4ed8' : q.type === 'text' ? '#374151' : '#6b21a8'
                    }}>{questionTypeLabel[q.type]}</span>
                  </div>
                  <div style={{ color: '#111827' }}>{q.title}</div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {q.requiresPhoto && (
                      <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }}>+ Foto</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            height: '280px'
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Category Selection Card */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '12px',
                width: '320px',
                maxHeight: '248px',
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
                <div className="category-scroll" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  flex: 1,
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {[selectedCategory, ...categories.filter(c => c !== selectedCategory)].filter(Boolean).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: '8px 12px',
                        border: selectedCategory === category ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid #e5e7eb',
                        borderRadius: '6px',
                        background: selectedCategory === category ? 'rgba(220, 38, 38, 0.04)' : '#ffffff',
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


              {/* Positions 1-6 in One Row */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingLeft: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '720px',
                  marginBottom: '16px',
                  marginTop: '60px'
                }}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        border: '2px dashed #d1d5db',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '10px',
                        fontWeight: '500',
                        background: '#fafafa'
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%'
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
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
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
              
              <button style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                whiteSpace: 'nowrap'
              }}>
                + Märkte hinzufügen
              </button>
              
              <button 
                onClick={() => {
                  if (fragebogenName.trim() && selectedCategory) {
                    console.log('Creating fragebogen:', fragebogenName, selectedCategory)
                  }
                }}
                style={{
                  padding: '12px 20px',
                  background: fragebogenName.trim() && selectedCategory 
                    ? 'linear-gradient(135deg, #10b981, #047857)' 
                    : '#e5e7eb',
                  color: fragebogenName.trim() && selectedCategory ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: fragebogenName.trim() && selectedCategory ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: fragebogenName.trim() && selectedCategory 
                    ? '0 2px 8px rgba(16, 185, 129, 0.2)' 
                    : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                ✓ Fragebogen erstellen
              </button>
            </div>
            
            {/* 6 Empty Boxes moved below */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '12px',
                maxWidth: '900px',
                width: '100%'
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
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}