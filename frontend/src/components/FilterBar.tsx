interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  priorityFilter: string | null
  onPriorityChange: (v: string | null) => void
  statusFilter: string | null
  onStatusChange: (v: string | null) => void
}

const priorities = ['high', 'medium', 'low']
const statuses = ['waiting', 'in_progress', 'resolved', 'escalated']

export function FilterBar({
  search, onSearchChange,
  priorityFilter, onPriorityChange,
  statusFilter, onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search by ID or bed..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="rounded-lg border border-border dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark outline-none focus:border-accent dark:focus:border-accent-dark w-48"
      />

      <div className="flex gap-1">
        {priorities.map(p => (
          <button
            key={p}
            onClick={() => onPriorityChange(priorityFilter === p ? null : p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition capitalize ${
              priorityFilter === p
                ? 'bg-accent text-white dark:bg-accent-dark'
                : 'bg-gray-100 text-text-secondary dark:bg-gray-800 dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <select
        value={statusFilter || ''}
        onChange={e => onStatusChange(e.target.value || null)}
        className="rounded-lg border border-border dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-xs text-text-primary dark:text-text-primary-dark outline-none focus:border-accent dark:focus:border-accent-dark"
      >
        <option value="">All statuses</option>
        {statuses.map(s => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
    </div>
  )
}
