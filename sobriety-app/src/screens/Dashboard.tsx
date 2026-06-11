import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { MILESTONES, Milestone } from '../data/milestones'
import { formatDate, fromDateKey, addDays, toDateKey } from '../utils/dateUtils'
import MilestoneCelebration from '../components/MilestoneCelebration'
import { ORGAN_ACTIVITIES, getTimeSlot, getTimeLabel } from '../data/organRealtime'
import TrendChart from '../components/TrendChart'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-1">
      <p className="text-muted text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {sub && <p className="text-muted text-xs">{sub}</p>}
    </div>
  )
}

function OrganProgressBar({ label, icon, percent }: { label: string; icon: string; percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-7">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm text-accent font-medium">{percent}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function getOrganRecovery(daysSober: number): { label: string; icon: string; percent: number }[] {
  const clamp = (v: number) => Math.min(100, Math.max(0, v))
  return [
    {
      label: 'Foie',
      icon: '🫁',
      percent: clamp(
        daysSober < 3 ? daysSober * 5
        : daysSober < 30 ? 15 + (daysSober - 3) * 2
        : daysSober < 90 ? 70 + (daysSober - 30) * 0.5
        : 100
      ),
    },
    {
      label: 'Cerveau',
      icon: '🧠',
      percent: clamp(
        daysSober < 7 ? daysSober * 3
        : daysSober < 30 ? 21 + (daysSober - 7) * 2
        : daysSober < 90 ? 67 + (daysSober - 30) * 0.5
        : 97
      ),
    },
    {
      label: 'Coeur',
      icon: '❤️',
      percent: clamp(
        daysSober < 7 ? daysSober * 5
        : daysSober < 14 ? 35 + (daysSober - 7) * 5
        : daysSober < 90 ? 70 + (daysSober - 14) * 0.4
        : 100
      ),
    },
    {
      label: 'Sommeil',
      icon: '😴',
      percent: clamp(
        daysSober < 7 ? daysSober * 6
        : daysSober < 30 ? 42 + (daysSober - 7) * 2.5
        : 100
      ),
    },
    {
      label: 'Peau',
      icon: '✨',
      percent: clamp(
        daysSober < 7 ? daysSober * 8
        : daysSober < 30 ? 56 + (daysSober - 7) * 2
        : 100
      ),
    },
  ]
}

function getNextMilestone(daysSober: number) {
  return MILESTONES.find((m) => m.days > daysSober) ?? null
}

function getCurrentMilestone(daysSober: number) {
  const reached = MILESTONES.filter((m) => m.days <= daysSober)
  return reached[reached.length - 1] ?? null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const events = useStore((s) => s.events)
  const getDaysSinceStart = useStore((s) => s.getDaysSinceStart)
  const getSoberDays = useStore((s) => s.getSoberDays)
  const getCurrentStreak = useStore((s) => s.getCurrentStreak)
  const getLongestStreak = useStore((s) => s.getLongestStreak)
  const getSoberRate = useStore((s) => s.getSoberRate)
  const getMonthlySavings = useStore((s) => s.getMonthlySavings)
  const getTotalSavings = useStore((s) => s.getTotalSavings)
  const celebratedMilestones = useStore((s) => s.celebratedMilestones)
  const celebrateMilestone = useStore((s) => s.celebrateMilestone)

  const [pendingCelebration, setPendingCelebration] = useState<Milestone | null>(null)
  const [trendDays, setTrendDays] = useState(30)

  const drinkDays = useMemo(() => {
    const days = new Set<string>()
    events.filter((e) => !e.resisted).forEach((e) => days.add(e.date))
    return Array.from(days)
  }, [events])

  if (!profile) return null

  const daysSinceStart = getDaysSinceStart()
  const soberDays = getSoberDays()
  const currentStreak = getCurrentStreak()
  const longestStreak = getLongestStreak()
  const soberRate = getSoberRate()
  const monthlySavings = getMonthlySavings()
  const totalSavings = getTotalSavings()
  const organs = getOrganRecovery(soberDays)
  const nextMilestone = getNextMilestone(soberDays)
  const currentMilestone = getCurrentMilestone(soberDays)
  const startDate = addDays(fromDateKey(profile.lastDrinkDate), 1)
  const daysUntilNext = nextMilestone ? Math.ceil(nextMilestone.days - soberDays) : null

  // Detect newly reached milestones on mount
  useEffect(() => {
    const reached = MILESTONES.filter((m) => soberDays >= m.days)
    const uncelebrated = reached.find((m) => !celebratedMilestones.includes(m.id))
    if (uncelebrated) {
      setTimeout(() => setPendingCelebration(uncelebrated), 800)
    }
  }, [])

  function handleCloseCelebration() {
    if (pendingCelebration) {
      celebrateMilestone(pendingCelebration.id)
      setPendingCelebration(null)
    }
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      {pendingCelebration && (
        <MilestoneCelebration milestone={pendingCelebration} onClose={handleCloseCelebration} />
      )}
      <div className="max-w-md mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
            <p className="text-muted text-sm mt-1">Depuis le {formatDate(startDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/motivations')}
              className="bg-surface rounded-xl p-2.5"
            >
              <span className="text-xl">✍️</span>
            </button>
            <button
              onClick={() => navigate('/reminders')}
              className="relative bg-surface rounded-xl p-2.5"
            >
              <span className="text-xl">⏰</span>
              {useStore.getState().reminders.some((r) => r.active) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="bg-surface rounded-xl p-2.5"
            >
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </div>

        {/* Anti-stress shortcut */}
        <button
          onClick={() => navigate('/stress')}
          className="w-full bg-surface border border-gray-700 hover:border-accent/40 rounded-2xl p-4 mb-5 flex items-center gap-4 text-left transition-colors"
        >
          <span className="text-3xl">🧘</span>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Boîte à outils anti-stress</p>
            <p className="text-muted text-xs mt-0.5">10 techniques · Respiration, ancrage, mouvement…</p>
          </div>
          <span className="text-muted text-sm">→</span>
        </button>

        {/* Main stat */}
        <div className="bg-surface-2 border border-accent/20 rounded-3xl p-6 mb-5 text-center">
          <p className="text-muted text-sm uppercase tracking-widest mb-2">Jours sobres</p>
          <p className="text-7xl font-bold text-accent mb-2 animate-pulse-once">{soberDays}</p>
          <p className="text-muted text-sm">sur {daysSinceStart} jour{daysSinceStart > 1 ? 's' : ''} depuis le début</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard
            label="Série actuelle"
            value={`${currentStreak} j`}
            sub="jours consécutifs"
          />
          <StatCard
            label="Meilleure série"
            value={`${longestStreak} j`}
            sub="record personnel"
          />
          <StatCard
            label="Taux de sobriété"
            value={`${soberRate}%`}
            sub="des jours depuis le début"
          />
          <StatCard
            label="Étape actuelle"
            value={currentMilestone?.label ?? '–'}
            sub={currentMilestone ? '✓ atteinte' : 'En cours'}
          />
        </div>

        {/* Trend chart */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold">Tendance</p>
            <div className="flex gap-1">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setTrendDays(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    trendDays === d
                      ? 'bg-accent text-gray-900'
                      : 'bg-surface text-muted hover:text-white'
                  }`}
                >
                  {d}j
                </button>
              ))}
            </div>
          </div>
          <TrendChart
            drinkDays={drinkDays}
            startDate={toDateKey(startDate)}
            days={trendDays}
          />
        </div>

        {/* Next milestone */}
        {nextMilestone && (
          <div className="bg-surface rounded-2xl p-5 mb-5">
            <p className="text-muted text-xs uppercase tracking-wide mb-3">Prochaine étape</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{nextMilestone.label}</p>
              <p className="text-accent text-sm font-medium">Dans {daysUntilNext} jour{daysUntilNext !== 1 ? 's' : ''}</p>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.min(100, (soberDays / nextMilestone.days) * 100)}%` }}
              />
            </div>
            <p className="text-muted text-xs mt-2">{nextMilestone.summary}</p>
          </div>
        )}

        {/* Organ recovery bars */}
        <div className="bg-surface rounded-2xl p-5 mb-5">
          <p className="text-muted text-xs uppercase tracking-wide mb-4">Récupération estimée</p>
          <div className="space-y-4">
            {organs.map((o) => (
              <OrganProgressBar key={o.label} {...o} />
            ))}
          </div>
          <p className="text-muted text-xs mt-4">Estimations basées sur des données médicales moyennes.</p>
        </div>

        {/* Real-time organ activities */}
        {(() => {
          const slot = getTimeSlot()
          const activities = ORGAN_ACTIVITIES[slot]
          const label = getTimeLabel(slot)
          return (
            <div className="mb-5">
              <p className="text-muted text-xs uppercase tracking-wide mb-3 px-1">{label} — ce que font tes organes</p>
              <div className="space-y-3">
                {activities.map((a) => (
                  <div key={a.organ} className="bg-surface rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{a.icon}</span>
                      <span className="text-white text-sm font-semibold">{a.organ}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{a.activity}</p>
                    <div className="border-t border-gray-700 pt-3">
                      <p className="text-muted text-xs leading-relaxed">
                        <span className="text-danger/80 font-medium">Avec de l'alcool · </span>
                        {a.contrast}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Savings */}
        <div className="bg-surface rounded-2xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted text-xs uppercase tracking-wide">Économies</p>
            <button
              onClick={() => navigate('/edit-budget')}
              className="text-accent text-xs underline underline-offset-2"
            >
              {monthlySavings > 0 ? 'Modifier' : 'Configurer'}
            </button>
          </div>
          {monthlySavings > 0 ? (
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-accent">{totalSavings} €</p>
                <p className="text-muted text-xs mt-1">économisés depuis le début</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{Math.round(monthlySavings)} €</p>
                <p className="text-muted text-xs">par mois estimé</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/edit-budget')}
              className="w-full border border-dashed border-gray-600 rounded-xl py-4 text-muted text-sm"
            >
              + Ajouter ta consommation habituelle
            </button>
          )}
        </div>

        {/* History link */}
        <button
          onClick={() => navigate('/history')}
          className="w-full text-center text-muted text-sm py-2 underline underline-offset-4"
        >
          Voir l'historique complet →
        </button>
      </div>
    </div>
  )
}
