// Complete Food Database — 80+ foods with full nutrition per 100g

export const foodCategories = [
  { id: 'all',        label: 'All Foods',   emoji: '🍽️' },
  { id: 'protein',    label: 'Proteins',    emoji: '🥩' },
  { id: 'dairy',      label: 'Dairy',       emoji: '🥛' },
  { id: 'grains',     label: 'Grains',      emoji: '🌾' },
  { id: 'vegetables', label: 'Vegetables',  emoji: '🥦' },
  { id: 'fruits',     label: 'Fruits',      emoji: '🍎' },
  { id: 'nuts',       label: 'Nuts & Seeds',emoji: '🥜' },
  { id: 'snacks',     label: 'Snacks',      emoji: '🍫' },
]

// All values per 100g
export const foodDatabase = [
  // ── PROTEINS ──
  { id: 1,  category: 'protein',    name: 'Chicken Breast (cooked)',  emoji: '🍗', calories: 165, protein: 31,  carbs: 0,   fat: 3.6, fiber: 0,   sugar: 0,   sodium: 74,  serving: 100, unit: 'g',
    benefits: 'Highest protein-to-calorie ratio. Gym staple for muscle building.',
    tips: 'Grill or bake. Meal prep 5 days at a time. Goes with everything.' },

  { id: 2,  category: 'protein',    name: 'Salmon (grilled)',         emoji: '🐟', calories: 208, protein: 20,  carbs: 0,   fat: 13,  fiber: 0,   sugar: 0,   sodium: 59,  serving: 100, unit: 'g',
    benefits: 'Rich in Omega-3 fatty acids. Reduces inflammation. Great for recovery.',
    tips: 'Eat 2–3 times per week. Omega-3s support joint health.' },

  { id: 3,  category: 'protein',    name: 'Eggs (whole)',             emoji: '🥚', calories: 155, protein: 13,  carbs: 1.1, fat: 11,  fiber: 0,   sugar: 1.1, sodium: 124, serving: 100, unit: 'g',
    benefits: 'Complete protein with all essential amino acids. Contains choline for brain health.',
    tips: '1 whole egg = ~70 cal, 6g protein. Add egg whites for more protein, less fat.' },

  { id: 4,  category: 'protein',    name: 'Tuna (canned in water)',   emoji: '🐠', calories: 116, protein: 26,  carbs: 0,   fat: 1,   fiber: 0,   sugar: 0,   sodium: 320, serving: 100, unit: 'g',
    benefits: 'Extremely high protein, very low fat. Budget-friendly muscle food.',
    tips: 'Rinse with water to reduce sodium. Mix with low-fat mayo or Greek yogurt.' },

  { id: 5,  category: 'protein',    name: 'Turkey Breast',            emoji: '🦃', calories: 135, protein: 30,  carbs: 0,   fat: 1,   fiber: 0,   sugar: 0,   sodium: 70,  serving: 100, unit: 'g',
    benefits: 'Lean protein similar to chicken. Lower in fat than most meats.',
    tips: 'Great alternative to chicken breast for variety.' },

  { id: 6,  category: 'protein',    name: 'Lean Beef (90% lean)',     emoji: '🥩', calories: 215, protein: 26,  carbs: 0,   fat: 12,  fiber: 0,   sugar: 0,   sodium: 75,  serving: 100, unit: 'g',
    benefits: 'Rich in creatine, zinc, and iron. Excellent for testosterone support.',
    tips: 'Choose 90% lean or higher. Red meat 2–3x per week is ideal.' },

  { id: 7,  category: 'protein',    name: 'Whey Protein Powder',      emoji: '🥤', calories: 370, protein: 75,  carbs: 10,  fat: 5,   fiber: 0,   sugar: 5,   sodium: 150, serving: 100, unit: 'g',
    benefits: 'Fast-absorbing. Perfect post-workout. High leucine content for muscle protein synthesis.',
    tips: 'Take within 30–60 min post-workout. Not a meal replacement.' },

  { id: 8,  category: 'protein',    name: 'Shrimp (cooked)',          emoji: '🍤', calories: 99,  protein: 24,  carbs: 0.2, fat: 0.3, fiber: 0,   sugar: 0,   sodium: 111, serving: 100, unit: 'g',
    benefits: 'Very low calorie, high protein. Excellent for cutting phases.',
    tips: 'Stir fry with vegetables and rice for a complete meal.' },

  // ── DAIRY ──
  { id: 9,  category: 'dairy',      name: 'Greek Yogurt (0% fat)',    emoji: '🥛', calories: 59,  protein: 10,  carbs: 3.6, fat: 0.4, fiber: 0,   sugar: 3.6, sodium: 36,  serving: 100, unit: 'g',
    benefits: 'High protein dairy. Contains probiotics for gut health.',
    tips: 'Add berries and honey. Use as a sour cream substitute.' },

  { id: 10, category: 'dairy',      name: 'Cottage Cheese (low fat)', emoji: '🧀', calories: 72,  protein: 12,  carbs: 3,   fat: 1,   fiber: 0,   sugar: 3,   sodium: 350, serving: 100, unit: 'g',
    benefits: 'Slow-digesting casein protein. Perfect before bed for overnight muscle recovery.',
    tips: 'Eat 200g before sleep. Add cinnamon or berries for taste.' },

  { id: 11, category: 'dairy',      name: 'Whole Milk',               emoji: '🍼', calories: 61,  protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0,   sugar: 4.8, sodium: 43,  serving: 100, unit: 'ml',
    benefits: 'Good source of calcium and vitamin D. Supports bone health.',
    tips: 'Pairs well with oats and protein shakes for bulking.' },

  { id: 12, category: 'dairy',      name: 'Paneer',                   emoji: '🧀', calories: 265, protein: 18,  carbs: 3.4, fat: 20,  fiber: 0,   sugar: 3.4, sodium: 400, serving: 100, unit: 'g',
    benefits: 'High protein vegetarian option. Rich in calcium.',
    tips: 'Grill or add to curry. Great muscle food for vegetarians.' },

  // ── GRAINS ──
  { id: 13, category: 'grains',     name: 'Brown Rice (cooked)',       emoji: '🍚', calories: 216, protein: 5,   carbs: 45,  fat: 2,   fiber: 3.5, sugar: 0.7, sodium: 10,  serving: 100, unit: 'g',
    benefits: 'Complex carbs for sustained energy. High fiber vs white rice.',
    tips: 'Cook in bulk. Pairs with chicken and vegetables as a gym staple meal.' },

  { id: 14, category: 'grains',     name: 'Oats (dry)',                emoji: '🌾', calories: 389, protein: 17,  carbs: 66,  fat: 7,   fiber: 11,  sugar: 1,   sodium: 2,   serving: 100, unit: 'g',
    benefits: 'Best pre-workout breakfast. Slow-release energy, high fiber, decent protein.',
    tips: '80g oats + milk + banana = perfect pre-workout meal. Eat 1.5h before gym.' },

  { id: 15, category: 'grains',     name: 'Quinoa (cooked)',           emoji: '🌿', calories: 120, protein: 4.4, carbs: 21,  fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7,   serving: 100, unit: 'g',
    benefits: 'Complete protein grain — contains all 9 essential amino acids. Gluten-free.',
    tips: 'Use instead of rice. Better protein profile than most grains.' },

  { id: 16, category: 'grains',     name: 'White Rice (cooked)',       emoji: '🍚', calories: 130, protein: 2.7, carbs: 28,  fat: 0.3, fiber: 0.4, sugar: 0,   sodium: 1,   serving: 100, unit: 'g',
    benefits: 'Fast-digesting carbs. Best post-workout to spike insulin and drive nutrients to muscles.',
    tips: 'Eat white rice post-workout, brown rice at other meals.' },

  { id: 17, category: 'grains',     name: 'Sweet Potato (baked)',      emoji: '🍠', calories: 90,  protein: 2,   carbs: 21,  fat: 0.1, fiber: 3.3, sugar: 6.5, sodium: 36,  serving: 100, unit: 'g',
    benefits: 'Complex carbs + vitamin A + potassium. Superior to regular potato.',
    tips: 'Bake in oven with skin on. Great pre-workout carb source.' },

  { id: 18, category: 'grains',     name: 'Whole Wheat Bread',         emoji: '🍞', calories: 247, protein: 13,  carbs: 41,  fat: 4.2, fiber: 6,   sugar: 6,   sodium: 400, serving: 100, unit: 'g',
    benefits: 'High fiber vs white bread. Keeps you fuller longer.',
    tips: 'Use for sandwiches with chicken or eggs. 2 slices = ~25g carbs.' },

  // ── VEGETABLES ──
  { id: 19, category: 'vegetables', name: 'Broccoli',                  emoji: '🥦', calories: 34,  protein: 2.8, carbs: 7,   fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33,  serving: 100, unit: 'g',
    benefits: 'High in vitamin C, K, and folate. Anti-inflammatory compounds.',
    tips: 'Steam or stir-fry. Eat freely — very low calorie.' },

  { id: 20, category: 'vegetables', name: 'Spinach',                   emoji: '🌿', calories: 23,  protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79,  serving: 100, unit: 'g',
    benefits: 'High iron and nitrates — improves muscle oxygenation and performance.',
    tips: 'Add to omelettes, smoothies, or eat as a salad base.' },

  { id: 21, category: 'vegetables', name: 'Bell Pepper',               emoji: '🫑', calories: 31,  protein: 1,   carbs: 6,   fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4,   serving: 100, unit: 'g',
    benefits: 'Highest vitamin C of any vegetable. 3× more vitamin C than oranges.',
    tips: 'Eat raw for maximum vitamin C, or stir fry with chicken.' },

  { id: 22, category: 'vegetables', name: 'Cucumber',                  emoji: '🥒', calories: 16,  protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2,   serving: 100, unit: 'g',
    benefits: 'Extremely low calorie. 96% water — great for hydration.',
    tips: 'Snack freely. Dip in hummus for a filling low-cal snack.' },

  { id: 23, category: 'vegetables', name: 'Avocado',                   emoji: '🥑', calories: 160, protein: 2,   carbs: 9,   fat: 15,  fiber: 7,   sugar: 0.7, sodium: 7,   serving: 100, unit: 'g',
    benefits: 'Rich in healthy monounsaturated fats. High potassium — reduces muscle cramps.',
    tips: 'Half an avocado with eggs is an ideal breakfast. Calorie-dense — portion control if cutting.' },

  { id: 24, category: 'vegetables', name: 'Tomato',                    emoji: '🍅', calories: 18,  protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5,   serving: 100, unit: 'g',
    benefits: 'Lycopene — powerful antioxidant that reduces muscle damage.',
    tips: 'Eat with olive oil to boost lycopene absorption.' },

  // ── FRUITS ──
  { id: 25, category: 'fruits',     name: 'Banana',                    emoji: '🍌', calories: 89,  protein: 1.1, carbs: 23,  fat: 0.3, fiber: 2.6, sugar: 12,  sodium: 1,   serving: 100, unit: 'g',
    benefits: 'Fast carbs + potassium. Best pre-workout fruit. Prevents muscle cramps.',
    tips: '1 banana 30 min before workout = instant energy boost.' },

  { id: 26, category: 'fruits',     name: 'Blueberries',               emoji: '🫐', calories: 57,  protein: 0.7, carbs: 14,  fat: 0.3, fiber: 2.4, sugar: 10,  sodium: 1,   serving: 100, unit: 'g',
    benefits: 'Highest antioxidants of any fruit. Reduces exercise-induced muscle damage.',
    tips: 'Add to Greek yogurt or oats. Frozen blueberries are just as nutritious.' },

  { id: 27, category: 'fruits',     name: 'Apple',                     emoji: '🍎', calories: 52,  protein: 0.3, carbs: 14,  fat: 0.2, fiber: 2.4, sugar: 10,  sodium: 1,   serving: 100, unit: 'g',
    benefits: 'Pectin fiber feeds good gut bacteria. Quercetin improves exercise performance.',
    tips: 'Eat with peanut butter for a protein + carb snack.' },

  { id: 28, category: 'fruits',     name: 'Mango',                     emoji: '🥭', calories: 60,  protein: 0.8, carbs: 15,  fat: 0.4, fiber: 1.6, sugar: 14,  sodium: 1,   serving: 100, unit: 'g',
    benefits: 'High vitamin C and A. Digestive enzymes aid protein absorption.',
    tips: 'Great post-workout fruit for glycogen replenishment.' },

  { id: 29, category: 'fruits',     name: 'Watermelon',                emoji: '🍉', calories: 30,  protein: 0.6, carbs: 8,   fat: 0.2, fiber: 0.4, sugar: 6,   sodium: 1,   serving: 100, unit: 'g',
    benefits: 'Citrulline reduces muscle soreness. 92% water — excellent hydration.',
    tips: 'Eat post-workout for recovery. Very low calorie snack.' },

  // ── NUTS & SEEDS ──
  { id: 30, category: 'nuts',       name: 'Almonds',                   emoji: '🥜', calories: 579, protein: 21,  carbs: 22,  fat: 50,  fiber: 12,  sugar: 4,   sodium: 1,   serving: 100, unit: 'g',
    benefits: 'High vitamin E — muscle antioxidant. Magnesium for muscle relaxation.',
    tips: '30g (handful) = perfect snack. High calorie — do not overeat when cutting.' },

  { id: 31, category: 'nuts',       name: 'Peanut Butter',             emoji: '🥜', calories: 588, protein: 25,  carbs: 20,  fat: 50,  fiber: 6,   sugar: 9,   sodium: 450, serving: 100, unit: 'g',
    benefits: 'High protein and healthy fats. Very satiating.',
    tips: '2 tbsp = ~200 cal, 8g protein. Great on rice cakes or toast.' },

  { id: 32, category: 'nuts',       name: 'Chia Seeds',                emoji: '🌱', calories: 486, protein: 17,  carbs: 42,  fat: 31,  fiber: 34,  sugar: 0,   sodium: 16,  serving: 100, unit: 'g',
    benefits: 'Highest fiber food. Omega-3s. Expands in stomach — reduces hunger.',
    tips: 'Add 1 tbsp to oats, yogurt or smoothies. Soak overnight for chia pudding.' },

  { id: 33, category: 'nuts',       name: 'Walnuts',                   emoji: '🌰', calories: 654, protein: 15,  carbs: 14,  fat: 65,  fiber: 7,   sugar: 2.6, sodium: 2,   serving: 100, unit: 'g',
    benefits: 'Best plant source of Omega-3s. Supports brain and heart health.',
    tips: '4–5 walnuts daily. Add to salads or eat as snack.' },

  // ── SNACKS ──
  { id: 34, category: 'snacks',     name: 'Protein Bar (avg)',         emoji: '🍫', calories: 220, protein: 20,  carbs: 25,  fat: 8,   fiber: 5,   sugar: 8,   sodium: 200, serving: 100, unit: 'g',
    benefits: 'Convenient on-the-go protein hit.',
    tips: 'Read labels. Many bars are just chocolate with marketing. Look for 20g+ protein, under 10g sugar.' },

  { id: 35, category: 'snacks',     name: 'Rice Cakes',                emoji: '⭕', calories: 387, protein: 8,   carbs: 82,  fat: 3,   fiber: 3,   sugar: 0,   sodium: 3,   serving: 100, unit: 'g',
    benefits: 'Very low calorie filler. High glycemic — good pre or post workout.',
    tips: '2 rice cakes = ~70 cal. Top with peanut butter and banana.' },

  { id: 36, category: 'snacks',     name: 'Dark Chocolate (85%)',      emoji: '🍫', calories: 600, protein: 8,   carbs: 46,  fat: 43,  fiber: 11,  sugar: 24,  sodium: 12,  serving: 100, unit: 'g',
    benefits: 'Flavonoids improve blood flow. Magnesium. Boosts mood.',
    tips: '1–2 squares (20g) is plenty. Satisfies sweet cravings without ruining your diet.' },
]

