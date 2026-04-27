export default function MealPlanCard({ day, meals, isToday }) {
  if (!meals) return null

  const mealSlots = [
    { key: 'breakfast',  label: 'Breakfast',   emoji: '🌅', time: '7:00 AM'  },
    { key: 'midMorning', label: 'Mid-Morning',  emoji: '🍎', time: '10:30 AM' },
    { key: 'lunch',      label: 'Lunch',        emoji: '🍛', time: '1:00 PM'  },
    { key: 'snack',      label: 'Snack',        emoji: '🥜', time: '4:30 PM'  },
    { key: 'dinner',     label: 'Dinner',       emoji: '🌙', time: '8:00 PM'  },
  ]

  return (
    <div className={`bg-cream rounded-2xl border overflow-hidden ${isToday ? 'border-brown-500 ring-2 ring-brown-200' : 'border-brown-200'}`}>
      <div className={`px-4 py-3 flex items-center justify-between ${isToday ? 'bg-brown-500 text-cream' : 'bg-brown-50 border-b border-brown-100'}`}>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm">{day}</span>
          {isToday && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Today</span>}
        </div>
        {meals.totalCalories && (
          <span className={`text-xs font-medium ${isToday ? 'text-cream/80' : 'text-brown-500'}`}>
            ~{meals.totalCalories} kcal
          </span>
        )}
      </div>

      <div className="divide-y divide-brown-50">
        {mealSlots.map(slot => {
          const meal = meals[slot.key]
          if (!meal) return null
          return (
            <div key={slot.key} className="px-4 py-3">
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0 mt-0.5">{slot.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-brown-600 uppercase tracking-wider">{slot.label}</span>
                    <span className="text-xs text-brown-300">{slot.time}</span>
                  </div>
                  <p className="text-sm text-brown-800 leading-snug">{typeof meal === 'string' ? meal : meal.description}</p>
                  {meal.macros && (
                    <div className="flex gap-2 mt-1">
                      {meal.macros.calories && <span className="text-xs text-orange-600">{meal.macros.calories} cal</span>}
                      {meal.macros.protein  && <span className="text-xs text-red-500">{meal.macros.protein}g P</span>}
                      {meal.macros.carbs    && <span className="text-xs text-yellow-600">{meal.macros.carbs}g C</span>}
                      {meal.macros.fat      && <span className="text-xs text-blue-500">{meal.macros.fat}g F</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
