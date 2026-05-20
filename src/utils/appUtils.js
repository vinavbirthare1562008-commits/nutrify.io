const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MICRO_NUTRIENT_META = {
  sodium: { label: 'Sodium', unit: 'mg', target: 2300 },
  potassium: { label: 'Potassium', unit: 'mg', target: 3400 },
  calcium: { label: 'Calcium', unit: 'mg', target: 1300 },
  iron: { label: 'Iron', unit: 'mg', target: 18 },
  magnesium: { label: 'Magnesium', unit: 'mg', target: 420 },
  zinc: { label: 'Zinc', unit: 'mg', target: 11 },
  vitaminA: { label: 'Vitamin A', unit: 'mcg', target: 900 },
  vitaminB: { label: 'Vitamin B', unit: 'mg', target: 2.4 },
  vitaminC: { label: 'Vitamin C', unit: 'mg', target: 90 },
  vitaminD: { label: 'Vitamin D', unit: 'IU', target: 800 },
  vitaminE: { label: 'Vitamin E', unit: 'mg', target: 15 },
}

const CATEGORY_DEFAULTS = {
  Fruits: { fiber: 3, sugar: 14, sodium: 1, potassium: 320, calcium: 24, iron: 0.3, magnesium: 18, zinc: 0.2, vitaminA: 32, vitaminB: 0.3, vitaminC: 46, vitaminD: 0, vitaminE: 1.4 },
  Vegetables: { fiber: 4.5, sugar: 4, sodium: 38, potassium: 280, calcium: 42, iron: 0.8, magnesium: 28, zinc: 0.4, vitaminA: 84, vitaminB: 0.4, vitaminC: 34, vitaminD: 0, vitaminE: 1.8 },
  'Fast Food': { fiber: 2, sugar: 5, sodium: 720, potassium: 220, calcium: 36, iron: 1.4, magnesium: 18, zinc: 0.9, vitaminA: 12, vitaminB: 0.2, vitaminC: 5, vitaminD: 18, vitaminE: 0.8 },
  'Indian Food': { fiber: 4, sugar: 4, sodium: 520, potassium: 260, calcium: 48, iron: 1.1, magnesium: 34, zinc: 0.8, vitaminA: 26, vitaminB: 0.4, vitaminC: 10, vitaminD: 12, vitaminE: 1.2 },
  Drinks: { fiber: 0.4, sugar: 9, sodium: 24, potassium: 110, calcium: 22, iron: 0.2, magnesium: 8, zinc: 0.1, vitaminA: 8, vitaminB: 0.3, vitaminC: 12, vitaminD: 28, vitaminE: 0.4 },
  Snacks: { fiber: 2.5, sugar: 7, sodium: 180, potassium: 120, calcium: 26, iron: 0.8, magnesium: 20, zinc: 0.5, vitaminA: 14, vitaminB: 0.3, vitaminC: 3, vitaminD: 8, vitaminE: 1.6 },
  Dairy: { fiber: 0.2, sugar: 8, sodium: 120, potassium: 210, calcium: 180, iron: 0.2, magnesium: 18, zinc: 0.9, vitaminA: 54, vitaminB: 0.6, vitaminC: 0, vitaminD: 90, vitaminE: 0.6 },
  'Protein Foods': { fiber: 0.8, sugar: 1.2, sodium: 92, potassium: 290, calcium: 36, iron: 1.8, magnesium: 28, zinc: 1.6, vitaminA: 10, vitaminB: 1.2, vitaminC: 2, vitaminD: 24, vitaminE: 0.7 },
  'Rice & Grains': { fiber: 3, sugar: 1.8, sodium: 12, potassium: 110, calcium: 18, iron: 1.1, magnesium: 24, zinc: 0.7, vitaminA: 2, vitaminB: 0.5, vitaminC: 0, vitaminD: 0, vitaminE: 0.5 },
  'Breakfast Foods': { fiber: 3.2, sugar: 8, sodium: 250, potassium: 150, calcium: 52, iron: 1.2, magnesium: 22, zinc: 0.6, vitaminA: 30, vitaminB: 0.4, vitaminC: 4, vitaminD: 24, vitaminE: 0.8 },
}

const DEFAULT_CATEGORY = { fiber: 2.5, sugar: 6, sodium: 80, potassium: 140, calcium: 28, iron: 0.8, magnesium: 18, zinc: 0.5, vitaminA: 18, vitaminB: 0.4, vitaminC: 8, vitaminD: 8, vitaminE: 0.8 }

const CATEGORY_COLORS = ['#22d3ee', '#8b5cf6', '#fb7185', '#34d399', '#f59e0b', '#60a5fa', '#f472b6', '#a3e635']

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function roundValue(value, digits = 1) {
  const power = 10 ** digits
  return Math.round((value + Number.EPSILON) * power) / power
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10)
}

function buildDayRange(days) {
  const today = new Date()
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - index - 1))
    return {
      date,
      iso: toDateKey(date),
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      day: DAY_LABELS[date.getDay()],
    }
  })
}

function scoreAgainstTarget(actual, target, tolerance = 0.18) {
  if (!target) {
    return 0
  }
  const delta = Math.abs(actual - target) / target
  const scaled = 100 - (delta / Math.max(tolerance, 0.01)) * 100
  return clamp(Math.round(scaled), 0, 100)
}

function scoreRatioAroundIdeal(ratio, ideal, tolerance) {
  const distance = Math.abs(ratio - ideal)
  return clamp(Math.round(100 - (distance / Math.max(tolerance, 0.01)) * 100), 0, 100)
}

