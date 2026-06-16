import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiActivity, FiArrowRight, FiBarChart2, FiCamera, FiClock, FiCpu, FiPlay, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi'

const focusColor = (focus) => {
  if (!focus) return 'from-brown-500 to-brown-700'
  if (focus === 'Rest') return 'from-amber-500 to-orange-500'
  if (focus.includes('Chest')) return 'from-rose-400 to-rose-600'
  if (focus.includes('Back')) return 'from-blue-600 to-indigo-700'
  if (focus.includes('Leg') || focus.includes('Glutes') || focus.includes('Hamstrings')) return 'from-green-600 to-emerald-700'
  if (focus.includes('Shoulder') || focus.includes('Trap')) return 'from-purple-600 to-violet-700'
  if (focus.includes('Arm') || focus.includes('Bicep') || focus.includes('Tricep')) return 'from-orange-500 to-rose-500'
  if (focus.includes('Cardio') || focus.includes('Mobility')) return 'from-teal-500 to-cyan-600'
  if (focus.includes('Core')) return 'from-yellow-500 to-amber-600'
  return 'from-brown-500 to-brown-700'
}

// Use a minimal neutral tile look and render a small accent dot for focus
const tileColor = () => 'bg-cream text-brown-900 border border-brown-200'

const accentColor = (focus) => {
  if (!focus) return 'bg-brown-400'
  if (focus === 'Rest') return 'bg-amber-500'
  if (focus.includes('Chest')) return 'bg-rose-500'
  if (focus.includes('Back')) return 'bg-blue-600'
  if (focus.includes('Leg') || focus.includes('Glutes') || focus.includes('Hamstrings')) return 'bg-green-600'
  if (focus.includes('Shoulder') || focus.includes('Trap')) return 'bg-purple-600'
  if (focus.includes('Arm') || focus.includes('Bicep') || focus.includes('Tricep')) return 'bg-orange-500'
  if (focus.includes('Cardio') || focus.includes('Mobility')) return 'bg-teal-500'
  if (focus.includes('Core')) return 'bg-yellow-500'
  return 'bg-brown-500'
}

