import { useMemo } from 'react'
import { addDays, fromDateKey, toDateKey } from '../utils/dateUtils'

interface TrendChartProps {
  drinkDays: string[]
  startDate: string
  days: number
}

export default function TrendChart({ drinkDays, startDate, days }: TrendChartProps) {
  const drinkSet = useMemo(() => new Set(drinkDays), [drinkDays])
  const startDateObj = useMemo(() => fromDateKey(startDate), [startDate])

  const todayKey = useMemo(() => {
    const now = new Date()
    return toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
  }, [])

  // Build day-by-day data for the chart
  const chartDays = useMemo(() => {
    const result: { key: string; status: 'sober' | 'drank' | 'future' }[] = []
    const today = new Date(todayKey + 'T00:00:00')

    for (let i = 0; i < days; i++) {
      const date = addDays(today, i - (days - 1))
      const key = toDateKey(date)
      const isBeforeStart = date < startDateObj
      const isFuture = date > today

      let status: 'sober' | 'drank' | 'future'
      if (isFuture || isBeforeStart) {
        status = 'future'
      } else if (drinkSet.has(key)) {
        status = 'drank'
      } else {
        status = 'sober'
      }
      result.push({ key, status })
    }
    return result
  }, [days, drinkSet, startDateObj, todayKey])

  // 7-day moving average of sobriety rate
  const trendLine = useMemo(() => {
    const points: { x: number; y: number }[] = []
    for (let i = 6; i < chartDays.length; i++) {
      const window = chartDays.slice(i - 6, i + 1)
      const validDays = window.filter((d) => d.status !== 'future')
      if (validDays.length === 0) continue
      const soberCount = validDays.filter((d) => d.status === 'sober').length
      const rate = soberCount / validDays.length
      points.push({ x: i, y: rate })
    }
    return points
  }, [chartDays])

  const soberCount = chartDays.filter((d) => d.status === 'sober').length
  const totalTracked = chartDays.filter((d) => d.status !== 'future').length

  // SVG dimensions
  const svgHeight = 120
  const svgPadX = 4
  const barGap = 2
  const barWidth = Math.max(2, Math.floor((320 - svgPadX * 2 - barGap * (days - 1)) / days))
  const svgWidth = svgPadX * 2 + (barWidth + barGap) * days - barGap
  const barAreaHeight = 80
  const barTop = 10

  function barColor(status: 'sober' | 'drank' | 'future'): string {
    if (status === 'sober') return '#4ECCA3'
    if (status === 'drank') return '#FF6B6B'
    return '#374151'
  }

  // Trend line path
  const trendPath = trendLine
    .map((p, idx) => {
      const x = svgPadX + p.x * (barWidth + barGap) + barWidth / 2
      const y = barTop + barAreaHeight - p.y * barAreaHeight
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-muted text-xs uppercase tracking-wide">Tendance</p>
        <p className="text-accent text-xs font-medium">
          {soberCount} jour{soberCount !== 1 ? 's' : ''} sobre{soberCount !== 1 ? 's' : ''} sur {totalTracked}
        </p>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height="100"
          preserveAspectRatio="none"
        >
          {/* Bars */}
          {chartDays.map((d, i) => {
            const x = svgPadX + i * (barWidth + barGap)
            return (
              <rect
                key={d.key}
                x={x}
                y={barTop}
                width={barWidth}
                height={barAreaHeight}
                rx="1"
                fill={barColor(d.status)}
                opacity={d.status === 'future' ? 0.3 : 0.85}
              />
            )
          })}

          {/* Trend line */}
          {trendPath && (
            <path
              d={trendPath}
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span className="text-muted text-xs">Sobre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-danger" />
          <span className="text-muted text-xs">Verre bu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-600" />
          <span className="text-muted text-xs">Pas de données</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-white/60" />
          <span className="text-muted text-xs">Tendance 7j</span>
        </div>
      </div>
    </div>
  )
}
