import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BoxBreathing from '../components/BoxBreathing'

const TECHNIQUES = [
  { id: 'box',       name: 'Respiration box',         emoji: '⬜', duration: '4 min',  desc: '4 phases de 4 secondes' },
  { id: 'coherence', name: 'Cohérence cardiaque',     emoji: '💚', duration: '5 min',  desc: '5s inspirer · 5s expirer' },
  { id: '478',       name: 'Méthode 4-7-8',           emoji: '🌙', duration: '2 min',  desc: 'Sédatif naturel rapide' },
  { id: 'sedative',  name: 'Soupir physiologique',    emoji: '😮‍💨', duration: '1.5 min', desc: 'Double sniff · longue expiration' },
  { id: 'grounding', name: '5-4-3-2-1 Ancrage',       emoji: '🌱', duration: '3 min',  desc: 'Reviens dans le présent' },
  { id: 'cold',      name: 'Eau froide',               emoji: '💧', duration: '30 sec', desc: 'Ralentit le rythme cardiaque' },
  { id: 'muscle',    name: 'Relâchement musculaire',  emoji: '💆', duration: '3 min',  desc: 'Contracter puis relâcher' },
  { id: 'walk',      name: 'Marche 5 minutes',         emoji: '🚶', duration: '5 min',  desc: 'Libère les tensions physiques' },
  { id: 'stop',      name: 'Technique STOP',           emoji: '✋', duration: '1 min',  desc: 'Pause de pleine conscience' },
  { id: 'write',     name: 'Écriture de décharge',     emoji: '✍️', duration: '3 min',  desc: 'Vide ton esprit sans filtre' },
  { id: 'bubbles',   name: 'Bulles de pensées',        emoji: '🫧', duration: '5 min',  desc: 'Observe et laisse partir' },
]

const GROUNDING_STEPS = [
  { count: 5, sense: 'VOIS',    tip: 'Nomme 5 choses que tu vois autour de toi. Prends le temps de les regarder vraiment.' },
  { count: 4, sense: 'TOUCHES', tip: 'Nomme 4 choses que tu peux toucher. Touche-les. Remarque leur texture, leur température.' },
  { count: 3, sense: 'ENTENDS', tip: 'Nomme 3 sons que tu entends. Même lointains. Même les plus discrets.' },
  { count: 2, sense: 'SENS',    tip: 'Nomme 2 odeurs que tu sens. Cherche autour de toi si besoin.' },
  { count: 1, sense: 'GOÛTES',  tip: 'Nomme 1 chose que tu goûtes en ce moment. Prends conscience de ta bouche.' },
]

const MUSCLE_STEPS = [
  { name: 'Pieds',     contract: 'Recroqueville tes orteils le plus fort possible.' },
  { name: 'Mollets',   contract: 'Pointe tes pieds vers toi, tends les mollets.' },
  { name: 'Cuisses',   contract: 'Serre les cuisses en contractant tes jambes.' },
  { name: 'Ventre',    contract: 'Rentre le ventre et contracte les abdominaux.' },
  { name: 'Poings',    contract: 'Serre les deux poings le plus fort possible.' },
  { name: 'Épaules',   contract: 'Lève les épaules vers les oreilles.' },
  { name: 'Visage',    contract: 'Plisse tout le visage — yeux, nez, bouche.' },
]

const STOP_STEPS = [
  { letter: 'S', word: 'Stop',          detail: 'Arrête-toi physiquement. Pose ce que tu fais. Reste immobile un instant.' },
  { letter: 'T', word: 'Take a breath', detail: 'Prends une grande inspiration lente par le nez. Expire longuement par la bouche.' },
  { letter: 'O', word: 'Observe',       detail: "Qu'est-ce que tu ressens ? Nomme l'émotion sans la juger. Où la sens-tu dans le corps ?" },
  { letter: 'P', word: 'Poursuis',      detail: 'Reprends ce que tu faisais, ou choisis consciemment ce que tu veux faire maintenant.' },
]

// ── Shared components ────────────────────────────────────────────────────────

