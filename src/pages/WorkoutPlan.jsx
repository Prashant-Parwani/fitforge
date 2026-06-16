import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { weekPlan } from '../data/workoutPlan'
import { Link } from 'react-router-dom'

const FOCUS_OPTIONS = [
  'Chest','Triceps','Chest + Triceps','Chest + Shoulders','Chest + Core',
  'Back','Biceps','Back + Biceps','Back + Traps',
  'Legs','Legs + Cardio','Legs + Core','Glutes + Hamstrings',
  'Shoulders','Shoulders + Traps','Shoulders + Core','Shoulders + Arms',
  'Arms','Core','Cardio','Cardio + Core',
  'Upper Body','Lower Body','Full Body','Mobility','Rest'
]

const focusColor = (focus) => {
  if (!focus) return 'bg-brown-400'
  if (focus === 'Rest') return 'bg-brown-300'
  if (focus.includes('Chest')) return 'bg-rose-500'
  if (focus.includes('Back')) return 'bg-blue-600'
  if (focus.includes('Leg') || focus.includes('Glutes') || focus.includes('Hamstrings')) return 'bg-green-600'
  if (focus.includes('Shoulder') || focus.includes('Trap')) return 'bg-purple-600'
  if (focus.includes('Arm') || focus.includes('Bicep') || focus.includes('Tricep')) return 'bg-orange-500'
  if (focus.includes('Cardio') || focus.includes('Mobility')) return 'bg-teal-500'
  if (focus.includes('Core')) return 'bg-yellow-500'
  if (focus.includes('Full') || focus.includes('Upper') || focus.includes('Lower')) return 'bg-brown-600'
  return 'bg-brown-400'
}

const FOCUS_ALIASES = {
  Triceps: 'Arms',
  Biceps: 'Arms',
  Cardio: 'Cardio + Core',
  'Back + Traps': 'Shoulders + Traps',
  'Glutes + Hamstrings': 'Lower Body',
  Rest: 'Rest & Recovery',
}

const findPlan = (focus) => {
  const target = FOCUS_ALIASES[focus] || focus
  return weekPlan.find(d => d.focus === target)
}

const buildComboPlan = (focus, fallbackDay) => {
  const exact = findPlan(focus)
  if (exact) return { ...exact, focus }

  if (!focus?.includes('+')) return weekPlan[fallbackDay]

  const parts = focus.split('+').map(part => part.trim())
  const partPlans = parts.map(findPlan).filter(Boolean)
  if (!partPlans.length) return weekPlan[fallbackDay]

  return {
    ...partPlans[0],
    focus,
    goal: `Balanced ${focus.toLowerCase()} session with the best-matching exercises`,
    warmup: partPlans[0].warmup,
    exercises: partPlans.flatMap((plan, index) =>
      plan.exercises.slice(0, index === 0 ? 3 : 2)
    ),
    cooldown: partPlans[partPlans.length - 1].cooldown,
    totalTime: '55-70 min',
  }
}

