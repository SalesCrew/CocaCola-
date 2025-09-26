import { useState } from 'react'

interface SidebarProps {
  onSwitchPage?: () => void
  onMenuChange?: (index: number) => void
}

export default function Sidebar({ onSwitchPage, onMenuChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const menuItems = [
    'Übersicht',
    'Fragebögen Verwalten', 
    'Promotoren',
    'Nachrichten',
    'Statistiken',
    'Schulungen',
    'Sales Challenge',
    'DemoTool Agent',
    'Einstellungen'
  ]

  const getIcon = (index: number) => {
    const iconStyle = { width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: '2' }
    
    switch (index) {
      case 0: // Übersicht
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        )
      case 1: // Einsatzplan
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      case 2: // Promotoren
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        )
      case 3: // Nachrichten
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )
      case 4: // Statistiken
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        )
      case 5: // Schulungen
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        )
      case 6: // Sales Challenge
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
          </svg>
        )
      case 7: // DemoTool Agent
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4"/>
            <line x1="8" y1="16" x2="8" y2="16"/>
            <line x1="16" y1="16" x2="16" y2="16"/>
          </svg>
        )
      case 8: // Einstellungen
        return (
          <svg {...iconStyle} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        )
      default:
        return <div style={{ width: '20px', height: '20px' }}></div>
    }
  }

  return (
    <div style={{
      width: isCollapsed ? '60px' : '220px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.15s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{ 
        padding: isCollapsed ? '20px 12px' : '20px 16px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
          fontSize: '16px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
        }}>
          SC
        </div>
        {!isCollapsed && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
              SalesCrew
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <div style={{ 
        flex: 1, 
        padding: isCollapsed ? '16px 12px' : '16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'stretch'
      }}>
        {menuItems.map((label, index) => (
          <div
            key={index}
            onClick={() => {
              if (activeIndex === index) {
                setIsCollapsed(!isCollapsed)
              } else {
                setActiveIndex(index)
                if (onMenuChange) {
                  onMenuChange(index)
                }
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isCollapsed ? '0' : '10px',
              padding: isCollapsed ? '8px' : '10px 8px',
              margin: '1px 0',
              borderRadius: isCollapsed ? '8px' : '6px',
              cursor: 'pointer',
              backgroundColor: activeIndex === index ? '#dc2626' : 'transparent',
              color: activeIndex === index ? '#ffffff' : '#6b7280',
              transition: 'none',
              fontSize: '13px',
              fontWeight: '500',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              width: isCollapsed ? '36px' : 'auto',
              height: isCollapsed ? '36px' : 'auto',
              boxShadow: activeIndex === index && isCollapsed ? '0 2px 8px rgba(220, 38, 38, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeIndex !== index) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (activeIndex !== index) {
                e.currentTarget.style.backgroundColor = 'transparent'
              } else {
                // Restore active color if this is the active item
                e.currentTarget.style.backgroundColor = '#dc2626'
              }
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {getIcon(index)}
            </div>
            {!isCollapsed && (
              <span style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {onSwitchPage && (
        <div style={{ padding: '16px 8px', borderTop: '1px solid #f3f4f6' }}>
          <div
            onClick={onSwitchPage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 8px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span>
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </div>
      )}
    </div>
  )
}
