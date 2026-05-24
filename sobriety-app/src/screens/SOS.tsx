import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { SOS_MESSAGES, getRandomAlternatives } from '../data/sosMessages'

const TIMER_SECONDS = 15 * 60

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function SOS() {
  const navigate = useNavigate()
  const recordSOS = useStore((s) => s.recordSOS)
  const getSoberDays = useStore((s) => s.getSoberDays)
  const getCurrentStreak = useStore((s) => s.getCurrentStreak)
  const getTotalSavings = useStore((s) => s.getTotalSavings)

  const soberDays = getSoberDays()
  const streak = getCurrentStreak()
  const savings = getTotalSavings()

  const [messageIndex, setMessageIndex] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timerDone, setTimerDone] = useState(false)
  const [showDrankModal, setShowDrankModal] = useState(false)
  const [drankCount, setDrankCount] = useState(1)
  const [outcome, setOutcome] = useState<'resisted' | 'drank' | null>(null)
  const [alternatives] = useState(() => getRandomAlternatives(4))
  const [messages] = useState(() => shuffle(SOS_MESSAGES))

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!)
            setTimerRunning(false)
            setTimerDone(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  function startTimer() {
    setTimeLeft(TIMER_SECONDS)
    setTimerDone(false)
    setTimerRunning(true)
  }

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimerRunning(false)
  }

  function nextMessage() {
    setMessageIndex((i) => (i + 1) % messages.length)
  }

  function handleResisted() {
    recordSOS(true)
    setOutcome('resisted')
  }

  function handleDrank() {
    setShowDrankModal(true)
  }

  function confirmDrank() {
    recordSOS(false, drankCount)
    setShowDrankModal(false)
    setOutcome('drank')
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (outcome === 'resisted') {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">🌿</div>
        <h2 className="text-2xl font-bold text-accent mb-3">Noté.</h2>
        <p className="text-gray-300 max-w-xs leading-relaxed mb-8">
          Tu as résisté. Ce n'est pas petit. Ton corps continue son travail.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-accent text-gray-900 font-semibold py-4 px-8 rounded-2xl"
        >
          Retour au tableau de bord
        </button>
      </div>
    )
  }

  if (outcome === 'drank') {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h2 className="text-2xl font-bold text-white mb-3">Noté.</h2>
        <p className="text-gray-300 max-w-xs leading-relaxed mb-4">
          Tes {soberDays} jours sobres restent dans ton historique. Ils ne disparaissent pas.
        </p>
        <p className="text-muted text-sm max-w-xs mb-8">
          Certaines personnes rechutent plusieurs fois avant d'atteindre une sobriété durable. Chaque tentative compte dans le processus.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-surface text-white font-semibold py-4 px-8 rounded-2xl border border-gray-700"
        >
          Retour au tableau de bord
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24 overflow-y-auto">
      <div className="max-w-md mx-auto px-5 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold text-white mb-2">Envie de boire ?</h1>
          <p className="text-muted">Prends 2 minutes. Cette envie va passer.</p>
        </div>

        {/* Progress snapshot */}
        <div className="bg-surface-2 border border-accent/20 rounded-2xl p-5 mb-5">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">Ce que tu as construit</p>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{soberDays}</p>
              <p className="text-muted text-xs">jours sobres</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{streak}</p>
              <p className="text-muted text-xs">série actuelle</p>
            </div>
            {savings > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-warn">{savings}€</p>
                <p className="text-muted text-xs">économisés</p>
              </div>
            )}
          </div>
        </div>

        {/* SOS Message */}
        <div className="bg-surface rounded-2xl p-5 mb-4">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">
            {messages[messageIndex].category === 'biologie' && 'La biologie de l\'envie'}
            {messages[messageIndex].category === 'redirection' && 'Fais quelque chose maintenant'}
            {messages[messageIndex].category === 'corps' && 'Ce qui se passe dans ton corps'}
            {messages[messageIndex].category === 'progres' && 'Tes progrès'}
            {messages[messageIndex].category === 'neutre' && 'Factuel'}
            {messages[messageIndex].category === 'alternative' && 'À commander à la place'}
          </p>
          <p className="text-white leading-relaxed text-base">
            {messages[messageIndex].text}
          </p>
          <button
            onClick={nextMessage}
            className="mt-4 text-accent text-sm font-medium flex items-center gap-1"
          >
            Argument suivant →
          </button>
        </div>

        {/* Timer */}
        <div className="bg-surface rounded-2xl p-5 mb-4">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">Attends 15 minutes</p>
          {timerDone ? (
            <div className="text-center py-2">
              <p className="text-accent font-semibold text-lg">Tu as tenu 15 minutes.</p>
              <p className="text-muted text-sm mt-1">L'envie a diminué. Tu peux choisir maintenant.</p>
            </div>
          ) : timerRunning ? (
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">{formatTime(timeLeft)}</p>
              <p className="text-muted text-sm mb-3">Reste encore</p>
              <button onClick={stopTimer} className="text-muted text-sm underline">Arrêter</button>
            </div>
          ) : (
            <button
              onClick={startTimer}
              className="w-full border border-accent text-accent font-semibold py-3 rounded-xl"
            >
              ▶ Démarrer le minuteur
            </button>
          )}
        </div>

        {/* Alternatives */}
        <div className="bg-surface rounded-2xl p-5 mb-6">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">À commander ou acheter à la place</p>
          <div className="space-y-2">
            {alternatives.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="text-accent text-sm">›</span>
                <p className="text-gray-300 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResisted}
            className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl text-base"
          >
            J'ai résisté — fermer
          </button>
          <button
            onClick={handleDrank}
            className="w-full border border-gray-600 text-muted py-4 rounded-2xl text-base"
          >
            J'ai quand même bu
          </button>
        </div>
      </div>

      {/* Drank modal */}
      {showDrankModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-surface-2 rounded-t-3xl w-full max-w-md p-6 pb-10">
            <h3 className="text-white font-semibold text-lg mb-2">Combien de verres ?</h3>
            <p className="text-muted text-sm mb-5">Pour l'historique. Ça reste sur ton téléphone.</p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => setDrankCount((c) => Math.max(1, c - 1))}
                className="w-12 h-12 bg-surface rounded-full text-white text-xl font-bold"
              >
                −
              </button>
              <span className="text-4xl font-bold text-white w-16 text-center">{drankCount}</span>
              <button
                onClick={() => setDrankCount((c) => c + 1)}
                className="w-12 h-12 bg-surface rounded-full text-white text-xl font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={confirmDrank}
              className="w-full bg-surface text-white border border-gray-600 font-semibold py-4 rounded-2xl"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setShowDrankModal(false)}
              className="w-full text-muted text-sm py-3 mt-2"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