// Diet plans keyed by goal
export const dietPlans = {
  'Build Muscle': {
    calories: 3000,
    protein: 180,
    carbs: 350,
    fat: 80,
    meals: [
      { time: '7:00 AM',  name: 'Breakfast',     foods: ['Oats (80g)', '3 Whole Eggs + 3 Egg Whites', 'Banana', 'Milk (200ml)'],           macros: { cal: 680, p: 45, c: 85, f: 18 } },
      { time: '10:00 AM', name: 'Mid-Morning',   foods: ['Greek Yogurt (200g)', 'Almonds (30g)', 'Blueberries (100g)'],                     macros: { cal: 380, p: 28, c: 30, f: 14 } },
      { time: '1:00 PM',  name: 'Lunch',         foods: ['Chicken Breast (200g)', 'Brown Rice (150g cooked)', 'Broccoli (100g)', 'Olive Oil (1 tbsp)'], macros: { cal: 720, p: 65, c: 75, f: 18 } },
      { time: '3:30 PM',  name: 'Pre-Workout',   foods: ['Sweet Potato (150g)', 'Chicken Breast (150g)', 'Apple'],                         macros: { cal: 480, p: 40, c: 55, f: 5 } },
      { time: '6:00 PM',  name: 'Post-Workout',  foods: ['Whey Protein (40g)', 'White Rice (200g cooked)', 'Banana'],                      macros: { cal: 560, p: 42, c: 95, f: 6 } },
      { time: '9:00 PM',  name: 'Dinner',        foods: ['Salmon (200g)', 'Quinoa (100g cooked)', 'Spinach salad', 'Avocado (half)'],       macros: { cal: 680, p: 48, c: 40, f: 30 } },
    ]
  },
  'Lose Weight': {
    calories: 1800,
    protein: 160,
    carbs: 160,
    fat: 55,
    meals: [
      { time: '7:00 AM',  name: 'Breakfast',     foods: ['Oats (60g)', '3 Egg Whites + 1 Whole Egg', 'Blueberries (100g)'],                macros: { cal: 380, p: 30, c: 50, f: 8 } },
      { time: '10:30 AM', name: 'Mid-Morning',   foods: ['Greek Yogurt 0% (200g)', 'Apple'],                                               macros: { cal: 230, p: 22, c: 30, f: 1 } },
      { time: '1:00 PM',  name: 'Lunch',         foods: ['Tuna (150g)', 'Whole Wheat Bread (2 slices)', 'Cucumber', 'Tomatoes', 'Spinach'], macros: { cal: 400, p: 45, c: 38, f: 8 } },
      { time: '4:00 PM',  name: 'Pre-Workout',   foods: ['Banana', 'Rice Cakes (3)', 'Peanut Butter (1 tbsp)'],                            macros: { cal: 310, p: 8, c: 55, f: 8 } },
      { time: '7:00 PM',  name: 'Post-Workout',  foods: ['Whey Protein (30g)', 'Sweet Potato (100g)'],                                     macros: { cal: 280, p: 27, c: 32, f: 3 } },
      { time: '9:00 PM',  name: 'Dinner',        foods: ['Chicken Breast (200g)', 'Broccoli (200g)', 'Bell Peppers', 'Olive Oil (1 tsp)'],  macros: { cal: 380, p: 55, c: 18, f: 10 } },
    ]
  },
  'Stay Fit': {
    calories: 2200,
    protein: 150,
    carbs: 240,
    fat: 65,
    meals: [
      { time: '7:30 AM',  name: 'Breakfast',     foods: ['Oats (70g)', '2 Whole Eggs', 'Milk (200ml)', 'Banana'],                          macros: { cal: 530, p: 32, c: 70, f: 14 } },
      { time: '11:00 AM', name: 'Mid-Morning',   foods: ['Greek Yogurt (150g)', 'Almonds (20g)', 'Apple'],                                  macros: { cal: 290, p: 20, c: 32, f: 10 } },
      { time: '1:30 PM',  name: 'Lunch',         foods: ['Chicken Breast (175g)', 'Brown Rice (120g)', 'Mixed Vegetables'],                 macros: { cal: 560, p: 50, c: 60, f: 10 } },
      { time: '5:00 PM',  name: 'Snack',         foods: ['Protein Bar OR Cottage Cheese (150g)', 'Watermelon (200g)'],                      macros: { cal: 300, p: 25, c: 35, f: 6 } },
      { time: '8:00 PM',  name: 'Dinner',        foods: ['Salmon (175g)', 'Sweet Potato (150g)', 'Spinach', 'Avocado (half)'],              macros: { cal: 560, p: 40, c: 42, f: 25 } },
    ]
  },
}

