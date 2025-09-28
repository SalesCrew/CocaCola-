import { useState } from 'react'

interface ModulErstellenProps {
  onBack?: () => void
  moduleName: string
}

interface Question {
  id: string
  type: 'yes-no' | 'multiple-choice' | 'scale' | 'sku-selection' | 'text'
  title: string
  description?: string
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  requiresPhoto?: boolean
  requiresComment?: boolean
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
    { id: 'yes-no', label: 'Ja/Nein Frage', icon: '✓' },
    { id: 'multiple-choice', label: 'Multiple Choice', icon: '☰' },
    { id: 'scale', label: 'Skala 1-10', icon: '📊' },
    { id: 'sku-selection', label: 'SKU Auswahl', icon: '📦' },
    { id: 'text', label: 'Textfeld', icon: '📝' }
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
      ...(currentQuestion.type === 'multiple-choice' && { options: currentQuestion.options || ['Option 1', 'Option 2'] }),
      ...(currentQuestion.type === 'scale' && { scaleMin: 1, scaleMax: 10 }),
      ...(currentQuestion.type === 'sku-selection' && { skuList: [] })
    }
    
    setQuestions([...questions, newQuestion])
    setCurrentQuestion({
      type: 'yes-no',
      title: '',
      description: '',
      requiresPhoto: false,
      requiresComment: false
    })
    setIsCreatingQuestion(false)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
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
                    <span style={{ fontSize: '16px' }}>{type.icon}</span>
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
                      ×
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
                    color: '#374151'
                  }}
                >
                  + Option hinzufügen
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
                <label htmlFor="requiresPhoto" style={{ fontSize: '14px', color: '#374151' }}>
                  Foto erforderlich
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="requiresComment"
                  checked={currentQuestion.requiresComment || false}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, requiresComment: e.target.checked })}
                />
                <label htmlFor="requiresComment" style={{ fontSize: '14px', color: '#374151' }}>
                  Kommentarfeld optional
                </label>
              </div>
            </div>

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
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px auto', opacity: 0.5 }}>
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
                            fontWeight: '500'
                          }}>
                            📸 Foto
                          </span>
                        )}
                        {question.requiresComment && (
                          <span style={{
                            background: '#f0fdf4',
                            color: '#166534',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            💬 Kommentar
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
                      
                      {question.type === 'sku-selection' && (
                        <div style={{
                          padding: '8px 12px',
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#374151',
                          marginTop: '8px'
                        }}>
                          SKU-Auswahl: 10 Produkte zur Auswahl
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
                      🗑️
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
            💾 Modul speichern
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
