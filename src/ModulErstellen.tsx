import { useState } from 'react'

interface ModulErstellenProps {
  onBack?: () => void
  moduleName: string
}

interface SKUManagerProps {
  skuList: string[]
  onChange: (skuList: string[]) => void
}

// Predefined SKU stacks for quick selection
const predefinedSKUStacks = {
  'Coca-Cola Classic': [
    'Coca-Cola 0.33L Dose',
    'Coca-Cola 0.5L Flasche',
    'Coca-Cola 1.0L Flasche',
    'Coca-Cola 1.5L Flasche',
    'Coca-Cola 2.0L Flasche',
    'Coca-Cola 6x0.33L Multipack',
    'Coca-Cola 12x0.33L Tray',
    'Coca-Cola 24x0.33L Kiste'
  ],
  'Coca-Cola Zero': [
    'Coca-Cola Zero 0.33L Dose',
    'Coca-Cola Zero 0.5L Flasche',
    'Coca-Cola Zero 1.0L Flasche',
    'Coca-Cola Zero 1.5L Flasche',
    'Coca-Cola Zero 2.0L Flasche'
  ],
  'Fanta': [
    'Fanta Orange 0.33L Dose',
    'Fanta Orange 0.5L Flasche',
    'Fanta Orange 1.0L Flasche',
    'Fanta Lemon 0.33L Dose',
    'Fanta Exotic 0.33L Dose'
  ],
  'Sprite': [
    'Sprite 0.33L Dose',
    'Sprite 0.5L Flasche',
    'Sprite 1.0L Flasche',
    'Sprite 1.5L Flasche'
  ]
}

