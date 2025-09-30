import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import AustriaMap from './AustriaMap'

interface GebietsmanagerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  gmData: {
    name: string
    regions: string[]
    ipp: number
    personalGoals: number
    kuehl: number
  } | null
}

// Generate random goals data
const generateGoalsData = () => {
  return {
    schuetteDisplays: Math.floor(Math.random() * 40) + 60,
    distributionsziel: Math.floor(Math.random() * 30) + 70,
    flexziel: Math.floor(Math.random() * 35) + 65,
    qualitaetsziele: Math.floor(Math.random() * 25) + 75
  }
}


// All available markets
export const getAllMarkets = () => [
  { name: 'BILLA 1010', chain: 'BILLA', region: 'Nord', address: 'Stephansplatz 1, 1010 Wien', lat: 48.2084, lng: 16.3721 },
  { name: 'BILLA 1020', chain: 'BILLA', region: 'Nord', address: 'Praterstraße 25, 1020 Wien', lat: 48.2164, lng: 16.3838 },
  { name: 'BILLA 1030', chain: 'BILLA', region: 'West', address: 'Landstraßer Hauptstraße 50, 1030 Wien', lat: 48.2043, lng: 16.3941 },
  { name: 'BILLA 1040', chain: 'BILLA', region: 'West', address: 'Wiedner Hauptstraße 23, 1040 Wien', lat: 48.1952, lng: 16.3657 },
  { name: 'BILLA 1050', chain: 'BILLA', region: 'Süd', address: 'Margaretenstraße 77, 1050 Wien', lat: 48.1856, lng: 16.3572 },
  { name: 'BILLA 1060', chain: 'BILLA', region: 'Süd', address: 'Mariahilfer Straße 85, 1060 Wien', lat: 48.2001, lng: 16.3458 },
  { name: 'BILLA 1070', chain: 'BILLA', region: 'West', address: 'Neubaugasse 17, 1070 Wien', lat: 48.2052, lng: 16.3524 },
  { name: 'BILLA 1080', chain: 'BILLA', region: 'West', address: 'Josefstädter Straße 42, 1080 Wien', lat: 48.2133, lng: 16.3452 },
  { name: 'BILLA 1090', chain: 'BILLA', region: 'Nord', address: 'Alser Straße 28, 1090 Wien', lat: 48.2188, lng: 16.3542 },
  { name: 'BILLA 1100', chain: 'BILLA', region: 'Süd', address: 'Favoritenstraße 115, 1100 Wien', lat: 48.1756, lng: 16.3821 },
  { name: 'BILLA Plus 1110', chain: 'BILLA Plus', region: 'Nord', address: 'Simmeringer Hauptstraße 96, 1110 Wien', lat: 48.1851, lng: 16.4242 },
  { name: 'BILLA Plus 1120', chain: 'BILLA Plus', region: 'Ost', address: 'Meidlinger Hauptstraße 73, 1120 Wien', lat: 48.1756, lng: 16.3345 },
  { name: 'BILLA Plus 1130', chain: 'BILLA Plus', region: 'Ost', address: 'Hietzinger Hauptstraße 22, 1130 Wien', lat: 48.1856, lng: 16.3011 },
  { name: 'BILLA Plus 1140', chain: 'BILLA Plus', region: 'West', address: 'Hütteldorfer Straße 81, 1140 Wien', lat: 48.2042, lng: 16.2841 },
  { name: 'BILLA Plus 1150', chain: 'BILLA Plus', region: 'West', address: 'Mariahilfer Straße 163, 1150 Wien', lat: 48.1954, lng: 16.3211 },
  { name: 'Spar 1210', chain: 'Spar', region: 'Nord', address: 'Floridsdorfer Hauptstraße 28, 1210 Wien', lat: 48.2564, lng: 16.3951 },
  { name: 'Spar 1220', chain: 'Spar', region: 'Ost', address: 'Donaufelder Straße 101, 1220 Wien', lat: 48.2434, lng: 16.4156 },
  { name: 'Spar 1230', chain: 'Spar', region: 'Süd', address: 'Liesinger Platz 3, 1230 Wien', lat: 48.1356, lng: 16.2975 },
  { name: 'Spar 2100', chain: 'Spar', region: 'West', address: 'Hauptstraße 42, 2100 Korneuburg', lat: 48.3477, lng: 16.3307 },
  { name: 'Spar 2110', chain: 'Spar', region: 'Ost', address: 'Bahnhofstraße 15, 2110 Bisamberg', lat: 48.3156, lng: 16.3654 },
  { name: 'Eurospar 2170', chain: 'Eurospar', region: 'Nord', address: 'Hauptstraße 89, 2170 Poysdorf', lat: 48.6789, lng: 16.6321 },
  { name: 'Eurospar 2180', chain: 'Eurospar', region: 'West', address: 'Stadtplatz 14, 2180 Pernersdorf', lat: 48.5234, lng: 16.2987 },
  { name: 'Eurospar 2190', chain: 'Eurospar', region: 'Nord', address: 'Wiener Straße 66, 2190 Gaweinstal', lat: 48.6543, lng: 16.7898 },
  { name: 'Eurospar 2200', chain: 'Eurospar', region: 'Ost', address: 'Bahnhofstraße 31, 2200 Groß Ebersdorf', lat: 48.0987, lng: 16.5432 },
  { name: 'Interspar 3100', chain: 'Interspar', region: 'Nord', address: 'Kremser Landstraße 84, 3100 St. Pölten', lat: 48.2066, lng: 15.6254 },
  { name: 'Interspar 3110', chain: 'Interspar', region: 'Süd', address: 'Wiener Straße 119, 3110 Herzogenburg', lat: 48.2845, lng: 15.7123 },
  { name: 'Interspar 3120', chain: 'Interspar', region: 'West', address: 'Hauptplatz 23, 3120 Wolfsgraben', lat: 48.1234, lng: 16.1345 },
  { name: 'ADEG 5010', chain: 'ADEG', region: 'West', address: 'Getreidegasse 39, 5010 Salzburg', lat: 47.8025, lng: 13.0445 },
  { name: 'ADEG 5020', chain: 'ADEG', region: 'Süd', address: 'Alpenstraße 107, 5020 Salzburg', lat: 47.8156, lng: 13.0345 },
  { name: 'ADEG 5030', chain: 'ADEG', region: 'West', address: 'Ignaz-Harrer-Straße 32, 5030 Salzburg', lat: 47.7945, lng: 13.0556 },
  { name: 'BILLA 4010', chain: 'BILLA', region: 'Ost', address: 'Hauptplatz 15, 4010 Linz', lat: 48.3069, lng: 14.2858 },
  { name: 'Spar 6010', chain: 'Spar', region: 'West', address: 'Maria-Theresien-Straße 78, 6010 Innsbruck', lat: 47.2692, lng: 11.4041 },
  { name: 'BILLA Plus 8010', chain: 'BILLA Plus', region: 'Süd', address: 'Herrengasse 16, 8010 Graz', lat: 47.0707, lng: 15.4395 },
  { name: 'Interspar 9010', chain: 'Interspar', region: 'Süd', address: 'Hauptplatz 8, 9010 Klagenfurt', lat: 46.6244, lng: 14.3055 },
  { name: 'Eurospar 9020', chain: 'Eurospar', region: 'Süd', address: 'Bahnhofstraße 45, 9020 Klagenfurt', lat: 46.6200, lng: 14.3200 },
  // Additional 5 pins for central Austria
  { name: 'BILLA 3600', chain: 'BILLA', region: 'Ost', address: 'Stadtplatz 12, 3600 Stockerau', lat: 48.3833, lng: 16.2167 },
  { name: 'Spar 3340', chain: 'Spar', region: 'West', address: 'Hauptstraße 45, 3340 Waidhofen an der Ybbs', lat: 47.9597, lng: 14.7831 },
  { name: 'ADEG 4400', chain: 'ADEG', region: 'Ost', address: 'Kirchenplatz 8, 4400 Steyr', lat: 48.0458, lng: 14.4189 },
  { name: 'Interspar 3500', chain: 'Interspar', region: 'West', address: 'Wiener Straße 78, 3500 Krems an der Donau', lat: 48.4167, lng: 15.6167 },
  { name: 'BILLA Plus 4600', chain: 'BILLA Plus', region: 'Ost', address: 'Stadtplatz 23, 4600 Wels', lat: 48.1597, lng: 14.0289 }
]