function BreathCircle({ growing, phaseDuration }: { growing: boolean; phaseDuration: number }) {
  return (
    <div className="flex items-center justify-center" style={{ height: 180 }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,204,163,0.55) 0%, rgba(78,204,163,0.12) 100%)',
          boxShadow: growing ? '0 0 60px rgba(78,204,163,0.28)' : '0 0 12px rgba(78,204,163,0.08)',
          transform: growing ? 'scale(2.4)' : 'scale(1)',
          transition: `transform ${phaseDuration}s ease-in-out, box-shadow ${phaseDuration}s ease-in-out`,
        }}
      />
    </div>
  )
}

function DoneCard({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="p-8 text-center">
      <div className="text-5xl mb-4">✅</div>
      <p className="text-white font-semibold text-lg mb-2">C'est fait.</p>
      <p className="text-muted text-sm leading-relaxed mb-8">{message}</p>
      <button onClick={onClose} className="bg-accent text-gray-900 font-semibold py-3 px-10 rounded-2xl">
        Fermer
      </button>
    </div>
  )
}

// ── Technique components ─────────────────────────────────────────────────────

function CoherenceTechnique({ onClose }: { onClose: () => void }) {
  const TOTAL = 5 * 60
  const PHASE = 5
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setElapsed(e => { if (e + 1 >= TOTAL) { setDone(true); return TOTAL } return e + 1 }), 1000)
    return () => clearInterval(t)
  }, [done])

  if (done) return <DoneCard message="5 minutes complètes. Ton système nerveux est plus calme." onClose={onClose} />

  const phase = (elapsed % (PHASE * 2)) < PHASE ? 'in' : 'out'
  const phaseLeft = PHASE - (elapsed % PHASE)
  const totalLeft = TOTAL - elapsed
  const mins = Math.floor(totalLeft / 60)
  const secs = totalLeft % 60

  return (
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-1">Cohérence cardiaque</h3>
      <p className="text-muted text-sm mb-4">6 respirations par minute · 5 minutes</p>
      <BreathCircle growing={phase === 'in'} phaseDuration={PHASE} />
      <p className="text-3xl font-bold text-accent mt-2">{phase === 'in' ? 'Inspire' : 'Expire'}</p>
      <p className="text-muted mt-1">{phaseLeft}s</p>
      <p className="text-white font-mono text-sm mt-4">{mins}:{String(secs).padStart(2, '0')} restantes</p>
      <button onClick={onClose} className="mt-8 text-muted text-sm underline">Arrêter</button>
    </div>
  )
}

function Breathing478Technique({ onClose }: { onClose: () => void }) {
  const PHASES = [
    { label: 'Inspire',  dur: 4,  growing: true },
    { label: 'Retiens',  dur: 7,  growing: true },
    { label: 'Expire',   dur: 8,  growing: false },
  ]
  const CYCLE = 19
  const TOTAL_CYCLES = 6
  const TOTAL = CYCLE * TOTAL_CYCLES

  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setElapsed(e => { if (e + 1 >= TOTAL) { setDone(true); return TOTAL } return e + 1 }), 1000)
    return () => clearInterval(t)
  }, [done])

  if (done) return <DoneCard message="6 cycles complets. Effet sédatif activé." onClose={onClose} />

  const cycleElapsed = elapsed % CYCLE
  let phase = PHASES[0], phaseLeft = 4
  if (cycleElapsed < 4)       { phase = PHASES[0]; phaseLeft = 4 - cycleElapsed }
  else if (cycleElapsed < 11) { phase = PHASES[1]; phaseLeft = 11 - cycleElapsed }
  else                        { phase = PHASES[2]; phaseLeft = 19 - cycleElapsed }
  const cycle = Math.floor(elapsed / CYCLE) + 1

  return (
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-1">Méthode 4-7-8</h3>
      <p className="text-muted text-sm mb-4">Cycle {Math.min(cycle, TOTAL_CYCLES)}/{TOTAL_CYCLES}</p>
      <BreathCircle growing={phase.growing} phaseDuration={phase.dur} />
      <p className="text-3xl font-bold text-accent mt-2">{phase.label}</p>
      <p className="text-muted mt-1">{phaseLeft}s</p>
      <button onClick={onClose} className="mt-8 text-muted text-sm underline">Arrêter</button>
    </div>
  )
}

