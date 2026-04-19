import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Machines from './pages/Machines'
import WorkoutPlan from './pages/WorkoutPlan'
import Diet from './pages/Diet'
import Scanner from './pages/Scanner'
import Progress from './pages/Progress'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import { AuthProvider, useAuth } from './context/AuthContext'

function OnboardingGuard({ children }) {
  const { user } = useAuth()
  if (user && !user.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brown-100 grain-overlay">
          <Navbar />
          <Routes>
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/"           element={<OnboardingGuard><Home /></OnboardingGuard>} />
            <Route path="/machines"   element={<OnboardingGuard><Machines /></OnboardingGuard>} />
            <Route path="/workout"    element={<OnboardingGuard><WorkoutPlan /></OnboardingGuard>} />
            <Route path="/diet"       element={<OnboardingGuard><Diet /></OnboardingGuard>} />
            <Route path="/scanner"    element={<OnboardingGuard><Scanner /></OnboardingGuard>} />
            <Route path="/progress"   element={<OnboardingGuard><Progress /></OnboardingGuard>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
