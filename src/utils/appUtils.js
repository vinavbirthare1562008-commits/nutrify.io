const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function formatNumber(value) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function buildWeeklySummary(meals) {
  const today = new Date()
  const summary = []

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const iso = date.toISOString().slice(0, 10)
    const dailyMeals = meals.filter((meal) => meal.date === iso)
    const calories = dailyMeals.reduce((sum, meal) => sum + meal.calories, 0)
    const protein = dailyMeals.reduce((sum, meal) => sum + meal.protein, 0)
    const carbs = dailyMeals.reduce((sum, meal) => sum + meal.carbs, 0)
    const fats = dailyMeals.reduce((sum, meal) => sum + meal.fats, 0)

    summary.push({
      date: iso,
      day: DAY_LABELS[date.getDay()],
      calories,
      protein,
      carbs,
      fats,
    })
  }

  return summary
}

export function buildMacroBreakdown(weeklySummary) {
  const totals = weeklySummary.reduce(
    (acc, item) => {
      acc.protein += item.protein
      acc.carbs += item.carbs
      acc.fats += item.fats
      return acc
    },
    { protein: 0, carbs: 0, fats: 0 },
  )

  return [
    { name: 'Protein', value: totals.protein, color: '#38bdf8' },
    { name: 'Carbs', value: totals.carbs, color: '#f97316' },
    { name: 'Fats', value: totals.fats, color: '#a855f7' },
  ]
}

export function computeStreak(meals) {
  const today = new Date()
  let streak = 0

  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const iso = date.toISOString().slice(0, 10)
    const hasMeal = meals.some((meal) => meal.date === iso)

    if (hasMeal) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

export function buildMonthlyProgress(meals) {
  const today = new Date()
  const series = []

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const iso = date.toISOString().slice(0, 10)
    const label = `${date.getMonth() + 1}/${date.getDate()}`
    const dailyMeals = meals.filter((meal) => meal.date === iso)
    const calories = dailyMeals.reduce((sum, meal) => sum + meal.calories, 0)
    const protein = dailyMeals.reduce((sum, meal) => sum + meal.protein, 0)
    const carbs = dailyMeals.reduce((sum, meal) => sum + meal.carbs, 0)
    const fats = dailyMeals.reduce((sum, meal) => sum + meal.fats, 0)

    series.push({
      date: iso,
      label,
      calories,
      protein,
      carbs,
      fats,
    })
  }

  return series
}

export function buildWaterTrend(weeklySummary, waterHistory, settings) {
  return weeklySummary.map((item) => {
    const historyEntry = waterHistory.find((history) => history.date === item.date)
    const intake = historyEntry
      ? historyEntry.intake
      : Math.min(settings.waterGoal, Math.max(1, Math.round((item.calories / settings.calorieGoal) * settings.waterGoal)))

    return {
      day: item.day,
      intake,
    }
  })
}

export function buildWeightSeries(weightLogs) {
  return [...weightLogs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: formatDate(entry.date),
      weight: entry.weight,
    }))
}

