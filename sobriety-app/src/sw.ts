import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sw = self as any

cleanupOutdatedCaches()
precacheAndRoute((self as unknown as { __WB_MANIFEST: [] }).__WB_MANIFEST)

// ─── Reminder scheduling ─────────────────────────────────────────────────────

interface ReminderPayload {
  id: string
  label: string
  emoji: string
  intervalMinutes: number
  lastFiredAt: string | null
  active: boolean
}

const timers = new Map<string, ReturnType<typeof setTimeout>>()

function scheduleOne(r: ReminderPayload, delayMs: number) {
  clearTimeout(timers.get(r.id))

  const t = setTimeout(() => {
    sw.registration.showNotification(`${r.emoji} ${r.label}`, {
      body: 'Rappel · Libre',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: r.id,
      renotify: true,
    })

    sw.clients
      .matchAll({ includeUncontrolled: true })
      .then((clients: { postMessage: (m: unknown) => void }[]) => {
        clients.forEach((c) => c.postMessage({ type: 'REMINDER_FIRED', id: r.id }))
      })

    // Reschedule next occurrence
    scheduleOne(r, r.intervalMinutes * 60 * 1000)
  }, delayMs)

  timers.set(r.id, t)
}

sw.addEventListener('message', (event: { data: { type: string; reminders?: ReminderPayload[]; id?: string } }) => {
  const { type } = event.data

  if (type === 'SYNC_REMINDERS') {
    timers.forEach((t) => clearTimeout(t))
    timers.clear()
    const now = Date.now()
    ;(event.data.reminders ?? []).forEach((r) => {
      if (!r.active) return
      const lastMs = r.lastFiredAt ? new Date(r.lastFiredAt).getTime() : 0
      const delay = Math.max(0, lastMs + r.intervalMinutes * 60 * 1000 - now)
      scheduleOne(r, delay)
    })
  }

  if (type === 'CANCEL_REMINDER' && event.data.id) {
    clearTimeout(timers.get(event.data.id))
    timers.delete(event.data.id)
  }
})

sw.addEventListener('notificationclick', (event: { notification: { close: () => void }; waitUntil: (p: Promise<unknown>) => void }) => {
  event.notification.close()
  event.waitUntil(
    sw.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients: { focus: () => void }[]) => {
        if (clients.length > 0) return clients[0].focus()
        return sw.clients.openWindow('/')
      })
  )
})
