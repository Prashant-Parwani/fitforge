import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import SleepTracker from '../components/SleepTracker'
import MeasurementTracker from '../components/MeasurementTracker'
import WeeklyReport from '../components/WeeklyReport'
import SupplementTracker from '../components/SupplementTracker'

const MUSCLES = ['Chest','Back','Legs','Shoulders','Arms','Core','Cardio','Full Body']

function LineChart({ data, color = '#8b5e3c' }) {
  if (!data || data.length < 2) return (
    <div className="h-24 flex items-center justify-center text-brown-300 text-sm italic">
      Log at least 2 entries to see your chart
    </div>
  )
  const vals = data.map(d => d.value)
  const min = Math.min(...vals), max = Math.max(...vals)
  const range = max - min || 1
  const W = 400, H = 80, pad = 10
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((d.value - min) / range) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = pad + (i / (data.length - 1)) * (W - pad * 2)
          const y = H - pad - ((d.value - min) / range) * (H - pad * 2)
          return <circle key={i} cx={x} cy={y} r="4" fill={color} />
        })}
      </svg>
      <div className="flex justify-between text-xs text-brown-400 mt-1 overflow-hidden">
        {data.map((d, i) => <span key={i} className="truncate">{d.label}</span>)}
      </div>
    </div>
  )
}

function MiniBar({ label, value, max }) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-brown-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-brown-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${value === 0 ? 'bg-brown-200' : 'bg-brown-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-brown-700 w-5 text-right">{value}</span>
    </div>
  )
}

