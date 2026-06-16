import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const GOALS    = ['Lose Weight', 'Build Muscle', 'Bulk (Muscle + Weight Gain)', 'Stay Fit']
const LEVELS   = ['Beginner (< 6 months)', 'Intermediate (6m – 2yr)', 'Advanced (2yr+)']
const DIETS    = ['No Preference', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb', 'Keto']

const WORKOUT_PATTERNS = [
  { id: 'ppl',             name: 'Push / Pull / Legs',       desc: '6-day split' },
  { id: 'bro',             name: 'Classic Bro Split',         desc: '5-day, one muscle/day' },
  { id: 'upper_lower',     name: 'Upper / Lower',             desc: '4-day split' },
  { id: 'chest_tri',       name: 'Chest+Tri / Back+Bi',       desc: 'Most popular pairing' },
  { id: 'fullbody',        name: 'Full Body (3x/week)',        desc: 'Best for beginners' },
  { id: 'custom',          name: 'Custom',                    desc: 'My own split' },
]

// Section tabs inside the drawer
const SECTIONS = [
  { id: 'stats',    label: 'My Stats',    icon: '📏' },
  { id: 'goal',     label: 'Goal',        icon: '🎯' },
  { id: 'diet',     label: 'Diet',        icon: '🥗' },
  { id: 'workout',  label: 'Workout',     icon: '💪' },
  { id: 'account',  label: 'Account',     icon: '👤' },
]

export default function ProfileDrawer({ open, onClose }) {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('stats')
  const [saved, setSaved]     = useState(false)

  // Local editable state — mirrors user profile
  const [form, setForm] = useState({
    name:         '',
    age:          '',
    weight:       '',
    targetWeight: '',
    height:       '',
    goal:         '',
    level:        '',
    diet:         'No Preference',
    daysPerWeek:  '5 days/week',
  })

  // Sync from user whenever drawer opens
  useEffect(() => {
    if (open && user) {
      setForm({
        name:         user.name         || '',
        age:          user.age          || '',
        weight:       user.weight       || '',
        targetWeight: user.targetWeight || '',
        height:       user.height       || '',
        goal:         user.goal         || '',
        level:        user.level        || '',
        diet:         user.diet         || 'No Preference',
        daysPerWeek:  user.daysPerWeek  || '5 days/week',
      })
      setSaved(false)
    }
  }, [open, user])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const save = () => {
    // If weight changed, add a new weight log entry
    const newWeight = parseFloat(form.weight)
    const oldWeight = parseFloat(user?.weight)
    let weightLog = user?.weightLog || []
    if (newWeight && newWeight !== oldWeight) {
      const label = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      weightLog = [...weightLog, { label, value: newWeight, date: new Date().toISOString().split('T')[0] }]
    }

    updateUser({ ...form, weightLog })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const resetProgress = () => {
    if (!window.confirm('Reset all workout and weight logs? This cannot be undone.')) return
    const startWeight = parseFloat(form.weight)
    updateUser({
      workoutLog: [],
      weightLog: startWeight
        ? [{ label: 'Reset', value: startWeight, date: new Date().toISOString().split('T')[0] }]
        : [],
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const goToOnboarding = () => {
    onClose()
    navigate('/onboarding')
  }

  if (!user) return null

  // BMI calculation
  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null
  const bmiLabel = !bmi ? '' : bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = !bmi ? '' : bmi < 18.5 ? 'text-blue-600' : bmi < 25 ? 'text-green-600' : bmi < 30 ? 'text-yellow-600' : 'text-rose-600'

  const weightDiff = form.weight && form.targetWeight
    ? (parseFloat(form.targetWeight) - parseFloat(form.weight)).toFixed(1)
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-brown-900/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[70] bg-cream shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-brown-800 text-cream flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brown-500 rounded-full flex items-center justify-center font-display font-bold text-sm">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="font-display font-semibold text-base leading-tight">{user.name || 'My Profile'}</div>
              <div className="text-xs text-brown-300">{user.goal || 'No goal set'}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-brown-700 flex items-center justify-center transition-colors text-brown-300 hover:text-cream text-lg">
            ✕
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-brown-200 bg-brown-50 flex-shrink-0 overflow-x-auto">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-xs font-medium flex-1 min-w-0 transition-all border-b-2 whitespace-nowrap ${
                section === s.id
                  ? 'border-brown-500 text-brown-800 bg-cream'
                  : 'border-transparent text-brown-500 hover:text-brown-700'
              }`}>
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* ── STATS ── */}
          {section === 'stats' && (
            <>
              {/* Quick stats overview */}
              {bmi && (
                <div className="bg-brown-50 rounded-2xl p-4 border border-brown-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-display font-bold text-brown-800">{form.weight || '—'}</div>
                      <div className="text-xs text-brown-400">kg current</div>
                    </div>
                    <div>
                      <div className={`text-xl font-display font-bold ${bmiColor}`}>{bmi}</div>
                      <div className={`text-xs ${bmiColor}`}>BMI · {bmiLabel}</div>
                    </div>
                    <div>
                      <div className="text-xl font-display font-bold text-brown-800">{form.targetWeight || '—'}</div>
                      <div className="text-xs text-brown-400">kg target</div>
                    </div>
                  </div>
                  {weightDiff !== null && (
                    <div className="mt-3 pt-3 border-t border-brown-200 text-center text-xs text-brown-500">
                      {parseFloat(weightDiff) < 0
                        ? `Need to lose ${Math.abs(weightDiff)} kg`
                        : parseFloat(weightDiff) > 0
                          ? `Need to gain ${weightDiff} kg`
                          : '🎉 At target weight!'}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'age',          label: 'Age',               placeholder: '25', suffix: 'yrs' },
                  { key: 'height',       label: 'Height',            placeholder: '175', suffix: 'cm' },
                  { key: 'weight',       label: 'Current Weight',    placeholder: '70', suffix: 'kg' },
                  { key: 'targetWeight', label: 'Target Weight',     placeholder: '65', suffix: 'kg' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-brown-600 mb-1">{f.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 pr-10 rounded-xl border border-brown-200 bg-white text-brown-800 text-sm focus:outline-none focus:border-brown-400 focus:ring-2 focus:ring-brown-100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brown-400">{f.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-brown-600 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-800 text-sm focus:outline-none focus:border-brown-400"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-medium mb-1">⚡ Correcting a mistake?</p>
                <p className="text-xs text-amber-600">Update your weight or height above and tap Save. Your new current weight will also be added to your progress log automatically.</p>
              </div>
            </>
          )}

          {/* ── GOAL ── */}
          {section === 'goal' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Main Goal</label>
                <div className="flex flex-col gap-2">
                  {GOALS.map(g => (
                    <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                        form.goal === g
                          ? 'bg-brown-500 border-brown-500 text-cream'
                          : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-brown-50'
                      }`}>
                      {g === 'Lose Weight'                  && '🔥 '}
                      {g === 'Build Muscle'                  && '💪 '}
                      {g === 'Bulk (Muscle + Weight Gain)'   && '📈 '}
                      {g === 'Stay Fit'                      && '⚡ '}
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Experience Level</label>
                <div className="flex flex-col gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setForm({ ...form, level: l })}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                        form.level === l
                          ? 'bg-brown-500 border-brown-500 text-cream'
                          : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-brown-50'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact preview */}
              {form.goal && (
                <div className="bg-brown-50 rounded-xl p-4 border border-brown-200">
                  <p className="text-xs font-semibold text-brown-600 uppercase tracking-wider mb-2">What changes when you save:</p>
                  <ul className="text-xs text-brown-600 space-y-1">
                    <li>✓ Diet plan calories & macros update</li>
                    <li>✓ Diet tracker targets update</li>
                    <li>✓ Home page goal badge updates</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ── DIET ── */}
          {section === 'diet' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Dietary Preference</label>
                <div className="flex flex-wrap gap-2">
                  {DIETS.map(d => (
                    <button key={d} type="button" onClick={() => setForm({ ...form, diet: d })}
                      className={`py-2 px-3 rounded-full border text-sm font-medium transition-all ${
                        form.diet === d
                          ? 'bg-brown-500 border-brown-500 text-cream'
                          : 'border-brown-200 text-brown-600 hover:border-brown-400'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Training Days per Week</label>
                <div className="flex flex-wrap gap-2">
                  {['3 days/week', '4 days/week', '5 days/week', '6 days/week', '7 days/week'].map(d => (
                    <button key={d} type="button" onClick={() => setForm({ ...form, daysPerWeek: d })}
                      className={`py-2 px-3 rounded-full border text-sm font-medium transition-all ${
                        form.daysPerWeek === d
                          ? 'bg-brown-500 border-brown-500 text-cream'
                          : 'border-brown-200 text-brown-600 hover:border-brown-400'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet tip based on goal */}
              <div className="bg-brown-800 rounded-xl p-4 text-cream">
                <p className="text-xs font-semibold text-brown-300 mb-1">Your goal: {form.goal || user.goal || '—'}</p>
                <p className="text-xs text-brown-200 leading-relaxed">
                  {(form.goal || user.goal) === 'Lose Weight'                  && 'Aim for a 300–500 cal daily deficit. Keep protein high (160g+) to preserve muscle.'}
                  {(form.goal || user.goal) === 'Build Muscle'                  && 'Eat at maintenance or slight surplus (+200–300 cal). 1g protein per lb of bodyweight.'}
                  {(form.goal || user.goal) === 'Bulk (Muscle + Weight Gain)'   && 'Eat in a 500+ cal surplus. Prioritise protein (200g+) and carbs around workouts.'}
                  {(form.goal || user.goal) === 'Stay Fit'                      && 'Eat at maintenance. Balanced macros. Prioritise whole foods and consistency.'}
                  {!(form.goal || user.goal)                                    && 'Set a goal to get personalised nutrition advice.'}
                </p>
              </div>
            </>
          )}

          {/* ── WORKOUT ── */}
          {section === 'workout' && (
            <>
                <p className="text-sm text-brown-600 font-body">
                Your current split: <strong className="text-brown-800">{
                  user.customSplit
                    ? user.customSplit.map(d => d.focus).slice(0,3).join(', ') + '...'
                    : 'Default'
                }</strong>
              </p>

              {/* Current split preview */}
              {user.customSplit && (
                <div className="grid grid-cols-7 gap-1">
                  {user.customSplit.map((d, i) => (
                    <div key={i} className={`${d.color || 'bg-brown-400'} rounded-lg p-1.5 text-center text-cream`}>
                      <div className="text-xs font-bold">{d.short}</div>
                      <div className="leading-tight mt-0.5 text-cream/80" style={{ fontSize: '9px' }}>
                        {d.focus}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-brown-50 rounded-xl p-4 border border-brown-200">
                <p className="text-sm font-semibold text-brown-800 mb-1">Want to change your workout split?</p>
                <p className="text-xs text-brown-500 mb-3">Use the full workout customiser to switch your split pattern or change individual days.</p>
                <button onClick={goToOnboarding}
                  className="w-full btn-primary py-2.5 text-sm text-center">
                  Open Workout Customiser →
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-brown-600 uppercase tracking-wider mb-2">Available Splits</p>
                <div className="space-y-2">
                  {WORKOUT_PATTERNS.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-brown-100">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-brown-800">{p.name}</div>
                        <div className="text-xs text-brown-400">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── ACCOUNT ── */}
          {section === 'account' && (
            <>
              <div className="bg-brown-50 rounded-2xl p-4 border border-brown-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brown-500">Member since</span>
                  <span className="font-medium text-brown-800">
                    {user.startDate
                      ? new Date(user.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-500">Workouts logged</span>
                  <span className="font-medium text-brown-800">{user.workoutLog?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-500">Weight entries</span>
                  <span className="font-medium text-brown-800">{user.weightLog?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-500">Email</span>
                  <span className="font-medium text-brown-800 truncate ml-4">{user.email || '—'}</span>
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 space-y-3">
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Danger Zone</p>

                <div>
                  <p className="text-sm font-medium text-rose-700 mb-1">Reset all progress logs</p>
                  <p className="text-xs text-rose-600 mb-2">Clears all workout and weight history. Your profile stays.</p>
                  <button onClick={resetProgress}
                    className="w-full py-2 px-4 rounded-xl border border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors">
                    Reset Progress Data
                  </button>
                </div>

                <div>
                  <p className="text-sm font-medium text-rose-700 mb-1">Redo onboarding</p>
                  <p className="text-xs text-rose-600 mb-2">Start the setup flow again to pick a new split or correct all your details.</p>
                  <button onClick={goToOnboarding}
                    className="w-full py-2 px-4 rounded-xl border border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors">
                    Redo Full Setup
                  </button>
                </div>
              </div>

              <button onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-brown-800 text-cream text-sm font-medium hover:bg-brown-900 transition-colors">
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Sticky save footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-brown-200 bg-cream">
          {saved ? (
            <div className="w-full py-3 rounded-xl bg-green-500 text-white text-sm font-semibold text-center animate-fade-up">
              ✓ Changes saved!
            </div>
          ) : (
            <button onClick={save}
              className="w-full py-3 rounded-xl bg-brown-500 hover:bg-brown-600 text-cream text-sm font-semibold transition-colors active:scale-[0.98]">
              Save Changes
            </button>
          )}
          {section !== 'account' && (
            <p className="text-xs text-brown-400 text-center mt-2">Changes apply immediately across the whole app</p>
          )}
        </div>
      </div>
    </>
  )
}
