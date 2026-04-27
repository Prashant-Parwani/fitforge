import { Link } from 'react-router-dom'
import HabitTracker from '../components/HabitTracker'
import { useAuth } from '../context/AuthContext'
import { dietPlans } from '../data/foodDatabase'

// ── Calorie ring ────────────────────────────────────────────────────────
function CalorieRing({ eaten, target }) {
  const pct  = target > 0 ? Math.min(1, eaten / target) : 0
  const circ = 2 * Math.PI * 42
  const dash = pct * circ
  const col  = pct > 1 ? '#e24b4a' : pct > 0.85 ? '#EF9F27' : '#8b5e3c'
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f5ebe0" strokeWidth="8"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke={col} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-2xl font-bold text-brown-800">{eaten}</div>
        <div className="text-xs text-brown-400">of {target}</div>
        <div className="text-xs text-brown-500 font-medium">kcal</div>
      </div>
    </div>
  )
}

// ── Macro bar ───────────────────────────────────────────────────────────
function MacroBar({ label, value, target, color }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-brown-600 font-medium">{label}</span>
        <span className="text-brown-400">{value}g / {target}g</span>
      </div>
      <div className="h-2 bg-brown-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  )
}

// ── Water tracker ───────────────────────────────────────────────────────
function WaterTracker({ count, onAdd, onRemove }) {
  const total = 8
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-brown-700">Water</span>
        <span className="text-xs text-brown-400">{count} / {total} glasses</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i}
            onClick={() => i < count ? onRemove() : onAdd()}
            className={`w-8 h-8 rounded-lg border transition-all duration-200 text-sm ${
              i < count
                ? 'bg-blue-400 border-blue-400 text-white'
                : 'bg-brown-50 border-brown-200 text-brown-300 hover:border-blue-300'
            }`}
          >
            {i < count ? '💧' : '○'}
          </button>
        ))}
      </div>
      <div className="text-xs text-brown-400 mt-1.5">
        {count >= 8 ? '🎉 Daily goal reached!' : `${8 - count} more to reach your goal`}
      </div>
    </div>
  )
}

// ── Streak flame ────────────────────────────────────────────────────────
function StreakBadge({ streak }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`text-3xl ${streak > 0 ? 'animate-pulse' : 'grayscale opacity-40'}`}>🔥</div>
      <div>
        <div className="font-display text-2xl font-bold text-brown-800 leading-none">{streak}</div>
        <div className="text-xs text-brown-400">day streak</div>
      </div>
    </div>
  )
}

// ── Today's workout card ────────────────────────────────────────────────
function TodayWorkoutCard({ user }) {
  const dayOfWeek = new Date().getDay()
  const dayMap    = [6, 0, 1, 2, 3, 4, 5]
  const todayIdx  = dayMap[dayOfWeek]
  const split     = user?.customSplit
  const todayPlan = split?.[todayIdx]

  const todayStr  = new Date().toISOString().split('T')[0]
  const doneToday = user?.workoutLog?.some(w => w.date === todayStr)

  const colorMap = {
    'bg-red-500': 'bg-red-500', 'bg-blue-600': 'bg-blue-600',
    'bg-green-600': 'bg-green-600', 'bg-purple-600': 'bg-purple-600',
    'bg-orange-500': 'bg-orange-500', 'bg-teal-500': 'bg-teal-500',
    'bg-brown-300': 'bg-brown-300', 'bg-brown-600': 'bg-brown-600',
    'bg-yellow-500': 'bg-yellow-500',
  }

  return (
    <div className={`rounded-2xl p-4 text-cream flex items-center justify-between ${
      todayPlan?.color ? (colorMap[todayPlan.color] || 'bg-brown-500') : 'bg-brown-500'
    }`}>
      <div>
        <div className="text-xs opacity-80 uppercase tracking-wider mb-0.5">Today</div>
        <div className="font-display text-lg font-semibold">{todayPlan?.focus || 'Rest Day'}</div>
        <div className="text-xs opacity-70 mt-0.5">{todayPlan?.day}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        {doneToday ? (
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">✓</div>
        ) : (
          <Link to="/log" className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl transition-colors">
            ▶
          </Link>
        )}
        <div className="text-xs opacity-70">{doneToday ? 'Done!' : 'Start'}</div>
      </div>
    </div>
  )
}

// ── Quick action buttons ────────────────────────────────────────────────
const quickActions = [
  { label: 'Log Workout', emoji: '💪', to: '/log',      color: 'bg-brown-500 text-cream' },
  { label: 'Log Food',    emoji: '🍽️', to: '/diet',     color: 'bg-cream border border-brown-200 text-brown-700' },
  { label: 'AI Scanner',  emoji: '📸', to: '/scanner',  color: 'bg-cream border border-brown-200 text-brown-700' },
  { label: 'Calculator',  emoji: '🧮', to: '/calculator', color: 'bg-cream border border-brown-200 text-brown-700' },
]

