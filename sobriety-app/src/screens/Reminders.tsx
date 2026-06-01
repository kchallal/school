import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, Reminder } from '../store/useStore'

const PRESETS = [
  { emoji: '💧', label: 'Boire de l\'eau' },
  { emoji: '🌬️', label: 'Respirer profondément' },
  { emoji: '🧘', label: 'S\'étirer 2 minutes' },
  { emoji: '🚶', label: 'Marcher 5 minutes' },
  { emoji: '🍎', label: 'Manger quelque chose' },
  { emoji: '😌', label: 'Faire une pause' },
]

const INTERVALS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 heure', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2 heures', value: 120 },
]

function formatInterval(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h${m}`
}

function timeUntilNext(r: Reminder): string {
  if (!r.active) return 'En pause'
  const lastMs = r.lastFiredAt ? new Date(r.lastFiredAt).getTime() : 0
  const nextMs = lastMs + r.intervalMinutes * 60 * 1000
  const diffMs = nextMs - Date.now()
  if (diffMs <= 0) return 'Bientôt'
  const diffMin = Math.ceil(diffMs / 60_000)
  if (diffMin < 60) return `Dans ${diffMin} min`
  return `Dans ${Math.ceil(diffMin / 60)}h`
}

export default function Reminders() {
  const navigate = useNavigate()
  const reminders = useStore((s) => s.reminders)
  const addReminder = useStore((s) => s.addReminder)
  const updateReminder = useStore((s) => s.updateReminder)
  const removeReminder = useStore((s) => s.removeReminder)

  const [showForm, setShowForm] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])
  const [customLabel, setCustomLabel] = useState('')
  const [customEmoji, setCustomEmoji] = useState('')
  const [interval, setInterval] = useState(15)
  const [isCustom, setIsCustom] = useState(false)

  const notifBlocked = 'Notification' in window && Notification.permission === 'denied'

  function handleAdd() {
    const label = isCustom ? customLabel : selectedPreset.label
    const emoji = isCustom ? (customEmoji || '⏰') : selectedPreset.emoji
    if (!label) return
    addReminder({ label, emoji, intervalMinutes: interval, active: true })
    setShowForm(false)
    setCustomLabel('')
    setCustomEmoji('')
    setIsCustom(false)
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Rappels</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl"
          >
            + Nouveau
          </button>
        </div>
        <p className="text-muted text-sm mb-6">
          Rappels récurrents configurables. Fonctionne en notification quand l'app est installée.
        </p>

        {notifBlocked && (
          <div className="bg-warn/10 border border-warn/30 rounded-xl p-4 mb-5">
            <p className="text-warn text-sm">
              Les notifications sont bloquées dans les réglages de ton navigateur. Les rappels apparaîtront uniquement quand l'app est ouverte.
            </p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-surface rounded-2xl p-5 mb-5 space-y-4">
            <p className="text-white font-semibold">Nouveau rappel</p>

            {/* Preset selector */}
            <div>
              <p className="text-muted text-xs mb-2">Action</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setSelectedPreset(p); setIsCustom(false) }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                      !isCustom && selectedPreset.label === p.label
                        ? 'bg-accent text-gray-900 font-medium'
                        : 'bg-surface-2 text-gray-300'
                    }`}
                  >
                    <span>{p.emoji}</span>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setIsCustom(true)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    isCustom ? 'bg-accent text-gray-900 font-medium' : 'bg-surface-2 text-gray-300'
                  }`}
                >
                  <span>✏️</span>
                  <span>Personnalisé</span>
                </button>
              </div>
            </div>

            {/* Custom label */}
            {isCustom && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="🍵"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  className="w-14 bg-base border border-gray-700 rounded-xl px-3 py-3 text-center text-lg focus:outline-none focus:border-accent"
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Description du rappel…"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="flex-1 bg-base border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Interval */}
            <div>
              <p className="text-muted text-xs mb-2">Intervalle</p>
              <div className="flex flex-wrap gap-2">
                {INTERVALS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setInterval(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      interval === opt.value
                        ? 'bg-accent text-gray-900 font-medium'
                        : 'bg-surface-2 text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-600 text-muted py-3 rounded-xl text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={isCustom && !customLabel}
                className="flex-1 bg-accent text-gray-900 font-semibold py-3 rounded-xl text-sm disabled:opacity-40"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* Reminders list */}
        {reminders.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">⏰</p>
            <p className="text-muted text-sm">Aucun rappel configuré.</p>
            <p className="text-muted text-xs mt-1">Ex : boire de l'eau toutes les 15 minutes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <div key={r.id} className={`bg-surface rounded-2xl p-4 border ${r.active ? 'border-accent/20' : 'border-gray-700/50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <p className={`font-medium text-sm ${r.active ? 'text-white' : 'text-gray-500'}`}>
                        {r.label}
                      </p>
                      <p className="text-muted text-xs">
                        Toutes les {formatInterval(r.intervalMinutes)} · {timeUntilNext(r)}
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => updateReminder(r.id, { active: !r.active })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${r.active ? 'bg-accent' : 'bg-gray-600'}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${r.active ? 'left-7' : 'left-1'}`}
                    />
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => removeReminder(r.id)}
                    className="text-muted text-xs underline underline-offset-2"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
