import { useEffect, useState } from 'react'

interface Particle {
  id: number
  emoji: string
  x: number
  delay: number
  duration: number
  size: number
}

export default function FloatingEmojis({ emojis, count = 12 }: { emojis: string[]; count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const p: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: 5 + Math.random() * 90,
      delay: Math.random() * 1.2,
      duration: 1.8 + Math.random() * 1.2,
      size: 1.2 + Math.random() * 1.4,
    }))
    setParticles(p)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-float-up"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
