/**
 * Professional Live Section Component
 * User-friendly, responsive design with better UX
 */
import React from 'react'
import ProjectedScoreTable from './ProjectedScoreTable'


import cricketBatIcon from '../../assets/cricket-bat.png'

const CrexLiveSection = ({
  striker,
  nonStriker,
  currentBowler,
  partnership,
  lastWicket,
  recentOvers,
  commentary,
  activeCommentaryFilter,
  onCommentaryFilterChange,
  currentRunRate,
  requiredRunRate,
  currentRuns,
  currentOvers,
  oversLimit,
  target,
  runsNeeded,
  ballsRemaining,
  matchStatus,
  matchPhase,
  currentInnings,
  resultSummary,
  firstSide,
  secondSide,
}) => {
  // Format partnership: "runs(balls)"
  const formatPartnership = () => {
    if (!partnership) return '0(0)'
    return `${partnership.runs || 0}(${partnership.balls || 0})`
  }

  // Format last wicket: "Name runs(balls)"
  const formatLastWicket = () => {
    if (!lastWicket) return null
    return `${lastWicket.batsmanName || 'Batsman'} ${lastWicket.runs || 0}(${lastWicket.balls || 0})`
  }

  // Get scrolling ref
  const scrollRef = React.useRef(null)

  // Auto-scroll to end when overs update
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [recentOvers])

  // Commentary filters
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'overs', label: 'Overs' },
    { id: 'wickets', label: 'W' },
    { id: 'sixes', label: '6s' },
    { id: 'fours', label: '4s' },
    { id: 'milestone', label: 'Milestone' },
  ]

  // Group commentary by over for the 'Overs' view
  const oversGroups = React.useMemo(() => {
    if (!recentOvers || recentOvers.length === 0) return []
    return [...recentOvers].reverse()
  }, [recentOvers])

  // Filter commentary
  const filteredCommentary = React.useMemo(() => {
    if (!commentary) return []
    if (!activeCommentaryFilter || activeCommentaryFilter === 'all') return commentary

    return commentary.filter(item => {
      const text = (item.text || '').toLowerCase()
      const isWicket = text.includes('out') || text.includes('wicket') || item.milestone === 'wicket' || item.isWicket
      const isSix = text.includes('six') || item.runs === 6 || item.milestone === '6'
      const isFour = text.includes('four') || item.runs === 4 || item.milestone === '4'

      switch (activeCommentaryFilter) {
        case 'wickets': return isWicket
        case 'sixes': return isSix
        case 'fours': return isFour
        case 'highlights': return item.isHighlight || item.runs >= 4 || isWicket
        case 'milestone': return !!item.milestone
        default: return true
      }
    })
  }, [commentary, activeCommentaryFilter])

  // Over Ball Dot Helper
  const OverBallDot = ({ val, type }) => {
    const v = String(val || '').toUpperCase()
    const t = String(type || '').toLowerCase()

    let display = v
    let bgColor = 'bg-gray-100 text-gray-700'

    if (v === '6') bgColor = 'bg-[#367c2b] text-white'
    else if (v === '4') bgColor = 'bg-[#009bd6] text-white'
    else if (t === 'wicket' || v === 'W' || v === 'OUT') {
      bgColor = 'bg-[#d32f2f] text-white'
      display = 'W'
    } else if (t === 'wide' || v.includes('WD') || v.includes('WIDE')) {
      bgColor = 'bg-[#f59e0b] text-white'
      display = 'wd'
    } else if (t === 'noball' || v.includes('NB') || v.includes('NO BALL')) {
      bgColor = 'bg-[#f59e0b] text-white'
      display = 'nb'
    }

    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${bgColor}`}>
        {display}
      </div>
    )
  }

  const isFinishedMatch = matchStatus === 'Finished' || matchStatus === 'Completed';

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-0 sm:px-4 py-2">

        {/* Main Scorecard Card */}
        {!isFinishedMatch && (
          <div className="bg-white sm:rounded-xl shadow-sm border-b sm:border border-slate-200 overflow-hidden mb-4">
            {/* Batting Header */}
            <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Batter</span>
              <div className="flex gap-4 text-xs font-semibold text-slate-500 text-right">
                <span className="w-12">R (B)</span>
                <span className="w-6 text-center">4s</span>
                <span className="w-6 text-center">6s</span>
                <span className="w-10 text-right">SR</span>
              </div>
            </div>

            {/* Batting Body */}
            <div className="px-4 py-2 space-y-3">
              {[striker, nonStriker].map((player, idx) => {
                if (!player) return null
                const isStriker = idx === 0
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold text-slate-900`}>{player.name}</span>
                      {isStriker && <img src={cricketBatIcon} alt="Striker" className="w-3 h-3 object-contain opacity-80" />}
                    </div>
                    <div className="flex gap-4 text-sm text-slate-700 text-right">
                      <span className="w-12 font-bold text-slate-900">{player.runs || 0} <span className="text-xs font-normal text-slate-500">({player.balls || 0})</span></span>
                      <span className="w-6 text-center text-slate-500 text-xs">{player.fours || 0}</span>
                      <span className="w-6 text-center text-slate-500 text-xs">{player.sixes || 0}</span>
                      <span className="w-10 text-right text-slate-500 text-xs">{player.strikeRate ? Number(player.strikeRate).toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-4 py-2 text-xs flex items-center justify-between text-slate-500 border-t border-slate-50 mt-1">
              <div>P'ship: <span className="text-slate-700 font-medium">{formatPartnership()}</span></div>
              {lastWicket && <div>Last wkt: <span className="text-slate-700 font-medium">{formatLastWicket()}</span></div>}
            </div>

            <div className="bg-slate-50/50 px-4 py-2 border-t border-b border-slate-100 flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-slate-500">Bowler</span>
              <div className="flex gap-6 text-xs font-semibold text-slate-500 text-right">
                <span className="w-10 text-center">W-R</span>
                <span className="w-10 text-center">Overs</span>
                <span className="w-10 text-right">Econ</span>
              </div>
            </div>

            <div className="px-4 py-3">
              {currentBowler ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{currentBowler.name}</span>
                  <div className="flex gap-6 text-sm text-slate-700 text-right">
                    <span className="w-10 text-center font-bold text-slate-900">{currentBowler.wickets || 0}-{currentBowler.runsConceded || 0}</span>
                    <span className="w-10 text-center text-slate-500">{currentBowler.overs || '0.0'}</span>
                    <span className="w-10 text-right text-slate-500">{currentBowler.economy ? Number(currentBowler.economy).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              ) : <div className="text-xs text-slate-400 italic">No Active Bowler</div>}
            </div>
          </div>
        )}

        {/* Projected Score */}
        {!isFinishedMatch && (
          <div className="mt-4 bg-white sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-white px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Projected Score</h3>
            </div>
            <ProjectedScoreTable currentRuns={currentRuns || 0} currentOvers={currentOvers || '0.0'} currentRunRate={currentRunRate || 0} oversLimit={oversLimit || 20} />
          </div>
        )}

        {/* Commentary Section */}
        <div className="mt-4 bg-white sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
          <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3 overflow-x-auto scrollbar-hide no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => onCommentaryFilterChange && onCommentaryFilterChange(f.id)}
                className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border ${activeCommentaryFilter === f.id
                    ? 'bg-[#002f6c] text-white border-[#002f6c] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto">
            {activeCommentaryFilter === 'overs' ? (
              <div className="divide-y divide-gray-100">
                {oversGroups.map((over, idx) => (
                  <div key={idx} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50/50">
                    <span className="text-xs font-bold text-gray-500 w-12 shrink-0">Ov {over.overNumber}</span>
                    <div className="flex gap-2 flex-1 overflow-x-auto no-scrollbar">
                      {(over.balls || over.deliveries || []).map((b, bIdx) => (
                        <OverBallDot key={bIdx} val={b.value || b.label} type={b.type} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                      <span className="text-xs font-bold text-gray-900 font-mono tracking-tighter">= {over.totalRuns || 0}</span>
                    </div>
                  </div>
                ))}
                {oversGroups.length === 0 && <div className="p-8 text-center text-gray-400 text-xs">No over data available.</div>}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredCommentary.length > 0 ? (
                  [...filteredCommentary].reverse().map((item, idx) => {
                    const isWicket = String(item.text || '').toLowerCase().includes('out') || item.isWicket
                    const isFour = item.runs === 4
                    const isSix = item.runs === 6
                    const ballLabel = item.over || (item.ball !== undefined ? `${Math.floor(idx / 6)}.${item.ball}` : '·')

                    // Determine normalized display and color
                    let displayVal = item.runs
                    let ballType = isWicket ? 'wicket' : 'run'
                    const upperText = String(item.text || '').toUpperCase()
                    if (upperText.includes('WIDE') || upperText.includes('WD')) {
                      displayVal = 'wd'
                      ballType = 'wide'
                    } else if (upperText.includes('NB') || upperText.includes('NO BALL')) {
                      displayVal = 'nb'
                      ballType = 'noball'
                    }

                    // Show over separator
                    const isNewOver = ballLabel.endsWith('.1')

                    return (
                      <React.Fragment key={idx}>
                        <div className={`px-4 py-4 flex gap-4 transition-colors ${isWicket ? 'bg-red-50/40' : 'hover:bg-slate-50/30'}`}>
                          <div className="flex flex-col items-center gap-2 min-w-[36px]">
                            <span className="text-[11px] font-bold text-gray-400 font-mono tracking-tighter">{ballLabel}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${isWicket ? 'bg-[#d32f2f] text-white' :
                                isSix ? 'bg-[#367c2b] text-white' :
                                  isFour ? 'bg-[#009bd6] text-white' :
                                    (ballType === 'wide' || ballType === 'noball') ? 'bg-[#f59e0b] text-white' :
                                      'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                              {isWicket ? 'W' : displayVal}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1 pr-2">
                            <div className="text-sm text-gray-800 leading-relaxed font-normal">
                              {item.text}
                            </div>
                            {isWicket && (
                              <div className="mt-2 text-[10px] font-bold text-red-700 uppercase tracking-widest bg-red-100/50 py-1 px-3 rounded-md inline-block w-max">
                                Wicket Confirmed
                              </div>
                            )}
                          </div>
                        </div>
                        {isNewOver && <div className="h-px bg-gray-100 mx-4"></div>}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <div className="p-12 text-center text-slate-400 text-sm italic">No commentary entries found for this filter.</div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CrexLiveSection
