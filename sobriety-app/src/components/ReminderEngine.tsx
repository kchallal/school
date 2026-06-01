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
  return (await Notification.requestPermission()) === 'granted'
}

function syncToServiceWorker(reminders: ReturnType<typeof useStore.getState>['reminders']) {
  if (!navigator.serviceWorker?.controller) return
  navigator.serviceWorker.controller.postMessage({
    type: 'SYNC_REMINDERS',
    reminders,
  })
}

export default function ReminderEngine() {
  const reminders = useStore((s) => s.reminders)
  const fireReminder = useStore((s) => s.fireReminder)
  const [toasts, setToasts] = useState<Toast[]>([])

  const activeCount = reminders.filter((r) => r.active).length

  // Ask permission and sync to SW whenever reminders change
  useEffect(() => {
    if (activeCount > 0) {
      requestNotifPermission().then(() => syncToServiceWorker(reminders))
    } else {
      syncToServiceWorker(reminders)
    }
  }, [JSON.stringify(reminders)])

  // Also sync once SW is ready (first load)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.ready.then(() => {
      if (reminders.some((r) => r.active)) syncToServiceWorker(reminders)
    })
  }, [])

  // Listen for REMINDER_FIRED from SW → update store + show in-app toast
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'REMINDER_FIRED') return
      const { id } = event.data as { id: string }
      fireReminder(id)
      const r = useStore.getState().reminders.find((r) => r.id === id)
      if (!r) return
      const toast: Toast = { id: id + Date.now(), emoji: r.emoji, label: r.label }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 6000)
    }
    navigator.serviceWorker.addEventListener('message', handler)
    return () => navigator.serviceWorker.removeEventListener('message', handler)
  }, [reminders])

  // Fallback in-app interval (when SW not available, e.g. dev mode)
  const fallbackRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if ('serviceWorker' in navigator) return
    fallbackRef.current = setInterval(() => {
      const now = Date.now()
      useStore.getState().reminders.forEach((r) => {
        if (!r.active) return
        const lastMs = r.lastFiredAt ? new Date(r.lastFiredAt).getTime() : 0
        if (now >= lastMs + r.intervalMinutes * 60 * 1000) {
          fireReminder(r.id)
          const toast: Toast = { id: r.id + now, emoji: r.emoji, label: r.label }
          setToasts((prev) => [...prev, toast])
          setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 6000)
        }
      })
    }, 30_000)
    return () => { if (fallbackRef.current) clearInterval(fallbackRef.current) }
  }, [])

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
            <p className="text-muted text-xs">Rappel · Libre</p>
          </div>
        </div>
      ))}
    </div>
  )
}
