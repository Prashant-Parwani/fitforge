import { useState, useEffect, useRef } from 'react'

export default function RestTimer({ seconds = 60, onDone, onSkip }) {
  const [remaining, setRemaining] = useState(seconds)
  const [active, setActive]       = useState(true)
  const intervalRef               = useRef(null)

  useEffect(() => {
    if (!active) return
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          // Beep using Web Audio API
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = 880
            gain.gain.setValueAtTime(0.4, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.5)
          } catch {}
          onDone?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [active])

  const pct = ((seconds - remaining) / seconds) * 100
  const circ = 2 * Math.PI * 28

  return (
    <div className="flex flex-col items-center gap-3 py-3">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#f5ebe0" strokeWidth="5"/>
          <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5e3c" strokeWidth="5"
            strokeDasharray={`${((100 - pct) / 100) * circ} ${circ}`}
            strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.9s linear' }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-xl font-bold text-brown-800">{remaining}</div>
          <div className="text-xs text-brown-400">sec</div>
        </div>
      </div>
      <p className="text-xs text-brown-500">Rest timer — breathe and recover</p>
      <div className="flex gap-2">
        <button onClick={() => { setActive(false); onSkip?.() }}
          className="text-xs px-4 py-1.5 rounded-full border border-brown-300 text-brown-600 hover:bg-brown-100 transition-colors">
          Skip Rest
        </button>
        <button onClick={() => { setRemaining(seconds); setActive(true) }}
          className="text-xs px-4 py-1.5 rounded-full bg-brown-500 text-cream hover:bg-brown-600 transition-colors">
          Reset
        </button>
      </div>
    </div>
  )
}
