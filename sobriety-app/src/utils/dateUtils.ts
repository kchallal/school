export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const aDay = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const bDay = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.floor((bDay - aDay) / msPerDay)
}

export function toDateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function fromDateKey(key: string): Date {
  return new Date(key + 'T00:00:00')
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function addDays(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + n)
  return result
}

export function today(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function formatDuration(totalDays: number): string {
  if (totalDays < 1) return 'moins d\'un jour'
  if (totalDays === 1) return '1 jour'
  if (totalDays < 30) return `${totalDays} jours`
  const months = Math.floor(totalDays / 30)
  const days = totalDays % 30
  if (months === 1 && days === 0) return '1 mois'
  if (months === 1) return `1 mois et ${days} jour${days > 1 ? 's' : ''}`
  if (days === 0) return `${months} mois`
  return `${months} mois et ${days} jour${days > 1 ? 's' : ''}`
}