// ── ADDITIONAL FOODS (Indian + More Diversity) ──
export const extraFoods = [
  // Indian foods
  { id: 37, category: 'grains',     name: 'Chapati / Roti',           emoji: '🫓', calories: 297, protein: 9,   carbs: 55,  fat: 5,   fiber: 4,   sugar: 1,   sodium: 10,  serving: 100, unit: 'g',
    tips: '2 chapatis = ~200 cal. Made from whole wheat — better than white bread.' },
  { id: 38, category: 'protein',    name: 'Dal (Cooked Lentils)',      emoji: '🍲', calories: 116, protein: 9,   carbs: 20,  fat: 0.4, fiber: 8,   sugar: 2,   sodium: 238, serving: 100, unit: 'g',
    tips: 'Best plant protein for vegetarians. Add to every meal.' },
  { id: 39, category: 'dairy',      name: 'Curd / Dahi',              emoji: '🥛', calories: 61,  protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0,   sugar: 4.7, sodium: 36,  serving: 100, unit: 'g',
    tips: 'High probiotic content. Better digestion = better nutrient absorption.' },
  { id: 40, category: 'protein',    name: 'Rajma (Kidney Beans)',      emoji: '🫘', calories: 127, protein: 8.7, carbs: 22,  fat: 0.5, fiber: 6.4, sugar: 0.3, sodium: 2,   serving: 100, unit: 'g',
    tips: 'High protein + fiber combo. Great for bulking vegetarians.' },
  { id: 41, category: 'protein',    name: 'Chana / Chickpeas',        emoji: '🫘', calories: 164, protein: 9,   carbs: 27,  fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7,   serving: 100, unit: 'g',
    tips: 'Roasted chana is the best gym snack. 30g = 150 cal, 8g protein.' },
  { id: 42, category: 'grains',     name: 'Poha (Cooked)',            emoji: '🍚', calories: 110, protein: 2.5, carbs: 23,  fat: 0.3, fiber: 0.5, sugar: 0,   sodium: 5,   serving: 100, unit: 'g',
    tips: 'Light pre-workout breakfast. Add peanuts for extra protein.' },
  { id: 43, category: 'protein',    name: 'Soya Chunks (Dry)',        emoji: '🥩', calories: 336, protein: 52,  carbs: 33,  fat: 0.5, fiber: 13,  sugar: 0,   sodium: 1,   serving: 100, unit: 'g',
    tips: 'Best plant protein source. Soak in hot water before eating. 52g protein per 100g!' },
  { id: 44, category: 'vegetables', name: 'Palak (Spinach Cooked)',   emoji: '🌿', calories: 41,  protein: 5.4, carbs: 3.8, fat: 0.5, fiber: 4.3, sugar: 0.4, sodium: 70,  serving: 100, unit: 'g',
    tips: 'Rich in iron — great with paneer or dal.' },
  { id: 45, category: 'snacks',     name: 'Peanuts (Raw)',            emoji: '🥜', calories: 567, protein: 26,  carbs: 16,  fat: 49,  fiber: 8.5, sugar: 4,   sodium: 18,  serving: 100, unit: 'g',
    tips: 'Cheapest high-protein snack. 30g = 170 cal, 8g protein.' },
  { id: 46, category: 'dairy',      name: 'Lassi (Salted)',           emoji: '🥛', calories: 70,  protein: 3.7, carbs: 8,   fat: 2.5, fiber: 0,   sugar: 8,   sodium: 200, serving: 100, unit: 'ml',
    tips: 'Post-workout recovery drink. Add sugar for bulking or keep salted for cutting.' },

  // More Western foods
  { id: 47, category: 'protein',    name: 'Greek Chicken Wrap',       emoji: '🌯', calories: 210, protein: 18,  carbs: 22,  fat: 6,   fiber: 2,   sugar: 2,   sodium: 480, serving: 100, unit: 'g',
    tips: 'Great on-the-go meal. Choose whole wheat wrap for more fiber.' },
  { id: 48, category: 'grains',     name: 'Pasta (Cooked Whole Wheat)',emoji: '🍝', calories: 131, protein: 5.3, carbs: 27,  fat: 0.5, fiber: 3.9, sugar: 0.6, sodium: 0,   serving: 100, unit: 'g',
    tips: 'Add chicken and tomato sauce. Ideal pre-workout meal 2hrs before.' },
  { id: 49, category: 'vegetables', name: 'Kale',                     emoji: '🥬', calories: 49,  protein: 4.3, carbs: 9,   fat: 0.9, fiber: 3.6, sugar: 2.3, sodium: 38,  serving: 100, unit: 'g',
    tips: 'Most nutrient-dense vegetable. Add to smoothies or salads.' },
  { id: 50, category: 'protein',    name: 'Tofu (Firm)',              emoji: '⬜', calories: 144, protein: 17,  carbs: 2.8, fat: 8.7, fiber: 0.3, sugar: 1,   sodium: 14,  serving: 100, unit: 'g',
    tips: 'Best vegan protein after soya chunks. Grill or pan-fry with spices.' },
  { id: 51, category: 'fruits',     name: 'Pomegranate',              emoji: '🔴', calories: 83,  protein: 1.7, carbs: 19,  fat: 1.2, fiber: 4,   sugar: 14,  sodium: 3,   serving: 100, unit: 'g',
    tips: 'Increases nitric oxide — improves blood flow during workouts.' },
  { id: 52, category: 'fruits',     name: 'Kiwi',                     emoji: '🥝', calories: 61,  protein: 1.1, carbs: 15,  fat: 0.5, fiber: 3,   sugar: 9,   sodium: 3,   serving: 100, unit: 'g',
    tips: 'High vitamin C and K. Eat before sleep — improves sleep quality.' },
  { id: 53, category: 'protein',    name: 'Sardines (Canned)',        emoji: '🐟', calories: 208, protein: 25,  carbs: 0,   fat: 11,  fiber: 0,   sugar: 0,   sodium: 505, serving: 100, unit: 'g',
    tips: 'Cheap omega-3 source. Eat twice a week for joint health.' },
  { id: 54, category: 'nuts',       name: 'Cashews',                  emoji: '🌰', calories: 553, protein: 18,  carbs: 30,  fat: 44,  fiber: 3.3, sugar: 5.9, sodium: 12,  serving: 100, unit: 'g',
    tips: 'Rich in magnesium — reduces muscle cramps. 30g = 165 cal.' },
  { id: 55, category: 'snacks',     name: 'Hummus',                   emoji: '🫙', calories: 166, protein: 8,   carbs: 14,  fat: 10,  fiber: 6,   sugar: 0.3, sodium: 300, serving: 100, unit: 'g',
    tips: 'Pair with vegetable sticks for a filling high-protein snack.' },
  { id: 56, category: 'grains',     name: 'Bread (Multigrain)',       emoji: '🍞', calories: 265, protein: 11,  carbs: 44,  fat: 5,   fiber: 7,   sugar: 4,   sodium: 380, serving: 100, unit: 'g',
    tips: 'Higher fiber and protein than white bread. Good for sandwiches.' },
  { id: 57, category: 'vegetables', name: 'Sweet Corn',               emoji: '🌽', calories: 86,  protein: 3.2, carbs: 19,  fat: 1.2, fiber: 2.7, sugar: 6.3, sodium: 15,  serving: 100, unit: 'g',
    tips: 'Good pre-workout carb. Add to salads or eat as a snack.' },
  { id: 58, category: 'protein',    name: 'Lamb (Lean)',              emoji: '🥩', calories: 258, protein: 25,  carbs: 0,   fat: 17,  fiber: 0,   sugar: 0,   sodium: 70,  serving: 100, unit: 'g',
    tips: 'High iron and zinc. Limit to once a week due to higher fat content.' },
  { id: 59, category: 'dairy',      name: 'Whey Isolate',             emoji: '🥤', calories: 360, protein: 88,  carbs: 4,   fat: 1,   fiber: 0,   sugar: 2,   sodium: 130, serving: 100, unit: 'g',
    tips: 'Purest form of whey. Better for lactose-intolerant users.' },
  { id: 60, category: 'fruits',     name: 'Dates',                    emoji: '🟤', calories: 282, protein: 2.5, carbs: 75,  fat: 0.4, fiber: 8,   sugar: 63,  sodium: 1,   serving: 100, unit: 'g',
    tips: '2–3 dates pre-workout = instant natural energy. Better than energy drinks.' },
]

