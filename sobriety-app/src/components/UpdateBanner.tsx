import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
      <p className="text-gray-900 text-sm font-medium">✨ Nouvelle version disponible</p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="shrink-0 bg-gray-900/20 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-lg"
      >
        Mettre à jour
      </button>
    </div>
  )
}
