import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GOALS    = ['Lose Weight', 'Build Muscle', 'Bulk (Muscle + Weight Gain)', 'Stay Fit']
const LEVELS   = ['Beginner (< 6 months)', 'Intermediate (6m – 2yr)', 'Advanced (2yr+)']
const DIETS    = ['No Preference', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb', 'Keto']
const DAYS_PER = ['3 days/week', '4 days/week', '5 days/week', '6 days/week', '7 days/week']

// Pre-built workout patterns including multi-muscle combos
const WORKOUT_PATTERNS = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    desc: 'Classic 6-day split. Best for intermediate lifters.',
    days: [
      { day:'Monday',    short:'Mon', focus:'Chest + Triceps',   color:'bg-red-500' },
      { day:'Tuesday',   short:'Tue', focus:'Back + Biceps',     color:'bg-blue-600' },
      { day:'Wednesday', short:'Wed', focus:'Legs',              color:'bg-green-600' },
      { day:'Thursday',  short:'Thu', focus:'Chest + Shoulders', color:'bg-red-500' },
      { day:'Friday',    short:'Fri', focus:'Back + Biceps',     color:'bg-blue-600' },
      { day:'Saturday',  short:'Sat', focus:'Legs + Cardio',     color:'bg-teal-500' },
      { day:'Sunday',    short:'Sun', focus:'Rest',              color:'bg-brown-300' },
    ]
  },
  {
    id: 'bro',
    name: 'Classic Bro Split',
    desc: '5-day split. One muscle per day. Best for beginners.',
    days: [
      { day:'Monday',    short:'Mon', focus:'Chest',             color:'bg-red-500' },
      { day:'Tuesday',   short:'Tue', focus:'Back',              color:'bg-blue-600' },
      { day:'Wednesday', short:'Wed', focus:'Legs',              color:'bg-green-600' },
      { day:'Thursday',  short:'Thu', focus:'Shoulders + Traps', color:'bg-purple-600' },
      { day:'Friday',    short:'Fri', focus:'Arms',              color:'bg-orange-500' },
      { day:'Saturday',  short:'Sat', focus:'Cardio + Core',     color:'bg-teal-500' },
      { day:'Sunday',    short:'Sun', focus:'Rest',              color:'bg-brown-300' },
    ]
  },
  {
    id: 'upper_lower',
    name: 'Upper / Lower Split',
    desc: '4-day split. Great for strength and muscle balance.',
    days: [
      { day:'Monday',    short:'Mon', focus:'Upper Body',        color:'bg-purple-600' },
      { day:'Tuesday',   short:'Tue', focus:'Lower Body',        color:'bg-green-600' },
      { day:'Wednesday', short:'Wed', focus:'Rest',              color:'bg-brown-300' },
      { day:'Thursday',  short:'Thu', focus:'Upper Body',        color:'bg-purple-600' },
      { day:'Friday',    short:'Fri', focus:'Lower Body',        color:'bg-green-600' },
      { day:'Saturday',  short:'Sat', focus:'Cardio + Core',     color:'bg-teal-500' },
      { day:'Sunday',    short:'Sun', focus:'Rest',              color:'bg-brown-300' },
    ]
  },
  {
    id: 'chest_tri_back_bi',
    name: 'Chest+Tri / Back+Bi',
    desc: 'Most popular split. Synergistic muscle pairing.',
    days: [
      { day:'Monday',    short:'Mon', focus:'Chest + Triceps',   color:'bg-red-500' },
      { day:'Tuesday',   short:'Tue', focus:'Back + Biceps',     color:'bg-blue-600' },
      { day:'Wednesday', short:'Wed', focus:'Legs',              color:'bg-green-600' },
      { day:'Thursday',  short:'Thu', focus:'Chest + Triceps',   color:'bg-red-500' },
      { day:'Friday',    short:'Fri', focus:'Back + Biceps',     color:'bg-blue-600' },
      { day:'Saturday',  short:'Sat', focus:'Shoulders + Core',  color:'bg-purple-600' },
      { day:'Sunday',    short:'Sun', focus:'Rest',              color:'bg-brown-300' },
    ]
  },
  {
    id: 'fullbody',
    name: 'Full Body (3x/week)',
    desc: 'Best for beginners and fat loss. 3 days training.',
    days: [
      { day:'Monday',    short:'Mon', focus:'Full Body',         color:'bg-brown-600' },
      { day:'Tuesday',   short:'Tue', focus:'Cardio',            color:'bg-teal-500' },
      { day:'Wednesday', short:'Wed', focus:'Full Body',         color:'bg-brown-600' },
      { day:'Thursday',  short:'Thu', focus:'Cardio',            color:'bg-teal-500' },
      { day:'Friday',    short:'Fri', focus:'Full Body',         color:'bg-brown-600' },
      { day:'Saturday',  short:'Sat', focus:'Cardio + Core',     color:'bg-teal-500' },
      { day:'Sunday',    short:'Sun', focus:'Rest',              color:'bg-brown-300' },
    ]
  },
]

