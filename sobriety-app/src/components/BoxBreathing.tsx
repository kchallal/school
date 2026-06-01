import { useState, useEffect, useRef, useCallback } from 'react'

type Phase = 'inspire' | 'retiens-haut' | 'expire' | 'retiens-bas'

const PHASE_DURATION = 4 // seconds per phase
const PHASES: Phase[] = ['inspire', 'retiens-haut', 'expire', 'retiens-bas']
const PHASE_LABELS: Record<Phase, string> = {
  'inspire': 'Inspire',
  'retiens-haut': 'Retiens',
  'expire': 'Expire',
  'retiens-bas': 'Retiens',
}
const PHASE_COLORS: Record<Phase, string> = {
  'inspire': '#4ECCA3',
  'retiens-haut': '#4ECCA3',
  'expire': '#FFB347',
  'retiens-bas': '#FFB347',
}

// Circle sizes
const MIN_RADIUS = 40
const MAX_RADIUS = 80
const SVG_SIZE = 220
const CENTER = SVG_SIZE / 2

interface BoxBreathingProps {
  onClose: () => void
}

export default function BoxBreathing({ onClose }: BoxBreathingProps) {
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('inspire')
  const [countdown, setCountdown] = useState(PHASE_DURATION)
  const [cycles, setCycles] = useState(0)
  const [done, setDone] = useState(false)

  const phaseIndexRef = useRef(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsInPhaseRef = useRef(0)

  const getRadius = useCallback((currentPhase: Phase, secondsLeft: number): number => {
    const elapsed = PHASE_DURATION - secondsLeft
    const progress = elapsed / PHASE_DURATION
    if (currentPhase === 'inspire') {
      return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * progress
    } else if (currentPhase === 'retiens-haut') {
      return MAX_RADIUS
    } else if (currentPhase === 'expire') {
      return MAX_RADIUS - (MAX_RADIUS - MIN_RADIUS) * progress
    } else {
      return MIN_RADIUS
    }
  }, [])

  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current)
      return
    }

    tickRef.current = setInterval(() => {
      secondsInPhaseRef.current += 1

      if (secondsInPhaseRef.current >= PHASE_DURATION) {
        secondsInPhaseRef.current = 0
        phaseIndexRef.current = (phaseIndexRef.current + 1) % 4

        if (phaseIndexRef.current === 0) {
          setCycles((c) => {
            const next = c + 1
            if (next >= 4) {
              setRunning(false)
              setDone(true)
            }
            return next
          })
        }

        setPhase(PHASES[phaseIndexRef.current])
        setCountdown(PHASE_DURATION)
      } else {
        setCountdown(PHASE_DURATION - secondsInPhaseRef.current)
      }
    }, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [running])

  function handleStart() {
    phaseIndexRef.current = 0
    secondsInPhaseRef.current = 0
    setPhase('inspire')
    setCountdown(PHASE_DURATION)
    setCycles(0)
    setDone(false)
    setRunning(true)
  }

  function handleStop() {
    setRunning(false)
    if (tickRef.current) clearInterval(tickRef.current)
  }

  const radius = running ? getRadius(phase, countdown) : MIN_RADIUS
  const color = PHASE_COLORS[phase]

  return (
    <div className="p-6 pb-8 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="text-white font-semibold text-lg">Respiration guidée</h3>
        <button onClick={onClose} className="text-muted text-xl w-8 h-8 flex items-center justify-center">
          ✕
        </button>
      </div>

      {/* Circle animation */}
      <svg width={SVG_SIZE} height={SVG_SIZE} className="mb-2">
        {/* Background circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={MAX_RADIUS + 10}
          fill="none"
          stroke="#252836"
          strokeWidth="2"
        />
        {/* Animated circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={radius}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="3"
          style={{ transition: 'r 0.5s ease-in-out, fill 0.5s ease, stroke 0.5s ease' }}
        />
        {/* Phase label */}
        <text
          x={CENTER}
          y={CENTER - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="600"
        >
          {running ? PHASE_LABELS[phase] : (done ? '✓' : '◉')}
        </text>
        {/* Countdown */}
        <text
          x={CENTER}
          y={CENTER + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
        >
          {running ? countdown : ''}
        </text>
      </svg>

      {/* Cycle counter */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${i < cycles ? 'bg-accent' : 'bg-gray-700'}`}
          />
        ))}
      </div>
      <p className="text-muted text-sm mb-6">
        {cycles === 0 ? '4 cycles de box breathing' : `${cycles} / 4 cycle${cycles > 1 ? 's' : ''} terminé${cycles > 1 ? 's' : ''}`}
      </p>

      {done ? (
        <div className="text-center">
          <p className="text-accent font-semibold mb-1">4 cycles terminés.</p>
          <p className="text-muted text-sm mb-5">Tu peux continuer ou fermer.</p>
          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-1 border border-accent text-accent font-semibold py-3 rounded-xl"
            >
              Recommencer
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-accent text-gray-900 font-semibold py-3 rounded-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : running ? (
        <button
          onClick={handleStop}
          className="w-full border border-gray-600 text-muted font-semibold py-3 rounded-xl"
        >
          Arrêter
        </button>
      ) : (
        <button
          onClick={handleStart}
          className="w-full bg-accent text-gray-900 font-semibold py-3 rounded-xl"
        >
          Démarrer
        </button>
      )}

      <p className="text-muted text-xs mt-4 text-center">
        Inspire 4s · Retiens 4s · Expire 4s · Retiens 4s
      </p>
    </div>
  )
}
