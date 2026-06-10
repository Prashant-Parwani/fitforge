import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import RestTimer from '../components/RestTimer'
import { machines } from '../data/machines'
import { FiActivity, FiArrowLeft, FiArrowRight, FiCheck, FiPlus, FiSearch, FiTarget, FiZap } from 'react-icons/fi'

// Group machines by category for picker
const CATEGORY_LABELS = {
  chest: 'Chest', back: 'Back', legs: 'Legs',
  shoulders: 'Shoulders', arms: 'Arms', core: 'Core', cardio: 'Cardio', full: 'Full Body'
}

const CATEGORY_SHORT = {
  chest: 'CH', back: 'BK', legs: 'LG',
  shoulders: 'SH', arms: 'AR', core: 'CO', cardio: 'CA', full: 'FB'
}

const focusParts = (focus = '') => focus
  .replace('Rest & Recovery', 'Rest')
  .split('+')
  .map(part => part.trim())
  .filter(Boolean)

const muscleText = (machine) => `${machine.category} ${machine.name} ${machine.muscles.join(' ')}`.toLowerCase()

const exerciseMatchesFocus = (machine, focus) => {
  const text = muscleText(machine)
  return focusParts(focus).some(part => {
    const p = part.toLowerCase()
    if (p === 'chest') return machine.category === 'chest' || text.includes('pectoral')
    if (p === 'back') return machine.category === 'back' || text.includes('lat') || text.includes('rhomboid')
    if (p === 'legs') return machine.category === 'legs' || text.includes('quad') || text.includes('hamstring') || text.includes('calf')
    if (p === 'shoulders') return machine.category === 'shoulders' || text.includes('deltoid')
    if (p === 'triceps') return text.includes('tricep')
    if (p === 'biceps') return text.includes('bicep')
    if (p === 'arms') return machine.category === 'arms' || text.includes('bicep') || text.includes('tricep')
    if (p === 'core') return machine.category === 'core' || text.includes('abdom') || text.includes('core')
    if (p === 'cardio') return machine.category === 'cardio'
    if (p === 'full body') return machine.category === 'full'
    if (p.includes('trap')) return text.includes('trap')
    if (p.includes('glute') || p.includes('hamstring')) return text.includes('glute') || text.includes('hamstring')
    return text.includes(p)
  })
}

const filterIdForFocusPart = (part) => {
  const p = part.toLowerCase()
  if (p === 'triceps') return 'triceps'
  if (p === 'biceps') return 'biceps'
  if (p.includes('trap')) return 'traps'
  if (p.includes('glute')) return 'glutes'
  if (p.includes('hamstring')) return 'hamstrings'
  if (p === 'full body') return 'full'
  return p
}

// Estimate 1RM using Epley formula
const calc1RM = (weight, reps) => reps === 1 ? weight : Math.round(weight * (1 + reps / 30))

