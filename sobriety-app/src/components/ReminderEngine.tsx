import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

interface Toast {
  id: string
  emoji: string
  label: string
}

async function requestNotifPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function sendNotification(emoji: string, label: string) {
  if (Notification.permission === 'granted') {
    new Notification(`${emoji} ${label}`, {
      body: 'Rappel Libre',
      icon: '/favicon.svg',
      silent: false,
    })
  }
}

export default function ReminderEngine() {
  const reminders = useStore((s) => s.reminders)
  const fireReminder = useStore((s) => s.fireReminder)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastsRef = useRef(toasts)
  toastsRef.current = toasts

  // Ask notification permission when any reminder becomes active
  useEffect(() => {
    if (reminders.some((r) => r.active)) {
      requestNotifPermission()
    }
  }, [reminders.some((r) => r.active)])

  // Check reminders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      reminders.forEach((r) => {
        if (!r.active) return
        const lastMs = r.lastFiredAt ? new Date(r.lastFiredAt).getTime() : 0
        const dueMs = lastMs + r.intervalMinutes * 60 * 1000
        if (now >= dueMs) {
          fireReminder(r.id)
          sendNotification(r.emoji, r.label)
          const toast: Toast = { id: r.id + now, emoji: r.emoji, label: r.label }
          setToasts((prev) => [...prev, toast])
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }, 6000)
        }
      })
    }, 30_000)
    return () => clearInterval(interval)
  }, [reminders])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-surface-2 border border-accent/30 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-lg pointer-events-auto animate-slide-down max-w-sm w-full"
        >
          <span className="text-2xl">{t.emoji}</span>
          <div>
            <p className="text-white font-semibold text-sm">{t.label}</p>
            <p className="text-muted text-xs">Rappel Libre</p>
          </div>
        </div>
      ))}
    </div>
  )
}
