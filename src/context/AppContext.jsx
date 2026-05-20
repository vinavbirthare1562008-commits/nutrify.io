import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import foodDatabase from '../data/foodDatabase.js'
import {
  MICRO_NUTRIENT_META,
  buildAIInsights,
  buildDailyChallenges,
  buildFoodNutritionDetails,
  buildGamificationProfile,
  buildHealthScore,
  buildMacroBreakdown,
  buildMicronutrientCoverage,
  buildMonthlyProgress,
  buildWaterTrend,
  buildWeeklySummary,
  buildWeightSeries,
  clamp,
  computeNutritionQualityIndex,
  computeStreak,
  getTimeBasedGreeting,
  getTodayIso,
  roundValue,
  summarizeNutrition,
} from '../utils/appUtils.js'

const AppContext = createContext(null)

const defaultSettings = {
  calorieGoal: 2200,
  proteinGoal: 120,
  waterGoal: 3,
  weightGoal: 72,
  height: 170,
  age: 28,
}

const themePresets = [
  {
    key: 'neon-dark',
    name: 'Neon Dark',
    description: 'Electric cyan and violet glow',
    mode: 'dark',
    colors: ['#22d3ee', '#8b5cf6', '#34d399'],
    preview: 'linear-gradient(135deg, #041321, #120b2f 52%, #061c19)',
    background: 'radial-gradient(circle at 12% 12%, rgba(34,211,238,0.22), transparent 28%), radial-gradient(circle at 86% 16%, rgba(168,85,247,0.28), transparent 32%), linear-gradient(180deg, #020617 0%, #071225 54%, #020617 100%)',
  },
  {
    key: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean editorial wellness light mode',
    mode: 'light',
    colors: ['#0f172a', '#38bdf8', '#f97316'],
    preview: 'linear-gradient(135deg, #ffffff, #edf5ff 60%, #fff7ed)',
    background: 'radial-gradient(circle at 10% 12%, rgba(56,189,248,0.12), transparent 26%), radial-gradient(circle at 84% 20%, rgba(249,115,22,0.12), transparent 30%), linear-gradient(180deg, #ffffff 0%, #edf5ff 52%, #fff7ed 100%)',
  },
  {
    key: 'cyber-green',
    name: 'Cyber Green',
    description: 'Luminous green performance lab',
    mode: 'dark',
    colors: ['#22c55e', '#14b8a6', '#bef264'],
    preview: 'linear-gradient(135deg, #04180b, #0c2618 55%, #132d13)',
    background: 'radial-gradient(circle at 14% 12%, rgba(34,197,94,0.24), transparent 28%), radial-gradient(circle at 86% 18%, rgba(20,184,166,0.22), transparent 32%), linear-gradient(180deg, #03150a 0%, #071d12 50%, #021109 100%)',
  },
  {
    key: 'fitness-orange',
    name: 'Fitness Orange',
    description: 'Warm energetic recovery tones',
    mode: 'dark',
    colors: ['#fb923c', '#f97316', '#facc15'],
    preview: 'linear-gradient(135deg, #231006, #33150b 55%, #3d2506)',
    background: 'radial-gradient(circle at 12% 14%, rgba(251,146,60,0.22), transparent 28%), radial-gradient(circle at 84% 18%, rgba(250,204,21,0.18), transparent 28%), linear-gradient(180deg, #1a0b06 0%, #241108 52%, #130804 100%)',
  },
  {
    key: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep calm analytics atmosphere',
    mode: 'dark',
    colors: ['#60a5fa', '#2563eb', '#22d3ee'],
    preview: 'linear-gradient(135deg, #061128, #0b1738 55%, #0a2036)',
    background: 'radial-gradient(circle at 12% 12%, rgba(96,165,250,0.22), transparent 28%), radial-gradient(circle at 84% 18%, rgba(34,211,238,0.18), transparent 30%), linear-gradient(180deg, #040b1d 0%, #08142b 54%, #05101f 100%)',
  },
  {
    key: 'purple-glass',
    name: 'Purple Glass',
    description: 'Luxury glassmorphism with soft violet bloom',
    mode: 'dark',
    colors: ['#c084fc', '#8b5cf6', '#f472b6'],
    preview: 'linear-gradient(135deg, #12081f, #1b1034 58%, #220f25)',
    background: 'radial-gradient(circle at 14% 12%, rgba(192,132,252,0.22), transparent 28%), radial-gradient(circle at 84% 20%, rgba(244,114,182,0.18), transparent 30%), linear-gradient(180deg, #090411 0%, #140a22 55%, #09030f 100%)',
  },
]

