import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function SleepBar({ data }) {
  if (!data || data.length === 0) return (
    <div className="h-20 flex items-center justify-center text-brown-300 text-sm italic">No sleep logged yet</div>
  )
  const max = 10
  const W = 400, H = 80
  const barW = Math.min(40, (W - 20) / data.length - 4)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      {data.map((d, i) => {
        const x   = 10 + i * ((W - 20) / data.length) + ((W - 20) / data.length - barW) / 2
        const pct = Math.min(1, d.hours / max)
        const bh  = pct * (H - 20)
        const col = d.hours >= 7 ? '#639922' : d.hours >= 6 ? '#EF9F27' : '#E24B4A'
        return (
          <g key={i}>
            <rect x={x} y={H - 10 - bh} width={barW} height={bh} rx="3" fill={col} opacity="0.85"/>
            <text x={x + barW / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#888780">{d.label}</text>
          </g>
        )
      })}
      <line x1="10" y1={H - 10 - (7 / max) * (H - 20)} x2={W - 10} y2={H - 10 - (7 / max) * (H - 20)}
        stroke="#639922" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.6"/>
    </svg>
  )
}

export default function SleepTracker() {
  const { user, updateUser } = useAuth()
  const [hours, setHours]   = useState(7)
  const [quality, setQuality] = useState(3)
  const [saved, setSaved]   = useState(false)

  const sleepLog = user?.sleepLog || []
  const todayStr = new Date().toISOString().split('T')[0]
  const todayEntry = sleepLog.find(s => s.date === todayStr)

  const last7 = sleepLog.slice(-7).map(s => ({
    label: new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0,2),
    hours: s.hours,
    quality: s.quality,
  }))

  const avgHours  = sleepLog.length ? (sleepLog.reduce((a, s) => a + s.hours, 0) / sleepLog.length).toFixed(1) : 0
  const avgQuality = sleepLog.length ? (sleepLog.reduce((a, s) => a + s.quality, 0) / sleepLog.length).toFixed(1) : 0

  // Recovery score: 0-100
  const todaySleep = todayEntry || { hours: 0, quality: 0 }
  const recoveryScore = todayEntry
    ? Math.round((todaySleep.hours / 8) * 50 + (todaySleep.quality / 5) * 50)
    : null

  const recoveryTip = () => {
    if (!todayEntry) return null
    if (todaySleep.hours < 5)  return { msg: 'Less than 5hrs — skip heavy lifting today. Active recovery only.', col: 'text-red-600 bg-red-50 border-red-100' }
    if (todaySleep.hours < 6.5) return { msg: 'Sleep was short. Lower your weights by 10% today.', col: 'text-amber-700 bg-amber-50 border-amber-100' }
    if (todaySleep.hours >= 7 && todaySleep.quality >= 4) return { msg: 'Excellent sleep! Push hard today — your body is recovered and ready.', col: 'text-green-700 bg-green-50 border-green-100' }
    return { msg: 'Decent sleep. Train normally but listen to your body.', col: 'text-brown-700 bg-brown-50 border-brown-200' }
  }

  const logSleep = () => {
    const entry = { date: todayStr, hours, quality, label: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }
    const existing = sleepLog.filter(s => s.date !== todayStr)
    updateUser({ sleepLog: [...existing, entry] })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tip = recoveryTip()

  return (
    <div className="space-y-4">
      {/* Log today's sleep */}
      <div className="bg-cream rounded-2xl border border-brown-200 p-5">
        <h3 className="font-display text-lg font-semibold text-brown-900 mb-4">
          {todayEntry ? "Today's Sleep Logged ✓" : "Log Last Night's Sleep"}
        </h3>

        <div className="space-y-4">
          {/* Hours slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-brown-700">Hours slept</span>
              <span className={`font-bold ${hours >= 7 ? 'text-green-600' : hours >= 6 ? 'text-amber-600' : 'text-red-600'}`}>
                {hours}h
              </span>
            </div>
            <input type="range" min={2} max={12} step={0.5} value={hours}
              onChange={e => setHours(parseFloat(e.target.value))} className="w-full"/>
            <div className="flex justify-between text-xs text-brown-400 mt-1">
              <span>2h</span><span className="text-green-600">7h goal</span><span>12h</span>
            </div>
          </div>

          {/* Quality */}
          <div>
            <div className="text-sm font-medium text-brown-700 mb-2">Sleep quality</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(q => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                    quality === q ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-500 hover:border-brown-400'
                  }`}>
                  {['😴','😐','🙂','😊','🤩'][q-1]}
                </button>
              ))}
            </div>
            <div className="text-xs text-brown-400 text-center mt-1">
              {['Very poor','Poor','Average','Good','Excellent'][quality-1]}
            </div>
          </div>

          <button onClick={logSleep}
            className="btn-primary w-full py-3">
            {saved ? '✓ Saved!' : todayEntry ? 'Update Sleep Log' : 'Log Sleep'}
          </button>
        </div>
      </div>

      {/* Recovery score */}
      {todayEntry && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Recovery Score', value: recoveryScore, unit: '/ 100', col: recoveryScore >= 70 ? 'text-green-600' : recoveryScore >= 45 ? 'text-amber-600' : 'text-red-600' },
            { label: 'Hours Slept',    value: todaySleep.hours + 'h', unit: '', col: 'text-brown-800' },
            { label: 'Sleep Quality',  value: ['','Poor','Average','Good','Great','Excellent'][todaySleep.quality], unit: '', col: 'text-brown-800' },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl border border-brown-200 p-3 text-center">
              <div className={`font-display text-xl font-bold ${s.col}`}>{s.value}</div>
              {s.unit && <div className="text-xs text-brown-400">{s.unit}</div>}
              <div className="text-xs text-brown-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recovery tip */}
      {tip && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${tip.col}`}>
          <span className="font-semibold">Today's training tip: </span>{tip.msg}
        </div>
      )}

      {/* Weekly chart */}
      {sleepLog.length > 0 && (
        <div className="bg-cream rounded-2xl border border-brown-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-brown-900">Last 7 Nights</h3>
            <div className="flex gap-3 text-xs text-brown-500">
              <span>Avg <strong className="text-brown-800">{avgHours}h</strong></span>
              <span>Quality <strong className="text-brown-800">{avgQuality}/5</strong></span>
            </div>
          </div>
          <SleepBar data={last7} />
          <div className="flex items-center gap-3 mt-2 text-xs text-brown-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-600 inline-block"></span>7h+ (good)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block"></span>6-7h (ok)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block"></span>&lt;6h (poor)</span>
          </div>
        </div>
      )}

      {/* Sleep tips */}
      <div className="bg-brown-800 rounded-2xl p-5 text-cream">
        <h4 className="font-display text-base font-semibold mb-2">Sleep & Recovery Rules</h4>
        <ul className="text-brown-300 text-xs space-y-1.5 font-body">
          <li>• 7-9 hours is optimal for muscle growth and fat loss</li>
          <li>• Most muscle repair happens in deep sleep (3-4am)</li>
          <li>• Poor sleep = higher cortisol = more fat storage</li>
          <li>• Eat cottage cheese before bed — slow casein protein overnight</li>
          <li>• Avoid screens 1hr before bed — blue light disrupts melatonin</li>
        </ul>
      </div>
    </div>
  )
}
