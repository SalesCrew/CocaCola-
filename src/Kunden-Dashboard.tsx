import { useState } from 'react'
import Header from './components/Header'
import DonutChart from './components/DonutChart'
import LegendPanel from './components/LegendPanel'
import FilterCustomizer from './components/FilterCustomizer'
import ChartModal from './components/ChartModal'
import GebietsmanagerDonutChart from './components/GebietsmanagerDonutChart'
import GebietsmanagerLegendPanel from './components/GebietsmanagerLegendPanel'
import GebietsmanagerFilter from './components/GebietsmanagerFilter'
import GebietsmanagerModal from './components/GebietsmanagerModal'
import GebietsmanagerDetailModal from './components/GebietsmanagerDetailModal'
import MarketDetailModal from './components/MarketDetailModal'

interface KundenDashboardProps {
  onSwitchPage?: () => void
  onSettingsPage?: () => void
}

export default function KundenDashboard({ onSwitchPage, onSettingsPage }: KundenDashboardProps) {
  const [selectedHaFi, setSelectedHaFi] = useState('Alle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGmModalOpen, setIsGmModalOpen] = useState(false)
  const [selectedViewMode, setSelectedViewMode] = useState('Gebietsleiter')
  const [selectedGmDetail, setSelectedGmDetail] = useState<any>(null)
  const [isGmDetailModalOpen, setIsGmDetailModalOpen] = useState(false)
  const [selectedMarketDetail, setSelectedMarketDetail] = useState<any>(null)
  const [isMarketDetailModalOpen, setIsMarketDetailModalOpen] = useState(false)

  return (
    <div className="dashboard">
      <Header onSwitchPage={onSwitchPage} onSettingsPage={onSettingsPage} />
      <main className="main-content">
        <div className="top-cards">
          <div className="card">
            <div className="card-header">
              <div className="card-header-top">
                <div className="card-title" style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px'
                }}>Shelf merchandising</div>
                <div className="header-date" style={{ marginLeft: 'auto' }}>
                  {new Date().toLocaleDateString('de-DE', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="card-divider" />
            </div>
            <div className="card-content">
              <div style={{ marginLeft: '-450px' }}>
                <DonutChart onClick={() => setIsModalOpen(true)} />
              </div>
              <div className="right-side-content">
                <LegendPanel />
                <div className="additional-container">
                  <FilterCustomizer selectedHaFi={selectedHaFi} onHaFiChange={setSelectedHaFi} />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-header-top" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap', whiteSpace: 'nowrap', overflow: 'hidden', minWidth: '100%' }}>
                <div className="card-title" style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px'
                }}>Gebietsmanagement</div>
                <div className="header-date" style={{ marginLeft: 'auto' }}>
                  {new Date().toLocaleDateString('de-DE', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="card-divider" />
            </div>
            <div className="card-content mirrored">
              <GebietsmanagerFilter />
              <div className="mirrored-legend-container">
                <GebietsmanagerLegendPanel />
              </div>
              <GebietsmanagerDonutChart onClick={() => setIsGmModalOpen(true)} />
            </div>
          </div>
        </div>
        
        {/* View Mode Switcher */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          margin: '32px 0 16px 0',
          paddingLeft: '16px'
        }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.8)',
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0) 1px)',
            backgroundSize: '18px 18px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            padding: '4px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            maxWidth: '400px'
          }}>
            {['Gebietsleiter', 'Universumsmärkte', 'Flexmärkte'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedViewMode(mode)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: selectedViewMode === mode ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                  backdropFilter: selectedViewMode === mode ? 'blur(10px)' : 'none',
                  WebkitBackdropFilter: selectedViewMode === mode ? 'blur(10px)' : 'none',
                  color: selectedViewMode === mode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(51, 51, 51, 0.6)',
                  fontSize: '11px',
                  fontWeight: selectedViewMode === mode ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  boxShadow: selectedViewMode === mode ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  minWidth: '100px'
                }}
                onMouseEnter={(e) => {
                  if (selectedViewMode !== mode) {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedViewMode !== mode) {
                    (e.target as HTMLButtonElement).style.background = 'transparent'
                  }
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Gebietsmanager Cards */}
        {selectedViewMode === 'Gebietsleiter' && (
          <div style={{
            padding: '0 16px 24px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {[
              { name: 'Christoph Leitner', regions: ['Nord'], ipp: 5.3, personalGoals: 87, kuehl: 23 },
              { name: 'Christoph Zauner', regions: ['Nord'], ipp: 5.1, personalGoals: 94, kuehl: 41 },
              { name: 'Irene Traxler', regions: ['Nord'], ipp: 4.9, personalGoals: 73, kuehl: 37 },
              { name: 'Doris Stockinger', regions: ['Ost'], ipp: 5.4, personalGoals: 89, kuehl: 52 },
              { name: 'Rainer Perzl', regions: ['Ost'], ipp: 5.6, personalGoals: 81, kuehl: 28 },
              { name: 'Georg Stockreiter', regions: ['Ost'], ipp: 5.2, personalGoals: 96, kuehl: 45 },
              { name: 'Arthur Neuhold', regions: ['Ost'], ipp: 5.0, personalGoals: 78, kuehl: 34 },
              { name: 'Alexander Felsberger', regions: ['Süd'], ipp: 5.7, personalGoals: 92, kuehl: 48 },
              { name: 'Mario Riedenbauer', regions: ['Süd'], ipp: 5.5, personalGoals: 69, kuehl: 31 },
              { name: 'Michael Wilhelmi', regions: ['Süd'], ipp: 5.3, personalGoals: 91, kuehl: 39 },
              { name: 'Eva Zausinger', regions: ['Süd'], ipp: 5.1, personalGoals: 76, kuehl: 42 },
              { name: 'Thomas Nobis', regions: ['West'], ipp: 5.6, personalGoals: 98, kuehl: 58 },
              { name: 'Josef Schellhorn', regions: ['West'], ipp: 5.4, personalGoals: 84, kuehl: 29 },
              { name: 'Benjamin Spiegel', regions: ['West'], ipp: 5.2, personalGoals: 86, kuehl: 47 }
            ].map((gm) => {
              const getGoalColor = (percentage: number) => {
                if (percentage >= 90) return '#28a745'
                if (percentage >= 75) return '#fd7e14'
                return '#dc3545'
              }

              const getGoalGradient = (percentage: number) => {
                if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
                if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
                return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
              }

              return (
                <div
                  key={gm.name}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0) 1px)',
                    backgroundSize: '18px 18px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedGmDetail(gm)
                    setIsGmDetailModalOpen(true)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: 'rgba(51, 51, 51, 0.9)',
                        marginBottom: '4px'
                      }}>
                        {gm.name}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '500',
                        color: 'rgba(51, 51, 51, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {gm.regions.join(', ')}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(40, 167, 69, 0.08)',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#28a745'
                    }}>
                      IPP {gm.ipp.toFixed(1)}
                    </div>
                  </div>

                  {/* Progress Bars Container */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}>
                    {/* Personal Goals Progress */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          Persönliche Boni ziele
                        </span>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: getGoalColor(gm.personalGoals)
                        }}>
                          {gm.personalGoals}%
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${gm.personalGoals}%`,
                          height: '100%',
                          background: getGoalGradient(gm.personalGoals),
                          borderRadius: '3px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>

                    {/* Kühl Progress */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                            Kühlerinventur
                        </span>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.8)'
                        }}>
                          {gm.kuehl}/121
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(gm.kuehl / 121) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #f0c000 100%)',
                          borderRadius: '3px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Universumsmärkte Cards */}
        {selectedViewMode === 'Universumsmärkte' && (
          <div style={{
            padding: '0 16px 24px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {[
              // BILLA Markets
              { name: 'BILLA 1010', chain: 'BILLA', region: 'Nord', address: 'Stephansplatz 1, 1010 Wien' },
              { name: 'BILLA 1020', chain: 'BILLA', region: 'Nord', address: 'Praterstraße 25, 1020 Wien' },
              { name: 'BILLA 1030', chain: 'BILLA', region: 'West', address: 'Landstraßer Hauptstraße 50, 1030 Wien' },
              { name: 'BILLA 1040', chain: 'BILLA', region: 'West', address: 'Wiedner Hauptstraße 23, 1040 Wien' },
              { name: 'BILLA 1050', chain: 'BILLA', region: 'Süd', address: 'Margaretenstraße 77, 1050 Wien' },
              { name: 'BILLA 1060', chain: 'BILLA', region: 'Süd', address: 'Mariahilfer Straße 85, 1060 Wien' },
              { name: 'BILLA 1070', chain: 'BILLA', region: 'West', address: 'Neubaugasse 17, 1070 Wien' },
              { name: 'BILLA 1080', chain: 'BILLA', region: 'West', address: 'Josefstädter Straße 42, 1080 Wien' },
              { name: 'BILLA 1090', chain: 'BILLA', region: 'Nord', address: 'Alser Straße 28, 1090 Wien' },
              { name: 'BILLA 1100', chain: 'BILLA', region: 'Süd', address: 'Favoritenstraße 115, 1100 Wien' },
              // BILLA Plus Markets
              { name: 'BILLA Plus 1110', chain: 'BILLA Plus', region: 'Nord', address: 'Simmeringer Hauptstraße 96, 1110 Wien' },
              { name: 'BILLA Plus 1120', chain: 'BILLA Plus', region: 'Ost', address: 'Meidlinger Hauptstraße 73, 1120 Wien' },
              { name: 'BILLA Plus 1130', chain: 'BILLA Plus', region: 'Ost', address: 'Hietzinger Hauptstraße 22, 1130 Wien' },
              { name: 'BILLA Plus 1140', chain: 'BILLA Plus', region: 'West', address: 'Hütteldorfer Straße 81, 1140 Wien' },
              { name: 'BILLA Plus 1150', chain: 'BILLA Plus', region: 'West', address: 'Mariahilfer Straße 163, 1150 Wien' },
              { name: 'BILLA Plus 1160', chain: 'BILLA Plus', region: 'Nord', address: 'Ottakringer Straße 37, 1160 Wien' },
              { name: 'BILLA Plus 1170', chain: 'BILLA Plus', region: 'Nord', address: 'Hernalser Hauptstraße 156, 1170 Wien' },
              { name: 'BILLA Plus 1180', chain: 'BILLA Plus', region: 'West', address: 'Währinger Straße 121, 1180 Wien' },
              { name: 'BILLA Plus 1190', chain: 'BILLA Plus', region: 'Ost', address: 'Döblinger Hauptstraße 65, 1190 Wien' },
              { name: 'BILLA Plus 1200', chain: 'BILLA Plus', region: 'Ost', address: 'Brigittenauer Lände 48, 1200 Wien' },
              // Spar Markets
              { name: 'Spar 1210', chain: 'Spar', region: 'Nord', address: 'Floridsdorfer Hauptstraße 28, 1210 Wien' },
              { name: 'Spar 1220', chain: 'Spar', region: 'Ost', address: 'Donaufelder Straße 101, 1220 Wien' },
              { name: 'Spar 1230', chain: 'Spar', region: 'Süd', address: 'Liesinger Platz 3, 1230 Wien' },
              { name: 'Spar 2100', chain: 'Spar', region: 'West', address: 'Hauptstraße 42, 2100 Korneuburg' },
              { name: 'Spar 2110', chain: 'Spar', region: 'Ost', address: 'Bahnhofstraße 15, 2110 Bisamberg' },
              { name: 'Spar 2120', chain: 'Spar', region: 'Nord', address: 'Kirchengasse 8, 2120 Wolkersdorf' },
              { name: 'Spar 2130', chain: 'Spar', region: 'Ost', address: 'Wiener Straße 33, 2130 Mistelbach' },
              { name: 'Spar 2140', chain: 'Spar', region: 'Süd', address: 'Hauptplatz 12, 2140 Kirchberg' },
              { name: 'Spar 2150', chain: 'Spar', region: 'West', address: 'Bahnstraße 7, 2150 Asparn' },
              { name: 'Spar 2160', chain: 'Spar', region: 'West', address: 'Marktplatz 5, 2160 Wolfsbach' },
              // Eurospar Markets
              { name: 'Eurospar 2170', chain: 'Eurospar', region: 'Nord', address: 'Hauptstraße 89, 2170 Poysdorf' },
              { name: 'Eurospar 2180', chain: 'Eurospar', region: 'West', address: 'Stadtplatz 14, 2180 Pernersdorf' },
              { name: 'Eurospar 2190', chain: 'Eurospar', region: 'Nord', address: 'Wiener Straße 66, 2190 Gaweinstal' },
              { name: 'Eurospar 2200', chain: 'Eurospar', region: 'Ost', address: 'Bahnhofstraße 31, 2200 Groß Ebersdorf' },
              { name: 'Eurospar 2210', chain: 'Eurospar', region: 'West', address: 'Hauptplatz 8, 2210 Zistersdorf' },
              { name: 'Eurospar 2220', chain: 'Eurospar', region: 'Nord', address: 'Marktstraße 19, 2220 Großenzersdorf' },
              { name: 'Eurospar 2230', chain: 'Eurospar', region: 'Süd', address: 'Kirchengasse 25, 2230 Gänserndorf' },
              { name: 'Eurospar 2240', chain: 'Eurospar', region: 'West', address: 'Stadtplatz 3, 2240 Prottes' },
              { name: 'Eurospar 2250', chain: 'Eurospar', region: 'Ost', address: 'Hauptstraße 47, 2250 Markgrafneusiedl' },
              { name: 'Eurospar 2260', chain: 'Eurospar', region: 'Süd', address: 'Bahnstraße 22, 2260 Angern' },
              // Interspar Markets
              { name: 'Interspar 3100', chain: 'Interspar', region: 'Nord', address: 'Kremser Landstraße 84, 3100 St. Pölten' },
              { name: 'Interspar 3110', chain: 'Interspar', region: 'Süd', address: 'Wiener Straße 119, 3110 Herzogenburg' },
              { name: 'Interspar 3120', chain: 'Interspar', region: 'West', address: 'Hauptplatz 23, 3120 Wolfsgraben' },
              { name: 'Interspar 3130', chain: 'Interspar', region: 'Nord', address: 'Bahnhofstraße 56, 3130 Herzogsdorf' },
              { name: 'Interspar 3140', chain: 'Interspar', region: 'Süd', address: 'Stadtplatz 7, 3140 Pottenbrunn' },
              { name: 'Interspar 3150', chain: 'Interspar', region: 'West', address: 'Hauptstraße 91, 3150 Wilhelmsburg' },
              { name: 'Interspar 3160', chain: 'Interspar', region: 'Nord', address: 'Marktgasse 14, 3160 Traisen' },
              { name: 'Interspar 3170', chain: 'Interspar', region: 'Ost', address: 'Kirchenplatz 2, 3170 Hainfeld' },
              { name: 'Interspar 3180', chain: 'Interspar', region: 'Süd', address: 'Wiener Straße 38, 3180 Lilienfeld' },
              { name: 'Interspar 3190', chain: 'Interspar', region: 'West', address: 'Bahnstraße 11, 3190 Kirchberg' },
              // Maxi Markt Markets
              { name: 'Maxi Markt 4010', chain: 'Maxi Markt', region: 'Süd', address: 'Linzer Straße 140, 4010 Linz' },
              { name: 'Maxi Markt 4020', chain: 'Maxi Markt', region: 'Ost', address: 'Freistädter Straße 68, 4020 Linz' },
              { name: 'Maxi Markt 4030', chain: 'Maxi Markt', region: 'Süd', address: 'Landstraße 35, 4030 Linz' },
              { name: 'Maxi Markt 4040', chain: 'Maxi Markt', region: 'Ost', address: 'Hafenstraße 47, 4040 Linz' },
              { name: 'Maxi Markt 4050', chain: 'Maxi Markt', region: 'Süd', address: 'Industriezeile 56, 4050 Traun' },
              { name: 'Maxi Markt 4060', chain: 'Maxi Markt', region: 'Ost', address: 'Wiener Straße 88, 4060 Leonding' },
              { name: 'Maxi Markt 4070', chain: 'Maxi Markt', region: 'Süd', address: 'Hauptplatz 12, 4070 Eferding' },
              { name: 'Maxi Markt 4080', chain: 'Maxi Markt', region: 'Ost', address: 'Bahnhofstraße 29, 4080 Grieskirchen' },
              { name: 'Maxi Markt 4090', chain: 'Maxi Markt', region: 'Süd', address: 'Stadtplatz 8, 4090 Engelhartszell' },
              { name: 'Maxi Markt 4100', chain: 'Maxi Markt', region: 'Ost', address: 'Marktstraße 15, 4100 Ottensheim' },
              // ADEG Markets
              { name: 'ADEG 5010', chain: 'ADEG', region: 'West', address: 'Getreidegasse 39, 5010 Salzburg' },
              { name: 'ADEG 5020', chain: 'ADEG', region: 'Süd', address: 'Alpenstraße 107, 5020 Salzburg' },
              { name: 'ADEG 5030', chain: 'ADEG', region: 'West', address: 'Ignaz-Harrer-Straße 32, 5030 Salzburg' },
              { name: 'ADEG 5040', chain: 'ADEG', region: 'Süd', address: 'Hellbrunner Straße 59, 5040 Salzburg' },
              { name: 'ADEG 5050', chain: 'ADEG', region: 'Ost', address: 'Aigner Straße 25, 5050 Salzburg' },
              { name: 'ADEG 5060', chain: 'ADEG', region: 'West', address: 'Maxglaner Hauptstraße 72, 5060 Salzburg' },
              { name: 'ADEG 5070', chain: 'ADEG', region: 'Süd', address: 'Berchtesgadener Straße 36, 5070 Siezenheim' },
              { name: 'ADEG 5080', chain: 'ADEG', region: 'Ost', address: 'Bahnhofstraße 44, 5080 Grödig' },
              { name: 'ADEG 5090', chain: 'ADEG', region: 'Süd', address: 'Hauptstraße 18, 5090 Lofer' },
              { name: 'ADEG 6010', chain: 'ADEG', region: 'West', address: 'Maria-Theresien-Straße 31, 6010 Innsbruck' }
            ].map((market) => {
              const ipp = 4.8 + Math.random() * 1.1
              const marktZiele = Math.floor(Math.random() * 40) + 60
              return {
                ...market,
                ipp,
                marktZiele,
                kuehlInventur: null // No Kühlerinventur for Universumsmärkte
              }
            }).map((market) => {
              const getGoalColor = (percentage: number) => {
                if (percentage >= 90) return '#28a745'
                if (percentage >= 75) return '#fd7e14'
                return '#dc3545'
              }

              const getGoalGradient = (percentage: number) => {
                if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
                if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
                return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
              }

              return (
                <div
                  key={market.name}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0) 1px)',
                    backgroundSize: '18px 18px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedMarketDetail(market)
                    setIsMarketDetailModalOpen(true)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: 'rgba(51, 51, 51, 0.9)',
                        marginBottom: '4px'
                      }}>
                        {market.name}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '500',
                        color: 'rgba(51, 51, 51, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {market.region}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(40, 167, 69, 0.08)',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#28a745'
                    }}>
                      IPP {market.ipp.toFixed(1)}
                    </div>
                  </div>

                  {/* Progress Bars Container */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}>
                    {/* Markt Ziele Progress */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          Markt Ziele
                        </span>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: getGoalColor(market.marktZiele)
                        }}>
                          {market.marktZiele}%
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${market.marktZiele}%`,
                          height: '100%',
                          background: getGoalGradient(market.marktZiele),
                          borderRadius: '3px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Flexmärkte Cards */}
        {selectedViewMode === 'Flexmärkte' && (
          <div style={{
            padding: '0 16px 24px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {[
              { name: 'Flex Market Zentrum', chain: 'FlexMart', region: 'Nord', address: 'Zentrumsplatz 1, 1010 Wien' },
              { name: 'Flex Store City', chain: 'FlexMart', region: 'Nord', address: 'Citystraße 15, 1020 Wien' },
              { name: 'Quick Shop Express', chain: 'QuickShop', region: 'Ost', address: 'Expressweg 22, 1030 Wien' },
              { name: 'Flex Point Mall', chain: 'FlexMart', region: 'West', address: 'Mallstraße 8, 1040 Wien' },
              { name: 'Speed Market Hub', chain: 'SpeedMart', region: 'Süd', address: 'Hubgasse 33, 1050 Wien' },
              { name: 'Flex Corner Shop', chain: 'FlexMart', region: 'Nord', address: 'Cornerstraße 44, 1060 Wien' },
              { name: 'Quick Grab Station', chain: 'QuickShop', region: 'West', address: 'Stationplatz 7, 1070 Wien' },
              { name: 'Flex Mini Market', chain: 'FlexMart', region: 'Ost', address: 'Minimartgasse 19, 1080 Wien' },
              { name: 'Speed Stop Central', chain: 'SpeedMart', region: 'Süd', address: 'Centralweg 12, 1090 Wien' },
              { name: 'Flex Express Point', chain: 'FlexMart', region: 'Nord', address: 'Expressplatz 26, 1100 Wien' },
              { name: 'Quick Buy Corner', chain: 'QuickShop', region: 'West', address: 'Buystraße 31, 1110 Wien' },
              { name: 'Flex Grab & Go', chain: 'FlexMart', region: 'Ost', address: 'Grabgasse 5, 1120 Wien' },
              { name: 'Speed Shop Plaza', chain: 'SpeedMart', region: 'Süd', address: 'Plazaweg 18, 1130 Wien' },
              { name: 'Flex Quick Stop', chain: 'FlexMart', region: 'Nord', address: 'Quickstopstraße 39, 1140 Wien' },
              { name: 'Express Corner Market', chain: 'QuickShop', region: 'West', address: 'Marketplatz 14, 1150 Wien' },
              { name: 'Flex Speed Station', chain: 'FlexMart', region: 'Ost', address: 'Speedgasse 27, 1160 Wien' },
              { name: 'Quick Point Shop', chain: 'QuickShop', region: 'Süd', address: 'Pointstraße 42, 1170 Wien' },
              { name: 'Flex Mini Hub', chain: 'FlexMart', region: 'Nord', address: 'Minihubweg 9, 1180 Wien' },
              { name: 'Speed Express Corner', chain: 'SpeedMart', region: 'West', address: 'Expresscorner 21, 1190 Wien' },
              { name: 'Flex Market Station', chain: 'FlexMart', region: 'Ost', address: 'Stationsgasse 35, 1200 Wien' },
              { name: 'Quick Hub Express', chain: 'QuickShop', region: 'Süd', address: 'Hubexpressplatz 6, 1210 Wien' },
              { name: 'Flex Corner Central', chain: 'FlexMart', region: 'Nord', address: 'Centralcorner 48, 1220 Wien' },
              { name: 'Speed Grab Point', chain: 'SpeedMart', region: 'West', address: 'Grabpointstraße 13, 1230 Wien' },
              { name: 'Flex Stop & Shop', chain: 'FlexMart', region: 'Ost', address: 'Stopshopgasse 29, 2100 Korneuburg' },
              { name: 'Quick Mini Station', chain: 'QuickShop', region: 'Süd', address: 'Ministationweg 17, 2110 Bisamberg' },
              { name: 'Flex Express Hub', chain: 'FlexMart', region: 'Nord', address: 'Expresshubplatz 24, 2120 Wolkersdorf' },
              { name: 'Speed Point Market', chain: 'SpeedMart', region: 'West', address: 'Pointmarktstraße 11, 2130 Mistelbach' },
              { name: 'Flex Quick Corner', chain: 'FlexMart', region: 'Ost', address: 'Quickcornergasse 36, 2140 Kirchberg' },
              { name: 'Express Stop Plaza', chain: 'QuickShop', region: 'Süd', address: 'Stopplazaweg 8, 2150 Asparn' },
              { name: 'Flex Speed Hub', chain: 'FlexMart', region: 'Nord', address: 'Speedhubplatz 43, 2160 Wolfsbach' }
            ].map((market) => {
              const hasIPP = Math.random() > 0.3 // 70% chance of having IPP
              const ipp = hasIPP ? Math.random() * 3.5 : null // 0-3.5 range for flex markets
              const marktZiele = Math.floor(Math.random() * 40) + 60

              return {
                ...market,
                ipp,
                marktZiele,
                kuehlInventur: Math.random() > 0.7 ? 100 : 0, // 70% chance of being complete
                hasIPP,
                isFlexMarket: true // Flag to identify flex markets
              }
            }).map((market) => {
              const getGoalColor = (percentage: number) => {
                if (percentage >= 90) return '#28a745'
                if (percentage >= 75) return '#fd7e14'
                return '#dc3545'
              }

              const getGoalGradient = (percentage: number) => {
                if (percentage >= 90) return 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
                if (percentage >= 75) return 'linear-gradient(90deg, #ffe4a3 0%, #fd7e14 100%)'
                return 'linear-gradient(90deg, #f8a8a8 0%, #dc3545 100%)'
              }

              return (
                <div
                  key={market.name}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, rgba(0, 0, 0, 0) 1px)',
                    backgroundSize: '18px 18px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedMarketDetail(market)
                    setIsMarketDetailModalOpen(true)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: 'rgba(51, 51, 51, 0.9)',
                        marginBottom: '4px'
                      }}>
                        {market.name}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '500',
                        color: 'rgba(51, 51, 51, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {market.region}
                      </div>
                    </div>
                    {market.hasIPP && (
                      <div style={{
                        background: 'rgba(40, 167, 69, 0.08)',
                        border: '1px solid rgba(40, 167, 69, 0.2)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#28a745'
                      }}>
                        IPP {market.ipp!.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Progress Bars Container - Only Markt Ziele */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}>
                    {/* Marktbesuche YTD - Clean count display */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                          Marktbesuche YTD
                        </span>
                        <span style={{ 
                          fontSize: '16px', 
                          fontWeight: '700',
                          color: '#28a745',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                        }}>
                          {Math.floor(Math.random() * 21)}
                        </span>
                      </div>
                    </div>

                    {/* Kühlerinventur Progress */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: 'rgba(51, 51, 51, 0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}>
                              Kühlerinventur
                        </span>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: market.kuehlInventur === 100 ? '#28a745' : '#dc3545'
                        }}>
                          {market.kuehlInventur === 100 ? '✓' : '–'}
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${market.kuehlInventur}%`,
                          height: '100%',
                          background: market.kuehlInventur === 100
                            ? 'linear-gradient(90deg, #a8e6a3 0%, #28a745 100%)'
                            : 'transparent',
                          borderRadius: '3px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <ChartModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          selectedHaFi={selectedHaFi}
          onHaFiChange={setSelectedHaFi}
        />
        <GebietsmanagerModal 
          isOpen={isGmModalOpen} 
          onClose={() => setIsGmModalOpen(false)} 
        />
        <GebietsmanagerDetailModal
          isOpen={isGmDetailModalOpen}
          onClose={() => setIsGmDetailModalOpen(false)}
          gmData={selectedGmDetail}
        />
        <MarketDetailModal
          isOpen={isMarketDetailModalOpen}
          onClose={() => setIsMarketDetailModalOpen(false)}
          marketData={selectedMarketDetail}
        />
      </main>
    </div>
  )
}


