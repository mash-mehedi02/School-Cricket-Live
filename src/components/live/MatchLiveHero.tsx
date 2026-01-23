
import React, { useEffect, useRef } from 'react'
import { Match, InningsStats } from '@/types'
import fourIcon from '../../assets/four.png'
import sixIcon from '../../assets/six.png'

interface MatchLiveHeroProps {
    match: Match
    teamAName: string
    teamBName: string
    teamASquad?: any
    teamBSquad?: any
    currentInnings: InningsStats | null
    teamAInnings: InningsStats | null
    teamBInnings: InningsStats | null
    isFinishedMatch: boolean
    resultSummary?: string
    centerEventText: string
    ballAnimating: boolean
    ballEventType: '4' | '6' | 'wicket' | 'normal'
    lastBall: any
    recentOvers: any[]
    showBoundaryAnim?: boolean
    setBallAnimating: (v: boolean) => void
    setBallEventType: (v: '4' | '6' | 'wicket' | 'normal') => void
}

const MatchLiveHero: React.FC<MatchLiveHeroProps> = ({
    match,
    teamAName,
    teamBName,
    teamASquad,
    teamBSquad,
    currentInnings,
    isFinishedMatch,
    resultSummary,
    centerEventText,
    recentOvers,
    showBoundaryAnim,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll timeline
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [recentOvers])

    // --- Helpers ---
    const inn = currentInnings as any
    const runs = Number(inn?.totalRuns || 0)
    const wkts = Number(inn?.totalWickets || 0)
    const overs = String(inn?.overs || '0.0')
    const crr = typeof inn?.currentRunRate === 'number' ? inn.currentRunRate : Number(inn?.currentRunRate || 0)
    const rrr = typeof inn?.requiredRunRate === 'number' ? inn.requiredRunRate : Number(inn?.requiredRunRate || 0)
    const target = inn?.target
    const runsNeeded = target ? Math.max(0, Number(target) - runs) : 0
    const ballsRemaining = inn?.remainingBalls ?? ((match.oversLimit || 20) * 6 - Number(inn?.legalBalls || 0))

    const currentTeamName = match.currentBatting === 'teamB' ? teamBName : teamAName
    const currentSquad = match.currentBatting === 'teamB' ? teamBSquad : teamASquad
    const logoUrl = currentSquad?.logoUrl || (match as any)[match.currentBatting === 'teamB' ? 'teamBLogoUrl' : 'teamALogoUrl']

    // --- Format Team Name Logic ---
    const formatTeamName = (name: string) => {
        const parts = name.split('-')
        const mainName = parts[0].trim()
        const shortMain = mainName.substring(0, 3).toUpperCase()
        if (parts.length > 1) {
            const suffix = parts.slice(1).join('-').trim()
            return `${shortMain} - ${suffix}`
        }
        return shortMain
    }

    const currentTeamDisplay = formatTeamName(currentTeamName)
    const teamAShort = formatTeamName(teamAName)
    const teamBShort = formatTeamName(teamBName)

    // --- Toss Text ---
    const tossWinner = String((match as any)?.tossWinner || '').trim()
    const tossDecision = String((match as any)?.tossDecision || (match as any)?.electedTo || '').trim().toLowerCase()
    const getWinnerShort = (winnerName: string) => {
        const parts = winnerName.split(' ')
        return parts.map(p => p[0]).join('').toUpperCase().slice(0, 3)
    }
    // Logic to try and match toss winner to teamA/B for short code
    let tossWinnerShort = ''
    if (tossWinner === 'teamA' || tossWinner === (match as any).teamAId) tossWinnerShort = teamAShort.split(' -')[0]
    else if (tossWinner === 'teamB' || tossWinner === (match as any).teamBId) tossWinnerShort = teamBShort.split(' -')[0]
    else tossWinnerShort = getWinnerShort(tossWinner)

    const tossText = tossWinner ? `Toss: ${tossWinnerShort}` : ''

    // --- Event Label Logic ---
    const displayEvent = centerEventText || '—'
    const isWicket = displayEvent.toLowerCase().includes('out') || displayEvent.toLowerCase().includes('wick') || displayEvent === 'W'
    const isFour = displayEvent === '4'
    const isSix = displayEvent === '6'

    // --- Timeline Helpers ---
    const getBallClass = (val: string, type: string) => {
        const v = String(val || '').trim().toUpperCase()
        const t = String(type || '').toLowerCase()
        const base = "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110"

        // Exact styles from screenshot:
        // 6: Deep Green filled, White text
        if (v === '6') return `${base} bg-[#367c2b] text-white`
        // 4: Blue filled, White text
        if (v === '4') return `${base} bg-[#009bd6] text-white`
        // Wicket: Red filled
        if (t === 'wicket' || v === 'W' || v === 'OUT') return `${base} bg-[#d32f2f] text-white`
        // Wide: Orange/Yellow filled (WD, WIDE, WIDE+1, etc)
        if (t === 'wide' || v.startsWith('WD') || v.startsWith('WIDE')) return `${base} bg-[#f59e0b] text-white`

        // Normal (0, 1, 2...): White background, Gray border, Black text
        return `${base} bg-white text-slate-800 border border-slate-200`
    }

    return (
        <div className="font-sans antialiased text-white overflow-hidden shadow-2xl bg-[#0f172a]">

            {/* 1. Main Score Header (Dark) - 60-40 Split */}
            <div className="px-4 sm:px-6 py-6 flex items-center relative bg-[#0f172a] border-b border-white/5">

                {/* Left Side: Team & Score - ~60% */}
                <div className="flex-[3] flex items-center gap-3 sm:gap-5 relative z-10 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800/30 border-2 border-white/10 p-1 shadow-lg relative">
                            {logoUrl ?
                                <img src={logoUrl} className="w-full h-full object-contain relative z-10 drop-shadow-lg rounded-full" alt={currentTeamName} /> :
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-full text-xs font-bold">{currentTeamDisplay[0]}</div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-base sm:text-xl font-bold text-white uppercase tracking-wider leading-none font-['Inter'] truncate">
                                {currentTeamDisplay}
                            </h1>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-[#38bdf8] text-4xl sm:text-[3.5rem] font-bold leading-none tracking-tight drop-shadow-lg font-['Inter']">
                                {runs}-{wkts}
                            </div>
                            <div className="text-gray-400 text-lg sm:text-2xl font-normal leading-none pl-1 opacity-80 font-['Inter']">
                                {overs}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-12 sm:h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mx-2 sm:mx-6 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>

                {/* Right Side: Event / Status - ~40% CENTERED */}
                <div className="flex-[2] flex items-center justify-center relative z-10 h-16 sm:h-20">
                    <div className="flex flex-col items-center justify-center w-full">
                        {showBoundaryAnim && isFour ? (
                            <img src={fourIcon} alt="4 Runs" className="w-12 h-12 sm:w-16 sm:h-16 object-contain animate-bounce-short drop-shadow-xl" />
                        ) : showBoundaryAnim && isSix ? (
                            <img src={sixIcon} alt="6 Runs" className="w-12 h-12 sm:w-16 sm:h-16 object-contain animate-bounce-short drop-shadow-xl" />
                        ) : isWicket ? (
                            <div className="text-[#fbbf24] text-2xl sm:text-4xl font-black uppercase tracking-tight shadow-yellow-900/20 drop-shadow-md text-center">
                                {displayEvent}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                                {displayEvent.split('\\n').map((line, i) => {
                                    const isNumericRun = /^[1-6]$/.test(line.trim())
                                    const fontSize = isNumericRun
                                        ? 'text-5xl sm:text-7xl'
                                        : (line.length > 8 ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-5xl')

                                    return (
                                        <div
                                            key={i}
                                            className={`${fontSize} ${i > 0 ? 'text-lg sm:text-xl opacity-90' : ''} text-[#FFD700] font-black font-mono leading-none tracking-tighter drop-shadow-2xl text-center px-2`}
                                        >
                                            {line === '—' ? '' : line}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Stats Row (CRR, RRR, Toss) - Dark BG */}
            <div className="px-5 py-3 flex items-center justify-between text-sm text-slate-400 font-medium bg-[#0f172a]">
                <div className="flex items-center gap-6">
                    <div>
                        CRR: <span className="text-white font-bold ml-1">{crr.toFixed(2)}</span>
                    </div>
                    {target && (
                        <div>
                            RRR: <span className="text-white font-bold ml-1">{rrr.toFixed(2)}</span>
                        </div>
                    )}
                </div>
                <div>
                    {target ? (
                        <>Target: <span className="text-white font-bold ml-1">{target}</span></>
                    ) : (
                        <span className="opacity-80">{tossText}</span>
                    )}
                </div>
            </div>

            {/* WHITE BACKGROUND AREA STARTS HERE */}
            <div className="bg-white text-slate-900">

                {/* 3. Timeline Strip - White BG, Always Over Label */}
                <div className="px-4 py-5 overflow-hidden relative border-b border-slate-100">
                    <div className="flex items-center justify-start overflow-x-auto scrollbar-hide gap-8" ref={scrollRef}>
                        {recentOvers.map((over, idx) => {
                            const balls = (over.balls || []).map((b: any) => {
                                let val = String(b?.value || b?.label || b?.runsOffBat || b?.runs || '').trim()
                                // Convert · to 0 for dot balls
                                if (val === '·' || val === '') val = '0'

                                // Detect type more comprehensively
                                let type = String(b?.type || '').toLowerCase()
                                if (!type) {
                                    if (b?.isWicket) type = 'wicket'
                                    else if (b?.extras?.wides > 0 || val.toUpperCase().includes('WD') || val.toUpperCase().includes('WIDE')) type = 'wide'
                                    else if (b?.extras?.noBalls > 0 || val.toUpperCase().includes('NB')) type = 'noball'
                                    else type = 'run'
                                }

                                return { val, type }
                            })
                            const total = over.totalRuns ?? over.total ?? 0
                            const isCurrent = idx === recentOvers.length - 1

                            return (
                                <div key={idx} className="flex items-center gap-5 shrink-0">
                                    {/* Separator Line */}
                                    {idx > 0 && <div className="h-10 w-px bg-slate-200 mx-2"></div>}

                                    {/* Over Label - ALWAYS VISIBLE for all overs */}
                                    <div className="text-base font-bold text-slate-800 whitespace-nowrap">
                                        Over {over.overNumber}
                                    </div>

                                    {/* Balls */}
                                    <div className="flex items-center gap-2">
                                        {balls.map((b: any, bIdx: number) => {
                                            let displayVal = b.val
                                            const v = String(b.val).toUpperCase()
                                            const t = String(b.type).toLowerCase()

                                            // Normalize for circle display
                                            if (t === 'wide' || v.includes('WIDE') || v.includes('WD')) {
                                                displayVal = 'wd'
                                            } else if (t === 'noball' || v.includes('NB') || v.includes('NO BALL')) {
                                                displayVal = 'nb'
                                            }

                                            return (
                                                <div key={bIdx} className={getBallClass(displayVal, b.type)}>
                                                    {displayVal}
                                                </div>
                                            )
                                        })}
                                        {/* Empty Consisent Placeholders */}
                                        {isCurrent && balls.length < 6 && Array.from({ length: 6 - balls.length }).map((_, i) => (
                                            <div key={`p-${i}`} className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50"></div>
                                        ))}
                                    </div>

                                    {/* Total Label */}
                                    <div className="text-slate-800 text-sm font-bold pl-1 whitespace-nowrap flex items-center gap-1">
                                        <span className="text-slate-400 font-normal">=</span>{total}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 4. Win Probability - Compact Size */}
                <div className="px-4 py-3 border-b border-slate-100 relative bg-slate-50/30">
                    <div className="flex items-end justify-between">

                        {/* Left Team Stack */}
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{teamAShort.split(' -')[0]}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">77%</span>
                        </div>

                        {/* Center Stack - Bar connecting */}
                        <div className="flex flex-col items-center flex-1 px-4 pb-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-1 opacity-80">
                                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 flex items-center justify-center text-[6px] font-serif italic text-slate-400">i</div>
                                Win %
                            </div>
                            {/* Thinner Bar */}
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner relative">
                                <div className="h-full bg-[#881e4b] w-[77%] relative"></div>
                                <div className="h-full bg-[#002f6c] w-[23%] relative"></div>
                            </div>
                        </div>

                        {/* Right Team Stack */}
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{teamBShort.split(' -')[0]}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">23%</span>
                        </div>
                    </div>
                </div>

                {/* Need Text - Bottom of card if exists */}
                {isFinishedMatch ? (
                    <div className="bg-blue-50/50 py-3 px-5 flex justify-center text-sm border-t border-blue-100">
                        <span className="text-blue-700 font-bold tracking-wide uppercase italic">
                            {resultSummary || 'Match Completed'}
                        </span>
                    </div>
                ) : target && (
                    <div className="bg-orange-50/50 py-3 px-5 flex justify-center text-sm border-t border-orange-100">
                        <span className="text-orange-600 font-semibold tracking-wide">
                            {currentTeamDisplay} need <span className="font-bold">{runsNeeded}</span> runs in <span className="font-bold">{ballsRemaining}</span> balls
                        </span>
                    </div>
                )}
            </div>

        </div >
    )
}

export default MatchLiveHero
