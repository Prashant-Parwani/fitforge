import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('fitforge_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const login = (userData) => {
    const u = { ...userData, onboarded: userData.onboarded ?? false }
    setUser(u)
    localStorage.setItem('fitforge_user', JSON.stringify(u))
  }

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('fitforge_user', JSON.stringify(updated))
      return updated
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fitforge_user')
    localStorage.removeItem('fitforge_token')
  }

  // ── Water tracking helpers ──────────────────────────────────────────
  const todayStr = () => new Date().toISOString().split('T')[0]

  const getWaterToday = (u) => {
    if (!u) return 0
    if (u.waterDate !== todayStr()) return 0
    return u.waterCount || 0
  }

  const addWater = () => {
    setUser(prev => {
      const today = todayStr()
      const current = prev?.waterDate === today ? (prev.waterCount || 0) : 0
      const next = Math.min(current + 1, 12)
      const updated = { ...prev, waterCount: next, waterDate: today }
      localStorage.setItem('fitforge_user', JSON.stringify(updated))
      return updated
    })
  }

  const removeWater = () => {
    setUser(prev => {
      const today = todayStr()
      const current = prev?.waterDate === today ? (prev.waterCount || 0) : 0
      const next = Math.max(current - 1, 0)
      const updated = { ...prev, waterCount: next, waterDate: today }
      localStorage.setItem('fitforge_user', JSON.stringify(updated))
      return updated
    })
  }

  // ── Streak calculation ──────────────────────────────────────────────
  const getStreak = (u) => {
    if (!u?.workoutLog?.length) return 0
    const days = [...new Set(
      u.workoutLog.map(w => w.date).filter(Boolean)
    )].sort((a, b) => b.localeCompare(a))

    let streak = 0
    let check  = todayStr()
    for (const day of days) {
      if (day === check || day === prevDay(check)) {
        streak++
        check = prevDay(check)
      } else break
    }
    return streak
  }

  const prevDay = (dateStr) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }

  return (
    <AuthContext.Provider value={{
      user, login, logout, updateUser, loading,
      getWaterToday, addWater, removeWater, getStreak, todayStr,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
