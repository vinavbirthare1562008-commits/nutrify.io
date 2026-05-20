import { motion } from 'framer-motion'
import ProgressCircle from './ProgressCircle.jsx'

export default function WaterTracker({ waterIntake, goal, onAddGlass }) {
  const progress = Math.min(Math.round((waterIntake / Math.max(goal, 1)) * 100), 100)

  return (
    <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-6 shadow-glass">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Hydration command</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Water rhythm</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Keep energy, recovery, and focus supported with steady hydration across the day.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Current', value: `${waterIntake.toFixed(1)}L` },
              { label: 'Goal', value: `${goal}L` },
              { label: 'Completion', value: `${progress}%` },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[0.25, 0.5, 1].map((amount) => (
              <motion.button
                key={amount}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddGlass(amount)}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
              >
                +{amount === 1 ? '1L' : `${amount}L`}
              </motion.button>
            ))}
          </div>
        </div>

        <ProgressCircle
          label="Water Intake"
          value={waterIntake}
          goal={goal}
          unit="L"
          accent={['#38bdf8', '#14b8a6']}
          hint="Animated hydration ring"
          caption={`${waterIntake.toFixed(1)}L logged today`}
          size={188}
        />
      </div>
    </div>
  )
}
