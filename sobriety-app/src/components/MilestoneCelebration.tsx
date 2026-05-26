import { useEffect } from 'react'
import { Milestone } from '../data/milestones'
import { fireMilestoneConfetti } from '../utils/confetti'
import FloatingEmojis from './FloatingEmojis'

interface Props {
  milestone: Milestone
  onClose: () => void
}

export default function MilestoneCelebration({ milestone, onClose }: Props) {
  useEffect(() => {
    fireMilestoneConfetti()
    const t = setTimeout(onClose, 6000)
    return () => clearTimeout(t)
  }, [])

  const organEmojis = milestone.organs.map((o) => o.icon)

  return (
    <>
      <FloatingEmojis emojis={['✨', '🌿', '💪', ...organEmojis]} count={16} />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center">
        <div
          className="bg-surface-2 border border-accent/30 rounded-t-3xl w-full max-w-md p-8 pb-12 text-center animate-slide-up"
          onClick={onClose}
        >
          <div className="text-5xl mb-4 animate-bounce-slow">🏆</div>

          <p className="text-accent text-xs uppercase tracking-widest font-medium mb-2">Nouvelle étape atteinte</p>
          <h2 className="text-2xl font-bold text-white mb-3">{milestone.label}</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{milestone.summary}</p>

          <div className="space-y-2 text-left mb-8">
            {milestone.organs.map((o) => (
              <div key={o.organ} className="flex items-start gap-2">
                <span className="text-xl">{o.icon}</span>
                <div>
                  <span className="text-accent text-xs font-medium">{o.organ} · </span>
                  <span className="text-gray-400 text-xs">{o.effect}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="bg-accent text-gray-900 font-semibold py-4 px-10 rounded-2xl text-base"
          >
            Continuer
          </button>
          <p className="text-muted text-xs mt-3">Appuie n'importe où pour fermer</p>
        </div>
      </div>
    </>
  )
}