export function buildFoodNutritionDetails(food) {
  const categoryDefaults = {
    Fruits: { fiber: 3, sugar: Math.round(food.carbs * 0.6), sodium: 1, potassium: 250, calcium: 20, iron: 0.3, magnesium: 15, vitaminA: 8, vitaminB: 6, vitaminC: 60, vitaminD: 0 },
    Vegetables: { fiber: 4, sugar: Math.round(food.carbs * 0.25), sodium: 40, potassium: 220, calcium: 35, iron: 0.6, magnesium: 25, vitaminA: 30, vitaminB: 8, vitaminC: 35, vitaminD: 0 },
    'Fast Food': { fiber: 2, sugar: Math.round(food.carbs * 0.15), sodium: 680, potassium: 180, calcium: 25, iron: 1.2, magnesium: 18, vitaminA: 3, vitaminB: 6, vitaminC: 5, vitaminD: 2 },
    'Indian Food': { fiber: 3, sugar: Math.round(food.carbs * 0.12), sodium: 520, potassium: 190, calcium: 30, iron: 1.0, magnesium: 22, vitaminA: 6, vitaminB: 7, vitaminC: 12, vitaminD: 2 },
    Drinks: { fiber: 0, sugar: Math.round(food.carbs * 0.9), sodium: 15, potassium: 70, calcium: 10, iron: 0.1, magnesium: 5, vitaminA: 2, vitaminB: 4, vitaminC: 10, vitaminD: 1 },
    Snacks: { fiber: 2, sugar: Math.round(food.carbs * 0.35), sodium: 220, potassium: 80, calcium: 20, iron: 0.8, magnesium: 14, vitaminA: 4, vitaminB: 5, vitaminC: 3, vitaminD: 1 },
    Dairy: { fiber: 0, sugar: Math.round(food.carbs * 0.6), sodium: 120, potassium: 180, calcium: 120, iron: 0.1, magnesium: 12, vitaminA: 6, vitaminB: 10, vitaminC: 0, vitaminD: 10 },
    'Protein Foods': { fiber: 1, sugar: Math.round(food.carbs * 0.1), sodium: 85, potassium: 220, calcium: 30, iron: 1.5, magnesium: 25, vitaminA: 2, vitaminB: 12, vitaminC: 2, vitaminD: 2 },
    'Rice & Grains': { fiber: 2, sugar: Math.round(food.carbs * 0.2), sodium: 10, potassium: 100, calcium: 15, iron: 1.0, magnesium: 18, vitaminA: 0, vitaminB: 10, vitaminC: 0, vitaminD: 0 },
    'Breakfast Foods': { fiber: 3, sugar: Math.round(food.carbs * 0.25), sodium: 250, potassium: 130, calcium: 25, iron: 1.1, magnesium: 16, vitaminA: 5, vitaminB: 8, vitaminC: 2, vitaminD: 2 },
  }

  const defaults = categoryDefaults[food.category] || {
    fiber: Math.max(1, Math.round(food.carbs * 0.14)),
    sugar: Math.max(0, Math.round(food.carbs * 0.45)),
    sodium: 50,
    potassium: 90,
    calcium: 20,
    iron: 0.7,
    magnesium: 15,
    vitaminA: 6,
    vitaminB: 8,
    vitaminC: 8,
    vitaminD: 1,
  }

  const healthScore = clamp(Math.round(80 + (food.protein * 1.2) - (food.fats * 0.9) - (food.calories / 200) + (defaults.fiber * 0.7)), 35, 99)
  const quality = clamp(Math.round((food.protein * 2 + defaults.fiber + (100 - defaults.sugar) * 0.12) / 2), 20, 100)

  return {
    ...food,
    fiber: food.fiber ?? defaults.fiber,
    sugar: food.sugar ?? defaults.sugar,
    sodium: food.sodium ?? defaults.sodium,
    potassium: food.potassium ?? defaults.potassium,
    calcium: food.calcium ?? defaults.calcium,
    iron: food.iron ?? defaults.iron,
    magnesium: food.magnesium ?? defaults.magnesium,
    vitaminA: food.vitaminA ?? defaults.vitaminA,
    vitaminB: food.vitaminB ?? defaults.vitaminB,
    vitaminC: food.vitaminC ?? defaults.vitaminC,
    vitaminD: food.vitaminD ?? defaults.vitaminD,
    healthScore,
    nutritionQuality: quality,
  }
}

export function buildMealCategoryBreakdown(meals) {
  const breakdown = meals.reduce((acc, meal) => {
    const category = meal.foodCategory || meal.category || 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const palette = ['#f97316', '#38bdf8', '#8b5cf6', '#22c55e', '#e11d48', '#facc15', '#6366f1', '#14b8a6']

  return Object.entries(breakdown).map(([name, value], index) => ({
    name,
    value,
    color: palette[index % palette.length],
  }))
}

export function buildNutritionRatio(dailyNutrition) {
  const total = Math.max(dailyNutrition.protein + dailyNutrition.carbs + dailyNutrition.fats, 1)
  return [
    { name: 'Protein', value: Math.round((dailyNutrition.protein / total) * 100), color: '#38bdf8' },
    { name: 'Carbs', value: Math.round((dailyNutrition.carbs / total) * 100), color: '#fb923c' },
    { name: 'Fats', value: Math.round((dailyNutrition.fats / total) * 100), color: '#8b5cf6' },
  ]
}

export function buildFrequencyBins(values, bucketSize = 20, bucketCount = 6) {
  if (!values.length) return []
  const maxValue = Math.max(...values)
  const bins = Array.from({ length: bucketCount }, (_, index) => ({
    range: `${index * bucketSize}-${(index + 1) * bucketSize}`,
    count: 0,
  }))

  values.forEach((value) => {
    const bucket = Math.min(Math.floor(value / bucketSize), bucketCount - 1)
    bins[bucket].count += 1
  })

  return bins
}

export function buildFatTrend(weeklySummary) {
  return weeklySummary.map((item) => ({ day: item.day, fats: item.fats }))
}

export function buildGoalCompletionTrend(weeklySummary, calorieGoal) {
  return weeklySummary.map((item) => ({
    day: item.day,
    completion: Math.round((item.calories / Math.max(calorieGoal, 1)) * 100),
  }))
}

export function buildMicronutrientRadar(micronutrients) {
  return Object.entries(micronutrients).map(([name, value]) => ({
    nutrient: name.replace(/([A-Z])/g, ' $1'),
    value,
  }))
}

export function buildVitaminOverview(micronutrients) {
  return [
    { name: 'Vitamin A', value: micronutrients.vitaminA || 0, color: '#f97316' },
    { name: 'Vitamin B', value: micronutrients.vitaminB || 0, color: '#22c55e' },
    { name: 'Vitamin C', value: micronutrients.vitaminC || 0, color: '#38bdf8' },
    { name: 'Vitamin D', value: micronutrients.vitaminD || 0, color: '#8b5cf6' },
  ]
}

// Premium analytics helpers
export function computeHealthScoreFromData({ meals = [], waterHistory = [], settings = {}, streak = 0, weightSeries = [] }) {
  // Basic aggregated metrics
  const days = Math.max(1, new Set(meals.map((m) => m.date)).size)
  const avgCalories = Math.round(meals.reduce((s, m) => s + (m.calories || 0), 0) / days || 0)
  const avgProtein = Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0) / days || 0)
  const waterEntries = waterHistory.slice(0, 14)
  const avgWater = Math.round(waterEntries.reduce((s, w) => s + (w.intake || 0), 0) / Math.max(1, waterEntries.length))

  const calorieScore = clamp(100 - Math.abs(avgCalories - (settings.calorieGoal || 2000)) / Math.max(1, (settings.calorieGoal || 2000)) * 100, 0, 100)
  const proteinScore = clamp((avgProtein / Math.max(1, settings.proteinGoal || 100)) * 100, 0, 100)
  const waterScore = clamp((avgWater / Math.max(1, settings.waterGoal || 8)) * 100, 0, 100)
  const consistencyScore = clamp(Math.min(streak * 12.5, 100), 0, 100)

  // Weighted health score
  const score = Math.round((calorieScore * 0.3 + proteinScore * 0.25 + waterScore * 0.2 + consistencyScore * 0.25))
  return clamp(score, 0, 100)
}