function normalizeTheme(value) {
  if (value === 'dark') return 'neon-dark'
  if (value === 'light') return 'minimal-white'
  return themePresets.some((item) => item.key === value) ? value : 'neon-dark'
}

function enrichMealRecord(meal, overrides = {}) {
  const merged = { ...meal, ...overrides }
  const category = merged.foodCategory || merged.category || 'Mixed'
  const serving = merged.serving || '1 serving'
  const details = buildFoodNutritionDetails(
    {
      ...merged,
      category,
      serving,
    },
    1,
  )

  return {
    ...merged,
    ...details,
    category,
    foodCategory: category,
    mealType: merged.mealType || 'Lunch',
    serving,
  }
}

export function AppProvider({ children }) {
  const [meals, setMeals] = useLocalStorage('nutrition-tracker-meals', [])
  const [personalMeals, setPersonalMeals] = useLocalStorage('nutrition-tracker-personal-meals', [])
  const [favoriteMealIds, setFavoriteMealIds] = useLocalStorage('nutrition-tracker-favorite-meals', [])
  const [settings, setSettings] = useLocalStorage('nutrition-tracker-settings', defaultSettings)
  const [storedTheme, setStoredTheme] = useLocalStorage('nutrition-tracker-theme', 'neon-dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMealType, setSelectedMealType] = useState('All')
  const [selectedFoodGroup, setSelectedFoodGroup] = useState('All')
  const [activeMeal, setActiveMeal] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('nutrition-tracker-favorites', ['Chicken Breast', 'Oats', 'Greek Yogurt'])
  const [recentFoods, setRecentFoods] = useLocalStorage('nutrition-tracker-recent', ['Banana', 'Chicken Breast', 'Oats', 'Paneer Tikka'])
  const [waterIntake, setWaterIntake] = useLocalStorage('nutrition-tracker-water', 0)
  const [waterHistory, setWaterHistory] = useLocalStorage('nutrition-tracker-water-history', [{ date: getTodayIso(), intake: 0 }])
  const [weightLogs, setWeightLogs] = useLocalStorage('nutrition-tracker-weight', [
    {
      date: getTodayIso(),
      weight: 72,
    },
  ])
  const [notificationSettings, setNotificationSettings] = useLocalStorage('nutrition-tracker-notifications', {
    hydrationReminders: true,
    mealReminders: true,
    weeklySummary: true,
  })
  const [recentSearches, setRecentSearches] = useLocalStorage('nutrition-tracker-search-history', [])
  const [healthProfile, setHealthProfile] = useLocalStorage('nutrition-tracker-health-profile', {
    name: 'Avery',
    age: 28,
    gender: 'female',
    height: 170,
    currentWeight: 72,
    startWeight: 72,
    targetWeight: 68,
    activityLevel: 'moderate',
    fitnessGoal: 'weight loss',
  })

  const today = getTodayIso()
  const theme = normalizeTheme(storedTheme)
  const currentTheme = themePresets.find((item) => item.key === theme) || themePresets[0]
  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']
  const foodGroups = ['All', 'Fruits', 'Vegetables', 'Fast Food', 'Indian Food', 'Drinks', 'Snacks', 'Dairy', 'Protein Foods', 'Rice & Grains', 'Breakfast Foods']

  const dailyMeals = useMemo(
    () => meals.filter((meal) => meal.date === today),
    [meals, today],
  )

  const detailedDailyMeals = useMemo(
    () => dailyMeals.map((meal) => enrichMealRecord(meal)),
    [dailyMeals],
  )

  const dailyNutrition = useMemo(() => {
    const totals = summarizeNutrition(dailyMeals)
    const mealCount = dailyMeals.length
    const nutritionQuality = mealCount ? Math.round(totals.qualityTotal / mealCount) : 0
    const healthAverage = mealCount ? Math.round(totals.healthTotal / mealCount) : 0

    return {
      calories: roundValue(totals.calories, 0),
      protein: roundValue(totals.protein, 1),
      carbs: roundValue(totals.carbs, 1),
      fats: roundValue(totals.fats, 1),
      fiber: roundValue(totals.fiber, 1),
      sugar: roundValue(totals.sugar, 1),
      sodium: roundValue(totals.sodium, 0),
      potassium: roundValue(totals.potassium, 0),
      calcium: roundValue(totals.calcium, 0),
      iron: roundValue(totals.iron, 1),
      magnesium: roundValue(totals.magnesium, 0),
      zinc: roundValue(totals.zinc, 1),
      vitaminA: roundValue(totals.vitaminA, 0),
      vitaminB: roundValue(totals.vitaminB, 1),
      vitaminC: roundValue(totals.vitaminC, 0),
      vitaminD: roundValue(totals.vitaminD, 0),
      vitaminE: roundValue(totals.vitaminE, 1),
      healthyMeals: totals.healthyMeals,
      nutritionQuality,
      healthAverage,
      tags: Array.from(new Set(totals.tags)).slice(0, 6),
    }
  }, [dailyMeals])

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.35,
    moderate: 1.55,
    active: 1.7,
    intense: 1.9,
  }

  const bmr = useMemo(() => {
    const { age, height, currentWeight, gender } = healthProfile
    const base = 10 * currentWeight + 6.25 * height - 5 * age
    return Math.round(base + (gender === 'female' ? -161 : 5))
  }, [healthProfile])

  const recommendedCalories = useMemo(() => {
    const multiplier = activityMultipliers[healthProfile.activityLevel] || activityMultipliers.moderate
    const adjustment = healthProfile.fitnessGoal === 'weight loss' ? -300 : healthProfile.fitnessGoal === 'muscle gain' ? 250 : 0
    return clamp(Math.round(bmr * multiplier + adjustment), 1200, 4200)
  }, [healthProfile, bmr])

  const weeklySummary = useMemo(() => buildWeeklySummary(meals, waterHistory, settings), [meals, waterHistory, settings])
  const macroBreakdown = useMemo(() => buildMacroBreakdown(weeklySummary), [weeklySummary])
  const monthlyProgress = useMemo(() => buildMonthlyProgress(meals, waterHistory, settings), [meals, waterHistory, settings])
  const waterTrend = useMemo(() => buildWaterTrend(weeklySummary, waterHistory, settings), [weeklySummary, waterHistory, settings])
  const weightSeries = useMemo(() => buildWeightSeries(weightLogs), [weightLogs])
  const streak = useMemo(() => computeStreak(meals), [meals])
  const micronutrients = useMemo(() => buildMicronutrientCoverage(dailyNutrition), [dailyNutrition])
  const micronutrientCards = useMemo(
    () =>
      Object.entries(MICRO_NUTRIENT_META).map(([key, meta]) => ({
        key,
        ...meta,
        value: dailyNutrition[key] || 0,
        completion: micronutrients[key] || 0,
      })),
    [dailyNutrition, micronutrients],
  )
  const nutritionQualityIndex = useMemo(() => computeNutritionQualityIndex(detailedDailyMeals), [detailedDailyMeals])

  const totalCalories = dailyNutrition.calories
  const caloriesRemaining = Math.max(0, Math.round(settings.calorieGoal - totalCalories))
  const completion = clamp(Math.round((totalCalories / Math.max(1, settings.calorieGoal)) * 100), 0, 100)
  const proteinCompletion = clamp(Math.round((dailyNutrition.protein / Math.max(1, settings.proteinGoal)) * 100), 0, 100)
  const waterCompletion = clamp(Math.round((waterIntake / Math.max(1, settings.waterGoal)) * 100), 0, 100)

  const dailyHealth = useMemo(
    () =>
      buildHealthScore({
        dailyNutrition,
        settings,
        waterIntake,
        streak,
        weeklySummary,
        recommendedCalories,
        dailyMeals: detailedDailyMeals,
      }),
    [dailyNutrition, settings, waterIntake, streak, weeklySummary, recommendedCalories, detailedDailyMeals],
  )

  const gamification = useMemo(
    () =>
      buildGamificationProfile({
        meals,
        waterHistory,
        settings,
        monthlyProgress,
        healthScore: dailyHealth.score,
        nutritionQuality: nutritionQualityIndex.quality,
      }),
    [meals, waterHistory, settings, monthlyProgress, dailyHealth.score, nutritionQualityIndex.quality],
  )

  const personalizedGreeting = useMemo(() => getTimeBasedGreeting(healthProfile.name), [healthProfile.name])

  const weeklyHealthTimeline = useMemo(
    () =>
      weeklySummary.map((item) => ({
        ...item,
        healthScore: buildHealthScore({
          dailyNutrition: item,
          settings,
          waterIntake: item.water || 0,
          streak,
          weeklySummary,
          recommendedCalories,
          dailyMeals: meals.filter((meal) => meal.date === item.date),
        }).score,
      })),
    [weeklySummary, settings, streak, recommendedCalories, meals],
  )

  const healthTrendDelta = useMemo(() => {
    const recent = weeklyHealthTimeline.slice(-3)
    const earlier = weeklyHealthTimeline.slice(0, 3)
    const recentAvg = recent.reduce((sum, item) => sum + (item.healthScore || 0), 0) / Math.max(1, recent.length)
    const earlierAvg = earlier.reduce((sum, item) => sum + (item.healthScore || 0), 0) / Math.max(1, earlier.length)
    return Math.round(recentAvg - earlierAvg)
  }, [weeklyHealthTimeline])

  const aiInsights = useMemo(
    () =>
      buildAIInsights({
        dailyHealth,
        weeklySummary,
        dailyNutrition,
        waterIntake,
        settings,
        micronutrients,
        healthProfile,
        recommendedCalories,
        gamification,
        nutritionQualityIndex,
      }),
    [dailyHealth, weeklySummary, dailyNutrition, waterIntake, settings, micronutrients, healthProfile, recommendedCalories, gamification, nutritionQualityIndex],
  )

  const dailyChallenges = useMemo(
    () =>
      buildDailyChallenges({
        date: today,
        dailyNutrition,
        waterIntake,
        settings,
        dailyMeals: detailedDailyMeals,
        gamification,
      }),
    [today, dailyNutrition, waterIntake, settings, detailedDailyMeals, gamification],
  )

  const favoriteFoodItems = useMemo(
    () => foodDatabase.filter((item) => favorites.includes(item.name)),
    [favorites],
  )

  const recentFoodItems = useMemo(
    () =>
      recentFoods
        .map((name) => foodDatabase.find((item) => item.name === name))
        .filter(Boolean),
    [recentFoods],
  )

  const dailyScore = dailyHealth.score
  const performanceScore = dailyHealth.score
  const nutritionQuality = nutritionQualityIndex.quality

  const bmi = useMemo(() => {
    const heightMeters = Math.max(1, healthProfile.height) / 100
    return Number((healthProfile.currentWeight / (heightMeters * heightMeters)).toFixed(1))
  }, [healthProfile.height, healthProfile.currentWeight])

  const goalProgress = useMemo(() => {
    const totalShiftNeeded = Math.abs((healthProfile.startWeight || healthProfile.currentWeight) - healthProfile.targetWeight) || Math.abs(healthProfile.currentWeight - healthProfile.targetWeight) + 1
    const remaining = Math.abs(healthProfile.currentWeight - healthProfile.targetWeight)
    return clamp(Math.round((1 - remaining / totalShiftNeeded) * 100), 0, 100)
  }, [healthProfile.currentWeight, healthProfile.targetWeight, healthProfile.startWeight])

  const goalPrediction = useMemo(() => {
    const remaining = Math.abs(healthProfile.targetWeight - healthProfile.currentWeight)
    const weeklyChange = healthProfile.fitnessGoal === 'weight loss' ? 0.5 : healthProfile.fitnessGoal === 'muscle gain' ? 0.25 : 0.35
    const weeks = Math.max(0, Math.round(remaining / Math.max(weeklyChange, 0.1)))
    return `${weeks} week${weeks === 1 ? '' : 's'}`
  }, [healthProfile.currentWeight, healthProfile.targetWeight, healthProfile.fitnessGoal])

  const healthSummary = useMemo(() => {
    const delta = Math.round(totalCalories - recommendedCalories)
    if (!dailyMeals.length) {
      return 'Start logging meals to activate more precise daily health guidance.'
    }
    if (Math.abs(delta) < 140) {
      return `${dailyHealth.feedback} Your energy intake is closely aligned with your target today.`
    }
    return delta > 0
      ? `${dailyHealth.feedback} You are about ${Math.abs(delta)} kcal above your ideal pace today.`
      : `${dailyHealth.feedback} You are about ${Math.abs(delta)} kcal below your ideal pace today.`
  }, [recommendedCalories, totalCalories, dailyHealth.feedback, dailyMeals.length])

  const macroTargets = useMemo(
    () => ({
      calories: settings.calorieGoal,
      protein: settings.proteinGoal,
      carbs: Math.round((recommendedCalories * 0.48) / 4),
      fats: Math.round((recommendedCalories * 0.28) / 9),
      water: settings.waterGoal,
    }),
    [settings, recommendedCalories],
  )

  const nutritionRings = useMemo(
    () => [
      {
        key: 'calories',
        label: 'Calories',
        value: totalCalories,
        goal: macroTargets.calories,
        unit: 'kcal',
        accent: [currentTheme.colors[1], currentTheme.colors[0]],
        hint: `${completion}% of target`,
      },
      {
        key: 'protein',
        label: 'Protein',
        value: dailyNutrition.protein,
        goal: macroTargets.protein,
        unit: 'g',
        accent: [currentTheme.colors[0], currentTheme.colors[1]],
        hint: `${proteinCompletion}% of target`,
      },
      {
        key: 'carbs',
        label: 'Carbs',
        value: dailyNutrition.carbs,
        goal: macroTargets.carbs,
        unit: 'g',
        accent: ['#f59e0b', currentTheme.colors[2]],
        hint: `${clamp(Math.round((dailyNutrition.carbs / Math.max(1, macroTargets.carbs)) * 100), 0, 140)}% of target`,
      },
      {
        key: 'fats',
        label: 'Fats',
        value: dailyNutrition.fats,
        goal: macroTargets.fats,
        unit: 'g',
        accent: [currentTheme.colors[2], currentTheme.colors[1]],
        hint: `${clamp(Math.round((dailyNutrition.fats / Math.max(1, macroTargets.fats)) * 100), 0, 140)}% of target`,
      },
      {
        key: 'water',
        label: 'Water',
        value: waterIntake,
        goal: macroTargets.water,
        unit: 'L',
        accent: [currentTheme.colors[0], currentTheme.colors[2]],
        hint: `${waterCompletion}% of target`,
      },
    ],
    [totalCalories, macroTargets, completion, dailyNutrition.protein, dailyNutrition.carbs, dailyNutrition.fats, proteinCompletion, waterIntake, waterCompletion, currentTheme.colors],
  )

  const filteredMeals = useMemo(() => {
    return meals
      .filter((meal) => selectedMealType === 'All' || meal.mealType === selectedMealType)
      .filter((meal) => meal.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [meals, searchQuery, selectedMealType])

  const filteredPersonalMeals = useMemo(() => {
    return personalMeals
      .filter((meal) => selectedMealType === 'All' || meal.mealType === selectedMealType)
      .filter((meal) => meal.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [personalMeals, searchQuery, selectedMealType])

  const favoritePersonalMeals = useMemo(
    () => personalMeals.filter((meal) => favoriteMealIds.includes(meal.id)),
    [personalMeals, favoriteMealIds],
  )

  const addMeal = (meal) => {
    const newMeal = enrichMealRecord(meal, {
      id: Date.now().toString(),
      date: meal.date || today,
      mealType: meal.mealType || 'Lunch',
      foodCategory: meal.foodCategory || meal.category || 'Mixed',
      serving: meal.serving || '1 serving',
    })

    setMeals((current) => [newMeal, ...current])
    setRecentFoods((current) => [newMeal.name, ...current.filter((item) => item !== newMeal.name)].slice(0, 8))
  }

  const addPersonalMeal = (meal) => {
    const template = enrichMealRecord(meal, {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      mealType: meal.mealType || 'Lunch',
      foodCategory: meal.foodCategory || meal.category || 'Mixed',
      serving: meal.serving || '1 serving',
    })

    setPersonalMeals((current) => [template, ...current])
  }

  const updatePersonalMeal = (updatedMeal) => {
    const nextMeal = enrichMealRecord(updatedMeal)
    setPersonalMeals((current) => current.map((meal) => (meal.id === updatedMeal.id ? nextMeal : meal)))
  }

  const deletePersonalMeal = (id) => {
    setPersonalMeals((current) => current.filter((meal) => meal.id !== id))
  }

  const duplicatePersonalMeal = (id) => {
    const meal = personalMeals.find((item) => item.id === id)
    if (!meal) return
    addPersonalMeal({
      ...meal,
      name: `${meal.name} Copy`,
    })
  }

  const toggleFavoriteMeal = (id) => {
    setFavoriteMealIds((current) =>
      current.includes(id) ? current.filter((mealId) => mealId !== id) : [id, ...current].slice(0, 12),
    )
  }

  const addFoodToMeal = (food, mealType = 'Lunch') => {
    addMeal({
      ...food,
      mealType,
      foodCategory: food.category || food.foodCategory,
      serving: food.serving,
    })
  }

  const duplicateMeal = (id) => {
    const meal = meals.find((item) => item.id === id)
    if (!meal) return
    addMeal({
      ...meal,
      name: `${meal.name} (Copy)`,
    })
  }

  const updateMeal = (updatedMeal) => {
    const nextMeal = enrichMealRecord(updatedMeal)
    setMeals((current) => current.map((meal) => (meal.id === updatedMeal.id ? nextMeal : meal)))
  }

  const deleteMeal = (id) => {
    setMeals((current) => current.filter((meal) => meal.id !== id))
  }

  const toggleFavoriteFood = (foodName) => {
    setFavorites((current) =>
      current.includes(foodName)
        ? current.filter((name) => name !== foodName)
        : [foodName, ...current].slice(0, 12),
    )
  }

  const addRecentSearch = (query) => {
    const normalized = query.trim()
    if (!normalized) return
    setRecentSearches((current) => [normalized, ...current.filter((item) => item !== normalized)].slice(0, 10))
  }

  const updateNotificationSettings = (updates) => {
    setNotificationSettings({ ...notificationSettings, ...updates })
  }

  const updateHealthProfile = (updates) => {
    setHealthProfile((current) => ({ ...current, ...updates }))
  }

  const updateSettings = (updates) => {
    setSettings((current) => ({ ...current, ...updates }))
  }

  const updateWaterIntake = (value) => {
    const maxWater = Math.max(settings.waterGoal * 1.75, 6)

    setWaterIntake((current) => {
      const next = clamp(roundValue(current + value, 2), 0, maxWater)
      setWaterHistory((history) => {
        const updated = history.filter((item) => item.date !== today)
        return [{ date: today, intake: next }, ...updated].slice(0, 30)
      })
      return next
    })
  }

  const addWeightEntry = (entry) => {
    const numericWeight = Number(entry.weight)
    setWeightLogs((current) => [{ date: entry.date, weight: numericWeight }, ...current.filter((item) => item.date !== entry.date)])
    updateHealthProfile({ currentWeight: numericWeight, startWeight: healthProfile.startWeight || healthProfile.currentWeight })
  }

  const setThemePreference = (nextTheme) => {
    setStoredTheme(normalizeTheme(nextTheme))
  }

  const toggleTheme = () => {
    const currentIndex = themePresets.findIndex((item) => item.key === theme)
    const nextTheme = themePresets[(currentIndex + 1) % themePresets.length]
    setStoredTheme(nextTheme.key)
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', currentTheme.mode === 'light')
      document.documentElement.classList.toggle('dark', currentTheme.mode === 'dark')
      document.documentElement.dataset.theme = currentTheme.key
      document.documentElement.style.setProperty('--theme-primary', currentTheme.colors[0])
      document.documentElement.style.setProperty('--theme-secondary', currentTheme.colors[1])
      document.documentElement.style.setProperty('--theme-tertiary', currentTheme.colors[2])
      document.documentElement.style.setProperty('--theme-bg', currentTheme.background)
      document.documentElement.style.setProperty('--theme-preview', currentTheme.preview)
    }
  }, [currentTheme])

  const recommendations = useMemo(() => {
    const primary = dailyHealth.recommendations[0]
    return {
      headline: primary?.title || 'Stay consistent',
      description: primary?.detail || dailyHealth.feedback,
    }
  }, [dailyHealth])

  return (
    <AppContext.Provider
      value={{
        meals,
        personalMeals,
        favoriteMealIds,
        settings,
        theme,
        themePresets,
        currentTheme,
        searchQuery,
        selectedMealType,
        selectedFoodGroup,
        activeMeal,
        modalOpen,
        favorites,
        recentFoods,
        foodDatabase,
        mealTypes,
        foodGroups,
        recentSearches,
        healthProfile,
        bmi,
        recommendedCalories,
        goalProgress,
        goalPrediction,
        healthSummary,
        personalizedGreeting,
        dailyMeals: detailedDailyMeals,
        dailyNutrition,
        weeklySummary,
        weeklyHealthTimeline,
        healthTrendDelta,
        macroBreakdown,
        monthlyProgress,
        waterTrend,
        weightSeries,
        streak,
        totalCalories,
        caloriesRemaining,
        completion,
        proteinCompletion,
        waterCompletion,
        dailyScore,
        performanceScore,
        nutritionQuality,
        nutritionQualityIndex,
        micronutrients,
        micronutrientCards,
        aiInsights,
        dailyChallenges,
        notificationSettings,
        filteredMeals,
        filteredPersonalMeals,
        favoriteFoodItems,
        recentFoodItems,
        favoritePersonalMeals,
        waterIntake,
        waterHistory,
        weightLogs,
        dailyHealth,
        gamification,
        nutritionRings,
        macroTargets,
        addMeal,
        addPersonalMeal,
        updatePersonalMeal,
        deletePersonalMeal,
        duplicatePersonalMeal,
        toggleFavoriteMeal,
        addFoodToMeal,
        duplicateMeal,
        updateMeal,
        deleteMeal,
        toggleFavoriteFood,
        addRecentSearch,
        updateNotificationSettings,
        updateHealthProfile,
        updateSettings,
        updateWaterIntake,
        setNotificationSettings,
        addWeightEntry,
        toggleTheme,
        setThemePreference,
        setSearchQuery,
        setSelectedMealType,
        setSelectedFoodGroup,
        setActiveMeal,
        setModalOpen,
        recommendations,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
