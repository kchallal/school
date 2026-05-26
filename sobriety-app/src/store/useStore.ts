import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { today, daysBetween, fromDateKey, toDateKey, addDays } from '../utils/dateUtils'

export interface Bottle {
  id: string
  name: string
  pricePerUnit: number
  unitsPerWeek: number
}

export interface SOSEvent {
  id: string
  timestamp: string
  date: string
  resisted: boolean
  drinkCount?: number
}

export interface Profile {
  lastDrinkDate: string
  lastDrinkCount: number
  bottles: Bottle[]
}

interface AppState {
  profile: Profile | null
  events: SOSEvent[]
  celebratedMilestones: string[]

  // Actions
  setProfile: (p: Profile) => void
  recordSOS: (resisted: boolean, drinkCount?: number) => void
  celebrateMilestone: (id: string) => void
  reset: () => void

  // Derived getters
  getDaysSinceStart: () => number
  getSoberDays: () => number
  getDrinkDays: () => string[]
  getCurrentStreak: () => number
  getLongestStreak: () => number
  getSoberRate: () => number
  getMonthlySavings: () => number
  getTotalSavings: () => number
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      events: [],
      celebratedMilestones: [],

      setProfile: (p) => set({ profile: p }),

      celebrateMilestone: (id) =>
        set((s) => ({ celebratedMilestones: [...s.celebratedMilestones, id] })),

      recordSOS: (resisted, drinkCount) => {
        const event: SOSEvent = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          date: toDateKey(today()),
          resisted,
          drinkCount: resisted ? undefined : drinkCount,
        }
        set((s) => ({ events: [...s.events, event] }))
      },

      reset: () => set({ profile: null, events: [], celebratedMilestones: [] }),

      getDaysSinceStart: () => {
        const { profile } = get()
        if (!profile) return 0
        const start = fromDateKey(profile.lastDrinkDate)
        const soberStart = addDays(start, 1)
        return Math.max(0, daysBetween(soberStart, today()) + 1)
      },

      getDrinkDays: () => {
        const { events } = get()
        const days = new Set<string>()
        events.filter((e) => !e.resisted).forEach((e) => days.add(e.date))
        return Array.from(days)
      },

      getSoberDays: () => {
        const { profile } = get()
        if (!profile) return 0
        const drinkDays = new Set(get().getDrinkDays())
        const start = addDays(fromDateKey(profile.lastDrinkDate), 1)
        const totalDays = Math.max(0, daysBetween(start, today()) + 1)
        let sober = 0
        for (let i = 0; i < totalDays; i++) {
          const key = toDateKey(addDays(start, i))
          if (!drinkDays.has(key)) sober++
        }
        return sober
      },

      getCurrentStreak: () => {
        const { profile } = get()
        if (!profile) return 0
        const drinkDays = new Set(get().getDrinkDays())
        let streak = 0
        let cursor = today()
        while (true) {
          const key = toDateKey(cursor)
          const startKey = toDateKey(addDays(fromDateKey(profile.lastDrinkDate), 1))
          if (key < startKey) break
          if (drinkDays.has(key)) break
          streak++
          cursor = addDays(cursor, -1)
        }
        return streak
      },

      getLongestStreak: () => {
        const { profile } = get()
        if (!profile) return 0
        const drinkDays = new Set(get().getDrinkDays())
        const start = addDays(fromDateKey(profile.lastDrinkDate), 1)
        const totalDays = Math.max(0, daysBetween(start, today()) + 1)
        let longest = 0
        let current = 0
        for (let i = 0; i < totalDays; i++) {
          const key = toDateKey(addDays(start, i))
          if (!drinkDays.has(key)) {
            current++
            longest = Math.max(longest, current)
          } else {
            current = 0
          }
        }
        return longest
      },

      getSoberRate: () => {
        const total = get().getDaysSinceStart()
        if (total === 0) return 100
        const sober = get().getSoberDays()
        return Math.round((sober / total) * 100)
      },

      getMonthlySavings: () => {
        const { profile } = get()
        if (!profile || !profile.bottles.length) return 0
        return profile.bottles.reduce((sum, b) => sum + b.pricePerUnit * b.unitsPerWeek * 4.33, 0)
      },

      getTotalSavings: () => {
        const { profile } = get()
        if (!profile) return 0
        const soberDays = get().getSoberDays()
        const perDay = get().getMonthlySavings() / 30
        return Math.round(perDay * soberDays)
      },
    }),
    {
      name: 'libre-app-state',
    }
  )
)