function previousDay(dateStr) {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

function getStreak(workoutLog = [], todayStr) {
  if (!workoutLog.length) return 0
  const days = [...new Set(workoutLog.map(w => w.date).filter(Boolean))].sort((a, b) => b.localeCompare(a))
  let streak = 0
  let check = todayStr
  for (const day of days) {
    if (day === check || day === previousDay(check)) {
      streak += 1
      check = previousDay(check)
    } else break
  }
  return streak
}

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todayStr = new Date().toISOString().split('T')[0]
  const todayIdx = [6, 0, 1, 2, 3, 4, 5][new Date().getDay()]
  const todayPlan = user?.customSplit?.[todayIdx]
  const doneToday = user?.workoutLog?.some(w => w.date === todayStr)
  const latestWeight = user?.weightLog?.length ? user.weightLog[user.weightLog.length - 1].value : null
  const streak = getStreak(user?.workoutLog || [], todayStr)
  const recentWorkouts = (user?.workoutLog || []).slice(0, 4)

  const quickLinks = [
    { label: 'Log Workout', to: '/log', icon: FiZap, accent: 'bg-brown-800 text-cream border-brown-800' },
    { label: 'AI Coach', to: '/coach', icon: FiCpu, accent: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Scanner', to: '/scanner', icon: FiCamera, accent: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: 'Progress', to: '/progress', icon: FiBarChart2, accent: 'bg-sky-50 text-sky-700 border-sky-100' },
  ]

  const targetProgress = (() => {
    if (!user?.targetWeight || !latestWeight) return null
    const start = parseFloat(user.weight) || latestWeight
    const target = parseFloat(user.targetWeight)
    const total = Math.abs(target - start) || 1
    const done = Math.abs(latestWeight - start)
    return {
      current: latestWeight,
      target,
      percent: Math.min(100, Math.round((done / total) * 100)),
      losing: target < start,
    }
  })()

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brown-500 font-semibold">Your command center</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-brown-950 mt-2">
              {greeting}, {firstName}
            </h1>
            <p className="text-brown-600 mt-2">
              {user?.goal || 'No goal set'}
              {user?.level && <> - {user.level.split(' ')[0]}</>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/workout" className="btn-outline text-sm px-4 py-2.5">Tune Split</Link>
            <Link to="/log" className="btn-primary text-sm px-4 py-2.5 inline-flex items-center gap-2">
              Start Session <FiArrowRight />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          <div className="space-y-6">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${focusColor(todayPlan?.focus)} p-6 sm:p-8 text-cream shadow-xl`}>
              <div className="absolute inset-y-0 right-0 w-1/2 bg-white/10 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70 mb-2">Today - {todayPlan?.day || 'Plan'}</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold">{todayPlan?.focus || 'Rest Day'}</h2>
                  <p className="text-white/75 mt-2 max-w-xl">
                    {doneToday
                      ? 'Workout already logged. Nice work.'
                      : todayPlan?.focus === 'Rest'
                        ? 'Active recovery day. Keep it light, mobile, and hydrated.'
                        : 'Open the logger, pick today-focused exercises, and track every working set.'}
                  </p>
                </div>
                <Link to={todayPlan?.focus === 'Rest' ? '/progress' : '/log'}
                  className="w-20 h-20 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-3xl transition-colors flex-shrink-0">
                  {doneToday ? <FiActivity /> : <FiPlay />}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.label} to={item.to}
                    className={`rounded-2xl border p-4 min-h-[112px] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md ${item.accent}`}>
                    <Icon className="text-2xl" />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { label: 'Current streak', value: `${streak} days`, icon: FiTrendingUp, tone: 'text-orange-600 bg-orange-50' },
                { label: 'Workouts logged', value: `${user?.workoutLog?.length || 0} total`, icon: FiActivity, tone: 'text-purple-600 bg-purple-50' },
                { label: 'Current weight', value: latestWeight ? `${latestWeight} kg` : '- kg', icon: FiTarget, tone: 'text-emerald-700 bg-emerald-50' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-cream rounded-2xl border border-brown-200 p-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${stat.tone}`}>
                      <Icon className="text-xl" />
                    </div>
                    <div className="font-display text-3xl font-bold text-brown-950">{stat.value}</div>
                    <div className="text-sm text-brown-500 mt-1">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {user?.customSplit && (
              <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-brown-950">This Week</h3>
                    <p className="text-sm text-brown-500">Your personalized split at a glance.</p>
                  </div>
                  <Link to="/workout" className="text-sm text-brown-600 hover:text-brown-900">Edit</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {user.customSplit.map((day, index) => (
                    <button key={day.day}
                      className={`${tileColor()} ${index === todayIdx ? 'ring-2 ring-brown-900 ring-offset-2 ring-offset-cream' : ''} rounded-xl p-3 text-left min-h-[84px]`}> 
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-brown-800 opacity-90">{day.short || day.day?.slice(0, 3)}</div>
                        <div className={`w-3 h-3 rounded-full ${accentColor(day.focus)} shrink-0`} />
                      </div>
                      <div className="font-semibold text-sm mt-3 leading-tight text-brown-900">{day.focus}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <Link to="/coach" className="block rounded-2xl overflow-hidden bg-cream text-brown-900 border border-brown-200 shadow-sm hover:shadow-md transition-all">
              <div className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-brown-50 text-brown-700 flex items-center justify-center mb-5">
                  <FiCpu className="text-2xl" />
                </div>
                <p className="text-xs uppercase tracking-widest text-brown-500 mb-2">FitForge AI</p>
                <h3 className="font-display text-2xl font-bold text-brown-900">Ask your AI Coach</h3>
                <p className="text-brown-600 text-sm mt-3 leading-relaxed">
                  Get profile-aware answers about meals, macros, workout form, recovery, and supplements.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-brown-700">
                  Open coach <FiArrowRight />
                </div>
              </div>
            </Link>

            {targetProgress && (
              <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-brown-950">Target Weight</h3>
                    <p className="text-sm text-brown-500">{targetProgress.current} to {targetProgress.target} kg</p>
                  </div>
                  <span className={`text-sm font-bold ${targetProgress.losing ? 'text-green-600' : 'text-blue-600'}`}>
                    {targetProgress.percent}%
                  </span>
                </div>
                <div className="h-3 bg-brown-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${targetProgress.losing ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${targetProgress.percent}%` }} />
                </div>
              </div>
            )}

            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-brown-950">Recent Sessions</h3>
                <Link to="/history" className="text-sm text-brown-500 hover:text-brown-900">View all</Link>
              </div>
              {recentWorkouts.length ? (
                <div className="space-y-3">
                  {recentWorkouts.map(workout => (
                    <div key={workout.id} className="flex items-center gap-3 rounded-xl bg-brown-50 border border-brown-100 p-3">
                      <div className="w-10 h-10 rounded-xl bg-brown-700 text-cream flex items-center justify-center text-sm font-bold">
                        {(workout.focus || '?')[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-brown-900 truncate">{workout.focus}</div>
                        <div className="text-xs text-brown-500">{workout.date} - {workout.sets} sets</div>
                      </div>
                      <FiClock className="text-brown-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-brown-500 bg-brown-50 rounded-xl p-4">
                  No sessions yet. Log your first workout and this panel will start filling up.
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
