import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import Onboarding from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import SOS from './screens/SOS'
import Milestones from './screens/Milestones'
import Knowledge from './screens/Knowledge'
import History from './screens/History'
import EditBudget from './screens/EditBudget'

function AppShell() {
  const profile = useStore((s) => s.profile)

  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit-budget" element={<EditBudget />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}