export default function Progress() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('overview')

  const workoutLog = user?.workoutLog || []
  const weightLog  = user?.weightLog  || []

  const [logForm, setLogForm] = useState({
    focus:    user?.customSplit?.[0]?.focus || 'Chest',
    sets:     '', duration: '', notes: '',
    date:     new Date().toISOString().split('T')[0]
  })
  const [newWeight, setNewWeight] = useState('')

  const saveWorkout = () => {
    if (!logForm.sets || !logForm.duration) return
    const entry = {
      id: Date.now(), focus: logForm.focus,
      sets: Number(logForm.sets), duration: Number(logForm.duration),
      notes: logForm.notes, date: logForm.date,
    }
    updateUser({ workoutLog: [entry, ...workoutLog] })
    setLogForm({ focus: logForm.focus, sets: '', duration: '', notes: '', date: new Date().toISOString().split('T')[0] })
  }

  const deleteWorkout = (id) => updateUser({ workoutLog: workoutLog.filter(w => w.id !== id) })

  const saveWeight = () => {
    const val = parseFloat(newWeight)
    if (!val || val < 20 || val > 300) return
    const label = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' })
    updateUser({ weightLog: [...weightLog, { label, value: val, date: new Date().toISOString().split('T')[0] }] })
    setNewWeight('')
  }

  const deleteWeight = (idx) => updateUser({ weightLog: weightLog.filter((_, i) => i !== idx) })

  const totalWorkouts = workoutLog.length
  const totalSets     = workoutLog.reduce((s, w) => s + (w.sets || 0), 0)
  const totalMinutes  = workoutLog.reduce((s, w) => s + (w.duration || 0), 0)
  const currentWeight = weightLog.length ? weightLog[weightLog.length - 1].value : null
  const startWeight   = weightLog.length ? weightLog[0].value : null
  const weightChange  = currentWeight && startWeight ? +(currentWeight - startWeight).toFixed(1) : null

  const muscleFreq = useMemo(() => {
    const freq = {}
    MUSCLES.forEach(m => { freq[m] = 0 })
    workoutLog.forEach(w => { if (w.focus && freq[w.focus] !== undefined) freq[w.focus]++ })
    return freq
  }, [workoutLog])
  const maxFreq = Math.max(...Object.values(muscleFreq), 1)

  const tabs = [
    { id:'overview',     label:'Overview',     emoji:'📊' },
    { id:'log',          label:'Log Workout',  emoji:'✏️' },
    { id:'weight',       label:'Weight',       emoji:'⚖️' },
    { id:'sleep',        label:'Sleep',        emoji:'😴' },
    { id:'measurements', label:'Measurements', emoji:'📏' },
    { id:'report',       label:'AI Report',    emoji:'📋' },
    { id:'supplements',  label:'Supplements',  emoji:'💊' },
  ]

  return (
    <main className="pt-20 pb-16 min-h-screen">

      <section className="bg-brown-800 text-cream py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Your Journey</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-2">Progress Dashboard</h1>
          <p className="text-brown-300 font-body max-w-2xl">
            Every rep, every kg — tracked from day one.
          </p>
          {user?.startDate && (
            <p className="text-brown-400 text-sm mt-2">
              🗓 Member since {new Date(user.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
              {user.goal && <> · {user.goal}</>}
            </p>
          )}
        </div>
      </section>

      {/* Tab bar */}
      <div className="bg-cream border-b border-brown-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-brown-500 text-cream' : 'text-brown-600 hover:bg-brown-100'
                }`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {totalWorkouts === 0 && weightLog.length === 0 ? (
              <div className="text-center py-20 bg-cream rounded-2xl border border-brown-200">
                <div className="text-5xl mb-4">🏁</div>
                <h2 className="font-display text-2xl font-bold text-brown-800 mb-2">Your journey starts here</h2>
                <p className="text-brown-500 mb-6 max-w-sm mx-auto">No workouts logged yet. Log your first session to start tracking.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setTab('log')} className="btn-primary">Log First Workout</button>
                  <button onClick={() => setTab('weight')} className="btn-outline">Add Starting Weight</button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label:'Workouts',     value: totalWorkouts, unit:'sessions',      color:'text-brown-700' },
                    { label:'Total Sets',   value: totalSets,     unit:'sets logged',   color:'text-orange-600' },
                    { label:'Time Trained', value: totalMinutes,  unit:'minutes total', color:'text-purple-600' },
                    { label:'Weight Change',
                      value: weightChange !== null ? (weightChange >= 0 ? '+'+weightChange : weightChange)+' kg' : '—',
                      unit: weightChange !== null ? (weightChange <= 0 ? 'kg lost' : 'kg gained') : 'no data',
                      color: weightChange !== null ? (weightChange <= 0 ? 'text-green-600' : 'text-blue-600') : 'text-brown-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-cream rounded-2xl border border-brown-200 p-4">
                      <div className="text-xs text-brown-400 uppercase tracking-wider mb-1">{s.label}</div>
                      <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-brown-400 mt-0.5">{s.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Target weight progress */}
                {user?.targetWeight && currentWeight && (
                  <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                    <h3 className="font-body font-semibold text-brown-800 mb-3">Target Weight Progress</h3>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-brown-500">Start: <strong className="text-brown-800">{startWeight} kg</strong></span>
                      <span className="text-brown-500">Now: <strong className="text-brown-800">{currentWeight} kg</strong></span>
                      <span className="text-brown-500">Target: <strong className="text-green-600">{user.targetWeight} kg</strong></span>
                    </div>
                    {(() => {
                      const target   = parseFloat(user.targetWeight)
                      const start    = startWeight || currentWeight
                      const achieved = Math.abs(currentWeight - start)
                      const total    = Math.abs(target - start) || 1
                      const pct      = Math.min(100, Math.round((achieved / total) * 100))
                      const losing   = target < start
                      return (
                        <div>
                          <div className="flex justify-between text-xs text-brown-500 mb-1">
                            <span>Progress to target</span>
                            <span className="font-semibold">{pct}%</span>
                          </div>
                          <div className="h-3 bg-brown-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${losing ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-brown-400 mt-2">
                            {pct >= 100 ? '🎉 Target reached! Set a new goal.'
                              : losing ? `${(currentWeight - target).toFixed(1)} kg to go`
                              : `${(target - currentWeight).toFixed(1)} kg to go`}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {weightLog.length > 0 && (
                  <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl font-semibold text-brown-900">Weight Over Time</h3>
                      <span className="text-sm text-brown-400">{weightLog.length} entries</span>
                    </div>
                    <LineChart data={weightLog} />
                    {weightLog.length >= 2 && (
                      <div className="flex justify-between text-xs text-brown-400 mt-3 pt-3 border-t border-brown-100">
                        <span>Start: <strong className="text-brown-700">{startWeight} kg</strong></span>
                        <span>Now: <strong className="text-brown-700">{currentWeight} kg</strong></span>
                        <span>Change: <strong className={weightChange <= 0 ? 'text-green-600' : 'text-blue-600'}>
                          {weightChange >= 0 ? '+' : ''}{weightChange} kg
                        </strong></span>
                      </div>
                    )}
                  </div>
                )}

                {totalWorkouts > 0 && (
                  <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                    <h3 className="font-display text-xl font-semibold text-brown-900 mb-4">Muscle Group Frequency</h3>
                    <div className="space-y-2.5">
                      {MUSCLES.map(m => <MiniBar key={m} label={m} value={muscleFreq[m]} max={maxFreq} />)}
                    </div>
                    {Object.values(muscleFreq).some(v => v === 0) && totalWorkouts >= 3 && (
                      <p className="text-xs text-amber-600 mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                        ⚠️ Some muscle groups haven't been trained yet. Aim for balance.
                      </p>
                    )}
                  </div>
                )}

                {totalWorkouts > 0 && (
                  <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-brown-100">
                      <h3 className="font-display text-xl font-semibold text-brown-900">Recent Workouts</h3>
                      <button onClick={() => setTab('log')} className="text-sm text-brown-500 hover:text-brown-700">+ Log New</button>
                    </div>
                    <div className="divide-y divide-brown-100">
                      {workoutLog.slice(0, 8).map(w => (
                        <div key={w.id} className="flex items-center gap-4 px-5 py-3 hover:bg-brown-50 group">
                          <div className="w-10 h-10 bg-brown-500 text-cream rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {(w.focus || '?')[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-body font-semibold text-brown-900 text-sm">{w.focus}</div>
                            <div className="text-xs text-brown-400">{w.date}{w.notes ? ' · ' + w.notes : ''}</div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-medium text-brown-700">{w.sets} sets</div>
                            <div className="text-brown-400">{w.duration} min</div>
                          </div>
                          <button onClick={() => deleteWorkout(w.id)}
                            className="text-brown-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 text-sm">🗑</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── LOG WORKOUT ── */}
        {tab === 'log' && (
          <div className="max-w-lg mx-auto space-y-4">
            <h2 className="font-display text-2xl font-semibold text-brown-900">Log a Workout</h2>
            <div className="bg-cream rounded-2xl border border-brown-200 p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Date</label>
                <input type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-2">Focus Muscle Group</label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLES.map(m => (
                    <button key={m} type="button" onClick={() => setLogForm({...logForm, focus: m})}
                      className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                        logForm.focus === m ? 'bg-brown-500 text-cream border-brown-500' : 'border-brown-200 text-brown-600 hover:border-brown-400'
                      }`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brown-600 mb-1.5">Total Sets *</label>
                  <input type="number" placeholder="e.g. 18" value={logForm.sets}
                    onChange={e => setLogForm({...logForm, sets: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brown-600 mb-1.5">Duration (min) *</label>
                  <input type="number" placeholder="e.g. 60" value={logForm.duration}
                    onChange={e => setLogForm({...logForm, duration: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">Notes (optional)</label>
                <textarea placeholder="e.g. New PB on bench! Felt strong." value={logForm.notes}
                  onChange={e => setLogForm({...logForm, notes: e.target.value})}
                  rows={2} className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400 resize-none" />
              </div>
              <button onClick={saveWorkout} disabled={!logForm.sets || !logForm.duration}
                className="btn-primary w-full py-3 disabled:opacity-40">✓ Save Workout</button>
            </div>
            {workoutLog.length > 0 && (
              <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-brown-100">
                  <h3 className="font-body font-semibold text-brown-800">All Logged Workouts ({workoutLog.length})</h3>
                </div>
                <div className="divide-y divide-brown-100 max-h-72 overflow-y-auto">
                  {workoutLog.map(w => (
                    <div key={w.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-brown-50">
                      <div className="w-9 h-9 bg-brown-500 text-cream rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(w.focus||'?')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-brown-900">{w.focus}</div>
                        <div className="text-xs text-brown-400">{w.date}</div>
                      </div>
                      <div className="text-xs text-brown-600">{w.sets}s · {w.duration}m</div>
                      <button onClick={() => deleteWorkout(w.id)}
                        className="text-brown-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 text-sm">🗑</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WEIGHT ── */}
        {tab === 'weight' && (
          <div className="max-w-lg mx-auto space-y-5">
            <h2 className="font-display text-2xl font-semibold text-brown-900">Weight Tracker</h2>
            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <h3 className="font-body font-semibold text-brown-800 mb-3">Log Weight</h3>
              <div className="flex gap-3">
                <input type="number" step="0.1" placeholder="e.g. 75.5" value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 focus:outline-none focus:border-brown-400 text-sm" />
                <span className="self-center text-brown-500 text-sm">kg</span>
                <button onClick={saveWeight} className="btn-primary px-6 py-3">Add</button>
              </div>
              <p className="text-xs text-brown-400 mt-2">💡 Weigh yourself first thing in the morning for consistency.</p>
            </div>
            {weightLog.length > 0 ? (
              <>
                <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                  <h3 className="font-body font-semibold text-brown-800 mb-4">Weight History</h3>
                  <LineChart data={weightLog} />
                </div>
                <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-brown-100 flex justify-between">
                    <h3 className="font-body font-semibold text-brown-800">All Entries</h3>
                    <span className="text-sm text-brown-400">{weightLog.length} entries</span>
                  </div>
                  <div className="divide-y divide-brown-100 max-h-64 overflow-y-auto">
                    {[...weightLog].reverse().map((w, i) => {
                      const origIdx = weightLog.length - 1 - i
                      const prev = weightLog[origIdx - 1]
                      const diff = prev ? +(w.value - prev.value).toFixed(1) : null
                      return (
                        <div key={i} className="flex items-center justify-between px-5 py-3 group hover:bg-brown-50">
                          <span className="text-sm text-brown-500">{w.label}</span>
                          <span className="font-bold text-brown-900">{w.value} kg</span>
                          {diff !== null && (
                            <span className={`text-xs font-medium ${diff < 0 ? 'text-green-600' : diff > 0 ? 'text-blue-600' : 'text-brown-400'}`}>
                              {diff >= 0 ? '+' : ''}{diff} kg
                            </span>
                          )}
                          <button onClick={() => deleteWeight(origIdx)}
                            className="text-brown-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 text-sm">🗑</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-cream rounded-2xl border border-brown-200">
                <div className="text-4xl mb-3">⚖️</div>
                <p className="text-brown-500">No weight entries yet. Add your first one above.</p>
              </div>
            )}
            <div className="bg-brown-800 text-cream rounded-2xl p-5">
              <h4 className="font-display text-lg font-semibold mb-2">Weight Tracking Rules</h4>
              <ul className="text-brown-300 text-sm space-y-1 list-disc pl-4 font-body">
                <li>Weigh at the same time every day — morning is best</li>
                <li>Daily fluctuations of 1–2 kg are completely normal</li>
                <li>Look at the weekly trend, not daily numbers</li>
                <li>Losing 0.3–0.5 kg/week = ideal fat loss</li>
                <li>Gaining 0.2–0.4 kg/week = ideal muscle building</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── SLEEP ── */}
        {tab === 'sleep' && (
          <div className="max-w-lg mx-auto">
            <h2 className="font-display text-2xl font-semibold text-brown-900 mb-5">Sleep & Recovery</h2>
            <SleepTracker />
          </div>
        )}

        {/* ── MEASUREMENTS ── */}
        {tab === 'measurements' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-brown-900 mb-5">Body Measurements</h2>
            <MeasurementTracker />
          </div>
        )}

        {/* ── AI WEEKLY REPORT (Task 10) ── */}
        {tab === 'report' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-brown-900 mb-5">AI Weekly Report</h2>
            <WeeklyReport />
          </div>
        )}

        {/* ── SUPPLEMENTS (Task 11) ── */}
        {tab === 'supplements' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-brown-900 mb-5">Supplement Tracker</h2>
            <SupplementTracker />
          </div>
        )}

      </div>
    </main>
  )
}
