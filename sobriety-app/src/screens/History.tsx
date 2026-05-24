import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { addDays, fromDateKey, formatShortDate, toDateKey, today } from '../utils/dateUtils'

export default function History() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const events = useStore((s) => s.events)
  const getDaysSinceStart = useStore((s) => s.getDaysSinceStart)

  if (!profile) return null

  const totalDays = getDaysSinceStart()
  const start = addDays(fromDateKey(profile.lastDrinkDate), 1)

  const drinkEventsByDate = new Map<string, number>()
  const resistedByDate = new Map<string, number>()
  events.forEach((e) => {
    if (!e.resisted) {
      drinkEventsByDate.set(e.date, (drinkEventsByDate.get(e.date) ?? 0) + (e.drinkCount ?? 1))
    } else {
      resistedByDate.set(e.date, (resistedByDate.get(e.date) ?? 0) + 1)
    }
  })

  const days: { key: string; date: Date }[] = []
  for (let i = Math.min(totalDays - 1, 59); i >= 0; i--) {
    const date = addDays(start, totalDays - 1 - i)
    days.push({ key: toDateKey(date), date })
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <h1 className="text-2xl font-bold mb-2">Historique</h1>
        <p className="text-muted text-sm mb-6">
          {totalDays > 60 ? 'Les 60 derniers jours' : `Les ${totalDays} derniers jours`}
        </p>

        {/* Calendar grid */}
        <div className="flex flex-wrap gap-2 mb-8">
          {days.map(({ key, date }) => {
            const drinkCount = drinkEventsByDate.get(key)
            const resistedCount = resistedByDate.get(key)
            const isToday = key === toDateKey(today())

            let bg = 'bg-accent/30'
            if (drinkCount) bg = 'bg-danger/60'
            else if (resistedCount) bg = 'bg-warn/40'

            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div
                  title={formatShortDate(date)}
                  className={`w-8 h-8 rounded-lg ${bg} ${isToday ? 'ring-2 ring-white' : ''} flex items-center justify-center`}
                >
                  {drinkCount && (
                    <span className="text-white text-xs font-bold">{drinkCount}</span>
                  )}
                  {!drinkCount && resistedCount && (
                    <span className="text-warn text-xs">⚡</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/30" />
            <span className="text-muted text-xs">Jour sobre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warn/40" />
            <span className="text-muted text-xs">SOS résisté</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-danger/60" />
            <span className="text-muted text-xs">Verre bu</span>
          </div>
        </div>

        {/* Event list */}
        <h2 className="text-white font-semibold mb-4">Événements enregistrés</h2>
        {events.length === 0 ? (
          <p className="text-muted text-sm">Aucun événement enregistré. Le bouton SOS crée des entrées ici.</p>
        ) : (
          <div className="space-y-2">
            {[...events].reverse().map((e) => (
              <div key={e.id} className="bg-surface rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-white text-sm font-medium">
                    {e.resisted ? '⚡ SOS résisté' : `🍺 ${e.drinkCount ?? 1} verre${(e.drinkCount ?? 1) > 1 ? 's' : ''} bu${(e.drinkCount ?? 1) > 1 ? 's' : ''}`}
                  </p>
                  <p className="text-muted text-xs">{e.date}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    e.resisted ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'
                  }`}
                >
                  {e.resisted ? 'Résisté' : 'Bu'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
