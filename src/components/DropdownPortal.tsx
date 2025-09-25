import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

interface DropdownPortalProps {
  children: React.ReactNode
  targetRef: React.RefObject<HTMLElement>
  isOpen: boolean
  className?: string
}

export function DropdownPortal({ children, targetRef, isOpen, className }: DropdownPortalProps) {
  const portalRef = useRef<HTMLDivElement>(document.createElement('div'))
  
  useEffect(() => {
    const portal = portalRef.current
    portal.className = className || ''
    if (isOpen) {
      // Set initial position before adding to DOM
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        portal.style.position = 'absolute'
        portal.style.left = `${rect.left + window.scrollX}px`
        portal.style.top = `${rect.bottom + window.scrollY + 8}px`
        portal.style.zIndex = '99999'
        
        // Check if this dropdown is inside a filter customizer by checking button's parent elements
        let element = targetRef.current.parentElement
        let isInCustomizer = false
        while (element) {
          if (element.classList?.contains('filter-customizer')) {
            isInCustomizer = true
            break
          }
          element = element.parentElement
        }
        
        // Set width for customizer dropdowns to match button width (except calendar)
        if (isInCustomizer && className !== 'calendar-dropdown') {
          const buttonWidth = targetRef.current.getBoundingClientRect().width
          portal.style.width = `${buttonWidth}px`
          portal.style.minWidth = `${buttonWidth}px`
          portal.style.maxWidth = `${buttonWidth}px`
        }
      }
      document.body.appendChild(portal)
    }
    
    return () => {
      if (portal.parentNode) {
        portal.parentNode.removeChild(portal)
      }
    }
  }, [isOpen, className, targetRef])
  
  useEffect(() => {
    if (!isOpen || !targetRef.current) return
    
    const updatePosition = () => {
      if (!targetRef.current || !portalRef.current) return
      const rect = targetRef.current.getBoundingClientRect()
      const portal = portalRef.current
      portal.style.position = 'absolute'
      portal.style.left = `${rect.left + window.scrollX}px`
      portal.style.top = `${rect.bottom + window.scrollY + 8}px`
      portal.style.zIndex = '99999'
      
      // Re-check customizer status and set width accordingly
      let element = targetRef.current.parentElement
      let isInCustomizer = false
      while (element) {
        if (element.classList?.contains('filter-customizer')) {
          isInCustomizer = true
          break
        }
        element = element.parentElement
      }
      
      // Set width for customizer dropdowns to match button width (except calendar)
      if (isInCustomizer && className !== 'calendar-dropdown') {
        const buttonWidth = targetRef.current.getBoundingClientRect().width
        portal.style.width = `${buttonWidth}px`
        portal.style.minWidth = `${buttonWidth}px`
        portal.style.maxWidth = `${buttonWidth}px`
      }
    }
    
    // Force immediate position update
    requestAnimationFrame(updatePosition)
    
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
    
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [isOpen, targetRef])
  
  if (!isOpen) return null
  
  return ReactDOM.createPortal(children, portalRef.current)
}
