import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('priya@hospital.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl bg-accent dark:bg-accent-dark flex items-center justify-center text-white font-bold text-xl mb-3">
            CP
          </div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">CarePulse AI</h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">Clinical Alert Triage</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary outline-none focus:border-accent dark:focus:border-accent-dark"
              placeholder="nurse@hospital.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary outline-none focus:border-accent dark:focus:border-accent-dark"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={busy}
            className="w-full rounded-lg bg-accent dark:bg-accent-dark text-white px-4 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-50 transition"
          >
            {busy ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-center text-text-secondary dark:text-text-secondary-dark">
            Demo: priya@hospital.com / password123
          </p>
        </form>
      </div>
    </div>
  )
}
