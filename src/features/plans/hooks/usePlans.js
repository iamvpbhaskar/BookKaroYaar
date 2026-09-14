import { useEffect, useState } from 'react'
import { subscribeToUserPlans, subscribeToGroupPlans } from '../../../services/plans/planService'

export function usePlans(uid) {
  const [state, setState] = useState({ loading: true, error: null, plans: [] })
  useEffect(() => {
    if (!uid) return undefined
    const stop = subscribeToUserPlans(uid, (plans) => setState({ loading: false, error: null, plans }), (error) => setState({ loading: false, error, plans: [] }))
    return stop
  }, [uid])
  return state
}

export function useGroupPlans(groupId) {
  const [state, setState] = useState({ loading: true, error: null, plans: [] })
  useEffect(() => {
    if (!groupId) return undefined
    const stop = subscribeToGroupPlans(groupId, (plans) => setState({ loading: false, error: null, plans }), (error) => setState({ loading: false, error, plans: [] }))
    return stop
  }, [groupId])
  return state
}
