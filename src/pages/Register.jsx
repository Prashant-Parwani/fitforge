import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const goals = ['Lose Weight', 'Build Muscle', 'Bulk (Muscle + Weight Gain)', 'Stay Fit']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', goal: '', weight: '', height: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      await loginWithGoogle()
    } catch (err) {
      setGoogleLoading(false)
      setError(err.message || 'Google login failed.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add your project URL and publishable key.')
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            goal: form.goal,
            weight: form.weight,
            height: form.height,
          },
        },
      })

      if (signUpError) throw signUpError

      const user = data.user
      if (!user) throw new Error('Registration succeeded, but no user session was returned.')

      const profile = {
        user_id: user.id,
        full_name: form.name,
        goal: form.goal || null,
        weight: form.weight ? Number(form.weight) : null,
        height: form.height ? Number(form.height) : null,
        onboarded: false,
        app_data: {
          id: user.id,
          name: form.name,
          email: form.email,
          goal: form.goal,
          weight: form.weight,
          height: form.height,
          onboarded: false,
        },
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'user_id' })

      if (profileError) throw profileError

      login({
        id: user.id,
        name: form.name,
        email: form.email,
        goal: form.goal,
        weight: form.weight,
        height: form.height,
        onboarded: false,
      })
      navigate('/onboarding')
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10 bg-brown-100">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-brown-500 rounded-2xl flex items-center justify-center text-cream font-display font-bold text-xl mx-auto mb-4">FF</div>
          <h1 className="font-display text-3xl font-bold text-brown-900">Start your journey</h1>
          <p className="text-brown-500 mt-2 font-body">Free forever. No credit card needed.</p>
        </div>
        <form onSubmit={handleSubmit} className="animate-fade-up delay-100 bg-cream rounded-2xl p-8 border border-brown-200 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          <button type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-brown-200 bg-white text-brown-800 font-medium hover:bg-brown-50 transition-colors disabled:opacity-50 mb-5">
            <FcGoogle className="text-xl" />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-brown-200" />
            <span className="text-xs uppercase tracking-wide text-brown-400">or</span>
            <div className="h-px flex-1 bg-brown-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body text-sm" required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-brown-700 mb-2">Password *</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body" required />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="70"
                className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">Height (cm)</label>
              <input type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} placeholder="175"
                className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-brown-700 mb-2">Your Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map(g => (
                <button key={g} type="button" onClick={() => setForm({ ...form, goal: g })}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${form.goal === g ? 'bg-brown-500 border-brown-500 text-cream' : 'border-brown-200 text-brown-600 hover:border-brown-400 hover:bg-brown-100'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3.5 text-base disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Free Account ->'}
          </button>
          <p className="text-center text-sm text-brown-500 mt-5 font-body">
            Already have an account? <Link to="/login" className="text-brown-700 font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
