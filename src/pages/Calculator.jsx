import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function ExerciseBlock({ exercise }) {
  const maxWeight = exercise.sets ? Math.max(...exercise.sets.map(s => s.weight || 0)) : 0
  const totalVol  = exercise.sets ? exercise.sets.reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0) : 0
  return (
    <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden mb-3">
      <div className="px-4 py-3 bg-brown-50 border-b border-brown-100 flex items-center justify-between">
        <h4 className="font-body font-semibold text-brown-900 text-sm">{exercise.name}</h4>
        <div className="flex gap-3 text-xs text-brown-500">
          <span>Best: <strong className="text-brown-800">{maxWeight}kg</strong></span>
          <span>Vol: <strong className="text-brown-800">{totalVol}kg</strong></span>
        </div>
      </div>
      {exercise.sets && exercise.sets.length > 0 ? (
        <div>
          <div className="grid grid-cols-4 px-4 py-2 text-xs font-medium text-brown-400 uppercase tracking-wider border-b border-brown-50">
            <span>Set</span>
            <span className="text-center">Weight</span>
            <span className="text-center">Reps</span>
            <span className="text-center">1RM est.</span>
          </div>
          {exercise.sets.map((set, i) => (
            <div key={i} className={`grid grid-cols-4 px-4 py-2.5 text-sm border-b border-brown-50 last:border-0 ${set.isPR ? 'bg-amber-50' : ''}`}>
              <span className="text-brown-600 font-medium">
                {i + 1} {set.isPR && <span className="text-xs text-amber-600 ml-1">PR</span>}
              </span>
              <span className="text-center text-brown-900 font-medium">{set.weight}kg</span>
              <span className="text-center text-brown-900">{set.reps}</span>
              <span className="text-center text-brown-500">{set.oneRM || '—'}kg</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-xs text-brown-400 italic">No set details recorded</div>
      )}
    </div>
  )
}

function WorkoutDetailModal({ workout, onClose }) {
  const totalSets = workout.exercises
    ? workout.exercises.reduce((a, ex) => a + (ex.sets?.length || 0), 0)
    : workout.sets || 0
  const totalVol = workout.exercises
    ? workout.exercises.reduce((a, ex) =>
        a + (ex.sets?.reduce((s2, s) => s2 + (s.weight || 0) * (s.reps || 0), 0) || 0), 0)
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-brown-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-2xl bg-cream sm:rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown-100 bg-brown-800 text-cream sm:rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold">{workout.focus}</h2>
            <p className="text-brown-300 text-sm mt-0.5">{workout.date} · {workout.duration}min</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brown-700 hover:bg-brown-600 flex items-center justify-center transition-colors">✕</button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-px bg-brown-100 flex-shrink-0">
          {[
            { label: 'Duration',   value: workout.duration + ' min' },
            { label: 'Total Sets', value: totalSets },
            { label: 'Volume',     value: totalVol > 0 ? Math.round(totalVol / 1000 * 10) / 10 + 't' : workout.sets + ' sets' },
          ].map(s => (
            <div key={s.label} className="bg-cream px-4 py-3 text-center">
              <div className="font-display text-xl font-bold text-brown-800">{s.value}</div>
              <div className="text-xs text-brown-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {workout.exercises && workout.exercises.length > 0 ? (
            <>
              <p className="text-xs text-brown-500 uppercase tracking-wider font-medium mb-3">{workout.exercises.length} exercises</p>
              {workout.exercises.map((ex, i) => <ExerciseBlock key={i} exercise={ex} />)}
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-brown-500 text-sm">This workout was logged without exercise details.</p>
              <p className="text-brown-400 text-xs mt-1">Use the Workout Logger to track sets & reps next time.</p>
            </div>
          )}

          {workout.notes && (
            <div className="bg-brown-50 rounded-xl p-3 border border-brown-100 mt-2">
              <div className="text-xs font-medium text-brown-500 mb-0.5">Notes</div>
              <p className="text-sm text-brown-700">{workout.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkoutHistory() {
  const { user } = useAuth()
  const [selected, setSelected]   = useState(null)
  const [filterFocus, setFilterFocus] = useState('all')
  const [search, setSearch]       = useState('')

  const workoutLog = user?.workoutLog || []

  const focusOptions = ['all', ...new Set(workoutLog.map(w => w.focus).filter(Boolean))]

  const filtered = workoutLog.filter(w => {
    const matchFocus = filterFocus === 'all' || w.focus === filterFocus
    const matchSearch = search === '' || w.focus?.toLowerCase().includes(search.toLowerCase()) || w.notes?.toLowerCase().includes(search.toLowerCase())
    return matchFocus && matchSearch
  })

  // Group by month
  const grouped = filtered.reduce((acc, w) => {
    const month = new Date(w.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(w)
    return acc
  }, {})

  const focusColors = {
    Chest: 'bg-red-100 text-red-700', Back: 'bg-blue-100 text-blue-700',
    Legs: 'bg-green-100 text-green-700', Shoulders: 'bg-purple-100 text-purple-700',
    Arms: 'bg-orange-100 text-orange-700', Core: 'bg-yellow-100 text-yellow-700',
    Cardio: 'bg-teal-100 text-teal-700', 'Full Body': 'bg-brown-100 text-brown-700',
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/progress" className="text-xs text-brown-400 hover:text-brown-200 mb-2 inline-block">← Progress</Link>
          <h1 className="font-display text-4xl font-bold mb-1">Workout History</h1>
          <p className="text-brown-300 text-sm">{workoutLog.length} sessions logged · tap any to see full details</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">

        {/* Search + filter */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 text-sm">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search workouts..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown-200 bg-cream text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {focusOptions.map(f => (
              <button key={f} onClick={() => setFilterFocus(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                  filterFocus === f ? 'bg-brown-500 text-cream border-brown-500' : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
                }`}>{f === 'all' ? 'All' : f}</button>
            ))}
          </div>
        </div>

        {workoutLog.length === 0 ? (
          <div className="text-center py-20 bg-cream rounded-2xl border border-brown-200">
            <div className="text-5xl mb-4">🏋️</div>
            <h2 className="font-display text-2xl font-bold text-brown-800 mb-2">No workouts yet</h2>
            <p className="text-brown-500 mb-5">Start logging workouts to see your history here.</p>
            <Link to="/log" className="btn-primary">Log First Workout →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).reverse().map(([month, sessions]) => (
              <div key={month}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-display text-base font-semibold text-brown-700">{month}</h3>
                  <div className="flex-1 h-px bg-brown-200" />
                  <span className="text-xs text-brown-400">{sessions.length} sessions</span>
                </div>
                <div className="space-y-2">
                  {sessions.map(w => (
                    <button key={w.id} onClick={() => setSelected(w)}
                      className="w-full flex items-center gap-4 bg-cream rounded-2xl border border-brown-200 px-4 py-3.5 hover:border-brown-400 hover:shadow-sm transition-all text-left group">
                      <div className="w-10 h-10 bg-brown-500 text-cream rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-brown-600 transition-colors">
                        {(w.focus || '?')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-body font-semibold text-brown-900 text-sm">{w.focus || 'Workout'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${focusColors[w.focus] || 'bg-brown-100 text-brown-600'}`}>
                            {w.focus}
                          </span>
                          {w.exercises?.some(ex => ex.sets?.some(s => s.isPR)) && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">🏆 PR</span>
                          )}
                        </div>
                        <div className="text-xs text-brown-400 mt-0.5">
                          {w.date} · {w.sets} sets · {w.duration} min
                          {w.exercises?.length > 0 && ` · ${w.exercises.length} exercises`}
                        </div>
                        {w.notes && <div className="text-xs text-brown-500 mt-0.5 truncate italic">"{w.notes}"</div>}
                      </div>
                      <span className="text-brown-300 text-lg group-hover:text-brown-500 transition-colors">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <WorkoutDetailModal workout={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
