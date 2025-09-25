import { useState, useRef, useEffect } from 'react'
import { DropdownPortal } from './DropdownPortal'

export default function GebietsmanagerCalendarFilter() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState('MTD')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [isSelectingRange, setIsSelectingRange] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const handleQuickFilter = (filter: string) => {
    const today = new Date()
    let start = today
    let end = today

    switch(filter) {
      case 'YTD':
        start = new Date(today.getFullYear(), 0, 1)
        break
      case 'Q1':
        start = new Date(today.getFullYear(), 0, 1)
        end = new Date(today.getFullYear(), 2, 31)
        break
      case 'Q2':
        start = new Date(today.getFullYear(), 3, 1)
        end = new Date(today.getFullYear(), 5, 30)
        break
      case 'Q3':
        start = new Date(today.getFullYear(), 6, 1)
        end = new Date(today.getFullYear(), 8, 30)
        break
      case 'Q4':
        start = new Date(today.getFullYear(), 9, 1)
        end = new Date(today.getFullYear(), 11, 31)
        break
      case 'MTD':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case 'Last 30':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }

    setSelectedStartDate(start)
    setSelectedEndDate(end)
    setSelectedRange(filter)
    setIsSelectingRange(false)
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (!isSelectingRange || !selectedStartDate) {
      setSelectedStartDate(clickedDate)
      setSelectedEndDate(null)
      setIsSelectingRange(true)
    } else {
      if (clickedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate)
        setSelectedStartDate(clickedDate)
      } else {
        setSelectedEndDate(clickedDate)
      }
      setIsSelectingRange(false)
      setSelectedRange('Custom')
    }
  }

  const isDateInRange = (day: number) => {
    if (!selectedStartDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime()
    return date >= selectedStartDate && date <= selectedEndDate
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  return (
    <div className="gm-calendar-filter">
      <button 
        ref={buttonRef}
        className={`gm-calendar-button ${selectedRange !== 'MTD' ? 'has-custom-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="gm-button-icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M17 3h-1V1h-2v2H6V1H4v2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V8h14v9zM3 6V5h14v1H3z" fill="currentColor"/>
        </svg>
        <span className="gm-button-text">{selectedRange}</span>
        <svg className={`gm-button-arrow ${isOpen ? 'open' : ''}`} width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <DropdownPortal targetEl={buttonRef.current} isOpen={isOpen} className="calendar-dropdown">
        <div ref={dropdownRef}>
          <div className="calendar-quick-filters">
            <button onClick={() => handleQuickFilter('YTD')} className={selectedRange === 'YTD' ? 'active' : ''}>YTD</button>
            <button onClick={() => handleQuickFilter('Q1')} className={selectedRange === 'Q1' ? 'active' : ''}>Q1</button>
            <button onClick={() => handleQuickFilter('Q2')} className={selectedRange === 'Q2' ? 'active' : ''}>Q2</button>
            <button onClick={() => handleQuickFilter('Q3')} className={selectedRange === 'Q3' ? 'active' : ''}>Q3</button>
            <button onClick={() => handleQuickFilter('Q4')} className={selectedRange === 'Q4' ? 'active' : ''}>Q4</button>
            <button onClick={() => handleQuickFilter('MTD')} className={selectedRange === 'MTD' ? 'active' : ''}>MTD</button>
            <button onClick={() => handleQuickFilter('Last 30')} className={selectedRange === 'Last 30' ? 'active' : ''}>Last 30</button>
          </div>
          
          <div className="calendar-container">
            <div className="calendar-header">
              <button className="calendar-nav" onClick={() => navigateMonth(-1)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="calendar-month-year">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button className="calendar-nav" onClick={() => navigateMonth(1)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="calendar-grid">
              <div className="calendar-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>
              
              <div className="calendar-days">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  return (
                    <div
                      key={day}
                      className={`calendar-day ${isDateInRange(day) ? 'selected' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}
