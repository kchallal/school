import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BoxBreathing from '../components/BoxBreathing'

const TECHNIQUES = [
  { id: 'box',       name: 'Respiration box',         emoji: '⬜', duration: '4 min',  desc: '4 phases de 4 secondes' },
  { id: 'coherence', name: 'Cohérence cardiaque',     emoji: '💚', duration: '5 min',  desc: '5s inspirer · 5s expirer' },
  { id: '478',       name: 'Méthode 4-7-8',           emoji: '🌙', duration: '2 min',  desc: 'Sédatif naturel rapide' },
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
    <div className="p-6 text-center">
      <h3 className="text-white font-semibold text-lg mb-1">Relâchement musculaire</h3>
      <p className="text-muted text-sm mb-5">Étape {stepIdx + 1}/{MUSCLE_STEPS.length} — {step.name}</p>
      <div className={`rounded-3xl p-6 mb-6 border transition-colors duration-500 ${
        isContract ? 'bg-warn/15 border-warn/30' : 'bg-accent/10 border-accent/20'
      }`}>
        <p className={`text-5xl font-bold mb-3 font-mono ${isContract ? 'text-warn' : 'text-accent'}`}>
          {phaseTime}s
        </p>
        <p className="text-white font-semibold text-xl mb-3">
          {isContract ? '💪 Contracte' : '😮‍💨 Relâche'}
        </p>
        <p className="text-muted text-sm leading-relaxed">
          {isContract ? step.contract : 'Relâche complètement. Sens la différence entre la tension et le relâchement.'}
        </p>
      </div>
      <div className="flex justify-center gap-2">
        {MUSCLE_STEPS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
            i < stepIdx ? 'bg-accent' : i === stepIdx ? 'bg-white' : 'bg-gray-700'
          }`} />
        ))}
      </div>
      <button onClick={onClose} className="mt-6 text-muted text-sm underline">Arrêter</button>
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

function BubbleTechnique({ onClose }: { onClose: () => void }) {
  const TOTAL = 5 * 60
  const FILL_DUR = 4000
  const FLOAT_DUR = 5500
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [bubbles, setBubbles] = useState<{ id: number; x: number; phase: 'filling' | 'floating' }[]>([])

  useEffect(() => {
    if (!started || done) return
    const t = setInterval(() => setElapsed(e => { if (e + 1 >= TOTAL) { setDone(true); return TOTAL } return e + 1 }), 1000)
    return () => clearInterval(t)
  }, [started, done])

  function releaseBubble() {
    const id = Date.now()
    const x = 20 + Math.random() * 55
    setBubbles(b => [...b, { id, x, phase: 'filling' }])
    setTimeout(() => setBubbles(b => b.map(bub => bub.id === id ? { ...bub, phase: 'floating' } : bub)), FILL_DUR)
    setTimeout(() => setBubbles(b => b.filter(bub => bub.id !== id)), FILL_DUR + FLOAT_DUR)
  }

  if (done) return <DoneCard message="Les pensées sont passées. Tu es resté l'observateur." onClose={onClose} />

  const HINTS = [
    'Une pensée arrive ? Pose-la dans une bulle.',
    "Observe-la s'élever. Tu n'as pas besoin de la retenir.",
    "Tu es l'observateur, pas la pensée.",
    'Laisse passer. Rien à résoudre maintenant.',
    'Chaque bulle emporte la pensée avec elle.',
  ]
  const timeLeft = TOTAL - elapsed
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const hint = HINTS[Math.min(Math.floor(elapsed / (TOTAL / HINTS.length)), HINTS.length - 1)]

  if (!started) {
    return (
      <div className="fixed inset-0 bg-base z-50 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl mb-5">🫧</div>
        <h3 className="text-white font-semibold text-xl mb-5">Bulles de pensées</h3>
        <div className="bg-surface rounded-2xl p-5 mb-8 text-left space-y-3 w-full max-w-sm">
          <p className="text-white text-sm font-medium">Comment ça marche</p>
          <p className="text-muted text-sm leading-relaxed">Installe-toi confortablement. Ferme les yeux ou fixe un point devant toi.</p>
          <p className="text-muted text-sm leading-relaxed">Chaque fois qu'une pensée surgit, appuie sur le bouton. Une bulle apparaît — prends le temps de lui confier la pensée. Elle s'élèvera d'elle-même.</p>
          <p className="text-muted text-sm leading-relaxed">Tu ne combats pas la pensée. Tu l'observes juste partir.</p>
        </div>
        <button
          onClick={() => { setStarted(true); releaseBubble() }}
          className="w-full max-w-sm bg-accent text-gray-900 font-semibold py-4 rounded-2xl"
        >
          Commencer (5 min)
        </button>
        <button onClick={onClose} className="text-muted text-sm mt-4 underline">Annuler</button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="fixed inset-0 bg-base z-50 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-white font-semibold text-lg mb-2">C'est fait.</p>
        <p className="text-muted text-sm leading-relaxed mb-8 max-w-xs">Les pensées sont passées. Tu es resté l'observateur.</p>
        <button onClick={onClose} className="bg-accent text-gray-900 font-semibold py-3 px-10 rounded-2xl">Fermer</button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-base z-50">
      {/* Full-screen theater */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span style={{ fontSize: 160, opacity: 0.04 }}>🌿</span>
        </div>
        <div className="absolute top-safe top-5 right-5 text-muted font-mono text-sm">
          {mins}:{String(secs).padStart(2, '0')}
        </div>
        {bubbles.map(b => (
          <div
            key={b.id}
            className="absolute"
            style={{
              left: `calc(${b.x}% - 45px)`,
              bottom: 160,
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '2px solid rgba(78,204,163,0.55)',
              background: 'rgba(78,204,163,0.05)',
              animation: b.phase === 'filling'
                ? 'pulseFill 2s ease-in-out infinite'
                : 'floatUp 5.5s ease-out forwards',
            }}
          />
        ))}
      </div>

      {/* Bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-20 text-center"
        style={{ background: 'linear-gradient(to top, rgba(15,17,23,0.98) 60%, transparent)' }}
      >
        <p className="text-gray-300 text-sm leading-relaxed mb-6 min-h-[40px]">{hint}</p>
        <button
          onClick={releaseBubble}
          className="w-full max-w-sm border border-accent/40 text-accent font-medium py-4 rounded-2xl mb-3 active:scale-95 transition-transform text-base"
        >
          🫧 Nouvelle bulle
        </button>
        <button onClick={onClose} className="text-muted text-sm underline">Arrêter</button>
      </div>
    </div>
  )
}

// ── Routing ──────────────────────────────────────────────────────────────────

function TechniqueView({ id, onClose }: { id: string; onClose: () => void }) {
  switch (id) {
    case 'box':       return <BoxBreathing onClose={onClose} />
    case 'coherence': return <CoherenceTechnique onClose={onClose} />
    case '478':       return <Breathing478Technique onClose={onClose} />
    case 'grounding': return <GroundingTechnique onClose={onClose} />
    case 'cold':      return <ColdWaterTechnique onClose={onClose} />
    case 'muscle':    return <MuscleRelaxTechnique onClose={onClose} />
    case 'walk':      return <WalkTechnique onClose={onClose} />
    case 'stop':      return <StopTechnique onClose={onClose} />
    case 'write':     return <WriteTechnique onClose={onClose} />
    case 'bubbles':   return <BubbleTechnique onClose={onClose} />
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

      {active === 'bubbles' && (
        <BubbleTechnique onClose={() => setActive(null)} />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes pulseFill {
          0%, 100% { transform: scale(1);    opacity: 0.55; box-shadow: 0 0 12px rgba(78,204,163,0.15); }
          50%       { transform: scale(1.09); opacity: 0.8;  box-shadow: 0 0 28px rgba(78,204,163,0.3);  }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0)      scale(1);    opacity: 0.75; }
          60%  { transform: translateY(-560px) scale(1.08); opacity: 0.4;  }
          100% { transform: translateY(-1100px) scale(0.6); opacity: 0;    }
        }
      `}</style>
    </div>
  )
}
