import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (form.email && form.password) {
        // Check if user already exists in localStorage (returning user)
        const existing = localStorage.getItem('fitforge_user')
        if (existing) {
          const u = JSON.parse(existing)
          login(u)
          navigate(u.onboarded ? '/' : '/onboarding')
        } else {
          // New user via login → send to onboarding
          login({ name: form.email.split('@')[0], email: form.email, onboarded: false })
          navigate('/onboarding')
        }
      } else {
        setError('Please fill in all fields.')
      }
    } catch { setError('Login failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-brown-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-14 h-14 bg-brown-500 rounded-2xl flex items-center justify-center text-cream font-display font-bold text-xl mx-auto mb-4">FF</div>
          <h1 className="font-display text-3xl font-bold text-brown-900">Welcome back</h1>
          <p className="text-brown-500 mt-2 font-body">Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="animate-fade-up delay-100 bg-cream rounded-2xl p-8 border border-brown-200 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          <div className="mb-5">
            <label className="block text-sm font-medium text-brown-700 mb-2">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-brown-700 mb-2">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 focus:outline-none focus:border-brown-400 font-body" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3.5 text-base disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
          <p className="text-center text-sm text-brown-500 mt-5 font-body">
            No account? <Link to="/register" className="text-brown-700 font-medium hover:underline">Create one free</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