function GroundingTechnique({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  if (step >= GROUNDING_STEPS.length) return <DoneCard message="Tu es ancré dans le présent. La spirale s'est arrêtée." onClose={onClose} />
  const current = GROUNDING_STEPS[step]
  return (
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-6">5-4-3-2-1 Ancrage</h3>
      <div className="bg-surface rounded-2xl p-6 mb-6">
        <p className="text-accent text-7xl font-bold mb-2">{current.count}</p>
        <p className="text-white text-lg font-semibold mb-4">choses que tu <span className="text-accent">{current.sense}</span></p>
        <p className="text-muted text-sm leading-relaxed">{current.tip}</p>
      </div>
      <p className="text-muted text-xs mb-6">Étape {step + 1} sur {GROUNDING_STEPS.length}</p>
      <button
        onClick={() => setStep(s => s + 1)}
        className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl"
      >
        {step < GROUNDING_STEPS.length - 1 ? 'Suivant →' : 'Terminé'}
      </button>
    </div>
  )
}

function ColdWaterTechnique({ onClose }: { onClose: () => void }) {
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started || done) return
    const t = setInterval(() => setTimeLeft(s => { if (s <= 1) { setDone(true); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [started, done])

  if (done) return <DoneCard message="Le réflexe de plongée a ralenti ton rythme cardiaque. Tu es plus calme." onClose={onClose} />

  return (
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-1">Eau froide</h3>
      <p className="text-muted text-sm mb-6">Active le réflexe de plongée du nerf vague</p>
      {!started ? (
        <>
          <div className="text-5xl mb-5">💧</div>
          <div className="bg-surface rounded-2xl p-5 mb-6 text-left space-y-3">
            <p className="text-white text-sm font-medium">Fais l'une ou l'autre :</p>
            <p className="text-gray-300 text-sm">🚿 Passe tes <strong>poignets</strong> sous l'eau froide 30 secondes</p>
            <p className="text-gray-300 text-sm">🫧 Plonge ton <strong>visage</strong> dans une bassine d'eau froide</p>
            <p className="text-muted text-xs mt-2 border-t border-gray-700 pt-3">Le froid active le nerf vague : le cœur ralentit en quelques secondes, le système nerveux se calme.</p>
          </div>
          <button onClick={() => setStarted(true)} className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl">
            Lancer le chrono (30s)
          </button>
        </>
      ) : (
        <>
          <div className="text-8xl font-bold text-accent my-10 font-mono">{timeLeft}</div>
          <p className="text-muted">Reste sous l'eau froide</p>
          <button onClick={onClose} className="mt-8 text-muted text-sm underline">Arrêter</button>
        </>
      )}
    </div>
  )
}

const BODY_GROUPS: Record<string, string[]> = {
  'Visage':  ['head'],
  'Épaules': ['delts'],
  'Poings':  ['biceps', 'triceps', 'forearm'],
  'Ventre':  ['abs', 'obliques'],
  'Cuisses': ['quads'],
  'Mollets': ['calves'],
  'Pieds':   ['feet'],
}

function BodyDiagram({ muscle, isContract }: { muscle: string; isContract: boolean }) {
  const ac = isContract ? '#ef4444' : '#4ECCA3'
  const ic = '#374151'
  const dim = '#1f2937'
  const tr = { style: { transition: 'fill 0.5s ease' } }
  const active = new Set(BODY_GROUPS[muscle] ?? [])
  const f = (g: string) => ({ fill: active.has(g) ? ac : ic, ...tr })

  return (
    <svg viewBox="0 0 100 210" width="90" height="189">
      {/* Head */}
      <polygon points="42.4 2.9 40 11.8 42 19.6 46.1 23.3 49.8 25.3 54.7 22.4 57.6 19.2 59.2 10.2 57.1 2.4 49.8 0" {...f('head')}/>
      {/* Neck */}
      <polygon points="55.5 23.7 50.6 33.5 50.6 39.2 61.6 40 70.6 44.9 69.4 36.7 63.3 35.1 58.4 30.6" fill={dim} {...tr}/>
      <polygon points="29 44.9 30.2 37.1 36.3 35.1 41.2 30.2 44.5 24.5 49 33.9 48.6 39.2 38 39.6" fill={dim} {...tr}/>
      {/* Chest */}
      <polygon points="51.8 41.6 51 55.1 57.9 57.9 67.8 55.5 70.6 47.3 62 41.6" fill={dim} {...tr}/>
      <polygon points="29.8 46.5 31.4 55.5 40.8 57.9 48.2 55.1 47.8 42 37.6 42" fill={dim} {...tr}/>
      {/* Shoulders / Deltoids */}
      <polygon points="78.4 53.1 79.6 47.8 79.2 41.2 75.9 38 71 36.3 72.2 42.9 71.4 47.3" {...f('delts')}/>
      <polygon points="28.2 47.3 21.2 53.1 20 47.8 20.4 40.8 24.5 37.1 28.6 37.1 26.9 43.3" {...f('delts')}/>
      {/* Biceps */}
      <polygon points="16.7 68.2 18 71.4 22.9 66.1 29 53.9 27.8 49.4 20.4 55.9" {...f('biceps')}/>
      <polygon points="71.4 49.4 70.2 54.7 76.3 66.1 81.6 71.8 82.9 69 78.8 55.5" {...f('biceps')}/>
      {/* Triceps */}
      <polygon points="69.4 55.5 69.4 61.6 75.9 72.7 77.6 70.2 75.5 67.3" {...f('triceps')}/>
      <polygon points="22.4 69.4 29.8 55.5 29.8 60.8 22.9 73.1" {...f('triceps')}/>
      {/* Obliques */}
      <polygon points="68.6 63.3 67.3 57.1 58.8 59.6 60 64.1 60.4 83.3 65.7 78.8 66.5 69.8" {...f('obliques')}/>
      <polygon points="33.9 78.4 33.1 71.8 31 63.3 32.2 57.1 40.8 59.2 39.2 63.3 39.2 83.7" {...f('obliques')}/>
      {/* Abs */}
      <polygon points="56.3 59.2 57.9 64.1 58.4 78 58.4 92.7 56.3 98.4 55.1 104.1 51.4 107.8 51 84.5 50.6 67.3 51 57.1" {...f('abs')}/>
      <polygon points="43.7 58.8 48.6 57.1 49 67.3 48.6 84.5 48.2 107.3 44.5 103.7 40.8 91.4 40.8 78.4 41.2 64.5" {...f('abs')}/>
      {/* Forearms */}
      <polygon points="6.1 88.6 10.2 75.1 14.7 70.2 16.3 74.3 19.2 73.5 4.5 97.6 0 100" {...f('forearm')}/>
      <polygon points="84.5 69.8 83.3 73.5 80 73.1 95.1 98.4 100 100.4 93.5 89.4 89.8 76.3" {...f('forearm')}/>
      <polygon points="77.6 72.2 77.6 77.6 80.4 84.1 85.3 89.8 92.2 101.2 94.7 99.6" {...f('forearm')}/>
      <polygon points="6.9 101.2 13.5 90.6 18.8 84.1 21.6 77.1 21.2 71.8 4.9 98.8" {...f('forearm')}/>
      {/* Hip / Abductors */}
      <polygon points="52.7 110.2 54.3 124.9 60 110.2 62 100 64.9 94.3 60 92.7 56.7 104.5" fill={dim} {...tr}/>
      <polygon points="47.8 110.6 44.9 125.3 42 115.9 40.4 113.1 39.6 107.3 38 102.4 34.7 93.9 39.6 92.2 41.6 99.2 43.7 105.3" fill={dim} {...tr}/>
      {/* Quadriceps */}
      <polygon points="34.7 98.8 37.1 108.2 37.1 127.8 34.3 137.1 31 132.7 29.4 120 28.2 111.4 29.4 100.8 32.2 94.7" {...f('quads')}/>
      <polygon points="63.3 105.7 64.5 100 66.9 94.7 70.2 101.2 71 111.8 68.2 133.1 65.3 137.6 62.4 128.6 62 111.4" {...f('quads')}/>
      <polygon points="38.8 129.4 38.4 112.2 41.2 118.4 44.5 129.4 42.9 135.1 40 146.1 36.3 146.5 35.5 140" {...f('quads')}/>
      <polygon points="59.6 145.7 55.5 129 60.8 113.9 61.2 130.2 64.1 139.6 62.9 146.5" {...f('quads')}/>
      <polygon points="32.7 138.4 26.5 145.7 25.7 136.7 25.7 127.3 26.9 114.3 29.4 133.5" {...f('quads')}/>
      <polygon points="71.8 113.1 73.9 124.1 73.9 140.4 72.7 145.7 66.5 138.4 70.2 133.5" {...f('quads')}/>
      {/* Knees */}
      <polygon points="33.9 140 34.7 143.3 35.5 147.3 36.3 151 35.1 156.7 29.8 156.7 27.3 152.7 27.3 147.3 30.2 144.1" fill={ic} {...tr}/>
      <polygon points="65.7 140 72.2 147.8 72.2 152.2 69.8 157.1 64.9 156.7 62.9 151" fill={ic} {...tr}/>
      {/* Calves */}
      <polygon points="71.4 160.4 73.5 153.5 76.7 161.2 79.6 167.8 78.4 187.8 79.6 195.5 74.7 195.5" {...f('calves')}/>
      <polygon points="24.9 194.7 27.8 164.9 28.2 160.4 26.1 154.3 24.9 157.6 22.4 161.6 20.8 167.8 22 188.2 20.8 195.5" {...f('calves')}/>
      <polygon points="72.7 195.1 69.8 159.2 65.3 158.4 64.1 162.4 64.1 165.3 65.7 177.1" {...f('calves')}/>
      <polygon points="35.5 158.4 35.9 162.4 35.9 166.9 35.1 172.2 35.1 176.7 32.2 182 30.6 187.3 26.9 194.7 27.3 187.8 28.2 180.4 28.6 175.5 29 169.8 29.8 164.1 30.2 158.8" {...f('calves')}/>
      {/* Feet (custom) */}
      <polygon points="64 196 63 202 66 207 74 208 81 205 82 198 75 196" {...f('feet')}/>
      <polygon points="36 196 37 202 34 207 26 208 19 205 18 198 25 196" {...f('feet')}/>
    </svg>
  )
}

function MuscleRelaxTechnique({ onClose }: { onClose: () => void }) {
  const CONTRACT = 7
  const RELEASE = 12

  const [stepIdx, setStepIdx] = useState(0)
  const [phaseTime, setPhaseTime] = useState(CONTRACT)
  const [isContract, setIsContract] = useState(true)
  const [done, setDone] = useState(false)

  const isContractRef = useRef(true)
  const stepIdxRef = useRef(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const tick = setInterval(() => {
      if (doneRef.current) return
      setPhaseTime(t => {
        if (t > 1) return t - 1
        if (isContractRef.current) {
          isContractRef.current = false
          setIsContract(false)
          return RELEASE
        } else {
          const next = stepIdxRef.current + 1
          if (next >= MUSCLE_STEPS.length) {
            doneRef.current = true
            setDone(true)
            return 0
          }
          stepIdxRef.current = next
          setStepIdx(next)
          isContractRef.current = true
          setIsContract(true)
          return CONTRACT
        }
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  if (done) return <DoneCard message="Tout le corps est relâché. Remarque le contraste avec la tension du début." onClose={onClose} />

  const step = MUSCLE_STEPS[stepIdx]

  return (
    <div className="p-6">
      <h3 className="text-white font-semibold text-lg mb-1 text-center">Relâchement musculaire</h3>
      <p className="text-muted text-sm mb-4 text-center">Étape {stepIdx + 1}/{MUSCLE_STEPS.length}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center">
          <BodyDiagram muscle={step.name} isContract={isContract} />
        </div>
        <div className={`flex-1 rounded-3xl p-4 border transition-colors duration-500 text-center ${
          isContract ? 'bg-warn/15 border-warn/30' : 'bg-accent/10 border-accent/20'
        }`}>
          <p className="text-white font-semibold text-base mb-1">{step.name}</p>
          <p className={`text-4xl font-bold mb-2 font-mono ${isContract ? 'text-warn' : 'text-accent'}`}>
            {phaseTime}s
          </p>
          <p className="text-white font-semibold text-sm">
            {isContract ? '💪 Contracte' : '😮‍💨 Relâche'}
          </p>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed text-center mb-4 min-h-[40px]">
        {isContract ? step.contract : 'Relâche complètement. Sens la différence entre la tension et le relâchement.'}
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {MUSCLE_STEPS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
            i < stepIdx ? 'bg-accent' : i === stepIdx ? 'bg-white' : 'bg-gray-700'
          }`} />
        ))}
      </div>
      <div className="text-center">
        <button onClick={onClose} className="text-muted text-sm underline">Arrêter</button>
      </div>
    </div>
  )
}

function WalkTechnique({ onClose }: { onClose: () => void }) {
  const TOTAL = 5 * 60
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setTimeLeft(s => { if (s <= 1) { setDone(true); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [done])

  if (done) return <DoneCard message="5 minutes de mouvement. Les endorphines font leur travail." onClose={onClose} />

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const msg = timeLeft > 240 ? 'Commence à marcher. Rythme tranquille, respire par le nez.'
    : timeLeft > 180 ? 'Bien. Continue. Laisse le mouvement faire son travail.'
    : timeLeft > 120 ? 'Tu es à mi-chemin. Comment tu te sens par rapport au début ?'
    : timeLeft > 60  ? 'Presque fini. Ralentis un peu, reviens à toi.'
    : 'Dernière minute. Profite du mouvement.'

  return (
    <div className="p-6 text-center">
      <div className="text-5xl mb-4">🚶</div>
      <h3 className="text-white font-semibold text-lg mb-6">Marche 5 minutes</h3>
      <p className="text-7xl font-bold text-accent font-mono mb-4">{mins}:{String(secs).padStart(2, '0')}</p>
      <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed mb-8">{msg}</p>
      <button onClick={onClose} className="text-muted text-sm underline">Arrêter</button>
    </div>
  )
}

function StopTechnique({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  if (done) return <DoneCard message="Tu as créé un espace entre le stimulus et ta réaction." onClose={onClose} />

  const current = STOP_STEPS[step]
  const isLast = step === STOP_STEPS.length - 1

  return (
    <div className="p-6">
      <h3 className="text-white font-semibold text-lg mb-6 text-center">Technique STOP</h3>
      <div className="flex justify-center gap-3 mb-8">
        {STOP_STEPS.map((s, i) => (
          <div key={i} className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold transition-colors ${
            i < step  ? 'bg-accent text-gray-900'
            : i === step ? 'bg-accent/20 text-accent border border-accent/40'
            : 'bg-surface text-gray-600'
          }`}>
            {s.letter}
          </div>
        ))}
      </div>
      <div className="bg-surface rounded-2xl p-6 mb-6 min-h-[140px] flex flex-col justify-center">
        <p className="text-accent font-bold text-base mb-3">{current.letter} — {current.word}</p>
        <p className="text-gray-300 text-sm leading-relaxed">{current.detail}</p>
      </div>
      <button
        onClick={() => isLast ? setDone(true) : setStep(s => s + 1)}
        className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl"
      >
        {isLast ? 'Terminé' : 'Suivant →'}
      </button>
    </div>
  )
}

function WriteTechnique({ onClose }: { onClose: () => void }) {
  const TOTAL = 3 * 60
  const [text, setText] = useState('')
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started || done) return
    const t = setInterval(() => setTimeLeft(s => { if (s <= 1) { setDone(true); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [started, done])

  if (done) return (
    <div className="p-8 text-center">
      <div className="text-5xl mb-4">✅</div>
      <p className="text-white font-semibold text-lg mb-2">C'est fait.</p>
      <p className="text-muted text-sm mb-2">Ce que tu as écrit ne sera pas sauvegardé.</p>
      <p className="text-muted text-sm mb-8">Tu peux fermer.</p>
      <button onClick={onClose} className="bg-accent text-gray-900 font-semibold py-3 px-10 rounded-2xl">Fermer</button>
    </div>
  )

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Écriture de décharge</h3>
        {started && <span className="text-muted font-mono text-sm">{mins}:{String(secs).padStart(2, '0')}</span>}
      </div>
      {!started ? (
        <>
          <p className="text-muted text-sm mb-6 leading-relaxed">
            Écris sans filtre ni censure ce qui t'oppresse en ce moment. Ça ne sera pas sauvegardé — personne ne lira ça, pas même l'appli.
          </p>
          <button onClick={() => setStarted(true)} className="w-full bg-accent text-gray-900 font-semibold py-4 rounded-2xl">
            Commencer (3 min)
          </button>
        </>
      ) : (
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Écris ici, sans filtre..."
          className="w-full bg-surface border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-accent focus:outline-none resize-none"
          rows={11}
        />
      )}
    </div>
  )
}

function SedativeTechnique({ onClose }: { onClose: () => void }) {
  const SNIFF1 = 2, SNIFF2 = 1, EXHALE = 7
  const CYCLE = 10, TOTAL_CYCLES = 8, TOTAL = 80

  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setElapsed(e => {
      if (e + 1 >= TOTAL) { setDone(true); return TOTAL }
      return e + 1
    }), 1000)
    return () => clearInterval(t)
  }, [done])

  if (done) return <DoneCard message="Ton système nerveux s'est calmé. Le nerf vague a fait son travail." onClose={onClose} />

  const ce = elapsed % CYCLE
  const round = Math.floor(elapsed / CYCLE) + 1
  const isExhale = ce >= SNIFF1 + SNIFF2
  const isSniff2 = !isExhale && ce >= SNIFF1

  let label: string, sublabel: string, phaseLeft: number
  if (ce < SNIFF1) {
    label = '👃 Premier sniff'
    sublabel = 'Courte inspiration par le nez'
    phaseLeft = SNIFF1 - ce
  } else if (ce < SNIFF1 + SNIFF2) {
    label = '👃 Deuxième sniff'
    sublabel = 'Un petit sniff de plus — gonfle les alvéoles'
    phaseLeft = SNIFF1 + SNIFF2 - ce
  } else {
    label = '😮‍💨 Expire'
    sublabel = 'Long souffle lent par la bouche — aussi long que possible'
    phaseLeft = CYCLE - ce
  }

  return (
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-1">Soupir physiologique</h3>
      <p className="text-muted text-sm mb-4">Cycle {Math.min(round, TOTAL_CYCLES)}/{TOTAL_CYCLES}</p>
      <BreathCircle growing={!isExhale} phaseDuration={isExhale ? EXHALE : isSniff2 ? SNIFF2 : SNIFF1} />
      <p className="text-2xl font-bold text-accent mt-2">{label}</p>
      <p className="text-muted text-xs mt-2 max-w-xs mx-auto leading-relaxed">{sublabel}</p>
      <p className="text-white font-mono text-sm mt-3">{phaseLeft}s</p>
      <button onClick={onClose} className="mt-8 text-muted text-sm underline">Arrêter</button>
    </div>
  )
}

const FILL_DUR = 4000
const FLOAT_DUR = 5500

function BubbleTechnique({ onClose }: { onClose: () => void }) {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; phase: 'filling' | 'floating' }[]>([])
  const nextId = useRef(0)

  function addBubble(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const id = nextId.current++
    setBubbles(b => [...b, { id, x: Math.max(8, Math.min(92, x)), phase: 'filling' }])
    setTimeout(() => {
      setBubbles(b => b.map(bub => bub.id === id ? { ...bub, phase: 'floating' } : bub))
      setTimeout(() => setBubbles(b => b.filter(bub => bub.id !== id)), FLOAT_DUR)
    }, FILL_DUR)
  }

  return (
    <div className="fixed inset-0 bg-base z-50 flex flex-col" onClick={addBubble}>
      <style>{`
        @keyframes pulseFill {
          0%, 100% { transform: scale(1);    opacity: 0.55; box-shadow: 0 0 12px rgba(78,204,163,0.15); }
          50%       { transform: scale(1.09); opacity: 0.8;  box-shadow: 0 0 28px rgba(78,204,163,0.3);  }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0)       scale(1);    opacity: 0.75; }
          60%  { transform: translateY(-560px)  scale(1.08); opacity: 0.4;  }
          100% { transform: translateY(-1100px) scale(0.6);  opacity: 0;    }
        }
      `}</style>
      <div className="flex-1 relative select-none">
        {bubbles.map(b => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              bottom: 160,
              left: `calc(${b.x}% - 45px)`,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(78,204,163,0.45) 0%, rgba(78,204,163,0.1) 100%)',
              border: '1.5px solid rgba(78,204,163,0.4)',
              animation: b.phase === 'filling'
                ? `pulseFill ${FILL_DUR / 1000}s ease-in-out infinite`
                : `floatUp ${FLOAT_DUR / 1000}s ease-out forwards`,
            }}
          />
        ))}
      </div>
      <div className="px-6 pb-14 pt-4 text-center pointer-events-none">
        <p className="text-white/90 font-semibold text-base mb-1">Touche l'écran</p>
        <p className="text-muted text-sm">Mets une pensée dans chaque bulle. Laisse-la partir.</p>
      </div>
      <button
        className="absolute top-5 right-5 text-muted text-sm z-10"
        onClick={e => { e.stopPropagation(); onClose() }}
      >
        Fermer ✕
      </button>
    </div>
  )
}