const CUSTOM_FOCUS = [
  'Chest','Triceps','Chest + Triceps','Chest + Shoulders','Chest + Core',
  'Back','Biceps','Back + Biceps','Back + Traps',
  'Legs','Legs + Cardio','Legs + Core','Glutes + Hamstrings',
  'Shoulders','Shoulders + Traps','Shoulders + Core','Shoulders + Arms',
  'Arms','Core','Cardio','Cardio + Core',
  'Upper Body','Lower Body','Full Body','Mobility','Rest'
]

const focusColor = (focus) => {
  if (!focus) return 'bg-brown-400'
  if (focus.includes('Chest'))    return 'bg-red-500'
  if (focus.includes('Back'))     return 'bg-blue-600'
  if (focus.includes('Leg'))      return 'bg-green-600'
  if (focus.includes('Shoulder')) return 'bg-purple-600'
  if (focus.includes('Arm') || focus.includes('Bicep') || focus.includes('Tricep')) return 'bg-orange-500'
  if (focus.includes('Cardio'))   return 'bg-teal-500'
  if (focus.includes('Core'))     return 'bg-yellow-500'
  if (focus === 'Rest')           return 'bg-brown-300'
  if (focus.includes('Full') || focus.includes('Upper') || focus.includes('Lower')) return 'bg-brown-600'
  return 'bg-brown-400'
}

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const navigate             = useNavigate()
  const [step, setStep]      = useState(1)

  const [info, setInfo] = useState({
    goal:         user?.goal || '',
    level:        '',
    diet:         'No Preference',
    weight:       user?.weight || '',
    targetWeight: '',
    height:       user?.height || '',
    age:          '',
    daysPerWeek:  '5 days/week',
  })

  const [selectedPattern, setSelectedPattern] = useState(null)  // id of chosen pattern
  const [customSplit, setCustomSplit]           = useState(
    WORKOUT_PATTERNS[0].days.map(d => ({ ...d }))
  )
  const [editingDay, setEditingDay] = useState(null)

  const choosePattern = (pattern) => {
    setSelectedPattern(pattern.id)
    setCustomSplit(pattern.days.map(d => ({ ...d })))
    setEditingDay(null)
  }

  const updateDayFocus = (idx, newFocus) => {
    setCustomSplit(prev => prev.map((d, i) => i === idx
      ? { ...d, focus: newFocus, color: focusColor(newFocus) }
      : d
    ))
    setEditingDay(null)
  }

  const finish = () => {
    const finalSplit = customSplit.map(d => ({
      day:   d.day,
      short: d.short,
      focus: d.focus,
      color: d.color || focusColor(d.focus),
    }))

    const startingWeight = info.weight ? parseFloat(info.weight) : null

    updateUser({
      ...info,
      onboarded:    true,
      customSplit:  finalSplit,
      startDate:    new Date().toISOString().split('T')[0],
      workoutLog:   [],
      weightLog:    startingWeight
        ? [{ label: 'Start', value: startingWeight, date: new Date().toISOString().split('T')[0] }]
        : [],
    })
    navigate('/dashboard')
  }

  const steps = ['Profile', 'Choose Split', 'Customise Days']

  return (
    <div className="min-h-screen bg-brown-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i + 1 === step ? 'bg-brown-500 text-cream' : i + 1 < step ? 'bg-brown-300 text-cream' : 'bg-brown-200 text-brown-500'
              }`}>
                <span>{i + 1 < step ? '✓' : i + 1}</span>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-6 h-0.5 ${i + 1 < step ? 'bg-brown-400' : 'bg-brown-200'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Profile ── */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">👤</div>
              <h1 className="font-display text-3xl font-bold text-brown-900">Let's build your profile</h1>
              <p className="text-brown-500 mt-2 font-body text-sm">This personalises everything — your diet plan, workout split and progress tracking.</p>
            </div>

            <div className="bg-cream rounded-2xl border border-brown-200 p-6 space-y-5">

              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Main Goal *</label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(g => (
                    <button key={g} type="button" onClick={() => setInfo({...info, goal: g})}
                      className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all text-left leading-snug ${
                        info.goal === g ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-brown-50'
                      }`}>
                      {g === 'Lose Weight'             && '🔥 '}
                      {g === 'Build Muscle'             && '💪 '}
                      {g === 'Bulk (Muscle + Weight Gain)' && '📈 '}
                      {g === 'Stay Fit'                 && '⚡ '}
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Experience Level *</label>
                <div className="flex flex-col gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setInfo({...info, level: l})}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all text-left ${
                        info.level === l ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-brown-50'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body stats — includes target weight */}
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Body Stats</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key:'age',          label:'Age',              placeholder:'25',  type:'number' },
                    { key:'height',       label:'Height (cm)',       placeholder:'175', type:'number' },
                    { key:'weight',       label:'Current Weight (kg)',placeholder:'70', type:'number' },
                    { key:'targetWeight', label:'Target Weight (kg)', placeholder:'65', type:'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-brown-500 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={info[f.key]}
                        onChange={e => setInfo({...info, [f.key]: e.target.value})}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 text-sm focus:outline-none focus:border-brown-400"
                      />
                    </div>
                  ))}
                </div>
                {info.weight && info.targetWeight && (
                  <p className="text-xs text-brown-500 mt-2">
                    {parseFloat(info.targetWeight) < parseFloat(info.weight)
                      ? `📉 Goal: lose ${(parseFloat(info.weight) - parseFloat(info.targetWeight)).toFixed(1)} kg`
                      : `📈 Goal: gain ${(parseFloat(info.targetWeight) - parseFloat(info.weight)).toFixed(1)} kg`}
                  </p>
                )}
              </div>

              {/* Diet */}
              <div>
                <label className="block text-sm font-semibold text-brown-700 mb-2">Dietary Preference</label>
                <div className="flex flex-wrap gap-2">
                  {DIETS.map(d => (
                    <button key={d} type="button" onClick={() => setInfo({...info, diet: d})}
                      className={`py-1.5 px-3 rounded-full border text-sm font-medium transition-all ${
                        info.diet === d ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { if (info.goal && info.level) setStep(2) }}
                disabled={!info.goal || !info.level}
                className="btn-primary w-full py-3.5 text-base disabled:opacity-40"
              >
                Next: Choose Workout Split →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Choose a workout pattern ── */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📅</div>
              <h1 className="font-display text-3xl font-bold text-brown-900">Choose your workout split</h1>
              <p className="text-brown-500 mt-2 text-sm font-body">Pick the pattern that fits your schedule. You can customise individual days next.</p>
            </div>

            <div className="space-y-3">
              {WORKOUT_PATTERNS.map(pattern => (
                <button
                  key={pattern.id}
                  onClick={() => choosePattern(pattern)}
                  className={`w-full text-left bg-cream rounded-2xl border-2 p-4 transition-all ${
                    selectedPattern === pattern.id ? 'border-brown-500 bg-brown-50' : 'border-brown-200 hover:border-brown-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-display font-semibold text-brown-900">{pattern.name}</div>
                      <div className="text-xs text-brown-500 mt-0.5">{pattern.desc}</div>
                    </div>
                    {selectedPattern === pattern.id && (
                      <div className="w-6 h-6 bg-brown-500 rounded-full flex items-center justify-center text-cream text-xs flex-shrink-0">✓</div>
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {pattern.days.map(d => (
                      <div key={d.day} className={`${d.color} rounded-lg p-1.5 text-center text-cream`}>
                        <div className="text-xs font-bold">{d.short}</div>
                        <div className="text-xs opacity-80 leading-tight mt-0.5 truncate">{d.focus.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
              <button
                onClick={() => { if (selectedPattern) setStep(3) }}
                disabled={!selectedPattern}
                className="btn-primary flex-1 py-3 disabled:opacity-40"
              >
                Next: Fine-tune Days →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Customise individual days ── */}
        {step === 3 && (
          <div className="animate-fade-up">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✏️</div>
              <h1 className="font-display text-3xl font-bold text-brown-900">Fine-tune your days</h1>
              <p className="text-brown-500 mt-2 text-sm font-body">Tap any day to change its focus. Your split, your rules.</p>
            </div>

            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              {/* Visual 7-day grid */}
              <div className="grid grid-cols-7 gap-1.5 mb-4">
                {customSplit.map((d, i) => (
                  <button key={d.day} onClick={() => setEditingDay(editingDay === i ? null : i)}
                    className={`rounded-xl p-2 text-center text-cream transition-all border-2 ${
                      editingDay === i ? 'border-brown-900 scale-105 shadow-lg' : 'border-transparent'
                    } ${d.color || focusColor(d.focus)}`}>
                    <div className="text-xs font-bold">{d.short}</div>
                    <div className="text-xs opacity-80 mt-0.5 leading-tight" style={{fontSize:'9px'}}>
                      {d.focus.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Focus picker — shows when a day is tapped */}
              {editingDay !== null && (
                <div className="mb-4 p-3 bg-brown-50 rounded-xl border border-brown-200 animate-fade-up">
                  <p className="text-xs font-semibold text-brown-600 mb-2 uppercase tracking-wider">
                    {customSplit[editingDay].day} — tap new focus:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CUSTOM_FOCUS.map(f => (
                      <button key={f} onClick={() => updateDayFocus(editingDay, f)}
                        className={`py-1.5 px-2.5 rounded-full text-xs font-medium border transition-all ${
                          customSplit[editingDay].focus === f
                            ? 'bg-brown-500 text-cream border-brown-500'
                            : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-white'
                        }`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* List view */}
              <div className="space-y-1.5 mb-5">
                {customSplit.map((d, i) => (
                  <div key={d.day} onClick={() => setEditingDay(editingDay === i ? null : i)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      editingDay === i ? 'border-brown-400 bg-brown-50' : 'border-transparent hover:border-brown-200 hover:bg-brown-50'
                    }`}>
                    <div className={`w-8 h-8 ${d.color || focusColor(d.focus)} rounded-lg flex items-center justify-center text-cream text-xs font-bold flex-shrink-0`}>
                      {d.short}
                    </div>
                    <span className="text-sm font-medium text-brown-800 flex-1">{d.day}</span>
                    <span className="text-sm text-brown-600">{d.focus}</span>
                    <span className="text-brown-300 text-xs">✏️</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">← Back</button>
                <button onClick={finish} className="btn-primary flex-1 py-3">
                  Save & Start My Journey 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
