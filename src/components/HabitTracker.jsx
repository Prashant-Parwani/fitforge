import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function getWeekDates() {
  const today   = new Date()
  const dow     = today.getDay()
  const monday  = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export default function HabitTracker() {
  const { user, getWaterToday, getStreak } = useAuth()
  const weekDates = getWeekDates()
  const todayStr  = new Date().toISOString().split('T')[0]

  const workoutsThisWeek = useMemo(() => {
    if (!user?.workoutLog) return 0
    return user.workoutLog.filter(w => weekDates.includes(w.date)).length
  }, [user?.workoutLog, weekDates])

  const waterToday = getWaterToday(user)
  const streak     = getStreak(user)

  // Protein goal met (simplified — check if today's food has protein logged)
  const proteinToday  = user?.todayFoodLog?.date === todayStr
    ? (user.todayFoodLog.protein || 0) : 0
  const proteinTarget = 150
  const proteinPct    = Math.min(100, Math.round((proteinToday / proteinTarget) * 100))

  const habits = [
    {
      label:    'Workouts this week',
      current:  workoutsThisWeek,
      target:   5,
      unit:     'sessions',
      color:    'bg-red-400',
      emoji:    '💪',
      to:       '/log',
      cta:      'Log workout',
    },
    {
      label:    'Water today',
      current:  waterToday,
      target:   8,
      unit:     'glasses',
      color:    'bg-blue-400',
      emoji:    '💧',
      to:       '/',
      cta:      'Track water',
    },
    {
      label:    'Protein today',
      current:  Math.round(proteinPct),
      target:   100,
      unit:     '% of goal',
      color:    'bg-orange-400',
      emoji:    '🥩',
      to:       '/diet',
      cta:      'Log food',
    },
    {
      label:    'Streak',
      current:  streak,
      target:   Math.max(streak + 1, 7),
      unit:     'days',
      color:    'bg-amber-400',
      emoji:    '🔥',
      to:       null,
      cta:      null,
    },
  ]

  return (
    <div className="bg-cream rounded-2xl border border-brown-200 p-5 animate-fade-up">
      <h3 className="font-display text-lg font-semibold text-brown-900 mb-4">Weekly Habits</h3>
      <div className="space-y-4">
        {habits.map(h => {
          const pct  = Math.min(100, h.target > 0 ? Math.round((h.current / h.target) * 100) : 0)
          const done = h.current >= h.target
          return (
            <div key={h.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{h.emoji}</span>
                  <span className={`font-medium ${done ? 'text-green-700' : 'text-brown-700'}`}>{h.label}</span>
                  {done && <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">✓ Done!</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brown-400">{h.current} / {h.target} {h.unit}</span>
                  {h.to && !done && (
                    <Link to={h.to} className="text-xs text-brown-500 hover:text-brown-700 underline">{h.cta}</Link>
                  )}
                </div>
              </div>
              <div className="h-2.5 bg-brown-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-green-400' : h.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Milestone messages */}
      {streak >= 30 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm text-amber-800 text-center">
          🏆 {streak} day streak — you're a legend!
        </div>
      )}
      {streak >= 7 && streak < 30 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-800 text-center">
          🔥 {streak} days strong! Keep it going.
        </div>
      )}
    </div>
  )
}
