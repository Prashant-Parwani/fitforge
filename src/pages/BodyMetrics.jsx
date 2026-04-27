import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

// Mifflin-St Jeor BMR formula
function calcBMR(weight, height, age, gender) {
  if (!weight || !height || !age) return 0
  const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age)
  return gender === 'female'
    ? Math.round(10 * w + 6.25 * h - 5 * a - 161)
    : Math.round(10 * w + 6.25 * h - 5 * a + 5)
}

const ACTIVITY = [
  { id: 'sedentary',  label: 'Sedentary',        sub: 'Little/no exercise, desk job', mult: 1.2 },
  { id: 'light',      label: 'Lightly Active',   sub: '1–3 workouts/week',             mult: 1.375 },
  { id: 'moderate',   label: 'Moderately Active', sub: '3–5 workouts/week',            mult: 1.55 },
  { id: 'active',     label: 'Very Active',       sub: '6–7 workouts/week',            mult: 1.725 },
  { id: 'extra',      label: 'Athlete',           sub: 'Twice daily training',          mult: 1.9 },
]

function ResultCard({ label, value, sub, highlight }) {
  return (
    <div className={`rounded-2xl p-4 text-center border ${highlight ? 'bg-brown-500 border-brown-500 text-cream' : 'bg-cream border-brown-200'}`}>
      <div className={`font-display text-3xl font-bold ${highlight ? 'text-cream' : 'text-brown-800'}`}>{value}</div>
      <div className={`text-xs mt-0.5 ${highlight ? 'text-brown-200' : 'text-brown-400'}`}>kcal / day</div>
      <div className={`text-sm font-medium mt-1 ${highlight ? 'text-cream' : 'text-brown-700'}`}>{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${highlight ? 'text-brown-200' : 'text-brown-400'}`}>{sub}</div>}
    </div>
  )
}

function MacroCard({ label, grams, pct, color, desc }) {
  return (
    <div className="bg-cream rounded-2xl border border-brown-200 p-4">
      <div className={`font-display text-2xl font-bold ${color}`}>{grams}g</div>
      <div className="text-xs text-brown-400">{pct}% of calories</div>
      <div className="text-sm font-medium text-brown-700 mt-1">{label}</div>
      <div className="text-xs text-brown-400 mt-0.5 leading-snug">{desc}</div>
    </div>
  )
}

export default function Calculator() {
  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({
    weight:   user?.weight   || '',
    height:   user?.height   || '',
    age:      user?.age      || '',
    gender:   'male',
    activity: 'moderate',
  })
  const [applied, setApplied] = useState(false)

  const bmr    = calcBMR(form.weight, form.height, form.age, form.gender)
  const mult   = ACTIVITY.find(a => a.id === form.activity)?.mult || 1.55
  const tdee   = Math.round(bmr * mult)

  const cutting     = tdee - 500
  const maintenance = tdee
  const bulking     = tdee + 500

  // Macros for selected goal (maintenance as default display)
  const weight = parseFloat(form.weight) || 70
  const macros = {
    protein: Math.round(weight * 2.2),             // 2.2g per kg
    fat:     Math.round((maintenance * 0.25) / 9), // 25% cals from fat
    get carbs() {
      return Math.round((maintenance - this.protein * 4 - this.fat * 9) / 4)
    }
  }

  const pctP = Math.round((macros.protein * 4 / maintenance) * 100)
  const pctF = Math.round((macros.fat * 9 / maintenance) * 100)
  const pctC = 100 - pctP - pctF

  const canCalc = bmr > 0

  const applyToProfile = () => {
    updateUser({
      weight:      form.weight,
      height:      form.height,
      age:         form.age,
      tdee,
      bmr,
      calorieTarget: maintenance,
    })
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Science-based</span>
          <h1 className="font-display text-4xl font-bold mt-2 mb-2">TDEE & Macro Calculator</h1>
          <p className="text-brown-300 text-sm font-body">
            Your Total Daily Energy Expenditure — the exact calories your body burns every day.
            Use this to set your cutting, maintenance, or bulking targets.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

        {/* ── Input form ── */}
        <div className="bg-cream rounded-2xl border border-brown-200 p-5">
          <h2 className="font-display text-lg font-semibold text-brown-900 mb-4">Your Details</h2>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-brown-600 mb-2">Biological sex (for formula accuracy)</label>
            <div className="flex gap-3">
              {['male','female'].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                    form.gender === g ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { key:'weight', label:'Weight (kg)', placeholder:'70' },
              { key:'height', label:'Height (cm)', placeholder:'175' },
              { key:'age',    label:'Age',         placeholder:'25' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-brown-600 mb-1.5">{f.label}</label>
                <input type="number" value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400 text-center font-bold"/>
              </div>
            ))}
          </div>

          {/* Activity level */}
          <div>
            <label className="block text-xs font-medium text-brown-600 mb-2">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY.map(a => (
                <button key={a.id} onClick={() => setForm(f => ({ ...f, activity: a.id }))}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                    form.activity === a.id ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-700 hover:border-brown-400 hover:bg-brown-50'
                  }`}>
                  <div>
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className={`text-xs ${form.activity === a.id ? 'text-brown-200' : 'text-brown-400'}`}>{a.sub}</div>
                  </div>
                  <div className={`text-xs font-mono ${form.activity === a.id ? 'text-brown-200' : 'text-brown-400'}`}>×{a.mult}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        {canCalc && (
          <>
            {/* BMR & TDEE */}
            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <h2 className="font-display text-lg font-semibold text-brown-900 mb-1">Your Results</h2>
              <p className="text-xs text-brown-400 mb-4">Calculated using the Mifflin-St Jeor formula — the most accurate non-lab method.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-brown-50 rounded-xl p-3 text-center border border-brown-100">
                  <div className="font-display text-2xl font-bold text-brown-600">{bmr}</div>
                  <div className="text-xs text-brown-400">kcal</div>
                  <div className="text-xs font-medium text-brown-600 mt-0.5">BMR (at rest)</div>
                  <div className="text-xs text-brown-400">Base metabolic rate</div>
                </div>
                <div className="bg-brown-500 rounded-xl p-3 text-center">
                  <div className="font-display text-2xl font-bold text-cream">{tdee}</div>
                  <div className="text-xs text-brown-200">kcal</div>
                  <div className="text-xs font-medium text-cream mt-0.5">TDEE (with activity)</div>
                  <div className="text-xs text-brown-200">Total daily expenditure</div>
                </div>
              </div>

              {/* Three goal targets */}
              <div className="grid grid-cols-3 gap-2">
                <ResultCard label="Cutting"     value={cutting}     sub="-500 cal deficit" />
                <ResultCard label="Maintenance" value={maintenance} sub="Stay the same" highlight />
                <ResultCard label="Bulking"     value={bulking}     sub="+500 cal surplus" />
              </div>
            </div>

            {/* Macros */}
            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <h2 className="font-display text-lg font-semibold text-brown-900 mb-1">Daily Macro Targets</h2>
              <p className="text-xs text-brown-400 mb-4">Based on your maintenance calories. Protein = 2.2g/kg bodyweight.</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <MacroCard label="Protein" grams={macros.protein} pct={pctP} color="text-red-600"    desc="Muscle building & repair" />
                <MacroCard label="Carbs"   grams={macros.carbs}   pct={pctC} color="text-yellow-600" desc="Energy & performance" />
                <MacroCard label="Fat"     grams={macros.fat}     pct={pctF} color="text-blue-600"   desc="Hormones & joints" />
              </div>

              {/* Visual bar */}
              <div className="flex rounded-full overflow-hidden h-4 mb-2">
                <div className="bg-red-400"    style={{ width: `${pctP}%` }} />
                <div className="bg-yellow-400" style={{ width: `${pctC}%` }} />
                <div className="bg-blue-400"   style={{ width: `${pctF}%` }} />
              </div>
              <div className="flex justify-between text-xs text-brown-400">
                <span className="text-red-500">Protein {pctP}%</span>
                <span className="text-yellow-600">Carbs {pctC}%</span>
                <span className="text-blue-500">Fat {pctF}%</span>
              </div>
            </div>

            {/* Apply to profile */}
            <div className="bg-brown-50 rounded-2xl border border-brown-200 p-5">
              <h3 className="font-body font-semibold text-brown-800 mb-1">Apply to your profile</h3>
              <p className="text-xs text-brown-500 mb-3">
                This will update your weight, height, age and set your calorie target to {maintenance} kcal/day in your profile.
              </p>
              <button onClick={applyToProfile}
                className={`btn-primary w-full py-3 ${applied ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                {applied ? '✓ Applied to Profile!' : 'Apply to My Profile →'}
              </button>
            </div>

            {/* Explanation */}
            <div className="bg-brown-800 rounded-2xl p-5 text-cream">
              <h3 className="font-display text-base font-semibold mb-3">How to use these numbers</h3>
              <div className="space-y-2.5 text-sm text-brown-300 font-body">
                <div className="flex gap-2"><span className="text-red-400 flex-shrink-0">🔥</span><span><strong className="text-cream">Cutting ({cutting} kcal):</strong> Eat this to lose ~0.5kg/week. Keep protein high to preserve muscle.</span></div>
                <div className="flex gap-2"><span className="text-amber-400 flex-shrink-0">⚖️</span><span><strong className="text-cream">Maintenance ({maintenance} kcal):</strong> Stay the same weight while building fitness.</span></div>
                <div className="flex gap-2"><span className="text-green-400 flex-shrink-0">📈</span><span><strong className="text-cream">Bulking ({bulking} kcal):</strong> Gain ~0.3kg/week, mostly muscle if training hard.</span></div>
                <div className="flex gap-2"><span className="text-blue-400 flex-shrink-0">💡</span><span>These are estimates — adjust by ±100 kcal every 2 weeks based on actual weight change.</span></div>
              </div>
            </div>
          </>
        )}

        {!canCalc && (
          <div className="text-center py-10 text-brown-400">
            <div className="text-4xl mb-3">📊</div>
            <p>Fill in your weight, height and age above to calculate your TDEE.</p>
          </div>
        )}
      </div>
    </main>
  )
}
