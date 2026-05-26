import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, Bottle } from '../store/useStore'

function generateId() {
  return Math.random().toString(36).slice(2)
}

export default function EditBudget() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const setProfile = useStore((s) => s.setProfile)

  const [bottles, setBottles] = useState<Bottle[]>(profile?.bottles ?? [])
  const [newBottle, setNewBottle] = useState({ name: '', pricePerUnit: '', unitsPerWeek: '1' })

  if (!profile) return null

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

  function save() {
    if (!profile) return
    setProfile({ lastDrinkDate: profile.lastDrinkDate, lastDrinkCount: profile.lastDrinkCount, bottles })
    navigate('/')
  }

  const monthly = bottles.reduce((sum, b) => sum + b.pricePerUnit * b.unitsPerWeek * 4.33, 0)

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <h1 className="text-2xl font-bold mb-2">Consommation habituelle</h1>
        <p className="text-muted text-sm mb-6">
          Utilisé uniquement pour calculer tes économies. Pas besoin d'être exact.
        </p>

        {/* Existing bottles */}
        {bottles.length > 0 && (
          <div className="space-y-2 mb-5">
            {bottles.map((b) => (
              <div key={b.id} className="bg-surface rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">{b.name}</p>
                  <p className="text-muted text-xs">
                    {b.pricePerUnit}€ × {b.unitsPerWeek}/sem ≈ {Math.round(b.pricePerUnit * b.unitsPerWeek * 4.33)}€/mois
                  </p>
                </div>
                <button onClick={() => removeBottle(b.id)} className="text-danger text-lg px-2">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Add new bottle */}
        <div className="bg-surface rounded-2xl p-4 space-y-3 mb-5">
          <p className="text-sm text-muted font-medium">Ajouter une boisson</p>
          <input
            type="text"
            placeholder="Type (vin rouge, bière, whisky…)"
            value={newBottle.name}
            onChange={(e) => setNewBottle((p) => ({ ...p, name: e.target.value }))}
            className="w-full bg-base border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Prix (€)"
              value={newBottle.pricePerUnit}
              onChange={(e) => setNewBottle((p) => ({ ...p, pricePerUnit: e.target.value }))}
              className="flex-1 bg-base border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent"
            />
            <div className="flex-1 flex items-center gap-2 bg-base border border-gray-700 rounded-xl px-4 py-3">
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
          <button
            onClick={addBottle}
            disabled={!newBottle.name || !newBottle.pricePerUnit}
            className="w-full border border-accent text-accent py-3 rounded-xl text-sm font-medium disabled:opacity-40"
          >
            + Ajouter
          </button>
        </div>

        {/* Monthly estimate */}
        {monthly > 0 && (
          <div className="bg-surface-2 border border-accent/20 rounded-xl px-4 py-3 mb-6 flex justify-between items-center">
            <p className="text-muted text-sm">Estimation mensuelle</p>
            <p className="text-accent font-bold text-lg">{Math.round(monthly)} €/mois</p>
          </div>
        )}

        <button
          onClick={save}
          className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl text-base"
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
