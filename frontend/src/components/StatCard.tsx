interface StatCardProps {
  label: string
  value: number
  variant?: 'default' | 'high' | 'medium' | 'low'
}

const colors: Record<string, string> = {
  default: 'bg-white dark:bg-surface-dark border-border dark:border-border-dark',
  high: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
  medium: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
  low: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
}

const textColors: Record<string, string> = {
  default: 'text-text-primary dark:text-text-primary-dark',
  high: 'text-risk-high dark:text-risk-high-dark',
  medium: 'text-risk-medium dark:text-risk-medium-dark',
  low: 'text-risk-low dark:text-risk-low-dark',
}

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <div className={`rounded-lg border p-3 ${colors[variant]}`}>
      <p className="text-xs text-text-secondary dark:text-text-secondary-dark">{label}</p>
      <p className={`text-2xl font-bold ${textColors[variant]}`}>{value}</p>
    </div>
  )
}