export default function WorkoutLogger() {
  const { user, updateUser } = useAuth()
  const navigate             = useNavigate()

  // Session state
  const [phase, setPhase]           = useState('picker')   // picker | logging | done
  const [selectedEx, setSelectedEx] = useState(null)       // current exercise being logged
  const [sessionExs, setSessionExs] = useState([])         // [{name, sets:[{weight,reps}]}]
  const [sets, setSets]             = useState([])          // sets for current exercise
  const [weight, setWeight]         = useState('')
  const [reps, setReps]             = useState('')
  const [showTimer, setShowTimer]   = useState(false)
  const [timerKey, setTimerKey]     = useState(0)
  const [search, setSearch]         = useState('')
  const [activeCategory, setActiveCategory] = useState('today')
  const [elapsed, setElapsed]       = useState(0)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [newPR, setNewPR]           = useState(null)
  const [entryOpen, setEntryOpen]   = useState(true)

  const dayOfWeek = new Date().getDay()
  const todayIdx = [6, 0, 1, 2, 3, 4, 5][dayOfWeek]
  const todayFocus = user?.customSplit?.[todayIdx]?.focus || 'Full Body'
  const todayLabel = todayFocus === 'Rest' ? 'Today' : `Today - ${todayFocus}`
  const focusFilters = focusParts(todayFocus).filter(part => part !== 'Rest')

  // Elapsed timer
  const elapsedRef = useRef(null)
  useEffect(() => {
    if (sessionStarted && phase !== 'done') {
      elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(elapsedRef.current)
  }, [sessionStarted, phase])

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`

  const filteredMachines = machines.filter(m => {
    const matchCat =
      activeCategory === 'today' ? exerciseMatchesFocus(m, todayFocus) :
      activeCategory === 'all' ? true :
      activeCategory === 'triceps' ? muscleText(m).includes('tricep') :
      activeCategory === 'biceps' ? muscleText(m).includes('bicep') :
      activeCategory === 'traps' ? muscleText(m).includes('trap') :
      activeCategory === 'glutes' ? muscleText(m).includes('glute') :
      activeCategory === 'hamstrings' ? muscleText(m).includes('hamstring') :
      m.category === activeCategory
    const matchSearch = search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.muscles.some(mu => mu.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const selectExercise = (machine) => {
    setSelectedEx(machine)
    setSets([])
    setWeight('')
    setReps('')
    setShowTimer(false)
    setEntryOpen(true)
    setPhase('logging')
    if (!sessionStarted) setSessionStarted(true)
  }

  const logSet = () => {
    const w = parseFloat(weight)
    const r = parseInt(reps)
    if (!w || !r || r < 1) return

    const rm = calc1RM(w, r)
    // Check PR
    const prKey = `pr_${selectedEx.name.replace(/\s+/g,'_')}`
    const prevPR = user?.[prKey] || 0
    const isPR   = rm > prevPR

    const newSet = { weight: w, reps: r, oneRM: rm, isPR }
    setSets(prev => [...prev, newSet])
    setWeight('')
    setReps('')
    setEntryOpen(false)

    if (isPR) {
      setNewPR({ exercise: selectedEx.name, oneRM: rm })
      updateUser({ [prKey]: rm })
      setTimeout(() => setNewPR(null), 3000)
    }

    // Start rest timer
    setTimerKey(k => k + 1)
    setShowTimer(true)
  }

  const finishExercise = () => {
    if (sets.length === 0) { setPhase('picker'); return }
    setSessionExs(prev => [...prev, { name: selectedEx.name, category: selectedEx.category, sets }])
    setPhase('picker')
    setSelectedEx(null)
    setSets([])
    setShowTimer(false)
  }

  const finishWorkout = () => {
    if (sessionExs.length === 0) { navigate('/'); return }
    clearInterval(elapsedRef.current)

    const totalSets = sessionExs.reduce((acc, ex) => acc + ex.sets.length, 0)
    const focus     = todayFocus && todayFocus !== 'Rest' ? todayFocus : (
      sessionExs[0]?.category ? CATEGORY_LABELS[sessionExs[0].category] || 'Mixed' : 'Mixed'
    )

    const entry = {
      id:        Date.now(),
      date:      new Date().toISOString().split('T')[0],
      focus,
      sets:      totalSets,
      duration:  Math.round(elapsed / 60),
      exercises: sessionExs,
      notes:     '',
    }

    updateUser({ workoutLog: [entry, ...(user?.workoutLog || [])] })
    setPhase('done')
  }

  // ── EXERCISE PICKER ──────────────────────────────────────────────
  if (phase === 'picker') {
    return (
      <main className="pt-20 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-display text-2xl font-bold text-brown-900">
                {sessionStarted ? 'Add Exercise' : 'Start Workout'}
              </h1>
              {sessionStarted && (
                <p className="text-sm text-brown-500 mt-0.5">
                  {sessionExs.length} exercise{sessionExs.length !== 1 ? 's' : ''} · {fmtTime(elapsed)}
                </p>
              )}
            </div>
            {sessionStarted && (
              <button onClick={finishWorkout}
                className="btn-primary text-sm py-2 px-4">
                Finish
              </button>
            )}
          </div>

          {/* PR toast */}
          {newPR && (
            <div className="animate-fade-up bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
              <FiZap className="text-amber-700 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-amber-800">New Personal Record!</div>
                <div className="text-xs text-amber-600">{newPR.exercise} - {newPR.oneRM}kg estimated 1RM</div>
              </div>
            </div>
          )}

          {/* Session summary (if exercises added) */}
          {sessionExs.length > 0 && (
            <div className="bg-cream rounded-2xl border border-brown-200 p-4 mb-4">
              <div className="text-xs font-medium text-brown-500 uppercase tracking-wider mb-2">Session so far</div>
              {sessionExs.map((ex, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-brown-100 last:border-0">
                  <span className="text-sm font-medium text-brown-800">{ex.name}</span>
                  <span className="text-xs text-brown-500">{ex.sets.length} sets</span>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-3">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 text-sm" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises or muscles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown-200 bg-cream text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 text-sm"/>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {[
              { id: 'today', label: todayLabel },
              ...focusFilters.map(part => ({ id: filterIdForFocusPart(part), label: part })),
              { id: 'all', label: 'All' },
            ].map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brown-500 text-cream border-brown-500'
                    : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Machine list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredMachines.map(m => (
              <button key={m.id} onClick={() => selectExercise(m)}
                className="flex items-center gap-3 bg-cream rounded-xl border border-brown-200 p-3 hover:border-brown-400 hover:bg-brown-50 transition-all text-left group">
                <div className="w-10 h-10 bg-brown-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-brown-200 transition-colors">
                  <span className="text-[11px] font-bold tracking-wide text-brown-600">{CATEGORY_SHORT[m.category] || 'EX'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-brown-900 truncate">{m.name}</div>
                  <div className="text-xs text-brown-400 truncate">{m.muscles.slice(0,2).join(', ')}</div>
                </div>
                <FiArrowRight className="text-brown-300 text-sm group-hover:text-brown-500" />
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ── LOGGING SETS ────────────────────────────────────────────────────
  if (phase === 'logging') {
    const prevPRKey = `pr_${selectedEx?.name.replace(/\s+/g,'_')}`
    const prevPR    = user?.[prevPRKey]

    return (
      <main className="pt-20 pb-24 min-h-screen">
        <div className="max-w-xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => { setPhase('picker'); setShowTimer(false) }}
              className="text-brown-500 text-sm hover:text-brown-700 inline-flex items-center gap-1">
              <FiArrowLeft /> Back
            </button>
            <span className="text-sm text-brown-500 font-mono">{fmtTime(elapsed)}</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-brown-900 mb-1">{selectedEx?.name}</h2>
          <p className="text-sm text-brown-500 mb-1">{selectedEx?.muscles?.slice(0,3).join(' - ')}</p>
          <p className="text-xs text-brown-400 mb-5">Recommended: {selectedEx?.sets}</p>

          {/* Previous PR */}
          {prevPR && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
              <FiZap className="text-amber-700 flex-shrink-0" />
              <span className="text-xs text-amber-700">Your PR: <strong>{prevPR}kg</strong> estimated 1RM</span>
            </div>
          )}

          {/* Rest timer */}
          {showTimer && (
            <div className="bg-cream rounded-2xl border border-brown-200 mb-5">
              <RestTimer key={timerKey} seconds={90}
                onDone={() => setShowTimer(false)}
                onSkip={() => setShowTimer(false)} />
            </div>
          )}

          {/* Logged sets */}
          {sets.length > 0 && (
            <div className="bg-cream rounded-2xl border border-brown-200 mb-5 overflow-hidden">
              <div className="px-4 py-2 border-b border-brown-100 grid grid-cols-4 text-xs font-medium text-brown-500 uppercase tracking-wider">
                <span>Set</span><span className="text-center">Weight</span>
                <span className="text-center">Reps</span><span className="text-center">1RM est.</span>
              </div>
              {sets.map((s, i) => (
                <div key={i} className={`px-4 py-3 grid grid-cols-4 text-sm border-b border-brown-50 last:border-0 ${s.isPR ? 'bg-amber-50' : ''}`}>
                  <span className="font-medium text-brown-700">
                    {i + 1} {s.isPR && <span className="text-xs text-amber-600">PR</span>}
                  </span>
                  <span className="text-center text-brown-800">{s.weight}kg</span>
                  <span className="text-center text-brown-800">{s.reps}</span>
                  <span className="text-center text-brown-500">{s.oneRM}kg</span>
                </div>
              ))}
            </div>
          )}

          {/* Input row */}
          {!showTimer && !entryOpen && (
            <button onClick={() => setEntryOpen(true)}
              className="w-full mb-4 py-3 rounded-xl border border-brown-300 text-brown-700 bg-cream hover:bg-brown-50 text-sm font-medium transition-all inline-flex items-center justify-center gap-2">
              <FiPlus /> Add Set {sets.length + 1}
            </button>
          )}

          {!showTimer && entryOpen && (
            <div className="bg-cream rounded-2xl border border-brown-200 p-4 mb-4">
              <div className="text-xs font-medium text-brown-500 uppercase tracking-wider mb-3">
                Set {sets.length + 1}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-brown-500 mb-1.5">Weight (kg)</label>
                  <input type="number" inputMode="decimal" value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder={sets.length > 0 ? String(sets[sets.length-1].weight) : '60'}
                    className="w-full px-3 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-center text-lg font-bold focus:outline-none focus:border-brown-400"/>
                </div>
                <div>
                  <label className="block text-xs text-brown-500 mb-1.5">Reps</label>
                  <input type="number" inputMode="numeric" value={reps}
                    onChange={e => setReps(e.target.value)}
                    placeholder={sets.length > 0 ? String(sets[sets.length-1].reps) : '10'}
                    className="w-full px-3 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-center text-lg font-bold focus:outline-none focus:border-brown-400"/>
                </div>
              </div>
              {weight && reps && (
                <p className="text-xs text-brown-400 text-center mb-3">
                  Est. 1RM: <strong className="text-brown-700">{calc1RM(parseFloat(weight), parseInt(reps))}kg</strong>
                </p>
              )}
              <button onClick={logSet} disabled={!weight || !reps}
                className="btn-primary w-full py-3 text-base disabled:opacity-40 inline-flex items-center justify-center gap-2">
                <FiCheck /> Log Set {sets.length + 1}
              </button>
            </div>
          )}

          {/* Finish exercise */}
          <button onClick={finishExercise}
            className={`w-full py-3 rounded-xl border text-sm font-medium transition-all ${
              sets.length > 0
                ? 'border-brown-400 text-brown-700 hover:bg-brown-100'
                : 'border-brown-200 text-brown-400'
            }`}>
            {sets.length > 0 ? 'Done with this exercise ->' : 'Skip and choose another ->'}
          </button>

          {/* Pro tip */}
          {selectedEx?.tip && (
            <div className="mt-4 bg-brown-50 rounded-xl p-3 border border-brown-200">
              <div className="text-xs font-medium text-brown-500 mb-0.5 flex items-center gap-1"><FiTarget /> Trainer tip</div>
              <p className="text-xs text-brown-600 leading-relaxed">{selectedEx.tip}</p>
            </div>
          )}
        </div>
      </main>
    )
  }

  // ── DONE SCREEN ────────────────────────────────────────────────────
  if (phase === 'done') {
    const totalSets = sessionExs.reduce((acc, ex) => acc + ex.sets.length, 0)
    const totalVol  = sessionExs.reduce((acc, ex) =>
      acc + ex.sets.reduce((s2, s) => s2 + s.weight * s.reps, 0), 0)

    return (
      <main className="pt-20 pb-24 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brown-500 text-cream flex items-center justify-center">
            <FiCheck className="text-3xl" />
          </div>
          <h1 className="font-display text-3xl font-bold text-brown-900 mb-2">Workout Complete!</h1>
          <p className="text-brown-500 mb-8">Great session. Recovery starts now.</p>

          <div className="bg-cream rounded-2xl border border-brown-200 p-5 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Duration',  value: `${Math.round(elapsed/60)}m` },
                { label: 'Total Sets', value: totalSets },
                { label: 'Volume',    value: `${Math.round(totalVol/1000*10)/10}t` },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-brown-800">{s.value}</div>
                  <div className="text-xs text-brown-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brown-100 space-y-1.5">
              {sessionExs.map((ex, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-brown-700">{ex.name}</span>
                  <span className="text-brown-400">{ex.sets.length} sets</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary w-full py-3 text-base">
            Back to Dashboard ->
          </button>
        </div>
      </main>
    )
  }
}
