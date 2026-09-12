import { useCallback, useEffect, useState } from 'react'
import { getDashboardSnapshot } from '../../../services/dashboard/dashboardService'

export function useDashboard(uid) {
  const [state, setState] = useState({ loading: true, error: null, data: null })
  const load = useCallback(async () => {
    if (!uid) return
    setState({ loading: true, error: null, data: null })
    try { setState({ loading: false, error: null, data: await getDashboardSnapshot(uid) }) } catch (error) { setState({ loading: false, error, data: null }) }
  }, [uid])
  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])
  return { ...state, retry: load }
}