// Generate 40 pins total (approximately 2 per GL) - distributed across Austria
export const generateAll35Pins = () => {
  const allMarkets = getAllMarkets()
  const glNames = [
    'Mario Riedenbauer', 'Michael Wilhelmi', 'Eva Zausinger', 'Thomas Nobis', 
    'Josef Schellhorn', 'Benjamin Spiegel', 'Christoph Leitner', 'Christoph Zauner', 
    'Irene Traxler', 'Doris Stockinger', 'Rainer Perzl', 'Georg Stockreiter', 
    'Arthur Neuhold', 'Alexander Felsberger', 'Stefan Bauer', 'Maria Weber', 
    'Christian Meyer', 'Sandra Huber', 'Markus Hofer', 'Andreas Müller'
  ]
  
  // Select markets distributed across Austria - exactly 10 in Vienna, 30 spread across country
  const selectedIndices = [
    // Vienna area (exactly 10 pins)
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    // Lower Austria spread (8 pins) 
    18, 19, 20, 21, 22, 23, 24, 25, // Korneuburg, Bisamberg, Poysdorf, Pernersdorf, Gaweinstal, Groß Ebersdorf, St. Pölten, Herzogenburg
    // Western Austria - Salzburg area (3 pins)
    27, 28, 29, // All Salzburg markets
    // Upper Austria - Linz (1 pin)
    30, // Linz  
    // Western Austria - Tyrol (1 pin)
    31, // Innsbruck
    // Southern Austria - Styria (1 pin)
    32, // Graz
    // Southern Austria - Carinthia (2 pins) 
    33, 34, // Both Klagenfurt markets
    // Central Austria - new 5 pins (5 pins)
    35, 36, 37, 38, 39, // Stockerau, Waidhofen, Steyr, Krems, Wels
    // Fill remaining spread with other Vienna-area markets treated as regional (10 pins)
    10, 11, 12, 13, 14, 15, 16, 17, 26 // These represent broader Vienna metropolitan region
  ]
  
  const result = selectedIndices.slice(0, 40).map((marketIndex, index) => {
    const market = allMarkets[marketIndex]
    return {
      ...market,
      manager: glNames[Math.floor(index / 2) % glNames.length],
      travelMin: 15 + (index % 8) * 5, // 15-50 minutes range
      durationMin: 30 + (index % 6) * 8, // 30-70 minutes range
      visitDate: '2025-09-30',
      status: ['Sehr voll', 'Halb voll', 'Leer'][index % 3],
      frequency: [6, 8, 10, 12, 24][index % 5] // per year options
    }
  })
  return result
}