export function computeNutritionQualityIndex(meals = []) {
  if (!meals.length) return { quality: 60, processedPercent: 0, healthyRating: 'Average' }
  // crude processed detection: foods with category 'Fast Food' or high fat+calorie
  const processed = meals.filter((m) => (m.category === 'Fast Food' || (m.calories > 500 && (m.fats / Math.max(1, m.calories)) > 0.3)))
  const processedPercent = Math.round((processed.length / meals.length) * 100)
  const avgProtein = Math.round(meals.reduce((s, m) => s + (m.protein || 0), 0) / meals.length)
  const avgFiber = Math.round(meals.reduce((s, m) => s + (m.fiber || 0), 0) / Math.max(1, meals.length))

  const quality = clamp(Math.round((avgProtein * 1.5 + avgFiber * 2 + (100 - processedPercent) * 0.6) / 3), 20, 100)
  const healthyRating = quality > 80 ? 'Excellent' : quality > 65 ? 'Good' : quality > 45 ? 'Average' : 'Poor'

  return { quality, processedPercent, healthyRating }
}

export function predictDaysToTarget({ currentWeight, targetWeight, avgDailyCalories, recommendedCalories }) {
  // simple calorie-to-weight projection (7700 kcal per kg)
  const kcalDiff = recommendedCalories - avgDailyCalories // positive means deficit for weight loss if recommended < avg?
  if (!kcalDiff) return '—'
  const dailyWeightChange = kcalDiff / 7700
  if (dailyWeightChange === 0) return '—'
  const remainingKg = Math.abs(targetWeight - currentWeight)
  const days = Math.abs(Math.round(remainingKg / Math.abs(dailyWeightChange)))
  if (!isFinite(days) || days > 3650) return 'Long-term'
  return `${days} day${days === 1 ? '' : 's'}`
}

export function generateSmartSuggestions({ dailyNutrition = {}, water = 0, micronutrients = {}, settings = {} }) {
  const suggestions = []
  if ((dailyNutrition.protein || 0) < (settings.proteinGoal || 100) - 15) suggestions.push({ key: 'protein', title: 'Increase protein', detail: 'Add lean protein like poultry, fish, or Greek yogurt to support recovery.' })
  if (water < (settings.waterGoal || 8)) suggestions.push({ key: 'hydration', title: 'Hydrate more', detail: `Aim for ${settings.waterGoal} cups; sip water across the day.` })
  if ((dailyNutrition.carbs || 0) > 300) suggestions.push({ key: 'reduceSugar', title: 'Reduce refined carbs', detail: 'Swap sugary snacks for fruits or nuts.' })
  if ((micronutrients.vitaminC || 0) < 50) suggestions.push({ key: 'vitC', title: 'Add vitamin C', detail: 'Include citrus or bell peppers to boost vitamin C.' })
  if (!suggestions.length) suggestions.push({ key: 'maintain', title: 'On track', detail: 'Keep consistency up. Small wins compound.' })
  return suggestions.slice(0, 4)
}

export function buildReportAggregates(meals = [], waterHistory = [], weightLogs = []) {
  const weekly = buildWeeklySummary(meals)
  const monthly = buildMonthlyProgress(meals)
  const avgCalories = Math.round(weekly.reduce((s, d) => s + d.calories, 0) / Math.max(1, weekly.length))
  const avgProtein = Math.round(weekly.reduce((s, d) => s + d.protein, 0) / Math.max(1, weekly.length))
  const hydrationConsistency = Math.round((waterHistory.filter((w) => w.intake >= 1).length / Math.max(1, waterHistory.length)) * 100)
  const streak = computeStreak(meals)

  return { weekly, monthly, avgCalories, avgProtein, hydrationConsistency, streak, weightLogs }
}
