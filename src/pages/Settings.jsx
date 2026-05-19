import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'

export default function Settings() {
  const { theme, toggleTheme, updateSettings, updateNotificationSettings, notificationSettings, settings } = useAppContext()
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

  const toggleNotification = (key) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">App settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Ambient controls</h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Configure your goals, personalize your experience, and keep the app aligned with your premium wellness routine.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Safe navigation</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Privacy</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Your meal data stays local and encrypted within the browser. No external tracking.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/75 p-4">
              <p className="text-sm text-slate-400">Notifications</p>
              <div className="mt-3 space-y-3">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleNotification(key)}
                    className={`w-full rounded-3xl border px-4 py-3 text-left text-sm transition ${
                      value ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{value ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-slate-900/85 p-6 shadow-glass backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Daily calorie goal', key: 'calorieGoal' },
              { label: 'Protein goal (g)', key: 'proteinGoal' },
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
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            Save settings
          </button>
        </form>
      </section>
    </div>
  )
}
