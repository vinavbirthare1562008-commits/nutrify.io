import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal.jsx'

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
const foodGroups = ['Fruits', 'Vegetables', 'Fast Food', 'Indian Food', 'Drinks', 'Snacks', 'Dairy', 'Protein Foods', 'Rice & Grains', 'Breakfast Foods']

const defaultIngredient = { name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }

export default function MealModal({ open, meal, onSave, onClose }) {
  const [form, setForm] = useState({
    mealType: 'Breakfast',
    foodCategory: 'Fruits',
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    serving: '',
    ingredients: [defaultIngredient],
  })

  useEffect(() => {
    if (meal) {
      setForm({
        mealType: meal.mealType || 'Breakfast',
        foodCategory: meal.foodCategory || 'Fruits',
        name: meal.name || '',
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fats: meal.fats || 0,
        serving: meal.serving || '',
        ingredients: meal.ingredients || [defaultIngredient],
        id: meal.id,
      })
    } else {
      setForm({
        mealType: 'Breakfast',
        foodCategory: 'Fruits',
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        serving: '',
        ingredients: [defaultIngredient],
      })
    }
  }, [meal])

  const totals = useMemo(() => {
    return form.ingredients.reduce(
      (acc, ingredient) => {
        acc.calories += Number(ingredient.calories || 0)
        acc.protein += Number(ingredient.protein || 0)
        acc.carbs += Number(ingredient.carbs || 0)
        acc.fats += Number(ingredient.fats || 0)
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    )
  }, [form.ingredients])

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleIngredientChange = (index, key, value) => {
    setForm((current) => {
      const nextIngredients = [...current.ingredients]
      nextIngredients[index] = { ...nextIngredients[index], [key]: value }
      return { ...current, ingredients: nextIngredients }
    })
  }

  const addIngredient = () => {
    setForm((current) => ({ ...current, ingredients: [...current.ingredients, defaultIngredient] }))
  }

  const removeIngredient = (index) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, idx) => idx !== index),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const hasIngredientData = form.ingredients.some((ingredient) => ingredient.name.trim())
    onSave({
      ...form,
      calories: hasIngredientData ? totals.calories : Number(form.calories),
      protein: hasIngredientData ? totals.protein : Number(form.protein),
      carbs: hasIngredientData ? totals.carbs : Number(form.carbs),
      fats: hasIngredientData ? totals.fats : Number(form.fats),
      ingredients: form.ingredients.filter((ingredient) => ingredient.name.trim()),
    })
  }

  return (
    <Modal open={open} title={meal ? 'Edit meal' : 'Build recipe'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Meal type
            <select
              value={form.mealType}
              onChange={(e) => handleChange('mealType', e.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
            >
              {mealTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Food group
            <select
              value={form.foodCategory}
              onChange={(e) => handleChange('foodCategory', e.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
            >
              {foodGroups.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Meal name
          <input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
            placeholder="Salmon bowl"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Calories', key: 'calories' },
            { label: 'Protein', key: 'protein' },
            { label: 'Carbs', key: 'carbs' },
            { label: 'Fats', key: 'fats' },
          ].map((field) => (
            <label key={field.key} className="space-y-2 text-sm text-slate-300">
              {field.label}
              <input
                type="number"
                min="0"
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
              />
            </label>
          ))}
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Serving size
          <input
            value={form.serving}
            onChange={(e) => handleChange('serving', e.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
            placeholder="1 bowl, 2 slices, 150g"
          />
        </label>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recipe ingredients</p>
              <p className="mt-2 text-sm text-slate-500">Add as many ingredients as needed to auto-calculate totals.</p>
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add ingredient
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {form.ingredients.map((ingredient, index) => (
              <div key={index} className="grid gap-3 rounded-3xl bg-slate-900/85 p-4 md:grid-cols-[1.4fr_1fr_1fr]">
                <label className="space-y-2 text-sm text-slate-300">
                  Ingredient
                  <input
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
                    placeholder="Chicken, quinoa, kale"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    { label: 'kcal', key: 'calories' },
                    { label: 'Protein', key: 'protein' },
                    { label: 'Carbs', key: 'carbs' },
                    { label: 'Fats', key: 'fats' },
                  ].map((field) => (
                    <label key={field.key} className="space-y-2 text-sm text-slate-300">
                      {field.label}
                      <input
                        type="number"
                        min="0"
                        value={ingredient[field.key]}
                        onChange={(e) => handleIngredientChange(index, field.key, e.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="self-end rounded-3xl bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 rounded-3xl bg-slate-950/75 p-4 text-sm text-slate-300 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total kcal</p>
              <p className="mt-2 text-lg font-semibold text-white">{totals.calories}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Protein</p>
              <p className="mt-2 text-lg font-semibold text-white">{totals.protein}g</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Carbs</p>
              <p className="mt-2 text-lg font-semibold text-white">{totals.carbs}g</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Fats</p>
              <p className="mt-2 text-lg font-semibold text-white">{totals.fats}g</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            {meal ? 'Update meal' : 'Save meal'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