// ── Features for non-logged-in users ───────────────────────────────────
const features = [
  { emoji: '🏋️', title: 'Machine Encyclopedia', desc: 'Every gym machine with form, muscle targets & how-to videos.', to: '/machines', color: 'from-brown-400 to-brown-600' },
  { emoji: '📅', title: '7-Day Workout Plan',  desc: 'Expert-designed weekly split personalised to your goals.',        to: '/workout',  color: 'from-brown-500 to-brown-700' },
  { emoji: '🥗', title: 'Diet & Nutrition',    desc: 'Track calories, protein, carbs & fats. 100+ foods database.',     to: '/diet',     color: 'from-brown-300 to-brown-500' },
  { emoji: '📸', title: 'AI Food Scanner',     desc: 'Snap any food — OpenRouter AI identifies it with full macros.',   to: '/scanner',  color: 'from-brown-600 to-brown-800' },
  { emoji: '📊', title: 'Progress Dashboard',  desc: 'Log workouts, track weight, see your gains over time.',           to: '/progress', color: 'from-brown-500 to-brown-700' },
  { emoji: '🧮', title: 'Fitness Calculator', desc: 'Calculate BMR, TDEE, calories and macros for your goal.',         to: '/calculator', color: 'from-brown-400 to-brown-600' },
]

