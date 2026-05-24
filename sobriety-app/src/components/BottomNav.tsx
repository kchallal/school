import { useLocation, useNavigate } from 'react-router-dom'

const items = [
  { path: '/', label: 'Accueil', icon: '🏠' },
  { path: '/sos', label: 'SOS', icon: null },
  { path: '/milestones', label: 'Étapes', icon: '📅' },
  { path: '/knowledge', label: 'Savoir', icon: '📚' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-base/95 backdrop-blur-md border-t border-gray-800 z-40">
      <div className="max-w-md mx-auto flex items-end justify-around px-4 py-2 pb-safe">
        {items.map((item) => {
          if (item.path === '/sos') {
            return (
              <button
                key={item.path}
                onClick={() => navigate('/sos')}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
                  <span className="text-gray-900 text-2xl font-bold">SOS</span>
                </div>
                <span className="text-xs text-accent mt-1 font-medium">Envie</span>
              </button>
            )
          }
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-1 px-3"
            >
              <span className={`text-xl ${isActive ? '' : 'opacity-50'}`}>{item.icon}</span>
              <span className={`text-xs ${isActive ? 'text-accent' : 'text-muted'}`}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
