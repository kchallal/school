import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, Bottle, Profile } from '../store/useStore'
import { toDateKey, today } from '../utils/dateUtils'

function generateId() {
  return Math.random().toString(36).slice(2)
}

export default function Onboarding() {
  const navigate = useNavigate()
  const setProfile = useStore((s) => s.setProfile)

  const [step, setStep] = useState(0)
  const [lastDrinkDate, setLastDrinkDate] = useState(toDateKey(today()))
  const [lastDrinkCount, setLastDrinkCount] = useState(2)
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [newBottle, setNewBottle] = useState({ name: '', pricePerUnit: '', unitsPerWeek: '1' })

  const maxDate = toDateKey(today())

  function addBottle() {
    if (!newBottle.name || !newBottle.pricePerUnit) return
    const b: Bottle = {
      id: generateId(),
      name: newBottle.name,
      pricePerUnit: parseFloat(newBottle.pricePerUnit),
      unitsPerWeek: parseFloat(newBottle.unitsPerWeek) || 1,
    }
    setBottles((prev) => [...prev, b])
    setNewBottle({ name: '', pricePerUnit: '', unitsPerWeek: '1' })
  }

  function removeBottle(id: string) {
    setBottles((prev) => prev.filter((b) => b.id !== id))
  }

  function finish() {
    const profile: Profile = {
      lastDrinkDate,
      lastDrinkCount,
      bottles,
    }
    setProfile(profile)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-base text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {step === 0 && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h1 className="text-3xl font-bold text-accent mb-3">Libre</h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Une app sobre, locale, sans compte.<br />
                Tes données restent sur ton téléphone.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <p className="text-gray-300 text-sm">Pas de compte, pas d'email, pas de serveur</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <p className="text-gray-300 text-sm">Bouton SOS quand l'envie frappe</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <p className="text-gray-300 text-sm">Tes progrès physiques, organ par organe</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <p className="text-gray-300 text-sm">Pas de remise à zéro, pas de jugement</p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl text-lg"
            >
              Commencer
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-8">
            <div>
              <button onClick={() => setStep(0)} className="text-muted text-sm mb-6 flex items-center gap-1">
                ← Retour
              </button>
              <h2 className="text-2xl font-bold mb-2">Ton dernier verre</h2>
              <p className="text-muted text-sm">Quand as-tu bu de l'alcool pour la dernière fois ?</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted mb-2">Date du dernier verre</label>
                <input
                  type="date"
                  value={lastDrinkDate}
                  max={maxDate}
                  onChange={(e) => setLastDrinkDate(e.target.value)}
                  className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  Nombre de verres ce jour-là <span className="text-accent font-medium">{lastDrinkCount}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={lastDrinkCount}
                  onChange={(e) => setLastDrinkCount(parseInt(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>1</span><span>10</span><span>20+</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl text-lg"
            >
              Suivant
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <button onClick={() => setStep(1)} className="text-muted text-sm mb-6 flex items-center gap-1">
                ← Retour
              </button>
              <h2 className="text-2xl font-bold mb-2">Tes habitudes de consommation</h2>
              <p className="text-muted text-sm">Pour calculer tes économies. Pas besoin d'être exact — une estimation suffit.</p>
            </div>

            {bottles.length > 0 && (
              <div className="space-y-2">
                {bottles.map((b) => (
                  <div key={b.id} className="bg-surface rounded-xl px-4 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-medium">{b.name}</p>
                      <p className="text-muted text-xs">{b.pricePerUnit}€ × {b.unitsPerWeek}/sem</p>
                    </div>
                    <button onClick={() => removeBottle(b.id)} className="text-danger text-sm">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-surface rounded-2xl p-4 space-y-3">
              <p className="text-sm text-muted font-medium">Ajouter une boisson</p>
              <input
                type="text"
                placeholder="Type (vin rouge, bière, whisky…)"
                value={newBottle.name}
                onChange={(e) => setNewBottle((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-base border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Prix (€)"
                    value={newBottle.pricePerUnit}
                    onChange={(e) => setNewBottle((p) => ({ ...p, pricePerUnit: e.target.value }))}
                    className="w-full bg-base border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 bg-base border border-gray-700 rounded-xl px-4 py-3">
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={newBottle.unitsPerWeek}
                      onChange={(e) => setNewBottle((p) => ({ ...p, unitsPerWeek: e.target.value }))}
                      className="w-full bg-transparent text-white text-sm focus:outline-none"
                    />
                    <span className="text-muted text-xs whitespace-nowrap">/ sem</span>
                  </div>
                </div>
              </div>
              <button
                onClick={addBottle}
                disabled={!newBottle.name || !newBottle.pricePerUnit}
                className="w-full border border-accent text-accent py-3 rounded-xl text-sm font-medium disabled:opacity-40"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={finish}
                className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl text-lg"
              >
                Commencer le suivi
              </button>
              {bottles.length === 0 && (
                <button
                  onClick={finish}
                  className="w-full text-muted text-sm py-2"
                >
                  Passer — je remplirai plus tard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
