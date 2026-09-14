import { useEffect, useState } from 'react'
import { subscribeToItinerary, subscribeToPlan, subscribeToPlanMembers } from '../../../services/plans/planService'

export function usePlanDetail(groupId, planId) {
  const [state, setState] = useState({ loading: true, error: null, plan: null, members: [], itinerary: [] })
  useEffect(() => {
    if (!groupId || !planId) return undefined
    const update = (patch) => setState((current) => ({ ...current, loading: false, error: null, ...patch }))
    const fail = (error) => setState((current) => ({ ...current, loading: false, error }))
    const stops = [subscribeToPlan(groupId, planId, (plan) => update({ plan }), fail), subscribeToPlanMembers(groupId, planId, (members) => update({ members }), fail), subscribeToItinerary(groupId, planId, (itinerary) => update({ itinerary }), fail)]
    return () => stops.forEach((stop) => stop())
  }, [groupId, planId])
  return state
}