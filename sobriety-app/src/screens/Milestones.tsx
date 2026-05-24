import { useStore } from '../store/useStore'
import { MILESTONES } from '../data/milestones'
import { addDays, fromDateKey, formatDate } from '../utils/dateUtils'

export default function Milestones() {
  const profile = useStore((s) => s.profile)
  const getSoberDays = useStore((s) => s.getSoberDays)

  if (!profile) return null

  const soberDays = getSoberDays()
  const start = addDays(fromDateKey(profile.lastDrinkDate), 1)

  function getMilestoneDate(days: number): string {
    return formatDate(addDays(start, Math.floor(days)))
  }

  function getStatus(days: number): 'past' | 'current' | 'future' {
    if (soberDays >= days) return 'past'
    if (soberDays >= days - 1) return 'current'
    return 'future'
  }

  function getDaysLeft(days: number): number {
    return Math.ceil(days - soberDays)
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold mb-2">Tes étapes</h1>
        <p className="text-muted text-sm mb-8">Ce qui se passe dans ton corps à chaque palier.</p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700" />

          <div className="space-y-6">
            {MILESTONES.map((m) => {
              const status = getStatus(m.days)
              const daysLeft = getDaysLeft(m.days)

              return (
                <div key={m.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3.5 top-1 w-3 h-3 rounded-full border-2 ${
                      status === 'past'
                        ? 'bg-accent border-accent'
                        : status === 'current'
                        ? 'bg-warn border-warn'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  />

                  <div
                    className={`rounded-2xl p-4 border ${
                      status === 'past'
                        ? 'bg-surface border-accent/30'
                        : status === 'current'
                        ? 'bg-surface border-warn/40'
                        : 'bg-surface/50 border-gray-700/50'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className={`font-semibold ${
                            status === 'past' ? 'text-white' : status === 'current' ? 'text-warn' : 'text-gray-500'
                          }`}
                        >
                          {m.label}
                        </h3>
                        <p className="text-muted text-xs">{getMilestoneDate(m.days)}</p>
                      </div>
                      {status === 'past' && (
                        <span className="text-accent text-xs font-medium bg-accent/10 px-2 py-1 rounded-full">
                          ✓ Atteint
                        </span>
                      )}
                      {status === 'future' && daysLeft > 0 && (
                        <span className="text-muted text-xs bg-gray-700 px-2 py-1 rounded-full">
                          Dans {daysLeft}j
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm mb-3 leading-relaxed ${
                        status === 'future' ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      {m.summary}
                    </p>

                    {/* Organ effects */}
                    {(status === 'past' || status === 'current') && (
                      <div className="space-y-2 pt-2 border-t border-gray-700">
                        {m.organs.map((o) => (
                          <div key={o.organ} className="flex items-start gap-2">
                            <span className="text-base mt-0.5">{o.icon}</span>
                            <div>
                              <span className="text-accent text-xs font-medium">{o.organ} · </span>
                              <span className="text-gray-400 text-xs">{o.effect}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collapsed organs for future */}
                    {status === 'future' && (
                      <div className="flex gap-2 mt-1">
                        {m.organs.map((o) => (
                          <span key={o.organ} className="text-sm opacity-40">{o.icon}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
