// FitForge Food Database — Practical, cooked, real-world foods
// All nutrition values per 100g of the food AS EATEN (cooked/prepared)

export const foodCategories = [
  { id: 'all',          label: 'All Foods',         emoji: '🍽️' },
  { id: 'breakfast',    label: 'Breakfast',          emoji: '🌅' },
  { id: 'protein',      label: 'Proteins & Meats',  emoji: '🥩' },
  { id: 'indian_meals', label: 'Indian Meals',       emoji: '🍛' },
  { id: 'dal_legumes',  label: 'Dal & Legumes',      emoji: '🫘' },
  { id: 'dairy',        label: 'Dairy',              emoji: '🥛' },
  { id: 'rice_roti',    label: 'Rice & Roti',        emoji: '🍚' },
  { id: 'salads_veg',   label: 'Salads & Veggies',   emoji: '🥗' },
  { id: 'fruits',       label: 'Fruits',             emoji: '🍎' },
  { id: 'snacks',       label: 'Snacks',             emoji: '🍿' },
  { id: 'drinks',       label: 'Drinks',             emoji: '🥤' },
]

export const foodDatabase = [

  // ─── BREAKFAST ───
  { id: 1, category: 'breakfast', name: 'Oats with Milk (cooked)',
    emoji: '🥣', calories: 130, protein: 5, carbs: 22, fat: 3, fiber: 2.5, sugar: 4, sodium: 50, serving: 100, unit: 'g',
    tips: 'Best pre-workout breakfast. Cook 80g oats in 200ml milk = ~380 cal, 18g protein. Add banana for carbs.' },

  { id: 2, category: 'breakfast', name: 'Boiled Eggs (2 eggs)',
    emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1, sodium: 124, serving: 100, unit: 'g',
    tips: '2 boiled eggs = ~140 cal, 12g protein. Best simple breakfast. Add salt and pepper.' },

  { id: 3, category: 'breakfast', name: 'Omelette (2 egg, no oil)',
    emoji: '🍳', calories: 147, protein: 12, carbs: 1, fat: 10, fiber: 0, sugar: 0.5, sodium: 200, serving: 100, unit: 'g',
    tips: 'Add onion, tomato, spinach for nutrients. Use non-stick pan with minimal oil.' },

  { id: 4, category: 'breakfast', name: 'Poha (cooked)',
    emoji: '🍚', calories: 110, protein: 2.5, carbs: 23, fat: 2, fiber: 0.8, sugar: 0, sodium: 180, serving: 100, unit: 'g',
    tips: 'Light pre-workout meal. Add peanuts (+protein) and lemon. 1 plate ~250g = 275 cal.' },

  { id: 5, category: 'breakfast', name: 'Upma (rava, cooked)',
    emoji: '🍲', calories: 108, protein: 3, carbs: 18, fat: 3, fiber: 1.5, sugar: 0, sodium: 220, serving: 100, unit: 'g',
    tips: 'Add vegetables to increase nutrients. 1 bowl ~200g = 216 cal. Good pre-workout carb.' },

  { id: 6, category: 'breakfast', name: 'Idli (steamed, 2 pieces)',
    emoji: '⚪', calories: 39, protein: 2, carbs: 8, fat: 0.2, fiber: 0.5, sugar: 0, sodium: 200, serving: 100, unit: 'g',
    tips: '2 idli = ~78 cal. Very low calorie. Fermented so easy to digest. Eat with sambar for protein.' },

  { id: 7, category: 'breakfast', name: 'Dosa (plain, one)',
    emoji: '🫓', calories: 168, protein: 4, carbs: 31, fat: 3.7, fiber: 0.8, sugar: 0, sodium: 350, serving: 100, unit: 'g',
    tips: '1 plain dosa ~85g = 143 cal. Add sambar and chutney. Avoid butter/oil dosas when cutting.' },

  { id: 8, category: 'breakfast', name: 'Aloo Paratha (with butter)',
    emoji: '🫓', calories: 260, protein: 5.5, carbs: 35, fat: 11, fiber: 2, sugar: 1, sodium: 380, serving: 100, unit: 'g',
    tips: '1 paratha ~120g = 312 cal. High calorie — good for bulking, limit when cutting. Skip extra butter.' },

  { id: 9, category: 'breakfast', name: 'Besan Cheela (2 pieces)',
    emoji: '🟡', calories: 185, protein: 10, carbs: 22, fat: 6, fiber: 4, sugar: 2, sodium: 280, serving: 100, unit: 'g',
    tips: 'Gram flour pancake — high protein breakfast. Add onion, spinach, coriander. Better than paratha.' },

  { id: 10, category: 'breakfast', name: 'Bread Omelette (2 egg)',
    emoji: '🥪', calories: 230, protein: 11, carbs: 22, fat: 11, fiber: 1.5, sugar: 2, sodium: 450, serving: 100, unit: 'g',
    tips: '2 egg + 2 bread slices = ~350 cal. Quick post-gym breakfast. Use brown bread for more fiber.' },

  // ─── PROTEINS & MEATS ───
  { id: 11, category: 'protein', name: 'Chicken Breast (grilled)',
    emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, serving: 100, unit: 'g',
    tips: '200g grilled = 330 cal, 62g protein. The king of gym foods. Season with spices and grill.' },

  { id: 12, category: 'protein', name: 'Chicken Curry (home style)',
    emoji: '🍛', calories: 175, protein: 18, carbs: 5, fat: 9, fiber: 1, sugar: 2, sodium: 420, serving: 100, unit: 'g',
    tips: '1 bowl ~200g = 350 cal, 36g protein. Skip extra oil. Eat with roti for complete meal.' },

  { id: 13, category: 'protein', name: 'Egg Bhurji (3 eggs, minimal oil)',
    emoji: '🍳', calories: 168, protein: 12, carbs: 4, fat: 11, fiber: 0.5, sugar: 2, sodium: 350, serving: 100, unit: 'g',
    tips: '3 eggs + onion + tomato = ~250 cal, 18g protein. One of the best Indian gym meals.' },

  { id: 14, category: 'protein', name: 'Fish Curry (rohu/pomfret)',
    emoji: '🐟', calories: 132, protein: 15, carbs: 4, fat: 6, fiber: 0.5, sugar: 1, sodium: 380, serving: 100, unit: 'g',
    tips: '1 bowl ~200g with 2 roti = great meal. High protein, omega-3. Eat 3x per week.' },

  { id: 15, category: 'protein', name: 'Boiled Chicken (plain)',
    emoji: '🍗', calories: 150, protein: 28, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 65, serving: 100, unit: 'g',
    tips: 'Cleanest protein source. Add to salads, wraps or eat with dal-rice. No extra fat.' },

  { id: 16, category: 'protein', name: 'Egg Whites (boiled, 5)',
    emoji: '🥚', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.5, sodium: 166, serving: 100, unit: 'g',
    tips: '5 egg whites = 85 cal, 18g protein, 0g fat. Best food for cutting phase.' },

  { id: 17, category: 'protein', name: 'Paneer (grilled/baked)',
    emoji: '🧀', calories: 265, protein: 18, carbs: 3.4, fat: 20, fiber: 0, sugar: 3, sodium: 400, serving: 100, unit: 'g',
    tips: '100g paneer = 18g protein. Best Indian vegetarian protein. Grill or add to sabzi. Avoid fried version.' },

  { id: 18, category: 'protein', name: 'Paneer Bhurji (home cooked)',
    emoji: '🍛', calories: 230, protein: 14, carbs: 5, fat: 17, fiber: 1, sugar: 2, sodium: 450, serving: 100, unit: 'g',
    tips: '1 bowl ~150g = 345 cal. Good vegetarian protein source. Eat with roti.' },

  { id: 19, category: 'protein', name: 'Whey Protein Shake (1 scoop)',
    emoji: '🥤', calories: 120, protein: 24, carbs: 5, fat: 2, fiber: 0, sugar: 3, sodium: 130, serving: 100, unit: 'g',
    tips: 'Drink within 30 mins post-workout. Mix with water for cutting, milk for bulking.' },

  { id: 20, category: 'protein', name: 'Soya Chunks Sabzi (cooked)',
    emoji: '🥣', calories: 145, protein: 18, carbs: 10, fat: 3, fiber: 4, sugar: 1, sodium: 280, serving: 100, unit: 'g',
    tips: '1 bowl ~150g = 218 cal, 27g protein. Cheapest high-protein vegetarian food. Must for vegans.' },

  { id: 21, category: 'protein', name: 'Tuna (canned in water)',
    emoji: '🐠', calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 320, serving: 100, unit: 'g',
    tips: '1 can 185g = 215 cal, 48g protein. Best value protein. Mix with lemon and onion.' },

  // ─── INDIAN MEALS ───
  { id: 22, category: 'indian_meals', name: 'Dal Chawal (home cooked)',
    emoji: '🍛', calories: 155, protein: 6.5, carbs: 28, fat: 2, fiber: 3, sugar: 1, sodium: 300, serving: 100, unit: 'g',
    tips: '1 plate ~350g = 542 cal. Complete Indian meal. Dal provides protein, rice provides energy.' },

  { id: 23, category: 'indian_meals', name: 'Roti Sabzi (2 roti + sabzi)',
    emoji: '🍽️', calories: 185, protein: 5.5, carbs: 32, fat: 5, fiber: 3.5, sugar: 2, sodium: 350, serving: 100, unit: 'g',
    tips: '2 roti + 1 bowl sabzi = ~400 cal. Typical Indian lunch. Add dal for more protein.' },

  { id: 24, category: 'indian_meals', name: 'Khichdi (moong dal)',
    emoji: '🍲', calories: 124, protein: 5.5, carbs: 22, fat: 2.5, fiber: 2.5, sugar: 0.5, sodium: 250, serving: 100, unit: 'g',
    tips: 'Easy to digest, protein-carb balanced. 1 bowl 250g = 310 cal. Good post-workout or sick day meal.' },

  { id: 25, category: 'indian_meals', name: 'Rajma Chawal (home cooked)',
    emoji: '🫘', calories: 168, protein: 7.5, carbs: 30, fat: 2.5, fiber: 4.5, sugar: 2, sodium: 380, serving: 100, unit: 'g',
    tips: '1 plate 350g = 588 cal. High protein + high fiber. Punjab\'s best gym meal. Eat post-workout.' },

  { id: 26, category: 'indian_meals', name: 'Chole Bhature (1 plate)',
    emoji: '🍛', calories: 280, protein: 8, carbs: 38, fat: 11, fiber: 5, sugar: 2, sodium: 480, serving: 100, unit: 'g',
    tips: 'Calorie-dense. Good for bulking, avoid when cutting. Chole alone is healthy, bhature is the problem.' },

  { id: 27, category: 'indian_meals', name: 'Palak Paneer (home style)',
    emoji: '🍛', calories: 195, protein: 10, carbs: 7, fat: 14, fiber: 2.5, sugar: 3, sodium: 420, serving: 100, unit: 'g',
    tips: '1 bowl 200g = 390 cal, 20g protein. Spinach + paneer = double nutrition. Best vegetarian curry.' },

  { id: 28, category: 'indian_meals', name: 'Mixed Veg Sabzi (minimal oil)',
    emoji: '🥗', calories: 85, protein: 2.5, carbs: 12, fat: 3, fiber: 3.5, sugar: 4, sodium: 280, serving: 100, unit: 'g',
    tips: 'Low calorie side dish. Mix cauliflower, peas, carrot, beans. 1 bowl = ~170 cal.' },

  { id: 29, category: 'indian_meals', name: 'Sambar (south Indian)',
    emoji: '🍲', calories: 58, protein: 3.5, carbs: 8, fat: 1.5, fiber: 3, sugar: 2, sodium: 350, serving: 100, unit: 'g',
    tips: 'Lentil-based, high fiber and protein. Excellent with idli/dosa. 1 bowl = ~116 cal.' },

  { id: 30, category: 'indian_meals', name: 'Biryani (chicken, home cooked)',
    emoji: '🍛', calories: 195, protein: 11, carbs: 26, fat: 5, fiber: 1, sugar: 1, sodium: 480, serving: 100, unit: 'g',
    tips: '1 plate 300g = 585 cal. Calorie dense. Eat less rice, more chicken pieces. Limit to once a week.' },

  // ─── DAL & LEGUMES ───
  { id: 31, category: 'dal_legumes', name: 'Dal Tadka (toor dal, cooked)',
    emoji: '🍲', calories: 118, protein: 7.5, carbs: 18, fat: 2.5, fiber: 5, sugar: 1, sodium: 310, serving: 100, unit: 'g',
    tips: '1 bowl 200g = 236 cal, 15g protein. Must-have in every Indian gym diet. Eat with rice or roti.' },

  { id: 32, category: 'dal_legumes', name: 'Moong Dal (yellow, cooked)',
    emoji: '🟡', calories: 104, protein: 7, carbs: 18, fat: 0.4, fiber: 7, sugar: 2, sodium: 7, serving: 100, unit: 'g',
    tips: 'Easiest to digest. 1 bowl 200g = 208 cal, 14g protein. Best post-workout dal.' },

  { id: 33, category: 'dal_legumes', name: 'Rajma (kidney beans, cooked)',
    emoji: '🫘', calories: 127, protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.4, sugar: 0.3, sodium: 2, serving: 100, unit: 'g',
    tips: '1 bowl 200g = 254 cal. High protein + fiber. Takes longer to digest — eat at lunch, not late night.' },

  { id: 34, category: 'dal_legumes', name: 'Chana Masala (cooked)',
    emoji: '🫘', calories: 140, protein: 7, carbs: 20, fat: 3.5, fiber: 6, sugar: 3, sodium: 380, serving: 100, unit: 'g',
    tips: 'Chickpeas are excellent for gym. 1 bowl 200g = 280 cal. High fiber keeps you full for hours.' },

  { id: 35, category: 'dal_legumes', name: 'Sprouts (mixed, raw)',
    emoji: '🌱', calories: 30, protein: 3, carbs: 4, fat: 0.2, fiber: 1.8, sugar: 1, sodium: 7, serving: 100, unit: 'g',
    tips: '1 bowl 100g = 30 cal, 3g protein. Eat with lemon, onion, tomato. Best fat-loss snack.' },

  { id: 36, category: 'dal_legumes', name: 'Roasted Chana',
    emoji: '🫘', calories: 364, protein: 22, carbs: 56, fat: 5, fiber: 16, sugar: 0, sodium: 24, serving: 100, unit: 'g',
    tips: '30g = 109 cal, 6.6g protein. Best gym snack — carry in a small box. Eat between meals.' },

  // ─── DAIRY ───
  { id: 37, category: 'dairy', name: 'Dahi / Curd (full fat)',
    emoji: '🥛', calories: 98, protein: 3.5, carbs: 4.7, fat: 6, fiber: 0, sugar: 4.7, sodium: 36, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 147 cal. Probiotics for gut health. Eat with lunch daily. Better than store yogurt.' },

  { id: 38, category: 'dairy', name: 'Dahi (low fat / toned)',
    emoji: '🥛', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, sugar: 4.7, sodium: 36, serving: 100, unit: 'g',
    tips: 'Better choice when cutting. 1 bowl 150g = 91 cal. Add rock salt and jeera for taste.' },

  { id: 39, category: 'dairy', name: 'Paneer (raw)',
    emoji: '🧀', calories: 265, protein: 18, carbs: 3.4, fat: 20, fiber: 0, sugar: 3, sodium: 400, serving: 100, unit: 'g',
    tips: '100g = 18g protein. Eat raw in salad or cook in sabzi. Avoid frying.' },

  { id: 40, category: 'dairy', name: 'Milk (full fat, toned)',
    emoji: '🍼', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 4.8, sodium: 43, serving: 100, unit: 'ml',
    tips: '1 glass 250ml = 152 cal. Good for bulking. Add to oats or protein shake.' },

  { id: 41, category: 'dairy', name: 'Chaas / Buttermilk',
    emoji: '🥛', calories: 40, protein: 3.3, carbs: 4.8, fat: 0.9, fiber: 0, sugar: 4.8, sodium: 257, serving: 100, unit: 'ml',
    tips: 'Post-workout cooldown drink. 1 glass 250ml = 100 cal. Add jeera, pudina, salt. Great in summer.' },

  { id: 42, category: 'dairy', name: 'Lassi (sweet, homemade)',
    emoji: '🥛', calories: 112, protein: 3.8, carbs: 14, fat: 4.5, fiber: 0, sugar: 13, sodium: 80, serving: 100, unit: 'ml',
    tips: '1 glass 250ml = 280 cal. Good for bulking. Switch to salted chaas if cutting.' },

  { id: 43, category: 'dairy', name: 'Greek Yogurt (0% fat)',
    emoji: '🥣', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.6, sodium: 36, serving: 100, unit: 'g',
    tips: '200g = 118 cal, 20g protein. Best dairy for gym. Add honey and banana. Eat post-workout.' },

  { id: 44, category: 'dairy', name: 'Cottage Cheese (low fat)',
    emoji: '🧀', calories: 72, protein: 12, carbs: 3, fat: 1, fiber: 0, sugar: 3, sodium: 350, serving: 100, unit: 'g',
    tips: 'Slow-digesting casein protein. Eat 200g before bed — feeds muscles overnight.' },

  // ─── RICE & ROTI ───
  { id: 45, category: 'rice_roti', name: 'Chapati / Roti (1 piece, no ghee)',
    emoji: '🫓', calories: 71, protein: 2.5, carbs: 14, fat: 0.4, fiber: 1.9, sugar: 0, sodium: 130, serving: 100, unit: 'g',
    tips: '1 roti ~40g = 71 cal. Eat 2-3 with dal/sabzi. Use whole wheat atta. Skip ghee when cutting.' },

  { id: 46, category: 'rice_roti', name: 'Chapati with Ghee (1 piece)',
    emoji: '🫓', calories: 129, protein: 2.5, carbs: 14, fat: 6.5, fiber: 1.9, sugar: 0, sodium: 130, serving: 100, unit: 'g',
    tips: '1 roti with ghee ~50g = ~130 cal. Good for bulking. Limit to 1 tsp ghee per roti.' },

  { id: 47, category: 'rice_roti', name: 'Brown Rice (cooked)',
    emoji: '🍚', calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0, sodium: 5, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 168 cal. Better than white rice. Higher fiber, slower energy. Eat with dal.' },

  { id: 48, category: 'rice_roti', name: 'White Rice (cooked)',
    emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, sodium: 1, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 195 cal. Fast carbs — best post-workout. Eat within 1 hour after gym.' },

  { id: 49, category: 'rice_roti', name: 'Multigrain Roti (1 piece)',
    emoji: '🫓', calories: 85, protein: 3.5, carbs: 15, fat: 1.5, fiber: 3, sugar: 0, sodium: 150, serving: 100, unit: 'g',
    tips: 'Best roti option. Higher protein and fiber than plain wheat roti. Use daily.' },

  { id: 50, category: 'rice_roti', name: 'Jeera Rice (cooked)',
    emoji: '🍚', calories: 145, protein: 2.8, carbs: 28, fat: 3, fiber: 0.5, sugar: 0, sodium: 180, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 218 cal. Slightly higher fat than plain rice. Good with dal or curry.' },

  { id: 51, category: 'rice_roti', name: 'Paratha Plain (no butter)',
    emoji: '🫓', calories: 200, protein: 4.5, carbs: 30, fat: 7, fiber: 2, sugar: 0.5, sodium: 320, serving: 100, unit: 'g',
    tips: '1 paratha ~100g = 200 cal. Skip the butter. Good pre-workout if eaten 2hr before.' },

  // ─── SALADS & VEGETABLES (cooked or raw) ───
  { id: 52, category: 'salads_veg', name: 'Cucumber Tomato Onion Salad',
    emoji: '🥗', calories: 22, protein: 1, carbs: 4.5, fat: 0.2, fiber: 1.5, sugar: 3, sodium: 10, serving: 100, unit: 'g',
    tips: 'Eat freely — almost zero calories. Add lemon, rock salt, chaat masala. Great with any meal.' },

  { id: 53, category: 'salads_veg', name: 'Sprouts Salad (with lemon)',
    emoji: '🌱', calories: 45, protein: 3.8, carbs: 6.5, fat: 0.3, fiber: 2.5, sugar: 2, sodium: 20, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 67 cal. Eat as morning snack. Add tomato, cucumber, lemon, rock salt.' },

  { id: 54, category: 'salads_veg', name: 'Boiled Vegetables (mix)',
    emoji: '🥦', calories: 55, protein: 2.5, carbs: 10, fat: 0.5, fiber: 3.5, sugar: 4, sodium: 40, serving: 100, unit: 'g',
    tips: 'Broccoli, beans, carrot, peas. Eat with every meal. No oil needed. Season with salt and pepper.' },

  { id: 55, category: 'salads_veg', name: 'Aloo Gobi Sabzi (cooked)',
    emoji: '🥔', calories: 95, protein: 2.5, carbs: 14, fat: 3.5, fiber: 3, sugar: 3, sodium: 300, serving: 100, unit: 'g',
    tips: '1 bowl 200g = 190 cal. Potato adds carbs, cauliflower adds fiber. Good side dish.' },

  { id: 56, category: 'salads_veg', name: 'Palak (spinach) cooked',
    emoji: '🌿', calories: 41, protein: 5.4, carbs: 3.8, fat: 0.5, fiber: 4.3, sugar: 0.4, sodium: 70, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 62 cal. Rich in iron. Eat with paneer or eggs for complete meal.' },

  { id: 57, category: 'salads_veg', name: 'Bhindi / Okra (cooked)',
    emoji: '🫛', calories: 58, protein: 1.9, carbs: 9, fat: 2, fiber: 3.2, sugar: 3, sodium: 280, serving: 100, unit: 'g',
    tips: 'High fiber, low calorie. 1 bowl 150g = 87 cal. Good for digestion. Add with roti and dal.' },

  { id: 58, category: 'salads_veg', name: 'Lauki / Bottle Gourd (cooked)',
    emoji: '🫙', calories: 20, protein: 0.9, carbs: 3.4, fat: 0.1, fiber: 1.2, sugar: 2, sodium: 35, serving: 100, unit: 'g',
    tips: 'Extremely low calorie. 1 bowl = 40 cal. Best vegetable for cutting phase. Add with dal.' },

  { id: 59, category: 'salads_veg', name: 'Baingan Bharta (smoked brinjal)',
    emoji: '🍆', calories: 80, protein: 2, carbs: 9, fat: 4, fiber: 3.5, sugar: 4, sodium: 320, serving: 100, unit: 'g',
    tips: '1 bowl 150g = 120 cal. Smoked brinjal is nutrient dense. Eat with roti for complete meal.' },

  { id: 60, category: 'salads_veg', name: 'Broccoli (steamed)',
    emoji: '🥦', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, serving: 100, unit: 'g',
    tips: 'Best vegetable for gym. 1 bowl 200g = 68 cal. Add garlic and lemon. Eat with chicken.' },

  { id: 61, category: 'salads_veg', name: 'Carrot Raita',
    emoji: '🥕', calories: 65, protein: 2.8, carbs: 8, fat: 2.5, fiber: 1, sugar: 6, sodium: 180, serving: 100, unit: 'g',
    tips: 'Cooling, high vitamin A. 1 bowl 150g = 97 cal. Eat with lunch. Good for digestion.' },

  // ─── FRUITS ───
  { id: 62, category: 'fruits', name: 'Banana (1 medium)',
    emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, serving: 100, unit: 'g',
    tips: '1 banana = 90 cal. Eat 30 min before workout for instant energy. Best pre-workout fruit.' },

  { id: 63, category: 'fruits', name: 'Apple (1 medium)',
    emoji: '🍎', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, serving: 100, unit: 'g',
    tips: '1 apple = 80 cal. Eat with peanut butter for a filling snack. High fiber keeps you full.' },

  { id: 64, category: 'fruits', name: 'Papaya (diced)',
    emoji: '🧡', calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 8, serving: 100, unit: 'g',
    tips: '1 bowl 200g = 86 cal. Papain enzyme helps digest protein. Eat post-workout with a meal.' },

  { id: 65, category: 'fruits', name: 'Watermelon (slice)',
    emoji: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sugar: 6, sodium: 1, serving: 100, unit: 'g',
    tips: '2 big slices 300g = 90 cal. Post-workout hydration. 92% water. Keeps you full.' },

  { id: 66, category: 'fruits', name: 'Mango (1 medium, seasonal)',
    emoji: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1, serving: 100, unit: 'g',
    tips: '1 medium mango = 135 cal. High sugar — eat before workout, not at night. Seasonal, enjoy it.' },

  { id: 67, category: 'fruits', name: 'Guava (1 medium)',
    emoji: '🍈', calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, sugar: 8.9, sodium: 2, serving: 100, unit: 'g',
    tips: '1 guava = 68 cal, 5g fiber. More vitamin C than orange. Eat as mid-morning snack.' },

  { id: 68, category: 'fruits', name: 'Dates (2-3 pieces)',
    emoji: '🟤', calories: 282, protein: 2.5, carbs: 75, fat: 0.4, fiber: 8, sugar: 63, sodium: 1, serving: 100, unit: 'g',
    tips: '3 dates = 60 cal. Natural energy before gym. Better than energy drinks. High in potassium.' },

  // ─── SNACKS ───
  { id: 69, category: 'snacks', name: 'Makhana / Fox Nuts (roasted)',
    emoji: '⚪', calories: 347, protein: 9.7, carbs: 77, fat: 0.1, fiber: 14, sugar: 0, sodium: 10, serving: 100, unit: 'g',
    tips: '30g = 104 cal, 3g protein. Best evening snack. Zero fat. Better than chips or biscuits.' },

  { id: 70, category: 'snacks', name: 'Peanuts (roasted, plain)',
    emoji: '🥜', calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, sugar: 4, sodium: 18, serving: 100, unit: 'g',
    tips: '30g = 170 cal, 8g protein. Cheap and filling. Do not overeat — very calorie dense.' },

  { id: 71, category: 'snacks', name: 'Peanut Butter (1 tbsp)',
    emoji: '🥜', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, sodium: 450, serving: 100, unit: 'g',
    tips: '1 tbsp = 90 cal, 4g protein. Eat on brown bread or with apple. Good healthy fat source.' },

  { id: 72, category: 'snacks', name: 'Almonds (handful, ~20)',
    emoji: '🌰', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4, sodium: 1, serving: 100, unit: 'g',
    tips: '20 almonds = 139 cal. Soak overnight for better absorption. Vitamin E for muscle recovery.' },

  { id: 73, category: 'snacks', name: 'Protein Bar (average)',
    emoji: '🍫', calories: 220, protein: 20, carbs: 25, fat: 8, fiber: 5, sugar: 8, sodium: 200, serving: 100, unit: 'g',
    tips: 'Emergency snack only. Read label — look for 20g+ protein, under 10g sugar.' },

  { id: 74, category: 'snacks', name: 'Chivda / Mixture (light)',
    emoji: '🍿', calories: 430, protein: 9, carbs: 55, fat: 20, fiber: 4, sugar: 5, sodium: 600, serving: 100, unit: 'g',
    tips: 'High calorie snack. Limit to 30g if cutting. Good for bulking as calorie booster.' },

  { id: 75, category: 'snacks', name: 'Boiled Corn (1 cob)',
    emoji: '🌽', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, fiber: 2.7, sugar: 6.3, sodium: 15, serving: 100, unit: 'g',
    tips: '1 cob 100g = 86 cal. Good carb snack. Add lemon and rock salt. Eat as afternoon snack.' },

  // ─── DRINKS ───
  { id: 76, category: 'drinks', name: 'Protein Shake (whey + water)',
    emoji: '🥤', calories: 110, protein: 22, carbs: 5, fat: 2, fiber: 0, sugar: 3, sodium: 130, serving: 100, unit: 'ml',
    tips: 'Post-workout: 1 scoop + 300ml water = 330ml, 22g protein. Drink within 30 min of gym.' },

  { id: 77, category: 'drinks', name: 'Protein Shake (whey + milk)',
    emoji: '🥛', calories: 165, protein: 25, carbs: 14, fat: 5, fiber: 0, sugar: 10, sodium: 180, serving: 100, unit: 'ml',
    tips: '1 scoop + 300ml full cream milk = ~450 cal, 28g protein. Better for bulking phase.' },

  { id: 78, category: 'drinks', name: 'Green Tea (plain)',
    emoji: '🍵', calories: 1, protein: 0, carbs: 0.2, fat: 0, fiber: 0, sugar: 0, sodium: 5, serving: 100, unit: 'ml',
    tips: '1 cup = 0 cal. Drink 2 cups per day. Boosts metabolism by 3-4%. Drink pre-workout or morning.' },

  { id: 79, category: 'drinks', name: 'Black Coffee (no sugar)',
    emoji: '☕', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, serving: 100, unit: 'ml',
    tips: '1 cup = 2 cal. Best pre-workout drink — improves strength and focus. Drink 30 min before gym.' },

  { id: 80, category: 'drinks', name: 'Coconut Water (fresh)',
    emoji: '🥥', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1, sugar: 2.6, sodium: 105, serving: 100, unit: 'ml',
    tips: '1 glass 250ml = 47 cal. Best natural electrolyte drink. Drink post-workout for hydration.' },

  { id: 81, category: 'drinks', name: 'Whole Milk (plain)',
    emoji: '🍼', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 4.8, sodium: 43, serving: 100, unit: 'ml',
    tips: '1 glass 250ml = 152 cal. Add to oats or shake. Good for bulking. Use toned milk when cutting.' },

  { id: 82, category: 'drinks', name: 'Banana Milk Shake (no sugar)',
    emoji: '🍌', calories: 92, protein: 3, carbs: 17, fat: 2.5, fiber: 0.8, sugar: 13, sodium: 50, serving: 100, unit: 'ml',
    tips: '1 glass 300ml = 276 cal. Good post-workout recovery drink. Quick carbs + protein combo.' },
]

// Diet plans
export const dietPlans = {
  'Lose Weight': {
    calories: 1800,
    protein: 160,
    carbs: 160,
    fat: 55,
    meals: [
      { time: '7:00 AM',  name: 'Breakfast',    foods: ['Besan Cheela (2)', 'Curd 0% (150g)', 'Green Tea'],                           macros: { cal: 370, p: 30, c: 28, f: 8 } },
      { time: '10:30 AM', name: 'Mid-Morning',  foods: ['Sprouts Salad (150g)', 'Apple'],                                             macros: { cal: 145, p: 7, c: 22, f: 1 } },
      { time: '1:00 PM',  name: 'Lunch',        foods: ['Boiled Chicken (150g)', '2 Roti', 'Dal Tadka (1 bowl)', 'Cucumber Salad'],   macros: { cal: 520, p: 55, c: 48, f: 12 } },
      { time: '4:00 PM',  name: 'Pre-Workout',  foods: ['Banana', 'Black Coffee'],                                                    macros: { cal: 92, p: 1, c: 23, f: 0 } },
      { time: '7:00 PM',  name: 'Post-Workout', foods: ['Whey Protein (1 scoop) + Water', 'Watermelon (200g)'],                       macros: { cal: 173, p: 24, c: 22, f: 2 } },
      { time: '9:00 PM',  name: 'Dinner',       foods: ['Moong Dal (1 bowl)', '1 Roti', 'Palak Sabzi', 'Curd (100g)'],               macros: { cal: 430, p: 22, c: 50, f: 8 } },
    ]
  },

  'Build Muscle': {
    calories: 3000,
    protein: 180,
    carbs: 350,
    fat: 80,
    meals: [
      { time: '7:00 AM',  name: 'Breakfast',    foods: ['Oats (80g) + Milk', '3 Eggs + 3 Egg Whites', 'Banana'],                     macros: { cal: 680, p: 48, c: 80, f: 18 } },
      { time: '10:30 AM', name: 'Mid-Morning',  foods: ['Paneer (100g)', '2 Roti', 'Green Tea'],                                      macros: { cal: 410, p: 22, c: 30, f: 22 } },
      { time: '1:30 PM',  name: 'Lunch',        foods: ['Chicken Curry (200g)', 'White Rice (150g)', 'Dal (1 bowl)', 'Curd'],         macros: { cal: 720, p: 55, c: 72, f: 20 } },
      { time: '4:00 PM',  name: 'Pre-Workout',  foods: ['Brown Rice (100g)', 'Soya Chunks Sabzi', 'Banana'],                          macros: { cal: 480, p: 25, c: 75, f: 5 } },
      { time: '7:00 PM',  name: 'Post-Workout', foods: ['Whey Protein + Milk (300ml)', 'Dates (3)'],                                  macros: { cal: 435, p: 28, c: 50, f: 8 } },
      { time: '9:30 PM',  name: 'Dinner',       foods: ['Paneer Bhurji (150g)', '2 Roti', 'Rajma (1 bowl)', 'Salad'],                macros: { cal: 700, p: 38, c: 70, f: 22 } },
    ]
  },

  'Bulk (Muscle + Weight Gain)': {
    calories: 3500,
    protein: 200,
    carbs: 420,
    fat: 100,
    meals: [
      { time: '7:00 AM',  name: 'Breakfast',    foods: ['Oats (100g) + Full Milk', '4 Whole Eggs', 'Banana', 'Peanut Butter (1 tbsp)'], macros: { cal: 900, p: 52, c: 105, f: 32 } },
      { time: '10:30 AM', name: 'Mid-Morning',  foods: ['Rajma Chawal (1 plate)', 'Dahi (150g)'],                                     macros: { cal: 640, p: 32, c: 92, f: 10 } },
      { time: '1:30 PM',  name: 'Lunch',        foods: ['Chicken Curry (250g)', 'White Rice (200g)', 'Dal', '2 Roti with Ghee'],      macros: { cal: 1050, p: 65, c: 115, f: 30 } },
      { time: '4:30 PM',  name: 'Pre-Workout',  foods: ['Aloo Paratha (1)', 'Curd (150g)', 'Dates (3)'],                              macros: { cal: 530, p: 14, c: 72, f: 18 } },
      { time: '7:30 PM',  name: 'Post-Workout', foods: ['Whey Protein + Milk', 'Banana Milkshake (300ml)'],                           macros: { cal: 580, p: 30, c: 75, f: 12 } },
      { time: '10:00 PM', name: 'Dinner',       foods: ['Palak Paneer (200g)', '3 Roti', 'Brown Rice (100g)', 'Lassi (1 glass)'],     macros: { cal: 900, p: 35, c: 110, f: 28 } },
    ]
  },

  'Stay Fit': {
    calories: 2200,
    protein: 150,
    carbs: 240,
    fat: 65,
    meals: [
      { time: '7:30 AM',  name: 'Breakfast',    foods: ['Poha (250g)', '2 Boiled Eggs', 'Chaas (1 glass)', 'Guava'],                  macros: { cal: 490, p: 20, c: 70, f: 12 } },
      { time: '11:00 AM', name: 'Mid-Morning',  foods: ['Sprouts Salad', 'Roasted Chana (30g)', 'Green Tea'],                         macros: { cal: 200, p: 12, c: 25, f: 4 } },
      { time: '1:30 PM',  name: 'Lunch',        foods: ['Dal Chawal (1 plate)', 'Palak Sabzi', 'Curd', 'Cucumber Salad'],             macros: { cal: 580, p: 22, c: 88, f: 10 } },
      { time: '5:00 PM',  name: 'Snack',        foods: ['Makhana (30g)', 'Apple', 'Coconut Water'],                                   macros: { cal: 220, p: 5, c: 38, f: 1 } },
      { time: '8:30 PM',  name: 'Dinner',       foods: ['Khichdi (1 bowl)', 'Egg Bhurji (2 eggs)', 'Baingan Bharta', 'Dahi'],        macros: { cal: 620, p: 28, c: 72, f: 18 } },
    ]
  },
}

// All foods in one array — declared LAST so all arrays above exist
export const allFoods = [...foodDatabase]