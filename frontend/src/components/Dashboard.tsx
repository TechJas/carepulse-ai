import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAlerts, acknowledgeAlert, resolveAlert, escalateAlert, type AlertItem } from '../api/alerts'
import { getSummary, getTopCritical, type DashboardSummary, type TopCriticalPatient } from '../api/dashboard'
import { getPatientDetail, type PatientDetailResponse } from '../api/patients'
import { Header } from './Header'
import { StatCard } from './StatCard'
import { PatientCard } from './PatientCard'
import { PatientTable } from './PatientTable'
import { PatientDetail } from './PatientDetail'
import { FilterBar } from './FilterBar'

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, info: 3 }

export function Dashboard() {
  const { user, logout } = useAuth()

  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [topCritical, setTopCritical] = useState<TopCriticalPatient[]>([])
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<PatientDetailResponse | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const [alertsData, summaryData, criticalData] = await Promise.all([
        getAlerts({ limit: 50 }),
        getSummary(),
        getTopCritical(),
      ])
      setAlerts(alertsData.alerts)
      setSummary(summaryData as DashboardSummary)
      setTopCritical(criticalData.patients)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const sorted = useMemo(() => {
    return [...alerts].sort((a, b) => {
      const pa = priorityOrder[a.priority ?? 'low'] ?? 99
      const pb = priorityOrder[b.priority ?? 'low'] ?? 99
      return pa - pb
    })
  }, [alerts])

  const filtered = useMemo(() => {
    return sorted.filter(a => {
      if (search) {
        const q = search.toLowerCase()
        if (!`${a.patient_id}`.includes(q) && !(a.bed_id ?? '').toLowerCase().includes(q)) return false
      }
      if (priorityFilter && a.priority !== priorityFilter) return false
      if (statusFilter && a.status !== statusFilter) return false
      return true
    })
  }, [sorted, search, priorityFilter, statusFilter])

  const topCards = topCritical.filter(p => p.priority === 'high' || p.priority === 'medium')

  const handleSelectAlert = async (alertItem: AlertItem) => {
    setSelectedAlert(alertItem)
    setDetailLoading(true)
    try {
      const detail = await getPatientDetail(alertItem.patient_id)
      setSelectedDetail(detail as unknown as PatientDetailResponse)
    } catch {
      setSelectedDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleAction = async (alertId: number, action: 'accept' | 'resolve' | 'escalate') => {
    try {
      if (action === 'accept') await acknowledgeAlert(alertId)
      else if (action === 'resolve') await resolveAlert(alertId)
      else await escalateAlert(alertId)
      await fetchData()
      setSelectedAlert(null)
      setSelectedDetail(null)
    } catch (err) {
      console.error(err)
    }
  }

  const alertToPatientAlert = (a: AlertItem): any => ({
    id: a.patient_id,
    bedId: a.bed_id ?? '',
    name: a.patient_name ?? `Patient ${a.patient_id}`,
    age: 0,
    diagnosis: '',
    admitDate: '',
    status: 'active',
    currentVitals: {
      hr: 0, spo2: 0, systolicBp: 0, diastolicBp: 0, rr: 0, temperature: 0,
      ...(selectedDetail?.current_vitals ?? {}),
    },
    vitalsTrend: selectedDetail?.vitals_trend ?? { hr: [], spo2: [], systolicBp: [] },
    activeAlert: {
      id: a.id,
      patientId: a.patient_id,
      type: a.type as any,
      parameter: a.parameter,
      value: a.value ?? 0,
      threshold: a.threshold ?? 0,
      timestamp: a.timestamp,
      status: a.status as any,
    },
    riskScore: {
      alertId: a.id,
      score: a.risk_score ?? 0,
      confidence: 0,
      priority: (a.priority as any) ?? 'low',
      explanation: a.explanation ?? '',
    },
    assignedNurse: a.assigned_to?.name ?? undefined,
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page dark:bg-page-dark flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button onClick={fetchData} className="rounded-lg bg-accent text-white px-4 py-2 text-sm font-medium hover:brightness-110">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page dark:bg-page-dark">
      <Header nurseName={user?.name ?? 'Nurse'} onLogout={logout} />

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">

        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Total Patients" value={summary?.total_patients ?? 0} />
          <StatCard label="High Priority" value={summary?.high_priority ?? 0} variant="high" />
          <StatCard label="Medium Priority" value={summary?.medium_priority ?? 0} variant="medium" />
          <StatCard label="Low Priority" value={summary?.low_priority ?? 0} variant="low" />
          <StatCard label="Unacknowledged" value={summary?.unacknowledged ?? 0} />
        </div>

        <FilterBar
          search={search} onSearchChange={setSearch}
          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
        />

        {topCards.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-3">
              Top Critical {filtered.length > topCards.length && `(${topCards.length} of ${filtered.length})`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topCards.slice(0, 4).map(p => {
                const alert = alerts.find(a => a.patient_id === p.id)
                if (!alert) return null
                return (
                  <PatientCard
                    key={p.id}
                    patient={alertToPatientAlert(alert)}
                    onClick={() => handleSelectAlert(alert)}
                  />
                )
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark mb-3">
            All Patients ({alerts.length})
          </h2>
          <PatientTable
            patients={filtered.map(alertToPatientAlert)}
            onSelect={(p) => {
              const alert = alerts.find(a => a.patient_id === p.id)
              if (alert) handleSelectAlert(alert)
            }}
          />
        </section>

      </main>

      {selectedAlert && (
        <PatientDetail
          patient={alertToPatientAlert(selectedAlert)}
          loading={detailLoading}
          onClose={() => { setSelectedAlert(null); setSelectedDetail(null) }}
          onAccept={(id) => handleAction(id, 'accept')}
          onResolve={(id) => handleAction(id, 'resolve')}
          onEscalate={(id) => handleAction(id, 'escalate')}
          patientVitals={selectedDetail?.current_vitals ?? null}
          patientTrend={selectedDetail?.vitals_trend ?? null}
        />
      )}
    </div>
  )
}
