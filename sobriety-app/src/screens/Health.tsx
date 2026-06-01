import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { HealthLog } from '../store/useStore'
import { toDateKey, fromDateKey, formatShortDate, addDays } from '../utils/dateUtils'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getNowTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function getTodayKey(): string {
  const now = new Date()
  return toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
}

interface SvgPoint {
  x: number
  y: number
  log: HealthLog
}

function BloodPressureChart({ logs }: { logs: HealthLog[] }) {
  const SVG_WIDTH = 320
  const SVG_HEIGHT = 180
  const PAD_LEFT = 36
  const PAD_RIGHT = 12
  const PAD_TOP = 12
  const PAD_BOTTOM = 24

  // Only last 30 days
  const now = new Date()
  const thirtyDaysAgo = addDays(now, -30)
  const recent = logs
    .filter((l) => {
      const d = fromDateKey(l.date)
      return d >= thirtyDaysAgo && (l.systolic !== undefined || l.diastolic !== undefined)
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  if (recent.length < 2) {
    return (
      <div className="bg-surface rounded-2xl p-5 mb-5 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-white font-semibold mb-2">Graphe de tension</p>
        <p className="text-muted text-sm leading-relaxed">
          Mesure ta tension régulièrement pour voir l'évolution. Le graphe s'affichera dès que tu auras 2 mesures ou plus.
        </p>
      </div>
    )
  }

  const systolicVals = recent.filter((l) => l.systolic !== undefined).map((l) => l.systolic as number)
  const diastolicVals = recent.filter((l) => l.diastolic !== undefined).map((l) => l.diastolic as number)
  const allVals = [...systolicVals, ...diastolicVals]
  const minVal = Math.min(...allVals) - 5
  const maxVal = Math.max(...allVals) + 5

  function toY(v: number): number {
    return PAD_TOP + (PAD_BOTTOM > 0 ? 0 : 0) + (SVG_HEIGHT - PAD_TOP - PAD_BOTTOM) * (1 - (v - minVal) / (maxVal - minVal))
  }

  function toX(i: number, total: number): number {
    if (total === 1) return (SVG_WIDTH - PAD_LEFT - PAD_RIGHT) / 2 + PAD_LEFT
    return PAD_LEFT + (i / (total - 1)) * (SVG_WIDTH - PAD_LEFT - PAD_RIGHT)
  }

  const systolicPoints: SvgPoint[] = recent
    .filter((l) => l.systolic !== undefined)
    .map((l, i, arr) => ({
      x: toX(i, arr.length),
      y: toY(l.systolic as number),
      log: l,
    }))

  const diastolicPoints: SvgPoint[] = recent
    .filter((l) => l.diastolic !== undefined)
    .map((l, i, arr) => ({
      x: toX(i, arr.length),
      y: toY(l.diastolic as number),
      log: l,
    }))

  function polyline(points: SvgPoint[]): string {
    return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  }

  // Y-axis labels
  const yStep = Math.round((maxVal - minVal) / 3)
  const yLabels = [minVal, minVal + yStep, minVal + 2 * yStep, maxVal].map((v) => Math.round(v))

  return (
    <div className="bg-surface rounded-2xl p-4 mb-5">
      <p className="text-muted text-xs uppercase tracking-wide mb-3">Tension sur 30 jours</p>
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height={SVG_HEIGHT}
        style={{ display: 'block' }}
      >
        {/* Grid lines */}
        {yLabels.map((v) => {
          const y = toY(v)
          return (
            <g key={v}>
              <line
                x1={PAD_LEFT}
                y1={y}
                x2={SVG_WIDTH - PAD_RIGHT}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text
                x={PAD_LEFT - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#6B7280"
                fontSize="9"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* Systolic line */}
        {systolicPoints.length >= 2 && (
          <polyline
            points={polyline(systolicPoints)}
            fill="none"
            stroke="#4ECCA3"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Diastolic line */}
        {diastolicPoints.length >= 2 && (
          <polyline
            points={polyline(diastolicPoints)}
            fill="none"
            stroke="#FFB347"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Systolic points */}
        {systolicPoints.map((p, i) => (
          <circle
            key={`s-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#4ECCA3"
            stroke="#1C1F2A"
            strokeWidth="1.5"
            style={{ cursor: 'pointer' }}
          >
            <title>{`${p.log.date} ${p.log.time} — Sys: ${p.log.systolic}`}</title>
          </circle>
        ))}

        {/* Diastolic points */}
        {diastolicPoints.map((p, i) => (
          <circle
            key={`d-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#FFB347"
            stroke="#1C1F2A"
            strokeWidth="1.5"
            style={{ cursor: 'pointer' }}
          >
            <title>{`${p.log.date} ${p.log.time} — Dia: ${p.log.diastolic}`}</title>
          </circle>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-accent rounded" />
          <span className="text-muted text-xs">Systolique</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-warn rounded" />
          <span className="text-muted text-xs">Diastolique</span>
        </div>
      </div>
    </div>
  )
}

export default function Health() {
  const navigate = useNavigate()
  const healthLogs = useStore((s) => s.healthLogs)
  const addHealthLog = useStore((s) => s.addHealthLog)
  const removeHealthLog = useStore((s) => s.removeHealthLog)

  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [time, setTime] = useState(getNowTime)

  const sortedLogs = useMemo(
    () => [...healthLogs].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [healthLogs]
  )

  const recentLogs = sortedLogs.slice(0, 10)

  function handleSave() {
    const sys = systolic ? parseInt(systolic, 10) : undefined
    const dia = diastolic ? parseInt(diastolic, 10) : undefined

    if (sys === undefined && dia === undefined && waterGlasses === 0) return

    const log: HealthLog = {
      id: generateId(),
      date: getTodayKey(),
      time,
      systolic: sys,
      diastolic: dia,
      waterGlasses,
    }
    addHealthLog(log)
    setSystolic('')
    setDiastolic('')
    setWaterGlasses(0)
    setTime(getNowTime())
  }

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <h1 className="text-2xl font-bold mb-1">Santé</h1>
        <p className="text-muted text-sm mb-6">Suivi de ta tension artérielle et hydratation</p>

        {/* Form */}
        <div className="bg-surface rounded-2xl p-5 mb-5">
          <p className="text-muted text-xs uppercase tracking-wide mb-4">Nouvelle mesure</p>

          {/* Blood pressure */}
          <div className="mb-4">
            <p className="text-white text-sm font-medium mb-2">Tension artérielle</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-muted text-xs mb-1 block">Systolique</label>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  min={60}
                  max={250}
                  className="w-full bg-surface-2 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-base focus:border-accent focus:outline-none"
                />
              </div>
              <span className="text-muted text-lg mt-4">/</span>
              <div className="flex-1">
                <label className="text-muted text-xs mb-1 block">Diastolique</label>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  min={40}
                  max={150}
                  className="w-full bg-surface-2 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-base focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Water glasses */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-medium">Verres d'eau aujourd'hui</p>
              <span className="text-accent font-bold text-lg">{waterGlasses}</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={waterGlasses}
              onChange={(e) => setWaterGlasses(parseInt(e.target.value, 10))}
              className="w-full accent-[#4ECCA3]"
            />
            <div className="flex justify-between text-muted text-xs mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
            </div>
          </div>

          {/* Time */}
          <div className="mb-5">
            <label className="text-muted text-xs mb-1 block">Heure</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-surface-2 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-base focus:border-accent focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-accent text-gray-900 font-semibold py-3.5 rounded-xl text-base"
          >
            Enregistrer
          </button>
        </div>

        {/* Chart */}
        <BloodPressureChart logs={healthLogs} />

        {/* Recent logs */}
        <div>
          <h2 className="text-white font-semibold mb-3">Dernières mesures</h2>
          {recentLogs.length === 0 ? (
            <p className="text-muted text-sm">Aucune mesure enregistrée pour l'instant.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white text-sm font-medium">
                        {log.date} à {log.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {(log.systolic !== undefined || log.diastolic !== undefined) && (
                        <span className="text-gray-300 text-sm">
                          ❤️{' '}
                          {log.systolic !== undefined ? log.systolic : '–'}/
                          {log.diastolic !== undefined ? log.diastolic : '–'} mmHg
                        </span>
                      )}
                      {log.waterGlasses > 0 && (
                        <span className="text-gray-300 text-sm">
                          💧 {log.waterGlasses} verre{log.waterGlasses > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeHealthLog(log.id)}
                    className="text-muted text-sm hover:text-danger transition-colors w-7 h-7 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
