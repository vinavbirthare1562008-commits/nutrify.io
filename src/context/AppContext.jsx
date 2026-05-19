import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import foodDatabase from '../data/foodDatabase.js'
import {
  buildWeeklySummary,
  buildMacroBreakdown,
  clamp,
  computeStreak,
  buildMonthlyProgress,
  buildWaterTrend,
  buildWeightSeries,
} from '../utils/appUtils.js'

const AppContext = createContext(null)

const defaultSettings = {
  calorieGoal: 2200,
  proteinGoal: 120,
  waterGoal: 8,
  weightGoal: 72,
  height: 170,
  age: 28,
}

export function AppProvider({ children }) {
  const [meals, setMeals] = useLocalStorage('nutrition-tracker-meals', [])
  const [personalMeals, setPersonalMeals] = useLocalStorage('nutrition-tracker-personal-meals', [])
  const [favoriteMealIds, setFavoriteMealIds] = useLocalStorage('nutrition-tracker-favorite-meals', [])
  const [settings, setSettings] = useLocalStorage('nutrition-tracker-settings', defaultSettings)
  const [theme, setTheme] = useLocalStorage('nutrition-tracker-theme', 'dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMealType, setSelectedMealType] = useState('All')
  const [selectedFoodGroup, setSelectedFoodGroup] = useState('All')
  const [activeMeal, setActiveMeal] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('nutrition-tracker-favorites', ['Chicken Breast', 'Oats', 'Greek Yogurt'])
  const [recentFoods, setRecentFoods] = useLocalStorage('nutrition-tracker-recent', ['Banana', 'Chicken Breast', 'Oats', 'Paneer Tikka'])
  const [waterIntake, setWaterIntake] = useLocalStorage('nutrition-tracker-water', 0)
  const [waterHistory, setWaterHistory] = useLocalStorage('nutrition-tracker-water-history', [{ date: new Date().toISOString().slice(0, 10), intake: 0 }])
  const [weightLogs, setWeightLogs] = useLocalStorage('nutrition-tracker-weight', [
    {
      date: new Date().toISOString().slice(0, 10),
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
    targetWeight: 68,
    activityLevel: 'moderate',
    fitnessGoal: 'weight loss',
  })

  const today = new Date().toISOString().slice(0, 10)

  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']
  const foodGroups = ['All', 'Fruits', 'Vegetables', 'Fast Food', 'Indian Food', 'Drinks', 'Snacks', 'Dairy', 'Protein Foods', 'Rice & Grains', 'Breakfast Foods']

  const dailyMeals = useMemo(
    () => meals.filter((meal) => meal.date === today),
    [meals, today],
  )

  const dailyNutrition = useMemo(
    () =>
      dailyMeals.reduce(
        (summary, meal) => {
          summary.calories += meal.calories
          summary.protein += meal.protein
          summary.carbs += meal.carbs
          summary.fats += meal.fats
          return summary
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 },
      ),
    [dailyMeals],
  )

  const weeklySummary = useMemo(() => buildWeeklySummary(meals), [meals])
  const macroBreakdown = useMemo(() => buildMacroBreakdown(weeklySummary), [weeklySummary])
  const monthlyProgress = useMemo(() => buildMonthlyProgress(meals), [meals])
  const waterTrend = useMemo(() => buildWaterTrend(weeklySummary, waterHistory, settings), [weeklySummary, waterHistory, settings])
  const weightSeries = useMemo(() => buildWeightSeries(weightLogs), [weightLogs])
  const streak = useMemo(() => computeStreak(meals), [meals])

  const totalCalories = dailyNutrition.calories
  const caloriesRemaining = clamp(settings.calorieGoal - totalCalories, 0, settings.calorieGoal)
  const completion = clamp(Math.round((totalCalories / settings.calorieGoal) * 100), 0, 100)
  const proteinCompletion = clamp(Math.round((dailyNutrition.protein / settings.proteinGoal) * 100), 0, 100)
  const waterCompletion = clamp(Math.round((waterIntake / settings.waterGoal) * 100), 0, 100)

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

  const dailyScore = useMemo(() => {
    return Math.round((completion + proteinCompletion + waterCompletion) / 3)
  }, [completion, proteinCompletion, waterCompletion])

  const micronutrients = useMemo(
    () => ({
      vitaminA: 78,
      vitaminC: 84,
      iron: 68,
      calcium: 70,
      magnesium: 62,
    }),
    [],
  )

  const performanceScore = useMemo(() => {
    const consistency = Math.min(streak * 10, 100)
    return clamp(Math.round((completion * 0.35 + proteinCompletion * 0.25 + waterCompletion * 0.2 + consistency * 0.2) / 1), 0, 100)
  }, [completion, proteinCompletion, waterCompletion, streak])

  const nutritionQuality = useMemo(() => {
    const macroBalance = Math.round(((dailyNutrition.protein / Math.max(settings.proteinGoal, 1)) * 100 + completion + waterCompletion) / 3)
    return clamp(macroBalance, 0, 100)
  }, [dailyNutrition.protein, settings.proteinGoal, completion, waterCompletion])

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

  const bmi = useMemo(() => {
    const heightMeters = Math.max(1, healthProfile.height) / 100
    return Number((healthProfile.currentWeight / (heightMeters * heightMeters)).toFixed(1))
  }, [healthProfile.height, healthProfile.currentWeight])

  const goalProgress = useMemo(() => {
    const difference = healthProfile.fitnessGoal === 'muscle gain'
      ? healthProfile.currentWeight - healthProfile.targetWeight
      : healthProfile.targetWeight - healthProfile.currentWeight
    const progress = healthProfile.currentWeight === 0 ? 0 : Math.round(Math.abs(difference) / Math.max(1, healthProfile.currentWeight) * 100)
    return clamp(progress, 0, 100)
  }, [healthProfile.currentWeight, healthProfile.targetWeight, healthProfile.fitnessGoal])

  const goalPrediction = useMemo(() => {
    const remaining = Math.abs(healthProfile.targetWeight - healthProfile.currentWeight)
    const weeklyChange = healthProfile.fitnessGoal === 'weight loss' ? 0.5 : healthProfile.fitnessGoal === 'muscle gain' ? 0.25 : 0.35
    const weeks = Math.max(0, Math.round(remaining / weeklyChange))
    return `${weeks} week${weeks === 1 ? '' : 's'}`
  }, [healthProfile.currentWeight, healthProfile.targetWeight, healthProfile.fitnessGoal])

  const healthSummary = useMemo(() => {
    const delta = totalCalories - recommendedCalories
    if (Math.abs(delta) < 150) {
      return 'Your daily intake is balanced with your current goal.'
    }
    return delta > 0
      ? `You are ${delta} kcal above your recommended target today.`
      : `You are ${Math.abs(delta)} kcal below your recommended target today.`
  }, [recommendedCalories, totalCalories])

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
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
      date: meal.date || today,
      mealType: meal.mealType || 'Lunch',
      foodCategory: meal.foodCategory || meal.category || 'Mixed',
      serving: meal.serving || '1 serving',
    }

    setMeals([newMeal, ...meals])
    setRecentFoods((current) => [newMeal.name, ...current.filter((item) => item !== newMeal.name)].slice(0, 8))
  }

  const addPersonalMeal = (meal) => {
    const template = {
      ...meal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      mealType: meal.mealType || 'Lunch',
      foodCategory: meal.foodCategory || meal.category || 'Mixed',
      serving: meal.serving || '1 serving',
    }

    setPersonalMeals([template, ...personalMeals])
  }

  const updatePersonalMeal = (updatedMeal) => {
    setPersonalMeals(personalMeals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)))
  }

  const deletePersonalMeal = (id) => {
    setPersonalMeals(personalMeals.filter((meal) => meal.id !== id))
  }

  const duplicatePersonalMeal = (id) => {
    const meal = personalMeals.find((item) => item.id === id)
    if (!meal) {
      return
    }
    addPersonalMeal({
      name: `${meal.name} Copy`,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      serving: meal.serving,
      mealType: meal.mealType,
      foodCategory: meal.foodCategory,
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
      foodCategory: food.category,
      serving: food.serving,
    })
  }

  const duplicateMeal = (id) => {
    const meal = meals.find((item) => item.id === id)
    if (!meal) {
      return
    }
    addMeal({
      name: `${meal.name} (Copy)`,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      serving: meal.serving,
      mealType: meal.mealType,
      foodCategory: meal.foodCategory,
    })
  }

  const updateMeal = (updatedMeal) => {
    setMeals(meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)))
  }

  const deleteMeal = (id) => {
    setMeals(meals.filter((meal) => meal.id !== id))
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
    setHealthProfile({ ...healthProfile, ...updates })
  }

  const updateSettings = (updates) => {
    setSettings({ ...settings, ...updates })
  }

  const updateWaterIntake = (value) => {
    setWaterIntake((current) => {
      const next = clamp(current + value, 0, settings.waterGoal)
      setWaterHistory((history) => {
        const updated = history.filter((item) => item.date !== today)
        return [{ date: today, intake: next }, ...updated].slice(0, 14)
      })
      return next
    })
  }

  const addWeightEntry = (entry) => {
    setWeightLogs((current) => [entry, ...current.filter((item) => item.date !== entry.date)])
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', theme === 'light')
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  const recommendations = useMemo(() => {
    const proteinGap = Math.max(settings.proteinGoal - dailyNutrition.protein, 0)
    const caloriesGap = Math.max(settings.calorieGoal - totalCalories, 0)
    return {
      headline: proteinGap > 20 ? 'Boost lean protein today' : 'Keep the momentum going',
      description:
        proteinGap > 20
          ? 'Add a protein-rich meal like grilled salmon or Greek yogurt to fuel recovery and balance macros.'
          : caloriesGap > 200
          ? 'A colorful snack or shake can safely top off your daily energy target.'
          : 'You are on track. Stay hydrated and keep your plate balanced.',
    }
  }, [dailyNutrition.protein, settings.proteinGoal, settings.calorieGoal, totalCalories])

  return (
    <AppContext.Provider
      value={{
        meals,
        personalMeals,
        favoriteMealIds,
        settings,
        theme,
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
        dailyMeals,
        dailyNutrition,
        weeklySummary,
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
        micronutrients,
        notificationSettings,
        filteredMeals,
        filteredPersonalMeals,
        favoriteFoodItems,
        recentFoodItems,
        favoritePersonalMeals,
        waterIntake,
        waterHistory,
        weightLogs,
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