// ── Routing ──────────────────────────────────────────────────────────────────

function TechniqueView({ id, onClose }: { id: string; onClose: () => void }) {
  switch (id) {
    case 'box':       return <BoxBreathing onClose={onClose} />
    case 'coherence': return <CoherenceTechnique onClose={onClose} />
    case '478':       return <Breathing478Technique onClose={onClose} />
    case 'sedative':  return <SedativeTechnique onClose={onClose} />
    case 'grounding': return <GroundingTechnique onClose={onClose} />
    case 'cold':      return <ColdWaterTechnique onClose={onClose} />
    case 'muscle':    return <MuscleRelaxTechnique onClose={onClose} />
    case 'walk':      return <WalkTechnique onClose={onClose} />
    case 'stop':      return <StopTechnique onClose={onClose} />
    case 'write':     return <WriteTechnique onClose={onClose} />
    default:          return null
  }
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function Stress() {
  const navigate = useNavigate()
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>
        <h1 className="text-2xl font-bold mb-1">Boîte à outils anti-stress</h1>
        <p className="text-muted text-sm mb-6">Choisis une technique. Prends le temps qu'il faut.</p>

        <div className="grid grid-cols-2 gap-3">
          {TECHNIQUES.map(tech => (
            <button
              key={tech.id}
              onClick={() => setActive(tech.id)}
              className="bg-surface border border-gray-700 rounded-2xl p-4 text-left hover:border-accent/40 transition-colors"
            >
              <span className="text-2xl mb-3 block">{tech.emoji}</span>
              <p className="text-white font-medium text-sm mb-1 leading-snug">{tech.name}</p>
              <p className="text-muted text-xs mb-2 leading-snug">{tech.desc}</p>
              <span className="text-accent text-xs font-medium">{tech.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {active === 'bubbles' && <BubbleTechnique onClose={() => setActive(null)} />}

      {active && active !== 'bubbles' && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
          onClick={e => { if (e.target === e.currentTarget) setActive(null) }}
        >
          <div
            className="bg-surface-2 rounded-t-3xl w-full max-w-md overflow-y-auto"
            style={{ maxHeight: '92vh', animation: 'slideUp 0.25s ease-out' }}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-1" />
            <TechniqueView id={active} onClose={() => setActive(null)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