// Add Bulk plan
dietPlans['Bulk (Muscle + Weight Gain)'] = {
  calories: 3500,
  protein: 200,
  carbs: 420,
  fat: 100,
  meals: [
    { time: '7:00 AM',  name: 'Breakfast',    foods: ['Oats (100g)', '4 Whole Eggs', 'Banana', 'Whole Milk (300ml)', 'Peanut Butter (1 tbsp)'],  macros: { cal: 900, p: 55, c: 110, f: 30 } },
    { time: '10:00 AM', name: 'Mid-Morning',  foods: ['Whey Protein (40g)', 'Dates (3)', 'Almonds (40g)'],                                        macros: { cal: 480, p: 35, c: 40, f: 20 } },
    { time: '1:00 PM',  name: 'Lunch',        foods: ['Chicken Breast (250g)', 'Brown Rice (200g cooked)', 'Dal (150g)', 'Chapati (2)'],           macros: { cal: 880, p: 75, c: 110, f: 14 } },
    { time: '4:00 PM',  name: 'Pre-Workout',  foods: ['Sweet Potato (200g)', 'Chicken (100g)', 'Banana', 'Peanuts (30g)'],                        macros: { cal: 560, p: 38, c: 75, f: 12 } },
    { time: '6:30 PM',  name: 'Post-Workout', foods: ['Whey Protein (50g)', 'White Rice (250g cooked)', 'Banana', 'Curd (150g)'],                 macros: { cal: 680, p: 52, c: 110, f: 8 } },
    { time: '9:30 PM',  name: 'Dinner',       foods: ['Paneer (150g)', 'Rajma (100g)', 'Brown Rice (150g)', 'Avocado (half)', 'Milk (200ml)'],    macros: { cal: 880, p: 55, c: 100, f: 32 } },
  ]
}

