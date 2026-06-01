import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const SUGGESTIONS = [
  'Pour ma santé',
  'Pour mes proches',
  'Pour me sentir mieux le matin',
  'Pour l\'argent',
  'Pour être plus présent',
]

export default function Motivations() {
  const navigate = useNavigate()
  const motivations = useStore((s) => s.motivations)
  const addMotivation = useStore((s) => s.addMotivation)
  const removeMotivation = useStore((s) => s.removeMotivation)

  const [input, setInput] = useState('')

  function handleAdd() {
    const trimmed = input.trim()
    if (!trimmed) return
    addMotivation(trimmed)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
  }

  function handleSuggestion(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    if (motivations.includes(trimmed)) return
    addMotivation(trimmed)
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <h1 className="text-2xl font-bold mb-1">Pourquoi j'arrête</h1>
        <p className="text-muted text-sm mb-6">
          Ces raisons t'appartiennent. Elles s'afficheront au début du SOS.
        </p>

        {/* Current motivations */}
        {motivations.length > 0 && (
          <div className="bg-surface rounded-2xl p-4 mb-5 space-y-2">
            {motivations.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent text-sm">•</span>
                  <span className="text-white text-sm">{m}</span>
                </div>
                <button
                  onClick={() => removeMotivation(i)}
                  className="text-muted hover:text-danger transition-colors w-7 h-7 flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add input */}
        <div className="bg-surface rounded-2xl p-4 mb-5">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">Ajouter une raison</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ma raison personnelle..."
              className="flex-1 bg-surface-2 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-accent focus:outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="bg-accent text-gray-900 font-semibold px-4 rounded-xl text-sm disabled:opacity-40"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-muted text-xs uppercase tracking-wide mb-3">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.filter((s) => !motivations.includes(s)).map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="bg-surface-2 border border-gray-700 text-muted text-sm px-3 py-2 rounded-xl hover:border-accent/50 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          {SUGGESTIONS.every((s) => motivations.includes(s)) && (
            <p className="text-muted text-sm mt-2">Toutes les suggestions ont été ajoutées.</p>
          )}
        </div>
      </div>
    </div>
  )
}
