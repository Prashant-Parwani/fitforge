import { useState, useMemo } from 'react'
import { foodDatabase, foodCategories, dietPlans } from '../data/foodDatabase'

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

  const currentPlan = dietPlans[goal] || dietPlans['Stay Fit']

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
      </div>
    </main>
  )
}
