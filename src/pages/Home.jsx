import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { emoji: '🏋️', title: 'Machine Encyclopedia', desc: 'Every gym machine with proper form, targeted muscles & how-to videos.', to: '/machines', color: 'from-brown-400 to-brown-600' },
  { emoji: '📅', title: '7-Day Workout Plan', desc: 'Expert-designed weekly split personalised to your goals and schedule.', to: '/workout', color: 'from-brown-500 to-brown-700' },
  { emoji: '🥗', title: 'Diet & Nutrition', desc: 'Track calories, protein, carbs & fats. 100+ foods database.', to: '/diet', color: 'from-brown-300 to-brown-500' },
  { emoji: '📸', title: 'AI Food Scanner', desc: 'Snap any food - AI identifies it and gives you complete macros.', to: '/scanner', color: 'from-brown-600 to-brown-800' },
  { emoji: '📊', title: 'Progress Tracker', desc: 'Log workouts, track weight, sleep, measurements and body fat.', to: '/progress', color: 'from-brown-500 to-brown-700' },
  { emoji: '🤖', title: 'AI Coach', desc: 'Ask anything - nutrition, workouts, recovery. Your personal AI trainer.', to: '/coach', color: 'from-brown-400 to-brown-600' },
]

const weekPlan = [
  { day: 'Mon', focus: 'Chest', color: 'bg-red-500' },
  { day: 'Tue', focus: 'Back', color: 'bg-blue-600' },
  { day: 'Wed', focus: 'Legs', color: 'bg-green-600' },
  { day: 'Thu', focus: 'Shoulders', color: 'bg-purple-600' },
  { day: 'Fri', focus: 'Arms', color: 'bg-orange-500' },
  { day: 'Sat', focus: 'Cardio', color: 'bg-teal-500' },
  { day: 'Sun', focus: 'Rest', color: 'bg-brown-300' },
]

const stats = [
  { value: '100+', label: 'Foods' },
  { value: '36+', label: 'Machines' },
  { value: '7', label: 'Day Plan' },
  { value: 'AI', label: 'Powered' },
]