// ── Main export ─────────────────────────────────────────────────────────
export default function Home() {
  const { user, getWaterToday, addWater, removeWater, getStreak } = useAuth()

  if (!user) return <GuestHome />

  const waterCount = getWaterToday(user)
  const streak     = getStreak(user)
  const plan       = dietPlans[user.goal] || dietPlans['Stay Fit']
  const todayStr   = new Date().toISOString().split('T')[0]

  // Today's food log totals (pulled from user.todayFoodLog if available)
  const todayFood  = user.todayFoodLog || { calories: 0, protein: 0, carbs: 0, fat: 0, date: '' }
  const foodTotals = todayFood.date === todayStr ? todayFood : { calories: 0, protein: 0, carbs: 0, fat: 0 }

  const firstName = user.name?.split(' ')[0] || 'there'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <main className="pt-20 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">

        {/* ── Greeting ── */}
        <div className="animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-brown-900">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-brown-500 mt-0.5">
            Goal: <span className="font-medium text-brown-700">{user.goal || 'Not set'}</span>
            {user.level && <span> · {user.level.split(' ')[0]}</span>}
          </p>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-4 gap-2 animate-fade-up">
          {quickActions.map(a => (
            <Link key={a.label} to={a.to}
              className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center transition-all active:scale-95 ${a.color}`}>
              <span className="text-xl">{a.emoji}</span>
              <span className="text-xs font-medium leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ── Today's workout ── */}
        <div className="animate-fade-up">
          <TodayWorkoutCard user={user} />
        </div>

        {/* ── Calorie + macros card ── */}
        <div className="animate-fade-up bg-cream rounded-2xl border border-brown-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-brown-900">Today's Nutrition</h2>
            <Link to="/diet" className="text-xs text-brown-500 hover:text-brown-700">+ Log Food</Link>
          </div>
          <div className="flex gap-6 items-center">
            <CalorieRing eaten={foodTotals.calories} target={plan.calories} />
            <div className="flex-1 space-y-3">
              <MacroBar label="Protein" value={foodTotals.protein} target={plan.protein} color="bg-red-400" />
              <MacroBar label="Carbs"   value={foodTotals.carbs}   target={plan.carbs}   color="bg-yellow-400" />
              <MacroBar label="Fat"     value={foodTotals.fat}     target={plan.fat}     color="bg-blue-400" />
            </div>
          </div>
          {foodTotals.calories === 0 && (
            <p className="text-xs text-brown-400 text-center mt-3 italic">
              No food logged today — head to Diet to start tracking.
            </p>
          )}
        </div>

        {/* ── Streak + Water row ── */}
        <div className="grid grid-cols-2 gap-4 animate-fade-up">
          {/* Streak */}
          <div className="bg-cream rounded-2xl border border-brown-200 p-4">
            <div className="text-xs font-medium text-brown-500 uppercase tracking-wider mb-3">Workout Streak</div>
            <StreakBadge streak={streak} />
            {streak === 0 && (
              <p className="text-xs text-brown-400 mt-2">Log a workout to start your streak!</p>
            )}
            {streak >= 7 && (
              <div className="mt-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                🏆 {streak >= 30 ? 'Legend!' : streak >= 14 ? 'On fire!' : 'One week strong!'}
              </div>
            )}
          </div>

          {/* Water */}
          <div className="bg-cream rounded-2xl border border-brown-200 p-4">
            <div className="text-xs font-medium text-brown-500 uppercase tracking-wider mb-3">Hydration</div>
            <WaterTracker count={waterCount} onAdd={addWater} onRemove={removeWater} />
          </div>
        </div>

        {/* ── This week's activity ── */}
        <WeekCalendar user={user} />

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          {[
            { label: 'Workouts', value: user.workoutLog?.length || 0, unit: 'total' },
            { label: 'Weight',   value: user.weightLog?.length ? user.weightLog[user.weightLog.length - 1].value + ' kg' : '—', unit: 'current' },
            { label: 'Target',   value: user.targetWeight ? user.targetWeight + ' kg' : '—', unit: 'goal weight' },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl border border-brown-200 p-3 text-center">
              <div className="font-display text-xl font-bold text-brown-800">{s.value}</div>
              <div className="text-xs text-brown-400 mt-0.5">{s.unit}</div>
              <div className="text-xs font-medium text-brown-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Habits ── */}
        <HabitTracker />

      </div>
    </main>
  )
}

// ── Week calendar strip ─────────────────────────────────────────────────
function WeekCalendar({ user }) {
  const days    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const today   = new Date()
  const todayDow = today.getDay()
  const monday  = new Date(today)
  monday.setDate(today.getDate() - ((todayDow + 6) % 7))

  const week = days.map((d, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    const hasWorkout = user?.workoutLog?.some(w => w.date === dateStr)
    const isToday    = dateStr === today.toISOString().split('T')[0]
    const isFuture   = date > today
    return { d, dateStr, hasWorkout, isToday, isFuture, num: date.getDate() }
  })

  return (
    <div className="animate-fade-up bg-cream rounded-2xl border border-brown-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-semibold text-brown-900">This Week</h3>
        <Link to="/progress" className="text-xs text-brown-500 hover:text-brown-700">View All →</Link>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {week.map(({ d, hasWorkout, isToday, isFuture, num }) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <span className="text-xs text-brown-400">{d}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              hasWorkout ? 'bg-brown-500 text-cream' :
              isToday ? 'border-2 border-brown-400 text-brown-600' :
              isFuture ? 'text-brown-200' : 'text-brown-300'
            }`}>
              {hasWorkout ? '✓' : num}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Guest / logged-out home ─────────────────────────────────────────────
function GuestHome() {
  const stats = [
    { value: '10+',  label: 'Features' },
    { value: '100+', label: 'Foods' },
    { value: '36+',  label: 'Machines' },
    { value: 'AI',   label: 'Powered' },
  ]
  const weekPlan = [
    { day: 'Mon', focus: 'Chest',     color: 'bg-red-500' },
    { day: 'Tue', focus: 'Back',      color: 'bg-blue-600' },
    { day: 'Wed', focus: 'Legs',      color: 'bg-green-600' },
    { day: 'Thu', focus: 'Shoulders', color: 'bg-purple-600' },
    { day: 'Fri', focus: 'Arms',      color: 'bg-orange-500' },
    { day: 'Sat', focus: 'Cardio',    color: 'bg-teal-500' },
    { day: 'Sun', focus: 'Rest',      color: 'bg-brown-300' },
  ]

  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brown-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-brown-400/15 rounded-full blur-3xl pointer-events-none" />
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
            Your complete gym companion — machines, workout plans, AI food scanner, diet tracking and a personal AI coach.
          </p>
          <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">Start For Free →</Link>
            <Link to="/machines" className="btn-outline text-base px-8 py-3.5">Explore Machines</Link>
          </div>
          <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-brown-700">{s.value}</div>
                <div className="text-sm text-brown-500 font-body mt-1">{s.label}</div>
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
            {weekPlan.map(d => (
              <div key={d.day} className={`${d.color} rounded-xl p-3 text-center text-cream`}>
                <div className="font-body font-semibold text-xs sm:text-sm">{d.day}</div>
                <div className="font-body text-xs opacity-80 mt-0.5 hidden sm:block">{d.focus}</div>
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
            <h2 className="font-display text-4xl font-bold text-brown-900">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={f.title} to={f.to}
                className="animate-fade-up card-lift group bg-cream rounded-2xl p-6 border border-brown-200 block"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {f.emoji}
                </div>
                <h3 className="font-display text-xl font-semibold text-brown-800 mb-2">{f.title}</h3>
                <p className="font-body text-brown-500 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-brown-800 text-center">
        <h2 className="font-display text-4xl font-bold text-cream mb-5">Point. Shoot. Know Your Macros.</h2>
        <p className="text-brown-300 text-lg mb-8 max-w-2xl mx-auto">Snap any food — our OpenRouter AI identifies it and gives you complete nutrition data instantly.</p>
        <Link to="/scanner" className="inline-flex items-center gap-2 bg-brown-300 text-brown-900 px-8 py-3.5 rounded-full font-medium hover:bg-brown-200 transition-colors">
          📸 Try Food Scanner
        </Link>
      </section>

      <footer className="bg-brown-900 text-brown-400 py-10 px-6 text-center">
        <div className="font-display text-brown-200 text-xl font-semibold mb-2">FitForge</div>
        <p className="text-sm">Train. Eat. Evolve. — Built with 💪 and AI</p>
        <p className="text-xs mt-3 opacity-50">© 2025 FitForge. All rights reserved.</p>
      </footer>
    </main>
  )
}
