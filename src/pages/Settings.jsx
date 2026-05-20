import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import ThemePreviewCard from '../components/ThemePreviewCard.jsx'

export default function Settings() {
  const {
    currentTheme,
    themePresets,
    setThemePreference,
    toggleTheme,
    academyHouses,
    selectedHouse,
    selectHouse,
    updateSettings,
    updateNotificationSettings,
    notificationSettings,
    settings,
  } = useAppContext()
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
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Visual settings</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Theme and academy controls</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Switch instant themes, change your house allegiance, update health goals, and tune the magical academy around your preferences.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cycle theme: {currentTheme.name}
          </button>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">House selection</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Choose your academy allegiance</h2>
          </div>
          {selectedHouse ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              {selectedHouse.name}
            </span>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {academyHouses.map((house) => (
            <button
              key={house.key}
              type="button"
              onClick={() => selectHouse(house.key)}
              className={`rounded-[24px] border p-4 text-left transition ${
                selectedHouse?.key === house.key
                  ? 'border-cyan-400/30 bg-cyan-400/8'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]'
              }`}
            >
              <div className="h-20 rounded-[18px]" style={{ background: house.banner }} />
              <p className="mt-4 text-lg font-semibold text-white">{house.name}</p>
              <p className="mt-2 text-sm text-slate-400">{house.values.join(' / ')}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Theme system</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Choose your premium visual mode</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
            Instant switch
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {themePresets.map((theme) => (
            <ThemePreviewCard
              key={theme.key}
              theme={theme}
              active={theme.key === currentTheme.key}
              onSelect={setThemePreference}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Smart controls</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Privacy</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">Your meal data stays local inside the browser. No external tracking and no cloud sync assumptions.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Notifications</p>
              <div className="mt-3 space-y-3">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleNotification(key)}
                    className={`w-full rounded-[22px] border px-4 py-3 text-left text-sm transition ${
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

        <form onSubmit={handleSubmit} className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-6 shadow-glass">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Goal settings</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                  className="w-full rounded-[24px] border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-[24px] bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Save settings
          </button>
        </form>
      </section>
    </div>
  )
}
