import confetti from 'canvas-confetti'

export function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#4ECCA3', '#ffffff', '#FFB347', '#a8edea'],
  })
}

export function fireMilestoneConfetti() {
  const end = Date.now() + 1800

  const colors = ['#4ECCA3', '#ffffff', '#FFB347']

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function fireResistConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#4ECCA3', '#a8edea', '#ffffff'],
    scalar: 1.2,
  })
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFB347', '#4ECCA3'],
    })
  }, 400)
}