function getCategoryDefaults(food) {
  const category = food.category || food.foodCategory || 'Other'
  const defaults = CATEGORY_DEFAULTS[category] || DEFAULT_CATEGORY
  const carbs = Number(food.carbs || 0)
  return {
    ...defaults,
    fiber: food.fiber ?? Math.max(defaults.fiber, roundValue(carbs * 0.14, 1)),
    sugar: food.sugar ?? Math.max(defaults.sugar, roundValue(carbs * 0.24, 1)),
  }
}

function computeFoodMetrics(baseFood) {
  const calories = Number(baseFood.calories || 0)
  const protein = Number(baseFood.protein || 0)
  const carbs = Number(baseFood.carbs || 0)
  const fats = Number(baseFood.fats || 0)
  const fiber = Number(baseFood.fiber || 0)
  const sugar = Number(baseFood.sugar || 0)
  const sodium = Number(baseFood.sodium || 0)
  const calorieDensity = calories / Math.max(1, protein + fiber + 1)
  const proteinDensity = protein / Math.max(1, calories / 100)
  const fiberDensity = fiber / Math.max(1, carbs / 10)
  const sugarPenalty = clamp((sugar / 24) * 35, 0, 35)
  const sodiumPenalty = clamp((sodium / 900) * 22, 0, 22)
  const densityPenalty = clamp((calorieDensity - 12) * 2.4, 0, 18)

  const nutritionQuality = clamp(
    Math.round(52 + proteinDensity * 10 + fiberDensity * 8 - sugarPenalty * 0.55 - sodiumPenalty * 0.45 - densityPenalty),
    18,
    99,
  )

  const healthScore = clamp(
    Math.round(58 + proteinDensity * 11 + fiber * 2.5 - sugarPenalty * 0.5 - sodiumPenalty * 0.5 - fats * 0.4),
    20,
    99,
  )

  return {
    nutritionQuality,
    healthScore,
  }
}

function getFoodTags(food) {
  const tags = []
  if (food.protein >= 18) tags.push('High Protein')
  if (food.fiber >= 5) tags.push('Fiber Rich')
  if (food.sugar <= 6) tags.push('Low Sugar')
  if (food.fats <= 6) tags.push('Lean Fuel')
  if (food.category === 'Fruits' || food.category === 'Vegetables') tags.push('Whole Food')
  if (food.category === 'Protein Foods') tags.push('Recovery')
  if (food.category === 'Drinks') tags.push('Quick Sip')
  if (food.vitaminC >= 30) tags.push('Vitamin C Boost')
  if (food.potassium >= 250) tags.push('Electrolytes')
  if (food.category === 'Fast Food') tags.push('Limit Often')
  return Array.from(new Set(tags)).slice(0, 5)
}

function getFoodRating(score) {
  if (score >= 86) return 'A+'
  if (score >= 76) return 'A'
  if (score >= 66) return 'B'
  if (score >= 52) return 'C'
  return 'D'
}

function scaleFood(baseFood, servings) {
  const factor = Number(servings || 1)
  const scaled = {
    ...baseFood,
    calories: roundValue(baseFood.calories * factor, 0),
    protein: roundValue(baseFood.protein * factor, 1),
    carbs: roundValue(baseFood.carbs * factor, 1),
    fats: roundValue(baseFood.fats * factor, 1),
    fiber: roundValue(baseFood.fiber * factor, 1),
    sugar: roundValue(baseFood.sugar * factor, 1),
    sodium: roundValue(baseFood.sodium * factor, 0),
    potassium: roundValue(baseFood.potassium * factor, 0),
    calcium: roundValue(baseFood.calcium * factor, 0),
    iron: roundValue(baseFood.iron * factor, 1),
    magnesium: roundValue(baseFood.magnesium * factor, 0),
    zinc: roundValue(baseFood.zinc * factor, 1),
    vitaminA: roundValue(baseFood.vitaminA * factor, 0),
    vitaminB: roundValue(baseFood.vitaminB * factor, 1),
    vitaminC: roundValue(baseFood.vitaminC * factor, 0),
    vitaminD: roundValue(baseFood.vitaminD * factor, 0),
    vitaminE: roundValue(baseFood.vitaminE * factor, 1),
  }

  return {
    ...scaled,
    servingMultiplier: factor,
    serving: factor === 1 ? baseFood.serving : `${roundValue(factor, 2)}x ${baseFood.serving}`,
    baseServing: baseFood.serving,
  }
}

export function buildFoodNutritionDetails(food, servings = 1) {
  const normalizedFood = {
    ...food,
    category: food.category || food.foodCategory || 'Other',
    serving: food.serving || '1 serving',
  }

  const defaults = getCategoryDefaults(normalizedFood)
  const baseFood = {
    ...normalizedFood,
    fiber: Number(normalizedFood.fiber ?? defaults.fiber),
    sugar: Number(normalizedFood.sugar ?? defaults.sugar),
    sodium: Number(normalizedFood.sodium ?? defaults.sodium),
    potassium: Number(normalizedFood.potassium ?? defaults.potassium),
    calcium: Number(normalizedFood.calcium ?? defaults.calcium),
    iron: Number(normalizedFood.iron ?? defaults.iron),
    magnesium: Number(normalizedFood.magnesium ?? defaults.magnesium),
    zinc: Number(normalizedFood.zinc ?? defaults.zinc),
    vitaminA: Number(normalizedFood.vitaminA ?? defaults.vitaminA),
    vitaminB: Number(normalizedFood.vitaminB ?? defaults.vitaminB),
    vitaminC: Number(normalizedFood.vitaminC ?? defaults.vitaminC),
    vitaminD: Number(normalizedFood.vitaminD ?? defaults.vitaminD),
    vitaminE: Number(normalizedFood.vitaminE ?? defaults.vitaminE),
  }

  const metrics = computeFoodMetrics(baseFood)
  const scaled = scaleFood(
    {
      ...baseFood,
      nutritionQuality: metrics.nutritionQuality,
      healthScore: metrics.healthScore,
      healthRating: getFoodRating(metrics.healthScore),
      ingredientTags: getFoodTags(baseFood),
    },
    servings,
  )

  return {
    ...scaled,
    nutritionQuality: metrics.nutritionQuality,
    healthScore: metrics.healthScore,
    healthRating: getFoodRating(metrics.healthScore),
    ingredientTags: getFoodTags(baseFood),
  }
}

