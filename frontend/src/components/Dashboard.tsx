import { useState, useMemo } from 'react'
import type { PatientAlert } from '../types'
import { mockPatients, dashboardSummary } from '../data/mockPatients'
import { Header } from './Header'
import { StatCard } from './StatCard'
import { PatientCard } from './PatientCard'
import { PatientTable } from './PatientTable'
import { PatientDetail } from './PatientDetail'
import { FilterBar } from './FilterBar'

const priorityOrder = { high: 0, medium: 1, low: 2, info: 3 }

export function Dashboard() {
  const [patients, setPatients] = useState<PatientAlert[]>(mockPatients)
  const [selected, setSelected] = useState<PatientAlert | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...patients].sort((a, b) => {
      return (priorityOrder[a.riskScore.priority] ?? 99) - (priorityOrder[b.riskScore.priority] ?? 99)
    })
  }, [patients])

  const filtered = useMemo(() => {
    return sorted.filter(p => {
      if (search) {
        const q = search.toLowerCase()
        if (!`${p.id}`.includes(q) && !p.bedId.toLowerCase().includes(q)) return false
      }
      if (priorityFilter && p.riskScore.priority !== priorityFilter) return false
      if (statusFilter && p.activeAlert.status !== statusFilter) return false
      return true
    })
  }, [sorted, search, priorityFilter, statusFilter])

  const summary = useMemo(() => ({
    ...dashboardSummary,
    highPriority: patients.filter(p => p.riskScore.priority === 'high').length,
    mediumPriority: patients.filter(p => p.riskScore.priority === 'medium').length,
    lowPriority: patients.filter(p => p.riskScore.priority === 'low').length,
  }), [patients])

  const topCritical = filtered.filter(p => p.riskScore.priority === 'high' || p.riskScore.priority === 'medium' || p.riskScore.priority === 'info')

  const handleAction = (alertId: number, newStatus: PatientAlert['activeAlert']['status']) => {
    setPatients(prev => prev.map(p =>
      p.activeAlert.id === alertId
        ? { ...p, activeAlert: { ...p.activeAlert, status: newStatus } }
        : p
    ))
    if (selected && selected.activeAlert.id === alertId) {
      setSelected(prev => prev ? { ...prev, activeAlert: { ...prev.activeAlert, status: newStatus } } : null)
    }
  }

  return (
    <div className="min-h-screen bg-page dark:bg-page-dark">
      <Header nurseName="Priya" />

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">

        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Total Patients" value={summary.totalPatients} />
          <StatCard label="High Priority" value={summary.highPriority} variant="high" />
          <StatCard label="Medium Priority" value={summary.mediumPriority} variant="medium" />
          <StatCard label="Low Priority" value={summary.lowPriority} variant="low" />
          <StatCard label="Unacknowledged" value={dashboardSummary.unacknowledged} />
        </div>

        <FilterBar
          search={search} onSearchChange={setSearch}
          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
        />

        {topCritical.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-3">
              Top Critical {filtered.length > topCritical.length && `(${topCritical.length} of ${filtered.length})`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topCritical.slice(0, 4).map(p => (
                <PatientCard key={p.id} patient={p} onClick={setSelected} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-3">
            All Patients ({filtered.length})
          </h2>
          {filtered.length > 0 ? (
            <PatientTable patients={filtered} onSelect={setSelected} />
          ) : (
            <div className="rounded-lg border border-border dark:border-border-dark p-8 text-center">
              <p className="text-text-secondary dark:text-text-secondary-dark">No patients match your search or filters.</p>
            </div>
          )}
        </section>

      </main>

      {selected && (
        <PatientDetail
          patient={selected}
          onClose={() => setSelected(null)}
          onAccept={(id) => handleAction(id, 'in_progress')}
          onResolve={(id) => handleAction(id, 'resolved')}
          onEscalate={(id) => handleAction(id, 'escalated')}
        />
      )}
    </div>
  )
}
