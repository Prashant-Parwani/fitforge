import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    emoji: '🏋️',
    title: 'Machine Encyclopedia',
    desc: 'Every gym machine explained with proper form, targeted muscles & video guides.',
    to: '/machines',
    color: 'from-brown-400 to-brown-600',
  },
  {
    emoji: '📅',
    title: '7-Day Workout Plan',
    desc: 'Expert-designed weekly split: Chest, Back, Legs, Arms, Shoulders + Cardio.',
    to: '/workout',
    color: 'from-brown-500 to-brown-700',
  },
  {
    emoji: '🥗',
    title: 'Diet & Nutrition',
    desc: 'Track calories, protein, carbs & fats. Full food database at your fingertips.',
    to: '/diet',
    color: 'from-brown-300 to-brown-500',
  },
  {
    emoji: '📸',
    title: 'AI Food Scanner',
    desc: 'Snap a photo of your meal — our AI identifies it and gives you full macros.',
    to: '/scanner',
    color: 'from-brown-600 to-brown-800',
  },
  {
    emoji: '🤖',
    title: 'AI Diet Planner',
    desc: 'Tell us your goal and body stats. Get a personalized weekly meal plan instantly.',
    to: '/diet',
    color: 'from-brown-400 to-brown-600',
  },
  {
    emoji: '📊',
    title: 'Progress Tracker',
    desc: 'Log workouts, track weight, see your gains visualised with beautiful charts.',
    to: '/progress',
    color: 'from-brown-500 to-brown-700',
  },
]

const stats = [
  { value: '200+', label: 'Exercises' },
  { value: '50+',  label: 'Machines' },
  { value: '500+', label: 'Food Items' },
  { value: '7',    label: 'Day Plan' },
]

const weekPlan = [
  { day: 'Mon', focus: 'Chest',     color: 'bg-brown-500', emoji: '💪' },
  { day: 'Tue', focus: 'Back',      color: 'bg-brown-600', emoji: '🔙' },
  { day: 'Wed', focus: 'Legs',      color: 'bg-brown-400', emoji: '🦵' },
  { day: 'Thu', focus: 'Shoulders', color: 'bg-brown-700', emoji: '🙆' },
  { day: 'Fri', focus: 'Arms',      color: 'bg-brown-500', emoji: '💪' },
  { day: 'Sat', focus: 'Cardio',    color: 'bg-brown-300', emoji: '🏃' },
  { day: 'Sun', focus: 'Rest',      color: 'bg-brown-200', emoji: '😴' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">

        {/* Background circles */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-brown-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-brown-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brown-200/30 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-brown-500/10 border border-brown-300 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-brown-600 uppercase tracking-wider">
              AI-Powered Fitness
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brown-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brown-900 leading-tight mb-6">
            Train Smarter.<br />
            <span className="text-brown-500 italic">Eat Better.</span><br />
            Evolve Daily.
          </h1>

          <p className="animate-fade-up delay-200 text-brown-600 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Your complete gym companion — from machine guides and expert workout splits
            to AI-powered food scanning and personalised diet plans.
          </p>

          <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-4">
            <Link to={user ? '/workout' : '/register'} className="btn-primary text-base px-8 py-3.5">
              {user ? 'View My Plan' : 'Start For Free'} →
            </Link>
            <Link to="/machines" className="btn-outline text-base px-8 py-3.5">
              Explore Machines
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-400 mt-16 flex flex-wrap justify-center gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-brown-700">{s.value}</div>
                <div className="text-sm text-brown-500 font-body mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WEEK PREVIEW ─── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-brown-500 font-medium">Expert Trainer's Pick</span>
            <h2 className="font-display text-4xl font-bold text-brown-900 mt-2">Your 7-Day Split</h2>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekPlan.map((d, i) => (
              <div
                key={d.day}
                className="animate-fade-up card-lift"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`${d.color} rounded-xl p-3 sm:p-4 text-center text-cream`}>
                  <div className="text-xl sm:text-2xl mb-1">{d.emoji}</div>
                  <div className="font-body font-semibold text-xs sm:text-sm">{d.day}</div>
                  <div className="font-body text-xs opacity-80 mt-0.5 hidden sm:block">{d.focus}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/workout" className="btn-primary">
              See Full Workout Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-20 px-6 bg-brown-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-brown-500 font-medium">Everything You Need</span>
            <h2 className="font-display text-4xl font-bold text-brown-900 mt-2">All Features</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link
                key={f.title}
                to={f.to}
                className="animate-fade-up card-lift group bg-cream rounded-2xl p-6 border border-brown-200 block"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {f.emoji}
                </div>
                <h3 className="font-display text-xl font-semibold text-brown-800 mb-2">{f.title}</h3>
                <p className="font-body text-brown-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-brown-500 text-sm font-medium group-hover:text-brown-700 transition-colors">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI CALLOUT ─── */}
      <section className="py-20 px-6 bg-brown-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Powered by Claude AI</span>
          <h2 className="font-display text-4xl font-bold text-cream mt-3 mb-5">
            Point. Shoot. Know Your Macros.
          </h2>
          <p className="text-brown-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of any meal and our AI instantly identifies the food and returns
            complete nutrition data — calories, protein, carbs, fats, and more.
          </p>
          <Link to="/scanner" className="inline-flex items-center gap-2 bg-brown-300 text-brown-900 px-8 py-3.5 rounded-full font-medium hover:bg-brown-200 transition-colors">
            📸 Try Food Scanner
          </Link>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!user && (
        <section className="py-20 px-6 bg-cream text-center">
          <h2 className="font-display text-4xl font-bold text-brown-900 mb-4">
            Ready to Start?
          </h2>
          <p className="text-brown-500 mb-8 text-lg">It's free. No credit card needed.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Create Free Account →
          </Link>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="bg-brown-900 text-brown-400 py-10 px-6 text-center">
        <div className="font-display text-brown-200 text-xl font-semibold mb-2">FitForge</div>
        <p className="text-sm">Train. Eat. Evolve. — Built with 💪 and AI</p>
        <p className="text-xs mt-3 opacity-50">© 2025 FitForge. All rights reserved.</p>
      </footer>

    </main>
  )
}
