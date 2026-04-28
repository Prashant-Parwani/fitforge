import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { allFoods as foodDatabase, foodCategories, dietPlans } from '../data/foodDatabase'
import MealPlanCard from '../components/MealPlanCard'
import { OPENROUTER_API_KEY, callAI } from '../config'

function MacroBar({ label, current, target, color }) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-brown-700">{label}</span>
        <span className="text-brown-500">{current}g / {target}g</span>
      </div>
      <div className="h-2.5 bg-brown-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right text-xs text-brown-400 mt-0.5">{pct}%</div>
    </div>
  )
}

function FoodCard({ food, onAdd }) {
  const [qty, setQty] = useState(100)
  const scale = qty / 100
  return (
    <div className="bg-cream rounded-2xl border border-brown-200 p-4 card-lift">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-2xl">{food.emoji}</span>
          <h3 className="font-body font-semibold text-brown-900 text-sm mt-1">{food.name}</h3>
        </div>
        <span className="text-xs bg-brown-100 text-brown-600 px-2 py-0.5 rounded-full flex-shrink-0">per {qty}g</span>
      </div>
      <div className="grid grid-cols-4 gap-1 mb-3">
        {[
          { label: 'Cal',     value: Math.round(food.calories * scale),        color: 'text-orange-600' },
          { label: 'Protein', value: Math.round(food.protein  * scale) + 'g',  color: 'text-red-600' },
          { label: 'Carbs',   value: Math.round(food.carbs    * scale) + 'g',  color: 'text-yellow-600' },
          { label: 'Fat',     value: Math.round(food.fat      * scale) + 'g',  color: 'text-blue-600' },
        ].map(m => (
          <div key={m.label} className="text-center bg-brown-50 rounded-xl py-1.5">
            <div className={`font-bold text-sm ${m.color}`}>{m.value}</div>
            <div className="text-xs text-brown-400">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number" value={qty}
          onChange={e => setQty(Math.max(1, Number(e.target.value)))}
          className="w-16 px-2 py-1.5 text-sm border border-brown-200 rounded-lg text-center bg-brown-50 focus:outline-none focus:border-brown-400"
        />
        <span className="text-xs text-brown-400">g</span>
        <button
          onClick={() => onAdd(food, qty)}
          className="flex-1 bg-brown-500 hover:bg-brown-600 text-cream text-sm py-1.5 rounded-xl font-medium transition-colors"
        >+ Add to Log</button>
      </div>
      {food.tips && <p className="text-xs text-brown-400 mt-2 italic leading-relaxed">💡 {food.tips}</p>}
    </div>
  )
}

function DietPlanView({ goal }) {
  const plan = dietPlans[goal] || dietPlans['Stay Fit']
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Daily Calories', value: plan.calories, unit: 'kcal', bg: 'bg-orange-50', txt: 'text-orange-600' },
          { label: 'Protein',        value: plan.protein,  unit: 'g',    bg: 'bg-red-50',    txt: 'text-red-600' },
          { label: 'Carbs',          value: plan.carbs,    unit: 'g',    bg: 'bg-yellow-50', txt: 'text-yellow-600' },
          { label: 'Fat',            value: plan.fat,      unit: 'g',    bg: 'bg-blue-50',   txt: 'text-blue-600' },
        ].map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl p-3 text-center border border-brown-100`}>
            <div className={`font-display text-2xl font-bold ${m.txt}`}>{m.value}</div>
            <div className="text-xs text-brown-400 mt-0.5">{m.unit}</div>
            <div className="text-xs font-medium text-brown-600 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {plan.meals.map((meal, i) => (
          <div key={i} className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-brown-50 border-b border-brown-100 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-brown-200 text-brown-700 px-2 py-0.5 rounded-full">{meal.time}</span>
                <span className="font-body font-semibold text-brown-800 text-sm">{meal.name}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-orange-600 font-medium">{meal.macros.cal} cal</span>
                <span className="text-red-500">{meal.macros.p}g P</span>
                <span className="text-yellow-600">{meal.macros.c}g C</span>
                <span className="text-blue-500">{meal.macros.f}g F</span>
              </div>
            </div>
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {meal.foods.map((f, j) => (
                <span key={j} className="text-xs bg-brown-100 text-brown-700 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 bg-brown-800 rounded-2xl p-5 text-cream">
        <div className="text-2xl mb-2">💡</div>
        <h4 className="font-display text-lg font-semibold mb-2">Trainer's Nutrition Rules</h4>
        <ul className="text-brown-300 text-sm font-body space-y-1 list-disc pl-4">
          <li>1g protein per pound of bodyweight — non-negotiable</li>
          <li>Drink 3–4 litres of water per day</li>
          <li>Never skip breakfast</li>
          <li>Eat within 30–60 min post-workout</li>
          <li>Carbs are not the enemy — time them around your workouts</li>
        </ul>
      </div>
    </div>
  )
}

export default function Diet() {
  const [tab, setTab]               = useState('tracker')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]         = useState('')
  const [foodLog, setFoodLog]       = useState([])
  const [goal, setGoal]             = useState('Build Muscle')

  const { user, updateUser } = useAuth()
  const currentPlan = dietPlans[goal] || dietPlans['Stay Fit']

  // ── AI Meal Planner state ──
  const [aiPlan, setAiPlan]         = useState(() => {
    try { return user?.aiMealPlan || null } catch { return null }
  })
  const [aiLoading, setAiLoading]   = useState(false)
  const [aiError, setAiError]       = useState('')
  const [regenDay, setRegenDay]     = useState(null)
  const [planPrefs, setPlanPrefs]   = useState({
    calories: user?.goal === 'Lose Weight' ? '1800'
            : user?.goal === 'Build Muscle' ? '3000'
            : user?.goal?.includes('Bulk') ? '3500' : '2200',
    diet:     user?.diet || 'No Preference',
    budget:   'Normal',
    allergies: '',
  })



  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

  // ── Task 6: AI Daily Nutrition Insight ──
  const [insight, setInsight]       = useState(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError]     = useState('')

  const analyseMyDay = async () => {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')) { setInsightError('Set VITE_OPENROUTER_API_KEY in .env and Vercel.'); return }
    if (foodLog.length < 2) { setInsightError('Log at least 2 foods first to get an analysis.'); return }
    setInsightLoading(true)
    setInsightError('')
    setInsight(null)
    try {
      const prompt = `You are a nutritionist AI. Analyse this user's food day and return ONLY a JSON object, no markdown.

USER GOAL: ${goal}
DAILY TARGETS: ${currentPlan.calories} cal, ${currentPlan.protein}g protein, ${currentPlan.carbs}g carbs, ${currentPlan.fat}g fat

EATEN TODAY:
- Calories: ${totals.calories} / ${currentPlan.calories} kcal
- Protein: ${totals.protein} / ${currentPlan.protein}g
- Carbs: ${totals.carbs} / ${currentPlan.carbs}g
- Fat: ${totals.fat} / ${currentPlan.fat}g
- Foods: ${foodLog.map(f => f.name + ' (' + f.qty + 'g)').join(', ')}

Return this exact JSON:
{
  "verdict": "one sentence overall assessment",
  "protein_status": "good|low|high",
  "protein_message": "specific message about protein with exact numbers",
  "warning": "one thing that is too high or to watch out for (or null if nothing)",
  "suggestion": "one specific food they should eat next to fix the biggest gap",
  "score": <integer 1-10>
}`
      const raw = (await callAI('', prompt, 400, { temperature: 0.3 })).replace(/```json|```/gi,'').trim()
      const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw)
      setInsight(parsed)
    } catch(e) { setInsightError(e.message || 'Analysis failed. Try again.') }
    finally { setInsightLoading(false) }
  }

  const generateMealPlan = async (dayToRegen = null) => {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')) {
      setAiError('Set VITE_OPENROUTER_API_KEY in .env and Vercel.')
      return
    }
    setAiLoading(true)
    setAiError('')
    setRegenDay(dayToRegen)

    const dayInstruction = dayToRegen
      ? `Regenerate ONLY ${dayToRegen}'s meal plan. Return ONLY a JSON object with key "${dayToRegen}" containing the day's meals.`
      : `Generate a FULL 7-day meal plan. Return a JSON object with keys for all 7 days.`

    const prompt = `You are an expert Indian nutritionist. ${dayInstruction}

USER:
- Goal: ${user?.goal || planPrefs.diet}
- Daily calorie target: ${planPrefs.calories} kcal
- Diet preference: ${planPrefs.diet}
- Budget: ${planPrefs.budget}
- Allergies/avoid: ${planPrefs.allergies || 'None'}

Return ONLY valid JSON, no markdown, no backticks. Structure for each day:
{
  "Monday": {
    "totalCalories": 2200,
    "breakfast":  { "description": "Besan cheela (2) with mint chutney + chai", "macros": { "calories": 320, "protein": 18, "carbs": 35, "fat": 8 } },
    "midMorning": { "description": "Sprouts chaat with lemon (1 bowl) + apple", "macros": { "calories": 150, "protein": 8, "carbs": 22, "fat": 2 } },
    "lunch":      { "description": "Dal tadka (1 bowl) + 2 roti + palak sabzi + dahi", "macros": { "calories": 550, "protein": 28, "carbs": 70, "fat": 10 } },
    "snack":      { "description": "Roasted makhana (30g) + green tea", "macros": { "calories": 110, "protein": 3, "carbs": 20, "fat": 1 } },
    "dinner":     { "description": "Moong dal khichdi (1 bowl) + egg bhurji (2 eggs) + salad", "macros": { "calories": 480, "protein": 28, "carbs": 58, "fat": 12 } }
  }
}

IMPORTANT:
- Use realistic Indian home-cooked meals primarily
- Vary meals across days — do NOT repeat the same breakfast every day
- ${planPrefs.diet === 'Vegetarian' || planPrefs.diet === 'Vegan' ? 'NO meat, chicken or fish — vegetarian only' : 'Mix of veg and non-veg is fine'}
- Keep total daily calories close to ${planPrefs.calories} kcal
- Include all 7 days if generating full plan`

    try {
      const rawText = await callAI('', prompt, 3000, { temperature: 0.7 })
      const cleaned = rawText.replace(/\`\`\`json\s*/gi, '').replace(/\`\`\`\s*/g, '').trim()

      let parsed
      try { parsed = JSON.parse(cleaned) }
      catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
        else throw new Error('Could not parse AI response. Please try again.')
      }

      if (dayToRegen) {
        setAiPlan(prev => ({ ...prev, ...parsed }))
        updateUser({ aiMealPlan: { ...(user?.aiMealPlan || {}), ...parsed } })
      } else {
        setAiPlan(parsed)
        updateUser({ aiMealPlan: parsed })
      }

    } catch (err) {
      setAiError(err.message || 'Failed to generate plan. Please try again.')
    } finally {
      setAiLoading(false)
      setRegenDay(null)
    }
  }

  const totals = useMemo(() => foodLog.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein:  acc.protein  + item.protein,
      carbs:    acc.carbs    + item.carbs,
      fat:      acc.fat      + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ), [foodLog])

  const filteredFoods = useMemo(() => foodDatabase.filter(f => {
    const matchCat    = activeCategory === 'all' || f.category === activeCategory
    const matchSearch = search === '' || f.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [activeCategory, search])

  const addToLog = (food, qty) => {
    const scale = qty / 100
    setFoodLog(prev => [...prev, {
      id: Date.now(), name: food.name, emoji: food.emoji, qty,
      calories: Math.round(food.calories * scale),
      protein:  Math.round(food.protein  * scale),
      carbs:    Math.round(food.carbs    * scale),
      fat:      Math.round(food.fat      * scale),
    }])
  }

  const removeFromLog = (id) => setFoodLog(prev => prev.filter(f => f.id !== id))

  const tabs = [
    { id: 'tracker',  label: 'Daily Tracker', emoji: '📋' },
    { id: 'database', label: 'Food Database', emoji: '🔍' },
    { id: 'plan',     label: 'Diet Plan',     emoji: '🤖' },
    { id: 'aiplan',   label: 'AI Meal Plan',  emoji: '✨' },
  ]

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Nutrition Centre</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-2">Diet & Nutrition</h1>
          <p className="text-brown-300 font-body max-w-2xl">
            Track your daily food, explore 80+ foods with full macros, and get a personalised diet plan. Abs are made in the kitchen.
          </p>
        </div>
      </section>

      <div className="bg-cream border-b border-brown-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 py-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-brown-500 text-cream' : 'text-brown-600 hover:bg-brown-100'
                }`}
              ><span>{t.emoji}</span> {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {tab === 'tracker' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-cream rounded-2xl border border-brown-200 p-5">
                <h2 className="font-display text-xl font-semibold text-brown-900 mb-1">Today's Progress</h2>
                <p className="text-sm text-brown-500 mb-4">Goal: <span className="font-medium">{goal}</span></p>
                <div className="flex justify-center mb-5">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f5ebe0" strokeWidth="3"/>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5e3c" strokeWidth="3"
                        strokeDasharray={`${Math.min(100, (totals.calories / currentPlan.calories) * 100)} 100`}
                        strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-display text-2xl font-bold text-brown-800">{totals.calories}</div>
                      <div className="text-xs text-brown-400">of {currentPlan.calories}</div>
                      <div className="text-xs text-brown-500 font-medium">kcal</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <MacroBar label="Protein" current={totals.protein} target={currentPlan.protein} color="bg-red-400" />
                  <MacroBar label="Carbs"   current={totals.carbs}   target={currentPlan.carbs}   color="bg-yellow-400" />
                  <MacroBar label="Fat"     current={totals.fat}     target={currentPlan.fat}     color="bg-blue-400" />
                </div>
                <div className="mt-5 pt-4 border-t border-brown-100">
                  <label className="text-xs text-brown-500 block mb-2">Change Goal:</label>
                  <div className="flex flex-col gap-1.5">
                    {Object.keys(dietPlans).map(g => (
                      <button key={g} onClick={() => setGoal(g)}
                        className={`text-sm py-1.5 px-3 rounded-lg text-left transition-all ${
                          goal === g ? 'bg-brown-500 text-cream' : 'hover:bg-brown-100 text-brown-700'
                        }`}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-brown-100">
                  <h2 className="font-display text-xl font-semibold text-brown-900">Food Log</h2>
                  <span className="text-sm text-brown-500">{foodLog.length} items</span>
                </div>
                {foodLog.length === 0 ? (
                  <div className="text-center py-16 text-brown-400">
                    <div className="text-4xl mb-3">🍽️</div>
                    <p className="font-body">No food logged yet today.</p>
                    <p className="text-sm mt-1">Go to Food Database to add meals.</p>
                    <button onClick={() => setTab('database')} className="btn-primary text-sm mt-4">
                      Browse Food Database →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-brown-100">
                      {foodLog.map(item => (
                        <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brown-50">
                          <span className="text-xl">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-body text-sm font-medium text-brown-900 truncate">{item.name}</div>
                            <div className="text-xs text-brown-400">{item.qty}g</div>
                          </div>
                          <div className="flex gap-3 text-xs text-right">
                            <span className="text-orange-600 font-bold">{item.calories}</span>
                            <span className="text-red-500">{item.protein}g P</span>
                            <span className="text-yellow-600">{item.carbs}g C</span>
                            <span className="text-blue-500">{item.fat}g F</span>
                          </div>
                          <button onClick={() => removeFromLog(item.id)} className="text-brown-300 hover:text-red-400 transition-colors ml-1 text-sm">✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-brown-50 border-t border-brown-200">
                      <div className="flex-1 font-semibold text-sm text-brown-800">Total</div>
                      <div className="flex gap-3 text-xs font-bold">
                        <span className="text-orange-600">{totals.calories} kcal</span>
                        <span className="text-red-500">{totals.protein}g P</span>
                        <span className="text-yellow-600">{totals.carbs}g C</span>
                        <span className="text-blue-500">{totals.fat}g F</span>
                      </div>
                      <div className="w-5" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── AI Nutrition Insight (Task 6) ── */}
          {foodLog.length >= 2 && (
            <div className="mt-5">
              {insightError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-3">{insightError}</div>
              )}
              {!insight ? (
                <button onClick={analyseMyDay} disabled={insightLoading}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-brown-300 text-sm font-medium text-brown-600 hover:border-brown-500 hover:bg-brown-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {insightLoading
                    ? <><span className="w-4 h-4 border-2 border-brown-400 border-t-transparent rounded-full animate-spin"/>Analysing your day...</>
                    : <>🤖 Analyse My Day with AI</>
                  }
                </button>
              ) : (
                <div className="bg-brown-800 rounded-2xl p-5 text-cream">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold">Today's Analysis</h3>
                    <div className="flex items-center gap-2">
                      <div className={`text-2xl font-display font-bold ${insight.score >= 7 ? 'text-green-400' : insight.score >= 4 ? 'text-amber-400' : 'text-red-400'}`}>
                        {insight.score}/10
                      </div>
                      <button onClick={() => setInsight(null)} className="text-brown-400 hover:text-brown-200 text-xs">↺ Re-analyse</button>
                    </div>
                  </div>
                  <p className="text-brown-200 text-sm mb-4">{insight.verdict}</p>
                  <div className="space-y-2.5">
                    <div className={`rounded-xl p-3 ${insight.protein_status === 'good' ? 'bg-green-900/40' : 'bg-amber-900/40'}`}>
                      <div className="text-xs font-semibold uppercase tracking-wider text-brown-300 mb-0.5">Protein</div>
                      <p className="text-sm text-brown-100">{insight.protein_message}</p>
                    </div>
                    {insight.warning && (
                      <div className="bg-red-900/40 rounded-xl p-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-brown-300 mb-0.5">⚠️ Watch Out</div>
                        <p className="text-sm text-brown-100">{insight.warning}</p>
                      </div>
                    )}
                    <div className="bg-brown-700/50 rounded-xl p-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-brown-300 mb-0.5">💡 Eat Next</div>
                      <p className="text-sm text-brown-100">{insight.suggestion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </>
        )}

        {tab === 'database' && (
          <div>
            <div className="relative mb-4 max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search foods..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brown-200 bg-cream text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
              {foodCategories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-brown-500 text-cream border-brown-500'
                      : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
                  }`}
                >{cat.emoji} {cat.label}</button>
              ))}
            </div>
            <p className="text-sm text-brown-500 mb-4">
              <span className="font-semibold text-brown-700">{filteredFoods.length}</span> foods — all values per 100g. Adjust quantity on each card.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFoods.map(food => (
                <FoodCard key={food.id} food={food} onAdd={addToLog} />
              ))}
            </div>
          </div>
        )}

        {tab === 'plan' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-brown-900">Your Personalised Diet Plan</h2>
                <p className="text-brown-500 text-sm font-body mt-1">Based on your goal. Adjust portions to your bodyweight.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(dietPlans).map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`text-sm px-4 py-2 rounded-full font-medium border transition-all ${
                      goal === g ? 'bg-brown-500 text-cream border-brown-500' : 'bg-cream text-brown-600 border-brown-200 hover:border-brown-400'
                    }`}
                  >{g}</button>
                ))}
              </div>
            </div>
            <DietPlanView goal={goal} />
          </div>
        )}

        {/* ── AI MEAL PLAN TAB ── */}
        {tab === 'aiplan' && (
          <div>
            {/* Preferences form */}
            {!aiPlan && (
              <div className="bg-cream rounded-2xl border border-brown-200 p-5 mb-5">
                <h2 className="font-display text-xl font-semibold text-brown-900 mb-1">AI Weekly Meal Planner</h2>
                <p className="text-sm text-brown-500 mb-5">Tell us your preferences and we'll generate a full 7-day personalised Indian meal plan instantly.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-brown-600 mb-1.5">Daily Calories (kcal)</label>
                      <input type="number" value={planPrefs.calories}
                        onChange={e => setPlanPrefs(p => ({ ...p, calories: e.target.value }))}
                        placeholder="2000"
                        className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown-600 mb-1.5">Budget</label>
                      <div className="flex flex-col gap-1.5">
                        {['Economy','Normal','Premium'].map(b => (
                          <button key={b} type="button" onClick={() => setPlanPrefs(p => ({ ...p, budget: b }))}
                            className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all text-left ${planPrefs.budget === b ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400'}`}>
                            {b === 'Economy' ? '💰 Economy — dal, roti, eggs' : b === 'Normal' ? '🛒 Normal — chicken, paneer' : '✨ Premium — salmon, quinoa'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brown-600 mb-1.5">Diet Preference</label>
                    <div className="flex flex-wrap gap-2">
                      {['No Preference','Vegetarian','Vegan','High Protein','Low Carb'].map(d => (
                        <button key={d} type="button" onClick={() => setPlanPrefs(p => ({ ...p, diet: d }))}
                          className={`py-1.5 px-3 rounded-full border text-xs font-medium transition-all ${planPrefs.diet === d ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brown-600 mb-1.5">Allergies / Foods to Avoid (optional)</label>
                    <input type="text" value={planPrefs.allergies}
                      onChange={e => setPlanPrefs(p => ({ ...p, allergies: e.target.value }))}
                      placeholder="e.g. peanuts, dairy, gluten"
                      className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {aiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 leading-relaxed">
                {aiError}
              </div>
            )}

            {/* Generate / regenerate button */}
            <button onClick={() => generateMealPlan(null)} disabled={aiLoading}
              className="btn-primary w-full py-4 text-base mb-6 flex items-center justify-center gap-3 disabled:opacity-60">
              {aiLoading && !regenDay ? (
                <><span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Generating your meal plan...</>
              ) : aiPlan ? (
                '🔄 Regenerate Full Plan'
              ) : (
                '✨ Generate My 7-Day Meal Plan'
              )}
            </button>

            {/* Generated plan */}
            {aiPlan && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-brown-900">Your 7-Day Meal Plan</h3>
                  <span className="text-xs text-brown-400">Tap any day to regenerate it</span>
                </div>
                {DAYS.map((day, i) => {
                  const isToday = new Date().getDay() === (i + 1) % 7 || (i === 6 && new Date().getDay() === 0)
                  const dayData = aiPlan[day]
                  return (
                    <div key={day}>
                      <MealPlanCard day={day} meals={dayData} isToday={isToday} />
                      <button
                        onClick={() => generateMealPlan(day)}
                        disabled={aiLoading}
                        className="w-full text-xs text-brown-400 hover:text-brown-600 py-1.5 transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
                        {aiLoading && regenDay === day
                          ? <><span className="w-3 h-3 border border-brown-400 border-t-transparent rounded-full animate-spin" />Regenerating...</>
                          : '🔄 Regenerate ' + day
                        }
                      </button>
                    </div>
                  )
                })}

                <div className="bg-brown-800 rounded-2xl p-5 text-cream mt-2">
                  <h4 className="font-display text-base font-semibold mb-2">Nutrition Rules</h4>
                  <ul className="text-brown-300 text-xs space-y-1 font-body">
                    <li>• Eat within 30–60 min post-workout for muscle repair</li>
                    <li>• Drink 3–4 litres of water daily — more on gym days</li>
                    <li>• Never skip breakfast — your body has been fasting all night</li>
                    <li>• Aim for 1g protein per pound of bodyweight</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