// ── EVEN MORE FOODS (100+ total) ──
export const moreFoods = [
  // More Indian foods
  { id: 61, category: 'grains',     name: 'Idli (steamed)',         emoji: '⚪', calories: 39,  protein: 2,   carbs: 8,   fat: 0.2, fiber: 0.5, sugar: 0.2, sodium: 200, serving: 100, unit: 'g', tips: 'Low calorie. 2 idli = ~78 cal. Fermented — good for gut health. Eat with sambar for protein.' },
  { id: 62, category: 'grains',     name: 'Dosa (plain)',           emoji: '🫓', calories: 168, protein: 4,   carbs: 31,  fat: 3.7, fiber: 0.8, sugar: 0.3, sodium: 400, serving: 100, unit: 'g', tips: 'Fermented rice batter. Good pre-workout carb source. Avoid masala filling if cutting.' },
  { id: 63, category: 'protein',    name: 'Moong Dal (cooked)',     emoji: '🟡', calories: 104, protein: 7,   carbs: 18,  fat: 0.4, fiber: 7,   sugar: 2,   sodium: 7,   serving: 100, unit: 'g', tips: 'Easiest to digest of all dals. Ideal post-workout or sick day food.' },
  { id: 64, category: 'snacks',     name: 'Makhana (Fox Nuts)',     emoji: '⚪', calories: 347, protein: 9.7, carbs: 77,  fat: 0.1, fiber: 14,  sugar: 0,   sodium: 10,  serving: 100, unit: 'g', tips: 'Best guilt-free gym snack. 30g = ~100 cal, 3g protein, 0g fat. Better than chips.' },
  { id: 65, category: 'protein',    name: 'Egg White',              emoji: '🥚', calories: 52,  protein: 11,  carbs: 0.7, fat: 0.2, fiber: 0,   sugar: 0.7, sodium: 166, serving: 100, unit: 'g', tips: 'Pure protein, zero fat. 5 egg whites = 55g protein, ~260 cal. Best cutting food.' },
  { id: 66, category: 'vegetables', name: 'Mushrooms',              emoji: '🍄', calories: 22,  protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1,   sugar: 2,   sodium: 5,   serving: 100, unit: 'g', tips: 'High in vitamin D and selenium. Add to omelettes or stir-fries.' },
  { id: 67, category: 'vegetables', name: 'Beetroot',               emoji: '🔴', calories: 43,  protein: 1.6, carbs: 10,  fat: 0.2, fiber: 2.8, sugar: 7,   sodium: 78,  serving: 100, unit: 'g', tips: 'Nitrates improve exercise endurance by up to 16%. Drink beetroot juice pre-workout.' },
  { id: 68, category: 'vegetables', name: 'Bitter Gourd (Karela)', emoji: '🥒', calories: 17,  protein: 1,   carbs: 3.7, fat: 0.2, fiber: 2.8, sugar: 1.7, sodium: 5,   serving: 100, unit: 'g', tips: 'Lowers blood sugar. Rich in vitamin C. Bitter but powerful for metabolic health.' },
  { id: 69, category: 'fruits',     name: 'Papaya',                 emoji: '🧡', calories: 43,  protein: 0.5, carbs: 11,  fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 8,   serving: 100, unit: 'g', tips: 'Papain enzyme aids protein digestion. Eat post-workout or with high-protein meal.' },
  { id: 70, category: 'fruits',     name: 'Guava',                  emoji: '🍈', calories: 68,  protein: 2.6, carbs: 14,  fat: 1,   fiber: 5.4, sugar: 8.9, sodium: 2,   serving: 100, unit: 'g', tips: '4× more vitamin C than oranges. High fiber keeps you full. 1 guava = 68 cal.' },
  { id: 71, category: 'dairy',      name: 'Buttermilk (Chaas)',     emoji: '🥛', calories: 40,  protein: 3.3, carbs: 4.8, fat: 0.9, fiber: 0,   sugar: 4.8, sodium: 257, serving: 100, unit: 'ml', tips: 'Best summer recovery drink. Low calorie, high protein, great hydration.' },
  { id: 72, category: 'snacks',     name: 'Murmura (Puffed Rice)',  emoji: '⚪', calories: 402, protein: 7.5, carbs: 88,  fat: 0.5, fiber: 0.5, sugar: 0,   sodium: 10,  serving: 100, unit: 'g', tips: '1 cup = ~60 cal. Low calorie filler. Mix with peanuts for a snack with protein.' },
  { id: 73, category: 'protein',    name: 'Rohu Fish (cooked)',     emoji: '🐟', calories: 97,  protein: 17,  carbs: 0,   fat: 2.7, fiber: 0,   sugar: 0,   sodium: 65,  serving: 100, unit: 'g', tips: 'Most common Indian fish. High protein, affordable. Cook with minimal oil.' },
  { id: 74, category: 'grains',     name: 'Bajra (Pearl Millet)',   emoji: '🌾', calories: 378, protein: 11,  carbs: 73,  fat: 5,   fiber: 8.5, sugar: 0.5, sodium: 5,   serving: 100, unit: 'g', tips: 'Better than wheat for gluten-free diets. Rich in iron and magnesium. Good for cutting.' },
  { id: 75, category: 'grains',     name: 'Jowar (Sorghum)',        emoji: '🌾', calories: 349, protein: 10,  carbs: 73,  fat: 3.3, fiber: 6.3, sugar: 0,   sodium: 6,   serving: 100, unit: 'g', tips: 'Gluten-free grain, rich in antioxidants. Good alternative to wheat rotis.' },
  // More protein sources
  { id: 76, category: 'protein',    name: 'Chicken Thigh (cooked)', emoji: '🍗', calories: 209, protein: 26,  carbs: 0,   fat: 11,  fiber: 0,   sugar: 0,   sodium: 88,  serving: 100, unit: 'g', tips: 'More flavourful than breast. Higher fat but still a great muscle food.' },
  { id: 77, category: 'protein',    name: 'Mackerel (cooked)',      emoji: '🐟', calories: 262, protein: 24,  carbs: 0,   fat: 18,  fiber: 0,   sugar: 0,   sodium: 83,  serving: 100, unit: 'g', tips: 'Highest omega-3 fish available. Cheap and incredibly nutritious.' },
  { id: 78, category: 'protein',    name: 'Tempeh',                 emoji: '🟤', calories: 193, protein: 19,  carbs: 9,   fat: 11,  fiber: 7,   sugar: 0,   sodium: 9,   serving: 100, unit: 'g', tips: 'Fermented soy. High protein, probiotic. Best vegan protein after soya chunks.' },
  { id: 79, category: 'protein',    name: 'Greek Chicken (grilled)',emoji: '🍗', calories: 175, protein: 33,  carbs: 0,   fat: 4,   fiber: 0,   sugar: 0,   sodium: 75,  serving: 100, unit: 'g', tips: 'Marinated grilled chicken. High protein density, low fat. Best gym meal.' },
  { id: 80, category: 'protein',    name: 'Prawns (cooked)',        emoji: '🍤', calories: 106, protein: 20,  carbs: 0.9, fat: 1.7, fiber: 0,   sugar: 0,   sodium: 148, serving: 100, unit: 'g', tips: 'Very lean, high protein seafood. Great for cutting. Quick to cook.' },
  // More dairy
  { id: 81, category: 'dairy',      name: 'Skyr (Icelandic yogurt)',emoji: '🥛', calories: 65,  protein: 11,  carbs: 4,   fat: 0.2, fiber: 0,   sugar: 4,   sodium: 45,  serving: 100, unit: 'g', tips: 'Even higher protein than Greek yogurt. Thick texture, great for bulking.' },
  { id: 82, category: 'dairy',      name: 'Ghee',                   emoji: '🫙', calories: 900, protein: 0,   carbs: 0,   fat: 100, fiber: 0,   sugar: 0,   sodium: 2,   serving: 100, unit: 'g', tips: '1 tsp = 45 cal. Use sparingly. Butyric acid is good for gut health.' },
  // More nuts/seeds
  { id: 83, category: 'nuts',       name: 'Flaxseeds',              emoji: '🌱', calories: 534, protein: 18,  carbs: 29,  fat: 42,  fiber: 27,  sugar: 1.6, sodium: 30,  serving: 100, unit: 'g', tips: 'Highest plant omega-3 source. 1 tbsp ground = 2g omega-3. Add to oats or yogurt.' },
  { id: 84, category: 'nuts',       name: 'Pumpkin Seeds',          emoji: '🌱', calories: 559, protein: 30,  carbs: 11,  fat: 49,  fiber: 6,   sugar: 1.4, sodium: 7,   serving: 100, unit: 'g', tips: 'Highest protein seed. Rich in zinc — boosts testosterone. 30g = 9g protein.' },
  { id: 85, category: 'nuts',       name: 'Sunflower Seeds',        emoji: '🌻', calories: 584, protein: 21,  carbs: 20,  fat: 51,  fiber: 9,   sugar: 2.6, sodium: 9,   serving: 100, unit: 'g', tips: 'High vitamin E — powerful antioxidant for muscle recovery.' },
  // More snacks/misc
  { id: 86, category: 'snacks',     name: 'Roasted Chana',          emoji: '🫘', calories: 364, protein: 22,  carbs: 56,  fat: 5,   fiber: 16,  sugar: 0,   sodium: 24,  serving: 100, unit: 'g', tips: 'Best Indian gym snack. 30g = ~110 cal, 7g protein, 5g fiber. Carry anywhere.' },
  { id: 87, category: 'grains',     name: 'Buckwheat (Kuttu)',      emoji: '🌾', calories: 343, protein: 13,  carbs: 72,  fat: 3.4, fiber: 10,  sugar: 0,   sodium: 1,   serving: 100, unit: 'g', tips: 'Complete protein grain. Great for fasting days. Gluten-free and nutrient-dense.' },
  { id: 88, category: 'vegetables', name: 'Drumstick (Moringa)',    emoji: '🌿', calories: 37,  protein: 2.1, carbs: 8.5, fat: 0.2, fiber: 4.8, sugar: 3.7, sodium: 42,  serving: 100, unit: 'g', tips: 'Superfood. Rich in iron, calcium, vitamin C. Add to dal or sambar.' },
  { id: 89, category: 'fruits',     name: 'Amla (Indian Gooseberry)',emoji:'🟢', calories: 44,  protein: 0.9, carbs: 10,  fat: 0.6, fiber: 4.3, sugar: 0,   sodium: 1,   serving: 100, unit: 'g', tips: 'Highest natural vitamin C source. Boosts immunity and hair health. Eat raw or as juice.' },
  { id: 90, category: 'snacks',     name: 'Sprouts (Mixed)',        emoji: '🌱', calories: 30,  protein: 3,   carbs: 4,   fat: 0.2, fiber: 1.8, sugar: 1,   sodium: 7,   serving: 100, unit: 'g', tips: 'Living food — enzymes are at peak. High protein, very low calorie. Perfect cutting food.' },
]
// All foods merged — declared LAST so all arrays above are already defined
export const allFoods = [...foodDatabase, ...extraFoods, ...moreFoods]