export function summarizeNutrition(meals = []) {
  return meals.reduce(
    (summary, meal) => {
      const details = buildFoodNutritionDetails(meal)
      summary.calories += details.calories
      summary.protein += details.protein
      summary.carbs += details.carbs
      summary.fats += details.fats
      summary.fiber += details.fiber
      summary.sugar += details.sugar
      summary.sodium += details.sodium
      summary.potassium += details.potassium
      summary.calcium += details.calcium
      summary.iron += details.iron
      summary.magnesium += details.magnesium
      summary.zinc += details.zinc
      summary.vitaminA += details.vitaminA
      summary.vitaminB += details.vitaminB
      summary.vitaminC += details.vitaminC
      summary.vitaminD += details.vitaminD
      summary.vitaminE += details.vitaminE
      summary.qualityTotal += details.nutritionQuality
      summary.healthTotal += details.healthScore
      summary.healthyMeals += details.nutritionQuality >= 72 ? 1 : 0
      summary.tags.push(...details.ingredientTags)
      return summary
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      potassium: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      zinc: 0,
      vitaminA: 0,
      vitaminB: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0,
      qualityTotal: 0,
      healthTotal: 0,
      healthyMeals: 0,
      tags: [],
    },
  )
}

export function buildMicronutrientCoverage(nutrition = {}) {
  return Object.entries(MICRO_NUTRIENT_META).reduce((acc, [key, meta]) => {
    acc[key] = clamp(Math.round((Number(nutrition[key] || 0) / meta.target) * 100), 0, 140)
    return acc
  }, {})
}

export function buildDailyNutritionSeries(meals = [], waterHistory = [], settings = {}, days = 30) {
  const groupedMeals = meals.reduce((acc, meal) => {
    const key = meal.date || getTodayIso()
    acc[key] = [...(acc[key] || []), meal]
    return acc
  }, {})

  const waterMap = waterHistory.reduce((acc, entry) => {
    acc[entry.date] = entry.intake
    return acc
  }, {})

  return buildDayRange(days).map((item) => {
    const dailyMeals = groupedMeals[item.iso] || []
    const totals = summarizeNutrition(dailyMeals)
    const water = Number(waterMap[item.iso] ?? 0)
    const mealCount = dailyMeals.length
    const quality = mealCount ? Math.round(totals.qualityTotal / mealCount) : 0
    const macroCalories = totals.protein * 4 + totals.carbs * 4 + totals.fats * 9
    const carbRatio = macroCalories ? (totals.carbs * 4) / macroCalories : 0
    const fatRatio = macroCalories ? (totals.fats * 9) / macroCalories : 0

    return {
      date: item.iso,
      label: item.label,
      day: item.day,
      calories: roundValue(totals.calories, 0),
      protein: roundValue(totals.protein, 1),
      carbs: roundValue(totals.carbs, 1),
      fats: roundValue(totals.fats, 1),
      fiber: roundValue(totals.fiber, 1),
      sugar: roundValue(totals.sugar, 1),
      water,
      mealCount,
      nutritionQuality: quality,
      goalReached: settings.calorieGoal ? scoreAgainstTarget(totals.calories, settings.calorieGoal, 0.2) >= 70 : false,
      carbRatio: roundValue(carbRatio * 100, 0),
      fatRatio: roundValue(fatRatio * 100, 0),
      micronutrients: buildMicronutrientCoverage(totals),
    }
  })
}

export function buildWeeklySummary(meals = [], waterHistory = [], settings = {}) {
  return buildDailyNutritionSeries(meals, waterHistory, settings, 7)
}

export function buildMacroBreakdown(weeklySummary = []) {
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
    { name: 'Protein', value: roundValue(totals.protein, 0), color: '#22d3ee' },
    { name: 'Carbs', value: roundValue(totals.carbs, 0), color: '#f59e0b' },
    { name: 'Fats', value: roundValue(totals.fats, 0), color: '#8b5cf6' },
  ]
}

export function computeStreak(meals = []) {
  const dateKeys = [...new Set(meals.map((meal) => meal.date).filter(Boolean))]
  return computeDateStreak(dateKeys)
}

export function computeDateStreak(dateKeys = [], predicate = () => true) {
  const keySet = new Set(dateKeys.filter(Boolean))
  const today = new Date()
  let streak = 0

  for (let offset = 0; offset < 45; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const iso = toDateKey(date)
    const matches = keySet.has(iso) && predicate(iso)
    if (matches) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

export function buildMonthlyProgress(meals = [], waterHistory = [], settings = {}) {
  return buildDailyNutritionSeries(meals, waterHistory, settings, 30)
}

export function buildWaterTrend(weeklySummary = [], waterHistory = [], settings = {}) {
  const waterMap = waterHistory.reduce((acc, entry) => {
    acc[entry.date] = entry.intake
    return acc
  }, {})

  return weeklySummary.map((item) => ({
    day: item.day,
    date: item.date,
    intake: roundValue(Number(waterMap[item.date] ?? item.water ?? 0), 2),
    goal: settings.waterGoal || 8,
    completion: clamp(Math.round((Number(waterMap[item.date] ?? item.water ?? 0) / Math.max(1, settings.waterGoal || 8)) * 100), 0, 140),
  }))
}

export function buildWeightSeries(weightLogs = []) {
  return [...weightLogs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: formatDate(entry.date),
      weight: entry.weight,
    }))
}