function SKUManager({ skuList, onChange }: SKUManagerProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [newSKU, setNewSKU] = useState('')

  const addSKU = (sku: string) => {
    if (sku.trim() && !skuList.includes(sku.trim())) {
      onChange([...skuList, sku.trim()])
    }
  }

  const removeSKU = (index: number) => {
    onChange(skuList.filter((_, i) => i !== index))
  }

  const loadSKUStack = (stackName: string) => {
    const stack = predefinedSKUStacks[stackName as keyof typeof predefinedSKUStacks]
    if (stack) {
      onChange([...new Set([...skuList, ...stack])]) // Avoid duplicates
    }
    setIsPopupOpen(false)
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          SKU Auswahl ({skuList.length} SKUs)
        </label>
        
        {/* Saved SKU Stacks Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          style={{
            padding: '4px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Gespeicherte SKU-Listen laden"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17,21 17,13 7,13 7,21"/>
            <polyline points="7,3 7,8 15,8"/>
          </svg>
        </button>
      </div>

      {/* Current SKU List */}
      <div style={{ 
        maxHeight: '120px', 
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        padding: '8px',
        background: '#fafafa',
        marginBottom: '8px'
      }}>
        {skuList.length === 0 ? (
          <div style={{ 
            color: '#9ca3af', 
            fontSize: '13px', 
            textAlign: 'center',
            padding: '16px'
          }}>
            Keine SKUs ausgewählt
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {skuList.map((sku, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#374151'
                }}
              >
                <span>{sku}</span>
                <button
                  onClick={() => removeSKU(index)}
                  style={{
                    padding: '2px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New SKU */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="SKU eingeben (z.B. Coca-Cola 0.33L Dose)"
          value={newSKU}
          onChange={(e) => setNewSKU(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addSKU(newSKU)
              setNewSKU('')
            }
          }}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '13px'
          }}
        />
        <button
          onClick={() => {
            addSKU(newSKU)
            setNewSKU('')
          }}
          style={{
            padding: '8px 12px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Hinzufügen
        </button>
      </div>

      {/* SKU Stack Popup */}
      {isPopupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '500px',
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Gespeicherte SKU-Listen
              </h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(predefinedSKUStacks).map(([stackName, skus]) => (
                <div
                  key={stackName}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => loadSKUStack(stackName)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626'
                    e.currentTarget.style.background = '#fef2f2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <rect x="9" y="9" width="6" height="6"/>
                      <path d="M9 1v6"/>
                      <path d="M15 1v6"/>
                      <path d="M9 17v6"/>
                      <path d="M15 17v6"/>
                      <path d="M1 9h6"/>
                      <path d="M17 9h6"/>
                      <path d="M1 15h6"/>
                      <path d="M17 15h6"/>
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {stackName}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      ({skus.length} SKUs)
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                    {skus.slice(0, 3).join(', ')}{skus.length > 3 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Question {
  id: string
  type: 'yes-no' | 'multiple-choice' | 'scale' | 'text'
  title: string
  description?: string
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  requiresPhoto?: boolean
  requiresComment?: boolean
  requiresSKU?: boolean
  skuList?: string[]
}

export default function ModulErstellen({ onBack, moduleName }: ModulErstellenProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'yes-no',
    title: '',
    description: '',
    requiresPhoto: false,
    requiresComment: false
  })

  const questionTypes = [
    { id: 'yes-no', label: 'Ja/Nein Frage', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg> },
    { id: 'multiple-choice', label: 'Multiple Choice', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { id: 'scale', label: 'Skala 1-10', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'text', label: 'Textfeld', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg> }
  ]

  const addQuestion = () => {
    if (!currentQuestion.title) return
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type as Question['type'],
      title: currentQuestion.title,
      description: currentQuestion.description,
      requiresPhoto: currentQuestion.requiresPhoto || false,
      requiresComment: currentQuestion.requiresComment || false,
      requiresSKU: currentQuestion.requiresSKU || false,
      ...(currentQuestion.type === 'multiple-choice' && { options: currentQuestion.options || ['Option 1', 'Option 2'] }),
      ...(currentQuestion.type === 'scale' && { scaleMin: 1, scaleMax: 10 }),
      ...(currentQuestion.requiresSKU && { skuList: currentQuestion.skuList || [] })
    }
    
    setQuestions([...questions, newQuestion])
    setCurrentQuestion({
      type: 'yes-no',
      title: '',
      description: '',
      requiresPhoto: false,
      requiresComment: false,
      requiresSKU: false
    })
    setIsCreatingQuestion(false)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff', 
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '20px 24px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            Modul erstellen: {moduleName}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Erstellen Sie dynamische Fragen für Ihr Modul
          </p>
        </div>
        
        <button
          onClick={() => setIsCreatingQuestion(true)}
          style={{
            padding: '12px 20px',
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
          Frage hinzufügen
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Question Creation Panel */}
        {isCreatingQuestion && (
          <div style={{
            width: '400px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f3f4f6',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 20px 0'
            }}>
              Neue Frage erstellen
            </h3>

            {/* Question Type Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                display: 'block',
                marginBottom: '8px'
              }}>
                Fragetyp
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCurrentQuestion({ ...currentQuestion, type: type.id as Question['type'] })}
                    style={{
                      padding: '12px',
                      border: currentQuestion.type === type.id ? '2px solid #dc2626' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      background: currentQuestion.type === type.id ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: currentQuestion.type === type.id ? '#dc2626' : '#374151',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ color: currentQuestion.type === type.id ? '#dc2626' : '#6b7280' }}>
                      {type.icon}
                    </div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                display: 'block',
                marginBottom: '6px'
              }}>
                Fragetitel *
              </label>
              <input
                type="text"
                value={currentQuestion.title || ''}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, title: e.target.value })}
                placeholder="z.B. Ist das Produkt verfügbar?"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Question Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                display: 'block',
                marginBottom: '6px'
              }}>
                Beschreibung (optional)
              </label>
              <textarea
                value={currentQuestion.description || ''}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, description: e.target.value })}
                placeholder="Zusätzliche Informationen zur Frage..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Antwortoptionen
                </label>
                {(currentQuestion.options || ['Option 1', 'Option 2']).map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(currentQuestion.options || [])]
                        newOptions[index] = e.target.value
                        setCurrentQuestion({ ...currentQuestion, options: newOptions })
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}
                    />
                    <button
                      onClick={() => {
                        const newOptions = (currentQuestion.options || []).filter((_, i) => i !== index)
                        setCurrentQuestion({ ...currentQuestion, options: newOptions })
                      }}
                      style={{
                        padding: '8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...(currentQuestion.options || []), `Option ${(currentQuestion.options?.length || 0) + 1}`]
                    setCurrentQuestion({ ...currentQuestion, options: newOptions })
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Option hinzufügen
                </button>
              </div>
            )}

            {/* Additional Options */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id="requiresPhoto"
                  checked={currentQuestion.requiresPhoto || false}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, requiresPhoto: e.target.checked })}
                />
                <label htmlFor="requiresPhoto" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Foto erforderlich
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  id="requiresComment"
                  checked={currentQuestion.requiresComment || false}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, requiresComment: e.target.checked })}
                />
                <label htmlFor="requiresComment" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Kommentarfeld optional
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="requiresSKU"
                  checked={currentQuestion.requiresSKU || false}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, requiresSKU: e.target.checked })}
                />
                <label htmlFor="requiresSKU" style={{ fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <rect x="9" y="9" width="6" height="6"/>
                    <path d="M9 1v6"/>
                    <path d="M15 1v6"/>
                    <path d="M9 17v6"/>
                    <path d="M15 17v6"/>
                    <path d="M1 9h6"/>
                    <path d="M17 9h6"/>
                    <path d="M1 15h6"/>
                    <path d="M17 15h6"/>
                  </svg>
                  SKU Auswahl aktivieren
                </label>
              </div>
            </div>

            {/* SKU Selection Options - Shows when SKU is enabled */}
            {currentQuestion.requiresSKU && (
              <SKUManager 
                skuList={currentQuestion.skuList || []}
                onChange={(newSkuList) => setCurrentQuestion({ ...currentQuestion, skuList: newSkuList })}
              />
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={addQuestion}
                disabled={!currentQuestion.title}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: currentQuestion.title ? 'linear-gradient(135deg, #10b981, #047857)' : '#e5e7eb',
                  color: currentQuestion.title ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentQuestion.title ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Frage hinzufügen
              </button>
              <button
                onClick={() => setIsCreatingQuestion(false)}
                style={{
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 20px 0'
          }}>
            Fragen ({questions.length})
          </h3>

          {questions.length === 0 ? (
            <div style={{
              background: '#f9fafb',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: '0 auto 16px auto' }}>
                <path d="M8.228 9c.349-1.054 1.366-2 3.022-2 1.852 0 3.25 1.186 3.25 2.75 0 1.531-1.261 2.238-2.167 2.76-.836.482-1.333.871-1.333 1.74v.25" />
                <path d="M12 17h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0' }}>
                Noch keine Fragen erstellt
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Klicken Sie auf "Frage hinzufügen", um zu beginnen
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          background: '#dc2626',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </span>
                        <span style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {questionTypes.find(t => t.id === question.type)?.label}
                        </span>
                        {question.requiresPhoto && (
                          <span style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                              <circle cx="12" cy="13" r="4"/>
                            </svg>
                            Foto
                          </span>
                        )}
                        {question.requiresComment && (
                          <span style={{
                            background: '#f0fdf4',
                            color: '#166534',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Kommentar
                          </span>
                        )}
                        {question.requiresSKU && (
                          <span style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <rect x="9" y="9" width="6" height="6"/>
                            </svg>
                            SKU ({question.skuList?.length || 0})
                          </span>
                        )}
                      </div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 4px 0'
                      }}>
                        {question.title}
                      </h4>
                      {question.description && (
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0 0 8px 0'
                        }}>
                          {question.description}
                        </p>
                      )}
                      
                      {/* Question Type Specific Display */}
                      {question.type === 'multiple-choice' && question.options && (
                        <div style={{ marginTop: '8px' }}>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} style={{
                              padding: '6px 10px',
                              background: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '13px',
                              color: '#374151',
                              marginBottom: '4px'
                            }}>
                              {optIndex + 1}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'scale' && (
                        <div style={{
                          padding: '8px 12px',
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151',
                          marginTop: '8px'
                        }}>
                          Skala: 1 - 10
                        </div>
                      )}
                      
                      {question.requiresSKU && question.skuList && question.skuList.length > 0 && (
                        <div style={{
                          padding: '8px 12px',
                          background: '#fef3c7',
                          border: '1px solid #fbbf24',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#d97706',
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <rect x="9" y="9" width="6" height="6"/>
                          </svg>
                          SKU-Auswahl: {question.skuList.length} Produkte
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeQuestion(question.id)}
                      style={{
                        padding: '8px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      title="Frage löschen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Module Button */}
      {questions.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              // Save module logic here
              alert(`Modul "${moduleName}" mit ${questions.length} Fragen gespeichert!`)
            }}
            style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17,21 17,13 7,13 7,21"/>
                  <polyline points="7,3 7,8 15,8"/>
                </svg>
                Modul speichern
          </button>
        </div>
      )}

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
