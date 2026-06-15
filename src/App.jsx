import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import FloatingCoach from './components/FloatingCoach'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Machines from './pages/Machines'
import WorkoutPlan from './pages/WorkoutPlan'
import WorkoutLogger from './pages/WorkoutLogger'
import Diet from './pages/Diet'
import Scanner from './pages/Scanner'
import Progress from './pages/Progress'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Coach from './pages/Coach'
import Calculator from './pages/Calculator'
import WorkoutHistory from './pages/WorkoutHistory'
import BodyMetrics from './pages/BodyMetrics'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function OnboardingGuard({ children }) {
  const { user } = useAuth()
  if (user && !user.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

function DashboardGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!user.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brown-100 grain-overlay">
          <Navbar />
          <Routes>
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/"           element={<Home />} />
            <Route path="/dashboard"  element={<DashboardGuard><Dashboard /></DashboardGuard>} />
            <Route path="/machines"   element={<OnboardingGuard><Machines /></OnboardingGuard>} />
            <Route path="/workout"    element={<OnboardingGuard><WorkoutPlan /></OnboardingGuard>} />
            <Route path="/log"        element={<OnboardingGuard><WorkoutLogger /></OnboardingGuard>} />
            <Route path="/diet"       element={<OnboardingGuard><Diet /></OnboardingGuard>} />
            <Route path="/scanner"    element={<OnboardingGuard><Scanner /></OnboardingGuard>} />
            <Route path="/progress"   element={<OnboardingGuard><Progress /></OnboardingGuard>} />
            <Route path="/coach"      element={<OnboardingGuard><Coach /></OnboardingGuard>} />
            <Route path="/calculator" element={<OnboardingGuard><Calculator /></OnboardingGuard>} />
            <Route path="/history"    element={<OnboardingGuard><WorkoutHistory /></OnboardingGuard>} />
            <Route path="/metrics"    element={<OnboardingGuard><BodyMetrics /></OnboardingGuard>} />
          </Routes>
          <FloatingCoach />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
