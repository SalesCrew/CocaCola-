import { useState, useEffect } from 'react'

interface HeaderProps {
  onSwitchPage?: () => void
}

export default function Header({ onSwitchPage }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <header className="header">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 24px',
        maxWidth: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <img 
            src="/coca-cola-logo.png" 
            alt="Coca-Cola Logo"
            style={{
              height: '86px',
              width: 'auto'
            }}
          />
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          opacity: 0.6
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#333333',
            marginBottom: '2px'
          }}>
            {formatDate(currentTime)}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333333',
            fontFamily: 'monospace'
          }}>
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
      {onSwitchPage && (
        <button
          className="page-switch-btn"
          onClick={onSwitchPage}
          aria-label="Seite wechseln"
          title="Seite wechseln"
        >
          Wechseln
        </button>
      )}
    </header>
  )
}


