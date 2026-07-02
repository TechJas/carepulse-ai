interface BadgeProps {
  variant: 'high' | 'medium' | 'low' | 'info' | 'waiting' | 'in_progress' | 'resolved' | 'escalated'
  children: string
}

const variants: Record<string, string> = {
  high: 'bg-risk-high/10 text-risk-high dark:bg-risk-high-dark/20 dark:text-risk-high-dark',
  medium: 'bg-risk-medium/10 text-risk-medium dark:bg-risk-medium-dark/20 dark:text-risk-medium-dark',
  low: 'bg-risk-low/10 text-risk-low dark:bg-risk-low-dark/20 dark:text-risk-low-dark',
  info: 'bg-risk-info/10 text-risk-info dark:bg-risk-info-dark/20 dark:text-risk-info-dark',
  waiting: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  resolved: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  escalated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
