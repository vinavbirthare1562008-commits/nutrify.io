import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext.jsx'

export default function Profile() {
  const { settings, updateSettings, theme, toggleTheme } = useAppContext()
  const [form, setForm] = useState(settings)

  const handleSubmit = (event) => {
    event.preventDefault()
    updateSettings({
      calorieGoal: Number(form.calorieGoal),
      proteinGoal: Number(form.proteinGoal),
      waterGoal: Number(form.waterGoal),
      weightGoal: Number(form.weightGoal),
    })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile settings</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Personal goals</h2>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            Switch {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Manage your goals, update your nutrition targets, and adapt the tracker to your premium health routine.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">User profile</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">Alexa James</p>
              <p className="mt-2 text-sm text-slate-400">Wellness enthusiast • Nutrition tracking</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/75 px-5 py-4 shadow-glass">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Member since</p>
              <p className="mt-3 text-xl font-semibold text-white">2024</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-glass"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Daily calorie goal', key: 'calorieGoal' },
              { label: 'Protein goal', key: 'proteinGoal' },
              { label: 'Water goal (L)', key: 'waterGoal' },
              { label: 'Weight goal (kg)', key: 'weightGoal' },
            ].map((field) => (
              <label key={field.key} className="space-y-2 text-sm text-slate-300">
                {field.label}
                <input
                  type="number"
                  min="0"
                  value={form[field.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Save preferences
          </button>
        </motion.form>
      </section>
    </div>
  )
}