export default function WorkoutPlan() {
  const { user, updateUser }  = useAuth()
  const [activeDay, setActiveDay] = useState(0)
  const [editingDay, setEditingDay] = useState(null)
  const [editMode, setEditMode]    = useState(false)

  // Use custom split from user profile if available, else default
  const split = user?.customSplit || weekPlan.map(d => ({ day: d.day, short: d.short, focus: d.focus, emoji: d.emoji, color: d.color }))

  // Get full plan data for active day from the default plan
  const activeSplit  = split[activeDay]
  const defaultPlan  = buildComboPlan(activeSplit.focus, activeDay)

  const updateFocus = (idx, newFocus) => {
    const newSplit = split.map((d, i) => i === idx ? { ...d, focus: newFocus } : d)
    updateUser({ customSplit: newSplit })
    setEditingDay(null)
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Your Custom Plan</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-2">7-Day Workout Split</h1>
            <p className="text-brown-300 font-body max-w-2xl">
              Expert-designed. Personalised to your goals. Tap any day to view exercises.
              {user?.level && <span className="ml-1 text-brown-400">Level: {user.level}</span>}
            </p>
          </div>
          <button onClick={() => setEditMode(!editMode)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${editMode ? 'bg-brown-300 text-brown-900 border-brown-300' : 'border-brown-400 text-brown-200 hover:border-brown-200'}`}>
            {editMode ? '✓ Done Editing' : '✏️ Customise Split'}
          </button>
        </div>
      </section>

      {/* Day tabs — sticky */}
      <div className="bg-cream border-b border-brown-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {split.map((d, i) => (
              <button key={d.day} onClick={() => { setActiveDay(i); setEditingDay(null) }}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all ${activeDay === i ? `${focusColor(d.focus)} text-cream` : 'hover:bg-brown-100 text-brown-600'}`}>
                <span className="text-xs font-bold">{d.short}</span>
                <span className="text-xs opacity-80">{d.focus}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">

        {/* Edit mode: change day focus */}
        {editMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <h3 className="font-body font-semibold text-amber-800 mb-3">✏️ Edit Mode — tap a day below to change its focus</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {split.map((d, i) => (
                <button key={d.day} onClick={() => setEditingDay(editingDay === i ? null : i)}
                  className={`rounded-xl p-2 text-center text-cream transition-all border-2 ${editingDay === i ? 'border-amber-400 scale-105' : 'border-transparent'} ${focusColor(d.focus)}`}>
                  <div className="text-xs font-bold">{d.short}</div>
                  <div className="text-xs opacity-80 truncate">{d.focus}</div>
                </button>
              ))}
            </div>
            {editingDay !== null && (
              <div className="bg-white rounded-xl p-3 border border-amber-100">
                <p className="text-sm font-semibold text-brown-700 mb-2">{split[editingDay].day} — Choose new focus:</p>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_OPTIONS.map(f => (
                    <button key={f} onClick={() => updateFocus(editingDay, f)}
                      className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${split[editingDay].focus === f ? 'bg-brown-500 text-cream border-brown-500' : 'border-brown-200 text-brown-600 hover:border-brown-400'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active day header */}
        <div className={`${focusColor(activeSplit.focus).replace('bg-', 'bg-').replace('-500','-50').replace('-600','-50')} bg-brown-50 border border-brown-200 rounded-2xl p-5 mb-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-bold text-brown-900">
                {activeSplit.day} — {activeSplit.focus}
              </h2>
              {defaultPlan?.goal && <p className="text-brown-500 font-body mt-1 text-sm">{defaultPlan.goal}</p>}
            </div>
            <div className="flex gap-3 text-sm">
              {defaultPlan?.totalTime && (
                <div className="bg-white rounded-xl px-4 py-2 border border-brown-100">
                  <div className="text-brown-400 text-xs">Duration</div>
                  <div className="font-semibold text-brown-800">{defaultPlan.totalTime}</div>
                </div>
              )}
              {defaultPlan?.warmup && defaultPlan.warmup !== '—' && (
                <div className="bg-white rounded-xl px-4 py-2 border border-brown-100 hidden sm:block">
                  <div className="text-brown-400 text-xs">Warmup</div>
                  <div className="font-semibold text-brown-800 text-xs">{defaultPlan.warmup}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exercises */}
        {activeSplit.focus === 'Rest' ? (
          <div className="bg-cream rounded-2xl border border-brown-200 p-8 text-center">
            <div className="text-5xl mb-4">😴</div>
            <h3 className="font-display text-2xl font-bold text-brown-800 mb-2">Rest Day</h3>
            <p className="text-brown-500 font-body max-w-md mx-auto">
              Growth happens during recovery. Light walk, stretching, foam rolling and staying hydrated.
              This day is as important as any training day.
            </p>
          </div>
        ) : defaultPlan?.exercises ? (
          <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden mb-5">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brown-100">
              <h3 className="font-display text-xl font-semibold text-brown-900">Exercises</h3>
              <span className="text-sm text-brown-500">{defaultPlan.exercises.length} exercises</span>
            </div>
            <div className="divide-y divide-brown-100">
              {defaultPlan.exercises.map((ex, i) => (
                <div key={ex.name} className="flex items-start gap-3 px-5 py-4 hover:bg-brown-50 transition-colors">
                  <div className={`${focusColor(activeSplit.focus)} text-cream w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h4 className="font-body font-semibold text-brown-900 text-sm">{ex.name}</h4>
                      <div className="flex gap-1.5 flex-wrap text-xs">
                        <span className="bg-brown-100 text-brown-700 px-2 py-0.5 rounded-full">{ex.sets} sets</span>
                        <span className="bg-brown-100 text-brown-700 px-2 py-0.5 rounded-full">{ex.reps} reps</span>
                        <span className="bg-brown-50 text-brown-500 px-2 py-0.5 rounded-full">Rest: {ex.rest}</span>
                      </div>
                    </div>
                    <p className="text-xs text-brown-400 font-body">💡 {ex.notes}</p>
                  </div>
                </div>
              ))}
            </div>
            {defaultPlan.cooldown && defaultPlan.cooldown !== '—' && (
              <div className="px-5 py-3 bg-brown-50 border-t border-brown-100 text-sm text-brown-500">
                🧘 <span className="font-medium">Cooldown:</span> {defaultPlan.cooldown}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-cream rounded-2xl border border-brown-200 p-8 text-center">
            <div className="text-4xl mb-3">💪</div>
            <h3 className="font-display text-xl font-bold text-brown-800 mb-2">{activeSplit.focus} Day</h3>
            <p className="text-brown-500 text-sm mb-4">Detailed exercise list for this muscle group is in the Machines section.</p>
            <Link to="/machines" className="btn-primary text-sm">Browse {activeSplit.focus} Machines →</Link>
          </div>
        )}

        {/* Weekly overview */}
        <div className="bg-brown-800 rounded-2xl p-5 text-cream">
          <h3 className="font-display text-lg font-semibold mb-3">Your Weekly Split</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {split.map((d, i) => (
              <button key={d.day} onClick={() => setActiveDay(i)}
                className={`rounded-xl p-2 text-center transition-all ${i === activeDay ? 'ring-2 ring-brown-200' : 'opacity-70 hover:opacity-100'} ${focusColor(d.focus)}`}>
                <div className="text-xs font-bold">{d.short}</div>
                <div className="text-xs opacity-80 truncate">{d.focus}</div>
              </button>
            ))}
          </div>
          <p className="text-brown-400 text-xs mt-3 font-body">
            Tap "Customise Split" to change any day's focus to match your schedule and goals.
          </p>
        </div>
      </div>
    </main>
  )
}
