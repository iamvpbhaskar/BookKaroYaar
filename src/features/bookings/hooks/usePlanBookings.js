import { useEffect, useState } from 'react'
import { subscribeToPlanBookings } from '../../../services/bookings/bookingService'

export function usePlanBookings(groupId, planId) {
  const [state, setState] = useState({ loading: true, error: null, bookings: [] })
  useEffect(() => {
    if (!groupId || !planId) return undefined
    const stop = subscribeToPlanBookings(groupId, planId, (bookings) => setState({ loading: false, error: null, bookings }), (error) => setState({ loading: false, error, bookings: [] }))
    return stop
  }, [groupId, planId])
  return state
}