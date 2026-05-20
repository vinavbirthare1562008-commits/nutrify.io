import { motion } from 'framer-motion'

export default function Modal({ open, title, description, children, onClose, maxWidth = 'max-w-6xl' }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/82 px-4 py-6 backdrop-blur-md" onClick={onClose} role="presentation">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className={`mx-auto w-full ${maxWidth} rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.96))] p-6 shadow-[0_30px_120px_rgba(14,165,233,0.12)]`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Nutrify intelligence</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}
