import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const FIELDS = [
  { key: 'chest',     label: 'Chest',       emoji: '💪' },
  { key: 'waist',     label: 'Waist',       emoji: '📏' },
  { key: 'hips',      label: 'Hips',        emoji: '🍑' },
  { key: 'leftArm',   label: 'Left Arm',    emoji: '💪' },
  { key: 'rightArm',  label: 'Right Arm',   emoji: '💪' },
  { key: 'leftThigh', label: 'Left Thigh',  emoji: '🦵' },
  { key: 'rightThigh',label: 'Right Thigh', emoji: '🦵' },
]

function MiniLine({ data, color = '#8b5e3c' }) {
  if (!data || data.length < 2) return <div className="h-8 flex items-center"><span className="text-xs text-brown-300 italic">Need 2+ entries</span></div>
  const vals = data.map(d => d.v)
  const min  = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const W = 120, H = 32, p = 4
  const pts = data.map((d, i) => {
    const x = p + (i / (data.length - 1)) * (W - p * 2)
    const y = H - p - ((d.v - min) / range) * (H - p * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 120, height: 32 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d, i) => {
        const x = p + (i / (data.length - 1)) * (W - p * 2)
        const y = H - p - ((d.v - min) / range) * (H - p * 2)
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color}/>
      })}
    </svg>
  )
}

export default function MeasurementTracker() {
  const { user, updateUser } = useAuth()
  const [form, setForm]      = useState({})
  const [saved, setSaved]    = useState(false)

  const measurementLog = user?.measurementLog || []
  const todayStr       = new Date().toISOString().split('T')[0]
  const latest         = measurementLog[measurementLog.length - 1]
  const first          = measurementLog[0]

  const logMeasurements = () => {
    const hasValues = Object.values(form).some(v => v && parseFloat(v) > 0)
    if (!hasValues) return
    const entry = { date: todayStr, label: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' }), ...Object.fromEntries(Object.entries(form).map(([k,v]) => [k, parseFloat(v) || null])) }
    const filtered = measurementLog.filter(m => m.date !== todayStr)
    updateUser({ measurementLog: [...filtered, entry] })
    setForm({})
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const getChange = (key) => {
    if (!latest?.[key] || !first?.[key] || latest === first) return null
    return (latest[key] - first[key]).toFixed(1)
  }

  const getHistory = (key) => measurementLog.filter(m => m[key]).map(m => ({ v: m[key], label: m.label }))

  return (
    <div className="space-y-5">
      {/* Log form */}
      <div className="bg-cream rounded-2xl border border-brown-200 p-5">
        <h3 className="font-display text-lg font-semibold text-brown-900 mb-1">Log Measurements</h3>
        <p className="text-xs text-brown-400 mb-4">All in centimetres (cm). Fill only what you want to track.</p>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-brown-600 mb-1">{f.emoji} {f.label} (cm)</label>
              <input type="number" step="0.1" value={form[f.key] || ''}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={latest?.[f.key] ? String(latest[f.key]) : '—'}
                className="w-full px-3 py-2 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400"/>
            </div>
          ))}
        </div>
        <button onClick={logMeasurements} className="btn-primary w-full py-3 mt-4">
          {saved ? '✓ Measurements Saved!' : 'Save Measurements'}
        </button>
      </div>

      {/* Current measurements with change badges + mini charts */}
      {measurementLog.length > 0 && (
        <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-brown-100">
            <h3 className="font-display text-lg font-semibold text-brown-900">Progress</h3>
            <p className="text-xs text-brown-400 mt-0.5">{measurementLog.length} entries · comparing latest vs first</p>
          </div>
          <div className="divide-y divide-brown-50">
            {FIELDS.map(f => {
              const val    = latest?.[f.key]
              const change = getChange(f.key)
              const history = getHistory(f.key)
              if (!val) return null
              const isGood = f.key === 'waist' || f.key === 'hips'
                ? parseFloat(change) < 0   // smaller waist/hips is good
                : parseFloat(change) > 0   // bigger chest/arms is good
              return (
                <div key={f.key} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 text-base">{f.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brown-800">{f.label}</div>
                    <div className="text-xs text-brown-400">{val} cm</div>
                  </div>
                  {change !== null && (
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {parseFloat(change) > 0 ? '+' : ''}{change} cm
                    </div>
                  )}
                  <MiniLine data={history} color={change !== null && isGood ? '#639922' : '#8b5e3c'}/>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* History table */}
      {measurementLog.length > 1 && (
        <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-brown-100">
            <h3 className="font-body font-semibold text-brown-800">History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-brown-50">
                  <th className="text-left px-4 py-2 text-brown-500 font-medium">Date</th>
                  {FIELDS.map(f => <th key={f.key} className="text-center px-2 py-2 text-brown-500 font-medium">{f.label.split(' ')[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...measurementLog].reverse().slice(0, 8).map((entry, i) => (
                  <tr key={i} className="border-t border-brown-50 hover:bg-brown-50">
                    <td className="px-4 py-2 text-brown-600">{entry.label}</td>
                    {FIELDS.map(f => <td key={f.key} className="text-center px-2 py-2 text-brown-700">{entry[f.key] || '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {measurementLog.length === 0 && (
        <div className="text-center py-10 text-brown-400">
          <div className="text-4xl mb-3">📏</div>
          <p className="text-sm">Log your first measurements above to start tracking.</p>
          <p className="text-xs mt-1">Measure in the morning, on an empty stomach, for consistency.</p>
        </div>
      )}
    </div>
  )
}