// Market assignment function - assigns 10 specific markets to each GL
const getGLMarkets = (glName: string) => {
  const allMarkets = getAllMarkets()

  // Create deterministic assignment based on GL name hash
  const glHash = glName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const startIndex = glHash % (allMarkets.length - 10)
  const frequencies = [6, 8, 10, 12, 24] // per year options
  
  return allMarkets.slice(startIndex, startIndex + 10).map((market, idx) => ({
    ...market,
    frequency: frequencies[(glHash + idx) % frequencies.length]
  }))
}

export default function GebietsmanagerDetailModal({ isOpen, onClose, gmData }: GebietsmanagerDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState<'goals' | 'markets' | 'mhd' | 'weltkarte'>('goals')
  const [goals] = useState(generateGoalsData())
  const bonusAverage = Math.round((goals.schuetteDisplays + goals.distributionsziel + goals.flexziel + goals.qualitaetsziele) / 4)
  const praemie = Math.round((bonusAverage / 100) * 1050)
  const [mhdData] = useState(() => Array.from({ length: 7 }, (_, i) => ({
    label: `MHD ${i + 1}`,
    value: Math.floor(Math.random() * 40) + 60
  })))
  const [glMarkets] = useState(() => getGLMarkets(gmData?.name || 'Default'))
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])


  if (!isOpen || !gmData) return null

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
    if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
    return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
  }

  const goalItems = [
    { label: 'Schütten/Displays', value: goals.schuetteDisplays },
    { label: 'Distributionsziel', value: goals.distributionsziel },
    { label: 'Flexziel', value: goals.flexziel },
    { label: 'Qualitätsziele', value: goals.qualitaetsziele }
  ]

  return createPortal(
    <>
      <style>{`
        .modal-tab-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>
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
        zIndex: 10000,
        padding: '20px'
      }}>
      <div 
        ref={modalRef}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '98vh',
          overflow: 'visible',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            color: 'rgba(51, 51, 51, 0.6)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
              <h2 style={{
                fontSize: '20px',
            fontWeight: '700',
                color: 'rgba(51, 51, 51, 0.9)',
            margin: '0 0 4px 0'
              }}>
                {gmData.name}
              </h2>
              <div style={{
                fontSize: '12px',
            color: 'rgba(51, 51, 51, 0.5)',
            fontWeight: '500',
                textTransform: 'uppercase',
            letterSpacing: '0.5px'
              }}>
                {gmData.regions.join(', ')}
              </div>
          </div>

        {/* Stats Row */}
        <div className="modal-stats-container" style={{ margin: '20px 20px 0 20px' }}>
          <div className="stat-item" style={{ 
            background: 'rgba(16, 185, 129, 0.08)',
            border: '2px solid #10b981',
              borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
            }}>
            <div className="stat-value" style={{ color: '#10b981' }}>{gmData.ipp}</div>
            <div className="stat-label" style={{ color: '#10b981' }}>IPP</div>
            </div>
          <div className="stat-item" style={{ 
            background: 'rgba(0, 123, 255, 0.08)',
            border: '2px solid #007bff',
              borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)'
            }}>
            <div className="stat-value" style={{ color: '#007bff' }}>{praemie}€</div>
            <div className="stat-label" style={{ color: '#007bff' }}>
              Prämie <span style={{ fontSize: '7px', opacity: '0.6' }}>QTD</span>
            </div>
          </div>
          <div className="stat-item" style={{ 
            background: 'rgba(108, 117, 125, 0.08)',
            border: '2px solid #6c757d',
              borderRadius: '12px',
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(108, 117, 125, 0.15)'
          }}>
            <div className="stat-value" style={{ color: '#6c757d' }}>34/70</div>
            <div className="stat-label" style={{ color: '#6c757d' }}>
              Märkte <span style={{ fontSize: '7px', opacity: '0.6' }}>QTD</span>
            </div>
            </div>
          </div>

        {/* Progress Bars */}
        <div style={{ padding: '16px 24px' }}>
            {/* Personal Goals */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                PERSÖNLICHE BONI ZIELE
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#28a745' }}>
                  {bonusAverage}%
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${bonusAverage}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)',
                borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Kühlerinventur */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                KÜHLERINVENTUR
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffc107' }}>
                  60/120
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                width: `${Math.min((60 / 120) * 100, 100)}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #ffe4a3 0%, #ffc107 100%)',
                borderRadius: '4px'
                }} />
            </div>
          </div>

            {/* MHD */}
          <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.7)' }}>
                MHD
                </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#007bff' }}>
                  {Math.round(mhdData.reduce((sum, item) => sum + item.value, 0) / mhdData.length)}%
                </span>
              </div>
              <div style={{
              width: '100%',
                height: '8px',
              background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                width: `${Math.round(mhdData.reduce((sum, item) => sum + item.value, 0) / mhdData.length)}%`,
                  height: '100%',
                background: 'linear-gradient(90deg, #a3c7ff 0%, #007bff 100%)',
                borderRadius: '4px'
                }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'rgba(0, 0, 0, 0.01)'
        }}>
          {(['goals', 'mhd', 'markets', 'weltkarte'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: 'none',
                fontSize: '12px',
                fontWeight: selectedTab === tab ? '600' : '500',
                color: selectedTab === tab ? 'rgba(51, 51, 51, 0.9)' : 'rgba(51, 51, 51, 0.5)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              {tab === 'goals' ? 'Meine Bonus Ziele' : tab === 'markets' ? 'Meine Märkte' : tab === 'mhd' ? 'MHD' : 'Weltkarte'}
              {selectedTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: '#dc2626',
                  borderRadius: '1px'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modal-tab-content" style={{
          padding: selectedTab === 'weltkarte' ? '0' : '20px 24px',
          flex: '1',
          minHeight: 0,
          overflowY: selectedTab === 'weltkarte' ? 'visible' : 'scroll',
          overflowX: selectedTab === 'weltkarte' ? 'visible' : 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedTab === 'goals' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
              {goalItems.map((goal, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    marginBottom: '6px'
                      }}>
                        <span style={{
                      fontSize: '13px', 
                          fontWeight: '500',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {goal.label}
                        </span>
                        <span style={{
                      fontSize: '13px', 
                      fontWeight: '700',
                      color: goal.value >= 90 ? '#28a745' : goal.value >= 75 ? '#fd7e14' : '#dc3545'
                        }}>
                          {goal.value}%
                        </span>
                      </div>
                      <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${goal.value}%`,
                          height: '100%',
                      background: getProgressColor(goal.value),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
              ))}
            </div>
          ) : selectedTab === 'markets' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(51, 51, 51, 0.8)', marginBottom: '8px' }}>
                Zugewiesene Märkte ({glMarkets.length})
              </div>
              {glMarkets.map((market, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.01)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)'
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.01)'
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'
                }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: 'rgba(51, 51, 51, 0.9)',
                      marginBottom: '2px'
                    }}>
                      {market.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'rgba(51, 51, 51, 0.6)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '200px'
                    }}>
                      {market.address}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      background: 'rgba(40, 167, 69, 0.08)',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#28a745'
                    }}>
                      {market.frequency}/Jahr
                    </span>
                    </div>
                  </div>
              ))}
            </div>
          ) : selectedTab === 'mhd' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '500px' }}>
              {mhdData.map((mhd, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    marginBottom: '6px'
                      }}>
                        <span style={{
                      fontSize: '13px', 
                          fontWeight: '500',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {mhd.label}
                        </span>
                        <span style={{
                      fontSize: '13px', 
                      fontWeight: '700',
                      color: mhd.value >= 90 ? '#28a745' : mhd.value >= 75 ? '#fd7e14' : '#dc3545'
                        }}>
                          {mhd.value}%
                        </span>
                      </div>
                      <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${mhd.value}%`,
                          height: '100%',
                      background: getProgressColor(mhd.value),
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                        }} />
                  </div>
                </div>
              ))}
            </div>
          ) : selectedTab === 'weltkarte' ? (
            <div style={{
              flex: 1,
              width: '100%',
              position: 'relative',
              overflow: 'visible',
              margin: '-50px 0'
            }}>
              <AustriaMap 
                pins={generateAll35Pins().map((market, index) => ({
                  id: `market-${index}`,
                  name: market.name,
                  lat: market.lat,
                  lng: market.lng,
                  manager: market.manager,
                  visitDate: market.visitDate,
                  travelMin: market.travelMin,
                  durationMin: market.durationMin,
                  status: market.status
                }))}
              />
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </>,
    document.body
  )
}