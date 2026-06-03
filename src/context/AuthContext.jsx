import { createContext, useContext, useState, useEffect } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function mapSupabaseUser(supabaseUser, profile) {
  const appData = profile?.app_data || {}

  return {
    ...appData,
    id: supabaseUser.id,
    name: profile?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
    email: supabaseUser.email,
    goal: profile?.goal || supabaseUser.user_metadata?.goal || '',
    weight: profile?.weight || supabaseUser.user_metadata?.weight || '',
    height: profile?.height || supabaseUser.user_metadata?.height || '',
    onboarded: profile?.onboarded ?? appData.onboarded ?? false,
  }
}

async function persistUser(appUser) {
  if (!isSupabaseConfigured || !appUser?.id) return

  const profile = {
    user_id: appUser.id,
    full_name: appUser.name || null,
    goal: appUser.goal || null,
    weight: appUser.weight ? Number(appUser.weight) : null,
    height: appUser.height ? Number(appUser.height) : null,
    onboarded: appUser.onboarded ?? false,
    app_data: appUser,
    updated_at: new Date().toISOString(),
  }

  await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'user_id' })
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const saved = localStorage.getItem('fitforge_user')
      if (saved && mounted) setUser(JSON.parse(saved))

      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getUser()

        if (data.user && mounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .maybeSingle()

          const appUser = mapSupabaseUser(data.user, profile)
          setUser(appUser)
          localStorage.setItem('fitforge_user', JSON.stringify(appUser))
        }
      }

      if (mounted) setLoading(false)
    }

    loadUser()

    return () => { mounted = false }
  }, [])

  const login = (userData) => {
    const u = { ...userData, onboarded: userData.onboarded ?? false }
    setUser(u)
    localStorage.setItem('fitforge_user', JSON.stringify(u))
    persistUser(u)
  }

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('fitforge_user', JSON.stringify(updated))
      persistUser(updated)
      return updated
    })
  }

  const logout = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('fitforge_user')
    localStorage.removeItem('fitforge_token')
  }

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
      persistUser(updated)
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
      persistUser(updated)
      return updated
    })
  }

  const prevDay = (dateStr) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }

  const getStreak = (u) => {
    if (!u?.workoutLog?.length) return 0
    const days = [...new Set(
      u.workoutLog.map(w => w.date).filter(Boolean)
    )].sort((a, b) => b.localeCompare(a))

    let streak = 0
    let check = todayStr()
    for (const day of days) {
      if (day === check || day === prevDay(check)) {
        streak++
        check = prevDay(check)
      } else break
    }
    return streak
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
