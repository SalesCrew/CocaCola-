import { useState, useEffect } from 'react'

interface GebietsleiterHeaderProps {
  userData: {
    name: string
    region: string
    ipp: number
  }
  onSwitchPage?: () => void
}

export default function GebietsleiterHeader({ userData, onSwitchPage }: GebietsleiterHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    })
  }

  return (
    <header className="gebietsleiter-header">
      <div className="gebietsleiter-header-content">
        <div className="header-user-info">
          <div className="user-avatar">
            <div className="avatar-circle">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="user-details">
            <h1 className="user-name">{userData.name}</h1>
            <div className="user-meta">
              <span className="user-region">{userData.region}</span>
              <span className="user-separator">•</span>
              <span className="user-ipp">IPP {userData.ipp.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="header-time-info">
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
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