function Dashboard({ user }) {
  const firstName = user.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const dayOfWeek = new Date().getDay()
  const todayIdx = [6, 0, 1, 2, 3, 4, 5][dayOfWeek]
  const todayPlan = user.customSplit?.[todayIdx]
  const todayStr = new Date().toISOString().split('T')[0]
  const doneToday = user.workoutLog?.some(w => w.date === todayStr)

  const streak = (() => {
    if (!user.workoutLog?.length) return 0
    const days = [...new Set(user.workoutLog.map(w => w.date).filter(Boolean))].sort((a, b) => b.localeCompare(a))
    let current = 0
    let check = todayStr
    const previousDay = (d) => {
      const dt = new Date(d)
      dt.setDate(dt.getDate() - 1)
      return dt.toISOString().split('T')[0]
    }
    for (const day of days) {
      if (day === check || day === previousDay(check)) {
        current += 1
        check = previousDay(check)
      } else break
    }
    return current
  })()

  const quickLinks = [
    { label: 'Log Workout', emoji: '💪', to: '/log', bg: 'bg-brown-500 text-cream' },
    { label: 'Log Food', emoji: '🍽️', to: '/diet', bg: 'bg-cream border border-brown-200 text-brown-700' },
    { label: 'AI Coach', emoji: '🤖', to: '/coach', bg: 'bg-cream border border-brown-200 text-brown-700' },
    { label: 'Progress', emoji: '📊', to: '/progress', bg: 'bg-cream border border-brown-200 text-brown-700' },
    { label: 'Scanner', emoji: '📸', to: '/scanner', bg: 'bg-cream border border-brown-200 text-brown-700' },
    { label: 'Calculator', emoji: '🧮', to: '/calculator', bg: 'bg-cream border border-brown-200 text-brown-700' },
  ]

  const focusColor = (focus) => {
    if (!focus) return 'bg-brown-400'
    if (focus.includes('Chest')) return 'bg-red-500'
    if (focus.includes('Back')) return 'bg-blue-600'
    if (focus.includes('Leg')) return 'bg-green-600'
    if (focus.includes('Shoulder')) return 'bg-purple-600'
    if (focus.includes('Arm') || focus.includes('Bi') || focus.includes('Tri')) return 'bg-orange-500'
    if (focus.includes('Cardio')) return 'bg-teal-500'
    if (focus === 'Rest') return 'bg-brown-300'
    return 'bg-brown-500'
  }

  return (
    <main className="pt-20 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="animate-fade-up pt-2">
          <h1 className="font-display text-2xl font-bold text-brown-900">{greeting}, {firstName} 👋</h1>
          <p className="text-sm text-brown-500 mt-0.5">
            {user.goal || 'No goal set'}
            {user.level && <> - {user.level.split(' ')[0]}</>}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 animate-fade-up">
          {quickLinks.map(link => (
            <Link key={link.label} to={link.to}
              className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center transition-all active:scale-95 card-lift ${link.bg}`}>
              <span className="text-xl">{link.emoji}</span>
              <span className="text-xs font-medium leading-tight">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className={`animate-fade-up rounded-2xl p-5 text-cream flex items-center justify-between ${focusColor(todayPlan?.focus)}`}>
          <div>
            <div className="text-xs opacity-75 uppercase tracking-wider mb-0.5">Today - {todayPlan?.day || 'Plan'}</div>
            <div className="font-display text-2xl font-bold">{todayPlan?.focus || 'Rest Day'}</div>
            <div className="text-xs opacity-70 mt-1">
              {doneToday ? '✓ Workout done!' : todayPlan?.focus === 'Rest' ? 'Active recovery day' : 'Tap to start'}
            </div>
          </div>
          {!doneToday && todayPlan?.focus !== 'Rest' ? (
            <Link to="/log"
              className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl transition-colors">
              ▶
            </Link>
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              {doneToday ? '✓' : '😴'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          {[
            { label: 'Streak', value: streak + ' days', emoji: '🔥' },
            { label: 'Workouts', value: (user.workoutLog?.length || 0) + ' total', emoji: '💪' },
            { label: 'Current Weight', value: user.weightLog?.length ? user.weightLog[user.weightLog.length - 1].value + ' kg' : '- kg', emoji: '⚖️' },
          ].map(stat => (
            <div key={stat.label} className="bg-cream rounded-2xl border border-brown-200 p-3 text-center animate-fade-up">
              <div className="text-xl mb-1">{stat.emoji}</div>
              <div className="font-display text-lg font-bold text-brown-800">{stat.value}</div>
              <div className="text-xs text-brown-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {user.customSplit && (
          <div className="animate-fade-up bg-cream rounded-2xl border border-brown-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-brown-900">This Week</h3>
              <Link to="/workout" className="text-xs text-brown-500 hover:text-brown-700">Edit →</Link>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {user.customSplit.map((day, i) => (
                <div key={day.day} className={`rounded-xl p-1.5 text-center text-cream ${focusColor(day.focus)} ${i === todayIdx ? 'ring-2 ring-brown-800' : 'opacity-80'}`}>
                  <div className="text-xs font-bold">{day.short || day.day?.slice(0, 3)}</div>
                  <div className="text-xs opacity-80 leading-tight mt-0.5" style={{ fontSize: '9px' }}>{(day.focus || '').split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.targetWeight && user.weightLog?.length > 0 && (() => {
          const current = user.weightLog[user.weightLog.length - 1].value
          const start = parseFloat(user.weight) || current
          const target = parseFloat(user.targetWeight)
          const pct = Math.min(100, Math.round((Math.abs(current - start) / Math.abs(target - start || 1)) * 100))
          return (
            <div className="animate-fade-up bg-cream rounded-2xl border border-brown-200 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-brown-700">Target Weight Progress</span>
                <span className="text-brown-500">{current} → {target} kg</span>
              </div>
              <div className="h-3 bg-brown-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${target < start ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-brown-400 mt-1">{pct}% of the way there</div>
            </div>
          )
        })()}

        <Link to="/coach" className="animate-fade-up block bg-brown-800 rounded-2xl p-5 text-cream hover:bg-brown-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brown-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
            <div className="flex-1">
              <div className="font-display font-semibold">Ask your AI Coach</div>
              <div className="text-xs text-brown-300 mt-0.5">What should I eat after leg day? How much protein do eggs have?</div>
            </div>
            <span className="text-brown-400 text-xl">→</span>
          </div>
        </Link>
      </div>
    </main>
  )
}

function GuestHome() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-brown-100">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-brown-500/10 border border-brown-300 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-brown-600 uppercase tracking-wider">AI-Powered Fitness</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brown-400 animate-pulse" />
          </div>

          <h1 className="animate-fade-up delay-100 font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brown-900 leading-tight mb-6">
            Train Smarter.<br />
            <span className="text-brown-500 italic">Eat Better.</span><br />
            Evolve Daily.
          </h1>

          <p className="animate-fade-up delay-200 text-brown-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Your complete gym companion - machine guides, expert workout plans, AI food scanner, diet tracking and a personal AI coach that answers anything.
          </p>

          <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">Start For Free →</Link>
            <Link to="/machines" className="btn-outline text-base px-8 py-3.5">Explore Machines</Link>
          </div>

          <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-brown-700">{stat.value}</div>
                <div className="text-sm text-brown-500 font-body mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-brown-500 font-medium">Expert Trainer's Split</span>
            <h2 className="font-display text-4xl font-bold text-brown-900 mt-2">Your 7-Day Plan</h2>
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-8">
            {weekPlan.map(day => (
              <div key={day.day} className={`${day.color} rounded-xl p-3 sm:p-4 text-center text-cream`}>
                <div className="font-body font-semibold text-xs sm:text-sm">{day.day}</div>
                <div className="font-body text-xs opacity-80 mt-0.5 hidden sm:block">{day.focus}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/register" className="btn-primary">Get My Personalised Plan →</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brown-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-brown-500 font-medium">Everything You Need</span>
            <h2 className="font-display text-4xl font-bold text-brown-900 mt-2">All Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link key={feature.title} to={feature.to}
                className="animate-fade-up card-lift group bg-cream rounded-2xl p-6 border border-brown-200 block"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.emoji}
                </div>
                <h3 className="font-display text-xl font-semibold text-brown-800 mb-2">{feature.title}</h3>
                <p className="font-body text-brown-500 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-4 text-brown-500 text-sm font-medium group-hover:text-brown-700 transition-colors">Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brown-800 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Always Available</span>
          <h2 className="font-display text-4xl font-bold text-cream mt-3 mb-5">
            Your Personal AI Coach
          </h2>
          <p className="text-brown-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Ask anything - how much protein in 4 eggs, which exercises for chest day, what to eat after a workout. Your AI coach knows your profile and answers instantly.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-brown-300 text-brown-900 px-8 py-3.5 rounded-full font-medium hover:bg-brown-200 transition-colors">
            🤖 Try AI Coach Free
          </Link>
        </div>
      </section>

      <footer className="bg-brown-900 text-brown-400 py-10 px-6 text-center">
        <div className="font-display text-brown-200 text-xl font-semibold mb-2">FitForge</div>
        <p className="text-sm">Train. Eat. Evolve. - Built with AI</p>
        <p className="text-xs mt-3 opacity-50">© 2025 FitForge. All rights reserved.</p>
      </footer>
    </main>
  )
}

export default function Home() {
  const { user } = useAuth()
  return user ? <Dashboard user={user} /> : <GuestHome />
}
