import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Settings() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const events = useStore((s) => s.events)
  const celebratedMilestones = useStore((s) => s.celebratedMilestones)
  const reminders = useStore((s) => s.reminders)
  const healthLogs = useStore((s) => s.healthLogs)
  const motivations = useStore((s) => s.motivations)
  const restoreFromBackup = useStore((s) => s.restoreFromBackup)
  const reset = useStore((s) => s.reset)

  const fileRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [confirmReset, setConfirmReset] = useState(false)

  function handleExport() {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      events,
      celebratedMilestones,
      reminders,
      healthLogs,
      motivations,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `libre-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (!data || typeof data !== 'object') throw new Error()
        restoreFromBackup({
          profile: data.profile,
          events: data.events,
          celebratedMilestones: data.celebratedMilestones,
          reminders: data.reminders,
          healthLogs: data.healthLogs,
          motivations: data.motivations,
        })
        setImportStatus('ok')
        setTimeout(() => setImportStatus('idle'), 3000)
      } catch {
        setImportStatus('error')
        setTimeout(() => setImportStatus('idle'), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    reset()
    navigate('/')
  }

  const totalEvents = events.length
  const totalHealthLogs = healthLogs.length

  return (
    <div className="min-h-screen bg-base text-white pb-24">
      <div className="max-w-md mx-auto px-5 py-8">
        <button onClick={() => navigate('/')} className="text-muted text-sm flex items-center gap-1 mb-6">
          ← Retour
        </button>

        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        {/* Data summary */}
        <div className="bg-surface rounded-2xl p-5 mb-6">
          <p className="text-muted text-xs uppercase tracking-wide mb-3">Mes données</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-white text-xl font-bold">{totalEvents}</p>
              <p className="text-muted text-xs mt-0.5">événements</p>
            </div>
            <div>
              <p className="text-white text-xl font-bold">{totalHealthLogs}</p>
              <p className="text-muted text-xs mt-0.5">mesures santé</p>
            </div>
            <div>
              <p className="text-white text-xl font-bold">{motivations.length}</p>
              <p className="text-muted text-xs mt-0.5">motivations</p>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-surface rounded-2xl p-5 mb-4">
          <p className="text-white font-semibold mb-1">Exporter mes données</p>
          <p className="text-muted text-sm mb-4">
            Télécharge un fichier JSON avec tout ton historique. Utile avant une mise à jour ou pour changer d'appareil.
          </p>
          <button
            onClick={handleExport}
            className="w-full bg-accent text-gray-900 font-semibold rounded-xl py-3 text-sm"
          >
            ↓ Télécharger la sauvegarde
          </button>
        </div>

        {/* Import */}
        <div className="bg-surface rounded-2xl p-5 mb-4">
          <p className="text-white font-semibold mb-1">Importer une sauvegarde</p>
          <p className="text-muted text-sm mb-4">
            Restaure tes données depuis un fichier exporté précédemment. Remplace les données actuelles.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-gray-600 text-muted rounded-xl py-3 text-sm hover:border-accent hover:text-accent transition-colors"
          >
            ↑ Choisir un fichier JSON
          </button>
          {importStatus === 'ok' && (
            <p className="text-accent text-xs mt-2 text-center">✓ Données restaurées avec succès</p>
          )}
          {importStatus === 'error' && (
            <p className="text-danger text-xs mt-2 text-center">Fichier invalide. Utilise un export Libre.</p>
          )}
        </div>

        {/* Reset */}
        <div className="bg-surface rounded-2xl p-5">
          <p className="text-white font-semibold mb-1">Réinitialiser l'application</p>
          <p className="text-muted text-sm mb-4">
            Supprime toutes les données : profil, historique, rappels. Irréversible.
          </p>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full border border-danger/40 text-danger/70 rounded-xl py-3 text-sm hover:border-danger hover:text-danger transition-colors"
            >
              Réinitialiser
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-danger text-sm text-center font-medium">Tu es sûr ? Toutes les données seront perdues.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 bg-surface-2 text-muted rounded-xl py-3 text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-danger text-white rounded-xl py-3 text-sm font-semibold"
                >
                  Tout effacer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
