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

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
