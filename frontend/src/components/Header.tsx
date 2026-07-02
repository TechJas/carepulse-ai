import { useTheme } from '../context/ThemeContext'

interface HeaderProps {
  nurseName: string
  onLogout?: () => void
}

export function Header({ nurseName, onLogout }: HeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent dark:bg-accent-dark flex items-center justify-center text-white font-bold text-sm">CP</div>
          <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">CarePulse AI</span>
        </div>
        <span className="text-xs text-text-secondary dark:text-text-secondary-dark bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">ICU Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-accent dark:bg-accent-dark flex items-center justify-center text-white text-xs font-bold">
            {nurseName.charAt(0)}
          </div>
          <span className="text-sm text-text-primary dark:text-text-primary-dark">{nurseName}</span>
        </div>

        {onLogout && (
          <button onClick={onLogout} className="text-xs text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition">
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