export function buildMealCategoryBreakdown(meals = []) {
  const breakdown = meals.reduce((acc, meal) => {
    const category = meal.foodCategory || meal.category || 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return Object.entries(breakdown).map(([name, value], index) => ({
    name,
    value,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))
}

export function buildNutritionRatio(dailyNutrition = {}) {
  const proteinCalories = Number(dailyNutrition.protein || 0) * 4
  const carbCalories = Number(dailyNutrition.carbs || 0) * 4
  const fatCalories = Number(dailyNutrition.fats || 0) * 9
  const total = Math.max(proteinCalories + carbCalories + fatCalories, 1)

  return [
    { name: 'Protein', value: Math.round((proteinCalories / total) * 100), color: '#22d3ee' },
    { name: 'Carbs', value: Math.round((carbCalories / total) * 100), color: '#f59e0b' },
    { name: 'Fats', value: Math.round((fatCalories / total) * 100), color: '#8b5cf6' },
  ]
}

export function buildFrequencyBins(values = [], bucketSize = 20, bucketCount = 6) {
  if (!values.length) return []
  const maxValue = Math.max(...values, bucketSize)
  const count = Math.max(bucketCount, Math.ceil(maxValue / bucketSize))
  const bins = Array.from({ length: count }, (_, index) => ({
    range: `${index * bucketSize}-${(index + 1) * bucketSize}`,
    count: 0,
  }))

  values.forEach((value) => {
    const bucket = Math.min(Math.floor(value / bucketSize), bins.length - 1)
    bins[bucket].count += 1
  })

  return bins
}

export function buildFatTrend(weeklySummary = []) {
  return weeklySummary.map((item) => ({ day: item.day, fats: item.fats }))
}

export function buildGoalCompletionTrend(weeklySummary = [], calorieGoal = 2000) {
  return weeklySummary.map((item) => ({
    day: item.day,
    completion: scoreAgainstTarget(item.calories, calorieGoal, 0.2),
  }))
}

export function buildMicronutrientRadar(micronutrients = {}) {
  return Object.entries(MICRO_NUTRIENT_META).map(([key, meta]) => ({
    nutrient: meta.label,
    value: micronutrients[key] || 0,
  }))
}

export function buildVitaminOverview(micronutrients = {}) {
  return [
    { name: 'Vitamin A', value: micronutrients.vitaminA || 0, color: '#f59e0b' },
    { name: 'Vitamin B', value: micronutrients.vitaminB || 0, color: '#34d399' },
    { name: 'Vitamin C', value: micronutrients.vitaminC || 0, color: '#38bdf8' },
    { name: 'Vitamin D', value: micronutrients.vitaminD || 0, color: '#a855f7' },
    { name: 'Vitamin E', value: micronutrients.vitaminE || 0, color: '#f472b6' },
  ]
}

export function computeNutritionQualityIndex(meals = []) {
  if (!meals.length) {
    return { quality: 0, processedPercent: 0, healthyRating: 'Needs fuel', wholeFoodPercent: 0 }
  }

  const detailed = meals.map((meal) => buildFoodNutritionDetails(meal))
  const processed = detailed.filter((meal) => ['Fast Food'].includes(meal.category) || meal.sugar > 20 || meal.sodium > 700)
  const wholeFood = detailed.filter((meal) => ['Fruits', 'Vegetables', 'Protein Foods', 'Rice & Grains'].includes(meal.category))
  const averageQuality = detailed.reduce((sum, meal) => sum + meal.nutritionQuality, 0) / detailed.length
  const processedPercent = Math.round((processed.length / detailed.length) * 100)
  const wholeFoodPercent = Math.round((wholeFood.length / detailed.length) * 100)
  const quality = clamp(Math.round(averageQuality * 0.72 + wholeFoodPercent * 0.34 - processedPercent * 0.18), 0, 100)
  const healthyRating = quality >= 85 ? 'Elite' : quality >= 72 ? 'Strong' : quality >= 58 ? 'Balanced' : quality >= 40 ? 'Average' : 'Needs work'

  return { quality, processedPercent, healthyRating, wholeFoodPercent }
}

function buildHealthInsights({
  calorieScore,
  proteinScore,
  carbBalanceScore,
  fatBalanceScore,
  hydrationScore,
  consistencyScore,
  nutritionQualityScore,
  dailyNutrition,
  settings,
  waterIntake,
}) {
  const insights = []

  if (hydrationScore < 65) {
    insights.push('Your hydration is low today.')
  } else if (hydrationScore >= 95) {
    insights.push('Hydration is excellent and supporting recovery.')
  }

  if (proteinScore < 70) {
    insights.push(`You are about ${Math.max(0, Math.round((settings.proteinGoal || 0) - (dailyNutrition.protein || 0)))}g short on protein.`)
  } else if (proteinScore >= 95) {
    insights.push('Excellent protein intake today.')
  }

  if (carbBalanceScore < 58) {
    insights.push('Carb balance is drifting off your ideal energy range.')
  }

  if (fatBalanceScore < 58) {
    insights.push('Fat intake could be balanced a bit better today.')
  }

  if (calorieScore < 55) {
    insights.push('Energy intake is noticeably away from your target.')
  }

  if (consistencyScore >= 80) {
    insights.push('Your consistency streak is creating strong momentum.')
  }

  if (nutritionQualityScore < 60) {
    insights.push('Food quality can improve with more whole-food choices.')
  }

  return insights.slice(0, 4)
}

function buildHealthRecommendations({
  proteinScore,
  hydrationScore,
  calorieScore,
  nutritionQualityScore,
  dailyNutrition,
  settings,
  waterIntake,
  recommendedCalories,
}) {
  const items = []

  if (hydrationScore < 80) {
    items.push({
      title: 'Hydrate earlier',
      detail: `You are ${roundValue(Math.max((settings.waterGoal || 0) - waterIntake, 0), 1)}L below your goal. Front-load two glasses this afternoon.`,
    })
  }

  if (proteinScore < 85) {
    items.push({
      title: 'Add a protein anchor',
      detail: `Aim for one more ${Math.max(10, Math.round((settings.proteinGoal || 0) - (dailyNutrition.protein || 0)))}g serving like yogurt, eggs, tofu, or chicken.`,
    })
  }

  if (nutritionQualityScore < 70) {
    items.push({
      title: 'Upgrade meal quality',
      detail: 'Swap one processed snack for fruit, nuts, lentils, or a vegetable-based side.',
    })
  }

  if (calorieScore < 70) {
    const difference = Math.round((dailyNutrition.calories || 0) - recommendedCalories)
    items.push({
      title: difference > 0 ? 'Tighten energy intake' : 'Refuel smoothly',
      detail: difference > 0
        ? `You are about ${Math.abs(difference)} kcal above your ideal pace. Keep the next meal lighter and fiber-forward.`
        : `You are about ${Math.abs(difference)} kcal under your ideal pace. A balanced snack can keep energy steady.`,
    })
  }

  if (!items.length) {
    items.push({
      title: 'Keep the streak alive',
      detail: 'You are trending well. Repeat what worked today and preserve the consistency.',
    })
  }

  return items.slice(0, 3)
}

export function buildHealthScore({
  dailyNutrition = {},
  settings = {},
  waterIntake = 0,
  streak = 0,
  weeklySummary = [],
  recommendedCalories = 2000,
  dailyMeals = [],
}) {
  const calorieTarget = recommendedCalories || settings.calorieGoal || 2000
  const calorieScore = scoreAgainstTarget(dailyNutrition.calories || 0, calorieTarget, 0.16)
  const proteinScore = clamp(Math.round(((dailyNutrition.protein || 0) / Math.max(1, settings.proteinGoal || 120)) * 100), 0, 110)

  const macroCalories = (dailyNutrition.protein || 0) * 4 + (dailyNutrition.carbs || 0) * 4 + (dailyNutrition.fats || 0) * 9
  const carbRatio = macroCalories ? ((dailyNutrition.carbs || 0) * 4) / macroCalories : 0
  const fatRatio = macroCalories ? ((dailyNutrition.fats || 0) * 9) / macroCalories : 0
  const carbBalanceScore = scoreRatioAroundIdeal(carbRatio, 0.48, 0.18)
  const fatBalanceScore = scoreRatioAroundIdeal(fatRatio, 0.28, 0.14)
  const hydrationScore = clamp(Math.round((waterIntake / Math.max(1, settings.waterGoal || 8)) * 100), 0, 110)

  const weeklyCompletion = weeklySummary.length
    ? Math.round(
      weeklySummary.reduce((sum, item) => sum + scoreAgainstTarget(item.calories, calorieTarget, 0.16), 0) /
        Math.max(1, weeklySummary.length),
    )
    : 0
  const consistencyScore = clamp(Math.round(Math.min(100, streak * 13) * 0.55 + weeklyCompletion * 0.45), 0, 100)
  const nutritionQualityScore = computeNutritionQualityIndex(dailyMeals).quality

  const goalCompletionScore = Math.round(
    (scoreAgainstTarget(dailyNutrition.calories || 0, settings.calorieGoal || calorieTarget, 0.18) +
      clamp(Math.round(((dailyNutrition.protein || 0) / Math.max(1, settings.proteinGoal || 120)) * 100), 0, 100) +
      clamp(Math.round((waterIntake / Math.max(1, settings.waterGoal || 8)) * 100), 0, 100)) /
      3,
  )

  const score = clamp(
    Math.round(
      calorieScore * 0.18 +
        proteinScore * 0.16 +
        carbBalanceScore * 0.1 +
        fatBalanceScore * 0.1 +
        hydrationScore * 0.14 +
        goalCompletionScore * 0.1 +
        consistencyScore * 0.1 +
        nutritionQualityScore * 0.12,
    ),
    0,
    100,
  )

  const grade = score >= 78 ? 'excellent' : score >= 55 ? 'average' : 'poor'
  const palette =
    grade === 'excellent'
      ? { from: '#22c55e', to: '#14b8a6', halo: 'rgba(34,197,94,0.28)', text: 'text-emerald-300' }
      : grade === 'average'
        ? { from: '#facc15', to: '#f97316', halo: 'rgba(250,204,21,0.28)', text: 'text-amber-300' }
        : { from: '#fb7185', to: '#ef4444', halo: 'rgba(251,113,133,0.28)', text: 'text-rose-300' }

  const insights = buildHealthInsights({
    calorieScore,
    proteinScore,
    carbBalanceScore,
    fatBalanceScore,
    hydrationScore,
    consistencyScore,
    nutritionQualityScore,
    dailyNutrition,
    settings,
    waterIntake,
  })

  const recommendations = buildHealthRecommendations({
    proteinScore,
    hydrationScore,
    calorieScore,
    nutritionQualityScore,
    dailyNutrition,
    settings,
    waterIntake,
    recommendedCalories: calorieTarget,
  })

  const feedback =
    grade === 'excellent'
      ? 'Your body metrics are lining up beautifully today.'
      : grade === 'average'
        ? 'You are on a decent track today, with a few clear opportunities to level up.'
        : 'Today needs a reset, but a few smart changes can lift your score quickly.'

  return {
    score,
    grade,
    palette,
    feedback,
    insights,
    recommendations,
    components: [
      { key: 'calories', label: 'Calories', score: calorieScore, value: dailyNutrition.calories || 0, target: calorieTarget },
      { key: 'protein', label: 'Protein', score: clamp(proteinScore, 0, 100), value: dailyNutrition.protein || 0, target: settings.proteinGoal || 120 },
      { key: 'carbs', label: 'Carb balance', score: carbBalanceScore, value: Math.round(carbRatio * 100), target: 48 },
      { key: 'fats', label: 'Fat balance', score: fatBalanceScore, value: Math.round(fatRatio * 100), target: 28 },
      { key: 'hydration', label: 'Hydration', score: clamp(hydrationScore, 0, 100), value: roundValue(waterIntake, 1), target: settings.waterGoal || 8 },
      { key: 'goals', label: 'Goal completion', score: goalCompletionScore, value: goalCompletionScore, target: 100 },
      { key: 'consistency', label: 'Consistency', score: consistencyScore, value: streak, target: 7 },
      { key: 'quality', label: 'Nutrition quality', score: nutritionQualityScore, value: nutritionQualityScore, target: 100 },
    ],
  }
}

export function buildGamificationProfile({
  meals = [],
  waterHistory = [],
  settings = {},
  monthlyProgress = [],
  healthScore = 0,
  nutritionQuality = 0,
}) {
  const loggingStreak = computeStreak(meals)
  const hydrationDates = waterHistory.filter((entry) => entry.intake >= Math.max((settings.waterGoal || 8) * 0.85, 2)).map((entry) => entry.date)
  const hydrationStreak = computeDateStreak(hydrationDates)

  const proteinDates = monthlyProgress.filter((day) => day.protein >= Math.max((settings.proteinGoal || 120) * 0.9, 20)).map((day) => day.date)
  const proteinGoalStreak = computeDateStreak(proteinDates)

  const goalDates = monthlyProgress
    .filter((day) => scoreAgainstTarget(day.calories, settings.calorieGoal || 2000, 0.18) >= 70 && day.water >= Math.max((settings.waterGoal || 8) * 0.85, 2))
    .map((day) => day.date)
  const goalCompletionStreak = computeDateStreak(goalDates)

  const healthyDates = monthlyProgress.filter((day) => day.nutritionQuality >= 72 && day.mealCount >= 2).map((day) => day.date)
  const healthyEatingStreak = computeDateStreak(healthyDates)

  const xp = Math.round(
    loggingStreak * 26 +
      hydrationStreak * 18 +
      proteinGoalStreak * 18 +
      goalCompletionStreak * 22 +
      healthyEatingStreak * 16 +
      healthScore * 4,
  )
  const level = Math.max(1, Math.floor(xp / 250) + 1)
  const levelProgress = clamp(Math.round(((xp % 250) / 250) * 100), 0, 100)

  const achievements = [
    {
      id: 'logging-7',
      title: '7 Day Logging Streak',
      description: 'Log food seven days in a row.',
      progress: loggingStreak,
      target: 7,
      unlocked: loggingStreak >= 7,
      accent: 'from-fuchsia-500 to-violet-500',
    },
    {
      id: 'protein-master',
      title: 'Protein Master',
      description: 'Hit your protein goal for five straight days.',
      progress: proteinGoalStreak,
      target: 5,
      unlocked: proteinGoalStreak >= 5,
      accent: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'hydration-hero',
      title: 'Hydration Hero',
      description: 'Reach your hydration goal three days in a row.',
      progress: hydrationStreak,
      target: 3,
      unlocked: hydrationStreak >= 3,
      accent: 'from-sky-400 to-teal-400',
    },
    {
      id: 'consistency-champion',
      title: 'Nutrition Consistency Champion',
      description: 'Maintain quality eating for six consecutive days.',
      progress: healthyEatingStreak,
      target: 6,
      unlocked: healthyEatingStreak >= 6,
      accent: 'from-emerald-400 to-lime-400',
    },
  ].map((achievement) => ({
    ...achievement,
    completion: clamp(Math.round((achievement.progress / achievement.target) * 100), 0, 100),
  }))

  const unlockedCount = achievements.filter((item) => item.unlocked).length
  const nextAchievement = achievements.find((item) => !item.unlocked) || achievements[0]

  return {
    loggingStreak,
    hydrationStreak,
    goalCompletionStreak,
    proteinGoalStreak,
    healthyEatingStreak,
    xp,
    level,
    levelProgress,
    unlockedCount,
    nextAchievement,
    achievements,
    focusText:
      nutritionQuality >= 80 && healthScore >= 75
        ? 'You are in a strong rhythm. Protect consistency and stack more streak days.'
        : 'The biggest wins are consistency, hydration, and a few higher-quality food choices.',
  }
}

export function getTimeBasedGreeting(name = 'there', date = new Date()) {
  const hours = date.getHours()
  const firstName = (name || 'there').split(' ')[0]
  const period = hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening'
  const greeting = `Good ${period}, ${firstName}`
  const message =
    period === 'morning'
      ? 'Start the day strong with hydration and a balanced first meal.'
      : period === 'afternoon'
        ? 'Keep momentum steady with smart fueling and hydration.'
        : 'Finish the day with recovery-focused nutrition and reflection.'

  return { greeting, message, period }
}

export function buildAIInsights({
  dailyHealth = {},
  weeklySummary = [],
  dailyNutrition = {},
  waterIntake = 0,
  settings = {},
  micronutrients = {},
  healthProfile = {},
  recommendedCalories = 2000,
  gamification = {},
  nutritionQualityIndex = {},
}) {
  const insights = []
  const recentDays = weeklySummary.slice(-3)
  const previousDays = weeklySummary.slice(Math.max(0, weeklySummary.length - 6), Math.max(0, weeklySummary.length - 3))
  const averageProteinRecent = recentDays.reduce((sum, item) => sum + item.protein, 0) / Math.max(1, recentDays.length)
  const averageProteinPrevious = previousDays.reduce((sum, item) => sum + item.protein, 0) / Math.max(1, previousDays.length)
  const proteinDelta = averageProteinPrevious ? Math.round(((averageProteinRecent - averageProteinPrevious) / averageProteinPrevious) * 100) : 0
  const recentHealth = recentDays.reduce((sum, item) => sum + (item.nutritionQuality || 0), 0) / Math.max(1, recentDays.length)
  const previousHealth = previousDays.reduce((sum, item) => sum + (item.nutritionQuality || 0), 0) / Math.max(1, previousDays.length)
  const qualityDelta = previousHealth ? Math.round(recentHealth - previousHealth) : 0
  const micronutrientAverage = Object.values(micronutrients).reduce((sum, value) => sum + value, 0) / Math.max(1, Object.keys(micronutrients).length)
  const hydrationGap = roundValue(Math.max((settings.waterGoal || 0) - waterIntake, 0), 1)
  const calorieDelta = Math.round((dailyNutrition.calories || 0) - recommendedCalories)

  if (proteinDelta > 0) {
    insights.push({
      id: 'protein-improved',
      title: `Your protein intake improved by ${proteinDelta}% this week.`,
      detail: 'Recovery-focused meals are trending upward and supporting your long-term consistency.',
      category: 'Protein',
      badge: 'AI trend',
      priority: 'medium',
      status: 'improving',
    })
  }

  if (hydrationGap >= 0.4) {
    insights.push({
      id: 'hydration-gap',
      title: `You may benefit from increasing hydration by ${Math.round(hydrationGap * 1000)}ml.`,
      detail: 'Hydration is the fastest lever you can pull today for better energy and appetite control.',
      category: 'Hydration',
      badge: 'Optimization',
      priority: 'high',
      status: 'action-needed',
    })
  }

  if (micronutrientAverage >= 82) {
    insights.push({
      id: 'micronutrient-strong',
      title: 'Your micronutrient balance is excellent today.',
      detail: 'Vitamin and mineral coverage is broadly strong, which is helping overall food quality stay elevated.',
      category: 'Micronutrients',
      badge: 'Quality',
      priority: 'low',
      status: 'excellent',
    })
  } else if (micronutrientAverage < 58) {
    insights.push({
      id: 'micronutrient-gap',
      title: 'Micronutrient coverage is trailing today.',
      detail: 'Add colorful produce, nuts, seeds, or legumes to close mineral and vitamin gaps.',
      category: 'Micronutrients',
      badge: 'Attention',
      priority: 'high',
      status: 'action-needed',
    })
  }

  if (qualityDelta > 0 || dailyHealth.score >= 78) {
    insights.push({
      id: 'health-trend',
      title: `Health score quality is ${qualityDelta > 0 ? `${qualityDelta} points higher` : 'holding strong'} versus earlier this week.`,
      detail: 'Consistency and nutrition quality are combining well right now. Keep repeating the best parts of your routine.',
      category: 'Health Score',
      badge: 'Trajectory',
      priority: 'medium',
      status: 'improving',
    })
  }

  if (Math.abs(calorieDelta) > 180) {
    insights.push({
      id: 'calorie-balance',
      title: calorieDelta > 0 ? 'Energy intake is above your recommended pace.' : 'Energy intake is below your recommended pace.',
      detail: calorieDelta > 0
        ? `You are about ${Math.abs(calorieDelta)} kcal high. Favor lighter, high-volume choices next.`
        : `You are about ${Math.abs(calorieDelta)} kcal low. A balanced snack can smooth recovery and focus.`,
      category: 'Calories',
      badge: 'Fuel',
      priority: 'medium',
      status: calorieDelta > 0 ? 'watch' : 'opportunity',
    })
  }

  if ((gamification.goalCompletionStreak || 0) >= 3) {
    insights.push({
      id: 'streak-bonus',
      title: `You are on a ${gamification.goalCompletionStreak}-day goal completion streak.`,
      detail: 'This is the perfect time to protect momentum and stack an achievement unlock.',
      category: 'Consistency',
      badge: 'Streak',
      priority: 'low',
      status: 'excellent',
    })
  }

  if (healthProfile.currentWeight && healthProfile.targetWeight) {
    const distance = roundValue(Math.abs(healthProfile.currentWeight - healthProfile.targetWeight), 1)
    insights.push({
      id: 'weight-goal',
      title: `You are ${distance}kg away from your target weight.`,
      detail: 'Stay focused on repeatable daily behaviors rather than only scale movement.',
      category: 'Weight Goal',
      badge: 'Forecast',
      priority: distance > 8 ? 'high' : 'medium',
      status: 'watch',
    })
  }

  return insights.slice(0, 6)
}

export function buildDailyChallenges({
  date = getTodayIso(),
  dailyNutrition = {},
  waterIntake = 0,
  settings = {},
  dailyMeals = [],
  gamification = {},
}) {
  const carbTarget = Math.round(((settings.calorieGoal || 2200) * 0.48) / 4)
  const carbMin = carbTarget * 0.82
  const carbMax = carbTarget * 1.12
  const challengeSeed = date.slice(-2)

  const baseChallenges = [
    {
      id: `hydrate-${challengeSeed}`,
      title: 'Hydration Hero',
      description: 'Hit your hydration goal today.',
      progress: roundValue(waterIntake, 1),
      target: settings.waterGoal || 3,
      unit: 'L',
      xp: 40,
    },
    {
      id: `calories-${challengeSeed}`,
      title: 'Calorie Precision',
      description: 'Stay within your calorie target zone.',
      progress: clamp(scoreAgainstTarget(dailyNutrition.calories || 0, settings.calorieGoal || 2200, 0.16), 0, 100),
      target: 100,
      unit: '%',
      xp: 55,
    },
    {
      id: `protein-${challengeSeed}`,
      title: 'Protein Goal',
      description: 'Reach your protein target for the day.',
      progress: roundValue(dailyNutrition.protein || 0, 1),
      target: settings.proteinGoal || 120,
      unit: 'g',
      xp: 50,
    },
    {
      id: `carb-${challengeSeed}`,
      title: 'Carb Balance',
      description: 'Stay inside your ideal carb range.',
      progress: clamp(Math.round(((dailyNutrition.carbs || 0) / Math.max(1, carbTarget)) * 100), 0, 130),
      target: 100,
      unit: '%',
      xp: 35,
      completed: dailyNutrition.carbs >= carbMin && dailyNutrition.carbs <= carbMax,
    },
    {
      id: `meal-logs-${challengeSeed}`,
      title: 'Complete Logging',
      description: 'Log four meals or snacks today.',
      progress: dailyMeals.length,
      target: 4,
      unit: 'logs',
      xp: 45,
    },
  ]

  return baseChallenges.map((challenge) => {
    const completed = challenge.completed ?? challenge.progress >= challenge.target
    const completion = clamp(Math.round((challenge.progress / Math.max(1, challenge.target)) * 100), 0, 100)
    const streakBonus = completed ? Math.min(25, (gamification.loggingStreak || 0) * 2) : 0
    return {
      ...challenge,
      completed,
      completion,
      reward: challenge.xp + streakBonus,
      streakBonus,
    }
  })
}

export function computeHealthScoreFromData({ meals = [], waterHistory = [], settings = {}, streak = 0, weightSeries = [] }) {
  const monthly = buildMonthlyProgress(meals, waterHistory, settings)
  const today = monthly[monthly.length - 1] || {}
  return buildHealthScore({
    dailyNutrition: today,
    settings,
    waterIntake: today.water || 0,
    streak,
    weeklySummary: monthly.slice(-7),
    recommendedCalories: settings.calorieGoal || 2000,
    dailyMeals: meals.filter((meal) => meal.date === getTodayIso()),
    weightSeries,
  }).score
}

export function predictDaysToTarget({ currentWeight, targetWeight, avgDailyCalories, recommendedCalories }) {
  const calorieDelta = Number(recommendedCalories || 0) - Number(avgDailyCalories || 0)
  if (!calorieDelta) return 'On pace'
  const dailyWeightChange = calorieDelta / 7700
  const remainingKg = Math.abs(Number(targetWeight || 0) - Number(currentWeight || 0))
  const days = Math.round(remainingKg / Math.max(Math.abs(dailyWeightChange), 0.001))
  if (!isFinite(days) || days > 1500) return 'Long-term'
  return `${days} day${days === 1 ? '' : 's'}`
}

export function generateSmartSuggestions({ dailyNutrition = {}, water = 0, micronutrients = {}, settings = {} }) {
  const recommendations = buildHealthRecommendations({
    proteinScore: clamp(Math.round(((dailyNutrition.protein || 0) / Math.max(1, settings.proteinGoal || 120)) * 100), 0, 100),
    hydrationScore: clamp(Math.round((water / Math.max(1, settings.waterGoal || 8)) * 100), 0, 100),
    calorieScore: scoreAgainstTarget(dailyNutrition.calories || 0, settings.calorieGoal || 2000, 0.18),
    nutritionQualityScore: computeNutritionQualityIndex([dailyNutrition]).quality,
    dailyNutrition,
    settings,
    waterIntake: water,
    recommendedCalories: settings.calorieGoal || 2000,
    micronutrients,
  })

  return recommendations.map((item, index) => ({
    key: `${item.title}-${index}`,
    title: item.title,
    detail: item.detail,
  }))
}

export function buildReportAggregates(meals = [], waterHistory = [], weightLogs = [], settings = {}) {
  const weekly = buildWeeklySummary(meals, waterHistory, settings)
  const monthly = buildMonthlyProgress(meals, waterHistory, settings)
  const avgCalories = Math.round(weekly.reduce((sum, day) => sum + day.calories, 0) / Math.max(1, weekly.length))
  const avgProtein = Math.round(weekly.reduce((sum, day) => sum + day.protein, 0) / Math.max(1, weekly.length))
  const hydrationConsistency = Math.round((waterHistory.filter((entry) => entry.intake >= Math.max((settings.waterGoal || 8) * 0.85, 2)).length / Math.max(1, waterHistory.length)) * 100)
  const streak = computeStreak(meals)

  return { weekly, monthly, avgCalories, avgProtein, hydrationConsistency, streak, weightLogs }
}
