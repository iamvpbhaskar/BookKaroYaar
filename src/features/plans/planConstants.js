export const PLAN_TYPES = { TRIP: 'trip', MOVIE: 'movie', DINNER: 'dinner', EVENT: 'event', OTHER: 'other' }
export const PLAN_TYPE_LABELS = { trip: 'Trip', movie: 'Movie', dinner: 'Dinner', event: 'Event', other: 'Other' }
export const PLAN_STATUSES = { DRAFT: 'draft', ACTIVE: 'active', COMPLETED: 'completed', CANCELLED: 'cancelled' }
export const PLAN_STATUS_LABELS = { draft: 'Draft', active: 'Active', completed: 'Completed', cancelled: 'Cancelled' }
export const PLAN_ROLES = { ORGANIZER: 'organizer', PARTICIPANT: 'participant' }
export const PLAN_TYPE_OPTIONS = Object.entries(PLAN_TYPE_LABELS).map(([value, label]) => ({ value, label }))